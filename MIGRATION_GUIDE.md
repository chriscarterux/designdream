# Database Index Migration Guide

## Overview

This guide explains how to apply the performance index migration to your Supabase database.

**Migration File:** `supabase/migrations/20251103000000_add_performance_indexes.sql`
**Documentation:** `DATABASE_INDEXES.md`
**Verification Script:** `tests/verify-indexes.sql`

---

## Pre-Migration Checklist

- [ ] Review migration file: `supabase/migrations/20251103000000_add_performance_indexes.sql`
- [ ] Read documentation: `DATABASE_INDEXES.md`
- [ ] Backup database (automatic in Supabase)
- [ ] Verify Supabase project is accessible
- [ ] Have database connection URL ready

---

## Migration Steps

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy Migration SQL**
   ```bash
   cat supabase/migrations/20251103000000_add_performance_indexes.sql
   ```

4. **Paste and Execute**
   - Paste the SQL into the editor
   - Click "Run" or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)
   - Wait for completion (should take 1-5 seconds on empty DB, longer with data)

5. **Verify Success**
   - Check for "Success" message
   - No error messages should appear
   - All `CREATE INDEX` statements should complete

### Option 2: Supabase CLI

If you have Supabase CLI configured:

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref

# Push migration
npx supabase db push
```

### Option 3: Direct Database Connection

If you have direct database access:

```bash
# Using psql
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" \
  -f supabase/migrations/20251103000000_add_performance_indexes.sql

# Or using Supabase connection string from .env.local
psql "$DATABASE_URL" \
  -f supabase/migrations/20251103000000_add_performance_indexes.sql
```

---

## Post-Migration Verification

### 1. Quick Verification (Supabase Dashboard)

Run this query in SQL Editor to check index count:

```sql
SELECT
  tablename,
  COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Expected Results:**
- `clients`: ~10-12 indexes
- `requests`: ~20-25 indexes
- `subscriptions`: ~10-12 indexes
- `comments`: ~5-7 indexes
- `assets`: ~7-9 indexes
- `deliverables`: ~7-9 indexes
- `sla_records`: ~6-8 indexes
- `notifications`: ~5-7 indexes

### 2. Full Verification (Run Test Script)

Copy the verification script to SQL Editor:

```bash
cat tests/verify-indexes.sql
```

Or run directly if you have psql access:

```bash
psql "$DATABASE_URL" -f tests/verify-indexes.sql
```

This will:
- ✅ List all indexes with sizes
- ✅ Check for missing expected indexes
- ✅ Test query plans (verify indexes are used)
- ✅ Show index usage statistics
- ✅ Display storage usage
- ✅ Provide performance metrics

### 3. Test Common Queries

Test these queries to ensure indexes are being used:

```sql
-- Test 1: Should use idx_requests_client_status
EXPLAIN ANALYZE
SELECT * FROM requests
WHERE client_id = (SELECT id FROM clients LIMIT 1)
  AND status = 'in_progress';

-- Test 2: Should use idx_subscriptions_active_status (partial index)
EXPLAIN ANALYZE
SELECT * FROM subscriptions
WHERE status = 'active'
ORDER BY current_period_end;

-- Test 3: Should use idx_notifications_unread (partial index)
EXPLAIN ANALYZE
SELECT * FROM notifications
WHERE user_id = (SELECT auth_user_id FROM clients LIMIT 1)
  AND read = false
ORDER BY created_at DESC;
```

**Look for:**
- "Index Scan" or "Bitmap Index Scan" (✅ Good)
- NOT "Seq Scan" (❌ Bad - means index not used)
- Execution time < 100ms for most queries

---

## Rollback Plan

If issues occur, rollback by dropping the new indexes:

### Create Rollback Script

Save as `rollback_indexes.sql`:

