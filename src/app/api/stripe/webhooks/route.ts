import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * POST /api/stripe/webhooks
 *
 * Handles Stripe webhook events
 *
 * Important: This endpoint must be configured in your Stripe Dashboard
 * and the webhook secret must be set in environment variables.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found in request headers');
    return NextResponse.json(
      { error: 'No signature provided' },
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
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id;

  const subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id;

  if (!customerId || !subscriptionId) {
    console.error('Missing customer or subscription ID in checkout session');
    return;
  }

  // TODO: Update user record in database
  // Example:
  // await updateUserSubscription({
  //   userId: session.metadata?.userId,
  //   customerId,
  //   subscriptionId,
  //   status: 'active',
  // });

  // TODO: Send welcome email
  // Example:
  // await sendWelcomeEmail({
  //   email: session.customer_email,
  //   subscriptionId,
  // });

  console.log(`Subscription ${subscriptionId} activated for customer ${customerId}`);
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (!customerId) {
    console.error('Missing customer ID in subscription');
    return;
  }

  // TODO: Update user record in database
  // Example:
  // await updateUserSubscription({
  //   userId: subscription.metadata?.userId,
  //   customerId,
  //   subscriptionId: subscription.id,
  //   status: subscription.status,
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  // });

  console.log(`Subscription ${subscription.id} created for customer ${customerId}`);
}

/**
 * Handle subscription updates (e.g., plan changes, status changes)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (!customerId) {
    console.error('Missing customer ID in subscription');
    return;
  }

  // TODO: Update user record in database
  // Example:
  // await updateUserSubscription({
  //   userId: subscription.metadata?.userId,
  //   subscriptionId: subscription.id,
  //   status: subscription.status,
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  //   cancelAtPeriodEnd: subscription.cancel_at_period_end,
  // });

  // Handle subscription status changes
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    console.log(`Subscription ${subscription.id} is now ${subscription.status}`);
    // TODO: Send notification email
    // TODO: Revoke access if needed
  }

  console.log(`Subscription ${subscription.id} updated for customer ${customerId}`);
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (!customerId) {
    console.error('Missing customer ID in subscription');
    return;
  }

  // TODO: Update user record in database
  // Example:
  // await updateUserSubscription({
  //   userId: subscription.metadata?.userId,
  //   subscriptionId: subscription.id,
  //   status: 'canceled',
  //   canceledAt: new Date(),
  // });

  // TODO: Send cancellation confirmation email
  // TODO: Revoke access to premium features

  console.log(`Subscription ${subscription.id} deleted for customer ${customerId}`);
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);

  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id;

  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;

  if (!customerId) {
    console.error('Missing customer ID in invoice');
    return;
  }

  // TODO: Record payment in database
  // Example:
  // await recordPayment({
  //   userId: invoice.metadata?.userId,
  //   invoiceId: invoice.id,
  //   subscriptionId,
  //   amount: invoice.amount_paid,
  //   currency: invoice.currency,
  //   paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
  // });

  // TODO: Send receipt email (if not already sent by Stripe)

  console.log(`Payment of ${invoice.amount_paid / 100} ${invoice.currency} succeeded for customer ${customerId}`);
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);

  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id;

  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;

  if (!customerId) {
    console.error('Missing customer ID in invoice');
    return;
  }

  // TODO: Update user record with payment failure
  // Example:
  // await recordPaymentFailure({
  //   userId: invoice.metadata?.userId,
  //   invoiceId: invoice.id,
  //   subscriptionId,
  //   amount: invoice.amount_due,
  //   attemptCount: invoice.attempt_count,
  // });

  // TODO: Send payment failure notification email
  // TODO: Potentially suspend access after multiple failures

  console.log(`Payment failed for customer ${customerId}, invoice ${invoice.id}`);
}

/**
 * GET /api/stripe/webhooks
 *
 * Returns method not allowed for GET requests
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests from Stripe.' },
    { status: 405 }
  );
}
