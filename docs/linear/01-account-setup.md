# Linear Account Setup

This guide walks you through setting up Linear for Design Dream client projects.

## Prerequisites

- A Linear account (free or paid)
- Admin access to create workspaces and projects
- Access to your Design Dream dashboard

## Step 1: Create Linear Workspace

If you don't already have a Linear workspace:

1. Go to [linear.app](https://linear.app)
2. Click "Get started" or "Sign up"
3. Choose authentication method (Google, GitHub, or Email)
4. Create your workspace:
   - **Workspace name**: Your company or client name
   - **Workspace URL**: `yourcompany.linear.app`

## Step 2: Generate API Key

Linear uses personal API keys for authentication (much simpler than OAuth):

1. Click your profile icon (bottom left)
2. Navigate to **Settings** → **API**
3. Click "Create new key"
4. Name it: "Design Dream Integration"
5. Copy the generated key (starts with `lin_api_`)
6. Store it securely in your Design Dream environment variables

```bash
# Add to .env.local
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Security**: Never commit API keys to git. Keep them in `.env.local` or environment variables.

## Step 3: Get Your Team ID

You'll need your team ID for API calls:

1. In Linear, click on your team name in the sidebar
2. Go to **Team Settings** → **General**
3. Copy your **Team ID** (UUID format)

Alternatively, you can find it in the URL when viewing team settings:
```
https://linear.app/yourworkspace/settings/teams/{TEAM_ID}
```

## Step 4: Configure Workspace Settings

### Enable API Access

1. Go to **Workspace Settings** → **API**
2. Ensure "API Access" is enabled
3. Review rate limits (default: 1000 requests/hour)

### Set Up Webhooks

1. Go to **Workspace Settings** → **Webhooks**
2. Click "New webhook"
3. Configure:
   - **URL**: `https://designdream.is/api/webhooks/linear`
   - **Events**: Select `Issue Created`, `Issue Updated`
   - **Secret**: Generate a strong secret for verification
4. Copy the webhook secret
5. Add to your environment variables:

```bash
LINEAR_WEBHOOK_SECRET=your_webhook_secret_here
```

## Step 5: Create Service Account (Optional)

For production use, consider creating a dedicated service account:

1. Invite a new team member: `linear-bot@designdream.is`
2. Set role to **Member** (can view/comment on issues)
3. Generate API key for this account
4. Use this API key in production instead of personal key

**Benefits**:
- Separates bot activity from your personal activity
- Comments show as "Design Dream Bot" instead of your name
- Easier to manage permissions
- Won't expire if you leave the organization

## Step 6: Configure Linear in Design Dream Dashboard

1. Log into your Design Dream dashboard
2. Navigate to **Settings** → **Integrations**
3. Click **Connect Linear**
4. Enter:
   - API Key
   - Team ID
   - Webhook Secret
5. Click **Save & Test Connection**

## Verification

Test the integration:

1. Create a test issue in Linear
2. Verify webhook triggers successfully
3. Check that Design Dream bot posts analysis comment
4. Review logs in Design Dream dashboard

## Common Issues

### Webhook Not Triggering

**Cause**: Incorrect webhook URL or firewall blocking requests

**Solution**:
- Verify webhook URL is publicly accessible
- Check webhook delivery logs in Linear settings
- Ensure your app is deployed and running

### API Key Invalid

**Cause**: Wrong key, expired key, or insufficient permissions

**Solution**:
- Generate a new API key
- Verify key starts with `lin_api_`
- Ensure account has necessary permissions

### Comments Not Posting

**Cause**: Bot account lacks comment permissions

**Solution**:
- Verify API key account is a member of the team
- Check team permissions allow comments
- Review Linear audit logs for permission errors

## Next Steps

Once your account is configured:

1. [Create a project template](./02-project-template.md)
2. [Test the integration](./03-testing-guide.md)
3. Invite your client to Linear

## Resources

- [Linear API Documentation](https://developers.linear.app/docs)
- [Linear Webhooks Guide](https://developers.linear.app/docs/graphql/webhooks)
- [Design Dream Support](https://designdream.is/support)