```sql
-- Rollback script: Drop indexes created in 20251103000000_add_performance_indexes.sql
-- Only drops NEW indexes, preserves original schema indexes

-- Clients
DROP INDEX IF EXISTS idx_clients_stripe_customer_id;
DROP INDEX IF EXISTS idx_clients_created_at;
DROP INDEX IF EXISTS idx_clients_company_name;
DROP INDEX IF EXISTS idx_clients_company_search;
DROP INDEX IF EXISTS idx_clients_tech_stack_gin;
DROP INDEX IF EXISTS idx_clients_status_created;
DROP INDEX IF EXISTS idx_clients_active;

-- Subscriptions
DROP INDEX IF EXISTS idx_subscriptions_stripe_subscription_id;
DROP INDEX IF EXISTS idx_subscriptions_current_period_end;
DROP INDEX IF EXISTS idx_subscriptions_plan_type;
DROP INDEX IF EXISTS idx_subscriptions_created_at;
DROP INDEX IF EXISTS idx_subscriptions_status_period_end;
DROP INDEX IF EXISTS idx_subscriptions_client_status;
DROP INDEX IF EXISTS idx_subscriptions_active_status;
DROP INDEX IF EXISTS idx_subscriptions_expiring_soon;
DROP INDEX IF EXISTS idx_subscriptions_past_due;

-- Requests (additional indexes only)
DROP INDEX IF EXISTS idx_requests_updated_at;
DROP INDEX IF EXISTS idx_requests_started_at;
DROP INDEX IF EXISTS idx_requests_completed_at;
DROP INDEX IF EXISTS idx_requests_timeline_ideal;
DROP INDEX IF EXISTS idx_requests_timeline_hard;
DROP INDEX IF EXISTS idx_requests_client_priority;
DROP INDEX IF EXISTS idx_requests_type_status;
DROP INDEX IF EXISTS idx_requests_status_updated;
DROP INDEX IF EXISTS idx_requests_active_status;
DROP INDEX IF EXISTS idx_requests_in_progress;
DROP INDEX IF EXISTS idx_requests_high_priority;
DROP INDEX IF EXISTS idx_requests_title_search;
DROP INDEX IF EXISTS idx_requests_description_search;
DROP INDEX IF EXISTS idx_requests_full_text_search;
DROP INDEX IF EXISTS idx_requests_success_criteria_gin;
DROP INDEX IF EXISTS idx_requests_deliverable_types_gin;

-- Assets
DROP INDEX IF EXISTS idx_assets_created_at;
DROP INDEX IF EXISTS idx_assets_storage_bucket;
DROP INDEX IF EXISTS idx_assets_uploaded_by_role;
DROP INDEX IF EXISTS idx_assets_request_type;
DROP INDEX IF EXISTS idx_assets_request_created;
DROP INDEX IF EXISTS idx_assets_client_uploads;
DROP INDEX IF EXISTS idx_assets_admin_deliverables;

-- Comments
DROP INDEX IF EXISTS idx_comments_request_created;
DROP INDEX IF EXISTS idx_comments_author_type;
DROP INDEX IF EXISTS idx_comments_content_search;

-- Deliverables
DROP INDEX IF EXISTS idx_deliverables_created_at;
DROP INDEX IF EXISTS idx_deliverables_delivery_type;
DROP INDEX IF EXISTS idx_deliverables_approved_at;
DROP INDEX IF EXISTS idx_deliverables_request_status;
DROP INDEX IF EXISTS idx_deliverables_status_delivered;
DROP INDEX IF EXISTS idx_deliverables_pending;
DROP INDEX IF EXISTS idx_deliverables_title_search;
DROP INDEX IF EXISTS idx_deliverables_description_search;

-- SLA Records
DROP INDEX IF EXISTS idx_sla_records_completed_at;
DROP INDEX IF EXISTS idx_sla_records_violation_severity;
DROP INDEX IF EXISTS idx_sla_records_status_started;
DROP INDEX IF EXISTS idx_sla_records_request_status;
DROP INDEX IF EXISTS idx_sla_records_active;
DROP INDEX IF EXISTS idx_sla_records_violated;

-- Notifications
DROP INDEX IF EXISTS idx_notifications_type;
DROP INDEX IF EXISTS idx_notifications_created_at;
DROP INDEX IF EXISTS idx_notifications_read_at;
DROP INDEX IF EXISTS idx_notifications_unread;

-- Basecamp Integrations
DROP INDEX IF EXISTS idx_basecamp_integrations_sync_enabled;
DROP INDEX IF EXISTS idx_basecamp_integrations_last_sync_at;

-- Admin Users
DROP INDEX IF EXISTS idx_admin_users_role;
DROP INDEX IF EXISTS idx_admin_users_status;
DROP INDEX IF EXISTS idx_admin_users_created_at;

-- Update statistics
ANALYZE;

SELECT 'Rollback complete - new indexes removed' as status;
```

### Execute Rollback

```sql
-- In Supabase SQL Editor or via psql
\i rollback_indexes.sql
```

---

## Performance Testing

### Before Migration Baseline

If you have data, capture baseline metrics before migration:

