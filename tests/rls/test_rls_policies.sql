-- RLS Policy Test Suite
-- This file tests all Row Level Security policies

-- =============================================================================
-- TEST SETUP
-- =============================================================================

-- Create test users in auth.users (if not exists)
DO $$
BEGIN
  -- Test client 1
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'client1@test.com',
    crypt('testpass123', gen_salt('bf')),
    now(),
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Test client 2
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'client2@test.com',
    crypt('testpass123', gen_salt('bf')),
    now(),
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Test admin
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'admin@test.com',
    crypt('testpass123', gen_salt('bf')),
    now(),
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Test super admin
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'superadmin@test.com',
    crypt('testpass123', gen_salt('bf')),
    now(),
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;
END $$;

-- Create test clients
INSERT INTO clients (id, auth_user_id, email, company_name, contact_name, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'client1@test.com', 'Test Company 1', 'Client One', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'client2@test.com', 'Test Company 2', 'Client Two', 'active')
ON CONFLICT (id) DO NOTHING;

-- Create test admin users
INSERT INTO admin_users (id, auth_user_id, email, name, role, status)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'admin@test.com', 'Test Admin', 'admin', 'active'),
  ('44444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'superadmin@test.com', 'Test Super Admin', 'super_admin', 'active')
ON CONFLICT (id) DO NOTHING;

-- Create test requests
INSERT INTO requests (id, client_id, title, description, type, priority, status)
VALUES
  ('req11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Client 1 Request 1', 'Test request', 'design', 'normal', 'backlog'),
  ('req22222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Client 2 Request 1', 'Test request', 'development', 'high', 'up_next')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- TEST 1: CLIENT DATA ISOLATION
-- =============================================================================

\echo ''
\echo '========================================='
\echo 'TEST 1: Client Data Isolation'
\echo '========================================='

-- Set session as Client 1
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

\echo 'Client 1 should see only their own client record...'
SELECT
  CASE
    WHEN COUNT(*) = 1 AND MIN(id::text) = '11111111-1111-1111-1111-111111111111'
    THEN 'PASS: Client 1 sees only their record'
    ELSE 'FAIL: Client 1 sees incorrect data (count=' || COUNT(*) || ')'
  END AS result
FROM clients;

\echo 'Client 1 should see only their own requests...'
SELECT
  CASE
    WHEN COUNT(*) = 1 AND MIN(client_id::text) = '11111111-1111-1111-1111-111111111111'
    THEN 'PASS: Client 1 sees only their requests'
    ELSE 'FAIL: Client 1 sees incorrect requests (count=' || COUNT(*) || ')'
  END AS result
FROM requests;

-- Set session as Client 2
SET LOCAL request.jwt.claim.sub = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

\echo 'Client 2 should see only their own client record...'
SELECT
  CASE
    WHEN COUNT(*) = 1 AND MIN(id::text) = '22222222-2222-2222-2222-222222222222'
    THEN 'PASS: Client 2 sees only their record'
    ELSE 'FAIL: Client 2 sees incorrect data (count=' || COUNT(*) || ')'
  END AS result
FROM clients;

\echo 'Client 2 should see only their own requests...'
SELECT
  CASE
    WHEN COUNT(*) = 1 AND MIN(client_id::text) = '22222222-2222-2222-2222-222222222222'
    THEN 'PASS: Client 2 sees only their requests'
    ELSE 'FAIL: Client 2 sees incorrect requests (count=' || COUNT(*) || ')'
  END AS result
FROM requests;

-- =============================================================================
-- TEST 2: ADMIN ACCESS CONTROL
-- =============================================================================

\echo ''
\echo '========================================='
\echo 'TEST 2: Admin Access Control'
\echo '========================================='

-- Set session as Admin
SET LOCAL request.jwt.claim.sub = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

\echo 'Admin should see all clients...'
SELECT
  CASE
    WHEN COUNT(*) >= 2
    THEN 'PASS: Admin sees all clients (count=' || COUNT(*) || ')'
    ELSE 'FAIL: Admin does not see all clients (count=' || COUNT(*) || ')'
  END AS result
FROM clients;

\echo 'Admin should see all requests...'
SELECT
  CASE
    WHEN COUNT(*) >= 2
    THEN 'PASS: Admin sees all requests (count=' || COUNT(*) || ')'
    ELSE 'FAIL: Admin does not see all requests (count=' || COUNT(*) || ')'
  END AS result
FROM requests;

\echo 'Admin should see all admin users...'
SELECT
  CASE
    WHEN COUNT(*) >= 2
    THEN 'PASS: Admin sees all admin users (count=' || COUNT(*) || ')'
    ELSE 'FAIL: Admin does not see admin users (count=' || COUNT(*) || ')'
  END AS result
FROM admin_users;

-- =============================================================================
-- TEST 3: SUPER ADMIN PRIVILEGES
-- =============================================================================

\echo ''
\echo '========================================='
\echo 'TEST 3: Super Admin Privileges'
\echo '========================================='

-- Set session as Super Admin
SET LOCAL request.jwt.claim.sub = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

\echo 'Super admin should be able to create admin users...'
DO $$
DECLARE
  test_passed BOOLEAN := FALSE;
BEGIN
  -- Try to insert a test admin
  INSERT INTO admin_users (auth_user_id, email, name, role, status)
  VALUES ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'testadmin@test.com', 'Test Admin Created', 'admin', 'active')
  ON CONFLICT (auth_user_id) DO NOTHING;

  test_passed := TRUE;

  IF test_passed THEN
    RAISE NOTICE 'PASS: Super admin can create admin users';
  ELSE
    RAISE NOTICE 'FAIL: Super admin cannot create admin users';
  END IF;

  -- Clean up test admin
  DELETE FROM admin_users WHERE auth_user_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'FAIL: Super admin cannot create admin users - %', SQLERRM;
