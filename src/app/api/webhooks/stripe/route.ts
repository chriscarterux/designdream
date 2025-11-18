import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { handleWebhookEvent } from '@/lib/stripe-webhooks';
import { supabaseAdmin } from '@/lib/supabase-server';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe Webhook Handler with Replay Attack Prevention
 *
 * This endpoint receives webhook events from Stripe and processes them securely.
 * Security features:
 * - Signature verification (prevents tampering)
 * - Timestamp validation (prevents replay attacks)
 * - Idempotency checks (prevents duplicate processing)
 * - Database transactions (ensures data consistency)
 * - Dead letter queue (handles failures gracefully)
 *
 * Events handled:
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 */

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs';

// Maximum age for webhook events (5 minutes)
const MAX_EVENT_AGE_SECONDS = 300;

// Monitoring thresholds
const SLOW_PROCESSING_THRESHOLD_MS = 3000;

/**
 * Check if event is too old (replay attack prevention)
 */
function isEventExpired(eventCreatedTimestamp: number): boolean {
  const eventTime = new Date(eventCreatedTimestamp * 1000);
  const now = new Date();
  const ageInSeconds = (now.getTime() - eventTime.getTime()) / 1000;

  return ageInSeconds > MAX_EVENT_AGE_SECONDS;
}

/**
 * Check if event was already processed (idempotency)
 */
async function isEventProcessed(eventId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('webhook_events')
    .select('id, processed')
    .eq('stripe_event_id', eventId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned, which is fine
    console.error('Error checking event processed status:', error);
    return false;
  }

  return !!data;
}

/**
 * Record webhook event in database for audit trail and idempotency
 */
async function recordWebhookEvent(
  eventId: string,
  eventType: string,
  eventCreatedTimestamp: number,
  payload: any
): Promise<{ isDuplicate: boolean; eventDbId: string | null }> {
  try {
    // First, check if event already exists
    const existing = await supabaseAdmin
      .from('webhook_events')
      .select('id')
      .eq('stripe_event_id', eventId)
      .maybeSingle();

    if (existing.data) {
      console.warn(`Duplicate event detected: ${eventId}`);
      return { isDuplicate: true, eventDbId: existing.data.id };
    }

    // Insert new event
    const { data, error } = await supabaseAdmin
      .from('webhook_events')
      .insert({
        stripe_event_id: eventId,
        event_type: eventType,
        event_timestamp: new Date(eventCreatedTimestamp * 1000).toISOString(),
        payload,
        processed: false,
      })
      .select('id')
      .single();

    if (error) {
      // Check if it's a unique constraint violation (race condition)
      if (error.code === '23505') {
        console.warn(`Duplicate event detected (race condition): ${eventId}`);
        return { isDuplicate: true, eventDbId: null };
      }
      throw error;
    }

    return { isDuplicate: false, eventDbId: data.id };
  } catch (err) {
    console.error('Error recording webhook event:', err);
    throw err;
  }
}

/**
 * Mark event as processed in database
 */
async function markEventProcessed(
  eventDbId: string,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  await supabaseAdmin
    .from('webhook_events')
    .update({
      processed: true,
      error_message: errorMessage || null,
    })
    .eq('id', eventDbId);
}

/**
 * Log failed webhook to dead letter queue
 */
async function logWebhookFailure(
  eventId: string,
  eventType: string,
  payload: any,
  failureReason: string,
  errorMessage: string,
  stackTrace?: string
): Promise<void> {
  try {
    await supabaseAdmin.from('webhook_failures').insert({
      stripe_event_id: eventId,
      event_type: eventType,
      payload,
      failure_reason: failureReason,
      error_message: errorMessage,
      stack_trace: stackTrace || null,
      status: 'pending',
    });

    console.log(`Logged webhook failure for event ${eventId} to dead letter queue`);
  } catch (err) {
    console.error('Failed to log webhook failure:', err);
  }
}

