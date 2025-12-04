# Client Onboarding Automation - Setup Guide

This guide walks through setting up all the integrations required for automated client onboarding.

## Prerequisites

- Design Dream app deployed to production
- Stripe account with subscriptions configured
- Linear workspace with API access
- Figma Professional or Organization plan (for API access)
- GitHub account with organization
- Resend account for email

## Step 1: Linear API Setup

### 1.1 Get API Key

Already configured from Linear migration. Verify:

```bash
# Check environment
echo $LINEAR_API_KEY  # Should start with lin_api_
echo $LINEAR_TEAM_ID  # Should be UUID format
```

### 1.2 Create Custom Workflow States

Create the 3-column workflow for client projects:

```graphql
mutation {
  # Create "Backlog" state
  workflowStateCreate(input: {
    name: "Backlog"
    color: "#BFDBFE"
    type: backlog
    teamId: "YOUR_TEAM_ID"
  }) {
    success
    workflowState { id }
  }

  # Create "Current Request" state
  workflowStateCreate(input: {
    name: "Current Request"
    color: "#FCD34D"
    type: started
    teamId: "YOUR_TEAM_ID"
  }) {
    success
    workflowState { id }
  }

  # Create "Approved" state
  workflowStateCreate(input: {
    name: "Approved"
    color: "#86EFAC"
    type: completed
    teamId: "YOUR_TEAM_ID"
  }) {
    success
    workflowState { id }
  }
}
```

Save the workflow state IDs for later:

```bash
# Add to environment
LINEAR_BACKLOG_STATE_ID=...
LINEAR_CURRENT_REQUEST_STATE_ID=...
LINEAR_APPROVED_STATE_ID=...
```

## Step 2: Figma API Setup

### 2.1 Generate Access Token

1. Go to [figma.com/developers](https://www.figma.com/developers)
2. Click "Get personal access token"
3. Name: "Design Dream Automation"
4. Copy token (starts with `figd_`)

```bash
# Add to environment
FIGMA_ACCESS_TOKEN=figd_...
```

### 2.2 Create Template File

1. In Figma, create a new file: "Design Dream Client Template"
2. Add starter pages:
   - Brand Kit (colors, fonts, logo)
   - Design Requests
   - Completed Work
3. Copy file key from URL:
   ```
   https://figma.com/file/{FILE_KEY}/...
                          ^^^^^^^^^
   ```

```bash
# Add to environment
FIGMA_TEMPLATE_FILE_KEY=...
```

### 2.3 Get Team ID

```bash
# Test Figma API to get team ID
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  https://api.figma.com/v1/me

# Response includes teams array with IDs
```

```bash
FIGMA_TEAM_ID=...
```

### 2.4 Test Figma API

```bash
# Test: duplicate template file
curl -X POST \
  -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  https://api.figma.com/v1/files/$FIGMA_TEMPLATE_FILE_KEY/copy \
  -d '{
    "name": "Test Client - Design Board",
    "team_id": "'$FIGMA_TEAM_ID'"
  }'

# Should return new file key
```

## Step 3: GitHub API Setup

### 3.1 Generate Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name: "Design Dream Repo Automation"
4. Scopes:
   - ✅ `repo` (all)
   - ✅ `admin:org` → `write:org`
   - ✅ `user` → `read:user`
5. Generate and copy token

```bash
GITHUB_TOKEN=ghp_...
```

### 3.2 Verify Organization Access

```bash
# Test: list repos
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/orgs/chriscarterux/repos

# Should return list of repos
```

```bash
GITHUB_ORG=chriscarterux
```

### 3.3 Create Repository Template

Option 1: Use GitHub template repository
1. Create repo: `designdream-client-template`
2. Mark as template in settings
3. Add initial README, .gitignore, etc.

Option 2: Clone from template programmatically (recommended for customization)

```bash
GITHUB_TEMPLATE_REPO=designdream-client-template
```

## Step 4: Stripe Integration

### 4.1 Webhook Configuration

Already configured, but add new event:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Select your webhook endpoint
3. Add event:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`

### 4.2 Customer Portal Configuration

1. Stripe Dashboard → Settings → Customer portal
2. Configure:
   - Allow customers to update payment methods: ✅
   - Allow customers to cancel subscriptions: ✅
   - Allow customers to switch plans: ✅ (if multiple tiers)
3. Copy portal configuration ID (for generating links)

The portal link is generated per-customer:
```
https://billing.stripe.com/p/session/{SESSION_ID}
```

Generate via API:
```bash
curl https://api.stripe.com/v1/billing_portal/sessions \
  -u $STRIPE_SECRET_KEY: \
  -d customer={CUSTOMER_ID} \
  -d return_url=https://designdream.is/dashboard
```

## Step 5: Email Templates (Resend)

### 5.1 Verify Domain

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add: `designdream.is`
3. Add DNS records (SPF, DKIM, DMARC)
4. Wait for verification (usually < 30 minutes)

### 5.2 Create Welcome Email Template

Create in `src/emails/welcome-email.tsx`:

```tsx
import * as React from 'react';

interface WelcomeEmailProps {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  linearProjectUrl: string;
  figmaFileUrl: string;
  repoUrl: string;
  stripePortalUrl: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  companyName,
  firstName,
  linearProjectUrl,
  figmaFileUrl,
  repoUrl,
  stripePortalUrl,
}) => (
  <html>
    <body>
      <h1>Welcome to Design Dream, {firstName}!</h1>

      <p>Your design board for {companyName} is ready.</p>

      <h2>Quick Links</h2>
      <ul>
        <li><a href={linearProjectUrl}>Your Linear Project</a></li>
        <li><a href={figmaFileUrl}>Your Figma File</a></li>
        <li><a href={repoUrl}>Your Design Repository</a></li>
        <li><a href={stripePortalUrl}>Manage Subscription</a></li>
      </ul>

      <h2>Getting Started</h2>
      <ol>
        <li>Click your Linear project link above</li>
        <li>Create your first design request</li>
        <li>Drag it to "Current Request" when ready</li>
        <li>We'll start working within 24 hours</li>
      </ol>

      <p>Questions? Reply to this email anytime.</p>
    </body>
  </html>
);
```

## Step 6: Environment Variables

Add all variables to production:

```bash
# Linear
LINEAR_API_KEY=lin_api_...
LINEAR_TEAM_ID=...
LINEAR_BACKLOG_STATE_ID=...
LINEAR_CURRENT_REQUEST_STATE_ID=...
LINEAR_APPROVED_STATE_ID=...

