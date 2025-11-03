-- Performance Optimization: Comprehensive Database Indexes
-- This migration adds indexes for common query patterns to improve performance
-- as the database grows. Includes standard, composite, full-text, and partial indexes.

-- =============================================================================
-- ADDITIONAL STANDARD INDEXES (Missing from initial schema)
-- =============================================================================

-- Clients: Additional indexes
CREATE INDEX IF NOT EXISTS idx_clients_stripe_customer_id ON clients(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_company_name ON clients(company_name);

-- Subscriptions: Additional indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at DESC);

-- Requests: Additional single-column indexes
CREATE INDEX IF NOT EXISTS idx_requests_updated_at ON requests(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_started_at ON requests(started_at) WHERE started_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_requests_completed_at ON requests(completed_at DESC) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_requests_timeline_ideal ON requests(timeline_ideal) WHERE timeline_ideal IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_requests_timeline_hard ON requests(timeline_hard) WHERE timeline_hard IS NOT NULL;

-- Assets: Additional indexes
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_storage_bucket ON assets(storage_bucket);
CREATE INDEX IF NOT EXISTS idx_assets_uploaded_by_role ON assets(uploaded_by_role);

-- Deliverables: Additional indexes
CREATE INDEX IF NOT EXISTS idx_deliverables_created_at ON deliverables(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deliverables_delivery_type ON deliverables(delivery_type);
CREATE INDEX IF NOT EXISTS idx_deliverables_approved_at ON deliverables(approved_at DESC) WHERE approved_at IS NOT NULL;

-- SLA Records: Additional indexes
CREATE INDEX IF NOT EXISTS idx_sla_records_completed_at ON sla_records(completed_at DESC) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sla_records_violation_severity ON sla_records(violation_severity) WHERE violation_severity IS NOT NULL;

-- Notifications: Additional indexes
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at DESC) WHERE read_at IS NOT NULL;

-- Basecamp Integrations: Additional indexes
CREATE INDEX IF NOT EXISTS idx_basecamp_integrations_sync_enabled ON basecamp_integrations(sync_enabled);
CREATE INDEX IF NOT EXISTS idx_basecamp_integrations_last_sync_at ON basecamp_integrations(last_sync_at DESC) WHERE last_sync_at IS NOT NULL;

-- Admin Users: Additional indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_status ON admin_users(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_created_at ON admin_users(created_at DESC);

-- =============================================================================
-- COMPOSITE INDEXES (For common multi-column queries)
-- =============================================================================

-- Requests: Common query patterns
CREATE INDEX IF NOT EXISTS idx_requests_assigned_status ON requests(assigned_to, status) WHERE assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_requests_client_priority ON requests(client_id, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_type_status ON requests(type, status);
CREATE INDEX IF NOT EXISTS idx_requests_status_updated ON requests(status, updated_at DESC);

-- Subscriptions: Billing queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_status_period_end ON subscriptions(status, current_period_end);
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_status ON subscriptions(client_id, status);

-- Assets: Request asset queries
CREATE INDEX IF NOT EXISTS idx_assets_request_type ON assets(request_id, asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_request_created ON assets(request_id, created_at DESC);

-- Comments: Request comment queries
CREATE INDEX IF NOT EXISTS idx_comments_request_created ON comments(request_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_author_type ON comments(author_id, author_type);

-- Deliverables: Request deliverable queries
CREATE INDEX IF NOT EXISTS idx_deliverables_request_status ON deliverables(request_id, status);
CREATE INDEX IF NOT EXISTS idx_deliverables_status_delivered ON deliverables(status, delivered_at DESC);

-- SLA Records: Performance tracking
CREATE INDEX IF NOT EXISTS idx_sla_records_status_started ON sla_records(status, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sla_records_request_status ON sla_records(request_id, status);

-- Clients: Status and subscription queries
CREATE INDEX IF NOT EXISTS idx_clients_status_created ON clients(status, created_at DESC);

-- =============================================================================
-- FULL-TEXT SEARCH INDEXES (GIN indexes for search functionality)
-- =============================================================================

-- Requests: Full-text search on title and description
CREATE INDEX IF NOT EXISTS idx_requests_title_search
  ON requests USING GIN (to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_requests_description_search
  ON requests USING GIN (to_tsvector('english', COALESCE(description, '')));

-- Combined title + description search (more efficient for combined searches)
CREATE INDEX IF NOT EXISTS idx_requests_full_text_search
  ON requests USING GIN (
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
  );

-- Comments: Full-text search on content
CREATE INDEX IF NOT EXISTS idx_comments_content_search
  ON comments USING GIN (to_tsvector('english', content));

-- Clients: Company name search
CREATE INDEX IF NOT EXISTS idx_clients_company_search
  ON clients USING GIN (to_tsvector('english', company_name));

-- Deliverables: Title and description search
CREATE INDEX IF NOT EXISTS idx_deliverables_title_search
  ON deliverables USING GIN (to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_deliverables_description_search
  ON deliverables USING GIN (to_tsvector('english', COALESCE(description, '')));

-- =============================================================================
-- PARTIAL INDEXES (Optimized for filtered queries)
-- =============================================================================

-- Active/pending requests (most common queries)
CREATE INDEX IF NOT EXISTS idx_requests_active_status
  ON requests(created_at DESC, priority)
  WHERE status IN ('backlog', 'up_next', 'in_progress', 'review', 'blocked');

-- In-progress requests (dashboard queries)
CREATE INDEX IF NOT EXISTS idx_requests_in_progress
  ON requests(assigned_to, created_at DESC)
  WHERE status = 'in_progress';

-- Urgent/high priority requests (attention-needed queries)
CREATE INDEX IF NOT EXISTS idx_requests_high_priority
  ON requests(created_at DESC)
  WHERE priority IN ('urgent', 'high') AND status NOT IN ('done', 'cancelled');

-- Active subscriptions (billing queries)
CREATE INDEX IF NOT EXISTS idx_subscriptions_active_status
  ON subscriptions(client_id, current_period_end)
  WHERE status = 'active';

-- Expiring subscriptions (renewal tracking)
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiring_soon
  ON subscriptions(current_period_end ASC, client_id)
  WHERE status = 'active' AND current_period_end IS NOT NULL;

-- Past due subscriptions (payment issues)
CREATE INDEX IF NOT EXISTS idx_subscriptions_past_due
  ON subscriptions(client_id, current_period_end)
  WHERE status IN ('past_due', 'unpaid');

-- Unread notifications (notification center)
CREATE INDEX IF NOT EXISTS idx_notifications_unread
  ON notifications(user_id, created_at DESC)
  WHERE read = false;

-- Active SLA records (monitoring)
CREATE INDEX IF NOT EXISTS idx_sla_records_active
  ON sla_records(started_at DESC)
  WHERE status IN ('active', 'paused');

-- Violated SLAs (reporting)
CREATE INDEX IF NOT EXISTS idx_sla_records_violated
  ON sla_records(started_at DESC, violation_severity)
  WHERE status = 'violated';

-- Active clients (general queries)
CREATE INDEX IF NOT EXISTS idx_clients_active
  ON clients(created_at DESC)
  WHERE status = 'active';

-- Pending deliverables (work tracking)
CREATE INDEX IF NOT EXISTS idx_deliverables_pending
  ON deliverables(request_id, created_at DESC)
  WHERE status IN ('draft', 'delivered', 'revision_requested');

-- Client uploads (asset management)
CREATE INDEX IF NOT EXISTS idx_assets_client_uploads
  ON assets(request_id, created_at DESC)
  WHERE uploaded_by_role = 'client';

-- Admin deliverables (work output)
CREATE INDEX IF NOT EXISTS idx_assets_admin_deliverables
  ON assets(request_id, created_at DESC)
  WHERE asset_type = 'deliverable' AND uploaded_by_role = 'admin';

-- =============================================================================
-- JSONB INDEXES (For JSON column queries)
-- =============================================================================

-- Requests: Success criteria and requirements (if queried)
CREATE INDEX IF NOT EXISTS idx_requests_success_criteria_gin
  ON requests USING GIN (success_criteria);

CREATE INDEX IF NOT EXISTS idx_requests_deliverable_types_gin
  ON requests USING GIN (deliverable_types);

-- Clients: Tech stack queries
CREATE INDEX IF NOT EXISTS idx_clients_tech_stack_gin
  ON clients USING GIN (tech_stack);

-- =============================================================================
-- STATISTICS UPDATE
-- =============================================================================

-- Update table statistics for query planner optimization
ANALYZE clients;
ANALYZE admin_users;
ANALYZE subscriptions;
ANALYZE requests;
ANALYZE assets;
ANALYZE comments;
ANALYZE deliverables;
ANALYZE sla_records;
ANALYZE notifications;
ANALYZE basecamp_integrations;

-- =============================================================================
-- INDEX COMMENTS (Documentation)
-- =============================================================================

COMMENT ON INDEX idx_requests_full_text_search IS 'Full-text search combining title and description for requests';
COMMENT ON INDEX idx_requests_active_status IS 'Partial index for active/pending requests - most common query pattern';
COMMENT ON INDEX idx_requests_high_priority IS 'Partial index for urgent/high priority requests needing attention';
COMMENT ON INDEX idx_subscriptions_expiring_soon IS 'Partial index for subscription renewal tracking';
COMMENT ON INDEX idx_notifications_unread IS 'Partial index for unread notifications - notification center queries';
COMMENT ON INDEX idx_sla_records_active IS 'Partial index for monitoring active SLA records';
COMMENT ON INDEX idx_requests_assigned_status IS 'Composite index for assigned requests dashboard';
