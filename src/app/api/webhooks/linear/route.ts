/**
 * Linear Webhook Receiver
 * POST /api/webhooks/linear
 *
 * Receives webhooks from Linear, analyzes issues with Claude API,
 * and posts analysis back as comments
 */

import { NextRequest, NextResponse } from 'next/server';
import type { LinearWebhookPayload } from '@/types/linear.types';
import {
  fetchIssueDetails,
  postComment,
  formatAnalysisAsComment,
  verifyWebhookSignature,
  hasComplexityAnalysis,
} from '@/lib/linear';
import { analyzeTaskComplexity, logAnalysis } from '@/lib/claude-analysis';

const LINEAR_WEBHOOK_SECRET = process.env.LINEAR_WEBHOOK_SECRET;

function ensureWebhookSecretConfigured() {
  if (!LINEAR_WEBHOOK_SECRET) {
    console.warn(
      'LINEAR_WEBHOOK_SECRET not configured. Webhook signature verification is disabled.'
    );
  }
}

/**
 * Linear sends webhooks to this endpoint
 * Must return 2xx status for successful processing
 * Linear retries failed webhooks with exponential backoff
 */
export async function POST(request: NextRequest) {
  ensureWebhookSecretConfigured();

  console.log('\n========================================');
  console.log('Linear webhook received');
  console.log('========================================\n');

  try {
    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature
    const signature = request.headers.get('linear-signature');
    if (signature && LINEAR_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.warn('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      console.log('✅ Webhook signature verified');
    }

    // Parse webhook payload
    const payload: LinearWebhookPayload = JSON.parse(rawBody);

    console.log('Webhook event:', {
      action: payload.action,
      type: payload.type,
      createdAt: payload.createdAt,
    });

    // Only process Issue creation events
    if (payload.type !== 'Issue') {
      console.log(`Ignoring event type: ${payload.type}`);
      return NextResponse.json(
        { message: 'Event type not handled' },
        { status: 200 }
      );
    }

    // Only process creation events (not updates or removals)
    if (payload.action !== 'create') {
      console.log(`Ignoring action: ${payload.action}`);
      return NextResponse.json(
        { message: 'Action not handled' },
        { status: 200 }
      );
    }

    // Validate required fields
    if (!payload.data || !payload.data.id) {
      console.error('Missing required fields in webhook payload');
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      );
    }

    // Type guard: ensure payload.data is a LinearIssue
    const issue = payload.data as import('@/types/linear.types').LinearIssue;

    const issueId = issue.id;
    const issueIdentifier = issue.identifier;

    console.log(`Processing new issue: ${issue.title}`);
    console.log(`Issue ID: ${issueId} (${issueIdentifier})`);

    // Step 1: Check if issue already has complexity analysis
    // (prevents duplicate analysis on webhook retries)
    console.log('\n--- Checking for existing analysis ---');
    const alreadyAnalyzed = await hasComplexityAnalysis(issueId);

    if (alreadyAnalyzed) {
      console.log('⏭️  Issue already has complexity analysis, skipping');
      return NextResponse.json(
        {
          success: true,
          message: 'Issue already analyzed',
        },
        { status: 200 }
      );
    }

    // Step 2: Fetch full issue details (webhook payload has limited info)
    console.log('\n--- Fetching full issue details ---');
    const fullIssue = await fetchIssueDetails(issueId);

    console.log('Issue details:', {
      identifier: fullIssue.identifier,
      title: fullIssue.title,
      description: fullIssue.description?.substring(0, 100) + '...',
      state: fullIssue.state.name,
      priority: fullIssue.priorityLabel,
      assignee: fullIssue.assignee?.name || 'Unassigned',
    });

    // Step 3: Analyze complexity with Claude API
    console.log('\n--- Analyzing task complexity ---');
    const analysis = await analyzeTaskComplexity(
      fullIssue.title,
      fullIssue.description || ''
    );

    // Log analysis result
    logAnalysis(analysis);

    // Step 4: Format analysis as Markdown comment
    const commentMarkdown = formatAnalysisAsComment(analysis);

    // Step 5: Post comment back to Linear
    console.log('\n--- Posting analysis to Linear ---');
    await postComment(issueId, commentMarkdown);

    console.log('✅ Webhook processed successfully');
    console.log('========================================\n');

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
        issue: {
          id: fullIssue.id,
          identifier: fullIssue.identifier,
          title: fullIssue.title,
        },
        analysis: {
          complexity: analysis.complexity,
          estimatedHours: analysis.estimatedHours,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('\n❌ Error processing webhook:', error);

    // Return 500 to trigger Linear retry
    // Linear will retry failed webhooks with exponential backoff
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing
 * Returns webhook status and configuration
 */
export async function GET(request: NextRequest) {
  ensureWebhookSecretConfigured();

  // Optional: Add basic auth for GET endpoint
  const authHeader = request.headers.get('authorization');
  const expectedAuth = process.env.WEBHOOK_TEST_TOKEN;

  if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      status: 'Linear webhook receiver is running',
      configuration: {
        linear_api_configured: !!process.env.LINEAR_API_KEY,
        linear_team_configured: !!process.env.LINEAR_TEAM_ID,
        webhook_secret_configured: !!process.env.LINEAR_WEBHOOK_SECRET,
        claude_configured: !!process.env.ANTHROPIC_API_KEY,
      },
      usage: 'POST webhooks from Linear to this endpoint',
      events_handled: ['Issue: create'],
      endpoint: '/api/webhooks/linear',
    },
    { status: 200 }
  );
}
