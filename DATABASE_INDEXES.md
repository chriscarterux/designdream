# Database Indexes Documentation

## Overview

This document details all database indexes implemented in the Design Dreams application. Proper indexing is critical for query performance, especially as the database grows.

**Last Updated:** 2025-11-03
**Migration:** `20251103000000_add_performance_indexes.sql`

---

## Index Strategy

### Types of Indexes Implemented

1. **Standard B-tree Indexes** - Default PostgreSQL indexes for equality and range queries
2. **Composite Indexes** - Multi-column indexes for common query patterns
3. **Partial Indexes** - Filtered indexes for subset queries (more efficient)
4. **Full-Text Search (GIN)** - Text search indexes using PostgreSQL's tsvector
5. **JSONB (GIN)** - JSON document indexes for queries on JSON columns

---

## Standard Indexes by Table

### Clients Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_clients_email` | `email` | Fast user lookup by email | `WHERE email = ?` |
| `idx_clients_auth_user_id` | `auth_user_id` | Join with auth.users | `JOIN ON auth_user_id` |
| `idx_clients_status` | `status` | Filter by client status | `WHERE status = 'active'` |
| `idx_clients_stripe_customer_id` | `stripe_customer_id` | Stripe webhook lookups | `WHERE stripe_customer_id = ?` |
| `idx_clients_created_at` | `created_at DESC` | Sort by newest clients | `ORDER BY created_at DESC` |
| `idx_clients_company_name` | `company_name` | Search/sort by company | `ORDER BY company_name` |

**Common Queries:**
```sql
-- Dashboard: Active clients list
SELECT * FROM clients WHERE status = 'active' ORDER BY created_at DESC;

-- Stripe webhook: Find client by Stripe ID
SELECT * FROM clients WHERE stripe_customer_id = 'cus_xxx';
```

---

### Admin Users Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_admin_users_auth_user_id` | `auth_user_id` | Authentication lookup | `WHERE auth_user_id = auth.uid()` |
| `idx_admin_users_email` | `email` | Email-based queries | `WHERE email = ?` |
| `idx_admin_users_role` | `role` | Filter by role | `WHERE role = 'admin'` |
| `idx_admin_users_status` | `status` | Filter active admins | `WHERE status = 'active'` |
| `idx_admin_users_created_at` | `created_at DESC` | Sort by creation date | `ORDER BY created_at DESC` |

**Common Queries:**
```sql
-- Check if user is admin (used in RLS policies)
SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid();

-- List all admins by role
SELECT * FROM admin_users WHERE status = 'active' ORDER BY role, name;
```

---

### Subscriptions Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_subscriptions_client_id` | `client_id` | Client subscription lookup | `WHERE client_id = ?` |
| `idx_subscriptions_stripe_customer_id` | `stripe_customer_id` | Stripe webhooks | `WHERE stripe_customer_id = ?` |
| `idx_subscriptions_stripe_subscription_id` | `stripe_subscription_id` | Stripe subscription lookup | `WHERE stripe_subscription_id = ?` |
| `idx_subscriptions_status` | `status` | Filter by subscription status | `WHERE status = 'active'` |
| `idx_subscriptions_current_period_end` | `current_period_end` | Expiration tracking | `WHERE current_period_end < ?` |
| `idx_subscriptions_plan_type` | `plan_type` | Filter by plan type | `WHERE plan_type = 'premium'` |
| `idx_subscriptions_created_at` | `created_at DESC` | Sort by creation date | `ORDER BY created_at DESC` |

**Common Queries:**
```sql
-- Get client's active subscription
SELECT * FROM subscriptions WHERE client_id = ? AND status = 'active';

-- Find subscriptions expiring soon
SELECT * FROM subscriptions
WHERE status = 'active'
  AND current_period_end < now() + interval '7 days'
ORDER BY current_period_end;
```

---

