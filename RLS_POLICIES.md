# Row Level Security (RLS) Policies Documentation

## Overview

This document details the Row Level Security (RLS) implementation for the Design Dreams platform. RLS ensures that users can only access data they are authorized to view or modify, providing defense-in-depth security at the database layer.

## Security Model

### User Roles

The system implements three primary user roles:

1. **Clients** - Customers who submit design requests
   - Identified by `clients.auth_user_id`
   - Can view/edit their own data
   - Cannot access other clients' data
   - Cannot modify system-critical fields

2. **Admins** - Team members who process requests
   - Identified by presence in `admin_users` table
   - Can view all data
   - Can manage requests, deliverables, and client interactions
   - Sub-roles: `admin`, `support`

3. **Super Admins** - System administrators
   - Special admin role with elevated privileges
   - Can create/modify/delete admin users
   - Can perform all system operations
   - Role: `super_admin`

## Helper Functions

### Core Security Functions

#### `is_admin()`
```sql
RETURNS BOOLEAN
```
Checks if the current authenticated user is an active admin user.

**Usage:**
```sql
WHERE is_admin()
```

**Returns:**
- `true` if user exists in `admin_users` with `status = 'active'`
- `false` otherwise

---

#### `is_super_admin()`
```sql
RETURNS BOOLEAN
```
Checks if the current authenticated user is a super admin.

**Usage:**
```sql
WHERE is_super_admin()
```

**Returns:**
- `true` if user has `role = 'super_admin'` and `status = 'active'`
- `false` otherwise

---

#### `get_user_client_id()`
```sql
RETURNS UUID
```
Returns the client ID for the current authenticated user.

**Usage:**
```sql
WHERE client_id = get_user_client_id()
```

**Returns:**
- Client UUID if user is a client
- `NULL` if user is not a client

---

#### `can_access_request(request_uuid UUID)`
```sql
RETURNS BOOLEAN
```
Checks if the current user can access a specific request.

**Usage:**
```sql
WHERE can_access_request(request_id)
```

**Returns:**
- `true` if user owns the request, is assigned to it, or is an admin
- `false` otherwise

## Table Policies

### 1. Clients Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Clients can view own data | SELECT | Clients | Own client record only |
| Clients can update own data | UPDATE | Clients | Own record (restricted fields) |
| Admins have full access to clients | ALL | Admins | All client records |

**Restricted Fields for Clients:**
- Cannot change `auth_user_id`
- Cannot change `status` (admin-only)

**Example Queries:**
```sql
-- Client viewing their profile
SELECT * FROM clients WHERE auth_user_id = auth.uid();

-- Admin viewing all clients
SELECT * FROM clients; -- (if is_admin() = true)
```

---

### 2. Admin Users Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Admins can view all admin users | SELECT | Admins | All admin records |
| Super admins can create admins | INSERT | Super Admins | New admin users |
| Super admins can update admins | UPDATE | Super Admins | All admin users |
| Super admins can delete admins | DELETE | Super Admins | All admin users |

**Security Notes:**
- Only super admins can manage admin users
- Prevents privilege escalation by regular admins
- All admin modifications are logged via trigger

**Example Queries:**
```sql
-- Super admin creating new admin
INSERT INTO admin_users (name, email, role, auth_user_id)
VALUES ('John Doe', 'john@example.com', 'admin', 'user-uuid');
```

---

### 3. Subscriptions Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Clients can view own subscription | SELECT | Clients | Own subscription only |
| Admins have full access to subscriptions | ALL | Admins | All subscriptions |

**Security Notes:**
- Clients cannot modify subscriptions (prevents billing fraud)
- All subscription changes must be done by admins or Stripe webhooks

**Example Queries:**
```sql
-- Client viewing their subscription
SELECT * FROM subscriptions WHERE client_id = get_user_client_id();

-- Admin updating subscription status
UPDATE subscriptions SET status = 'active' WHERE id = 'subscription-uuid';
```

---

