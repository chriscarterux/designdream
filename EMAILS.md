# Email Notification System Documentation

## Overview

Comprehensive email notification system for DesignDream using Resend and React Email. Supports multiple email types with beautiful, responsive templates.

## Email Types

### 1. SLA Warning Emails

#### Yellow Warning (36 hours elapsed)
- **Trigger**: Request reaches 36 hours (12 hours remaining)
- **Recipients**: Admin + assigned team member
- **Content**: Request details, time remaining, recommended actions
- **Type**: `sla_warning_yellow`

#### Red Warning (42 hours elapsed)
- **Trigger**: Request reaches 42 hours (6 hours remaining)
- **Recipients**: Admin + assigned team member
- **Content**: Critical alert, request details, urgent actions required
- **Type**: `sla_warning_red`

### 2. SLA Violation Email
- **Trigger**: Request exceeds 48-hour SLA
- **Recipients**: Admin only (internal alert)
- **Content**: Violation details, hours overdue, required actions
- **Type**: `sla_violation`

### 3. New Request Submitted
- **Trigger**: Client submits new request
- **Recipients**: All active admins
- **Content**: Request details, priority, client info, queue link
- **Type**: `new_request`

### 4. Request Status Changed
- **Trigger**: Status changes (submitted → in_progress → review → done)
- **Recipients**: Client (requester)
- **Content**: Status update, next steps, estimated completion
- **Type**: `status_changed`

### 5. Comment Added
- **Trigger**: New comment on request
- **Recipients**: Client (if admin commented) or assigned admin (if client commented)
- **Content**: Comment preview, author, link to request
- **Type**: `comment_added`

### 6. Welcome Email
- **Trigger**: New subscription created via Stripe
- **Recipients**: New client
- **Content**: Welcome message, getting started guide, resources
- **Type**: `welcome`

## Setup

### 1. Install Dependencies

```bash
npm install @react-email/components @react-email/render resend
npm install -D react-email
```

### 2. Environment Variables

Add to `.env.local`:

```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=DesignDream <notifications@designdream.is>
RESEND_ADMIN_EMAIL=admin@designdream.is
RESEND_REPLY_TO_EMAIL=support@designdream.is

# Email Test Mode (sends all emails to admin)
EMAIL_TEST_MODE=false

# Internal Webhook Secret (for triggering notifications)
INTERNAL_WEBHOOK_SECRET=your-secure-random-secret
```

### 3. Database Migration

Run the email notifications migration:

```bash
supabase migration up
```

This creates:
- `email_preferences` table for user opt-in/opt-out
- `email_delivery_log` table for tracking sent emails
- Views for email analytics

## File Structure

```
src/
├── lib/
│   └── email/
│       ├── resend.ts          # Resend client setup
│       ├── templates.tsx      # Template rendering functions
│       └── send.ts            # Email sending logic
├── emails/                    # React Email templates
│   ├── sla-warning.tsx
│   ├── sla-violation.tsx
│   ├── new-request.tsx
│   ├── status-changed.tsx
│   ├── comment-added.tsx
│   └── welcome.tsx
├── app/
│   └── api/
│       └── notifications/
│           ├── route.ts       # Webhook handler
│           └── test/route.ts  # Test endpoint
└── types/
    └── email.types.ts         # TypeScript types
```

## Usage

### Sending Emails Programmatically

```typescript
import { sendEmail } from '@/lib/email/send';
import type { EmailData } from '@/types/email.types';

// Example: Send welcome email
const emailData: EmailData = {
  type: 'welcome',
  recipient: {
    email: 'client@example.com',
    name: 'John Doe',
    userId: 'user-uuid',
  },
  client: {
    companyName: 'Acme Corp',
    contactName: 'John Doe',
  },
  subscription: {
    planType: 'premium',
  },
  dashboardUrl: 'https://app.designdream.is/dashboard',
  resourcesUrl: 'https://app.designdream.is/resources',
};

const result = await sendEmail(emailData);
if (result.success) {
  console.log('Email sent:', result.id);
} else {
  console.error('Email failed:', result.error);
}
```

