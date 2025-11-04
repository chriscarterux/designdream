-- Enhanced SLA Tracking Migration
-- Adds improved triggers, functions, and monitoring capabilities

-- =============================================================================
-- ENHANCED FUNCTIONS
-- =============================================================================

-- Function to get current business hours elapsed for an active SLA
CREATE OR REPLACE FUNCTION get_current_business_hours_elapsed(
  p_sla_id uuid
) RETURNS numeric AS $$
DECLARE
  v_started_at timestamp with time zone;
  v_paused_at timestamp with time zone;
  v_status text;
  v_end_time timestamp with time zone;
BEGIN
  -- Get SLA record details
  SELECT started_at, paused_at, status
  INTO v_started_at, v_paused_at, v_status
  FROM sla_records
  WHERE id = p_sla_id;

  -- Determine end time based on status
  IF v_status = 'paused' THEN
    v_end_time := v_paused_at;
  ELSE
    v_end_time := now();
  END IF;

  -- Calculate business hours
  RETURN calculate_business_hours(v_started_at, v_end_time);
END;
$$ LANGUAGE plpgsql;

-- Function to check SLA status and create notifications
CREATE OR REPLACE FUNCTION check_sla_violations()
RETURNS void AS $$
DECLARE
  v_sla_record RECORD;
  v_client_id uuid;
  v_admin_id uuid;
  v_business_hours numeric;
  v_hours_remaining numeric;
BEGIN
  -- Loop through all active SLA records
  FOR v_sla_record IN
    SELECT sr.*, r.client_id, r.title as request_title
    FROM sla_records sr
    JOIN requests r ON r.id = sr.request_id
    WHERE sr.status = 'active'
  LOOP
    -- Calculate current business hours elapsed
    v_business_hours := get_current_business_hours_elapsed(v_sla_record.id);
    v_hours_remaining := v_sla_record.target_hours - v_business_hours;

    -- Check for SLA violation (>= 48 hours)
    IF v_hours_remaining <= 0 THEN
      -- Update SLA record to violated
      UPDATE sla_records
      SET
        status = 'violated',
        business_hours_elapsed = v_business_hours,
        violation_severity = 'major',
        violation_reason = 'SLA deadline exceeded',
        updated_at = now()
      WHERE id = v_sla_record.id;

      -- Create notification for client
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        action_url,
        action_label
      )
      SELECT
        c.auth_user_id,
        'SLA Deadline Exceeded',
        'Request "' || v_sla_record.request_title || '" has exceeded the 48-hour SLA deadline.',
        'sla_warning',
        '/dashboard/requests/' || v_sla_record.request_id,
        'View Request'
      FROM clients c
      WHERE c.id = v_sla_record.client_id;

      -- Create notification for admins
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        action_url,
        action_label
      )
      SELECT
        au.auth_user_id,
        'SLA VIOLATED',
        'Request "' || v_sla_record.request_title || '" has violated the SLA deadline!',
        'sla_warning',
        '/admin/requests/' || v_sla_record.request_id,
        'View Request'
      FROM admin_users au
      WHERE au.status = 'active';

    -- Check for yellow warning (12 hours or less remaining)
    ELSIF v_hours_remaining <= 12 AND v_hours_remaining > 6 THEN
      -- Create warning notification if not already sent
      IF NOT EXISTS (
        SELECT 1 FROM notifications
        WHERE metadata->>'sla_warning_type' = 'yellow'
        AND metadata->>'request_id' = v_sla_record.request_id::text
        AND created_at > now() - interval '24 hours'
      ) THEN
        -- Notify admins of approaching deadline
        INSERT INTO notifications (
          user_id,
          title,
          message,
          type,
          action_url,
          action_label,
          metadata
        )
        SELECT
          au.auth_user_id,
          'SLA Warning: ' || v_sla_record.request_title,
          'Only ' || v_hours_remaining::text || ' business hours remaining until SLA deadline.',
          'sla_warning',
          '/admin/requests/' || v_sla_record.request_id,
          'View Request',
          jsonb_build_object(
            'sla_warning_type', 'yellow',
            'request_id', v_sla_record.request_id,
            'hours_remaining', v_hours_remaining
          )
        FROM admin_users au
        WHERE au.status = 'active';
      END IF;

    -- Check for red alert (6 hours or less remaining)
    ELSIF v_hours_remaining <= 6 AND v_hours_remaining > 0 THEN
      -- Create critical warning notification if not already sent
      IF NOT EXISTS (
        SELECT 1 FROM notifications
        WHERE metadata->>'sla_warning_type' = 'red'
        AND metadata->>'request_id' = v_sla_record.request_id::text
        AND created_at > now() - interval '24 hours'
      ) THEN
        -- Notify admins of critical deadline
        INSERT INTO notifications (
          user_id,
          title,
          message,
          type,
          action_url,
          action_label,
          metadata
        )
        SELECT
          au.auth_user_id,
          'URGENT: SLA Deadline Approaching',
          'CRITICAL: Only ' || v_hours_remaining::text || ' business hours left for "' || v_sla_record.request_title || '"!',
          'sla_warning',
          '/admin/requests/' || v_sla_record.request_id,
          'View Request',
          jsonb_build_object(
            'sla_warning_type', 'red',
            'request_id', v_sla_record.request_id,
            'hours_remaining', v_hours_remaining
          )
        FROM admin_users au
        WHERE au.status = 'active';
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enhanced update_sla_status function with better tracking
CREATE OR REPLACE FUNCTION update_sla_status()
RETURNS trigger AS $$
DECLARE
  v_existing_sla_id uuid;
