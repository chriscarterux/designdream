-- Add Stripe Customer ID to clients table for webhook lookups
-- This allows us to look up clients directly from Stripe webhooks
-- without needing to join through the subscriptions table

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE;

-- Create index for fast lookups by Stripe customer ID
CREATE INDEX IF NOT EXISTS idx_clients_stripe_customer_id
  ON clients(stripe_customer_id);

-- Update subscription_status field to match Stripe subscription states
-- (this field was referenced in webhook code but not in the original schema)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS subscription_status text
  CHECK (subscription_status IN ('active', 'trialing', 'paused', 'past_due', 'cancelled', 'unpaid'));

-- Migrate existing data: copy stripe_customer_id from subscriptions to clients
UPDATE clients c
SET stripe_customer_id = s.stripe_customer_id
FROM subscriptions s
WHERE c.id = s.client_id
  AND c.stripe_customer_id IS NULL
  AND s.stripe_customer_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN clients.stripe_customer_id IS
  'Stripe customer ID for webhook lookups and billing integration';

COMMENT ON COLUMN clients.subscription_status IS
  'Current subscription status from Stripe, synced via webhooks';
