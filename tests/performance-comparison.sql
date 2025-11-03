-- Performance Comparison: Before vs After Index Implementation
-- Run these queries to compare performance with and without indexes

-- =============================================================================
-- SETUP: Create Sample Data (Run this first if database is empty)
-- =============================================================================

-- Uncomment and run if you need test data
/*
-- Insert sample clients
INSERT INTO clients (email, company_name, contact_name, status, auth_user_id)
SELECT
  'client' || i || '@example.com',
  'Company ' || i,
  'Contact ' || i,
  CASE WHEN i % 4 = 0 THEN 'churned' ELSE 'active' END,
  gen_random_uuid()
FROM generate_series(1, 1000) i;

-- Insert sample requests
INSERT INTO requests (client_id, title, description, type, priority, status)
SELECT
  (SELECT id FROM clients ORDER BY random() LIMIT 1),
  'Request ' || i || ': ' || (ARRAY['Website Redesign', 'Logo Design', 'Mobile App', 'API Integration', 'Bug Fix'])[floor(random() * 5 + 1)],
  'Description for request ' || i || '. This is a detailed description with multiple words for testing full-text search functionality.',
  (ARRAY['design', 'development', 'ai_automation', 'strategy'])[floor(random() * 4 + 1)],
  (ARRAY['urgent', 'high', 'normal', 'low'])[floor(random() * 4 + 1)],
  (ARRAY['backlog', 'up_next', 'in_progress', 'review', 'done', 'cancelled'])[floor(random() * 6 + 1)]
FROM generate_series(1, 10000) i;

-- Insert sample comments
INSERT INTO comments (request_id, author_id, author_type, author_name, content)
SELECT
  (SELECT id FROM requests ORDER BY random() LIMIT 1),
  gen_random_uuid(),
  (ARRAY['client', 'admin'])[floor(random() * 2 + 1)],
  'User ' || i,
  'Comment content ' || i || '. This has some searchable text about design and development work.'
FROM generate_series(1, 50000) i;

-- Insert sample subscriptions
INSERT INTO subscriptions (client_id, stripe_customer_id, stripe_price_id, plan_type, plan_amount, status)
SELECT
  id,
  'cus_' || substr(md5(random()::text), 1, 14),
  'price_' || substr(md5(random()::text), 1, 14),
  (ARRAY['core', 'premium'])[floor(random() * 2 + 1)],
  (ARRAY[99900, 199900])[floor(random() * 2 + 1)],
  (ARRAY['active', 'trialing', 'past_due', 'cancelled'])[floor(random() * 4 + 1)]
FROM clients;

-- Update statistics
ANALYZE;
*/

-- =============================================================================
-- PERFORMANCE TEST 1: Client's Active Requests
-- =============================================================================

\echo '=== TEST 1: Client Active Requests ==='
\echo 'Should use: idx_requests_client_status, idx_requests_active_status'

-- Get a sample client_id
DO $$
DECLARE
  sample_client_id uuid;
BEGIN
  SELECT id INTO sample_client_id FROM clients LIMIT 1;
  RAISE NOTICE 'Testing with client_id: %', sample_client_id;
END $$;

-- Run with timing
\timing on

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  r.id,
  r.title,
  r.status,
  r.priority,
  r.created_at
FROM requests r
WHERE r.client_id = (SELECT id FROM clients LIMIT 1)
  AND r.status IN ('backlog', 'up_next', 'in_progress', 'review')
ORDER BY r.priority DESC, r.created_at DESC
LIMIT 20;

\echo ''
\echo 'Expected: Index Scan or Bitmap Index Scan'
\echo 'Target: < 50ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 2: Admin Dashboard - Assigned Work
-- =============================================================================

\echo '=== TEST 2: Admin Assigned Work ==='
\echo 'Should use: idx_requests_assigned_status, idx_requests_in_progress'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  r.id,
  r.title,
  r.client_id,
  r.priority,
  r.created_at
FROM requests r
WHERE r.assigned_to = (SELECT id FROM admin_users LIMIT 1)
  AND r.status = 'in_progress'
ORDER BY r.priority DESC, r.created_at DESC
LIMIT 20;

