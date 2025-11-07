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
import { Buffer } from 'node:buffer';

const WEBHOOK_SHARED_SECRET = process.env.BASECAMP_WEBHOOK_SECRET;
const WEBHOOK_BASIC_USERNAME = process.env.BASECAMP_WEBHOOK_USERNAME;
const WEBHOOK_BASIC_PASSWORD = process.env.BASECAMP_WEBHOOK_PASSWORD;

function ensureWebhookSecretConfigured() {
  if (!WEBHOOK_SHARED_SECRET && (!WEBHOOK_BASIC_USERNAME || !WEBHOOK_BASIC_PASSWORD)) {
    throw new Error(
      'Basecamp webhook secret or basic auth credentials are not configured. ' +
      'Set BASECAMP_WEBHOOK_SECRET or BASECAMP_WEBHOOK_USERNAME/BASECAMP_WEBHOOK_PASSWORD.'
    );
  }
}

function isAuthorized(request: NextRequest): boolean {
  const sharedSecretHeader = request.headers.get('x-webhook-secret');
  if (WEBHOOK_SHARED_SECRET && sharedSecretHeader === WEBHOOK_SHARED_SECRET) {
    return true;
  }

  const authHeader = request.headers.get('authorization');
  if (
    authHeader &&
    authHeader.startsWith('Basic ') &&
    WEBHOOK_BASIC_USERNAME &&
    WEBHOOK_BASIC_PASSWORD
  ) {
    try {
      const decoded = Buffer.from(authHeader.replace('Basic ', ''), 'base64').toString();
      const [username, password] = decoded.split(':');
      if (username === WEBHOOK_BASIC_USERNAME && password === WEBHOOK_BASIC_PASSWORD) {
        return true;
      }
    } catch (error) {
      console.error('Failed to decode Basecamp webhook auth header:', error);
    }
  }

  return false;
}

/**
 * Basecamp sends webhooks to this endpoint
 * Must return 2xx status for successful processing
 * Basecamp retries up to 10 times with exponential backoff on failure
 */
export async function POST(request: NextRequest) {
  ensureWebhookSecretConfigured();

  if (!isAuthorized(request)) {
    console.warn('Unauthorized Basecamp webhook attempt blocked');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
export async function GET(request: NextRequest) {
  ensureWebhookSecretConfigured();

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(
    {
      status: 'Basecamp webhook receiver is running',
      configuration: {
        basecamp_configured: !!process.env.BASECAMP_ACCESS_TOKEN,
        claude_configured: !!process.env.ANTHROPIC_API_KEY,
      },
      usage: 'POST webhooks from Basecamp to this endpoint',
      events_handled: ['todo_created'],
    },
    { status: 200 }
  );
}
