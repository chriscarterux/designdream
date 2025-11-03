-- Design Dreams Database Schema
-- Complete schema with all tables, RLS policies, functions, triggers, and views

-- Use built-in gen_random_uuid() instead of uuid-ossp extension (available in PostgreSQL 13+)

-- =============================================================================
-- TABLES
-- =============================================================================

-- 1. CLIENTS
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Authentication (synced from Supabase Auth)
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,

  -- Company Details
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_phone text,

  -- Onboarding Data
  industry text,
  target_customer text,
  tech_stack jsonb DEFAULT '{}',
  brand_assets jsonb DEFAULT '{}',  -- {logo_url, colors[], fonts[], style_guide_url}

  -- Integrations
  basecamp_project_id text UNIQUE,
  github_org text,

  -- Status
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'churned', 'trial')),

  -- Timestamps
  onboarded_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_auth_user_id ON clients(auth_user_id);

-- 2. ADMIN_USERS (create before other tables for RLS policies)
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Profile
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  avatar_url text,

  -- Role
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'support')),

  -- Status
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_admin_users_auth_user_id ON admin_users(auth_user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- 3. SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,

  -- Stripe Data
  stripe_customer_id text UNIQUE NOT NULL,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text NOT NULL,

  -- Plan Details
  plan_type text NOT NULL CHECK (plan_type IN ('core', 'premium')),
  plan_amount integer NOT NULL,  -- in cents
  plan_interval text NOT NULL DEFAULT 'month' CHECK (plan_interval IN ('month', 'year')),

  -- Status
  status text NOT NULL DEFAULT 'active' CHECK (
    status IN ('active', 'trialing', 'paused', 'past_due', 'cancelled', 'unpaid')
  ),

  -- Billing Cycle
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  cancelled_at timestamp with time zone,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- 4. REQUESTS
CREATE TABLE requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,

  -- Request Details
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('design', 'development', 'ai_automation', 'strategy', 'other')),

  -- Prioritization
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  status text NOT NULL DEFAULT 'backlog' CHECK (
    status IN ('backlog', 'up_next', 'in_progress', 'blocked', 'review', 'done', 'cancelled')
  ),

  -- Success Criteria
  success_criteria jsonb DEFAULT '[]',  -- Array of checklist items

  -- Timeline
  timeline_ideal timestamp with time zone,
  timeline_hard timestamp with time zone,

  -- Effort Tracking
  estimated_hours numeric(5,2),
  actual_hours numeric(5,2),

  -- Requirements
  functional_requirements jsonb DEFAULT '[]',
  technical_requirements jsonb DEFAULT '{}',
  deliverable_types jsonb DEFAULT '[]',  -- ['figma', 'github_pr', 'deployed_site']

  -- References
  reference_links jsonb DEFAULT '[]',

  -- Status Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,

  -- Assignment
  assigned_to uuid REFERENCES admin_users(id),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_requests_client_id ON requests(client_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_priority ON requests(priority);
CREATE INDEX idx_requests_type ON requests(type);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_requests_assigned_to ON requests(assigned_to);
CREATE INDEX idx_requests_client_status ON requests(client_id, status);
CREATE INDEX idx_requests_status_priority ON requests(status, priority, created_at);

-- 5. ASSETS
CREATE TABLE assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,

  -- File Details
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,  -- in bytes
  storage_path text NOT NULL,  -- Supabase storage path
  storage_bucket text NOT NULL DEFAULT 'request-assets',

  -- Classification
  asset_type text NOT NULL CHECK (asset_type IN ('client_upload', 'deliverable', 'preview', 'attachment')),

  -- Uploader
  uploaded_by uuid REFERENCES auth.users(id),
  uploaded_by_role text NOT NULL CHECK (uploaded_by_role IN ('client', 'admin')),

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_assets_request_id ON assets(request_id);
CREATE INDEX idx_assets_uploaded_by ON assets(uploaded_by);
CREATE INDEX idx_assets_asset_type ON assets(asset_type);

-- 6. COMMENTS
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,

  -- Author
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_type text NOT NULL CHECK (author_type IN ('client', 'admin')),
  author_name text NOT NULL,  -- Denormalized for display

  -- Content
  content text NOT NULL,
  content_type text DEFAULT 'markdown' CHECK (content_type IN ('markdown', 'plain')),

  -- Attachments
  has_attachments boolean DEFAULT false,

  -- Threading (future)
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_comments_request_id ON comments(request_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 7. DELIVERABLES
CREATE TABLE deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,

  -- Deliverable Details
  title text NOT NULL,
  description text,

  -- Type & Location
  delivery_type text NOT NULL CHECK (
    delivery_type IN ('figma', 'github_pr', 'deployment', 'file_download', 'documentation')
  ),
  delivery_url text,

  -- Files (if applicable)
  file_ids jsonb DEFAULT '[]',  -- Array of asset IDs

  -- Status
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'delivered', 'approved', 'revision_requested')),

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  delivered_at timestamp with time zone,
  approved_at timestamp with time zone,

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_deliverables_request_id ON deliverables(request_id);
CREATE INDEX idx_deliverables_status ON deliverables(status);
CREATE INDEX idx_deliverables_delivered_at ON deliverables(delivered_at DESC);

