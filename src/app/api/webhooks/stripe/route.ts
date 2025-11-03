import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import { handleWebhookEvent } from '@/lib/stripe-webhooks';

/**
 * Stripe Webhook Handler
 *
 * This endpoint receives webhook events from Stripe and processes them.
 * It verifies the webhook signature to ensure authenticity and prevents
 * replay attacks.
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

export async function POST(req: NextRequest) {
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

  let event: Stripe.Event;

  try {
    // Verify webhook signature
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

  // Log the received event
  console.log(`Received webhook event: ${event.type} (${event.id})`);

  // Check for duplicate events (idempotency)
  // The event.id is unique and can be used to prevent duplicate processing
  // In production, you should check if this event was already processed
  // by querying the webhook_events table

  try {
    // Handle the event
    const result = await handleWebhookEvent(event);

    if (!result.success) {
      console.error(`Failed to process event ${event.id}:`, result.error);
      // Return 200 to acknowledge receipt even on processing errors
      // This prevents Stripe from retrying events that fail due to application logic
      return NextResponse.json(
        {
          received: true,
          processed: false,
          error: result.message,
        },
        { status: 200 }
      );
    }

    console.log(`Successfully processed event ${event.id}`);

    return NextResponse.json(
      {
        received: true,
        processed: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error('Unexpected error processing webhook:', err);

    // Return 500 for unexpected errors to trigger Stripe retry mechanism
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
