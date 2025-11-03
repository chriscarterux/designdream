import Stripe from 'stripe';
import { supabaseAdmin } from './supabase-server';
import {
  EventHandlerResult,
  SubscriptionUpdate,
  PaymentEventData,
  SubscriptionStatus,
} from '@/types/stripe.types';

/**
 * Log webhook event to database for debugging and audit trail
 */
async function logWebhookEvent(
  eventId: string,
  eventType: string,
  payload: any,
  processed: boolean,
  errorMessage?: string
): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('webhook_events').insert({
      stripe_event_id: eventId,
      event_type: eventType,
      payload,
      processed,
      error_message: errorMessage || null,
    });

    if (error) {
      console.error('Failed to log webhook event:', error);
    }
  } catch (err) {
    console.error('Error logging webhook event:', err);
  }
}

/**
 * Get client ID by Stripe customer ID
 */
async function getClientByCustomerId(
  customerId: string
): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !data) {
    console.error('Failed to find client by customer ID:', error);
    return null;
  }

  return data.id;
}

/**
 * Handle subscription.created event
 * Creates a new subscription record and activates the client
 */
export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<EventHandlerResult> {
  try {
    console.log('Processing subscription.created:', subscription.id);

    const clientId = await getClientByCustomerId(subscription.customer as string);
    if (!clientId) {
      throw new Error(
        `Client not found for customer ID: ${subscription.customer}`
      );
    }

    // Prepare subscription data
    const subscriptionData = {
      client_id: clientId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      stripe_price_id: subscription.items.data[0]?.price.id || 'unknown',
      plan_type: subscription.metadata.plan_type || 'core',
      plan_amount: subscription.items.data[0]?.price.unit_amount || 0,
      plan_interval: subscription.items.data[0]?.price.recurring?.interval || 'month',
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancelled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
    };

    // Insert subscription record
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .insert(subscriptionData);

    if (subscriptionError) {
      throw new Error(`Failed to create subscription: ${subscriptionError.message}`);
    }

    // Update client status to active
    const { error: clientError } = await supabaseAdmin
      .from('clients')
      .update({
        subscription_status: subscription.status,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', clientId);

    if (clientError) {
      throw new Error(`Failed to update client status: ${clientError.message}`);
    }

    console.log(`Subscription created successfully for client ${clientId}`);

    return {
      success: true,
      message: 'Subscription created successfully',
    };
  } catch (error) {
    console.error('Error handling subscription.created:', error);
    return {
      success: false,
      message: 'Failed to create subscription',
      error: error as Error,
    };
  }
}

/**
 * Handle subscription.updated event
 * Updates subscription details and client status
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<EventHandlerResult> {
  try {
    console.log('Processing subscription.updated:', subscription.id);

    const subscriptionData = {
      stripe_customer_id: subscription.customer as string,
      stripe_price_id: subscription.items.data[0]?.price.id || 'unknown',
      plan_amount: subscription.items.data[0]?.price.unit_amount || 0,
      plan_interval: subscription.items.data[0]?.price.recurring?.interval || 'month',
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancelled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    // Update subscription record
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .update(subscriptionData)
      .eq('stripe_subscription_id', subscription.id);

    if (subscriptionError) {
      throw new Error(`Failed to update subscription: ${subscriptionError.message}`);
    }

    // Update client subscription status
    const clientId = await getClientByCustomerId(subscription.customer as string);
    if (clientId) {
      const { error: clientError } = await supabaseAdmin
        .from('clients')
        .update({
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clientId);

      if (clientError) {
        console.error('Failed to update client status:', clientError);
      }
    }

    console.log(`Subscription updated successfully: ${subscription.id}`);

    return {
      success: true,
      message: 'Subscription updated successfully',
    };
  } catch (error) {
    console.error('Error handling subscription.updated:', error);
    return {
      success: false,
      message: 'Failed to update subscription',
      error: error as Error,
    };
  }
}

/**
 * Handle subscription.deleted event
 * Marks subscription as canceled and updates client status
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<EventHandlerResult> {
  try {
    console.log('Processing subscription.deleted:', subscription.id);

    // Update subscription status to canceled
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (subscriptionError) {
      throw new Error(`Failed to update subscription: ${subscriptionError.message}`);
    }

    // Update client status to canceled
    const clientId = await getClientByCustomerId(subscription.customer as string);
    if (clientId) {
      const { error: clientError } = await supabaseAdmin
        .from('clients')
        .update({
          subscription_status: 'cancelled',
          status: 'churned',
          updated_at: new Date().toISOString(),
        })
        .eq('id', clientId);

      if (clientError) {
        console.error('Failed to update client status:', clientError);
      }
    }

    console.log(`Subscription canceled successfully: ${subscription.id}`);

    return {
      success: true,
      message: 'Subscription canceled successfully',
    };
  } catch (error) {
    console.error('Error handling subscription.deleted:', error);
    return {
      success: false,
      message: 'Failed to cancel subscription',
      error: error as Error,
    };
  }
}

/**
 * Handle invoice.payment_succeeded event
 * Logs successful payment
 */
export async function handlePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<EventHandlerResult> {
  try {
    console.log('Processing invoice.payment_succeeded:', invoice.id);

    const paymentData = {
      invoice_id: invoice.id,
      subscription_id: invoice.subscription as string,
      customer_id: invoice.customer as string,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      payment_intent_id: invoice.payment_intent as string,
      created_at: new Date().toISOString(),
    };

    // Log payment event
    const { error } = await supabaseAdmin.from('payment_events').insert(paymentData);

    if (error) {
      throw new Error(`Failed to log payment: ${error.message}`);
    }

    // If subscription exists, ensure it's active
    if (invoice.subscription) {
      const { error: subscriptionError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', invoice.subscription as string);

      if (subscriptionError) {
        console.error('Failed to update subscription status:', subscriptionError);
      }

      // Update client status
      const clientId = await getClientByCustomerId(invoice.customer as string);
      if (clientId) {
        const { error: clientError } = await supabaseAdmin
          .from('clients')
          .update({
            subscription_status: 'active',
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', clientId);

        if (clientError) {
          console.error('Failed to update client status:', clientError);
        }
      }
    }

    console.log(`Payment succeeded for invoice: ${invoice.id}`);

    return {
      success: true,
      message: 'Payment logged successfully',
    };
  } catch (error) {
    console.error('Error handling invoice.payment_succeeded:', error);
    return {
      success: false,
      message: 'Failed to log payment',
      error: error as Error,
    };
  }
}

/**
 * Handle invoice.payment_failed event
 * Logs failed payment and updates subscription status
 */
export async function handlePaymentFailed(
  invoice: Stripe.Invoice
): Promise<EventHandlerResult> {
  try {
    console.log('Processing invoice.payment_failed:', invoice.id);

    const paymentData = {
      invoice_id: invoice.id,
      subscription_id: invoice.subscription as string,
      customer_id: invoice.customer as string,
      amount_paid: 0,
      currency: invoice.currency,
      status: 'failed',
      payment_intent_id: invoice.payment_intent as string,
      error_message: 'Payment failed',
      created_at: new Date().toISOString(),
    };

    // Log payment failure
    const { error } = await supabaseAdmin.from('payment_events').insert(paymentData);

    if (error) {
      throw new Error(`Failed to log payment failure: ${error.message}`);
    }

    // Update subscription status to past_due if subscription exists
    if (invoice.subscription) {
      const { error: subscriptionError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', invoice.subscription as string);

      if (subscriptionError) {
        console.error('Failed to update subscription status:', subscriptionError);
      }

      // Update client status
      const clientId = await getClientByCustomerId(invoice.customer as string);
      if (clientId) {
        const { error: clientError } = await supabaseAdmin
          .from('clients')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('id', clientId);

        if (clientError) {
          console.error('Failed to update client status:', clientError);
        }
      }
    }

    console.log(`Payment failed for invoice: ${invoice.id}`);

    return {
      success: true,
      message: 'Payment failure logged successfully',
    };
  } catch (error) {
    console.error('Error handling invoice.payment_failed:', error);
    return {
      success: false,
      message: 'Failed to log payment failure',
      error: error as Error,
    };
  }
}

/**
 * Route webhook event to appropriate handler
 */
export async function handleWebhookEvent(
  event: Stripe.Event
): Promise<EventHandlerResult> {
  let result: EventHandlerResult;

  switch (event.type) {
    case 'customer.subscription.created':
      result = await handleSubscriptionCreated(
        event.data.object as Stripe.Subscription
      );
      break;

    case 'customer.subscription.updated':
      result = await handleSubscriptionUpdated(
        event.data.object as Stripe.Subscription
      );
      break;

    case 'customer.subscription.deleted':
      result = await handleSubscriptionDeleted(
        event.data.object as Stripe.Subscription
      );
      break;

    case 'invoice.payment_succeeded':
      result = await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      result = await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
      result = {
        success: true,
        message: `Event type ${event.type} not handled`,
      };
  }

  // Log the event processing result
  await logWebhookEvent(
    event.id,
    event.type,
    event.data.object,
    result.success,
    result.error?.message
  );

  return result;
}
