-- Webhook Security Improvements Migration
-- Adds replay protection, dead letter queue, and event expiry mechanism

-- =============================================================================
-- ADD TIMESTAMP FIELD TO WEBHOOK_EVENTS
-- =============================================================================
-- Store the event creation timestamp from Stripe for replay attack prevention

ALTER TABLE webhook_events
  ADD COLUMN event_timestamp timestamp with time zone,
  ADD COLUMN received_at timestamp with time zone DEFAULT now();

COMMENT ON COLUMN webhook_events.event_timestamp IS 'Stripe event creation timestamp (from event.created)';
COMMENT ON COLUMN webhook_events.received_at IS 'When we received the webhook event';

-- Index for timestamp-based queries
CREATE INDEX idx_webhook_events_event_timestamp ON webhook_events(event_timestamp);
CREATE INDEX idx_webhook_events_received_at ON webhook_events(received_at);

-- =============================================================================
-- WEBHOOK FAILURES TABLE (Dead Letter Queue)
-- =============================================================================
-- Store failed webhook events for manual review and retry

CREATE TABLE webhook_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event Details
  stripe_event_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,

  -- Failure Details
  failure_reason text NOT NULL,
  error_message text,
  stack_trace text,

  -- Retry Information
  retry_count integer DEFAULT 0,
  last_retry_at timestamp with time zone,
  next_retry_at timestamp with time zone,
  max_retries integer DEFAULT 5,

  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'retrying', 'resolved', 'abandoned')),
  resolved_at timestamp with time zone,
  resolution_notes text,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_webhook_failures_stripe_event_id ON webhook_failures(stripe_event_id);
CREATE INDEX idx_webhook_failures_status ON webhook_failures(status);
CREATE INDEX idx_webhook_failures_next_retry_at ON webhook_failures(next_retry_at) WHERE status = 'pending';
CREATE INDEX idx_webhook_failures_created_at ON webhook_failures(created_at DESC);

COMMENT ON TABLE webhook_failures IS 'Dead letter queue for failed webhook events requiring manual review';

-- =============================================================================
-- WEBHOOK PROCESSING METRICS
-- =============================================================================
-- Track processing performance and detect anomalies

CREATE TABLE webhook_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Time Period
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,

  -- Processing Metrics
  total_events integer DEFAULT 0,
  successful_events integer DEFAULT 0,
  failed_events integer DEFAULT 0,
  replay_attempts integer DEFAULT 0,
  expired_events integer DEFAULT 0,

  -- Performance Metrics
  avg_processing_time_ms integer,
  max_processing_time_ms integer,
  min_processing_time_ms integer,

  -- Event Type Breakdown
  event_type_counts jsonb DEFAULT '{}',

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT unique_webhook_metric_period UNIQUE (period_start, period_end)
);

CREATE INDEX idx_webhook_metrics_period_start ON webhook_metrics(period_start DESC);

COMMENT ON TABLE webhook_metrics IS 'Aggregated metrics for webhook processing monitoring';

-- =============================================================================
-- HELPER FUNCTIONS FOR REPLAY PROTECTION
-- =============================================================================

-- Function to check if event is too old (replay attack prevention)
CREATE OR REPLACE FUNCTION is_webhook_event_expired(event_created_timestamp integer)
RETURNS boolean AS $$
DECLARE
  event_time timestamp with time zone;
  age_minutes integer;
BEGIN
  -- Convert Unix timestamp to PostgreSQL timestamp
  event_time := to_timestamp(event_created_timestamp);

  -- Calculate age in minutes
  age_minutes := EXTRACT(EPOCH FROM (now() - event_time)) / 60;

  -- Reject events older than 5 minutes
  RETURN age_minutes > 5;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION is_webhook_event_expired IS 'Check if webhook event is older than 5 minutes (replay protection)';

-- Function to record webhook event with idempotency check
CREATE OR REPLACE FUNCTION record_webhook_event(
  p_stripe_event_id text,
  p_event_type text,
  p_event_timestamp integer,
  p_payload jsonb
)
RETURNS TABLE(
  is_duplicate boolean,
  event_id uuid
) AS $$
DECLARE
  v_event_id uuid;
  v_is_duplicate boolean := false;
  v_event_time timestamp with time zone;
