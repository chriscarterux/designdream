import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

/**
 * Stripe server-side client
 * Used for creating checkout sessions, managing subscriptions, etc.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
  appInfo: {
    name: 'DesignDream',
    version: '0.1.0',
  },
});

/**
 * Stripe configuration
 */
export const stripeConfig = {
  // Product and pricing configuration
  products: {
    subscription: {
      name: 'DesignDream Monthly Subscription',
      description: 'Full access to DesignDream platform with unlimited projects and team collaboration',
      priceAmount: 449500, // $4,495.00 in cents
      currency: 'usd',
      interval: 'month' as const,
    },
  },

  // URLs for checkout flow
  urls: {
    success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribe/success`,
    cancel: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribe/cancel`,
    billing: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing`,
  },
} as const;

/**
 * Helper function to format Stripe amount (cents) to USD
 */
export function formatStripeAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

/**
 * Helper function to format date
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Helper function to format short date
 */
export function formatShortDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}
