# DesignDream Production Deployment Guide

Complete guide for deploying DesignDream to Vercel with custom domain (designdream.is).

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Vercel Project Setup](#vercel-project-setup)
4. [Custom Domain Configuration](#custom-domain-configuration)
5. [Database Setup](#database-setup)
6. [Stripe Configuration](#stripe-configuration)
7. [Email Configuration](#email-configuration)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Continuous Deployment](#continuous-deployment)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Rollback Procedures](#rollback-procedures)
12. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure all these items are complete:

### Code Quality
- [ ] All TypeScript builds without errors (`npm run build`)
- [ ] All tests passing (`npm run test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No console.log or debug code in production files
- [ ] All TODO comments reviewed

### Security
- [ ] Environment variables documented
- [ ] No secrets committed to git
- [ ] API routes have proper authentication
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] SQL injection prevention verified

### Database
- [ ] Production database created in Supabase
- [ ] All migrations applied
- [ ] Row Level Security (RLS) policies configured
- [ ] Database backups enabled
- [ ] Connection pooling configured

### Services
- [ ] Stripe account in production mode
- [ ] Stripe webhook endpoint created
- [ ] Resend domain verified
- [ ] Linear API keys obtained
- [ ] All third-party services tested

### Performance
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing

---

## Environment Variables Setup

### Required Environment Variables

Create these environment variables in Vercel dashboard:

#### Application
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://designdream.is
```

#### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get:**
1. Go to https://app.supabase.com/project/_/settings/api
2. Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

#### Stripe
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**How to get:**
1. Switch Stripe to production mode
2. Go to https://dashboard.stripe.com/apikeys
3. Create API keys for production
4. Set up webhook endpoint (see [Stripe Configuration](#stripe-configuration))

#### Email (Resend)
```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@designdream.is
```

**How to get:**
1. Go to https://resend.com/api-keys
2. Create API key
3. Verify domain designdream.is

#### Linear (Optional)
```bash
LINEAR_API_KEY=lin_api_...
```

**How to get:**
1. Go to https://linear.app/settings/api
2. Create personal API key

### Optional Environment Variables

#### Analytics
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

#### Error Tracking
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

#### Rate Limiting
```bash
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## Vercel Project Setup

### Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
vercel login
```

### Step 2: Connect GitHub Repository

1. Go to https://vercel.com/new
2. Import your GitHub repository: `designdream`
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### Step 3: Configure Build Settings

In Vercel dashboard → Settings → General:

- **Node.js Version:** 20.x (recommended)
- **Build & Development Settings:**
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### Step 4: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

1. Add all variables from `.env.production.example`
2. Select environments: **Production**, **Preview** (optional), **Development** (optional)
3. Click "Save"

**Important:** Different values for different environments:
- **Production:** Live keys, production database
- **Preview:** Test keys, staging database
- **Development:** Local development keys

### Step 5: Deploy

#### Option A: Via Vercel Dashboard
1. Go to Deployments tab
2. Click "Deploy" or wait for automatic deployment

#### Option B: Via CLI
```bash
cd /Users/howdycarter/Documents/projects/designdream
vercel --prod
```

#### Option C: Via Git Push (Recommended)
```bash
git push origin main
# Vercel automatically deploys main branch
```

---

## Custom Domain Configuration

### Step 1: Add Domain in Vercel

1. Go to Vercel dashboard → Settings → Domains
2. Add domain: `designdream.is`
3. Add www subdomain: `www.designdream.is` (optional)

### Step 2: Configure DNS Records

In your domain registrar (e.g., Namecheap, GoDaddy):

#### For apex domain (designdream.is):

**Option A: A Records (Recommended)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Option B: CNAME (if supported)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

#### For www subdomain:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 3: Verify Domain

1. Wait for DNS propagation (5-30 minutes)
2. Check status in Vercel dashboard
3. Verify SSL certificate is issued

### Step 4: Test Domain

```bash
# Check DNS resolution
dig designdream.is

# Check HTTPS
curl -I https://designdream.is

# Visit in browser
open https://designdream.is
```

---

## Database Setup

### Step 1: Create Production Database

1. Go to https://app.supabase.com
2. Create new project:
   - **Name:** DesignDream Production
   - **Database Password:** Generate strong password (save in password manager)
   - **Region:** Choose closest to Vercel region (US East for iad1)

### Step 2: Apply Migrations

```bash
# Set production database URL
export DATABASE_URL="postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres"

# Apply migrations
npm run db:migrate

# Or manually in Supabase SQL Editor:
# Copy and paste migration files from supabase/migrations/
```

### Step 3: Configure Connection Pooling

For production, use connection pooling:

```bash
# In .env.production or Vercel environment variables
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:6543/postgres?pgbouncer=true
```

**Note:** Port 6543 is for connection pooling (recommended for serverless)

### Step 4: Set Up Row Level Security (RLS)

Ensure RLS policies are enabled for all tables:

```sql
-- Example: Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### Step 5: Configure Database Backups

1. Go to Supabase dashboard → Settings → Database
2. Enable automatic backups (daily recommended)
3. Set retention period (7-30 days)

---

## Stripe Configuration

### Step 1: Switch to Production Mode

1. Go to https://dashboard.stripe.com
2. Toggle from "Test mode" to "Production mode" (top right)

### Step 2: Create Products and Prices

```bash
# Create products in Stripe dashboard or via CLI:
stripe products create \
  --name "Starter Plan" \
  --description "Basic design services"

stripe prices create \
  --product prod_... \
  --unit-amount 9900 \
  --currency usd \
  --recurring-interval month
```

**Save Price IDs:**
```bash
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PROFESSIONAL=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
```

### Step 3: Configure Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint:
   - **URL:** `https://designdream.is/api/webhooks/stripe`
   - **Events to send:**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Step 4: Test Webhook

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local (for testing)
stripe listen --forward-to https://designdream.is/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed
```

### Step 5: Configure Stripe Customer Portal

1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Configure:
   - **Branding:** Add logo and colors
   - **Functionality:** Enable subscription management
   - **Business information:** Add company details

---

## Email Configuration

### Step 1: Set Up Resend

1. Go to https://resend.com
2. Create account and API key

### Step 2: Verify Domain

1. Add domain: `designdream.is`
2. Add DNS records to your domain:

```
Type: TXT
Name: @
Value: resend=...

Type: MX
Name: @
Value: mx1.resend.com (Priority: 10)
Value: mx2.resend.com (Priority: 20)

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;

Type: TXT
Name: resend._domainkey
Value: [provided by Resend]
```

3. Wait for verification (5-30 minutes)

### Step 3: Configure From Address

```bash
RESEND_FROM_EMAIL=noreply@designdream.is
```

### Step 4: Test Email

Create test API route:

```typescript
// app/api/test-email/route.ts
import { Resend } from 'resend';

export async function POST() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'noreply@designdream.is',
    to: 'your@email.com',
    subject: 'Test Email',
    html: '<p>Email configuration successful!</p>',
  });

  return Response.json({ success: true });
}
```

---

## Post-Deployment Verification

### Step 1: Health Check

```bash
# Check application health
curl https://designdream.is/api/health

# Expected response:
# { "status": "ok", "timestamp": "..." }
```

### Step 2: Verify Authentication

1. Visit https://designdream.is
2. Sign up for new account
3. Verify email confirmation
4. Log in successfully

### Step 3: Test Payment Flow

1. Navigate to subscription page
2. Click subscribe
3. Complete Stripe checkout (use test card)
4. Verify subscription created in database
5. Check webhook received

### Step 4: Verify Email Delivery

1. Trigger email (e.g., password reset)
2. Check inbox
3. Verify sender domain
4. Check spam folder

### Step 5: Performance Audit

```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse https://designdream.is --view

# Check Core Web Vitals
# Visit: https://pagespeed.web.dev/
```

### Step 6: Security Scan

```bash
# Check security headers
curl -I https://designdream.is

# Verify HTTPS
# Verify security headers (CSP, X-Frame-Options, etc.)
```

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Production:** Push to `main` branch
- **Preview:** Push to any other branch or open PR

### Deployment Workflow

```bash
# 1. Make changes in feature branch
git checkout -b feature/new-feature

# 2. Commit changes
git add .
git commit -m "feat: add new feature"

# 3. Push to GitHub
git push origin feature/new-feature

# 4. Open PR - Vercel creates preview deployment

# 5. Review preview deployment
# Preview URL: https://designdream-git-feature-new-feature-username.vercel.app

# 6. Merge PR - Vercel deploys to production
```

### Deployment Notifications

Set up Slack/Discord notifications:

1. Go to Vercel dashboard → Settings → Notifications
2. Add webhook URL
3. Configure notification events:
   - Deployment started
   - Deployment completed
   - Deployment failed

---

## Monitoring & Maintenance

### Vercel Analytics

Enable Vercel Analytics:

1. Go to Vercel dashboard → Analytics
2. Enable Web Analytics
3. View real-time metrics:
   - Page views
   - Unique visitors
   - Top pages
   - Devices and browsers

### Error Tracking (Sentry - Optional)

1. Create Sentry project
2. Install Sentry SDK:

```bash
npm install @sentry/nextjs
```

3. Configure:

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Database Monitoring

1. Go to Supabase dashboard → Monitoring
2. Monitor:
   - Database size
   - Connection count
   - Query performance
   - Error rate

### Uptime Monitoring

Set up uptime monitoring with:
- **UptimeRobot** (free): https://uptimerobot.com
- **Pingdom**: https://pingdom.com
- **Better Uptime**: https://betteruptime.com

Monitor endpoints:
- `https://designdream.is` (main site)
- `https://designdream.is/api/health` (API health)

---

## Rollback Procedures

### Quick Rollback via Vercel

1. Go to Vercel dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Confirm rollback

### Rollback via CLI

```bash
# List recent deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url] --prod
```

### Rollback Database Migrations

```bash
# If migration caused issues, restore from backup:

# 1. Go to Supabase dashboard → Database → Backups
# 2. Select backup before migration
# 3. Restore database

# Or manually rollback migration:
# Run down migration SQL
```

### Emergency Maintenance Mode

If critical issue found, enable maintenance mode:

```bash
# Add environment variable in Vercel:
ENABLE_MAINTENANCE_MODE=true

# Redeploy
```

Create middleware to check:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (process.env.ENABLE_MAINTENANCE_MODE === 'true') {
    return new Response('Under maintenance', { status: 503 });
  }
}
```

---

## Troubleshooting

### Build Failures

**Error:** `Type error: Cannot find module...`

**Solution:**
```bash
# Ensure all dependencies installed
npm install

# Check TypeScript config
npm run type-check

# Verify build locally
npm run build
```

**Error:** `ENOENT: no such file or directory`

**Solution:**
- Check file paths in imports (case-sensitive in production)
- Verify all required files committed to git

### Environment Variables Not Working

**Issue:** Variables undefined in production

**Solution:**
1. Verify variables set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. Clear build cache: `vercel --force`

### Database Connection Issues

**Error:** `Connection timeout` or `Too many connections`

**Solution:**
```bash
# Use connection pooling (port 6543)
DATABASE_URL=postgresql://postgres:[password]@db.project.supabase.co:6543/postgres?pgbouncer=true

# Increase pool size in Supabase settings
# Go to Database → Settings → Connection pooling
```

### Stripe Webhook Failures

**Error:** Webhook signature verification failed

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` is from production webhook
2. Check webhook URL is correct
3. Ensure no trailing slash in URL
4. Verify request body parsing in API route

### Domain Not Resolving

**Issue:** Domain shows Vercel 404 page

**Solution:**
1. Verify DNS records propagated: `dig designdream.is`
2. Wait up to 48 hours for full propagation
3. Check DNS configuration matches Vercel requirements
4. Ensure domain added in Vercel dashboard

### Slow Performance

**Issue:** Pages loading slowly

**Solution:**
1. Check Vercel Analytics for bottlenecks
2. Optimize images: use Next.js Image component
3. Enable caching headers
4. Use ISR (Incremental Static Regeneration) where possible
5. Check database query performance

### Email Not Sending

**Issue:** Emails not delivered

**Solution:**
1. Verify Resend domain verified
2. Check API key is valid
3. Review DNS records (MX, TXT)
4. Check email logs in Resend dashboard
5. Verify rate limits not exceeded

---

## Quick Reference

### Essential URLs

- **Production Site:** https://designdream.is
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Resend Dashboard:** https://resend.com/emails

### Deployment Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Promote deployment
vercel promote [deployment-url] --prod
```

### Environment Variable Commands

```bash
# Add environment variable
vercel env add [name]

# Remove environment variable
vercel env rm [name]

# List environment variables
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

---

## Support

### Need Help?

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://support.stripe.com
- **Next.js Discord:** https://nextjs.org/discord

### Documentation

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs

---

**Last Updated:** 2025-01-03

**Deployment Checklist:** Run `./scripts/deploy-check.sh` before each deployment
