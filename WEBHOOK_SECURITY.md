# Webhook Security Implementation

## Overview

This document describes the comprehensive security measures implemented to prevent webhook replay attacks and ensure reliable webhook processing.

## Security Features

### 1. Signature Verification
- **What**: Verifies webhook signatures using Stripe's signing secret
- **How**: Uses `stripe.webhooks.constructEvent()` to validate signatures
- **Protection**: Prevents tampering and ensures webhooks are from Stripe

### 2. Timestamp Validation (Replay Attack Prevention)
- **What**: Rejects events older than 5 minutes
- **How**: Checks `event.created` timestamp against current time
- **Protection**: Prevents replay attacks using old webhook events
- **Configuration**: `MAX_EVENT_AGE_SECONDS = 300` (5 minutes)

### 3. Idempotency Protection
- **What**: Prevents duplicate processing of the same event
- **How**: Records event ID in database before processing
- **Protection**: Handles race conditions and Stripe retries
- **Database**: `webhook_events` table with unique constraint on `stripe_event_id`

### 4. Dead Letter Queue
- **What**: Stores failed webhooks for manual review
- **How**: `webhook_failures` table with retry mechanism
- **Benefits**:
  - No data loss
  - Manual intervention for critical failures
  - Exponential backoff retry strategy

### 5. Transaction Safety
- **What**: Ensures database operations are atomic
- **How**: Wraps multi-step operations in transaction-like error handling
- **Protection**: Prevents partial updates and data inconsistency

### 6. Performance Monitoring
- **What**: Tracks webhook processing time
- **How**: Logs slow webhooks (>3 seconds)
- **Benefits**: Identifies performance issues and bottlenecks

## Database Schema

### webhook_events
Tracks all received webhook events for audit trail and idempotency.

```sql
- id: UUID
- stripe_event_id: TEXT (UNIQUE)
- event_type: TEXT
- event_timestamp: TIMESTAMP (Stripe's event creation time)
- received_at: TIMESTAMP (When we received it)
- payload: JSONB
- processed: BOOLEAN
- error_message: TEXT
- retry_count: INTEGER
```

### webhook_failures (Dead Letter Queue)
Stores failed webhooks for manual review and retry.

```sql
- id: UUID
- stripe_event_id: TEXT
- event_type: TEXT
- payload: JSONB
- failure_reason: TEXT
- error_message: TEXT
- stack_trace: TEXT
- retry_count: INTEGER
- last_retry_at: TIMESTAMP
- next_retry_at: TIMESTAMP
- status: TEXT (pending, retrying, resolved, abandoned)
- resolved_at: TIMESTAMP
- resolution_notes: TEXT
```

### webhook_metrics
Aggregated metrics for monitoring webhook health.

```sql
- period_start: TIMESTAMP
- period_end: TIMESTAMP
- total_events: INTEGER
- successful_events: INTEGER
- failed_events: INTEGER
- replay_attempts: INTEGER
- expired_events: INTEGER
- avg_processing_time_ms: INTEGER
```

## API Endpoints

### POST /api/webhooks/stripe
Main webhook handler with full security features.

**Security Checks:**
1. Signature verification
2. Timestamp validation (reject if >5 minutes old)
3. Idempotency check (reject duplicates)
4. Processing with error handling
5. Dead letter queue logging on failure

**Response Codes:**
- `200`: Event processed successfully or duplicate
- `400`: Invalid signature, expired event, or missing headers
- `500`: Processing error (triggers Stripe retry)

### GET /api/webhooks/test
Test webhook configuration and recent events.

**Returns:**
```json
{
  "status": "ok",
  "config": {
    "webhookSecretConfigured": true,
    "maxEventAgeSeconds": 300,
    "slowProcessingThresholdMs": 3000
  },
  "stats": {
    "recentEvents": 10,
    "pendingFailures": 2,
    "replayAttemptsLast24h": 0
  }
}
```

### POST /api/webhooks/test
Test signature verification with real Stripe events.

**Usage with Stripe CLI:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

### GET /api/webhooks/retry
List failed webhooks ready for retry.

