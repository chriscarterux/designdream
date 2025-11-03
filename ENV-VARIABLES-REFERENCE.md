# Environment Variables Reference

Complete reference for all environment variables used in DesignDream.

## Table of Contents

- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Environment-Specific Values](#environment-specific-values)
- [How to Get API Keys](#how-to-get-api-keys)
- [Security Best Practices](#security-best-practices)

---

## Required Variables

These variables are required for the application to function.

### Application

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `NODE_ENV` | Environment mode | `production` | Build process |
| `NEXT_PUBLIC_APP_URL` | Public application URL | `https://designdream.is` | Links, redirects |

### Supabase

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | Client & server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Client & server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (admin) key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Server only (admin operations) |

**Where to get:**
1. Go to https://app.supabase.com/project/_/settings/api
2. Copy Project URL
3. Copy anon public key
4. Copy service_role secret key (keep secret!)

### Stripe

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` or `pk_test_...` | Client-side checkout |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` or `sk_test_...` | Server-side operations |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` | Webhook verification |

**Where to get:**
1. Go to https://dashboard.stripe.com/apikeys
2. Toggle to production mode (or test for development)
3. Copy publishable key and secret key
4. For webhook secret: https://dashboard.stripe.com/webhooks → Create endpoint → Copy signing secret

### Email (Resend)

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `RESEND_API_KEY` | Resend API key | `re_...` | Email sending |
| `RESEND_FROM_EMAIL` | From email address | `noreply@designdream.is` | Email from field |

**Where to get:**
1. Go to https://resend.com/api-keys
2. Create API key
3. Verify domain first at https://resend.com/domains

---

## Optional Variables

These variables add additional functionality but aren't required for basic operation.

### Linear Integration

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `LINEAR_API_KEY` | Linear API key | `lin_api_...` | Project management sync |
| `LINEAR_WEBHOOK_SECRET` | Linear webhook secret | `...` | Webhook verification |

**Where to get:**
1. Go to https://linear.app/settings/api
2. Create personal API key

### Basecamp Integration

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `BASECAMP_CLIENT_ID` | Basecamp OAuth client ID | `...` | Basecamp integration |
| `BASECAMP_CLIENT_SECRET` | Basecamp OAuth secret | `...` | OAuth flow |
| `BASECAMP_ACCOUNT_ID` | Basecamp account ID | `...` | API calls |

**Where to get:**
1. Register app at https://launchpad.37signals.com/integrations

### Analytics

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | `G-XXXXXXXXXX` | Page tracking |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key | `phc_...` | Product analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL | `https://app.posthog.com` | Analytics endpoint |

### Error Tracking

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN | `https://...@sentry.io/...` | Error reporting |
| `SENTRY_AUTH_TOKEN` | Sentry auth token | `...` | Source map upload |
| `SENTRY_ORG` | Sentry organization | `my-org` | Configuration |
| `SENTRY_PROJECT` | Sentry project | `designdream` | Configuration |

**Where to get:**
1. Create project at https://sentry.io
2. Copy DSN from project settings

### Rate Limiting

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | `https://...` | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | `...` | Authentication |

**Where to get:**
1. Create database at https://upstash.com
2. Copy REST URL and token

### Security

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `NEXTAUTH_SECRET` | NextAuth.js secret | `[random-32-char-string]` | Session encryption |
| `JWT_SECRET` | JWT signing secret | `[random-32-char-string]` | Token signing |

**Generate with:**
```bash
openssl rand -base64 32
```

### Feature Flags

| Variable | Description | Example | Where Used |
|----------|-------------|---------|------------|
| `ENABLE_BETA_FEATURES` | Enable beta features | `true` or `false` | Feature gating |
| `ENABLE_MAINTENANCE_MODE` | Enable maintenance mode | `true` or `false` | System maintenance |

---

## Environment-Specific Values

Different environments should use different values.

### Development (.env.local)

```bash
# Local development server
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase local or development project
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # Local key

# Stripe test mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Local webhook

# Resend test
RESEND_API_KEY=re_...
```

### Preview (Vercel Preview Deployments)

```bash
# Preview URL (auto-generated by Vercel)
NEXT_PUBLIC_APP_URL=https://designdream-git-branch-user.vercel.app

# Staging database
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # Staging key

# Stripe test mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Production (Vercel Production)

```bash
# Production domain
NEXT_PUBLIC_APP_URL=https://designdream.is

# Production database
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # Production key

# Stripe live mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # Production webhook
```

---

## How to Get API Keys

### Step-by-Step for Each Service

#### Supabase
1. Create account at https://app.supabase.com
2. Create new project (or use existing)
3. Go to Project Settings → API
4. Copy URL and keys

#### Stripe
1. Create account at https://stripe.com
2. Complete business verification
3. Go to Developers → API keys
4. Toggle between test/live mode
5. Copy keys for appropriate environment

#### Resend
1. Create account at https://resend.com
2. Verify email
3. Add domain at https://resend.com/domains
4. Add DNS records (MX, TXT, DKIM)
5. Create API key at https://resend.com/api-keys

#### Linear
1. Log in to Linear
2. Go to Settings → API
3. Create personal API key
4. Copy key (shown once)

---

## Security Best Practices

### DO

- Store secrets in environment variables
- Use different keys for dev/staging/production
- Rotate keys regularly (every 90 days)
- Use secret management tools (Vercel, 1Password, etc.)
- Enable 2FA on all service accounts
- Use least privilege (e.g., anon key for client, service role only when needed)

### DON'T

- Commit secrets to git
- Share secrets in chat/email
- Use production keys in development
- Hardcode secrets in source code
- Expose service role keys to client
- Reuse secrets across projects

### Checking for Leaked Secrets

```bash
# Check git history for secrets
git log -p | grep -i "secret\|key\|password"

# Use tools like
npm install -g git-secrets
git secrets --scan-history

# Or
npm install -g truffleHog
truffleHog --regex --entropy=False .
```

### If Secret is Compromised

1. **Immediately revoke** the compromised key
2. **Generate new key** in service dashboard
3. **Update environment variables** in Vercel
4. **Redeploy** application
5. **Monitor** for suspicious activity
6. **Rotate all related secrets** as precaution

---

## Vercel Environment Variables Setup

### Via Dashboard

1. Go to https://vercel.com/dashboard
2. Select project
3. Go to Settings → Environment Variables
4. Add each variable:
   - **Name:** Variable name (e.g., `STRIPE_SECRET_KEY`)
   - **Value:** Secret value
   - **Environments:** Select Production, Preview, Development

### Via CLI

```bash
# Add single variable
vercel env add STRIPE_SECRET_KEY production

# Add from file
vercel env pull .env.production

# List all variables
vercel env ls
```

### Via vercel.json

**DON'T** put secrets in `vercel.json`. Only use for non-secret configuration:

```json
{
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## Validation

Check all required variables are set:

```bash
# Run deployment check
./scripts/deploy-check.sh

# Or manually check
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET')"
```

---

## Quick Copy-Paste Templates

### .env.local (Development)

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_
STRIPE_SECRET_KEY=sk_test_
STRIPE_WEBHOOK_SECRET=whsec_

# Resend
RESEND_API_KEY=re_
RESEND_FROM_EMAIL=noreply@designdream.is

# Linear (Optional)
LINEAR_API_KEY=lin_api_
```

### Production (Vercel Dashboard)

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://designdream.is

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe (Live Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_
STRIPE_SECRET_KEY=sk_live_
STRIPE_WEBHOOK_SECRET=whsec_

# Resend
RESEND_API_KEY=re_
RESEND_FROM_EMAIL=noreply@designdream.is
```

---

**Last Updated:** 2025-01-03