BEGIN
  -- Check if request moved to in_progress from another status
  IF NEW.status = 'in_progress' AND (OLD.status IS NULL OR OLD.status != 'in_progress') THEN
    -- Check if SLA record already exists
    SELECT id INTO v_existing_sla_id
    FROM sla_records
    WHERE request_id = NEW.id
    AND status IN ('active', 'paused');

    -- Only create new SLA record if one doesn't exist
    IF v_existing_sla_id IS NULL THEN
      INSERT INTO sla_records (
        request_id,
        started_at,
        status,
        target_hours
      )
      VALUES (
        NEW.id,
        now(),
        'active',
        48 -- Default 48-hour SLA
      );
    ELSE
      -- Resume existing paused SLA
      UPDATE sla_records
      SET
        status = 'active',
        resumed_at = now(),
        updated_at = now()
      WHERE id = v_existing_sla_id
      AND status = 'paused';
    END IF;

  -- Check if request moved to blocked status
  ELSIF NEW.status = 'blocked' AND OLD.status = 'in_progress' THEN
    -- Pause the SLA timer
    UPDATE sla_records
    SET
      status = 'paused',
      paused_at = now(),
      updated_at = now(),
      metadata = metadata || jsonb_build_object(
        'auto_paused', true,
        'pause_reason', 'Request blocked'
      )
    WHERE request_id = NEW.id
    AND status = 'active';

  -- Check if request moved from blocked back to in_progress
  ELSIF NEW.status = 'in_progress' AND OLD.status = 'blocked' THEN
    -- Resume the SLA timer
    UPDATE sla_records
    SET
      status = 'active',
      resumed_at = now(),
      pause_duration_hours = COALESCE(pause_duration_hours, 0) +
        EXTRACT(EPOCH FROM (now() - paused_at)) / 3600,
      updated_at = now()
    WHERE request_id = NEW.id
    AND status = 'paused';

  -- Check if request completed
  ELSIF NEW.status = 'done' AND OLD.status != 'done' THEN
    -- Update SLA record as completed
    UPDATE sla_records
    SET
      completed_at = now(),
      business_hours_elapsed = calculate_business_hours(started_at, now()),
      total_elapsed_hours = EXTRACT(EPOCH FROM (now() - started_at)) / 3600,
      status = CASE
        WHEN calculate_business_hours(started_at, now()) <= target_hours THEN 'met'
        ELSE 'violated'
      END,
      violation_reason = CASE
        WHEN calculate_business_hours(started_at, now()) > target_hours
        THEN 'Exceeded ' || target_hours || ' hour deadline'
        ELSE NULL
      END,
      violation_severity = CASE
        WHEN calculate_business_hours(started_at, now()) > target_hours
        THEN 'major'
        ELSE NULL
      END,
      updated_at = now()
    WHERE request_id = NEW.id
    AND status IN ('active', 'paused');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger to use enhanced function
DROP TRIGGER IF EXISTS update_sla_on_status_change ON requests;
CREATE TRIGGER update_sla_on_status_change
  AFTER UPDATE OF status ON requests
  FOR EACH ROW
  EXECUTE FUNCTION update_sla_status();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- View for at-risk SLAs (approaching deadline)
