# Linear Integration Testing Guide

This guide provides comprehensive testing procedures to verify your Linear integration with Design Dream is working correctly.

## Pre-Testing Checklist

Before running tests, ensure you have:

- [ ] Linear API key configured in environment variables
- [ ] Webhook endpoint deployed and publicly accessible
- [ ] Linear webhook configured to point to your endpoint
- [ ] Linear project created with proper workflow states
- [ ] Test team or project for safe testing

## Test Environment Setup

### 1. Create Test Project

Create a dedicated test project to avoid cluttering real projects:

```
Name: [TEST] Integration Testing
Identifier: TEST
Description: Used for testing Design Dream integration
```

### 2. Configure Environment Variables

Verify all required variables are set:

```bash
# Check .env.local or production environment
LINEAR_API_KEY=lin_api_xxxxx
LINEAR_WEBHOOK_SECRET=your_webhook_secret
LINEAR_TEAM_ID=your_team_id
ANTHROPIC_API_KEY=your_claude_key  # For AI analysis
```

### 3. Enable Debug Logging

Temporarily enable verbose logging in your app:

```typescript
// In your webhook handler
console.log('Received Linear webhook:', JSON.stringify(payload, null, 2));
```

## Test Scenarios

### Test 1: Simple Task Creation

**Objective**: Verify webhook triggers and AI analyzes simple tasks correctly

**Steps**:
1. Create a new issue in Linear:
   ```
   Title: Update homepage hero text
   Description: Change the hero section text to match new branding
   ```
2. Wait 5-10 seconds
3. Check the issue for Design Dream bot comment

**Expected Result**:
- Webhook triggers within 1-2 seconds
- AI analyzes task as SIMPLE
- Comment appears with:
  - Classification: SIMPLE
  - Estimated hours: 1-2 hours
  - Reasoning provided
  - Suggested action provided

**Verification**:
```bash
# Check webhook logs
curl https://designdream.is/api/webhooks/linear/logs

# Check Linear API was called
# Should see comment posted by bot account
```

### Test 2: Complex Task Creation

**Objective**: Verify AI correctly identifies and breaks down complex tasks

**Steps**:
1. Create a new issue:
   ```
   Title: Build complete e-commerce checkout flow
   Description: Implement a full checkout system with payment processing,
   order management, email notifications, and admin dashboard for orders.
   Include Stripe integration, inventory tracking, and customer accounts.
   ```
2. Wait 5-10 seconds
3. Check for bot comment

**Expected Result**:
- AI analyzes as COMPLEX
- Estimated hours: >4 hours
- Includes suggested subtask breakdown:
  - Set up Stripe integration
  - Build checkout UI
  - Implement order management
  - Create admin dashboard
  - Add email notifications

**Verification**:
Check comment includes all 5 elements:
- Complexity classification
- Hour estimate
- Reasoning
- Suggested action
- Subtask breakdown

### Test 3: Issue Update Webhook

**Objective**: Verify updates trigger webhooks (if configured)

**Steps**:
1. Create an issue (from Test 1 or 2)
2. Wait for initial AI comment
3. Update the issue title or description
4. Wait 5 seconds

**Expected Result**:
- Update webhook triggers
- No duplicate analysis comment (should detect existing comment)
- Logs show webhook received

**Verification**:
```typescript
// Webhook handler should log
console.log('Webhook type:', payload.type);  // Should show 'Issue' and action 'update'
```

### Test 4: Authentication & Authorization

**Objective**: Verify API credentials are working

**Steps**:
1. Make direct API call to Linear:
   ```bash
   curl -X POST https://api.linear.app/graphql \
     -H "Content-Type: application/json" \
     -H "Authorization: $LINEAR_API_KEY" \
     -d '{"query":"{ viewer { id name email } }"}'
   ```

2. Verify response contains user data

**Expected Result**:
```json
{
  "data": {
    "viewer": {
      "id": "xxxxx",
      "name": "Your Name",
      "email": "you@example.com"
    }
  }
}
```

**Common Errors**:
- `401 Unauthorized`: Invalid API key
- `403 Forbidden`: Insufficient permissions
- `429 Too Many Requests`: Rate limit exceeded

### Test 5: Comment Posting

**Objective**: Verify bot can post comments to issues

**Steps**:
1. Get issue ID from Test 1 or 2
2. Use Linear MCP or API to post test comment:
   ```bash
   # Using Linear MCP (if available)
   # Or direct API call
   ```

**Expected Result**:
- Comment appears in Linear issue
- Shows correct author (bot account)
- HTML formatting preserved