\echo ''
\echo 'Expected: Index Scan using idx_requests_assigned_status or idx_requests_in_progress'
\echo 'Target: < 20ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 3: High Priority Requests
-- =============================================================================

\echo '=== TEST 3: High Priority Requests ==='
\echo 'Should use: idx_requests_high_priority (partial index)'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  r.id,
  r.title,
  r.client_id,
  r.priority,
  r.status,
  r.created_at
FROM requests r
WHERE r.priority IN ('urgent', 'high')
  AND r.status NOT IN ('done', 'cancelled')
ORDER BY r.created_at DESC
LIMIT 20;

\echo ''
\echo 'Expected: Bitmap Index Scan using idx_requests_high_priority'
\echo 'Target: < 30ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 4: Active Subscriptions
-- =============================================================================

\echo '=== TEST 4: Active Subscriptions ==='
\echo 'Should use: idx_subscriptions_active_status (partial index)'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  s.id,
  s.client_id,
  s.plan_type,
  s.current_period_end,
  c.company_name
FROM subscriptions s
JOIN clients c ON c.id = s.client_id
WHERE s.status = 'active'
ORDER BY s.current_period_end ASC
LIMIT 20;

\echo ''
\echo 'Expected: Index Scan using idx_subscriptions_active_status'
\echo 'Target: < 20ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 5: Expiring Subscriptions
-- =============================================================================

\echo '=== TEST 5: Expiring Subscriptions ==='
\echo 'Should use: idx_subscriptions_expiring_soon (partial index)'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  s.id,
  s.client_id,
  s.current_period_end,
  c.company_name,
  c.email
FROM subscriptions s
JOIN clients c ON c.id = s.client_id
WHERE s.status = 'active'
  AND s.current_period_end < now() + interval '7 days'
  AND s.current_period_end > now()
ORDER BY s.current_period_end ASC;

\echo ''
\echo 'Expected: Index Scan using idx_subscriptions_expiring_soon'
\echo 'Target: < 30ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 6: Unread Notifications
-- =============================================================================

\echo '=== TEST 6: Unread Notifications ==='
\echo 'Should use: idx_notifications_unread (partial index)'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  n.id,
  n.title,
  n.message,
  n.type,
  n.created_at
FROM notifications n
WHERE n.user_id = (SELECT auth_user_id FROM clients LIMIT 1)
  AND n.read = false
ORDER BY n.created_at DESC
LIMIT 20;

\echo ''
\echo 'Expected: Index Scan using idx_notifications_unread'
\echo 'Target: < 10ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 7: Request Comments Thread
-- =============================================================================

\echo '=== TEST 7: Request Comments ==='
\echo 'Should use: idx_comments_request_created'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  c.id,
  c.author_name,
  c.author_type,
  c.content,
  c.created_at
FROM comments c
WHERE c.request_id = (SELECT id FROM requests LIMIT 1)
ORDER BY c.created_at DESC
LIMIT 50;

\echo ''
\echo 'Expected: Index Scan using idx_comments_request_created'
\echo 'Target: < 20ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 8: Request Assets
-- =============================================================================

\echo '=== TEST 8: Request Deliverables ==='
\echo 'Should use: idx_assets_request_type'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  a.id,
  a.file_name,
  a.file_type,
  a.asset_type,
  a.created_at
FROM assets a
WHERE a.request_id = (SELECT id FROM requests LIMIT 1)
  AND a.asset_type = 'deliverable'
ORDER BY a.created_at DESC;

\echo ''
\echo 'Expected: Index Scan using idx_assets_request_type'
\echo 'Target: < 15ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 9: Full-Text Search on Requests
-- =============================================================================

\echo '=== TEST 9: Full-Text Search ==='
\echo 'Should use: idx_requests_full_text_search (GIN index)'

-- Only run if there's searchable content
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM requests WHERE title ILIKE '%design%' LIMIT 1) THEN
    RAISE NOTICE 'Running full-text search test...';
  ELSE
    RAISE NOTICE 'Skipping full-text search test (no searchable data)';
  END IF;
END $$;

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  r.id,
  r.title,
  r.description,
  ts_rank(
    to_tsvector('english', r.title || ' ' || COALESCE(r.description, '')),
    to_tsquery('english', 'design')
  ) AS rank
