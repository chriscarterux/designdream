-- Enhanced Row Level Security Policies
-- This migration adds comprehensive RLS policies to protect all data
-- Addresses security gaps and implements proper admin/client separation

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- =============================================================================

-- Check if current user is an admin (any admin role)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.auth_user_id = auth.uid()
    AND admin_users.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.auth_user_id = auth.uid()
    AND admin_users.role = 'super_admin'
    AND admin_users.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get client_id for current user
CREATE OR REPLACE FUNCTION get_user_client_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM clients
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can access a specific request
CREATE OR REPLACE FUNCTION can_access_request(request_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM requests r
    WHERE r.id = request_uuid
    AND (
      -- Client owns the request
      r.client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
      -- Or user is assigned admin
      OR r.assigned_to IN (SELECT id FROM admin_users WHERE auth_user_id = auth.uid())
      -- Or user is any admin
      OR is_admin()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ENHANCED POLICIES FOR CLIENTS TABLE
-- =============================================================================

-- Drop existing policies to recreate with enhancements
DROP POLICY IF EXISTS "Clients can view own data" ON clients;
DROP POLICY IF EXISTS "Clients can update own data" ON clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;

-- Clients can view their own data
CREATE POLICY "Clients can view own data"
  ON clients FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Clients can update their own non-critical data
CREATE POLICY "Clients can update own data"
  ON clients FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (
    -- Prevent clients from changing critical fields
    auth.uid() = auth_user_id
    AND (OLD.auth_user_id = NEW.auth_user_id)
    AND (OLD.status = NEW.status OR is_admin())
  );

-- Admins have full access to all clients
CREATE POLICY "Admins have full access to clients"
  ON clients FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =============================================================================
-- ENHANCED POLICIES FOR ADMIN_USERS TABLE
-- =============================================================================

-- Drop existing policy to recreate
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;

-- Admins can view all admin users
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  USING (is_admin());

-- Only super admins can create new admins
CREATE POLICY "Super admins can create admins"
  ON admin_users FOR INSERT
  WITH CHECK (is_super_admin());

-- Only super admins can update admin users
CREATE POLICY "Super admins can update admins"
  ON admin_users FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Only super admins can delete admin users
CREATE POLICY "Super admins can delete admins"
  ON admin_users FOR DELETE
  USING (is_super_admin());

-- =============================================================================
-- ENHANCED POLICIES FOR SUBSCRIPTIONS TABLE
-- =============================================================================

-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Clients can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;

-- Clients can view their own subscriptions
CREATE POLICY "Clients can view own subscription"
  ON subscriptions FOR SELECT
  USING (client_id = get_user_client_id());

-- Admins have full access to all subscriptions
CREATE POLICY "Admins have full access to subscriptions"
  ON subscriptions FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =============================================================================
-- ENHANCED POLICIES FOR REQUESTS TABLE
-- =============================================================================

-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Clients can view own requests" ON requests;
DROP POLICY IF EXISTS "Clients can create own requests" ON requests;
DROP POLICY IF EXISTS "Clients can update own requests" ON requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON requests;

-- Clients can view their own requests
CREATE POLICY "Clients can view own requests"
  ON requests FOR SELECT
  USING (client_id = get_user_client_id());

-- Assigned admins can view their assigned requests
CREATE POLICY "Assigned admins can view requests"
  ON requests FOR SELECT
  USING (
    assigned_to IN (
      SELECT id FROM admin_users WHERE auth_user_id = auth.uid()
    )
  );

-- Any admin can view all requests
CREATE POLICY "Admins can view all requests"
  ON requests FOR SELECT
  USING (is_admin());

-- Clients can create requests for themselves
CREATE POLICY "Clients can create own requests"
  ON requests FOR INSERT
  WITH CHECK (
    client_id = get_user_client_id()
    -- Prevent clients from assigning requests
    AND assigned_to IS NULL
  );

-- Clients can update their own requests (limited fields)
CREATE POLICY "Clients can update own requests"
  ON requests FOR UPDATE
  USING (client_id = get_user_client_id())
  WITH CHECK (
    client_id = get_user_client_id()
    -- Clients cannot change assignment or certain status values
    AND (OLD.assigned_to = NEW.assigned_to OR NEW.assigned_to IS NULL)
    AND (OLD.client_id = NEW.client_id)
  );

-- Admins have full access to all requests
CREATE POLICY "Admins have full access to requests"
  ON requests FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =============================================================================
-- ENHANCED POLICIES FOR ASSETS TABLE
-- =============================================================================

-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Users can view assets for their requests" ON assets;
DROP POLICY IF EXISTS "Users can upload assets to their requests" ON assets;

-- Users can view assets for requests they have access to
CREATE POLICY "Users can view accessible assets"
  ON assets FOR SELECT
  USING (can_access_request(request_id));

-- Users can upload assets to requests they have access to
CREATE POLICY "Users can upload assets to accessible requests"
  ON assets FOR INSERT
  WITH CHECK (can_access_request(request_id));

-- Users can update their own uploaded assets
CREATE POLICY "Users can update own assets"
  ON assets FOR UPDATE
  USING (uploaded_by = auth.uid() OR is_admin());

-- Users can delete their own assets or admins can delete any
CREATE POLICY "Users can delete own assets"
  ON assets FOR DELETE
  USING (uploaded_by = auth.uid() OR is_admin());

-- =============================================================================
-- ENHANCED POLICIES FOR COMMENTS TABLE
-- =============================================================================

-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Users can view comments on their requests" ON comments;
DROP POLICY IF EXISTS "Users can add comments to their requests" ON comments;

-- Users can view comments on requests they have access to
CREATE POLICY "Users can view accessible comments"
  ON comments FOR SELECT
  USING (can_access_request(request_id));

-- Users can add comments to requests they have access to
CREATE POLICY "Users can add comments to accessible requests"
  ON comments FOR INSERT
  WITH CHECK (
    can_access_request(request_id)
    AND author_id = auth.uid()
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Users can delete their own comments or admins can delete any
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (author_id = auth.uid() OR is_admin());

-- =============================================================================
-- ENHANCED POLICIES FOR DELIVERABLES TABLE
-- =============================================================================

-- Drop existing policy to recreate
DROP POLICY IF EXISTS "Users can view deliverables for their requests" ON deliverables;

-- Users can view deliverables for requests they have access to
CREATE POLICY "Users can view accessible deliverables"
  ON deliverables FOR SELECT
  USING (can_access_request(request_id));

-- Only admins can create deliverables
CREATE POLICY "Admins can create deliverables"
  ON deliverables FOR INSERT
  WITH CHECK (is_admin());

-- Only admins can update deliverables
CREATE POLICY "Admins can update deliverables"
  ON deliverables FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete deliverables
CREATE POLICY "Admins can delete deliverables"
  ON deliverables FOR DELETE
  USING (is_admin());

-- =============================================================================
-- ENHANCED POLICIES FOR SLA_RECORDS TABLE
-- =============================================================================

-- Drop existing policy to recreate
DROP POLICY IF EXISTS "Users can view SLA records for their requests" ON sla_records;

-- Users can view SLA records for requests they have access to
CREATE POLICY "Users can view accessible SLA records"
  ON sla_records FOR SELECT
  USING (can_access_request(request_id));

-- Only admins can modify SLA records
CREATE POLICY "Admins can manage SLA records"
  ON sla_records FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =============================================================================
-- ENHANCED POLICIES FOR NOTIFICATIONS TABLE
-- =============================================================================

-- Drop existing policies to recreate
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- System/admins can create notifications for any user
CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (is_admin());

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- =============================================================================
-- POLICIES FOR BASECAMP_INTEGRATIONS TABLE
-- =============================================================================

-- Enable RLS on basecamp_integrations table
ALTER TABLE basecamp_integrations ENABLE ROW LEVEL SECURITY;

-- Clients can view their own Basecamp integration
CREATE POLICY "Clients can view own basecamp integration"
  ON basecamp_integrations FOR SELECT
  USING (client_id = get_user_client_id());

-- Only admins can manage Basecamp integrations
CREATE POLICY "Admins can manage basecamp integrations"
  ON basecamp_integrations FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =============================================================================
-- ADDITIONAL SECURITY MEASURES
-- =============================================================================

-- Create a function to validate email domains (optional, for additional security)
CREATE OR REPLACE FUNCTION is_valid_client_email(email_address TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Add custom email validation logic here if needed
  -- For example, block certain domains, require certain formats, etc.
  RETURN email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Create audit log function for sensitive operations
CREATE OR REPLACE FUNCTION log_sensitive_operation()
RETURNS TRIGGER AS $$
BEGIN
  -- Log to activity or audit table (implement as needed)
  RAISE NOTICE 'Sensitive operation on table % by user %', TG_TABLE_NAME, auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for logging admin_users changes
CREATE TRIGGER audit_admin_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION log_sensitive_operation();

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant usage on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_client_id() TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_request(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_valid_client_email(TEXT) TO authenticated;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON FUNCTION is_admin() IS 'Check if the current user is an active admin user';
COMMENT ON FUNCTION is_super_admin() IS 'Check if the current user is a super admin';
COMMENT ON FUNCTION get_user_client_id() IS 'Get the client_id for the current authenticated user';
COMMENT ON FUNCTION can_access_request(UUID) IS 'Check if the current user can access a specific request';

-- Security policy documentation
COMMENT ON POLICY "Clients can view own data" ON clients IS 'Clients can only view their own client record';
COMMENT ON POLICY "Admins have full access to clients" ON clients IS 'Admins can perform all operations on all client records';
COMMENT ON POLICY "Super admins can create admins" ON admin_users IS 'Only super admins can create new admin users';
COMMENT ON POLICY "Clients can view own subscription" ON subscriptions IS 'Clients can only view their own subscription details';
COMMENT ON POLICY "Clients can view own requests" ON requests IS 'Clients can view requests they created';
COMMENT ON POLICY "Assigned admins can view requests" ON requests IS 'Admins can view requests assigned to them';
COMMENT ON POLICY "Admins can view all requests" ON requests IS 'Admins can view all requests in the system';
