# Stripe Security Implementation

This document describes the comprehensive security measures implemented for Stripe payment processing in the DesignDream application.

## Overview

The Stripe integration has been hardened with multiple layers of security to prevent common payment processing vulnerabilities and ensure reliable operation.

## Security Features

### 1. API Key Validation (CRITICAL)

**Location:** `/src/lib/stripe.ts`

**Features:**
- Validates `STRIPE_SECRET_KEY` exists at startup
- Checks key format (must be `sk_test_*` or `sk_live_*`)
- Warns if test key used in production
- Prevents app startup with invalid key
- Logs initialization status without exposing key

**Impact:** Prevents app crashes, invalid charges, and configuration errors.

```typescript
// Automatic validation on module load
const validatedKey = validateStripeKey();
```

### 2. Server-Side Price Validation

**Location:** `/src/lib/stripe.ts`

**Features:**
- Price constants defined server-side only
- Client cannot manipulate prices
- Price validation helper function
- Metadata includes expected price for verification

**Impact:** Prevents price manipulation attacks where attackers change subscription amounts.

```typescript
// Server-side price constants (client cannot override)
export const SERVER_PRICE_CONSTANTS = {
  MONTHLY_SUBSCRIPTION: 449500, // $4,495.00
} as const;

// Used in checkout session creation
const priceAmount = SERVER_PRICE_CONSTANTS.MONTHLY_SUBSCRIPTION;
```

### 3. Idempotency Keys

**Location:** `/src/lib/stripe.ts`, `/src/app/api/stripe/create-checkout-session/route.ts`

**Features:**
- Unique idempotency key per checkout session
- Prevents duplicate charges from retries
- Prevents double-click submission issues
- Uses operation + userId + timestamp + random

**Impact:** Protects customers from being charged multiple times.

```typescript
const idempotencyKey = generateIdempotencyKey(
  'create-checkout-session',
  userId || email,
  Date.now().toString().slice(-6)
);

await stripe.checkout.sessions.create(params, { idempotencyKey });
```

### 4. Retry Logic with Exponential Backoff

**Location:** `/src/lib/stripe.ts`

**Features:**
- Automatic retry for transient errors (network, rate limits)
- Exponential backoff with jitter (1s, 2s, 4s)
- Max 3 retries
- No retry for non-retryable errors (card declined, etc.)
- Detailed logging of retry attempts

**Impact:** Improves reliability during network issues or Stripe API rate limits.

```typescript
const session = await retryStripeOperation(async () => {
  // Stripe API calls here
}, 3, 1000); // 3 retries, 1 second initial delay
```

### 5. Enhanced Error Handling

**Location:** `/src/lib/stripe.ts`, `/src/app/api/stripe/create-checkout-session/route.ts`

**Features:**
- User-friendly error messages
- Specific error types (card_error, rate_limit, api_connection, etc.)
- Retry indication for client
- Technical logging for debugging
- Security-conscious error messages (no sensitive data exposure)

**Error Types:**
- `card_error` - Card declined, insufficient funds, expired card
- `invalid_request` - Invalid API request
- `authentication_error` - API key issues
- `api_connection` - Network failures
- `api_error` - Stripe internal errors
- `rate_limit` - Too many requests
- `idempotency_error` - Duplicate request conflict
- `unknown` - Unexpected errors

```typescript
if (error instanceof Stripe.errors.StripeError) {
  const errorInfo = getStripeErrorMessage(error);
  // Returns user-friendly message and retry recommendation
}
```

### 6. Health Check System

**Location:** `/src/lib/stripe-health.ts`, `/src/app/api/stripe/health/route.ts`

**Features:**
- Comprehensive health check
- Validates API connectivity
- Checks account access
- Verifies webhook configuration
- Optional startup health check
- Monitoring endpoint

**Health Check Endpoints:**
- `GET /api/stripe/health` - Full health check with details
- `HEAD /api/stripe/health` - Lightweight ping

**Health Status:**
- `healthy` - All systems operational
- `degraded` - Works but missing webhooks
- `unhealthy` - Payment processing unavailable

```typescript
// Optional: Run on startup
STRIPE_HEALTH_CHECK_ON_STARTUP=true

// Check via API
curl http://localhost:3000/api/stripe/health
```

### 7. Webhook Secret Validation

**Location:** `/src/lib/stripe-health.ts`

**Features:**
- Validates webhook secret exists
- Checks format (`whsec_*`)
- Clear error messages

```typescript
const validation = validateWebhookSecret();
if (!validation.valid) {
  console.error(validation.error);
}
```

## Configuration

### Required Environment Variables

```bash
# Required
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional
STRIPE_HEALTH_CHECK_ON_STARTUP=true  # Validate Stripe on startup
```

### Testing Key Validation