-- 8. SLA_RECORDS
CREATE TABLE sla_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,

  -- SLA Configuration
  target_hours numeric(5,2) NOT NULL DEFAULT 48,

  -- Timing
  started_at timestamp with time zone NOT NULL,
  paused_at timestamp with time zone,
  resumed_at timestamp with time zone,
  completed_at timestamp with time zone,

  -- Calculated Metrics
  total_elapsed_hours numeric(7,2),
  business_hours_elapsed numeric(7,2),
  pause_duration_hours numeric(7,2) DEFAULT 0,

  -- Status
  status text NOT NULL CHECK (status IN ('active', 'paused', 'met', 'violated')),

  -- Violation Details (if applicable)
  violation_reason text,
  violation_severity text CHECK (violation_severity IN ('minor', 'major', 'critical')),

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_sla_records_request_id ON sla_records(request_id);
CREATE INDEX idx_sla_records_status ON sla_records(status);
CREATE INDEX idx_sla_records_started_at ON sla_records(started_at);

-- 9. NOTIFICATIONS
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (
    type IN ('request_update', 'delivery_ready', 'comment_added', 'sla_warning', 'payment_issue')
  ),

  -- Action
  action_url text,
  action_label text,

  -- Status
  read boolean DEFAULT false,
  read_at timestamp with time zone,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read, created_at DESC);

-- 10. BASECAMP_INTEGRATIONS
CREATE TABLE basecamp_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE UNIQUE,

  -- Basecamp IDs
  project_id text NOT NULL,
  account_id text NOT NULL,

  -- To-do List Mapping
  backlog_todolist_id text,
  up_next_todolist_id text,
  in_progress_todolist_id text,
  review_todolist_id text,
  done_todolist_id text,

  -- Sync Status
  last_sync_at timestamp with time zone,
  sync_enabled boolean DEFAULT true,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Metadata
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX idx_basecamp_integrations_client_id ON basecamp_integrations(client_id);
CREATE INDEX idx_basecamp_integrations_project_id ON basecamp_integrations(project_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- CLIENTS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own data"
  ON clients FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Clients can update own data"
  ON clients FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Admins can view all clients"
  ON clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- ADMIN_USERS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- SUBSCRIPTIONS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own subscription"
  ON subscriptions FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- REQUESTS
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own requests"
  ON requests FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create own requests"
  ON requests FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update own requests"
  ON requests FOR UPDATE
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all requests"
  ON requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_user_id = auth.uid()
    )
  );

