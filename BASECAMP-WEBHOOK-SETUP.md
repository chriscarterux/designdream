# Basecamp Webhook Setup Guide

This guide walks through setting up the Basecamp webhook receiver for automated task complexity analysis using Claude AI.

## Overview

When a client creates a new to-do in Basecamp, this webhook:
1. Receives the webhook event from Basecamp
2. Fetches full todo details (title, description)
3. Analyzes complexity using Claude API (SIMPLE vs COMPLEX)
4. Posts analysis back to Basecamp as a comment

## Prerequisites

- Basecamp account with admin access
- Anthropic Claude API key
- Vercel account (for deployment)

## Step 1: Get Basecamp OAuth Access Token

### Option A: Use Basecamp's OAuth Flow (Recommended for Production)

1. Go to https://launchpad.37signals.com/integrations
2. Click "Register a new integration"
3. Fill in details:
   - **Name**: Design Dream Task Analyzer
   - **Company/Organization**: Design Dream
   - **Website**: https://designdream.is
   - **Redirect URI**: https://your-app.vercel.app/api/auth/basecamp/callback
4. Save and note your Client ID and Client Secret
5. Implement OAuth flow (see Basecamp OAuth documentation)

### Option B: Personal Access Token (Quickest for Testing)

1. Go to https://launchpad.37signals.com/authorization/token?type=web
2. Select your Basecamp account
3. Authorize access
4. Copy the access token

**Note**: Personal tokens are great for testing but expire. For production, implement OAuth flow.

## Step 2: Get Anthropic Claude API Key

1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create Key"
5. Copy your API key (starts with `sk-ant-...`)

## Step 3: Configure Environment Variables

Add these to your `.env.local` (development) and Vercel environment variables (production):

```bash
# Basecamp
BASECAMP_ACCOUNT_ID=5909943
BASECAMP_ACCESS_TOKEN=your_actual_basecamp_token

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your_actual_key_here
```

## Step 4: Test Locally

1. Start the development server:
```bash
npm run dev
```

2. Test the endpoint:
```bash
curl http://localhost:3000/api/webhooks/basecamp
```

You should see:
```json
{
  "status": "Basecamp webhook receiver is running",
  "configuration": {
    "basecamp_configured": true,
    "claude_configured": true,
    "account_id": "5909943"
  },
  "usage": "POST webhooks from Basecamp to this endpoint",
  "events_handled": ["todo_created"]
}
```

3. Test with a sample webhook (simulate todo_created event):
```bash
curl -X POST http://localhost:3000/api/webhooks/basecamp \
  -H "Content-Type: application/json" \
  -d '{
    "id": 9007199254741210,
    "kind": "todo_created",
    "created_at": "2024-01-10T19:00:00.000Z",
    "recording": {
      "id": 123456789,
      "status": "active",
      "type": "Todo",
      "title": "Design new landing page hero section",
      "url": "https://3.basecampapi.com/5909943/buckets/2085958498/todos/123456789.json"
    },
    "creator": {
      "id": 1007299165,
      "name": "Client Name"
    },
    "bucket": {
      "id": 2085958498,
      "name": "Design Dream Project",
      "type": "Project"
    }
  }'
```

## Step 5: Deploy to Vercel

1. Install Vercel CLI (if not already installed):
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Click "Environment Variables"
   - Add `BASECAMP_ACCOUNT_ID`, `BASECAMP_ACCESS_TOKEN`, and `ANTHROPIC_API_KEY`
   - Redeploy

4. Your webhook URL will be: `https://your-app.vercel.app/api/webhooks/basecamp`

## Step 6: Register Webhook in Basecamp

### Using Basecamp API

```bash
# Set your variables
BASECAMP_ACCOUNT_ID=5909943
BASECAMP_ACCESS_TOKEN=your_token_here
PROJECT_ID=your_project_id
WEBHOOK_URL=https://your-app.vercel.app/api/webhooks/basecamp

# Create webhook
curl -s -X POST \
  -H "Authorization: Bearer $BASECAMP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"payload_url\": \"$WEBHOOK_URL\",
    \"types\": [\"todo_created\"]
  }" \
  https://3.basecampapi.com/$BASECAMP_ACCOUNT_ID/buckets/$PROJECT_ID/webhooks.json
```

### Finding Your Project ID

```bash
# List all projects
curl -s -H "Authorization: Bearer $BASECAMP_ACCESS_TOKEN" \
  https://3.basecampapi.com/$BASECAMP_ACCOUNT_ID/projects.json | \
  python3 -m json.tool
```

Look for your project and note the `dock[0].id` value - that's your bucket/project ID.

## Step 7: Test End-to-End

1. Go to your Basecamp project: https://3.basecamp.com/5909943/
2. Create a new to-do with a clear title and description
3. Within 2-3 seconds, you should see a comment appear with:
   - ✅ or 🔍 emoji (SIMPLE or COMPLEX classification)
   - Estimated hours
   - Reasoning
   - Suggested next steps
   - Subtasks (for COMPLEX tasks)

## Troubleshooting

### Webhook not firing

1. Check webhook registration:
```bash
curl -s -H "Authorization: Bearer $BASECAMP_ACCESS_TOKEN" \
  https://3.basecampapi.com/$BASECAMP_ACCOUNT_ID/buckets/$PROJECT_ID/webhooks.json | \
  python3 -m json.tool
```

2. Verify your webhook URL is HTTPS (Basecamp requires HTTPS)

3. Check Vercel function logs for errors

### "Basecamp API error: 401 Unauthorized"

- Your `BASECAMP_ACCESS_TOKEN` is invalid or expired
- For personal tokens: regenerate at https://launchpad.37signals.com/authorization/token?type=web
- For OAuth tokens: implement token refresh

### "Error analyzing with AI"

- Check your `ANTHROPIC_API_KEY` is valid
- Verify you have API credits remaining at https://console.anthropic.com/

### No comment posted to Basecamp

- Check Vercel function logs for errors
- Verify the Basecamp API response was successful
- Ensure your token has permission to post comments

## API Response Codes

- `200 OK` - Webhook processed successfully
- `400 Bad Request` - Invalid payload structure
- `500 Internal Server Error` - Processing failed (Basecamp will retry)

Basecamp will retry failed webhooks up to 10 times with exponential backoff.

## Example Analysis Output

### SIMPLE Task
```
✅ Task Complexity Analysis
Classification: SIMPLE (5 hours estimated)
Reasoning: This is a straightforward UI component creation with clear requirements.
Next Steps: Auto-approved and added to "Up Next" queue. Starting work within 24 hours.
```

### COMPLEX Project
```
🔍 Task Complexity Analysis
Classification: COMPLEX (80+ hours estimated)
Reasoning: This requires full application architecture, multiple integrations, and complex state management.
Next Steps: Please break this down into smaller tasks for accurate scoping.

Suggested Breakdown:
• Set up project structure and authentication
• Design and implement database schema
• Build core API endpoints
• Create frontend components
• Implement payment integration
• Add email notifications
• Testing and deployment
```

## Security Considerations

- Always use HTTPS for webhook URLs
- Store API keys in environment variables, never in code
- Implement rate limiting if needed
- Consider adding webhook signature verification
- Rotate access tokens periodically

## Monitoring

Check Vercel function logs to monitor:
- Webhook events received
- Analysis results
- Errors and failures
- Response times

Target performance:
- Webhook response time: <3 seconds
- Claude API call: <2 seconds
- Basecamp comment posted: <1 second

---

**Need help?** Contact hello@designdream.is
