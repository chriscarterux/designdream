# Stripe Webhooks Implementation

Complete implementation of Stripe webhook handling for subscription management.

## Quick Start

### Local Development

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   stripe login
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the webhook secret (`whsec_...`) to your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Trigger test events:**
   ```bash
   stripe trigger customer.subscription.created
   stripe trigger invoice.payment_succeeded
   ```

### Production Setup

1. Deploy your application
2. Add webhook endpoint in [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
3. Set webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Add webhook secret to production environment variables

See [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) for detailed instructions.

## Files Overview

### API Endpoint
- **`src/app/api/webhooks/stripe/route.ts`**
  - Main webhook endpoint (POST /api/webhooks/stripe)
  - Handles signature verification
  - Routes events to appropriate handlers
  - Returns proper HTTP status codes

### Core Logic
- **`src/lib/stripe-webhooks.ts`**
  - Event handler functions for each webhook type
  - Database update logic
  - Error handling and logging

### Configuration
- **`src/lib/stripe.ts`**
  - Stripe client initialization
  - Webhook secret management

- **`src/lib/supabase-server.ts`**
  - Supabase admin client for database operations
  - Bypasses RLS for webhook processing

### Type Definitions
- **`src/types/stripe.types.ts`**
  - TypeScript types for Stripe events
  - Subscription and payment data types
  - Event handler result types

### Database
- **`supabase/migrations/20251103000000_stripe_webhooks.sql`**
  - Creates `webhook_events` table
  - Creates `payment_events` table
  - Updates `subscriptions` table
  - Adds RLS policies and helper functions

### Documentation
- **`WEBHOOK_SETUP.md`**
  - Complete setup guide
  - Testing instructions
  - Troubleshooting guide

### Testing
- **`scripts/test-stripe-webhook.ts`**
  - Automated test script
  - Creates test subscriptions
  - Verifies webhook processing

## Architecture

```
┌─────────────┐
│   Stripe    │
└──────┬──────┘
       │ Webhook Event
       ▼
┌─────────────────────────────────┐
│ POST /api/webhooks/stripe       │
│ - Verify signature              │
│ - Check idempotency             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ handleWebhookEvent()            │
│ - Route to handler              │
│ - Log event                     │
└──────┬──────────────────────────┘
       │
       ├─► handleSubscriptionCreated()
       ├─► handleSubscriptionUpdated()
       ├─► handleSubscriptionDeleted()
       ├─► handlePaymentSucceeded()
       └─► handlePaymentFailed()
              │
              ▼
       ┌──────────────┐
       │   Supabase   │
       │   Database   │
       └──────────────┘
```

## Event Handlers

### 1. Subscription Created
**Event:** `customer.subscription.created`
**Actions:**
- Create subscription record in database
- Update user status to "active"
- Log event

### 2. Subscription Updated
**Event:** `customer.subscription.updated`
**Actions:**
- Update subscription details
- Sync user status
- Log event

### 3. Subscription Deleted
**Event:** `customer.subscription.deleted`
**Actions:**
- Mark subscription as canceled
- Update user status to "canceled"
- Log cancellation timestamp

### 4. Payment Succeeded
**Event:** `invoice.payment_succeeded`
**Actions:**
- Log successful payment
- Ensure subscription is active
- Update user status

### 5. Payment Failed
**Event:** `invoice.payment_failed`
**Actions:**
- Log payment failure
- Mark subscription as "past_due"
- Update user status
- Trigger retry logic (Stripe handles this)

## Database Schema

### webhook_events
Stores all webhook events for audit trail and idempotency.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| stripe_event_id | text | Stripe event ID (unique) |
| event_type | text | Event type (e.g., subscription.created) |
| payload | jsonb | Full event payload |
| processed | boolean | Processing status |
| error_message | text | Error message if failed |
| created_at | timestamp | Event received time |

### payment_events
Tracks all payment attempts.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| invoice_id | text | Stripe invoice ID |
| subscription_id | text | Stripe subscription ID |
| customer_id | text | Stripe customer ID |
| amount_paid | integer | Amount in cents |
| currency | text | Currency code |
| status | text | succeeded or failed |
| error_message | text | Error if failed |
| created_at | timestamp | Payment time |

### subscriptions (updated)
Enhanced subscription tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User reference |
| client_id | uuid | Client reference |
| stripe_subscription_id | text | Stripe subscription ID |
| stripe_customer_id | text | Stripe customer ID |
| status | text | Subscription status |
| plan_id | text | Price ID |
| current_period_start | timestamp | Period start |
| current_period_end | timestamp | Period end |
| cancel_at_period_end | boolean | Cancel flag |
| canceled_at | timestamp | Cancellation time |

## Security Features

### 1. Signature Verification
Every webhook is verified using Stripe's signature to ensure:
- Request came from Stripe
- Request hasn't been tampered with
- Request isn't a replay attack

### 2. Idempotency
Events are logged in `webhook_events` table to prevent duplicate processing:
- Check if event was already processed
- Return success for duplicate events
- Prevent race conditions

### 3. Error Handling
Proper HTTP status codes:
- `200` - Event received and processed
- `400` - Invalid signature or malformed request
- `500` - Internal error (triggers Stripe retry)

### 4. Database Security
- Uses Supabase service role key (admin access)
- Bypasses RLS for webhook processing
- Validates data before insertion
- Uses transactions for consistency

## Monitoring

### Check Recent Webhook Events
```sql
SELECT * FROM webhook_events
ORDER BY created_at DESC
LIMIT 10;
```

### Check Failed Events
```sql
SELECT * FROM webhook_events
WHERE processed = false
ORDER BY created_at DESC;
```

### Check Payment Activity
```sql
SELECT * FROM payment_activity
LIMIT 20;
```

### Check Subscription Health
```sql
SELECT * FROM subscription_health;
```

## Testing Checklist

- [ ] Subscription created event
- [ ] Subscription updated event
- [ ] Subscription deleted event
- [ ] Payment succeeded event
- [ ] Payment failed event
- [ ] Duplicate event handling
- [ ] Invalid signature rejection
- [ ] Missing customer handling
- [ ] Database rollback on error
- [ ] Production webhook endpoint

## Common Issues

### Issue: Webhook signature verification failed
**Solution:** Verify `STRIPE_WEBHOOK_SECRET` is correct for your environment.

### Issue: User not found for customer ID
**Solution:** Ensure customer is created with `stripe_customer_id` in clients table.

### Issue: Duplicate event processing
**Solution:** Check `webhook_events` table for idempotency logic.

### Issue: Events not received locally
**Solution:** Ensure webhook forwarding is active with Stripe CLI.

## Environment Variables

Required environment variables:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_... # Different for dev and prod

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Admin key for webhooks
```

## Resources

- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## Next Steps

After implementing webhooks:

1. [ ] Test all event types locally
2. [ ] Run migration to create tables
3. [ ] Deploy to production
4. [ ] Configure production webhook in Stripe
5. [ ] Monitor webhook logs
6. [ ] Set up alerts for failures
7. [ ] Add retry logic for critical failures
8. [ ] Implement customer notifications

## Support

For issues or questions:
1. Check [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md)
2. Review Stripe Dashboard webhook logs
3. Query `webhook_events` table
4. Check application logs

---

**Version:** 1.0.0
**Last Updated:** November 3, 2025