### 4. Requests Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Clients can view own requests | SELECT | Clients | Requests they created |
| Assigned admins can view requests | SELECT | Admins | Requests assigned to them |
| Admins can view all requests | SELECT | Admins | All requests |
| Clients can create own requests | INSERT | Clients | New requests for themselves |
| Clients can update own requests | UPDATE | Clients | Own requests (limited) |
| Admins have full access to requests | ALL | Admins | All requests |

**Restricted Operations for Clients:**
- Cannot assign requests to admins (assignment is NULL on creation)
- Cannot change `client_id` after creation
- Cannot modify `assigned_to` field

**Example Queries:**
```sql
-- Client creating a request
INSERT INTO requests (client_id, title, description, type, priority)
VALUES (get_user_client_id(), 'New Website', 'Need a modern site', 'development', 'high');

-- Admin assigning request
UPDATE requests SET assigned_to = 'admin-uuid' WHERE id = 'request-uuid';
```

---

### 5. Assets Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Users can view accessible assets | SELECT | All | Assets on accessible requests |
| Users can upload assets to accessible requests | INSERT | All | Assets on accessible requests |
| Users can update own assets | UPDATE | Uploaders/Admins | Own uploaded assets |
| Users can delete own assets | DELETE | Uploaders/Admins | Own uploaded assets |

**Security Notes:**
- Assets inherit access control from parent request
- Users can only modify assets they uploaded
- Admins can modify any asset

**Example Queries:**
```sql
-- Client uploading asset
INSERT INTO assets (request_id, file_name, file_type, file_size, storage_path, asset_type, uploaded_by, uploaded_by_role)
VALUES ('request-uuid', 'logo.png', 'image/png', 12345, 'path/to/file', 'client_upload', auth.uid(), 'client');
```

---

### 6. Comments Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Users can view accessible comments | SELECT | All | Comments on accessible requests |
| Users can add comments to accessible requests | INSERT | All | Comments on accessible requests |
| Users can update own comments | UPDATE | Authors | Own comments only |
| Users can delete own comments | DELETE | Authors/Admins | Own comments or any (admins) |

**Security Notes:**
- Comments inherit access control from parent request
- `author_id` is validated on insert to prevent impersonation
- Edit history could be added for accountability

**Example Queries:**
```sql
-- Client adding comment
INSERT INTO comments (request_id, author_id, author_type, author_name, content)
VALUES ('request-uuid', auth.uid(), 'client', 'John Smith', 'Please make the logo bigger');

-- Admin responding
INSERT INTO comments (request_id, author_id, author_type, author_name, content)
VALUES ('request-uuid', auth.uid(), 'admin', 'Designer Jane', 'Updated the logo size');
```

---

### 7. Deliverables Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Users can view accessible deliverables | SELECT | All | Deliverables on accessible requests |
| Admins can create deliverables | INSERT | Admins | New deliverables |
| Admins can update deliverables | UPDATE | Admins | All deliverables |
| Admins can delete deliverables | DELETE | Admins | All deliverables |

**Security Notes:**
- Only admins can create/modify deliverables
- Clients can view deliverables but not change them
- Prevents clients from marking work as approved without review

**Example Queries:**
```sql
-- Admin creating deliverable
INSERT INTO deliverables (request_id, title, description, delivery_type, delivery_url, status)
VALUES ('request-uuid', 'Final Website Design', 'Complete Figma mockups', 'figma', 'https://figma.com/...', 'delivered');
```

---

### 8. SLA Records Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Users can view accessible SLA records | SELECT | All | SLA records on accessible requests |
| Admins can manage SLA records | ALL | Admins | All SLA records |

**Security Notes:**
- SLA records are automatically created by triggers
- Clients can view their SLA performance
- Only admins can manually adjust SLA records

**Example Queries:**
```sql
-- Client viewing SLA performance
SELECT * FROM sla_records WHERE request_id IN (
  SELECT id FROM requests WHERE client_id = get_user_client_id()
);
```

---

### 9. Notifications Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Users can view own notifications | SELECT | All | Own notifications |
| Users can update own notifications | UPDATE | All | Own notifications (mark read) |
| Admins can create notifications | INSERT | Admins | Notifications for any user |
| Users can delete own notifications | DELETE | All | Own notifications |

