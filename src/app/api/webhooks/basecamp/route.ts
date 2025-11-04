/**
 * Basecamp Webhook Receiver
 * POST /api/webhooks/basecamp
 *
 * Receives webhooks from Basecamp, analyzes todos with Claude API,
 * and posts analysis back as comments
 */

import { NextRequest, NextResponse } from 'next/server';
import type { BasecampWebhookPayload } from '@/types/basecamp.types';
import { fetchTodoDetails, postComment, formatAnalysisAsComment } from '@/lib/basecamp';
import { analyzeTaskComplexity, logAnalysis } from '@/lib/claude-analysis';

/**
 * Basecamp sends webhooks to this endpoint
 * Must return 2xx status for successful processing
 * Basecamp retries up to 10 times with exponential backoff on failure
 */
export async function POST(request: NextRequest) {
  console.log('\n========================================');
  console.log('Basecamp webhook received');
  console.log('========================================\n');

  try {
    // Parse webhook payload
    const payload: BasecampWebhookPayload = await request.json();

    console.log('Webhook event:', {
      id: payload.id,
      kind: payload.kind,
      created_at: payload.created_at,
      recording_type: payload.recording?.type,
      recording_title: payload.recording?.title,
    });

    // Only process todo_created events
    if (payload.kind !== 'todo_created') {
      console.log(`Ignoring event type: ${payload.kind}`);
      return NextResponse.json(
        { message: 'Event type not handled' },
        { status: 200 }
      );
    }

    // Validate required fields
    if (!payload.recording || !payload.bucket) {
      console.error('Missing required fields in webhook payload');
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      );
    }

    const bucketId = payload.bucket.id;
    const todoId = payload.recording.id;

    console.log(`Processing new todo: ${payload.recording.title}`);
    console.log(`Bucket ID: ${bucketId}, Todo ID: ${todoId}`);

    // Step 1: Fetch full todo details (webhook payload has limited info)
    console.log('\n--- Fetching full todo details ---');
    const todo = await fetchTodoDetails(bucketId, todoId);

    console.log('Todo details:', {
      title: todo.title,
      description: todo.description?.substring(0, 100) + '...',
      completed: todo.completed,
      assignees: todo.assignees?.length || 0,
    });

    // Step 2: Analyze complexity with Claude API
    console.log('\n--- Analyzing task complexity ---');
    const analysis = await analyzeTaskComplexity(
      todo.title,
      todo.description || ''
    );

    // Log analysis result
    logAnalysis(analysis);

    // Step 3: Format analysis as HTML comment
    const commentHtml = formatAnalysisAsComment(analysis);

    // Step 4: Post comment back to Basecamp
    console.log('\n--- Posting analysis to Basecamp ---');
    await postComment(bucketId, todoId, commentHtml);

    console.log('✅ Webhook processed successfully');
    console.log('========================================\n');

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
        analysis: {
          complexity: analysis.complexity,
          estimatedHours: analysis.estimatedHours,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('\n❌ Error processing webhook:', error);

    // Return 500 to trigger Basecamp retry
    // Basecamp will retry up to 10 times with exponential backoff
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
export async function GET() {
  const hasBasecampToken = !!process.env.BASECAMP_ACCESS_TOKEN;
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const accountId = process.env.BASECAMP_ACCOUNT_ID;

  return NextResponse.json({
    status: 'Basecamp webhook receiver is running',
    configuration: {
      basecamp_configured: hasBasecampToken,
      claude_configured: hasAnthropicKey,
      account_id: accountId,
    },
    usage: 'POST webhooks from Basecamp to this endpoint',
    events_handled: ['todo_created'],
  });
}