### Requests Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_requests_client_id` | `client_id` | Client's requests | `WHERE client_id = ?` |
| `idx_requests_status` | `status` | Filter by status | `WHERE status = 'in_progress'` |
| `idx_requests_priority` | `priority` | Filter by priority | `WHERE priority = 'urgent'` |
| `idx_requests_type` | `type` | Filter by request type | `WHERE type = 'design'` |
| `idx_requests_assigned_to` | `assigned_to` | Admin's assigned requests | `WHERE assigned_to = ?` |
| `idx_requests_created_at` | `created_at DESC` | Sort by creation date | `ORDER BY created_at DESC` |
| `idx_requests_updated_at` | `updated_at DESC` | Sort by last update | `ORDER BY updated_at DESC` |
| `idx_requests_started_at` | `started_at` | Track work start time | `WHERE started_at IS NOT NULL` |
| `idx_requests_completed_at` | `completed_at DESC` | Completed requests | `WHERE completed_at IS NOT NULL` |
| `idx_requests_timeline_ideal` | `timeline_ideal` | Track ideal deadlines | `WHERE timeline_ideal < now()` |
| `idx_requests_timeline_hard` | `timeline_hard` | Track hard deadlines | `WHERE timeline_hard < now()` |

**Common Queries:**
```sql
-- Dashboard: Active requests for client
SELECT * FROM requests
WHERE client_id = ?
  AND status IN ('backlog', 'up_next', 'in_progress', 'review')
ORDER BY priority DESC, created_at DESC;

-- Admin dashboard: Assigned requests
SELECT * FROM requests
WHERE assigned_to = ?
  AND status = 'in_progress'
ORDER BY priority DESC, timeline_hard ASC;
```

---

### Assets Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_assets_request_id` | `request_id` | Request's assets | `WHERE request_id = ?` |
| `idx_assets_uploaded_by` | `uploaded_by` | User's uploads | `WHERE uploaded_by = ?` |
| `idx_assets_asset_type` | `asset_type` | Filter by asset type | `WHERE asset_type = 'deliverable'` |
| `idx_assets_created_at` | `created_at DESC` | Sort by upload date | `ORDER BY created_at DESC` |
| `idx_assets_storage_bucket` | `storage_bucket` | Filter by storage bucket | `WHERE storage_bucket = ?` |
| `idx_assets_uploaded_by_role` | `uploaded_by_role` | Filter by uploader role | `WHERE uploaded_by_role = 'client'` |

**Common Queries:**
```sql
-- Get all assets for a request
SELECT * FROM assets
WHERE request_id = ?
ORDER BY created_at DESC;

-- Get deliverables for a request
SELECT * FROM assets
WHERE request_id = ?
  AND asset_type = 'deliverable'
ORDER BY created_at DESC;
```

---

### Comments Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_comments_request_id` | `request_id` | Request's comments | `WHERE request_id = ?` |
| `idx_comments_author_id` | `author_id` | User's comments | `WHERE author_id = ?` |
| `idx_comments_created_at` | `created_at DESC` | Sort by date | `ORDER BY created_at DESC` |

**Common Queries:**
```sql
-- Get comments for a request (most recent first)
SELECT * FROM comments
WHERE request_id = ?
ORDER BY created_at DESC;

-- Get user's recent comments
SELECT * FROM comments
WHERE author_id = ?
ORDER BY created_at DESC
LIMIT 10;
```

---

### Deliverables Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_deliverables_request_id` | `request_id` | Request's deliverables | `WHERE request_id = ?` |
| `idx_deliverables_status` | `status` | Filter by status | `WHERE status = 'delivered'` |
| `idx_deliverables_delivered_at` | `delivered_at DESC` | Sort by delivery date | `ORDER BY delivered_at DESC` |
| `idx_deliverables_created_at` | `created_at DESC` | Sort by creation date | `ORDER BY created_at DESC` |
| `idx_deliverables_delivery_type` | `delivery_type` | Filter by type | `WHERE delivery_type = 'figma'` |
| `idx_deliverables_approved_at` | `approved_at DESC` | Approved deliverables | `WHERE approved_at IS NOT NULL` |

**Common Queries:**
```sql
-- Get deliverables for a request
SELECT * FROM deliverables
WHERE request_id = ?
ORDER BY delivered_at DESC;

-- Recent deliverables needing approval
SELECT * FROM deliverables
WHERE status = 'delivered'
ORDER BY delivered_at DESC;
```

---

