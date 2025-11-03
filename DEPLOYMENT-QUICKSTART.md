# Vercel Deployment Quick Start

Fast-track guide to deploying DesignDream to production.

## Prerequisites

- [ ] GitHub repository pushed
- [ ] Vercel account created
- [ ] Domain registered (designdream.is)
- [ ] Supabase production database ready
- [ ] Stripe account (production mode)
- [ ] Resend account for emails

## 5-Minute Deployment

### 1. Connect to Vercel (2 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd /Users/howdycarter/Documents/projects/designdream
vercel
```

Or via dashboard:
1. Go to https://vercel.com/new
2. Import `designdream` repository
3. Click "Deploy"

### 2. Add Environment Variables (2 minutes)

Go to Vercel Dashboard → Settings → Environment Variables

Copy all from `.env.production.example`:

**Critical Variables (Required):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://designdream.is
```

### 3. Configure Domain (1 minute)

In Vercel Dashboard → Settings → Domains:
1. Add domain: `designdream.is`
2. Update DNS records (provided by Vercel)
3. Wait for SSL certificate

### 4. Deploy

```bash
vercel --prod
```

Or push to main:
```bash
git push origin main
```

## Post-Deployment Checklist

- [ ] Visit https://designdream.is
- [ ] Test user signup/login
- [ ] Test Stripe checkout
- [ ] Verify emails sending
- [ ] Check Stripe webhook receiving events
- [ ] Run Lighthouse audit

## Quick Links

- **Production:** https://designdream.is
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Full Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## Validation

Before deploying, run:
```bash
./scripts/deploy-check.sh
```

## Environment Variables Quick Reference

### Required for MVP
```bash
NEXT_PUBLIC_SUPABASE_URL           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY      # Supabase anon key (public)
SUPABASE_SERVICE_ROLE_KEY          # Supabase service role (secret)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY # Stripe publishable key
STRIPE_SECRET_KEY                  # Stripe secret key
STRIPE_WEBHOOK_SECRET              # Stripe webhook signing secret
RESEND_API_KEY                     # Resend API key
NEXT_PUBLIC_APP_URL                # Your domain
```

### Optional (Can Add Later)
```bash
LINEAR_API_KEY                     # Linear integration
BASECAMP_CLIENT_ID                 # Basecamp integration
NEXT_PUBLIC_GA_MEASUREMENT_ID      # Google Analytics
NEXT_PUBLIC_SENTRY_DSN             # Error tracking
UPSTASH_REDIS_REST_URL             # Rate limiting
```

## Troubleshooting

**Build fails?**
```bash
npm run build  # Test locally first
```

**Environment variables not working?**
- Redeploy after adding variables
- Check variable names (case-sensitive)

**Domain not resolving?**
- Wait 5-30 minutes for DNS propagation
- Verify DNS records match Vercel requirements

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive guide.