```sql
-- Save these results to compare after migration
SELECT
  schemaname,
  tablename,
  seq_scan as sequential_scans,
  idx_scan as index_scans,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY seq_scan DESC;
```

### After Migration Testing

1. **Run verification script** (see above)
2. **Test common queries** with `EXPLAIN ANALYZE`
3. **Monitor for 24-48 hours**:
   - Check query response times in application
   - Monitor database CPU/memory usage
   - Check for slow query logs

### Expected Improvements

With 10,000+ rows per table:

| Query Type | Before | After | Improvement |
|------------|--------|-------|-------------|
| Simple WHERE | 50-200ms | 5-20ms | 10x faster |
| Complex filters | 200-1000ms | 20-100ms | 10x faster |
| Full-text search | 500-2000ms | 50-200ms | 10x faster |
| Dashboard queries | 500-2000ms | 50-200ms | 10x faster |

**Note:** With < 1,000 rows, improvements may be minimal. Indexes show benefits at scale.

---

## Monitoring After Migration

### 1. Check Index Usage (After 1 Week)

```sql
-- Indexes that are NOT being used
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as times_used,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan < 10  -- Used less than 10 times
ORDER BY pg_relation_size(indexrelid) DESC;
```

If indexes are unused after 1-2 weeks, consider removing them.

### 2. Monitor Write Performance

```sql
-- Check for write slowdowns
SELECT
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_tup_upd + n_tup_ins + n_tup_del DESC;
```

If write operations slow down significantly, too many indexes may be the cause.

### 3. Index Bloat Check (Monthly)

```sql
-- Check for index bloat
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;
```

If indexes grow very large without proportional usage, consider REINDEX.

---

## Troubleshooting

### Issue: Migration Times Out

**Solution:**
- Break migration into smaller chunks
- Run index creation statements one table at a time
- Use `CREATE INDEX CONCURRENTLY` (doesn't lock table)

### Issue: Out of Memory

**Solution:**
- Indexes on large tables can consume memory during creation
- Create indexes during off-peak hours
- Upgrade database plan temporarily if needed

### Issue: Indexes Not Being Used

**Possible Causes:**
1. **Statistics outdated** - Run `ANALYZE table_name;`
2. **Table too small** - < 1000 rows, Seq Scan may be faster
3. **Query doesn't match index** - Check query pattern vs index columns
4. **Wrong column order** - Composite indexes are order-sensitive

**Debug:**
```sql
-- Check if index is being used
EXPLAIN ANALYZE your_slow_query;

-- Update statistics
ANALYZE table_name;

-- Retry query
EXPLAIN ANALYZE your_slow_query;
```

### Issue: Queries Slower After Migration

**Very Rare - Possible Causes:**
1. **Wrong index chosen by planner** - Update statistics with `ANALYZE`
2. **Index bloat** - Run `REINDEX` on specific indexes
3. **Too many indexes** - Consider removing redundant indexes

**Debug:**
```sql
-- Compare query plans
EXPLAIN (ANALYZE, BUFFERS) your_query;
```

---

## Maintenance Schedule

### Weekly
- [ ] Review slow query logs
- [ ] Check index usage statistics
- [ ] Monitor database performance metrics

### Monthly
- [ ] Review unused indexes (< 10 scans)
- [ ] Check index sizes and bloat
- [ ] Update statistics: `ANALYZE;`

### Quarterly
- [ ] Full performance audit
- [ ] Consider adding new indexes for new features
- [ ] Remove confirmed unused indexes
- [ ] REINDEX if bloat detected

---

## Success Criteria

✅ Migration successful if:
- All `CREATE INDEX` statements complete without errors
- No application errors after deployment
- Query response times improve or stay the same
- No significant increase in database CPU/memory usage
- Index usage statistics show indexes being used (after 1 week)

---

## Additional Resources

- [Database Indexes Documentation](./DATABASE_INDEXES.md)
- [PostgreSQL Index Documentation](https://www.postgresql.org/docs/current/indexes.html)
- [Supabase Performance Guide](https://supabase.com/docs/guides/database/performance)
- [Use The Index, Luke!](https://use-the-index-luke.com/)

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review `DATABASE_INDEXES.md` for index details
3. Run `tests/verify-indexes.sql` for diagnostics
4. Check Supabase dashboard for errors

**Rollback** if critical issues occur (see Rollback Plan section).

---

**Migration Date:** _____________
**Applied By:** _____________
**Verification Status:** ☐ Passed ☐ Failed
**Notes:**

---