END $$;

-- =============================================================================
-- TEST 4: REQUEST ACCESS CONTROL
-- =============================================================================

\echo ''
\echo '========================================='
\echo 'TEST 4: Request Access Control'
\echo '========================================='

-- Set session as Client 1
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

\echo 'Client should be able to create request for themselves...'
DO $$
DECLARE
  test_passed BOOLEAN := FALSE;
  new_request_id UUID;
BEGIN
  INSERT INTO requests (client_id, title, description, type, priority, status)
  VALUES (
    (SELECT id FROM clients WHERE auth_user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    'Test Request from Client',
    'Testing RLS',
    'design',
    'low',
    'backlog'
  )
  RETURNING id INTO new_request_id;

  test_passed := TRUE;

  IF test_passed THEN
    RAISE NOTICE 'PASS: Client can create requests for themselves';
  ELSE
    RAISE NOTICE 'FAIL: Client cannot create requests';
  END IF;

  -- Clean up
  DELETE FROM requests WHERE id = new_request_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'FAIL: Client cannot create requests - %', SQLERRM;
END $$;

\echo 'Client should NOT be able to create request for another client...'
DO $$
DECLARE
  test_passed BOOLEAN := FALSE;
BEGIN
  -- Try to insert request for Client 2
  INSERT INTO requests (client_id, title, description, type, priority, status)
  VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Malicious Request',
    'Should fail RLS',
    'design',
    'low',
    'backlog'
  );

  -- If we get here, test failed
  RAISE NOTICE 'FAIL: Client was able to create request for another client (security breach!)';
  ROLLBACK;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'PASS: Client cannot create requests for other clients';
END $$;

-- =============================================================================
-- TEST 5: ASSET ACCESS CONTROL
-- =============================================================================

\echo ''
\echo '========================================='
\echo 'TEST 5: Asset Access Control'
\echo '========================================='

-- Create test asset for Client 1's request
INSERT INTO assets (id, request_id, file_name, file_type, file_size, storage_path, asset_type, uploaded_by, uploaded_by_role)
VALUES (
  'asset111-1111-1111-1111-111111111111',
  'req11111-1111-1111-1111-111111111111',
  'test.pdf',
  'application/pdf',
  1024,
  'test/path.pdf',
  'client_upload',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'client'
) ON CONFLICT (id) DO NOTHING;

