-- Stripe Webhooks Migration
-- Adds webhook_events and payment_events tables, updates subscriptions table

-- =============================================================================
-- WEBHOOK EVENTS LOG
-- =============================================================================
-- Store all webhook events for debugging, audit trail, and idempotency

CREATE TABLE webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event Details
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,

  -- Processing Status
  processed boolean DEFAULT false,
  error_message text,
  retry_count integer DEFAULT 0,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- =============================================================================
-- PAYMENT EVENTS
-- =============================================================================
-- Track all payment attempts (success and failures)

CREATE TABLE payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stripe References
  invoice_id text NOT NULL,
  subscription_id text,
  customer_id text NOT NULL,
  payment_intent_id text,

  -- Payment Details
  amount_paid integer NOT NULL, -- in cents
  currency text NOT NULL,
  status text NOT NULL CHECK (status IN ('succeeded', 'failed')),

  -- Error Details (if failed)
  error_message text,
  error_code text,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_payment_events_subscription_id ON payment_events(subscription_id);
CREATE INDEX idx_payment_events_customer_id ON payment_events(customer_id);
CREATE INDEX idx_payment_events_status ON payment_events(status);
CREATE INDEX idx_payment_events_created_at ON payment_events(created_at DESC);

-- =============================================================================
-- UPDATE EXISTING SUBSCRIPTIONS TABLE
-- =============================================================================
-- Add fields needed for webhook processing if they don't exist

-- Add subscription status tracking (uses existing status field)
-- Update status constraint to match Stripe's status values
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_status_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_status_check
  CHECK (status IN (
    'active',
    'trialing',
    'paused',
    'past_due',
    'canceled',
    'cancelled', -- Keep both spellings for backward compatibility
    'unpaid',
    'incomplete',
    'incomplete_expired'
  ));

-- Add user_id reference to subscriptions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions'
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
  END IF;
END $$;

-- Add subscription_status to clients table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients'
    AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE clients ADD COLUMN subscription_status text;
  END IF;
END $$;

-- Add stripe_customer_id to clients if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients'
    AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE clients ADD COLUMN stripe_customer_id text UNIQUE;
    CREATE INDEX idx_clients_stripe_customer_id ON clients(stripe_customer_id);
  END IF;
END $$;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- WEBHOOK_EVENTS (admin only)
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all webhook events"
  ON webhook_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- PAYMENT_EVENTS
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own payment events"
  ON payment_events FOR SELECT
  USING (
    customer_id IN (
      SELECT stripe_customer_id FROM clients
      WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payment events"
  ON payment_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to check if webhook event was already processed (idempotency)
CREATE OR REPLACE FUNCTION is_webhook_event_processed(event_id text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM webhook_events
    WHERE stripe_event_id = event_id
    AND processed = true
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get user by stripe customer ID
CREATE OR REPLACE FUNCTION get_user_by_stripe_customer(customer_id text)
RETURNS uuid AS $$
DECLARE
  user_id uuid;
BEGIN
  SELECT auth_user_id INTO user_id
  FROM clients
  WHERE stripe_customer_id = customer_id;

  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Recent Webhook Events View (for debugging)
CREATE VIEW recent_webhook_events AS
SELECT
  id,
  stripe_event_id,
  event_type,
  processed,
  error_message,
  created_at,
  processed_at
FROM webhook_events
ORDER BY created_at DESC
LIMIT 100;

-- Payment Activity View
CREATE VIEW payment_activity AS
SELECT
  pe.id,
  pe.invoice_id,
  pe.subscription_id,
  pe.customer_id,
  c.company_name,
  pe.amount_paid / 100.0 as amount_dollars,
  pe.currency,
  pe.status,
  pe.error_message,
  pe.created_at
FROM payment_events pe
LEFT JOIN clients c ON c.stripe_customer_id = pe.customer_id
ORDER BY pe.created_at DESC;

-- Subscription Health View
CREATE VIEW subscription_health AS
SELECT
  s.id,
  s.client_id,
  c.company_name,
  c.email,
  s.stripe_subscription_id,
  s.status,
  s.plan_type,
  s.plan_amount / 100.0 as monthly_amount,
  s.current_period_end,
  s.cancel_at_period_end,
  s.cancelled_at,
  CASE
    WHEN s.status = 'active' THEN 'healthy'
    WHEN s.status = 'past_due' THEN 'needs_attention'
    WHEN s.status IN ('canceled', 'cancelled') THEN 'churned'
    ELSE 'unknown'
  END as health_status,
  (
    SELECT COUNT(*)
    FROM payment_events pe
    WHERE pe.subscription_id = s.stripe_subscription_id
    AND pe.status = 'failed'
    AND pe.created_at >= now() - interval '30 days'
  ) as failed_payments_last_30_days
FROM subscriptions s
LEFT JOIN clients c ON c.id = s.client_id;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update webhook processed_at timestamp
CREATE OR REPLACE FUNCTION update_webhook_processed_at()
RETURNS trigger AS $$
BEGIN
  IF NEW.processed = true AND OLD.processed = false THEN
    NEW.processed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER webhook_events_processed_at
  BEFORE UPDATE ON webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_processed_at();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE webhook_events IS 'Stores all Stripe webhook events for audit trail and idempotency';
COMMENT ON TABLE payment_events IS 'Tracks all payment attempts (successes and failures)';
COMMENT ON FUNCTION is_webhook_event_processed IS 'Check if a webhook event has already been processed';
COMMENT ON FUNCTION get_user_by_stripe_customer IS 'Get user ID from Stripe customer ID';