### Test 6: SLA Tracking

**Objective**: Verify SLA metrics are calculated correctly

**Steps**:
1. Create issue at specific time (note timestamp)
2. Wait for AI comment (note timestamp)
3. Move issue to "In Progress" (note timestamp)
4. Move to "Done" (note timestamp)
5. Check Design Dream dashboard

**Expected Metrics**:
- First response time: Time from creation to first comment
- Start time: Time from creation to "In Progress"
- Completion time: Time from creation to "Done"

**Verification**:
```typescript
// Check dashboard shows:
{
  issueId: "TEST-1",
  createdAt: "2024-01-10T10:00:00Z",
  firstResponseAt: "2024-01-10T10:00:05Z",  // ~5 seconds
  startedAt: "2024-01-10T11:00:00Z",         // 1 hour later
  completedAt: "2024-01-10T13:00:00Z",       // 3 hours total
  slaStatus: "met" | "at-risk" | "breached"
}
```

### Test 7: Error Handling

**Objective**: Verify system handles errors gracefully

**Steps**:

#### 7a. Invalid Webhook Signature
1. Send webhook with wrong signature
2. Verify request is rejected

**Expected**: 401 Unauthorized

#### 7b. Malformed Payload
1. Send webhook with invalid JSON
2. Verify error is logged and handled

**Expected**: 400 Bad Request, error logged

#### 7c. API Rate Limit
1. Make many rapid API calls (if testing in dev)
2. Verify rate limit handling

**Expected**: Exponential backoff, retry logic

#### 7d. Network Timeout
1. Simulate slow Linear API response
2. Verify timeout handling

**Expected**: Request times out gracefully, error logged

### Test 8: Concurrent Webhooks

**Objective**: Verify system handles multiple webhooks at once

**Steps**:
1. Create 5 issues rapidly in Linear (within 10 seconds)
2. Verify all receive AI analysis
3. Check for race conditions

**Expected Result**:
- All 5 issues get comments
- No duplicate comments
- No missed webhooks
- Proper queuing/processing

### Test 9: End-to-End Client Workflow

**Objective**: Simulate complete client usage

**Steps**:
1. Client creates issue in Backlog
2. Wait for AI analysis comment
3. Project lead reviews, moves to Todo
4. Developer moves to In Progress
5. Developer completes, moves to In Review
6. Client reviews and approves, moves to Done

**Expected Result**:
- AI comment appears after step 1
- SLA tracking records all transitions
- Notifications sent at each step
- Dashboard shows accurate metrics

### Test 10: Integration with Design Dream Dashboard

**Objective**: Verify dashboard displays Linear data correctly

**Steps**:
1. Create 3 issues in Linear (1 simple, 1 complex, 1 in-progress)
2. Log into Design Dream dashboard
3. Navigate to project view

**Expected Result**:
- All 3 issues displayed
- Correct complexity badges
- Accurate time estimates
- Real-time status updates
- SLA indicators showing compliance

## Performance Testing

### Response Time Benchmarks

Measure and verify acceptable response times:

| Metric | Target | Maximum |
|--------|--------|---------|
| Webhook receipt | <1s | 2s |
| Linear API fetch | <2s | 5s |
| AI analysis | <5s | 10s |
| Comment posting | <2s | 5s |
| Total (creation to comment) | <10s | 20s |

### Load Testing

Test with higher volume:

1. Create 50 issues over 5 minutes (10/minute)
2. Verify all processed successfully
3. Check for errors or timeouts
4. Verify no performance degradation

## Debugging Failed Tests

### Webhook Not Received

**Check**:
1. Webhook URL is publicly accessible
2. SSL certificate is valid
3. Firewall not blocking Linear IPs
4. Webhook still enabled in Linear settings

**Debug**:
```bash
# Test endpoint is reachable
curl https://designdream.is/api/webhooks/linear

# Check Linear webhook logs
# Settings → Webhooks → View deliveries
```

### AI Analysis Not Posted

**Check**:
1. ANTHROPIC_API_KEY is valid
2. API rate limits not exceeded
3. Issue description has content to analyze
4. Bot account has comment permissions

**Debug**:
```typescript
// Add logging in webhook handler
console.log('Analyzing issue:', issue.id);
console.log('Analysis result:', analysis);
console.log('Posting comment with content:', commentHtml);
```

### Incorrect Complexity Classification

**Check**:
1. Task description is clear and detailed
2. AI prompt is properly formatted
3. Claude API responding correctly

