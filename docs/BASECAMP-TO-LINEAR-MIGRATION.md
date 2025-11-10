# Basecamp to Linear Migration Guide

This document guides you through migrating from Basecamp to Linear for client project management in Design Dream.

## Why Linear?

**Advantages over Basecamp:**
- ✅ Simpler API authentication (API keys vs OAuth 2.0)
- ✅ Better GraphQL API with type safety
- ✅ Native GitHub integration
- ✅ Faster issue creation and updates
- ✅ Built-in keyboard shortcuts and efficiency features
- ✅ Better mobile experience
- ✅ Native Linear MCP server for Claude Code
- ✅ More flexible workflow customization
- ✅ Better SLA tracking capabilities

## Migration Steps

### 1. Review Documentation

Read the new Linear documentation:

1. [Linear README](./linear/README.md) - Overview and benefits
2. [Account Setup](./linear/01-account-setup.md) - Create Linear workspace and API access
3. [Project Template](./linear/02-project-template.md) - Set up project structure
4. [Testing Guide](./linear/03-testing-guide.md) - Verify integration works
5. [API Setup](./linear/04-api-setup.md) - Configure API authentication

### 2. Set Up Linear Account

Follow these steps in order:

1. **Create Linear Workspace**
   - Go to [linear.app](https://linear.app)
   - Sign up/log in
   - Create workspace for your company or client

2. **Generate API Key**
   - Settings → API
   - Create new key: "Design Dream Integration"
   - Copy key (starts with `lin_api_`)

3. **Get Team ID**
   - Team Settings → General
   - Copy Team ID (UUID format)

4. **Configure Webhook**
   - Workspace Settings → Webhooks
   - URL: `https://designdream.is/api/webhooks/linear`
   - Events: Issue Created, Issue Updated
   - Generate and copy webhook secret

### 3. Update Environment Variables

Add Linear credentials to your environment:

```bash
# .env.local
LINEAR_API_KEY=lin_api_your_actual_key_here
LINEAR_TEAM_ID=your_team_uuid_here
LINEAR_WEBHOOK_SECRET=your_webhook_secret_here
ANTHROPIC_API_KEY=sk-ant-your_key_here  # Already have this
```

**Remove or comment out Basecamp variables:**

```bash
# Legacy Basecamp (DEPRECATED)
# BASECAMP_ACCOUNT_ID=...
# BASECAMP_ACCESS_TOKEN=...
# BASECAMP_CLIENT_ID=...
# BASECAMP_CLIENT_SECRET=...
```

### 4. Code Changes Summary

The migration includes these code changes:

**New Files:**
- `src/types/linear.types.ts` - Linear API type definitions
- `src/lib/linear.ts` - Linear API client functions
- `src/app/api/webhooks/linear/route.ts` - Linear webhook handler
- `docs/linear/` - Complete Linear documentation

**Updated Files:**
- `src/lib/claude-analysis.ts` - Import from linear.types instead of basecamp.types
- `src/lib/env.ts` - Added Linear env vars, marked Basecamp as deprecated
- `.env.local.example` - Added Linear vars, commented out Basecamp

**Deprecated Files (can be removed after migration complete):**
- `src/lib/basecamp.ts`
- `src/types/basecamp.types.ts`
- `src/app/api/webhooks/basecamp/route.ts`
- `src/app/api/auth/basecamp/route.ts`
- `src/app/api/auth/basecamp/callback/route.ts`
- `docs/basecamp/`

### 5. Deploy Changes

1. **Update Production Environment Variables**
   ```bash
   # Using Vercel CLI
   vercel env add LINEAR_API_KEY production
   vercel env add LINEAR_TEAM_ID production
   vercel env add LINEAR_WEBHOOK_SECRET production

   # Or use Vercel dashboard:
   # https://vercel.com/your-project/settings/environment-variables
   ```

2. **Deploy to Production**
   ```bash
   git checkout main
   git merge feature/linear-migration
   git push origin main
   ```

3. **Verify Webhook Endpoint**
   ```bash
   curl https://designdream.is/api/webhooks/linear

   # Should return:
   # {"status": "Linear webhook receiver is running", ...}
   ```

### 6. Migrate Existing Projects

For each active Basecamp project:

1. **Create Linear Project**
   - Use the [project template](./linear/02-project-template.md)
   - Set up workflow states (Backlog → Todo → In Progress → In Review → Done)
   - Create labels for categorization

2. **Migrate Active Tasks**
   - Export open todos from Basecamp (manual or via API)
   - Create corresponding Linear issues
   - Add descriptions, assignees, labels
   - Link to original Basecamp tasks in description if needed

3. **Notify Client**
   - Email: "We're upgrading to Linear for better project management"
   - Invite client to Linear workspace
   - Set permissions (Guest role for clients)
   - Share Linear project link

4. **Update Documentation**
   - Update project README with Linear links
   - Archive Basecamp project (don't delete - keep for history)

### 7. Test Integration

Run through the [testing guide](./linear/03-testing-guide.md):

1. **Test Simple Task**
   ```
   Title: Update homepage hero text
   Description: Change the hero section text to match new branding

   Expected: AI classifies as SIMPLE, 1-2 hours
   ```

2. **Test Complex Task**
   ```
   Title: Build complete e-commerce checkout flow
   Description: Implement full checkout with Stripe, orders, emails, etc.

   Expected: AI classifies as COMPLEX with subtask breakdown
   ```

3. **Verify SLA Tracking**
   - Create issue at specific time
   - Check Design Dream dashboard shows correct metrics
   - Verify status tracking (met/at-risk/breached)

### 8. Train Team

1. **Share Documentation**
   - Send team links to Linear docs
   - Schedule 30-minute training session
   - Demo: creating issues, moving through workflow

2. **Set Up Views**
   - Create "My Work" view for each team member
   - Set up "Client Dashboard" view
   - Configure notification preferences

3. **Establish Workflow**
   - Daily standup using Linear issues
   - Weekly grooming of backlog
   - Monthly review of SLA metrics

## API Comparison

### Authentication

**Basecamp (OAuth 2.0):**
```typescript
// Step 1: Redirect to authorization URL
redirect(`https://launchpad.37signals.com/authorization/new?...`);

// Step 2: Handle callback with code
const token = await exchangeCodeForToken(code);

// Step 3: Use token for API calls
fetch(url, { headers: { Authorization: `Bearer ${token}` } });
```

**Linear (API Key):**
```typescript
// One step: Use API key directly
fetch('https://api.linear.app/graphql', {
  headers: { Authorization: LINEAR_API_KEY }
});
```

### Fetching Task Details

**Basecamp:**
```typescript
const todo = await basecampClient.get(
  `/buckets/${bucketId}/todos/${todoId}.json`
);
```

**Linear:**
```typescript
const issue = await linearGraphQL(`
  query { issue(id: $id) { id title description ... } }
`, { id: issueId });
```

### Posting Comments

**Basecamp (HTML):**
```typescript
await postComment(bucketId, todoId, '<div><strong>Analysis</strong>...</div>');
```

**Linear (Markdown):**
```typescript
await postComment(issueId, '## Analysis\n\n**Complexity:** SIMPLE');
```

### Webhook Verification

**Basecamp:**
```typescript
// Basic auth or shared secret header
const authorized =
  request.headers.get('x-webhook-secret') === WEBHOOK_SECRET;
```

**Linear:**
```typescript
// HMAC signature verification
const signature = request.headers.get('linear-signature');
const isValid = verifyWebhookSignature(payload, signature);
```

## Rollback Plan

If you need to rollback to Basecamp:

1. **Restore Environment Variables**
   ```bash
   # Re-enable Basecamp vars
   BASECAMP_ACCESS_TOKEN=...
   BASECAMP_ACCOUNT_ID=...
   ```

2. **Revert Code Changes**
   ```bash
   git revert <migration-commit-hash>
   git push origin main
   ```

3. **Update Webhook**
   - Point Basecamp webhook back to `/api/webhooks/basecamp`
   - Verify webhook deliveries in Basecamp settings

## Troubleshooting

### "Invalid API Key" Error

**Cause**: Linear API key not set or incorrect

**Fix**:
```bash
# Verify key is set
echo $LINEAR_API_KEY

# Should start with: lin_api_

# If wrong, regenerate in Linear → Settings → API
```

### Webhook Not Triggering

**Cause**: Webhook URL incorrect or not publicly accessible

**Fix**:
```bash
# Test endpoint
curl https://designdream.is/api/webhooks/linear

# Check webhook in Linear
# Settings → Webhooks → View deliveries
```

### Duplicate Analysis Comments

**Cause**: Webhook retries posting duplicate comments

**Fix**: The new code includes `hasComplexityAnalysis()` check to prevent duplicates. Ensure you're using the latest code.

### Missing Team ID

**Cause**: LINEAR_TEAM_ID not set

**Fix**:
```typescript
// Get team ID
const query = `query { teams { nodes { id name key } } }`;
const result = await callLinearAPI(query);
console.log(result.data.teams.nodes);
```

## Timeline

Recommended migration timeline:

- **Week 1**: Set up Linear, documentation review, environment config
- **Week 2**: Deploy to staging, run tests, train team
- **Week 3**: Migrate 1-2 pilot projects, gather feedback
- **Week 4**: Migrate remaining projects, full cutover
- **Week 5**: Monitor, optimize, archive Basecamp

## Success Metrics

Track these metrics to measure migration success:

- Webhook success rate (target: >99%)
- AI analysis accuracy (manual spot-checks)
- Team adoption rate (issues created in Linear vs Basecamp)
- SLA compliance improvement
- Time to create/update issues (should be faster in Linear)
- Client satisfaction scores

## Support

Need help?

- **Documentation**: See `docs/linear/` for detailed guides
- **Linear Support**: [linear.app/contact](https://linear.app/contact)
- **Design Dream Team**: [support@designdream.is](mailto:support@designdream.is)
- **Linear API Docs**: [developers.linear.app](https://developers.linear.app)

## Checklist

Use this checklist to track migration progress:

- [ ] Read all Linear documentation
- [ ] Created Linear workspace
- [ ] Generated API key
- [ ] Got team ID
- [ ] Configured webhook
- [ ] Updated environment variables (.env.local)
- [ ] Updated production env vars (Vercel)
- [ ] Deployed code changes
- [ ] Verified webhook endpoint accessible
- [ ] Tested simple task creation
- [ ] Tested complex task creation
- [ ] Migrated first project
- [ ] Invited client to Linear
- [ ] Trained team on Linear
- [ ] Set up monitoring/alerts
- [ ] Archived Basecamp projects
- [ ] Removed Basecamp code (optional)
- [ ] Updated team documentation/wiki
- [ ] Celebrated successful migration! 🎉

## Next Steps

After migration is complete:

1. Monitor for 2 weeks to ensure stability
2. Gather team feedback and optimize workflow
3. Consider removing Basecamp code entirely
4. Update any external documentation referencing Basecamp
5. Share migration experience with Design Dream community
