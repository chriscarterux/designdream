import Stripe from 'stripe';

/**
 * Request body for creating a checkout session
 */
export interface CreateCheckoutSessionRequest {
  email: string;
  userId?: string;
  customerName?: string;
}

/**
 * Response from creating a checkout session
 */
export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

/**
 * Checkout session details returned to the client
 */
export interface CheckoutSessionDetails {
  customerEmail: string;
  subscriptionId: string;
  amountTotal: number;
  status: string;
}

/**
 * User subscription data stored in database
 */
export interface UserSubscription {
  userId: string;
  customerId: string;
  subscriptionId: string;
  status: Stripe.Subscription.Status;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment record stored in database
 */
export interface PaymentRecord {
  id: string;
  userId: string;
  subscriptionId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  paidAt?: Date;
  createdAt: Date;
}

/**
 * Stripe error response
 */
export interface StripeErrorResponse {
  error: string;
  message?: string;
  type?: string;
}

/**
 * Subscription plan metadata
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceAmount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}
