# Monitoring & Error Tracking Setup

This document explains how to use the monitoring and error tracking system in Design Dreams.

## Overview

We use multiple monitoring tools to ensure application health and performance:

- **Sentry** - Error tracking and performance monitoring
- **Vercel Analytics** - Page views and user analytics
- **Vercel Speed Insights** - Core Web Vitals tracking
- **Plausible Analytics** - Privacy-friendly analytics

## Sentry Setup

### 1. Create a Sentry Account

1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new project and select "Next.js"
3. Copy your DSN (Data Source Name)

### 2. Configure Environment Variables

Add these to your `.env.local` (development) and `.env.production` (production):

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

### 3. Create Auth Token

1. Go to Sentry → Settings → Auth Tokens
2. Create a token with `project:releases` and `org:read` permissions
3. Add it to `SENTRY_AUTH_TOKEN`

### 4. Test Error Tracking

Use the error utilities in your code:

```typescript
import { captureError, ErrorSeverity } from '@/lib/error-alerts';

try {
  // Your code
} catch (error) {
  captureError(error as Error, {
    severity: ErrorSeverity.High,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    tags: {
      component: 'payment-processor',
      feature: 'stripe-checkout',
    },
    extra: {
      orderId: order.id,
      amount: order.amount,
    },
  });
}
```

## Error Severity Levels

- **Low** - Informational, no action needed
- **Medium** - Warning, should be reviewed
- **High** - Error requiring attention
- **Critical** - Fatal error, immediate action required (triggers email alert)

## Email Alerts for Critical Errors

Critical errors automatically send email alerts to `RESEND_ADMIN_EMAIL`.

To trigger an email alert:

```typescript
import { captureError, ErrorSeverity } from '@/lib/error-alerts';

captureError(error, {
  severity: ErrorSeverity.Critical,
  // ... other context
});
```

## Vercel Analytics

Vercel Analytics is automatically enabled in production. No additional configuration needed.

View analytics at: `https://vercel.com/your-team/designdream/analytics`

## Monitoring in Development

By default, Sentry does not send errors from development environments. To enable:

```typescript
// sentry.client.config.ts
beforeSend(event, hint) {
  // Comment out this block to enable in development
  // if (process.env.NODE_ENV === 'development') {
  //   return null;
  // }
  return event;
}
```

## Best Practices

### 1. Always Include Context

```typescript
captureError(error, {
  severity: ErrorSeverity.High,
  user: currentUser,
  tags: {
    feature: 'user-registration',
    step: 'email-verification',
  },
  extra: {
    attemptCount: 3,
    lastAttempt: new Date().toISOString(),
  },
});
```

### 2. Use Appropriate Severity Levels

- Don't mark everything as Critical
- Reserve Critical for errors that require immediate attention
- Use Medium for expected errors that are handled gracefully

### 3. Filter Sensitive Data

Sentry configuration automatically:
- Hides source maps from client bundles
- Tree-shakes logger statements in production
- Routes requests through Next.js to avoid ad-blockers

### 4. Monitor Performance

Sentry automatically tracks:
- Page load times
- API response times
- Database query performance
- React component render times

## Troubleshooting

### Errors Not Appearing in Sentry

1. Check that `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify you're not in development mode (unless configured to send)
3. Check browser console for Sentry initialization errors
4. Verify your Sentry project is active

### Email Alerts Not Sending

1. Verify `RESEND_API_KEY` is set
2. Check `RESEND_ADMIN_EMAIL` is configured
3. Ensure error severity is set to `ErrorSeverity.Critical`
4. Check Resend dashboard for failed sends

### Source Maps Not Uploading

1. Verify `SENTRY_AUTH_TOKEN` has correct permissions
2. Check that `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry setup
3. Review build logs for Sentry webpack plugin errors

## Monitoring Dashboard URLs

- **Sentry**: https://sentry.io/organizations/[your-org]/issues/
- **Vercel Analytics**: https://vercel.com/[your-team]/designdream/analytics
- **Vercel Speed Insights**: https://vercel.com/[your-team]/designdream/speed-insights
- **Plausible**: https://plausible.io/designdream.is

## Support

For monitoring issues, check:
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- Internal: `src/lib/error-alerts.ts` for implementation details