**Returns:**
```json
{
  "total": 5,
  "readyForRetry": 2,
  "awaitingRetry": 3,
  "failures": {
    "ready": [...],
    "awaiting": [...]
  }
}
```

### POST /api/webhooks/retry
Retry failed webhooks from dead letter queue.

**Body:**
```json
{
  "failureId": "uuid",  // Retry specific failure
  // OR
  "retryAll": true      // Retry all ready failures
}
```

**Retry Strategy:**
- Exponential backoff: 5min, 10min, 20min, 40min, 80min
- Max retries: 5
- Status: pending → retrying → resolved/abandoned

### POST /api/webhooks/cleanup
Clean up old webhook events and failures.

**Query Params:**
- `dryRun=true`: Preview what would be deleted
- `eventAge=30`: Days to keep events (default: 30)
- `failureAge=90`: Days to keep failures (default: 90)

**Usage:**
```bash
# Dry run
curl -X POST "http://localhost:3000/api/webhooks/cleanup?dryRun=true"

# Actual cleanup
curl -X POST "http://localhost:3000/api/webhooks/cleanup"
```

## Security Vulnerabilities Prevented

### 1. Replay Attacks
**Vulnerability**: Attacker intercepts webhook and resends it later.

**Prevention**:
- Timestamp validation rejects events >5 minutes old
- Idempotency checks prevent duplicate processing
- Database tracks all received events

### 2. Tampering
**Vulnerability**: Attacker modifies webhook payload.

**Prevention**:
- Stripe signature verification
- HMAC-based signature with secret key
- Automatic rejection of invalid signatures

### 3. Race Conditions
**Vulnerability**: Concurrent webhook requests process same event twice.

**Prevention**:
- Database unique constraint on `stripe_event_id`
- Check-then-insert pattern with error handling
- Transaction-like error handling for atomicity

### 4. Data Loss
**Vulnerability**: Failed webhooks are lost forever.

**Prevention**:
- Dead letter queue stores all failures
- Retry mechanism with exponential backoff
- Manual review and retry capability

### 5. Denial of Service
**Vulnerability**: Large volume of webhooks overwhelms system.

**Prevention**:
- Processing time monitoring
- Slow webhook detection (>3 seconds)
- Rate limiting (implement at infrastructure level)

## Testing

### Test Replay Attack Prevention
```bash
# 1. Capture a real webhook request
# 2. Wait 6 minutes
# 3. Replay the same request
# Expected: 400 error "Event expired"
```

### Test Duplicate Processing
```bash
# 1. Send webhook event
# 2. Send same event again immediately
# Expected: 200 "Duplicate event (already processed)"
```

### Test Signature Verification
```bash
# 1. Send webhook with invalid signature
# Expected: 400 "Webhook signature verification failed"
```

### Test Dead Letter Queue
```bash
# 1. Cause webhook to fail (e.g., database down)
# 2. Check webhook_failures table
# 3. Retry using /api/webhooks/retry
# Expected: Event processed successfully after retry
```

## Monitoring

### Key Metrics to Track

1. **Processing Success Rate**
   ```sql
   SELECT
     COUNT(*) FILTER (WHERE processed = true AND error_message IS NULL) * 100.0 / COUNT(*) as success_rate
   FROM webhook_events
   WHERE created_at >= now() - interval '24 hours';
   ```

2. **Replay Attempts**
   ```sql
   SELECT * FROM webhook_replay_attempts
   WHERE last_attempt >= now() - interval '24 hours';
   ```

3. **Failed Webhooks**
   ```sql
   SELECT COUNT(*) FROM webhook_failures
   WHERE status IN ('pending', 'retrying');
   ```

4. **Processing Time**
   ```sql
   SELECT
     AVG(EXTRACT(EPOCH FROM (processed_at - received_at)) * 1000) as avg_ms,
     MAX(EXTRACT(EPOCH FROM (processed_at - received_at)) * 1000) as max_ms
   FROM webhook_events
   WHERE processed_at IS NOT NULL
     AND created_at >= now() - interval '1 hour';
   ```

### Alerting Rules