### SLA Records Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_sla_records_request_id` | `request_id` | Request's SLA record | `WHERE request_id = ?` |
| `idx_sla_records_status` | `status` | Filter by status | `WHERE status = 'active'` |
| `idx_sla_records_started_at` | `started_at` | Sort by start time | `ORDER BY started_at DESC` |
| `idx_sla_records_completed_at` | `completed_at DESC` | Completed SLAs | `WHERE completed_at IS NOT NULL` |
| `idx_sla_records_violation_severity` | `violation_severity` | Filter violations | `WHERE violation_severity = 'critical'` |

**Common Queries:**
```sql
-- Active SLA records (monitoring dashboard)
SELECT * FROM sla_records
WHERE status = 'active'
ORDER BY started_at ASC;

-- SLA violations for reporting
SELECT * FROM sla_records
WHERE status = 'violated'
  AND started_at >= now() - interval '30 days'
ORDER BY violation_severity, started_at DESC;
```

---

### Notifications Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_notifications_user_id` | `user_id` | User's notifications | `WHERE user_id = ?` |
| `idx_notifications_read` | `user_id, read, created_at DESC` | Unread notifications | `WHERE user_id = ? AND read = false` |
| `idx_notifications_type` | `type` | Filter by type | `WHERE type = 'sla_warning'` |
| `idx_notifications_created_at` | `created_at DESC` | Sort by date | `ORDER BY created_at DESC` |
| `idx_notifications_read_at` | `read_at DESC` | Recently read | `WHERE read_at IS NOT NULL` |

**Common Queries:**
```sql
-- User's unread notifications
SELECT * FROM notifications
WHERE user_id = ? AND read = false
ORDER BY created_at DESC;

-- Recent notifications (all)
SELECT * FROM notifications
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT 20;
```

---

### Basecamp Integrations Table

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_basecamp_integrations_client_id` | `client_id` | Client's integration | `WHERE client_id = ?` |
| `idx_basecamp_integrations_project_id` | `project_id` | Lookup by Basecamp project | `WHERE project_id = ?` |
| `idx_basecamp_integrations_sync_enabled` | `sync_enabled` | Filter enabled syncs | `WHERE sync_enabled = true` |
| `idx_basecamp_integrations_last_sync_at` | `last_sync_at DESC` | Track sync status | `ORDER BY last_sync_at DESC` |

**Common Queries:**
```sql
-- Get integrations needing sync
SELECT * FROM basecamp_integrations
WHERE sync_enabled = true
  AND (last_sync_at IS NULL OR last_sync_at < now() - interval '5 minutes')
ORDER BY last_sync_at ASC NULLS FIRST;
```

---

## Composite Indexes

Composite indexes optimize queries that filter/sort on multiple columns. Column order matters!

### Requests Composite Indexes

| Index Name | Columns | Use Case |
|------------|---------|----------|
| `idx_requests_client_status` | `client_id, status` | Client's requests by status |
| `idx_requests_status_priority` | `status, priority, created_at` | Prioritized queue view |
| `idx_requests_assigned_status` | `assigned_to, status` | Admin's assigned work |
| `idx_requests_client_priority` | `client_id, priority, created_at DESC` | Client's urgent requests |
| `idx_requests_type_status` | `type, status` | Request type filtering |
| `idx_requests_status_updated` | `status, updated_at DESC` | Recently updated by status |

**Example:**
```sql
-- This query uses idx_requests_client_status:
SELECT * FROM requests
WHERE client_id = '123'
  AND status = 'in_progress'
ORDER BY created_at DESC;

-- This query uses idx_requests_status_priority:
SELECT * FROM requests
WHERE status = 'backlog'
ORDER BY priority DESC, created_at DESC;
```

### Other Composite Indexes

| Index Name | Columns | Use Case |
|------------|---------|----------|
| `idx_subscriptions_status_period_end` | `status, current_period_end` | Expiring subscriptions |
| `idx_subscriptions_client_status` | `client_id, status` | Client's subscription status |
| `idx_assets_request_type` | `request_id, asset_type` | Request assets by type |
| `idx_assets_request_created` | `request_id, created_at DESC` | Recent request assets |
| `idx_comments_request_created` | `request_id, created_at DESC` | Request comments sorted |
| `idx_comments_author_type` | `author_id, author_type` | User's comments by type |
| `idx_deliverables_request_status` | `request_id, status` | Request deliverables by status |
| `idx_deliverables_status_delivered` | `status, delivered_at DESC` | Recent deliverables by status |
| `idx_sla_records_status_started` | `status, started_at DESC` | SLA records by status/date |
| `idx_sla_records_request_status` | `request_id, status` | Request's SLA status |
| `idx_clients_status_created` | `status, created_at DESC` | Clients by status/date |

---

## Partial Indexes

Partial indexes only index rows matching a WHERE condition. They're smaller and faster than full indexes.

### Active Requests (Most Common)

```sql
CREATE INDEX idx_requests_active_status
  ON requests(created_at DESC, priority)
  WHERE status IN ('backlog', 'up_next', 'in_progress', 'review', 'blocked');
