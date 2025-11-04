# Stripe Checkout Integration Setup Guide

This guide walks you through setting up Stripe checkout for the DesignDream monthly subscription ($4,495/month).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Stripe Account Setup](#stripe-account-setup)
3. [Environment Variables](#environment-variables)
4. [Creating the Product in Stripe](#creating-the-product-in-stripe)
5. [Webhook Configuration](#webhook-configuration)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Stripe account (sign up at [stripe.com](https://stripe.com))
- Node.js 18+ installed
- Project dependencies installed (`npm install`)

## Stripe Account Setup

### 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" and complete the registration
3. Verify your email address

### 2. Get Your API Keys

1. Log in to your Stripe Dashboard
2. Navigate to **Developers** → **API keys**
3. Copy the following keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

> **Important:** Keep your secret key confidential. Never commit it to version control or expose it client-side.

## Environment Variables

### 1. Copy the Example Environment File

```bash
cp .env.local.example .env.local
```

### 2. Update `.env.local` with Your Stripe Keys

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Verify Environment Variables

Run this command to check if environment variables are loaded:

```bash
npm run dev
```

Visit `http://localhost:3000/api/stripe/create-checkout-session` - you should see a method not allowed error (this confirms the route is working).

## Creating the Product in Stripe

You have two options for creating the subscription product:

### Option 1: Automatic Creation (Recommended for Development)

The integration uses Stripe's `price_data` parameter, which automatically creates products on-the-fly during checkout. No manual product creation needed!

**Configuration** (already set in `src/lib/stripe.ts`):
- Product Name: "DesignDream Monthly Subscription"
- Description: "Full access to DesignDream platform with unlimited projects and team collaboration"
- Price: $4,495.00/month
- Currency: USD

### Option 2: Manual Product Creation (Recommended for Production)

For production, it's better to create a product and price in your Stripe Dashboard:

#### Step 1: Create the Product

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add product**
3. Fill in the details:
   - **Name:** DesignDream Monthly Subscription
   - **Description:** Full access to DesignDream platform with unlimited projects and team collaboration
   - **Pricing model:** Standard pricing
   - **Price:** $4,495.00
   - **Billing period:** Monthly
   - **Currency:** USD

4. Click **Save product**

#### Step 2: Get the Price ID

1. After creating the product, click on it to view details
2. Copy the **Price ID** (starts with `price_`)
3. Update `src/lib/stripe.ts` to use the price ID instead of `price_data`:

```typescript
// Replace the line_items in create-checkout-session/route.ts
line_items: [
  {
    price: 'price_your_price_id_here', // Use your actual price ID
    quantity: 1,
  },
],
```

## Webhook Configuration

Webhooks allow Stripe to notify your application about important events (e.g., successful payments, subscription updates).

### Development Webhooks (Using Stripe CLI)

#### 1. Install Stripe CLI

**macOS (via Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Other platforms:** See [Stripe CLI installation guide](https://stripe.com/docs/stripe-cli)

#### 2. Login to Stripe CLI

```bash
stripe login
```

This opens your browser to authenticate.

#### 3. Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

This command:
- Listens for webhook events from Stripe
- Forwards them to your local server
- Provides a webhook signing secret (starts with `whsec_`)

#### 4. Copy the Webhook Secret

Copy the webhook signing secret from the CLI output and add it to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### 5. Trigger Test Events

In a separate terminal, trigger test events:

```bash
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

### Production Webhooks

#### 1. Create a Webhook Endpoint

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your production URL: `https://yourdomain.com/api/stripe/webhooks`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your production environment variables

## Testing

### Test the Checkout Flow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Create a test checkout session** (using cURL or Postman):
   ```bash
   curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "userId": "user_123",
       "customerName": "Test User"
     }'
   ```

3. **Expected response:**
   ```json
   {
     "sessionId": "cs_test_...",
     "url": "https://checkout.stripe.com/c/pay/cs_test_..."
   }
   ```

4. **Complete the checkout:**
   - Open the URL from the response
   - Use Stripe test card numbers:
     - **Success:** `4242 4242 4242 4242`
     - **Decline:** `4000 0000 0000 0002`
     - Use any future expiry date, any CVC, and any ZIP code

5. **Verify success page:**
   - After successful payment, you'll be redirected to `/subscribe/success`
   - The page should display subscription details

### Test Card Numbers

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0027 6000 3184` | 3D Secure authentication required |

See [Stripe Testing Guide](https://stripe.com/docs/testing) for more test cards.

### Integration Testing Checklist

- [ ] Checkout session creates successfully
- [ ] Redirect to Stripe Checkout works
- [ ] Successful payment redirects to success page
- [ ] Success page displays correct subscription details
- [ ] Cancelled checkout redirects to cancel page
- [ ] Customer is created in Stripe Dashboard
- [ ] Subscription is created in Stripe Dashboard
- [ ] Webhooks are received (check Stripe CLI output)

## Production Deployment

### Pre-deployment Checklist

- [ ] Switch to production API keys in environment variables
- [ ] Create production product and price in Stripe
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Set up production webhook endpoint
- [ ] Test with real credit card (refund immediately)
- [ ] Enable Stripe Radar for fraud prevention
- [ ] Set up email notifications for failed payments

### Environment Variables for Production

```bash
# Use production keys (pk_live_ and sk_live_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Security Best Practices

1. **Never expose secret keys client-side**
   - Only `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` should be public
   - Keep `STRIPE_SECRET_KEY` server-side only

2. **Validate webhook signatures**
   - Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
   - Reject webhooks with invalid signatures

3. **Use HTTPS in production**
   - Stripe requires HTTPS for production webhooks
   - Ensure your domain has a valid SSL certificate

4. **Implement rate limiting**
   - Protect API routes from abuse
   - Consider using middleware for rate limiting

5. **Log and monitor**
   - Log all Stripe API calls
   - Set up monitoring for failed payments
   - Track subscription metrics

## Troubleshooting

### Common Issues

#### 1. "No such customer" error

**Problem:** Customer ID is invalid or doesn't exist.

**Solution:**
- Ensure customer is created before checkout session
- Use the correct Stripe account (test vs. production)

#### 2. Webhook signature verification fails

**Problem:** `STRIPE_WEBHOOK_SECRET` is incorrect or missing.

**Solution:**
- Verify webhook secret in `.env.local`
- For development, use Stripe CLI secret
- For production, use Dashboard webhook secret

#### 3. Checkout session not creating

**Problem:** API route returns 500 error.

**Solution:**
- Check server logs for detailed error
- Verify `STRIPE_SECRET_KEY` is set correctly
- Ensure Stripe package is installed (`npm install stripe`)

#### 4. Success page shows error

**Problem:** Session ID not passed in URL or session retrieval fails.

**Solution:**
- Check that success URL includes `{CHECKOUT_SESSION_ID}` placeholder
- Verify session exists in Stripe Dashboard
- Check API route `/api/stripe/checkout-session` logs

### Debug Mode

Enable debug logging in `src/lib/stripe.ts`:

```typescript
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
  appInfo: {
    name: 'DesignDream',
    version: '0.1.0',
  },
  // Add this for debugging
  maxNetworkRetries: 2,
  timeout: 20000,
});
```

### Getting Help

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support:** [https://support.stripe.com](https://support.stripe.com)
- **Stripe Discord:** [https://stripe.com/discord](https://stripe.com/discord)

## Next Steps

After completing this setup:

1. **Implement webhook handler** (`/api/stripe/webhooks/route.ts`)
   - Handle subscription lifecycle events
   - Update user records in database
   - Send email notifications

2. **Add customer portal**
   - Allow customers to manage subscriptions
   - Update payment methods
   - View invoices

3. **Implement usage tracking** (if applicable)
   - Track metered billing
   - Monitor subscription usage

4. **Set up analytics**
   - Track conversion rates
   - Monitor churn
   - Analyze revenue metrics

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── stripe/
│   │       ├── create-checkout-session/
│   │       │   └── route.ts          # Creates checkout session
│   │       └── checkout-session/
│   │           └── route.ts          # Retrieves session details
│   └── subscribe/
│       ├── success/
│       │   └── page.tsx             # Success page
│       └── cancel/
│           └── page.tsx             # Cancel page
└── lib/
    └── stripe.ts                    # Stripe client & config
```

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