Set up alerts for:
- Replay attempts detected (>0 in last hour)
- Failed webhook rate >5% in last hour
- Pending failures >10
- Average processing time >2 seconds
- Events older than 4 minutes being processed (near expiry)

## Maintenance

### Daily Tasks
1. Check pending webhook failures
2. Review processing time metrics
3. Monitor replay attempts

### Weekly Tasks
1. Retry abandoned webhooks if needed
2. Review dead letter queue
3. Check cleanup statistics

### Monthly Tasks
1. Run webhook cleanup (events >30 days)
2. Run failure cleanup (resolved/abandoned >90 days)
3. Review security logs for anomalies
4. Update retry thresholds if needed

### Cleanup Commands
```bash
# Check cleanup statistics
curl http://localhost:3000/api/webhooks/cleanup

# Preview cleanup (dry run)
curl -X POST "http://localhost:3000/api/webhooks/cleanup?dryRun=true"

# Execute cleanup
curl -X POST http://localhost:3000/api/webhooks/cleanup
```

## Configuration

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Tunable Parameters

In `/src/app/api/webhooks/stripe/route.ts`:
```typescript
// Maximum age for webhook events (replay protection)
const MAX_EVENT_AGE_SECONDS = 300; // 5 minutes

// Processing time alert threshold
const SLOW_PROCESSING_THRESHOLD_MS = 3000; // 3 seconds
```

In dead letter queue:
```typescript
// Retry configuration (in migration)
max_retries: 5
exponential_backoff: 5 * 2^retry_count minutes
```

## Best Practices

1. **Always verify signatures** - Never process webhooks without verification
2. **Reject old events** - Implement timestamp validation
3. **Use idempotency** - Track processed events in database
4. **Handle errors gracefully** - Use dead letter queue
5. **Monitor actively** - Set up alerts for anomalies
6. **Clean up regularly** - Remove old events to save space
7. **Test thoroughly** - Use Stripe CLI to test all scenarios
8. **Document incidents** - Keep notes on webhook issues
9. **Rotate secrets** - Update webhook secrets periodically
10. **Audit logs** - Review webhook_events table regularly

## Troubleshooting

### Webhook not receiving events
1. Check Stripe dashboard webhook settings
2. Verify webhook endpoint URL is correct
3. Check STRIPE_WEBHOOK_SECRET is set
4. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Signature verification failing
1. Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
2. Ensure raw body is used (not parsed JSON)
3. Check for body parsing middleware conflicts
4. Use test endpoint to debug: GET /api/webhooks/test

### Events being rejected as expired
1. Check server time is synchronized (NTP)
2. Verify MAX_EVENT_AGE_SECONDS setting
3. Check Stripe webhook retry delays
4. Review webhook delivery latency in Stripe dashboard

### Duplicate processing detected
1. Check for multiple webhook endpoints configured
2. Review application scaling (multiple instances)
3. Verify database unique constraints
4. Check webhook_replay_attempts view

### High failure rate
1. Check database connectivity
2. Review error messages in webhook_failures table
3. Verify Supabase RLS policies
4. Check for API rate limits
5. Review stack traces for bugs

## Security Checklist

- [x] Webhook signature verification implemented
- [x] Timestamp validation (5 minute expiry)
- [x] Idempotency protection with database
- [x] Dead letter queue for failed events
- [x] Transaction safety for database operations
- [x] Processing time monitoring
- [x] Cleanup mechanism for old events
- [x] Retry mechanism with exponential backoff
- [x] Comprehensive error logging
- [x] Test endpoints for debugging
- [x] Documentation for maintenance
- [x] Monitoring views and queries
- [ ] Rate limiting at infrastructure level (TODO)
- [ ] Authentication for admin endpoints (TODO)
- [ ] Automated alerting system (TODO)
- [ ] Scheduled cleanup cron job (TODO)

## References

- [Stripe Webhook Security](https://stripe.com/docs/webhooks/signatures)
- [OWASP Webhook Security](https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html)
- [Best Practices for Webhooks](https://webhooks.fyi/)

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0
**Maintainer**: Security Team