BEGIN
  -- Convert Unix timestamp to PostgreSQL timestamp
  v_event_time := to_timestamp(p_event_timestamp);

  -- Check if event already exists
  SELECT id INTO v_event_id
  FROM webhook_events
  WHERE stripe_event_id = p_stripe_event_id;

  IF v_event_id IS NOT NULL THEN
    -- Event already processed (replay attack or duplicate)
    v_is_duplicate := true;
  ELSE
    -- Insert new event
    INSERT INTO webhook_events (
      stripe_event_id,
      event_type,
      event_timestamp,
      payload,
      processed,
      received_at
    ) VALUES (
      p_stripe_event_id,
      p_event_type,
      v_event_time,
      p_payload,
      false,
      now()
    )
    RETURNING id INTO v_event_id;
  END IF;

  RETURN QUERY SELECT v_is_duplicate, v_event_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION record_webhook_event IS 'Record webhook event with automatic duplicate detection';

-- Function to mark event as processed
CREATE OR REPLACE FUNCTION mark_webhook_event_processed(
  p_event_id uuid,
  p_error_message text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE webhook_events
  SET
    processed = true,
    processed_at = now(),
    error_message = p_error_message,
    retry_count = retry_count + 1
  WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mark_webhook_event_processed IS 'Mark webhook event as processed';

-- Function to log failed webhook to dead letter queue
CREATE OR REPLACE FUNCTION log_webhook_failure(
  p_stripe_event_id text,
  p_event_type text,
  p_payload jsonb,
  p_failure_reason text,
  p_error_message text,
  p_stack_trace text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_failure_id uuid;
  v_next_retry timestamp with time zone;
BEGIN
  -- Calculate next retry time (exponential backoff: 5 minutes)
  v_next_retry := now() + interval '5 minutes';

  INSERT INTO webhook_failures (
    stripe_event_id,
    event_type,
    payload,
    failure_reason,
    error_message,
    stack_trace,
    retry_count,
    next_retry_at,
    status
  ) VALUES (
    p_stripe_event_id,
    p_event_type,
    p_payload,
    p_failure_reason,
    p_error_message,
    p_stack_trace,
    0,
    v_next_retry,
    'pending'
  )
  RETURNING id INTO v_failure_id;

  RETURN v_failure_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION log_webhook_failure IS 'Log failed webhook event to dead letter queue';

-- Function to retry failed webhook
CREATE OR REPLACE FUNCTION retry_webhook_failure(p_failure_id uuid)
RETURNS void AS $$
DECLARE
  v_retry_count integer;
  v_next_retry timestamp with time zone;
BEGIN
  -- Get current retry count
  SELECT retry_count INTO v_retry_count
  FROM webhook_failures
  WHERE id = p_failure_id;

  -- Calculate next retry time with exponential backoff
  -- 5 min, 10 min, 20 min, 40 min, 80 min
  v_next_retry := now() + (interval '5 minutes' * power(2, v_retry_count));

  -- Update retry information
  UPDATE webhook_failures
  SET
    retry_count = retry_count + 1,
    last_retry_at = now(),
    next_retry_at = CASE
      WHEN retry_count + 1 >= max_retries THEN NULL
      ELSE v_next_retry
    END,
    status = CASE
      WHEN retry_count + 1 >= max_retries THEN 'abandoned'
      ELSE 'retrying'
    END,
    updated_at = now()
  WHERE id = p_failure_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION retry_webhook_failure IS 'Update retry information for failed webhook';

-- =============================================================================
-- CLEANUP FUNCTIONS
-- =============================================================================

-- Function to clean up old webhook events (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_events()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM webhook_events
  WHERE created_at < now() - interval '30 days'
  AND processed = true;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_webhook_events IS 'Delete processed webhook events older than 30 days';

-- Function to clean up resolved webhook failures (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_failures()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM webhook_failures
  WHERE status IN ('resolved', 'abandoned')
  AND created_at < now() - interval '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_webhook_failures IS 'Delete resolved/abandoned webhook failures older than 90 days';

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- WEBHOOK_FAILURES (admin only)
ALTER TABLE webhook_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all webhook failures"
  ON webhook_failures FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update webhook failures"
  ON webhook_failures FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- WEBHOOK_METRICS (admin only)
ALTER TABLE webhook_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view webhook metrics"
  ON webhook_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Failed Webhooks View (for monitoring dashboard)
CREATE VIEW failed_webhooks_summary AS
SELECT
  wf.id,
  wf.stripe_event_id,
  wf.event_type,
  wf.failure_reason,
  wf.error_message,
  wf.retry_count,
  wf.max_retries,
  wf.status,
  wf.next_retry_at,
  wf.created_at,
  CASE
    WHEN wf.status = 'abandoned' THEN 'failed_permanently'
    WHEN wf.next_retry_at < now() THEN 'ready_for_retry'
    WHEN wf.status = 'pending' THEN 'awaiting_retry'
    WHEN wf.status = 'resolved' THEN 'resolved'
    ELSE 'unknown'
  END as retry_status
FROM webhook_failures wf
WHERE wf.status IN ('pending', 'retrying', 'abandoned')
ORDER BY wf.created_at DESC;

COMMENT ON VIEW failed_webhooks_summary IS 'Summary of failed webhooks for monitoring';

-- Webhook Processing Health View
CREATE VIEW webhook_processing_health AS
SELECT
  date_trunc('hour', created_at) as hour,
  COUNT(*) as total_events,
  COUNT(*) FILTER (WHERE processed = true AND error_message IS NULL) as successful,
  COUNT(*) FILTER (WHERE error_message IS NOT NULL) as failed,
  COUNT(*) FILTER (WHERE processed = false) as pending,
  ROUND(AVG(EXTRACT(EPOCH FROM (processed_at - received_at)) * 1000)) as avg_processing_time_ms
FROM webhook_events
WHERE created_at >= now() - interval '24 hours'
GROUP BY date_trunc('hour', created_at)
ORDER BY hour DESC;

COMMENT ON VIEW webhook_processing_health IS 'Hourly webhook processing health metrics';

-- Replay Attempts View
CREATE VIEW webhook_replay_attempts AS
SELECT
  we.stripe_event_id,
  we.event_type,
  COUNT(*) as attempt_count,
  MIN(we.received_at) as first_attempt,
  MAX(we.received_at) as last_attempt,
  MAX(we.received_at) - MIN(we.received_at) as time_span
FROM webhook_events we
GROUP BY we.stripe_event_id, we.event_type
HAVING COUNT(*) > 1
ORDER BY last_attempt DESC;

COMMENT ON VIEW webhook_replay_attempts IS 'Detected replay attempts (duplicate event IDs)';

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update webhook_failures updated_at timestamp
CREATE OR REPLACE FUNCTION update_webhook_failure_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER webhook_failures_updated_at
  BEFORE UPDATE ON webhook_failures
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_failure_updated_at();

-- =============================================================================
-- SCHEDULED CLEANUP (requires pg_cron extension)
-- =============================================================================
-- Note: Uncomment these if pg_cron is available in your Supabase instance

-- SELECT cron.schedule(
--   'cleanup-old-webhook-events',
--   '0 2 * * *', -- Run daily at 2 AM
--   $$ SELECT cleanup_old_webhook_events(); $$
-- );

-- SELECT cron.schedule(
--   'cleanup-old-webhook-failures',
--   '0 3 * * 0', -- Run weekly on Sunday at 3 AM
--   $$ SELECT cleanup_old_webhook_failures(); $$
-- );

-- =============================================================================
-- SAMPLE QUERIES FOR MONITORING
-- =============================================================================

-- Check for replay attacks in last 24 hours
-- SELECT * FROM webhook_replay_attempts WHERE last_attempt >= now() - interval '24 hours';

-- View webhook processing health
-- SELECT * FROM webhook_processing_health;

-- Check failed webhooks ready for retry
-- SELECT * FROM failed_webhooks_summary WHERE retry_status = 'ready_for_retry';

-- Count events by type in last 24 hours
-- SELECT event_type, COUNT(*) as count
-- FROM webhook_events
-- WHERE created_at >= now() - interval '24 hours'
-- GROUP BY event_type
-- ORDER BY count DESC;
