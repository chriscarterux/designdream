# Production Deployment Checklist

Use this checklist before and after deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript compiles without errors: `npm run type-check`
- [ ] All ESLint checks pass: `npm run lint`
- [ ] Production build succeeds: `npm run build`
- [ ] No console.log in production code
- [ ] No TODO comments for critical features
- [ ] All tests passing (when implemented)

### Security
- [ ] No secrets in source code
- [ ] All API keys in environment variables
- [ ] CORS configured correctly
- [ ] Rate limiting implemented (if applicable)
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF protection in place

### Environment Setup
- [ ] Production Supabase database created
- [ ] All database migrations applied
- [ ] Row Level Security (RLS) policies configured
- [ ] Database backups enabled
- [ ] Stripe switched to production mode
- [ ] Stripe products and prices created
- [ ] Stripe webhook endpoint configured
- [ ] Resend domain verified
- [ ] All environment variables documented

### Vercel Configuration
- [ ] Vercel project created
- [ ] GitHub repository connected
- [ ] All environment variables added in Vercel
- [ ] Production environment variables set
- [ ] Preview environment variables set (optional)
- [ ] Build settings configured
- [ ] vercel.json reviewed
- [ ] .vercelignore configured

### Domain Setup
- [ ] Domain registered (designdream.is)
- [ ] Domain added in Vercel
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] www subdomain configured (optional)

### Documentation
- [ ] DEPLOYMENT.md reviewed
- [ ] ENV-VARIABLES-REFERENCE.md updated
- [ ] All API endpoints documented
- [ ] README.md updated

## Deployment

### Automated Deployment
- [ ] Push to main branch: `git push origin main`
- [ ] GitHub Actions workflow runs successfully
- [ ] Vercel deployment completes
- [ ] No build errors in Vercel logs

### Manual Deployment (Alternative)
- [ ] Run deployment check: `./scripts/deploy-check.sh`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Verify deployment URL

## Post-Deployment Verification

### Application Health
- [ ] Site loads: https://designdream.is
- [ ] SSL certificate valid (HTTPS)
- [ ] No console errors in browser
- [ ] Health check endpoint works: https://designdream.is/api/health
- [ ] Sitemap accessible: https://designdream.is/sitemap.xml
- [ ] Robots.txt accessible: https://designdream.is/robots.txt

### Authentication
- [ ] Sign up page loads
- [ ] New user can sign up
- [ ] Email confirmation sent (if enabled)
- [ ] User can log in
- [ ] User can log out
- [ ] Password reset works

### Database
- [ ] Database connections working
- [ ] Queries executing successfully
- [ ] RLS policies enforcing correctly
- [ ] No connection pool exhaustion

### Stripe Integration
- [ ] Pricing page displays correctly
- [ ] Checkout session creates
- [ ] Test payment succeeds
- [ ] Webhook receives events
- [ ] Subscription created in database
- [ ] Customer portal accessible

### Email Delivery
- [ ] Welcome email sends
- [ ] Password reset email sends
- [ ] Emails not marked as spam
- [ ] Sender domain shows correctly
- [ ] Email links work correctly

### Performance
- [ ] Page load time < 3s
- [ ] Time to First Byte (TTFB) < 600ms
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Images load correctly
- [ ] Fonts load without flash

### SEO
- [ ] Meta tags present
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Sitemap indexed
- [ ] robots.txt allows crawling
- [ ] Canonical URLs set

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Safari
- [ ] Works in Firefox
- [ ] Works in Edge
- [ ] Mobile responsive
- [ ] Tablet responsive

### Security Headers
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Strict-Transport-Security set
- [ ] Content-Security-Policy configured
- [ ] Referrer-Policy set

### Monitoring Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry)
- [ ] Uptime monitoring set up
- [ ] Performance monitoring active
- [ ] Log aggregation configured
- [ ] Alerts configured

### Analytics (Optional)
- [ ] Google Analytics tracking
- [ ] PostHog tracking
- [ ] Conversion tracking
- [ ] Event tracking

## Post-Deployment Actions

### Immediate
- [ ] Announce deployment to team
- [ ] Update status page (if applicable)
- [ ] Monitor error rates for 1 hour
- [ ] Check Vercel logs for errors
- [ ] Verify webhook deliveries

### Within 24 Hours
- [ ] Review Vercel Analytics
- [ ] Check Sentry for errors
- [ ] Monitor database performance
- [ ] Review Stripe webhook logs
- [ ] Check email delivery rates

### Within 1 Week
- [ ] Performance audit with Lighthouse
- [ ] Security audit
- [ ] User feedback collection
- [ ] Monitor conversion rates
- [ ] Review and optimize slow queries

## Rollback Plan

If critical issues found:

1. [ ] Identify the issue
2. [ ] Decide: Fix forward or rollback?
3. [ ] If rollback needed:
   - [ ] Go to Vercel Dashboard → Deployments
   - [ ] Find last working deployment
   - [ ] Click "Promote to Production"
4. [ ] If database migration issue:
   - [ ] Restore from backup or run down migration
5. [ ] Notify users (if significant downtime)
6. [ ] Create incident report
7. [ ] Plan fix and redeploy

## Continuous Monitoring

Daily:
- [ ] Check error rates in Sentry
- [ ] Review Vercel deployment logs
- [ ] Monitor database performance
- [ ] Check uptime status

Weekly:
- [ ] Review analytics trends
- [ ] Check for dependency updates
- [ ] Review security advisories
- [ ] Check SSL certificate expiry

Monthly:
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Database backup verification
- [ ] Cost optimization review
- [ ] Update dependencies

## Maintenance Windows

Schedule regular maintenance:
- [ ] Database maintenance: Monthly
- [ ] Dependency updates: Bi-weekly
- [ ] Security patches: As needed
- [ ] Performance optimization: Monthly

## Emergency Contacts

| Service | Contact | Documentation |
|---------|---------|---------------|
| Vercel Support | https://vercel.com/support | https://vercel.com/docs |
| Supabase Support | https://supabase.com/support | https://supabase.com/docs |
| Stripe Support | https://support.stripe.com | https://stripe.com/docs |
| Domain Registrar | [Your registrar] | [Registrar docs] |

## Quick Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Rollback
vercel promote [deployment-url] --prod

# Run health check
curl https://designdream.is/api/health

# Check SSL
curl -I https://designdream.is

# Test Stripe webhook
stripe listen --forward-to https://designdream.is/api/webhooks/stripe
```

## Success Metrics

Track these metrics post-deployment:

- **Uptime:** > 99.9%
- **Page Load Time:** < 3s
- **Error Rate:** < 0.1%
- **Conversion Rate:** Track baseline
- **API Response Time:** < 200ms (p95)
- **Database Query Time:** < 100ms (p95)

## Notes

- Deployment date: _______________
- Deployed by: _______________
- Deployment version/tag: _______________
- Any issues encountered: _______________
- Time to deploy: _______________
- Time to verify: _______________

---

**Last Updated:** 2025-01-03

**Run automated check:** `./scripts/deploy-check.sh`