**Security Notes:**
- Users can only see their own notifications
- Admins/system can create notifications for users
- Users can mark as read or delete

**Example Queries:**
```sql
-- User viewing unread notifications
SELECT * FROM notifications WHERE user_id = auth.uid() AND read = false;

-- Marking notification as read
UPDATE notifications SET read = true, read_at = now() WHERE id = 'notification-uuid';
```

---

### 10. Basecamp Integrations Table

**RLS Enabled:** ✅

| Policy Name | Operation | Who | What |
|------------|-----------|-----|------|
| Clients can view own basecamp integration | SELECT | Clients | Own integration settings |
| Admins can manage basecamp integrations | ALL | Admins | All integrations |

**Security Notes:**
- Clients can view integration status
- Only admins can configure integrations
- Prevents clients from accessing Basecamp API credentials

## Testing RLS Policies

### Test Setup

Create test users for each role:

```sql
-- Create test client user
INSERT INTO auth.users (id, email) VALUES ('client-test-uuid', 'client@test.com');
INSERT INTO clients (auth_user_id, email, company_name, contact_name)
VALUES ('client-test-uuid', 'client@test.com', 'Test Company', 'Test Client');

-- Create test admin user
INSERT INTO auth.users (id, email) VALUES ('admin-test-uuid', 'admin@test.com');
INSERT INTO admin_users (auth_user_id, email, name, role)
VALUES ('admin-test-uuid', 'admin@test.com', 'Test Admin', 'admin');

-- Create test super admin user
INSERT INTO auth.users (id, email) VALUES ('super-admin-test-uuid', 'superadmin@test.com');
INSERT INTO admin_users (auth_user_id, email, name, role)
VALUES ('super-admin-test-uuid', 'superadmin@test.com', 'Test Super Admin', 'super_admin');
```

### Test Scenarios

#### 1. Client Data Isolation

```sql
-- Set session as client user
SET request.jwt.claim.sub = 'client-test-uuid';

-- Should return only own data
SELECT * FROM clients; -- Returns 1 row (own record)

-- Should fail or return 0 rows
SELECT * FROM clients WHERE auth_user_id != 'client-test-uuid'; -- Returns 0 rows
```

#### 2. Request Access Control

```sql
-- Create request as client
SET request.jwt.claim.sub = 'client-test-uuid';
INSERT INTO requests (client_id, title, type, priority)
VALUES ((SELECT id FROM clients WHERE auth_user_id = 'client-test-uuid'), 'Test Request', 'design', 'normal');

-- Client should see their request
SELECT * FROM requests; -- Returns 1 row

-- Different client should not see it
SET request.jwt.claim.sub = 'other-client-uuid';
SELECT * FROM requests; -- Returns 0 rows

-- Admin should see all requests
SET request.jwt.claim.sub = 'admin-test-uuid';
SELECT * FROM requests; -- Returns all rows
```

#### 3. Admin Privilege Escalation Prevention

```sql
-- Try to create admin as regular admin (should fail)
SET request.jwt.claim.sub = 'admin-test-uuid';
INSERT INTO admin_users (auth_user_id, email, name, role)
VALUES ('new-admin-uuid', 'new@test.com', 'New Admin', 'admin');
-- ERROR: new row violates row-level security policy

-- Create admin as super admin (should succeed)
SET request.jwt.claim.sub = 'super-admin-test-uuid';
INSERT INTO admin_users (auth_user_id, email, name, role)
VALUES ('new-admin-uuid', 'new@test.com', 'New Admin', 'admin');
-- SUCCESS
```

#### 4. Asset Access Control

```sql
-- Client uploads asset to own request
SET request.jwt.claim.sub = 'client-test-uuid';
INSERT INTO assets (request_id, file_name, file_type, file_size, storage_path, asset_type, uploaded_by, uploaded_by_role)
VALUES ('client-request-uuid', 'file.pdf', 'application/pdf', 1024, 'path/file.pdf', 'client_upload', auth.uid(), 'client');

-- Client tries to view assets on someone else's request (should fail)
SELECT * FROM assets WHERE request_id = 'other-client-request-uuid'; -- Returns 0 rows

-- Admin can view all assets
SET request.jwt.claim.sub = 'admin-test-uuid';
SELECT * FROM assets; -- Returns all rows
```

