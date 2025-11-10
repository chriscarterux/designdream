# Linear API Setup Guide

This guide explains how to authenticate with the Linear API and configure your Design Dream integration.

## Authentication Overview

Unlike Basecamp which requires OAuth 2.0, Linear uses a simpler **Personal API Key** authentication method. This makes setup much faster and easier to maintain.

## API Key vs OAuth

**Linear Advantages**:
- ✅ Simpler setup (no OAuth flow needed)
- ✅ One-step authentication
- ✅ No token expiration
- ✅ No callback URLs needed
- ✅ Instant revocation if compromised

**Trade-offs**:
- ⚠️ API key represents your user account
- ⚠️ Cannot scope permissions (all or nothing)
- ⚠️ No refresh tokens (but keys don't expire)

## Generating Your API Key

### Step 1: Access Settings

1. Log into [linear.app](https://linear.app)
2. Click your profile picture (bottom left)
3. Select **Settings** from the menu

### Step 2: Navigate to API Section

1. In settings sidebar, click **API**
2. Scroll to **Personal API keys** section

### Step 3: Create New Key

1. Click **Create new key** button
2. Enter key details:
   - **Label**: `Design Dream Integration` (helps identify usage)
   - **Description**: Optional notes about what this key is for
3. Click **Create key**

### Step 4: Copy & Store Key

```bash
# Your key will look like this:
lin_api_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z
```

⚠️ **CRITICAL**: Copy the key immediately! You won't be able to see it again.

### Step 5: Add to Environment Variables

Add to your `.env.local` file:

```bash
# Linear API Authentication
LINEAR_API_KEY=lin_api_your_actual_key_here

# Your Linear Team ID (found in team settings)
LINEAR_TEAM_ID=c3997b49-d6a3-45a3-93ab-605db58b7434

# Webhook verification secret (set when creating webhook)
LINEAR_WEBHOOK_SECRET=your_webhook_secret_here

# Claude API for task analysis
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

## Finding Your Team ID

You'll need your team ID for API calls:

### Method 1: Team Settings UI

1. Click on team name in Linear sidebar
2. Go to **Team Settings** → **General**
3. Copy the **Team ID** (UUID format)

### Method 2: URL Inspection

Your team ID is in the URL when viewing team settings:
```
https://linear.app/yourworkspace/settings/teams/{TEAM_ID}
                                                 ^^^^^^^^^
```

### Method 3: GraphQL Query

```graphql
query {
  teams {
    nodes {
      id
      name
      key
    }
  }
}
```

## Setting Up Webhooks

Webhooks notify your app when issues are created or updated.

### Step 1: Navigate to Webhooks

1. Go to **Workspace Settings** (not team settings)
2. Click **Webhooks** in sidebar
3. Click **New webhook**

### Step 2: Configure Webhook

```
URL: https://designdream.is/api/webhooks/linear
Label: Design Dream Task Analysis
Enabled: ✓

Resources to watch:
  ✓ Issue
  ✓ Comment (optional)

Events to watch:
  ✓ created
  ✓ updated (optional)
  ✓ removed (optional)
```

### Step 3: Generate Signing Secret

1. Click **Generate new secret**
2. Copy the secret
3. Add to your environment variables:

```bash
LINEAR_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 4: Test Webhook

1. Click **Send test event**
2. Check your app logs for webhook receipt
3. Verify signature validation works

## API Rate Limits

Linear has generous rate limits:

| Limit Type | Value |
|------------|-------|
| Requests per hour | 1,000 |
| Burst capacity | 100 |
| Webhook retries | 3 attempts |

**Best Practices**:
- Cache responses when possible
- Use GraphQL to fetch only needed fields
- Implement exponential backoff on errors
- Monitor rate limit headers

## Making API Calls

### Using GraphQL API

Linear uses GraphQL for all API operations:

```typescript
import { LinearClient } from '@linear/sdk';

const linear = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY
});

// Fetch issue by ID
const issue = await linear.issue('ISSUE_ID');

// Create comment
await linear.createComment({
  issueId: issue.id,
  body: 'Your comment here'
});

// Update issue
await linear.updateIssue('ISSUE_ID', {
  stateId: 'new_state_id',
  priority: 1
});
```

### Using Raw GraphQL

```typescript
async function callLinearAPI(query: string, variables?: any) {
  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.LINEAR_API_KEY
    },
    body: JSON.stringify({ query, variables })
  });

  return response.json();
}

// Example: Fetch issue
const query = `
  query GetIssue($id: String!) {
    issue(id: $id) {
      id
      title
      description
      state {
        name
      }
      assignee {
        name
      }
    }
  }
`;

const result = await callLinearAPI(query, { id: 'ISSUE_ID' });
```

## Verifying Webhook Signatures

Always verify webhook signatures to prevent spoofing:

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const computedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

// In your webhook handler
export async function POST(request: Request) {
  const signature = request.headers.get('linear-signature');
  const payload = await request.text();

  if (!verifyWebhookSignature(
    payload,
    signature,
    process.env.LINEAR_WEBHOOK_SECRET
  )) {
    return new Response('Invalid signature', { status: 401 });
  }

  // Process webhook...
}
```

## Using Linear MCP Server

Design Dream also supports the Linear MCP server for easier integration:

### Setup MCP Connection

The Linear MCP server is already available in this Claude Code session. It provides functions like:

- `mcp__linear-server__list_issues` - List issues with filters
- `mcp__linear-server__get_issue` - Get issue details
- `mcp__linear-server__create_issue` - Create new issues
- `mcp__linear-server__update_issue` - Update existing issues
- `mcp__linear-server__create_comment` - Add comments

### Example Usage

```typescript
// These functions are available through the MCP interface
// and handle authentication automatically

// Create issue
const issue = await mcp__linear__create_issue({
  team: 'TEAM_ID',
  title: 'New task',
  description: 'Task description',
  priority: 2,
  state: 'Todo'
});

// Add comment
await mcp__linear__create_comment({
  issueId: issue.id,
  body: 'AI Analysis: This is a SIMPLE task...'
});
```

## Security Best Practices

### API Key Storage

**❌ NEVER**:
- Commit API keys to git
- Share keys in Slack or email
- Use same key across environments
- Hardcode keys in source code
- Log full API keys

**✅ ALWAYS**:
- Store in environment variables
- Use different keys for dev/staging/prod
- Rotate keys periodically (every 90 days)
- Use key management services (AWS Secrets Manager, etc.)
- Log only last 4 characters: `lin_api_...x5y6z`

### Key Rotation

When rotating keys:

1. Generate new key in Linear
2. Add to environment (keep old key active)
3. Deploy app with new key
4. Verify new key works
5. Revoke old key in Linear
6. Remove old key from environment

### Webhook Security

- Always verify signatures
- Use HTTPS endpoints only
- Implement request timeouts
- Log suspicious activity
- Rate limit webhook endpoint

## Troubleshooting

### "Invalid API Key" Error

**Causes**:
- Key not set in environment
- Typo in key
- Key has been revoked
- Using wrong environment's key

**Solution**:
```typescript
// Verify key is set
console.log('API key present:', !!process.env.LINEAR_API_KEY);
console.log('Key starts with:', process.env.LINEAR_API_KEY?.substring(0, 10));

// Test key directly
const response = await fetch('https://api.linear.app/graphql', {
  method: 'POST',
  headers: {
    'Authorization': process.env.LINEAR_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: '{ viewer { id name } }'
  })
});

console.log('Test response:', await response.json());
```

### "Rate Limit Exceeded" Error

**Causes**:
- Making >1000 requests/hour
- Not respecting rate limit headers
- Infinite loop of API calls

**Solution**:
```typescript
// Check rate limit headers
const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
const rateLimitReset = response.headers.get('X-RateLimit-Reset');

if (parseInt(rateLimitRemaining) < 10) {
  console.warn('Approaching rate limit!');
  // Implement backoff or queue
}
```

### Webhook Not Received

**Causes**:
- Webhook URL not publicly accessible
- SSL certificate invalid
- Firewall blocking Linear's IPs
- Webhook disabled in Linear

**Solution**:
```bash
# Test endpoint is reachable
curl -X POST https://designdream.is/api/webhooks/linear \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check webhook status in Linear
# Settings → Webhooks → View webhook
# Check "Recent deliveries" for errors
```

### "Team Not Found" Error

**Causes**:
- Wrong team ID
- Account not member of team
- Team has been archived

**Solution**:
```typescript
// List all teams you have access to
const query = `
  query {
    teams {
      nodes {
        id
        name
        key
      }
    }
  }
`;

const result = await callLinearAPI(query);
console.log('Available teams:', result.data.teams.nodes);
```

## Environment Configuration

Complete example for all environments:

### Development (.env.local)

```bash
# Linear API
LINEAR_API_KEY=lin_api_dev_key_here
LINEAR_TEAM_ID=dev_team_id_here
LINEAR_WEBHOOK_SECRET=dev_webhook_secret_here

# Claude API
ANTHROPIC_API_KEY=sk-ant-dev_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Staging (.env.staging)

```bash
# Linear API
LINEAR_API_KEY=lin_api_staging_key_here
LINEAR_TEAM_ID=staging_team_id_here
LINEAR_WEBHOOK_SECRET=staging_webhook_secret_here

# Claude API
ANTHROPIC_API_KEY=sk-ant-staging_key_here

# App URL
NEXT_PUBLIC_APP_URL=https://staging.designdream.is
```

### Production

Store in Vercel/hosting platform environment variables:

```bash
LINEAR_API_KEY=lin_api_prod_key_here
LINEAR_TEAM_ID=prod_team_id_here
LINEAR_WEBHOOK_SECRET=prod_webhook_secret_here
ANTHROPIC_API_KEY=sk-ant-prod_key_here
NEXT_PUBLIC_APP_URL=https://designdream.is
```

## Testing Your Configuration

Run this test script to verify everything is configured:

```typescript
// scripts/test-linear-config.ts
async function testLinearConfig() {
  const checks = {
    apiKey: !!process.env.LINEAR_API_KEY,
    teamId: !!process.env.LINEAR_TEAM_ID,
    webhookSecret: !!process.env.LINEAR_WEBHOOK_SECRET,
    claudeKey: !!process.env.ANTHROPIC_API_KEY
  };

  console.log('Configuration checks:', checks);

  if (!checks.apiKey) {
    throw new Error('LINEAR_API_KEY not set');
  }

  // Test API connection
  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Authorization': process.env.LINEAR_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: '{ viewer { id name email } }'
    })
  });

  const data = await response.json();

  if (data.errors) {
    console.error('API Error:', data.errors);
    throw new Error('Linear API connection failed');
  }

  console.log('✅ Connected as:', data.data.viewer.name);
  console.log('✅ All configuration checks passed!');
}

testLinearConfig().catch(console.error);
```

## Next Steps

With API setup complete:

1. ✅ API key configured
2. ✅ Webhooks enabled
3. 📝 [Test your integration](./03-testing-guide.md)
4. 🚀 Deploy to production
5. 📊 Monitor API usage

## Resources

- [Linear API Documentation](https://developers.linear.app/docs)
- [Linear SDK (TypeScript)](https://github.com/linear/linear/tree/master/packages/sdk)
- [GraphQL API Reference](https://studio.apollographql.com/public/Linear-API/home)
- [Webhook Guide](https://developers.linear.app/docs/graphql/webhooks)
- [Rate Limits](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#rate-limiting)
