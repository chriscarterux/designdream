import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

/**
 * GET /api/stripe/checkout-session
 *
 * Retrieves details of a completed checkout session
 *
 * Query params:
 * - session_id: string (Stripe checkout session ID)
 *
 * Returns:
 * - customerEmail: string
 * - subscriptionId: string
 * - amountTotal: number
 * - status: string
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    // Validate session status
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Extract customer email
    let customerEmail = '';
    if (typeof session.customer === 'string') {
      const customer = await stripe.customers.retrieve(session.customer);
      if (!customer.deleted) {
        customerEmail = customer.email || '';
      }
    } else if (session.customer && !session.customer.deleted) {
      customerEmail = session.customer.email || '';
    } else {
      customerEmail = session.customer_email || '';
    }

    // Extract subscription ID
    let subscriptionId = '';
    if (typeof session.subscription === 'string') {
      subscriptionId = session.subscription;
    } else if (session.subscription) {
      subscriptionId = session.subscription.id;
    }

    // Return session details
    return NextResponse.json({
      customerEmail,
      subscriptionId,
      amountTotal: session.amount_total || 0,
      status: session.payment_status,
    });

  } catch (error) {
    console.error('Error retrieving checkout session:', error);

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: 'Failed to retrieve session',
          message: error.message,
        },
        { status: 400 }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stripe/checkout-session
 *
 * Returns method not allowed for POST requests
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve session details.' },
    { status: 405 }
  );
}