# Figma
FIGMA_ACCESS_TOKEN=figd_...
FIGMA_TEMPLATE_FILE_KEY=...
FIGMA_TEAM_ID=...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_ORG=chriscarterux
GITHUB_TEMPLATE_REPO=designdream-client-template

# Stripe (already configured)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (already configured)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=DesignDream <christophercarter@hey.com>
```

### Add to Vercel

```bash
# Using Vercel CLI
vercel env add FIGMA_ACCESS_TOKEN production
vercel env add FIGMA_TEMPLATE_FILE_KEY production
vercel env add FIGMA_TEAM_ID production
vercel env add GITHUB_TOKEN production
vercel env add LINEAR_BACKLOG_STATE_ID production
vercel env add LINEAR_CURRENT_REQUEST_STATE_ID production
vercel env add LINEAR_APPROVED_STATE_ID production

# Or use Vercel dashboard
# https://vercel.com/chriscarterux/designdream/settings/environment-variables
```

## Step 7: Deploy Onboarding Code

The onboarding automation code will be in:
- `/api/webhooks/stripe` - Enhanced to trigger onboarding
- `/lib/onboarding/` - All onboarding automation logic

Deploy:
```bash
git push origin main
# Vercel auto-deploys
```

## Step 8: Testing

### 8.1 Test in Stripe Test Mode

1. Use test Stripe keys
2. Create test subscription via Stripe Checkout
3. Verify:
   - Linear project created
   - Figma file duplicated
   - GitHub repo created
   - Welcome email sent

### 8.2 Monitor Logs

```bash
# Watch Vercel logs
vercel logs --follow

# Check for:
# "✅ Linear project created: PROJECT_ID"
# "✅ Figma file duplicated: FILE_KEY"
# "✅ GitHub repo created: REPO_NAME"
# "✅ Welcome email sent to: EMAIL"
```

### 8.3 Verify Each Component

**Linear Project:**
```bash
# Check project exists
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ projects(first: 10) { nodes { id name description } } }"}'
```

**Figma File:**
- Visit Figma team files
- Verify new file with customer name exists

**GitHub Repo:**
```bash
# List repos
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/orgs/$GITHUB_ORG/repos
```

**Email:**
- Check Resend dashboard for delivery
- Verify email received in customer inbox

## Step 9: Production Rollout

### Phase 1: Shadow Mode (Week 1)
- Deploy code but don't send emails yet
- Monitor all automations
- Verify data quality

### Phase 2: Beta (Week 2)
- Enable for test customers only
- Send welcome emails
- Collect feedback

### Phase 3: Full Production (Week 3+)
- Enable for all new subscriptions
- Monitor success rate
- Iterate based on feedback

## Troubleshooting

### Linear Project Not Created

**Check:**
- LINEAR_API_KEY is valid
- LINEAR_TEAM_ID is correct
- Workflow state IDs are valid

**Debug:**
```bash
# Test Linear API directly
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ viewer { id name } }"}'
```

### Figma File Not Duplicated

**Check:**
- FIGMA_ACCESS_TOKEN has correct permissions
- FIGMA_TEMPLATE_FILE_KEY is correct
- FIGMA_TEAM_ID is valid

**Debug:**
```bash
# Test Figma API
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  https://api.figma.com/v1/files/$FIGMA_TEMPLATE_FILE_KEY
```

### GitHub Repo Not Created

**Check:**
- GITHUB_TOKEN has `repo` and `admin:org` scopes
- GITHUB_ORG is correct organization name

**Debug:**
```bash
# Test GitHub API
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Should return your user info
```

### Email Not Sent

**Check:**
- RESEND_API_KEY is valid
- Domain is verified in Resend
- From email matches verified domain

**Debug:**
```bash
# Check Resend dashboard
# https://resend.com/emails
# View delivery logs and errors
```

## Monitoring & Alerts

Set up alerts for:
- Onboarding automation failures (alert if >1% fail)
- Long onboarding times (alert if >5 minutes)
- Missing components (alert if any step skipped)
- Email delivery failures (alert if bounce rate >2%)

Use Vercel monitoring or external service like Sentry.

## Success Criteria

Consider setup complete when:
- [x] All API keys configured and tested
- [x] Workflow states created in Linear
- [x] Figma template file created
- [x] GitHub template repo created
- [x] Email template designed
- [x] All environment variables set
- [x] Code deployed to production
- [x] End-to-end test successful
- [x] Monitoring and alerts configured
- [x] Documentation complete

## Next Steps

After setup complete:
1. [Customize Linear template](./02-linear-template.md)
2. [Configure Figma automation](./03-figma-automation.md)
3. [Set up repository automation](./04-repo-automation.md)
4. [Design email templates](./05-email-templates.md)
5. [Run comprehensive tests](./06-testing-guide.md)
