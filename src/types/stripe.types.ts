import Stripe from 'stripe';

// Subscription status types
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

// Database subscription model
export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: SubscriptionStatus;
  plan_id: string;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Webhook event log
export interface WebhookEvent {
  id: string;
  stripe_event_id: string;
  event_type: string;
  payload: Record<string, any>;
  processed: boolean;
  error_message: string | null;
  created_at: Date;
}

// Stripe event types we handle
export type StripeWebhookEvent =
  | Stripe.CustomerSubscriptionCreatedEvent
  | Stripe.CustomerSubscriptionUpdatedEvent
  | Stripe.CustomerSubscriptionDeletedEvent
  | Stripe.InvoicePaymentSucceededEvent
  | Stripe.InvoicePaymentFailedEvent;

// Event handler result
export interface EventHandlerResult {
  success: boolean;
  message: string;
  error?: Error;
}

// Subscription data for updates
export interface SubscriptionUpdate {
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: SubscriptionStatus;
  plan_id: string;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at: Date | null;
}

// Payment event data
export interface PaymentEventData {
  invoice_id: string;
  subscription_id: string;
  customer_id: string;
  amount_paid: number;
  currency: string;
  status: 'succeeded' | 'failed';
  payment_intent_id?: string;
  error_message?: string;
}