-- Set session as Client 1
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

\echo 'Client should see assets on their own requests...'
SELECT
  CASE
    WHEN COUNT(*) >= 1
    THEN 'PASS: Client can view their own assets'
    ELSE 'FAIL: Client cannot view their own assets'
  END AS result
FROM assets WHERE request_id = 'req11111-1111-1111-1111-111111111111';

-- Set session as Client 2
SET LOCAL request.jwt.claim.sub = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

\echo 'Client should NOT see assets on other clients requests...'
SELECT
  CASE
    WHEN COUNT(*) = 0
    THEN 'PASS: Client cannot view other clients assets'
    ELSE 'FAIL: Client can view other clients assets (security breach!)'
  END AS result
FROM assets WHERE request_id = 'req11111-1111-1111-1111-111111111111';

-- =============================================================================
-- TEST 6: COMMENT ACCESS CONTROL
-- =============================================================================

\echo ''
\echo '========================================='
\echo 'TEST 6: Comment Access Control'
\echo '========================================='

-- Create test comment
INSERT INTO comments (id, request_id, author_id, author_type, author_name, content)
VALUES (
  'comment1-1111-1111-1111-111111111111',
  'req11111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'client',
  'Client One',
  'Test comment'
) ON CONFLICT (id) DO NOTHING;

-- Set session as Client 1
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

\echo 'Client should see comments on their requests...'
SELECT
  CASE
    WHEN COUNT(*) >= 1
    THEN 'PASS: Client can view comments on their requests'
    ELSE 'FAIL: Client cannot view comments on their requests'
  END AS result
FROM comments WHERE request_id = 'req11111-1111-1111-1111-111111111111';

-- Set session as Client 2
SET LOCAL request.jwt.claim.sub = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

\echo 'Client should NOT see comments on other clients requests...'
SELECT
  CASE
    WHEN COUNT(*) = 0
    THEN 'PASS: Client cannot view other clients comments'
    ELSE 'FAIL: Client can view other clients comments (security breach!)'
  END AS result
FROM comments WHERE request_id = 'req11111-1111-1111-1111-111111111111';

-- =============================================================================
-- TEST 7: UNAUTHENTICATED ACCESS
-- =============================================================================

\echo ''
\echo '========================================='
\echo 'TEST 7: Unauthenticated Access'
\echo '========================================='

-- Reset session (simulate unauthenticated user)
RESET request.jwt.claim.sub;

\echo 'Unauthenticated user should see NO clients...'
SELECT
  CASE
    WHEN COUNT(*) = 0
    THEN 'PASS: Unauthenticated users cannot view clients'
    ELSE 'FAIL: Unauthenticated users can view clients (security breach!)'
  END AS result
FROM clients;

\echo 'Unauthenticated user should see NO requests...'
SELECT
  CASE
    WHEN COUNT(*) = 0
    THEN 'PASS: Unauthenticated users cannot view requests'
    ELSE 'FAIL: Unauthenticated users can view requests (security breach!)'
  END AS result
FROM requests;

\echo 'Unauthenticated user should see NO admin users...'
SELECT
  CASE
    WHEN COUNT(*) = 0
    THEN 'PASS: Unauthenticated users cannot view admin users'
    ELSE 'FAIL: Unauthenticated users can view admin users (security breach!)'
  END AS result
FROM admin_users;

-- =============================================================================
-- TEST SUMMARY
-- =============================================================================

\echo ''
\echo '========================================='
\echo 'RLS POLICY TEST SUITE COMPLETE'
\echo '========================================='
\echo ''
\echo 'Review the results above. All tests should show PASS.'
\echo 'Any FAIL results indicate a security vulnerability.'
\echo ''

-- Clean up test data
-- DELETE FROM comments WHERE id = 'comment1-1111-1111-1111-111111111111';
-- DELETE FROM assets WHERE id = 'asset111-1111-1111-1111-111111111111';
-- DELETE FROM requests WHERE id LIKE 'req%';
-- DELETE FROM admin_users WHERE id IN ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');
-- DELETE FROM clients WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