FROM requests r
WHERE to_tsvector('english', r.title || ' ' || COALESCE(r.description, ''))
      @@ to_tsquery('english', 'design')
ORDER BY rank DESC
LIMIT 20;

\echo ''
\echo 'Expected: Bitmap Index Scan using idx_requests_full_text_search'
\echo 'Target: < 200ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 10: Complex Dashboard Query
-- =============================================================================

\echo '=== TEST 10: Complex Dashboard Query ==='
\echo 'Should use: Multiple indexes combined'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  c.company_name,
  COUNT(DISTINCT r.id) as total_requests,
  COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'in_progress') as in_progress,
  COUNT(DISTINCT r.id) FILTER (WHERE r.priority IN ('urgent', 'high')) as high_priority,
  COUNT(DISTINCT cm.id) as total_comments,
  s.plan_type,
  s.status as subscription_status
FROM clients c
LEFT JOIN requests r ON r.client_id = c.id
  AND r.status NOT IN ('done', 'cancelled')
LEFT JOIN comments cm ON cm.request_id = r.id
LEFT JOIN subscriptions s ON s.client_id = c.id
  AND s.status = 'active'
WHERE c.status = 'active'
GROUP BY c.id, c.company_name, s.plan_type, s.status
ORDER BY total_requests DESC
LIMIT 20;

\echo ''
\echo 'Expected: Multiple index scans, nested loops'
\echo 'Target: < 100ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 11: Date Range Query
-- =============================================================================

\echo '=== TEST 11: Recent Requests ==='
\echo 'Should use: idx_requests_created_at or idx_requests_updated_at'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  r.id,
  r.title,
  r.status,
  r.created_at,
  c.company_name
FROM requests r
JOIN clients c ON c.id = r.client_id
WHERE r.created_at >= now() - interval '7 days'
ORDER BY r.created_at DESC
LIMIT 50;

\echo ''
\echo 'Expected: Index Scan using idx_requests_created_at'
\echo 'Target: < 50ms execution time'
\echo ''

-- =============================================================================
-- PERFORMANCE TEST 12: Composite Index Test
-- =============================================================================

\echo '=== TEST 12: Status + Priority Filter ==='
\echo 'Should use: idx_requests_status_priority (composite index)'

EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT
  r.id,
  r.title,
  r.status,
  r.priority,
  r.created_at
FROM requests r
WHERE r.status = 'backlog'
ORDER BY r.priority DESC, r.created_at DESC
LIMIT 20;

\echo ''
\echo 'Expected: Index Scan using idx_requests_status_priority'
\echo 'Target: < 20ms execution time'
\echo ''

\timing off

-- =============================================================================
-- SUMMARY: Index Usage Statistics
-- =============================================================================

\echo ''
\echo '=== INDEX USAGE SUMMARY ==='

-- Show which indexes were used most
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as times_used,
  idx_tup_read as tuples_read,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan > 0
ORDER BY idx_scan DESC
LIMIT 20;

\echo ''
\echo '=== PERFORMANCE SUMMARY ==='

-- Sequential vs Index Scans
SELECT
  tablename,
  seq_scan as sequential_scans,
  idx_scan as index_scans,
  CASE
    WHEN seq_scan + idx_scan > 0
    THEN ROUND(100.0 * idx_scan / (seq_scan + idx_scan), 2)
    ELSE 0
  END as index_scan_percent
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

\echo ''
\echo '=== CACHE HIT RATIO ==='

-- Cache efficiency (should be > 99%)
SELECT
  'cache_hit_ratio' as metric,
  ROUND(
    100.0 * sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0),
    2
  ) as percentage
FROM pg_statio_user_tables
WHERE schemaname = 'public';

\echo ''
\echo '=== TEST COMPLETE ==='
\echo 'Review the EXPLAIN ANALYZE output above:'
\echo '- Look for "Index Scan" or "Bitmap Index Scan" (GOOD)'
\echo '- Avoid "Seq Scan" on large tables (BAD)'
\echo '- Check execution times meet targets'
\echo '- Verify indexes are being used (idx_scan > 0)'
\echo ''
\echo 'For detailed documentation, see DATABASE_INDEXES.md'