```

**Use Case:** Dashboard queries for active work (excludes completed/cancelled)
**Benefit:** 80% smaller than full index if 80% of requests are completed

### In-Progress Requests

```sql
CREATE INDEX idx_requests_in_progress
  ON requests(assigned_to, created_at DESC)
  WHERE status = 'in_progress';
```

**Use Case:** Admin dashboard showing current work
**Benefit:** Very small, fast lookups for active work

### High Priority Requests

```sql
CREATE INDEX idx_requests_high_priority
  ON requests(created_at DESC)
  WHERE priority IN ('urgent', 'high') AND status NOT IN ('done', 'cancelled');
```

**Use Case:** Attention-needed queries, urgency tracking
**Benefit:** Only indexes urgent/high priority active requests

### Active Subscriptions

```sql
CREATE INDEX idx_subscriptions_active_status
  ON subscriptions(client_id, current_period_end)
  WHERE status = 'active';
```

**Use Case:** Billing queries, active client list
**Benefit:** Excludes cancelled/past_due subscriptions

### Expiring Subscriptions

```sql
CREATE INDEX idx_subscriptions_expiring_soon
  ON subscriptions(current_period_end ASC, client_id)
  WHERE status = 'active' AND current_period_end IS NOT NULL;
```

**Use Case:** Renewal tracking, billing reminders
**Benefit:** Optimized for "expiring in next X days" queries

### Unread Notifications

```sql
CREATE INDEX idx_notifications_unread
  ON notifications(user_id, created_at DESC)
  WHERE read = false;
```

**Use Case:** Notification badge count, unread list
**Benefit:** Much smaller than full index (most notifications are read)

### Other Partial Indexes

- `idx_subscriptions_past_due` - Payment issue tracking
- `idx_sla_records_active` - Active SLA monitoring
- `idx_sla_records_violated` - SLA violation reporting
- `idx_clients_active` - Active client queries
- `idx_deliverables_pending` - Work tracking
- `idx_assets_client_uploads` - Client-uploaded files
- `idx_assets_admin_deliverables` - Admin work output

---

## Full-Text Search Indexes (GIN)

Full-text search uses PostgreSQL's `tsvector` type with GIN indexes.

### Requests Search

```sql
-- Search title only
CREATE INDEX idx_requests_title_search
  ON requests USING GIN (to_tsvector('english', title));

-- Search description only
CREATE INDEX idx_requests_description_search
  ON requests USING GIN (to_tsvector('english', COALESCE(description, '')));

-- Combined search (most efficient)
CREATE INDEX idx_requests_full_text_search
  ON requests USING GIN (
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
  );
```

**Usage:**
```sql
-- Search requests by keywords
SELECT * FROM requests
WHERE to_tsvector('english', title || ' ' || COALESCE(description, ''))
      @@ to_tsquery('english', 'design & website');

-- Search with ranking
SELECT *,
       ts_rank(to_tsvector('english', title || ' ' || COALESCE(description, '')),
               to_tsquery('english', 'design & website')) AS rank
FROM requests
WHERE to_tsvector('english', title || ' ' || COALESCE(description, ''))
      @@ to_tsquery('english', 'design & website')
