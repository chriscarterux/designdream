import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * Webhook Testing and Verification Endpoint
 *
 * This endpoint helps test webhook signature verification and
 * provides debugging information for webhook issues.
 *
 * SECURITY NOTE: This endpoint should be protected in production
 * or removed entirely. Only use for development/debugging.
 */

export const runtime = 'nodejs';

/**
 * GET /api/webhooks/test
 * Returns webhook configuration and recent events
 */
export async function GET(req: NextRequest) {
  try {
    // Check if webhook secret is configured
    const webhookSecretConfigured = !!STRIPE_WEBHOOK_SECRET;

    // Get recent webhook events from database
    const { data: recentEvents, error } = await supabaseAdmin
      .from('webhook_events')
      .select('stripe_event_id, event_type, processed, error_message, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recent events:', error);
    }

    // Get webhook failure count
    const { count: failureCount } = await supabaseAdmin
      .from('webhook_failures')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get replay attempt count (duplicate events)
    const { data: replayAttempts } = await supabaseAdmin
      .from('webhook_events')
      .select('stripe_event_id')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const duplicateCount = replayAttempts
      ? replayAttempts.length - new Set(replayAttempts.map(e => e.stripe_event_id)).size
      : 0;

    return NextResponse.json({
      status: 'ok',
      config: {
        webhookSecretConfigured,
        maxEventAgeSeconds: 300,
        slowProcessingThresholdMs: 3000,
      },
      stats: {
        recentEvents: recentEvents?.length || 0,
        pendingFailures: failureCount || 0,
        replayAttemptsLast24h: duplicateCount,
      },
      recentEvents: recentEvents || [],
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: 'Failed to fetch webhook status',
        message: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/webhooks/test
 * Test webhook signature verification
 *
 * Usage:
 * 1. Use Stripe CLI to forward events: stripe listen --forward-to localhost:3000/api/webhooks/stripe
 * 2. Trigger a test event: stripe trigger payment_intent.succeeded
 * 3. Or manually test signature verification by passing event data
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        {
          error: 'Missing stripe-signature header',
          message: 'This endpoint requires a valid Stripe signature',
          tip: 'Use Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe',
        },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      const error = err as Error;
      return NextResponse.json(
        {
          error: 'Signature verification failed',
          message: error.message,
          details: {
            signatureProvided: !!signature,
            webhookSecretConfigured: !!STRIPE_WEBHOOK_SECRET,
            bodyLength: body.length,
          },
        },
        { status: 400 }
      );
    }

    // Check event age
    const eventAge = Math.floor((Date.now() / 1000) - event.created);
    const isExpired = eventAge > 300;

    // Check if event already exists (duplicate)
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events')
      .select('stripe_event_id, processed')
      .eq('stripe_event_id', event.id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      message: 'Signature verified successfully',
      event: {
        id: event.id,
        type: event.type,
        created: event.created,
        ageSeconds: eventAge,
      },
      security: {
        signatureValid: true,
        isExpired,
        isDuplicate: !!existingEvent,
        wasProcessed: existingEvent?.processed || false,
      },
      recommendation: isExpired
        ? 'Event is too old and would be rejected'
        : existingEvent
        ? 'Event is a duplicate and would be rejected'
        : 'Event would be processed normally',
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: 'Test failed',
        message: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/webhooks/test
 * Clean up test webhook events (development only)
 */
export async function DELETE() {
  try {
    // Delete test events (events with 'test_' prefix)
    const { error } = await supabaseAdmin
      .from('webhook_events')
      .delete()
      .like('stripe_event_id', 'test_%');

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Test events cleaned up',
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        message: err.message,
      },
      { status: 500 }
    );
  }
}