**Test**:
```typescript
// Test AI directly
const analysis = await analyzeTaskComplexity(
  "Update homepage text",
  "Change hero section from 'Welcome' to 'Hello World'"
);
console.log(analysis);
// Should classify as SIMPLE with 1-2 hours
```

### SLA Metrics Incorrect

**Check**:
1. Timestamps captured at each state change
2. Timezone handling correct
3. Business hours calculation accurate

**Debug**:
```typescript
// Log all timestamps
console.log('Issue lifecycle:', {
  created: issue.createdAt,
  firstResponse: firstCommentAt,
  started: movedToInProgressAt,
  completed: movedToDoneAt
});
```

## Automated Testing

### Unit Tests

Create automated tests for key functions:

```typescript
// tests/linear-webhook.test.ts
describe('Linear Webhook Handler', () => {
  it('should verify webhook signature', async () => {
    const payload = { /* mock payload */ };
    const signature = generateSignature(payload);
    expect(verifySignature(payload, signature)).toBe(true);
  });

  it('should analyze simple tasks correctly', async () => {
    const task = {
      title: 'Update button color',
      description: 'Change primary button from blue to green'
    };
    const analysis = await analyzeTaskComplexity(task.title, task.description);
    expect(analysis.complexity).toBe('SIMPLE');
    expect(analysis.estimatedHours).toBeLessThanOrEqual(4);
  });

  it('should analyze complex tasks correctly', async () => {
    const task = {
      title: 'Build entire authentication system',
      description: 'Implement login, signup, password reset, OAuth, 2FA'
    };
    const analysis = await analyzeTaskComplexity(task.title, task.description);
    expect(analysis.complexity).toBe('COMPLEX');
    expect(analysis.estimatedHours).toBeGreaterThan(4);
    expect(analysis.suggestedSubtasks).toBeDefined();
  });
});
```

### Integration Tests

Test complete workflow:

```typescript
// tests/integration/linear-flow.test.ts
describe('End-to-End Linear Integration', () => {
  it('should handle complete issue lifecycle', async () => {
    // Create issue
    const issue = await createLinearIssue({
      title: 'Test task',
      description: 'Test description'
    });

    // Wait for webhook processing
    await sleep(5000);

    // Verify comment exists
    const comments = await getIssueComments(issue.id);
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toContain('Task Complexity Analysis');

    // Clean up
    await deleteIssue(issue.id);
  });
});
```

## Test Report Template

Document your test results:

```markdown
# Linear Integration Test Report

**Date**: 2024-01-10
**Tester**: Chris Carter
**Environment**: Production
**Linear Workspace**: designdream.linear.app

## Test Results Summary

- Total Tests: 10
- Passed: 9
- Failed: 1
- Skipped: 0

## Detailed Results

### ✅ Test 1: Simple Task Creation
- Status: PASSED
- Duration: 8 seconds
- Notes: AI correctly classified as SIMPLE with 2-hour estimate

### ✅ Test 2: Complex Task Creation
- Status: PASSED
- Duration: 12 seconds
- Notes: AI correctly classified as COMPLEX with subtask breakdown

### ❌ Test 3: Issue Update Webhook
- Status: FAILED
- Error: Duplicate comment posted on update
- Fix Required: Add check for existing comments before posting

[... continue for all tests ...]

## Recommendations

1. Fix duplicate comment issue in Test 3
2. Improve webhook response time (currently 8-12s, target <10s)
3. Add monitoring alerts for failed webhooks

## Sign-off

Tests completed successfully with minor issues noted above.
Integration is ready for production use pending fixes.
```

## Monitoring & Alerting

Set up ongoing monitoring:

### Metrics to Track
- Webhook success rate (target: >99%)
- AI analysis success rate (target: >98%)
- Comment posting success rate (target: >99%)
- Average response time (target: <10s)
- SLA compliance rate (target: >95%)

### Alerts to Configure
- Webhook endpoint down
- AI analysis failures >2%
- Comment posting failures >1%
- Response time >20s
- SLA breach rate >10%

## Next Steps

After all tests pass:

1. ✅ Mark integration as production-ready
2. 📝 Document any deviations or customizations
3. 🎯 Set up monitoring and alerts
4. 👥 Train team on Linear workflow
5. 📊 Begin tracking KPIs and SLA metrics

## Resources

- [Linear API Testing](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#testing)
- [Webhook Debugging](https://developers.linear.app/docs/graphql/webhooks#debugging)
- [Design Dream Support](https://designdream.is/support)