ORDER BY rank DESC;
```

### Other Full-Text Indexes

- `idx_comments_content_search` - Search comment text
- `idx_clients_company_search` - Search company names
- `idx_deliverables_title_search` - Search deliverable titles
- `idx_deliverables_description_search` - Search deliverable descriptions

**Search Query Syntax:**
- `design & website` - Both words (AND)
- `design | website` - Either word (OR)
- `design & !website` - First but not second (NOT)
- `design:*` - Prefix search (design, designer, designing)

---

## JSONB Indexes (GIN)

JSONB columns can be indexed for efficient queries on JSON properties.

### Implemented JSONB Indexes

```sql
-- Success criteria checklist
CREATE INDEX idx_requests_success_criteria_gin
  ON requests USING GIN (success_criteria);

-- Deliverable types array
CREATE INDEX idx_requests_deliverable_types_gin
  ON requests USING GIN (deliverable_types);

-- Tech stack
CREATE INDEX idx_clients_tech_stack_gin
  ON clients USING GIN (tech_stack);
```

**Usage:**
```sql
-- Find requests with specific deliverable type
SELECT * FROM requests
WHERE deliverable_types @> '["figma"]';

-- Find clients using specific tech
SELECT * FROM clients
WHERE tech_stack @> '{"frontend": "react"}';

-- Check if success criteria contains item
SELECT * FROM requests
WHERE success_criteria @> '[{"text": "Homepage design approved"}]';
```

---

## Index Maintenance

### Monitoring Index Usage

Check which indexes are being used:

```sql
-- Unused indexes (candidates for removal)
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelid NOT IN (
    SELECT conindid FROM pg_constraint
  )
ORDER BY pg_relation_size(indexrelid) DESC;

-- Most used indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 20;
```

### Index Bloat Check

```sql
-- Check index bloat (inefficiency)
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;
```

### Reindex (If Needed)

```sql
-- Reindex a specific index
REINDEX INDEX CONCURRENTLY idx_requests_client_status;

-- Reindex a table (all indexes)
REINDEX TABLE CONCURRENTLY requests;

-- Reindex entire database
REINDEX DATABASE CONCURRENTLY design_dreams;
```

**Note:** `CONCURRENTLY` prevents table locking but takes longer.

### Update Statistics

```sql
-- Update statistics for query planner
ANALYZE requests;
ANALYZE clients;

-- Or all tables
ANALYZE;
```

---

## Query Performance Testing

### Using EXPLAIN ANALYZE

Test query performance and verify index usage:

```sql
EXPLAIN ANALYZE
SELECT * FROM requests
WHERE client_id = '123'
  AND status = 'in_progress'
ORDER BY created_at DESC;
```

**Look for:**
- "Index Scan" or "Bitmap Index Scan" (good) vs "Seq Scan" (bad)
- Actual execution time
- Rows removed by filter (should be low)

### Example Output

```
Index Scan using idx_requests_client_status on requests
  (cost=0.42..8.44 rows=1 width=XXX)
  (actual time=0.015..0.016 rows=1 loops=1)
  Index Cond: ((client_id = '123') AND (status = 'in_progress'))
Planning Time: 0.123 ms
Execution Time: 0.045 ms
```

**Good signs:**
- Index Scan (using our index)
- Low execution time (< 100ms for most queries)
- Low planning time

**Bad signs:**
- Seq Scan (not using index)
- High "rows removed by filter"
- Long execution time

---

## Performance Targets

| Query Type | Target Time | Index Strategy |
|------------|-------------|----------------|
| Primary key lookup | < 1ms | Automatic PK index |
| Simple WHERE clause | < 10ms | Single-column index |
| JOIN queries | < 50ms | Foreign key indexes |
| Complex filters | < 100ms | Composite indexes |
| Full-text search | < 200ms | GIN indexes |
| Aggregations | < 500ms | Covering indexes + JSONB |
| Dashboard queries | < 1s | Partial indexes + caching |

---

## Best Practices

### Do's ✅

- **Index foreign keys** - Always index columns used in JOINs
- **Index WHERE columns** - Index columns frequently filtered
- **Index ORDER BY columns** - Index columns used for sorting
- **Use partial indexes** - When querying subsets (e.g., active records only)
- **Composite index order** - Most selective column first, then less selective
- **Monitor unused indexes** - Remove indexes that aren't being used
- **Update statistics** - Run ANALYZE regularly for query planner

### Don'ts ❌

- **Don't index low-cardinality columns alone** - (e.g., boolean, status with 2-3 values)
- **Don't over-index** - Each index slows down writes (INSERT/UPDATE/DELETE)
- **Don't index small tables** - < 1000 rows, Seq Scan is often faster
- **Don't duplicate indexes** - Check for overlapping indexes
- **Don't forget WHERE in partial indexes** - Partial indexes are much more efficient

### Index vs Seq Scan

PostgreSQL may choose Seq Scan over Index Scan if:
- Table is small (< 10,000 rows typically)
- Query returns > 5-10% of rows
- Statistics are outdated (run ANALYZE)
- Index is bloated (run REINDEX)

---

## Common Query Patterns

### Dashboard: Client's Active Requests

```sql
SELECT * FROM requests
WHERE client_id = ?
  AND status IN ('backlog', 'up_next', 'in_progress', 'review')
