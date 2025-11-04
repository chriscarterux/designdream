-- Index Verification and Performance Testing Script
-- Run this script after applying the migration to verify indexes and test performance

-- =============================================================================
-- PART 1: VERIFY ALL INDEXES EXIST
-- =============================================================================

\echo '=== Verifying Index Creation ==='

-- Count indexes per table
SELECT
  tablename,
  COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY index_count DESC;

-- List all indexes with their sizes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) as size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =============================================================================
-- PART 2: CHECK FOR MISSING INDEXES (EXPECTED VS ACTUAL)
-- =============================================================================

\echo '=== Checking for Missing Expected Indexes ==='

-- Expected indexes for clients table
SELECT 'clients' as table_name,
       indexname,
       CASE WHEN indexname IS NULL THEN 'MISSING' ELSE 'EXISTS' END as status
FROM (VALUES
  ('idx_clients_email'),
  ('idx_clients_auth_user_id'),
  ('idx_clients_status'),
  ('idx_clients_stripe_customer_id'),
  ('idx_clients_created_at'),
  ('idx_clients_company_name'),
  ('idx_clients_company_search'),
  ('idx_clients_tech_stack_gin'),
  ('idx_clients_status_created'),
  ('idx_clients_active')
) AS expected(indexname)
LEFT JOIN pg_indexes ON pg_indexes.indexname = expected.indexname
  AND pg_indexes.tablename = 'clients'
  AND pg_indexes.schemaname = 'public';

-- Expected indexes for requests table
SELECT 'requests' as table_name,
       indexname,
       CASE WHEN indexname IS NULL THEN 'MISSING' ELSE 'EXISTS' END as status
FROM (VALUES
  ('idx_requests_client_id'),
  ('idx_requests_status'),
  ('idx_requests_priority'),
  ('idx_requests_assigned_to'),
  ('idx_requests_created_at'),
  ('idx_requests_updated_at'),
  ('idx_requests_client_status'),
  ('idx_requests_status_priority'),
  ('idx_requests_assigned_status'),
  ('idx_requests_client_priority'),
  ('idx_requests_type_status'),
  ('idx_requests_status_updated'),
  ('idx_requests_active_status'),
  ('idx_requests_in_progress'),
  ('idx_requests_high_priority'),
  ('idx_requests_title_search'),
  ('idx_requests_description_search'),
  ('idx_requests_full_text_search')
) AS expected(indexname)
LEFT JOIN pg_indexes ON pg_indexes.indexname = expected.indexname
  AND pg_indexes.tablename = 'requests'
  AND pg_indexes.schemaname = 'public';

-- Expected indexes for subscriptions table
SELECT 'subscriptions' as table_name,
       indexname,
       CASE WHEN indexname IS NULL THEN 'MISSING' ELSE 'EXISTS' END as status
FROM (VALUES
  ('idx_subscriptions_client_id'),
  ('idx_subscriptions_stripe_customer_id'),
  ('idx_subscriptions_stripe_subscription_id'),
  ('idx_subscriptions_status'),
  ('idx_subscriptions_current_period_end'),
  ('idx_subscriptions_status_period_end'),
  ('idx_subscriptions_client_status'),
  ('idx_subscriptions_active_status'),
  ('idx_subscriptions_expiring_soon'),
  ('idx_subscriptions_past_due')
) AS expected(indexname)
LEFT JOIN pg_indexes ON pg_indexes.indexname = expected.indexname
  AND pg_indexes.tablename = 'subscriptions'
  AND pg_indexes.schemaname = 'public';

-- =============================================================================
-- PART 3: ANALYZE QUERY PLANS (VERIFY INDEXES ARE USED)
-- =============================================================================

\echo '=== Testing Query Plans ==='

-- Test 1: Client's active requests
EXPLAIN ANALYZE
SELECT * FROM requests
WHERE client_id = (SELECT id FROM clients LIMIT 1)
  AND status IN ('backlog', 'up_next', 'in_progress')
ORDER BY priority DESC, created_at DESC
LIMIT 20;

-- Test 2: Admin's assigned work
EXPLAIN ANALYZE
SELECT * FROM requests
WHERE assigned_to = (SELECT id FROM admin_users LIMIT 1)
  AND status = 'in_progress'
ORDER BY created_at DESC
LIMIT 20;

