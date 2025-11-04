-- Email Notifications Migration
-- Adds email preferences and delivery tracking

-- =============================================================================
-- EMAIL PREFERENCES TABLE
-- =============================================================================

CREATE TABLE email_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Global email toggle
  email_enabled boolean DEFAULT true,

  -- Specific notification types
  sla_warnings boolean DEFAULT true,
  status_updates boolean DEFAULT true,
  comments boolean DEFAULT true,
  marketing boolean DEFAULT false,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_email_preferences_user_id ON email_preferences(user_id);

-- Enable RLS
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own preferences
CREATE POLICY "Users can view own email preferences"
  ON email_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own email preferences"
  ON email_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email preferences"
  ON email_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- EMAIL DELIVERY LOG TABLE
-- =============================================================================

CREATE TABLE email_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email details
  email text NOT NULL,
  email_type text NOT NULL,

  -- Delivery status
  status text NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),

  -- Resend integration
  resend_id text,

  -- Error tracking
  error text,

  -- Timestamps
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),

  -- Additional data
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_email_delivery_log_email ON email_delivery_log(email);
CREATE INDEX idx_email_delivery_log_type ON email_delivery_log(email_type);
CREATE INDEX idx_email_delivery_log_status ON email_delivery_log(status);
CREATE INDEX idx_email_delivery_log_created_at ON email_delivery_log(created_at DESC);
CREATE INDEX idx_email_delivery_log_resend_id ON email_delivery_log(resend_id) WHERE resend_id IS NOT NULL;

-- Enable RLS (admins only)
ALTER TABLE email_delivery_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email delivery log"
  ON email_delivery_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to create default email preferences for new users
CREATE OR REPLACE FUNCTION create_default_email_preferences()
RETURNS trigger AS $$
BEGIN
  INSERT INTO email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default preferences when a new user is created
CREATE TRIGGER create_email_preferences_on_user_creation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_email_preferences();

-- Function to update email preferences updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_preferences_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_preferences_timestamp
  BEFORE UPDATE ON email_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_email_preferences_updated_at();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Email delivery stats view
CREATE OR REPLACE VIEW email_delivery_stats AS
SELECT
  email_type,
  COUNT(*) as total_sent,
  COUNT(*) FILTER (WHERE status = 'sent') as successful,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) FILTER (WHERE status = 'bounced') as bounced,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE status = 'sent') / NULLIF(COUNT(*), 0),
    2
  ) as success_rate,
  MIN(created_at) as first_sent,
  MAX(created_at) as last_sent
FROM email_delivery_log
GROUP BY email_type
ORDER BY total_sent DESC;

-- Recent email activity view
CREATE OR REPLACE VIEW recent_email_activity AS
SELECT
  id,
  email,
  email_type,
  status,
  error,
  sent_at,
  created_at,
  metadata->>'subject' as subject,
  metadata->>'recipient_name' as recipient_name
FROM email_delivery_log
ORDER BY created_at DESC
LIMIT 100;

-- =============================================================================
-- SEED DEFAULT PREFERENCES FOR EXISTING USERS
-- =============================================================================

-- Insert default preferences for any existing users that don't have them
INSERT INTO email_preferences (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM email_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE email_preferences IS
  'User preferences for email notifications';

COMMENT ON TABLE email_delivery_log IS
  'Log of all email deliveries with status tracking';

COMMENT ON VIEW email_delivery_stats IS
  'Aggregated statistics on email delivery by type';

COMMENT ON VIEW recent_email_activity IS
  'Recent email delivery activity for monitoring';
