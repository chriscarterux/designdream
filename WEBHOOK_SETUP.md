# Stripe Webhook Setup Guide

Complete guide to setting up and testing Stripe webhooks for subscription management.

## Table of Contents

1. [Overview](#overview)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Testing Webhooks](#testing-webhooks)
5. [Monitoring & Debugging](#monitoring--debugging)
6. [Troubleshooting](#troubleshooting)

---

## Overview

### Webhook Events Handled

This implementation handles the following Stripe webhook events:

| Event | Description | Action Taken |
|-------|-------------|--------------|
| `customer.subscription.created` | New subscription started | Create subscription record, activate user |
| `customer.subscription.updated` | Subscription modified | Update subscription details |
| `customer.subscription.deleted` | Subscription canceled | Mark subscription as canceled |
| `invoice.payment_succeeded` | Payment successful | Log payment, ensure subscription active |
| `invoice.payment_failed` | Payment failed | Log failure, mark subscription past_due |

### Architecture

```
Stripe → Webhook Endpoint → Signature Verification → Event Router → Handler Functions → Database Update
```

**Key Features:**
- Signature verification for security
- Idempotency handling to prevent duplicate processing
- Comprehensive logging for debugging
- Error handling with proper HTTP status codes
- Database transactions for consistency

---

## Local Development Setup

### Prerequisites

1. Stripe CLI installed:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Environment variables configured in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Step 1: Login to Stripe CLI

```bash
stripe login
```

This will open a browser window to authenticate with your Stripe account.

### Step 2: Start Your Development Server

```bash
npm run dev
```

Your Next.js app should be running on `http://localhost:3000`.

### Step 3: Forward Webhooks to Local Server

In a separate terminal, run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This command will:
- Generate a webhook signing secret (starts with `whsec_`)
- Forward all Stripe events to your local endpoint
- Display events in real-time

**Important:** Copy the webhook signing secret and add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 4: Trigger Test Events

In another terminal, trigger test events:

```bash
# Test subscription created
stripe trigger customer.subscription.created

# Test payment succeeded
stripe trigger invoice.payment_succeeded

# Test payment failed
stripe trigger invoice.payment_failed

# Test subscription updated
stripe trigger customer.subscription.updated

# Test subscription deleted
stripe trigger customer.subscription.deleted
```

### Viewing Events

Watch the webhook forwarding terminal to see events in real-time:

```
2025-11-03 12:34:56   --> customer.subscription.created [evt_1ABC...]
2025-11-03 12:34:57   <-- [200] POST http://localhost:3000/api/webhooks/stripe
```

---

## Production Deployment

### Step 1: Deploy Your Application

Deploy your Next.js application to your hosting provider (Vercel, AWS, etc.).

Note your production URL: `https://yourdomain.com`

### Step 2: Create Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"

### Step 3: Get Webhook Signing Secret

After creating the endpoint:

1. Click on your newly created endpoint
2. Click "Reveal" under "Signing secret"
3. Copy the secret (starts with `whsec_`)
4. Add it to your production environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Step 4: Enable Endpoint

Ensure your webhook endpoint is enabled in the Stripe Dashboard.

### Step 5: Test Production Webhook

Send a test event from the Stripe Dashboard:

1. Go to your webhook endpoint page
2. Click "Send test webhook"
3. Select an event type
4. Click "Send test webhook"
5. Verify the event was received (Status: 200)

---

## Testing Webhooks

### Manual Testing with Stripe CLI

```bash
# Create a test customer and subscription
stripe customers create --email test@example.com --name "Test Customer"
stripe subscriptions create \
  --customer cus_... \
  --items '[{"price": "price_..."}]'

# Update subscription
stripe subscriptions update sub_... --metadata '{"test": "true"}'

# Cancel subscription
stripe subscriptions cancel sub_...
```

### Automated Testing

Create a test script to verify webhook handling:

```typescript
// scripts/test-webhook.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

async function testWebhook() {
  // Create test customer
  const customer = await stripe.customers.create({
    email: 'test@example.com',
    name: 'Test Customer',
  });

  // Create test subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: 'price_test_...' }],
    metadata: { test: 'true' },
  });

  console.log('Created subscription:', subscription.id);

  // Wait for webhook processing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Verify in database
  // Add your database query here to verify the subscription was created
}

testWebhook().catch(console.error);
```

Run the test:

```bash
npx tsx scripts/test-webhook.ts
```

### Verifying Database Updates

Query your database to verify webhook processing:

```sql
-- Check recent webhook events
SELECT * FROM webhook_events ORDER BY created_at DESC LIMIT 10;

-- Check subscriptions
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;

-- Check payment events
SELECT * FROM payment_events ORDER BY created_at DESC LIMIT 10;

-- Check subscription health
SELECT * FROM subscription_health;
```

---

## Monitoring & Debugging

### Stripe Dashboard

Monitor webhooks in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks):

- View all webhook attempts
- See success/failure status
- Inspect request/response payloads
- Retry failed webhooks

### Application Logs

Check your application logs for webhook processing:

```bash
# Development
npm run dev

# Production (example with Vercel)
vercel logs

# Or check your hosting provider's logs
```

### Database Monitoring

Query webhook events table:

```sql
-- Failed webhook events
SELECT
  stripe_event_id,
  event_type,
  error_message,
  created_at
FROM webhook_events
WHERE processed = false
ORDER BY created_at DESC;

-- Event processing statistics
SELECT
  event_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE processed = true) as processed,
  COUNT(*) FILTER (WHERE processed = false) as failed
FROM webhook_events
GROUP BY event_type;
```

### Real-time Webhook Monitoring

Use Stripe CLI to monitor live events:

```bash
stripe listen --print-json
```

---

## Troubleshooting

### Common Issues

#### 1. Webhook Signature Verification Failed

**Error:** `Webhook signature verification failed`

**Causes:**
- Wrong webhook secret in environment variables
- Body parsing middleware interfering with raw body
- Clock skew between servers

**Solutions:**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure raw body is being used (we use `req.text()`)
- Check server time is synchronized

#### 2. Webhook Events Not Received

**Possible Issues:**
- Webhook endpoint not publicly accessible
- Firewall blocking Stripe's IP addresses
- Incorrect webhook URL in Stripe Dashboard

**Solutions:**
- Ensure URL is publicly accessible
- Whitelist Stripe's webhook IPs if using firewall
- Verify URL in Stripe Dashboard matches your deployment

#### 3. Duplicate Event Processing

**Issue:** Same event processed multiple times

**Solution:** Check `webhook_events` table for duplicates:

```sql
SELECT stripe_event_id, COUNT(*)
FROM webhook_events
GROUP BY stripe_event_id
HAVING COUNT(*) > 1;
```

Our implementation includes idempotency checking, but you can add additional checks:

```typescript
// In webhook handler
const existingEvent = await supabaseAdmin
  .from('webhook_events')
  .select('id')
  .eq('stripe_event_id', event.id)
  .eq('processed', true)
  .single();

if (existingEvent.data) {
  return NextResponse.json({ message: 'Event already processed' }, { status: 200 });
}
```

#### 4. Database Connection Errors

**Error:** Failed to connect to Supabase

**Solutions:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase project is active
- Ensure database migrations are applied

#### 5. Missing Customer/User

**Error:** `User not found for customer ID`

**Cause:** Webhook received before user creation is complete

**Solution:** Implement retry logic or queue processing:

```typescript
// In handler function
let retries = 3;
let userId = null;

while (retries > 0 && !userId) {
  userId = await getUserByCustomerId(customerId);
  if (!userId) {
    retries--;
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
  }
}
```

### Testing Webhook Failures

Intentionally trigger failures to test error handling:

```bash
# Test with invalid signature
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "stripe-signature: invalid" \
  -d '{"type": "customer.subscription.created"}'

# Test with malformed JSON
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "stripe-signature: whsec_..." \
  -d 'invalid json'
```

### Webhook Event Replay

Replay failed events from Stripe Dashboard:

1. Go to Webhooks → [Your Endpoint]
2. Find the failed event
3. Click "..." → "Resend event"
4. Verify successful processing

---

## Best Practices

### Security

1. **Always verify webhook signatures** - Never process unverified webhooks
2. **Use HTTPS in production** - Required for production webhooks
3. **Whitelist webhook IPs** - If using strict firewall rules
4. **Rate limit webhook endpoint** - Prevent abuse (though Stripe has its own limits)

### Reliability

1. **Return 200 quickly** - Process events and respond fast
2. **Use idempotency** - Check if event was already processed
3. **Implement retries** - Handle transient failures gracefully
4. **Log everything** - Store all events for debugging
5. **Monitor failures** - Set up alerts for failed webhooks

### Performance

1. **Avoid long processing** - Move heavy work to background jobs
2. **Use database transactions** - Ensure data consistency
3. **Optimize queries** - Index frequently queried fields
4. **Cache when possible** - Reduce database load

### Testing

1. **Test all event types** - Don't just test happy paths
2. **Test failure scenarios** - Verify error handling
3. **Test idempotency** - Send same event twice
4. **Load test** - Ensure endpoint can handle volume

---

## Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Security Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Stripe API Reference](https://stripe.com/docs/api)

---

## Support

If you encounter issues:

1. Check application logs
2. Check Stripe Dashboard webhook logs
3. Query `webhook_events` table for errors
4. Review this troubleshooting guide
5. Contact Stripe support if needed

---

**Last Updated:** November 3, 2025
**Version:** 1.0.0