-- Test 3: High priority requests
EXPLAIN ANALYZE
SELECT * FROM requests
WHERE priority IN ('urgent', 'high')
  AND status NOT IN ('done', 'cancelled')
ORDER BY created_at DESC
LIMIT 20;

-- Test 4: Active subscriptions
EXPLAIN ANALYZE
SELECT * FROM subscriptions
WHERE status = 'active'
ORDER BY current_period_end ASC
LIMIT 20;

-- Test 5: Unread notifications
EXPLAIN ANALYZE
SELECT * FROM notifications
WHERE user_id = (SELECT auth_user_id FROM clients LIMIT 1)
  AND read = false
ORDER BY created_at DESC
LIMIT 20;

-- Test 6: Request comments
EXPLAIN ANALYZE
SELECT * FROM comments
WHERE request_id = (SELECT id FROM requests LIMIT 1)
ORDER BY created_at DESC;

-- Test 7: Request assets
EXPLAIN ANALYZE
SELECT * FROM assets
WHERE request_id = (SELECT id FROM requests LIMIT 1)
  AND asset_type = 'deliverable'
ORDER BY created_at DESC;

-- Test 8: Full-text search (if data exists)
-- EXPLAIN ANALYZE
-- SELECT * FROM requests
-- WHERE to_tsvector('english', title || ' ' || COALESCE(description, ''))
--       @@ to_tsquery('english', 'design')
-- ORDER BY updated_at DESC
-- LIMIT 20;

-- =============================================================================
-- PART 4: INDEX USAGE STATISTICS
-- =============================================================================

\echo '=== Index Usage Statistics ==='

-- Most used indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 20;

-- Unused indexes (potential candidates for removal)
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexrelid NOT IN (
    SELECT conindid FROM pg_constraint WHERE conindid IS NOT NULL
  )
ORDER BY pg_relation_size(indexrelid) DESC;

-- =============================================================================
-- PART 5: TABLE AND INDEX SIZES
-- =============================================================================

\echo '=== Storage Usage ==='

-- Total size by table (table + indexes)
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) -
                 pg_relation_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index size breakdown per table
SELECT
  tablename,
  COUNT(*) as index_count,
  pg_size_pretty(SUM(pg_relation_size(schemaname||'.'||indexname))) as total_index_size
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY SUM(pg_relation_size(schemaname||'.'||indexname)) DESC;

-- =============================================================================
-- PART 6: PERFORMANCE METRICS
-- =============================================================================

\echo '=== Performance Metrics ==='

-- Sequential scans vs index scans
SELECT
  schemaname,
  tablename,
  seq_scan as sequential_scans,
  idx_scan as index_scans,
  CASE
    WHEN seq_scan + idx_scan > 0
    THEN ROUND(100.0 * idx_scan / (seq_scan + idx_scan), 2)
    ELSE 0
  END as index_scan_percent,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY seq_scan DESC;

-- Cache hit ratio (should be > 99%)
SELECT
  'cache_hit_ratio' as metric,
  ROUND(
    100.0 * sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0),
    2
  ) as percentage
FROM pg_statio_user_tables
WHERE schemaname = 'public';

-- =============================================================================
-- PART 7: RECOMMENDATIONS
-- =============================================================================

\echo '=== Index Recommendations ==='

-- Tables with high sequential scan ratio
SELECT
  schemaname,
  tablename,
  seq_scan,
  idx_scan,
  n_live_tup as row_count,
  'Consider adding indexes' as recommendation
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND seq_scan > idx_scan
  AND seq_scan > 1000
  AND n_live_tup > 1000
ORDER BY seq_scan DESC;

-- Large tables without indexes
SELECT
  t.schemaname,
  t.tablename,
  pg_size_pretty(pg_relation_size(t.schemaname||'.'||t.tablename)) as table_size,
  COUNT(i.indexname) as index_count,
  'May need more indexes' as recommendation
FROM pg_tables t
LEFT JOIN pg_indexes i ON i.schemaname = t.schemaname AND i.tablename = t.tablename
WHERE t.schemaname = 'public'
GROUP BY t.schemaname, t.tablename
HAVING COUNT(i.indexname) < 3
  AND pg_relation_size(t.schemaname||'.'||t.tablename) > 1024*1024
ORDER BY pg_relation_size(t.schemaname||'.'||t.tablename) DESC;

\echo '=== Verification Complete ==='
\echo 'Review the output above to ensure all indexes are created and being used effectively.'