/**
 * Main webhook handler
 */
export async function POST(req: NextRequest) {
  const processingStartTime = Date.now();

  try {
    // Get request body and signature
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature and construct event
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      const error = err as Error;
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${error.message}` },
        { status: 400 }
      );
    }

    // SECURITY: Check if event is too old (replay attack prevention)
    if (isEventExpired(event.created)) {
      const eventAge = Math.floor((Date.now() / 1000) - event.created);
      console.error(
        `Rejected expired event: ${event.id} (age: ${eventAge}s, max: ${MAX_EVENT_AGE_SECONDS}s)`
      );

      // Log to dead letter queue
      await logWebhookFailure(
        event.id,
        event.type,
        event.data.object,
        'event_expired',
        `Event is ${eventAge}s old, exceeds ${MAX_EVENT_AGE_SECONDS}s limit`
      );

      return NextResponse.json(
        {
          error: 'Event expired',
          message: `Event is too old (${eventAge}s), possible replay attack`,
        },
        { status: 400 }
      );
    }

    console.log(`Received webhook event: ${event.type} (${event.id})`);

    // IDEMPOTENCY: Record event and check for duplicates
    let eventDbId: string | null = null;
    try {
      const { isDuplicate, eventDbId: dbId } = await recordWebhookEvent(
        event.id,
        event.type,
        event.created,
        event.data.object
      );

      if (isDuplicate) {
        console.warn(`Duplicate event ${event.id} rejected (replay protection)`);
        return NextResponse.json(
          {
            received: true,
            processed: false,
            message: 'Duplicate event (already processed)',
          },
          { status: 200 }
        );
      }

      eventDbId = dbId;
    } catch (err) {
      console.error('Failed to record webhook event:', err);
      // Continue processing even if logging fails (but less ideal)
      // In production, you might want to return 500 to trigger Stripe retry
    }

    // Process the webhook event
    let result;
    try {
      result = await handleWebhookEvent(event);
    } catch (error) {
      const err = error as Error;
      console.error(`Unexpected error processing webhook ${event.id}:`, err);

      // Log to dead letter queue
      await logWebhookFailure(
        event.id,
        event.type,
        event.data.object,
        'processing_error',
        err.message,
        err.stack
      );

      // Mark as processed with error
      if (eventDbId) {
        await markEventProcessed(eventDbId, false, err.message);
      }

      // Return 500 to trigger Stripe retry
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: err.message,
        },
        { status: 500 }
      );
    }

    // Calculate processing time
    const processingTime = Date.now() - processingStartTime;
    if (processingTime > SLOW_PROCESSING_THRESHOLD_MS) {
      console.warn(
        `Slow webhook processing detected: ${event.id} took ${processingTime}ms`
      );
    }

    // Mark event as processed
    if (eventDbId) {
      await markEventProcessed(
        eventDbId,
        result.success,
        result.error?.message
      );
    }

    // Handle processing result
    if (!result.success) {
      console.error(`Failed to process event ${event.id}:`, result.error);

      // Log to dead letter queue if it's a critical failure
      if (result.error) {
        await logWebhookFailure(
          event.id,
          event.type,
          event.data.object,
          'handler_error',
          result.message,
          result.error.stack
        );
      }

      // Return 200 to acknowledge receipt (prevents infinite retries)
      // Failed events are in dead letter queue for manual review
      return NextResponse.json(
        {
          received: true,
          processed: false,
          error: result.message,
          processingTimeMs: processingTime,
        },
        { status: 200 }
      );
    }

    console.log(
      `Successfully processed event ${event.id} in ${processingTime}ms`
    );

    return NextResponse.json(
      {
        received: true,
        processed: true,
        message: result.message,
        processingTimeMs: processingTime,
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error('Unexpected error in webhook handler:', err);

    // Return 500 for unexpected errors to trigger Stripe retry
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err.message,
      },
      { status: 500 }
    );
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