CREATE OR REPLACE VIEW sla_at_risk AS
SELECT
  sr.id as sla_id,
  sr.request_id,
  r.title as request_title,
  r.client_id,
  c.company_name,
  sr.started_at,
  sr.target_hours,
  sr.business_hours_elapsed,
  (sr.target_hours - COALESCE(sr.business_hours_elapsed, 0)) as hours_remaining,
  sr.status,
  CASE
    WHEN (sr.target_hours - COALESCE(sr.business_hours_elapsed, 0)) <= 0 THEN 'red'
    WHEN (sr.target_hours - COALESCE(sr.business_hours_elapsed, 0)) <= 12 THEN 'yellow'
    ELSE 'green'
  END as warning_level
FROM sla_records sr
JOIN requests r ON r.id = sr.request_id
JOIN clients c ON c.id = r.client_id
WHERE sr.status = 'active'
ORDER BY hours_remaining ASC;

-- View for SLA metrics by client
CREATE OR REPLACE VIEW sla_metrics_by_client AS
SELECT
  c.id as client_id,
  c.company_name,
  COUNT(*) as total_completed_requests,
  COUNT(*) FILTER (WHERE sr.status = 'met') as sla_met_count,
  COUNT(*) FILTER (WHERE sr.status = 'violated') as sla_violated_count,
  ROUND(AVG(sr.business_hours_elapsed), 2) as avg_completion_hours,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE sr.status = 'met') / NULLIF(COUNT(*), 0),
    2
  ) as sla_adherence_percent,
  COUNT(*) FILTER (
    WHERE sr.status = 'active'
    AND (sr.target_hours - COALESCE(sr.business_hours_elapsed, 0)) <= 12
  ) as current_at_risk_count
FROM clients c
LEFT JOIN requests r ON r.client_id = c.id
LEFT JOIN sla_records sr ON sr.request_id = r.id
WHERE sr.id IS NOT NULL
GROUP BY c.id, c.company_name
ORDER BY sla_adherence_percent DESC;

-- View for real-time SLA dashboard
CREATE OR REPLACE VIEW sla_dashboard AS
SELECT
  sr.id as sla_id,
  sr.request_id,
  r.title as request_title,
  r.priority,
  r.type as request_type,
  r.client_id,
  c.company_name,
  r.assigned_to,
  au.name as assigned_to_name,
  sr.started_at,
  sr.target_hours,
  get_current_business_hours_elapsed(sr.id) as current_hours_elapsed,
  (sr.target_hours - get_current_business_hours_elapsed(sr.id)) as hours_remaining,
  ROUND(
    100.0 * get_current_business_hours_elapsed(sr.id) / sr.target_hours,
    1
  ) as completion_percentage,
  CASE
    WHEN (sr.target_hours - get_current_business_hours_elapsed(sr.id)) <= 0 THEN 'red'
    WHEN (sr.target_hours - get_current_business_hours_elapsed(sr.id)) <= 12 THEN 'yellow'
    ELSE 'green'
  END as warning_level,
  sr.status,
  sr.paused_at
FROM sla_records sr
JOIN requests r ON r.id = sr.request_id
JOIN clients c ON c.id = r.client_id
LEFT JOIN admin_users au ON au.id = r.assigned_to
WHERE sr.status IN ('active', 'paused')
ORDER BY
  CASE
    WHEN (sr.target_hours - get_current_business_hours_elapsed(sr.id)) <= 0 THEN 1
    WHEN (sr.target_hours - get_current_business_hours_elapsed(sr.id)) <= 12 THEN 2
    ELSE 3
  END,
  hours_remaining ASC;

-- =============================================================================
-- INDEXES (Additional)
-- =============================================================================

-- Add composite index for faster SLA lookups
CREATE INDEX IF NOT EXISTS idx_sla_records_request_status
  ON sla_records(request_id, status);

-- Add index for time-based queries
CREATE INDEX IF NOT EXISTS idx_sla_records_started_status
  ON sla_records(started_at DESC, status);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON FUNCTION get_current_business_hours_elapsed IS
  'Calculate current business hours elapsed for an active or paused SLA';

COMMENT ON FUNCTION check_sla_violations IS
  'Check all active SLAs and create notifications for warnings and violations';

COMMENT ON VIEW sla_at_risk IS
  'Shows all active SLAs that are at risk of violation';

COMMENT ON VIEW sla_metrics_by_client IS
  'SLA performance metrics aggregated by client';

COMMENT ON VIEW sla_dashboard IS
  'Real-time SLA monitoring dashboard with current status and warnings';