#### 5. Unauthenticated Access

```sql
-- Unset authentication
RESET request.jwt.claim.sub;

-- All queries should return 0 rows or fail
SELECT * FROM clients; -- Returns 0 rows
SELECT * FROM requests; -- Returns 0 rows
SELECT * FROM subscriptions; -- Returns 0 rows
```

### Automated Testing Script

```bash
#!/bin/bash
# Run from Supabase project directory

echo "Testing RLS Policies..."

# Test 1: Client isolation
npx supabase db test --file tests/rls/client_isolation_test.sql

# Test 2: Admin access
npx supabase db test --file tests/rls/admin_access_test.sql

# Test 3: Super admin privileges
npx supabase db test --file tests/rls/super_admin_test.sql

# Test 4: Request access control
npx supabase db test --file tests/rls/request_access_test.sql

# Test 5: Asset security
npx supabase db test --file tests/rls/asset_security_test.sql

echo "RLS tests completed!"
```

## Security Best Practices

### 1. Defense in Depth

RLS is the last line of defense. Always implement security at multiple layers:

- **Application Layer:** Validate permissions in API routes
- **Database Layer:** RLS policies (this document)
- **Network Layer:** Supabase API keys and JWT validation

### 2. Principle of Least Privilege

Users should have the minimum permissions necessary:

- Clients can only access their own data
- Regular admins cannot modify admin users
- Super admins have full access (use sparingly)

### 3. Audit Logging

All sensitive operations are logged:

- Admin user changes trigger audit logs
- Track who accessed what data
- Monitor for suspicious patterns

### 4. Regular Security Reviews

- Review RLS policies quarterly
- Test policies with each schema change
- Monitor for policy violations in logs

### 5. Safe Schema Migrations

When adding new tables:

```sql
-- Always enable RLS on new tables
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Start restrictive, then open up as needed
CREATE POLICY "Admins only" ON new_table FOR ALL USING (is_admin());
```

## Common Pitfalls

### 1. Forgetting to Enable RLS

```sql
-- BAD: Table exists but RLS not enabled
CREATE TABLE new_table (...);

-- GOOD: Always enable RLS
CREATE TABLE new_table (...);
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
```

### 2. Overly Permissive Policies

```sql
-- BAD: Anyone can access everything
CREATE POLICY "public_access" ON table FOR ALL USING (true);

-- GOOD: Specific, restrictive policies
CREATE POLICY "clients_own_data" ON table FOR SELECT USING (client_id = get_user_client_id());
```

### 3. Not Testing Policies

Always test RLS policies with different user roles before deploying.

### 4. Bypassing RLS in Application Code

```sql
-- BAD: Using service role key to bypass RLS
const { data } = await supabase.from('clients').select('*');

-- GOOD: Use authenticated client with RLS
const { data } = await supabaseClient.from('clients').select('*');
```

## Monitoring and Maintenance

### Check Active Policies

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Verify RLS is Enabled

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Monitor Policy Violations

Check Supabase logs for RLS violations:

```sql
-- Query Supabase logs API or dashboard
-- Look for "row-level security policy" errors
```

## Migration Rollback

If issues are detected with the RLS policies, they can be rolled back:

```sql
-- Disable RLS (EMERGENCY ONLY - opens security hole)
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Drop specific policy
DROP POLICY "policy_name" ON table_name;

-- Or drop all policies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;
```

**WARNING:** Only disable RLS in emergencies. Always re-enable with proper policies.

## Support and Contact

For security concerns or questions about RLS policies:

- Review this documentation
- Test in development environment first
- Consult Supabase RLS documentation: https://supabase.com/docs/guides/auth/row-level-security
- Contact security team for assistance

---

**Document Version:** 1.0
**Last Updated:** 2025-11-03
**Author:** Security Team
**Status:** Active