### Using Webhook Handler

Send POST request to `/api/notifications`:

```bash
curl -X POST https://app.designdream.is/api/notifications \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret" \
  -d '{
    "type": "new_request",
    "data": {
      "requestId": "123e4567-e89b-12d3-a456-426614174000"
    }
  }'
```

Supported webhook types:
- `new_request` - Send new request notification
- `status_changed` - Send status update notification
- `comment_added` - Send comment notification
- `welcome` - Send welcome email

### SLA Warning Helper

The system includes a helper function for SLA warnings:

```typescript
import { sendSLAWarningEmail } from '@/lib/email/send';

// Send yellow warning (12 hours remaining)
await sendSLAWarningEmail(requestId, 'yellow');

// Send red warning (6 hours remaining)
await sendSLAWarningEmail(requestId, 'red');
```

## Testing Emails

### 1. Preview Templates Locally

Start the React Email development server:

```bash
npm run email:dev
```

Open http://localhost:3001 to preview all email templates.

### 2. Preview via API

View rendered HTML in browser:

```
GET /api/notifications/test?type=welcome
GET /api/notifications/test?type=sla_warning_yellow
GET /api/notifications/test?type=new_request
```

### 3. Send Test Email

```bash
curl -X POST https://app.designdream.is/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "recipient": "your-email@example.com"
  }'
```

Available test types:
- `sla_warning_yellow`
- `sla_warning_red`
- `sla_violation`
- `new_request`
- `status_changed`
- `comment_added`
- `welcome`

## Email Preferences

Users can manage their email preferences via the `email_preferences` table.

### Default Preferences

All users have these preferences by default:
- `email_enabled`: true (global toggle)
- `sla_warnings`: true
- `status_updates`: true
- `comments`: true
- `marketing`: false

### Checking Preferences

The system automatically checks preferences before sending emails:

```typescript
import { checkEmailPreferences } from '@/lib/email/send';

const canSend = await checkEmailPreferences(userId, 'status_changed');
if (canSend) {
  // Send email
}
```

### Updating Preferences

```typescript
await supabase
  .from('email_preferences')
  .update({
    status_updates: false,
    comments: false,
  })
  .eq('user_id', userId);
```

## Rate Limiting

Built-in rate limiting prevents spam:
- **Limit**: 100 emails per minute per recipient
- **Enforcement**: Automatic, tracked in memory
- **Response**: Returns error if rate limit exceeded

## Email Delivery Tracking

All email deliveries are logged in the `email_delivery_log` table:

```typescript
{
  id: uuid,
  email: string,
  email_type: string,
  status: 'pending' | 'sent' | 'failed' | 'bounced',
  resend_id: string,        // Resend's email ID
  error: string,            // Error message if failed
  sent_at: timestamp,
  created_at: timestamp,
  metadata: {
    subject: string,
    recipient_name: string,
    retry_count: number
  }
}
```

### View Delivery Stats

```sql
SELECT * FROM email_delivery_stats;
```

Returns aggregated statistics by email type:
- Total sent
- Success rate
- Failed count
- Bounced count
- First/last sent dates

## Error Handling & Retry Logic

### Automatic Retries

Failed emails are automatically retried up to 3 times with exponential backoff:
- Attempt 1: Immediate
- Attempt 2: 2 seconds delay
- Attempt 3: 4 seconds delay
- Attempt 4: 8 seconds delay

### Error Logging

All errors are:
1. Logged to console with full error details
2. Stored in `email_delivery_log` table
3. Returned in API response

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `RESEND_API_KEY is not set` | Missing env variable | Add `RESEND_API_KEY` to `.env.local` |
| `Rate limit exceeded` | Too many emails to same recipient | Wait 1 minute before retry |
| `User has opted out` | User disabled notifications | Respect user preference |
| `Request not found` | Invalid request ID | Verify request exists in database |

## Integration Points

### 1. SLA Tracking System

