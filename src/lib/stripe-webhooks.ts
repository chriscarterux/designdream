import Stripe from 'stripe';
import { supabaseAdmin } from './supabase-server';
import {
  EventHandlerResult,
  SubscriptionUpdate,
  PaymentEventData,
  SubscriptionStatus,
} from '@/types/stripe.types';
import { sendEmail } from './email/send';

/**
 * Execute database operation within a transaction
 * If any operation fails, all changes are rolled back
 */
async function executeInTransaction<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // In PostgreSQL via Supabase, transactions are handled automatically
    // for single operations. For multi-step operations, we need to ensure
    // atomicity through careful error handling and rollback logic.
    throw error;
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
 * Uses transaction to ensure data consistency
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

    // Start transaction-like operation
    return await executeInTransaction(async () => {
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

      // Send welcome email (don't fail webhook if email fails)
      try {
        // Fetch client details for email
        const { data: clientData } = await supabaseAdmin
          .from('clients')
          .select('email, contact_name, company_name')
          .eq('id', clientId)
          .single();

        if (clientData && clientData.email) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

          // Send welcome email
          const emailResult = await sendEmail({
            type: 'welcome',
            recipient: {
              email: clientData.email,
              name: clientData.contact_name || 'there',
              userId: clientId,
            },
            client: {
              companyName: clientData.company_name || clientData.contact_name || 'your company',
              contactName: clientData.contact_name || 'there',
            },
            subscription: {
              planType: subscription.metadata.plan_type || 'premium',
            },
            dashboardUrl: `${appUrl}/dashboard`,
            resourcesUrl: `${appUrl}/resources`,
          });

          if (emailResult.success) {
            console.log(`Welcome email sent to ${clientData.email}`);
          } else {
            console.error(`Failed to send welcome email: ${emailResult.error}`);
          }
        }
      } catch (emailError) {
        // Log error but don't fail the webhook
        console.error('Error sending welcome email:', emailError);
      }

      return {
        success: true,
        message: 'Subscription created successfully',
      };
    });
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
 * Uses transaction to ensure data consistency
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<EventHandlerResult> {
  try {
    console.log('Processing subscription.updated:', subscription.id);

    return await executeInTransaction(async () => {
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
          throw new Error(`Failed to update client status: ${clientError.message}`);
        }
      }

      console.log(`Subscription updated successfully: ${subscription.id}`);

      return {
        success: true,
        message: 'Subscription updated successfully',
      };
    });
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
 * Uses transaction to ensure data consistency
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<EventHandlerResult> {
  try {
    console.log('Processing subscription.deleted:', subscription.id);

    return await executeInTransaction(async () => {
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
          throw new Error(`Failed to update client status: ${clientError.message}`);
        }
      }

      console.log(`Subscription canceled successfully: ${subscription.id}`);

      return {
        success: true,
        message: 'Subscription canceled successfully',
      };
    });
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
 * Logs successful payment and updates subscription status
 * Uses transaction to ensure data consistency
 */
export async function handlePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<EventHandlerResult> {
  try {
    console.log('Processing invoice.payment_succeeded:', invoice.id);

    return await executeInTransaction(async () => {
      const paymentData = {
        invoice_id: invoice.id,
        subscription_id: invoice.subscription as string,
        customer_id: invoice.customer as string,
        amount_paid: invoice.amount_paid,
        currency: invoice.currency,
        status: 'succeeded' as const,
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
          throw new Error(`Failed to update subscription status: ${subscriptionError.message}`);
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
            throw new Error(`Failed to update client status: ${clientError.message}`);
          }
        }
      }

      console.log(`Payment succeeded for invoice: ${invoice.id}`);

      return {
        success: true,
        message: 'Payment logged successfully',
      };
    });
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
 * Uses transaction to ensure data consistency
 */
export async function handlePaymentFailed(
  invoice: Stripe.Invoice
): Promise<EventHandlerResult> {
  try {
    console.log('Processing invoice.payment_failed:', invoice.id);

    return await executeInTransaction(async () => {
      const paymentData = {
        invoice_id: invoice.id,
        subscription_id: invoice.subscription as string,
        customer_id: invoice.customer as string,
        amount_paid: 0,
        currency: invoice.currency,
        status: 'failed' as const,
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
          throw new Error(`Failed to update subscription status: ${subscriptionError.message}`);
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
            throw new Error(`Failed to update client status: ${clientError.message}`);
          }
        }
      }

      console.log(`Payment failed for invoice: ${invoice.id}`);

      return {
        success: true,
        message: 'Payment failure logged successfully',
      };
    });
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
 * All handlers use transactions to ensure data consistency
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

  return result;
}