**Test 1: Missing Key**
```bash
# Remove STRIPE_SECRET_KEY from .env.local
npm run dev
# Expected: Error on startup
```

**Test 2: Invalid Format**
```bash
STRIPE_SECRET_KEY=invalid_key
npm run dev
# Expected: Error about invalid format
```

**Test 3: Test Key in Production**
```bash
NODE_ENV=production STRIPE_SECRET_KEY=sk_test_...
npm run build && npm start
# Expected: Warning in logs
```

## Error Handling Examples

### Card Declined

**User sees:**
```
"Your card was declined. Please try a different payment method."
```

**Developer logs:**
```
Stripe card_error: card_declined
Status: 400
Customer ID: cus_xxx
```

### Network Failure

**User sees:**
```
"Network error. Please check your connection and try again."
```

**Developer logs:**
```
Stripe operation failed (attempt 1/3). Retrying in 1000ms...
Stripe operation failed (attempt 2/3). Retrying in 2000ms...
✓ Checkout session created successfully
```

### Rate Limit

**User sees:**
```
"Too many requests. Please wait a moment and try again."
```

**Developer logs:**
```
Stripe rate_limit error
Retrying with exponential backoff...
```

## Security Best Practices

### DO ✅

1. Always use server-side price validation
2. Implement idempotency keys for all Stripe operations
3. Use retry logic for transient errors
4. Validate Stripe keys on startup
5. Use webhook secrets for webhook verification
6. Log errors with context (without sensitive data)
7. Return user-friendly error messages
8. Monitor health check endpoint

### DON'T ❌

1. Never trust client-provided prices
2. Never expose full API keys in logs
3. Never retry non-retryable errors
4. Never skip idempotency keys
5. Never expose technical error details to users
6. Never commit API keys to git
7. Never use test keys in production
8. Never skip input validation

## Monitoring

### Health Check

Monitor the health endpoint:

```bash
# Full check
curl http://localhost:3000/api/stripe/health | jq

# Quick ping
curl -I http://localhost:3000/api/stripe/health
```

### Logs

Key log messages to monitor:

```bash
# Success
"✓ Stripe initialized in TEST mode (sk_test_xxxx...)"
"✓ Checkout session created successfully: cs_xxx"

# Warnings
"⚠️  WARNING: Using Stripe test key in production"
"⚠️  No webhook endpoints configured"

# Errors
"✗ Failed to connect to Stripe account"
"Stripe card_error: card_declined"
```

## Testing

### Unit Tests

Test key validation:
```typescript
describe('validateStripeKey', () => {
  it('throws if key missing', () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(() => validateStripeKey()).toThrow();
  });

  it('throws if key has invalid format', () => {
    process.env.STRIPE_SECRET_KEY = 'invalid';
    expect(() => validateStripeKey()).toThrow();
  });
});
```

### Integration Tests

Test checkout flow:
```bash
# Valid request
curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Invalid email
curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}'
```

## Compliance

### PCI DSS

- No card data stored on server ✅
- Stripe.js handles sensitive data ✅
- HTTPS enforced in production ✅
- Server-side validation ✅

### GDPR

- Customer email validated ✅
- Metadata includes minimal PII ✅
- Error messages don't leak data ✅

## Incident Response

### If Stripe API Key Compromised

1. Immediately rotate key in Stripe Dashboard
2. Update `STRIPE_SECRET_KEY` in production
3. Restart application
4. Monitor for unauthorized charges
5. Review access logs

### If Duplicate Charges Occur

1. Check idempotency key implementation
2. Review server logs for duplicates
3. Issue refund via Stripe Dashboard
4. Contact customer

### If Health Check Fails

1. Verify `STRIPE_SECRET_KEY` is set
2. Check network connectivity
3. Verify Stripe API status: https://status.stripe.com
4. Review error logs
5. Test with health endpoint

## Future Improvements

Potential enhancements:

1. **Rate Limiting** - Add per-IP rate limits
2. **Fraud Detection** - Integrate Stripe Radar
3. **3D Secure** - Require for high-value transactions
4. **Webhook Retry** - Custom retry logic for webhooks
5. **Audit Logging** - Structured logs to monitoring service
6. **Alerts** - Notify team of health check failures
7. **Metrics** - Track success/error rates

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [Idempotent Requests](https://stripe.com/docs/api/idempotent_requests)
- [Error Handling](https://stripe.com/docs/api/errors)
- [Webhooks Guide](https://stripe.com/docs/webhooks)

## Support

For issues or questions about Stripe security implementation:

1. Check logs for error details
2. Test with health check endpoint
3. Review this documentation
4. Contact team lead or DevOps

---

**Last Updated:** 2025-11-03
**Version:** 1.0.0
**Status:** Production Ready