Integrate with the SLA cron job from `p0-sla-tracking`:

```typescript
// In your SLA check function
import { sendSLAWarningEmail } from '@/lib/email/send';

// Check SLA and send warnings
if (hoursRemaining <= 12 && hoursRemaining > 6) {
  await sendSLAWarningEmail(requestId, 'yellow');
} else if (hoursRemaining <= 6) {
  await sendSLAWarningEmail(requestId, 'red');
}
```

### 2. Request Form

When a new request is submitted:

```typescript
// After creating request
await fetch('/api/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-webhook-secret': process.env.INTERNAL_WEBHOOK_SECRET!,
  },
  body: JSON.stringify({
    type: 'new_request',
    data: { requestId: newRequest.id },
  }),
});
```

### 3. Stripe Webhooks

In your Stripe webhook handler:

```typescript
// When subscription is created
if (event.type === 'customer.subscription.created') {
  await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': process.env.INTERNAL_WEBHOOK_SECRET!,
    },
    body: JSON.stringify({
      type: 'welcome',
      data: { clientId: client.id },
    }),
  });
}
```

### 4. Database Triggers

You can also trigger emails using Supabase database triggers:

```sql
-- Example: Trigger email on status change
CREATE TRIGGER send_status_change_email
  AFTER UPDATE OF status ON requests
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_status_change();
```

## Production Deployment

### 1. Verify Resend Domain

1. Go to https://resend.com/domains
2. Add your domain (e.g., `designdream.is`)
3. Add DNS records:
   - SPF record
   - DKIM record
   - DMARC record
4. Verify domain

### 2. Update Environment Variables

In Vercel/production:
```env
RESEND_API_KEY=re_live_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=DesignDream <notifications@designdream.is>
EMAIL_TEST_MODE=false
```

### 3. Test in Production

Send a test email to verify everything works:

```bash
curl -X POST https://app.designdream.is/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "recipient": "your-email@example.com"
  }'
```

### 4. Monitor Delivery

Check Resend dashboard:
- https://resend.com/emails
- View delivery rates
- Monitor bounces
- Check spam reports

## Best Practices

### 1. Template Design
- Keep templates under 102KB
- Use inline styles (React Email handles this)
- Test in multiple email clients
- Include plain text alternative
- Add alt text for images

### 2. Sending Logic
- Always check user preferences first
- Use batch sending for multiple recipients
- Respect rate limits
- Log all deliveries
- Handle errors gracefully

### 3. Content
- Personalize with recipient name
- Clear call-to-action buttons
- Mobile-responsive design
- Include unsubscribe link
- Keep subject lines under 50 characters

### 4. Testing
- Test all email types before deployment
- Verify links work correctly
- Check on mobile devices
- Test with real data
- Preview in multiple email clients

## Monitoring & Analytics

### Email Performance Query

```sql
-- Email delivery performance (last 30 days)
SELECT
  email_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  ROUND(AVG(EXTRACT(EPOCH FROM (sent_at - created_at))), 2) as avg_send_time_seconds
FROM email_delivery_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY email_type
ORDER BY total DESC;
```

### Recent Failures

```sql
-- Recent failed emails
SELECT
  email,
  email_type,
  error,
  created_at,
  metadata
FROM email_delivery_log
WHERE status = 'failed'
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 20;
```

## Troubleshooting

### Emails Not Sending

1. Check Resend API key is correct
2. Verify domain is verified in Resend
3. Check webhook secret matches
4. Review email_delivery_log for errors
5. Check user hasn't opted out

### Templates Not Rendering

1. Verify React Email components installed
2. Check template imports are correct
3. Review console for TypeScript errors
4. Test with `/api/notifications/test` endpoint

### Rate Limiting Issues

1. Review rate limiter settings in `send.ts`
2. Check if same email being sent too frequently
3. Implement queue system for high volume

## Support

For issues or questions:
- Review Resend docs: https://resend.com/docs
- Review React Email docs: https://react.email
- Check email_delivery_log for error details
- Test with `/api/notifications/test` endpoint