ORDER BY priority DESC, created_at DESC
LIMIT 50;
```

**Indexes Used:**
- `idx_requests_client_status` (composite)
- `idx_requests_active_status` (partial)

### Admin Dashboard: Assigned Work

```sql
SELECT
  r.*,
  c.company_name,
  (SELECT COUNT(*) FROM comments WHERE request_id = r.id) as comment_count
FROM requests r
JOIN clients c ON c.id = r.client_id
WHERE r.assigned_to = ?
  AND r.status = 'in_progress'
ORDER BY r.priority DESC, r.timeline_hard ASC;
```

**Indexes Used:**
- `idx_requests_assigned_status` (composite)
- `idx_requests_in_progress` (partial)
- `idx_clients_id` (primary key)
- `idx_comments_request_id` (for subquery)

### Search Requests

```sql
SELECT * FROM requests
WHERE to_tsvector('english', title || ' ' || COALESCE(description, ''))
      @@ to_tsquery('english', 'design & website')
  AND status != 'cancelled'
ORDER BY updated_at DESC
LIMIT 20;
```

**Indexes Used:**
- `idx_requests_full_text_search` (GIN)
- `idx_requests_status` (filter)
- `idx_requests_updated_at` (sort)

### Billing: Expiring Subscriptions

```sql
SELECT
  s.*,
  c.company_name,
  c.email
FROM subscriptions s
JOIN clients c ON c.id = s.client_id
WHERE s.status = 'active'
  AND s.current_period_end < now() + interval '7 days'
ORDER BY s.current_period_end ASC;
```

**Indexes Used:**
- `idx_subscriptions_expiring_soon` (partial)
- `idx_clients_id` (primary key)

---

## Troubleshooting

### Query is slow despite index

1. **Check if index is being used:**
   ```sql
   EXPLAIN ANALYZE your_query;
   ```

2. **Update statistics:**
   ```sql
   ANALYZE table_name;
   ```

3. **Check for index bloat:**
   ```sql
   REINDEX INDEX CONCURRENTLY index_name;
   ```

4. **Consider adding a covering index** (includes all columns needed)

### Index not being used

Possible reasons:
- Query pattern doesn't match index
- Table too small (< 10k rows)
- Statistics outdated
- Query returns > 10% of rows (Seq Scan faster)
- Wrong column order in composite index

### Write performance degraded

Too many indexes can slow down INSERT/UPDATE/DELETE:
1. Check for unused indexes
2. Remove duplicate/overlapping indexes
3. Consider partial indexes instead of full indexes

---

## Migration Rollback

If indexes cause issues, rollback with:

```sql
-- Drop all indexes from this migration
DROP INDEX IF EXISTS idx_clients_stripe_customer_id;
DROP INDEX IF EXISTS idx_clients_created_at;
-- ... (drop all indexes created in migration)

-- Update statistics
ANALYZE;
```

**Note:** Only drop indexes added in this migration, not the original schema indexes.

---

## Additional Resources

- [PostgreSQL Index Documentation](https://www.postgresql.org/docs/current/indexes.html)
- [Use The Index, Luke!](https://use-the-index-luke.com/)
- [Supabase Performance Best Practices](https://supabase.com/docs/guides/database/performance)
- [PostgreSQL Query Optimization](https://www.postgresql.org/docs/current/performance-tips.html)

---

**End of Documentation**
