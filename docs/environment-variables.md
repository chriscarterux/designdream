# Environment Variables Documentation

## Overview

This project uses comprehensive environment variable validation to ensure all required configuration is present and properly formatted before the application starts. This prevents runtime errors and provides clear feedback when configuration is missing or incorrect.

## Validation Features

- **Required vs Optional**: Clear distinction between critical and optional variables
- **Format Validation**: Automatic checks for URL format, JWT structure, API key prefixes
- **Helpful Error Messages**: Detailed errors with examples when validation fails
- **Development Warnings**: Alerts for missing optional variables in development mode
- **Type Safety**: TypeScript-safe access through the `env` export

## Required Environment Variables

These variables MUST be set for the application to start:

### Supabase Configuration

```bash
# Supabase project URL (must be valid HTTPS URL)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Supabase anonymous/public key (must be valid JWT starting with "eyJ")
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Optional Environment Variables

These variables are optional but recommended for full functionality:

### Supabase Admin Access

```bash
# Service role key for admin operations (bypass RLS)
# Required for: Admin operations, bulk data operations
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stripe Payment Processing

```bash
# Stripe secret key (must start with sk_test_ or sk_live_)
# Required for: Payment processing, subscription management
STRIPE_SECRET_KEY=sk_test_...

# Stripe publishable key (must start with pk_test_ or pk_live_)
# Required for: Client-side checkout, payment forms
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe webhook secret (from Stripe dashboard)
# Required for: Processing Stripe webhooks, payment confirmations
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email Notifications

```bash
# Resend API key (must start with re_)
# Required for: Sending transactional emails, notifications
RESEND_API_KEY=re_...
```

### Application Configuration

```bash
# Application URL for redirects and emails
# Default: http://localhost:3000 in development
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Basecamp Integration (Optional)

```bash
# Basecamp OAuth credentials
BASECAMP_CLIENT_ID=your_client_id
BASECAMP_CLIENT_SECRET=your_client_secret
BASECAMP_ACCOUNT_ID=your_account_id
```

## Setup Instructions

### 1. Create Environment File

```bash
# Copy the example file
cp .env.local.example .env.local
```

### 2. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Get Stripe Credentials (Optional)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy:
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. For webhooks:
   - Go to Developers → Webhooks
   - Add endpoint
   - Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### 4. Get Resend API Key (Optional)

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create new API key
3. Copy to `RESEND_API_KEY`

### 5. Start Development Server

```bash
npm run dev
```

The validation will run automatically and show helpful error messages if anything is missing.

## Validation Error Examples

### Missing Required Variable

```
========================================
ENVIRONMENT CONFIGURATION ERROR
========================================

The following environment variables have issues:

MISSING: NEXT_PUBLIC_SUPABASE_URL
  Description: Supabase project URL
  Example: https://xxxxxxxxxxxxx.supabase.co

----------------------------------------
HOW TO FIX:
----------------------------------------
1. Copy .env.local.example to .env.local
2. Fill in the required values
3. Restart your development server
4. Verify values at: https://supabase.com/dashboard
   and https://dashboard.stripe.com/apikeys
========================================
```

### Invalid Format

```
INVALID: NEXT_PUBLIC_SUPABASE_ANON_KEY
  Description: Invalid JWT format (Supabase keys should start with "eyJ")
  Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Invalid Stripe Key

```
INVALID: STRIPE_SECRET_KEY
  Description: Invalid Stripe secret key format (expected: sk_test_ or sk_live_)
  Example: sk_test_... or sk_live_...
```

## Using Environment Variables in Code

### Type-Safe Access (Recommended)

```typescript
import { env } from '@/lib/env';

// Supabase
const supabaseUrl = env.supabase.url;
const anonKey = env.supabase.anonKey;

// Stripe
const stripeKey = env.stripe.secretKey;

// Email
const resendKey = env.email.resendApiKey;

// App config
const appUrl = env.app.url;

// Runtime checks
if (env.isProduction) {
  // Production-only code
}
```

### Direct Access (Not Recommended)

```typescript
// Avoid this - no type safety or validation
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

## Development vs Production

### Development Mode

- Shows warnings for missing optional variables
- Uses test API keys (sk_test_, pk_test_)
- Verbose error messages
- Success confirmation on startup

### Production Mode

- Silent for optional variables
- Requires live API keys (sk_live_, pk_live_)
- Only logs critical errors
- Fails fast on missing required variables

## Testing the Validation

### Test with Missing Variable

```bash
# Temporarily rename .env.local
mv .env.local .env.local.backup

# Start dev server - should show validation error
npm run dev

# Restore
mv .env.local.backup .env.local
```

### Test with Invalid Format

```bash
# Edit .env.local and set invalid value
NEXT_PUBLIC_SUPABASE_ANON_KEY=invalid_key

# Start dev server - should show format validation error
npm run dev
```

## Security Best Practices

### DO:
- Use `.env.local` for local development (gitignored)
- Use environment variables in deployment platform (Vercel, etc.)
- Rotate service role keys regularly
- Use test keys in development
- Use live keys only in production

### DON'T:
- Commit `.env.local` to git
- Share service role keys
- Use production keys in development
- Expose secret keys to client-side code
- Hardcode secrets in source code

## Troubleshooting

### "Missing required environment variable"

**Solution**: Copy `.env.local.example` to `.env.local` and fill in values

### "Invalid URL format"

**Solution**: Ensure URL starts with `https://` and is properly formatted

### "Invalid JWT format"

**Solution**: Copy key directly from Supabase dashboard without modification

### "Invalid Stripe key format"

**Solution**: Ensure you're using the correct key type (secret vs publishable)

### Variables not loading

**Solution**: Restart development server after changing `.env.local`

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Resend Documentation](https://resend.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## Maintenance

When adding new environment variables:

1. Add to `ENV_CONFIG` array in `/src/lib/env.ts`
2. Add validation function if needed
3. Update `.env.local.example`
4. Update this documentation
5. Add to `env` export for type-safe access