-- ASSETS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assets for their requests"
  ON assets FOR SELECT
  USING (
    request_id IN (
      SELECT id FROM requests WHERE
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload assets to their requests"
  ON assets FOR INSERT
  WITH CHECK (
    request_id IN (
      SELECT id FROM requests WHERE
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
    )
  );

-- COMMENTS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on their requests"
  ON comments FOR SELECT
  USING (
    request_id IN (
      SELECT id FROM requests WHERE
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can add comments to their requests"
  ON comments FOR INSERT
  WITH CHECK (
    request_id IN (
      SELECT id FROM requests WHERE
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
    )
  );

-- DELIVERABLES
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view deliverables for their requests"
  ON deliverables FOR SELECT
  USING (
    request_id IN (
      SELECT id FROM requests WHERE
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
    )
  );

-- SLA_RECORDS
ALTER TABLE sla_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view SLA records for their requests"
  ON sla_records FOR SELECT
  USING (
    request_id IN (
      SELECT id FROM requests WHERE
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid())
    )
  );

-- NOTIFICATIONS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Calculate Business Hours
CREATE OR REPLACE FUNCTION calculate_business_hours(
  start_time timestamp with time zone,
  end_time timestamp with time zone
) RETURNS numeric AS $$
DECLARE
  business_hours numeric := 0;
  curr_time timestamp with time zone := start_time;
  day_of_week int;
  hour_of_day int;
BEGIN
  WHILE curr_time < end_time LOOP
    day_of_week := EXTRACT(DOW FROM curr_time);
    hour_of_day := EXTRACT(HOUR FROM curr_time);

    -- Monday-Friday (1-5) and 9am-5pm
    IF day_of_week BETWEEN 1 AND 5 AND hour_of_day BETWEEN 9 AND 16 THEN
      business_hours := business_hours + 1;
    END IF;

    curr_time := curr_time + interval '1 hour';
  END LOOP;

  RETURN business_hours;
END;
$$ LANGUAGE plpgsql;

-- Update SLA Status
CREATE OR REPLACE FUNCTION update_sla_status()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'in_progress' AND OLD.status != 'in_progress' THEN
    -- Request moved to in_progress, create SLA record
    INSERT INTO sla_records (request_id, started_at, status)
    VALUES (NEW.id, now(), 'active');
  ELSIF NEW.status = 'done' THEN
    -- Request completed, update SLA record
    UPDATE sla_records
    SET
      completed_at = now(),
      business_hours_elapsed = calculate_business_hours(started_at, now()),
      status = CASE
        WHEN calculate_business_hours(started_at, now()) <= target_hours THEN 'met'
        ELSE 'violated'
      END
    WHERE request_id = NEW.id AND status = 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

CREATE TRIGGER update_sla_on_status_change
  AFTER UPDATE OF status ON requests
  FOR EACH ROW
  EXECUTE FUNCTION update_sla_status();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Active Requests by Client
CREATE VIEW active_requests_by_client AS
SELECT
  c.id as client_id,
  c.company_name,
  COUNT(*) FILTER (WHERE r.status = 'backlog') as backlog_count,
  COUNT(*) FILTER (WHERE r.status = 'up_next') as up_next_count,
  COUNT(*) FILTER (WHERE r.status = 'in_progress') as in_progress_count,
  COUNT(*) FILTER (WHERE r.status = 'review') as review_count,
  COUNT(*) as total_active
FROM clients c
LEFT JOIN requests r ON r.client_id = c.id
WHERE r.status NOT IN ('done', 'cancelled')
GROUP BY c.id, c.company_name;

-- SLA Performance Dashboard
CREATE VIEW sla_performance AS
SELECT
  r.client_id,
  c.company_name,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE sla.status = 'met') as sla_met,
  COUNT(*) FILTER (WHERE sla.status = 'violated') as sla_violated,
  ROUND(AVG(sla.business_hours_elapsed), 2) as avg_turnaround_hours,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE sla.status = 'met') / NULLIF(COUNT(*), 0),
    2
  ) as sla_adherence_percent
FROM requests r
JOIN clients c ON c.id = r.client_id
LEFT JOIN sla_records sla ON sla.request_id = r.id
WHERE r.status = 'done'
  AND r.completed_at >= now() - interval '30 days'
GROUP BY r.client_id, c.company_name;
