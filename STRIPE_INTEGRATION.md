# Stripe Checkout Integration

This feature implements a complete Stripe checkout flow for DesignDream's monthly subscription at $4,495/month.

## Overview

The integration includes:
- Stripe checkout session creation
- Hosted checkout page (Stripe-managed)
- Success and cancel pages
- Webhook handler for subscription events
- TypeScript types for type safety

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Stripe keys:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Test the integration:**
   - Visit `http://localhost:3000/subscribe`
   - Enter email and click "Continue to Payment"
   - Use test card: `4242 4242 4242 4242`

## Architecture

### API Routes

#### POST /api/stripe/create-checkout-session
Creates a new Stripe checkout session.

**Request:**
```json
{
  "email": "customer@example.com",
  "customerName": "John Doe",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

#### GET /api/stripe/checkout-session
Retrieves checkout session details for the success page.

**Request:**
```
GET /api/stripe/checkout-session?session_id=cs_test_...
```

**Response:**
```json
{
  "customerEmail": "customer@example.com",
  "subscriptionId": "sub_...",
  "amountTotal": 449500,
  "status": "paid"
}
```

#### POST /api/stripe/webhooks
Handles Stripe webhook events.

**Supported Events:**
- `checkout.session.completed` - Checkout completed
- `customer.subscription.created` - Subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed

### Pages

#### /subscribe
Main subscription page with pricing and checkout form.

**Features:**
- Product pricing display ($4,495/month)
- Feature list
- Email collection form
- Redirects to Stripe Checkout

#### /subscribe/success
Success page shown after successful payment.

**Features:**
- Displays subscription details
- Shows welcome message
- Links to dashboard and billing settings
- Fetches session details from API

#### /subscribe/cancel
Cancel page shown when user cancels checkout.

**Features:**
- Explains no charges were made
- Encourages retry
- Shows feature benefits
- Links back to subscription page

### Library Files

#### src/lib/stripe.ts
Stripe client configuration and utilities.

**Exports:**
- `stripe` - Server-side Stripe client
- `stripeConfig` - Product and URL configuration
- `formatStripeAmount()` - Format cents to USD

### Types

#### src/types/stripe.ts
TypeScript type definitions for Stripe integration.

**Types:**
- `CreateCheckoutSessionRequest`
- `CreateCheckoutSessionResponse`
- `CheckoutSessionDetails`
- `UserSubscription`
- `PaymentRecord`
- `StripeErrorResponse`
- `SubscriptionPlan`

## Configuration

### Product Configuration

Edit `src/lib/stripe.ts` to change product details:

```typescript
export const stripeConfig = {
  products: {
    subscription: {
      name: 'DesignDream Monthly Subscription',
      description: 'Full access to DesignDream platform...',
      priceAmount: 449500, // $4,495.00 in cents
      currency: 'usd',
      interval: 'month',
    },
  },
  // ...
};
```

### Success/Cancel URLs

URLs are automatically configured based on `NEXT_PUBLIC_APP_URL`:
- Success: `{APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel: `{APP_URL}/subscribe/cancel`

## Testing

### Test Card Numbers

| Card | Scenario |
|------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0027 6000 3184` | 3D Secure required |

Use any future expiry date, any CVC, and any ZIP code.

### Testing Webhooks Locally

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhooks
   ```

4. Copy the webhook signing secret to `.env.local`

5. In another terminal, trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.created
   ```

### Integration Test Flow

1. Create checkout session
2. Complete payment with test card
3. Verify redirect to success page
4. Check Stripe Dashboard for:
   - Created customer
   - Active subscription
   - Successful payment
5. Verify webhook events received

## Database Integration

The webhook handler includes TODO comments for database integration. You'll need to:

1. Create a `subscriptions` table to store subscription data
2. Create a `payments` table to store payment records
3. Implement functions to update user subscription status
4. Link Stripe customer ID with user ID

Example schema:

```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  customer_id TEXT NOT NULL,
  subscription_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  invoice_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Email Integration

The webhook handler includes TODO comments for email integration. Consider sending:

1. **Welcome email** - After successful subscription
2. **Receipt email** - After each payment (or let Stripe handle this)
3. **Payment failed email** - When payment fails
4. **Cancellation confirmation** - When subscription is canceled

Use a service like Resend (already in dependencies) or SendGrid.

## Security Best Practices

1. **Never expose secret keys client-side**
   - Only `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` should be public
   - Keep `STRIPE_SECRET_KEY` on the server

2. **Always verify webhook signatures**
   - Use `stripe.webhooks.constructEvent()` to verify
   - Reject webhooks with invalid signatures

3. **Validate all inputs**
   - Email format validation
   - Required field validation
   - Sanitize user inputs

4. **Use HTTPS in production**
   - Stripe requires HTTPS for webhooks
   - Ensure SSL certificate is valid

5. **Implement rate limiting**
   - Protect API routes from abuse
   - Consider using middleware

6. **Log security events**
   - Log failed webhook verifications
   - Monitor for suspicious activity
   - Set up alerts for anomalies

## Production Checklist

- [ ] Switch to production Stripe keys (`pk_live_` and `sk_live_`)
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Create production webhook endpoint in Stripe Dashboard
- [ ] Update `STRIPE_WEBHOOK_SECRET` with production secret
- [ ] Test with real card (and refund immediately)
- [ ] Enable Stripe Radar for fraud detection
- [ ] Set up email notifications
- [ ] Implement database integration
- [ ] Set up monitoring and logging
- [ ] Configure Stripe billing settings (receipts, etc.)
- [ ] Review Stripe tax settings if applicable
- [ ] Test subscription cancellation flow
- [ ] Document customer support procedures

## Troubleshooting

### Checkout session creation fails

**Check:**
- `STRIPE_SECRET_KEY` is set correctly
- Email format is valid
- Stripe API is accessible (not blocked by firewall)

### Webhook signature verification fails

**Check:**
- `STRIPE_WEBHOOK_SECRET` is set correctly
- Using correct secret for environment (test vs. production)
- Request body is not modified before verification

### Success page shows error

**Check:**
- Session ID is in URL query params
- Session exists in Stripe Dashboard
- Session payment status is "paid"
- `/api/stripe/checkout-session` route is working

## Monitoring

Key metrics to track:

1. **Conversion rate** - Checkout initiated vs. completed
2. **Failed payments** - Track and follow up
3. **Churn rate** - Subscriptions canceled
4. **MRR (Monthly Recurring Revenue)** - Track growth
5. **Average subscription lifetime** - Customer retention

Use Stripe Dashboard for built-in analytics, or integrate with your own analytics platform.

## Support

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support:** [https://support.stripe.com](https://support.stripe.com)
- **Stripe API Reference:** [https://stripe.com/docs/api](https://stripe.com/docs/api)

## Next Steps

1. **Add customer portal** - Allow customers to manage subscriptions
2. **Implement proration** - For plan changes
3. **Add coupons/discounts** - Support promotional codes
4. **Multi-currency support** - Accept payments in different currencies
5. **Usage-based billing** - If needed for your business model
6. **Failed payment recovery** - Automated retry logic
7. **Subscription analytics** - Custom dashboard for insights
