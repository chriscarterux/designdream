import Stripe from 'stripe';

<<<<<<< HEAD
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

=======
/**
 * Validates Stripe secret key format and environment
 * Throws if key is missing or invalid
 */
function validateStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not defined in environment variables. ' +
      'Please set it in your .env.local file.'
    );
  }

  // Validate key format
  const isTestKey = key.startsWith('sk_test_');
  const isLiveKey = key.startsWith('sk_live_');

  if (!isTestKey && !isLiveKey) {
    throw new Error(
      'STRIPE_SECRET_KEY has invalid format. ' +
      'Expected format: sk_test_... or sk_live_...'
    );
  }

  // Warn if using test key in production
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && isTestKey) {
    console.warn(
      '⚠️  WARNING: Using Stripe test key in production environment! ' +
      'This should only be used for staging/testing. ' +
      'Please use a live key (sk_live_...) for production.'
    );
  }

  // Log which mode we're in (without exposing the full key)
  const keyPrefix = key.substring(0, 12);
  console.log(`✓ Stripe initialized in ${isTestKey ? 'TEST' : 'LIVE'} mode (${keyPrefix}...)`);

  return key;
}

// Validate key on module load
const validatedKey = validateStripeKey();

>>>>>>> origin/main
/**
 * Stripe server-side client
 * Used for creating checkout sessions, managing subscriptions, etc.
 */
<<<<<<< HEAD
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
=======
export const stripe = new Stripe(validatedKey, {
  apiVersion: '2023-10-16',
>>>>>>> origin/main
  typescript: true,
  appInfo: {
    name: 'DesignDream',
    version: '0.1.0',
  },
<<<<<<< HEAD
});

/**
=======
  maxNetworkRetries: 3, // Retry failed requests up to 3 times
  timeout: 30000, // 30 second timeout
});

/**
 * Server-side price constants to prevent client manipulation
 * These are the ONLY valid prices - client cannot override
 */
export const SERVER_PRICE_CONSTANTS = {
  MONTHLY_SUBSCRIPTION: 449500, // $4,495.00 in cents
} as const;

/**
>>>>>>> origin/main
 * Stripe configuration
 */
export const stripeConfig = {
  // Product and pricing configuration
  products: {
    subscription: {
      name: 'DesignDream Monthly Subscription',
      description: 'Full access to DesignDream platform with unlimited projects and team collaboration',
<<<<<<< HEAD
      priceAmount: 449500, // $4,495.00 in cents
=======
      priceAmount: SERVER_PRICE_CONSTANTS.MONTHLY_SUBSCRIPTION,
>>>>>>> origin/main
      currency: 'usd',
      interval: 'month' as const,
    },
  },

  // URLs for checkout flow
  urls: {
    success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribe/success`,
    cancel: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribe/cancel`,
<<<<<<< HEAD
    billing: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing`,
=======
>>>>>>> origin/main
  },
} as const;

/**
 * Helper function to format Stripe amount (cents) to USD
 */
<<<<<<< HEAD
export function formatStripeAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
=======
export function formatStripeAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
>>>>>>> origin/main
  }).format(amount / 100);
}

/**
<<<<<<< HEAD
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
=======
 * Validates that an amount matches expected server-side pricing
 * Prevents price manipulation attacks
 */
export function validateAmount(amount: number, expectedPriceKey: keyof typeof SERVER_PRICE_CONSTANTS): boolean {
  const expectedAmount = SERVER_PRICE_CONSTANTS[expectedPriceKey];
  return amount === expectedAmount;
}

/**
 * Enhanced Stripe error types for better error handling
 */
export type StripeErrorType =
  | 'card_error'           // Card declined, insufficient funds, etc.
  | 'invalid_request'      // Invalid API request
  | 'authentication_error' // Authentication with Stripe API failed
  | 'api_connection'       // Network communication failure
  | 'api_error'            // Stripe internal error
  | 'rate_limit'           // Too many requests
  | 'validation_error'     // Client validation error
  | 'idempotency_error'    // Idempotent request conflict
  | 'unknown';             // Unknown error

/**
 * Maps Stripe error to user-friendly message
 */
export function getStripeErrorMessage(error: Stripe.errors.StripeError): {
  userMessage: string;
  type: StripeErrorType;
  shouldRetry: boolean;
} {
  // Card errors (customer-facing issues)
  if (error.type === 'StripeCardError') {
    const code = error.code;
    switch (code) {
      case 'card_declined':
        return {
          userMessage: 'Your card was declined. Please try a different payment method.',
          type: 'card_error',
          shouldRetry: false,
        };
      case 'insufficient_funds':
        return {
          userMessage: 'Your card has insufficient funds. Please use a different payment method.',
          type: 'card_error',
          shouldRetry: false,
        };
      case 'expired_card':
        return {
          userMessage: 'Your card has expired. Please use a different payment method.',
          type: 'card_error',
          shouldRetry: false,
        };
      case 'incorrect_cvc':
        return {
          userMessage: 'The security code (CVC) you entered is incorrect.',
          type: 'card_error',
          shouldRetry: true,
        };
      case 'processing_error':
        return {
          userMessage: 'An error occurred while processing your card. Please try again.',
          type: 'card_error',
          shouldRetry: true,
        };
      default:
        return {
          userMessage: 'Your payment could not be processed. Please try a different card.',
          type: 'card_error',
          shouldRetry: false,
        };
    }
  }

  // Rate limit errors
  if (error.type === 'StripeRateLimitError') {
    return {
      userMessage: 'Too many requests. Please wait a moment and try again.',
      type: 'rate_limit',
      shouldRetry: true,
    };
  }

  // Invalid request errors
  if (error.type === 'StripeInvalidRequestError') {
    return {
      userMessage: 'There was an error with your request. Please try again or contact support.',
      type: 'invalid_request',
      shouldRetry: false,
    };
  }

  // Authentication errors
  if (error.type === 'StripeAuthenticationError') {
    console.error('Stripe authentication failed - check API key configuration');
    return {
      userMessage: 'Payment system configuration error. Please contact support.',
      type: 'authentication_error',
      shouldRetry: false,
    };
  }

  // API connection errors
  if (error.type === 'StripeConnectionError') {
    return {
      userMessage: 'Network error. Please check your connection and try again.',
      type: 'api_connection',
      shouldRetry: true,
    };
  }

  // API errors (Stripe side)
  if (error.type === 'StripeAPIError') {
    return {
      userMessage: 'Payment service error. Please try again in a few moments.',
      type: 'api_error',
      shouldRetry: true,
    };
  }

  // Idempotency errors
  if (error.type === 'StripeIdempotencyError') {
    return {
      userMessage: 'This request conflicts with a previous request. Please refresh and try again.',
      type: 'idempotency_error',
      shouldRetry: false,
    };
  }

  // Unknown error
  return {
    userMessage: 'An unexpected error occurred. Please try again or contact support.',
    type: 'unknown',
    shouldRetry: true,
  };
}

/**
 * Retries a Stripe operation with exponential backoff
 * Used for transient errors (network, rate limits, etc.)
 */
export async function retryStripeOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if error is retryable
      if (error instanceof Stripe.errors.StripeError) {
        const errorInfo = getStripeErrorMessage(error);

        if (!errorInfo.shouldRetry) {
          // Don't retry non-retryable errors
          throw error;
        }

        // Calculate exponential backoff delay
        const delay = initialDelayMs * Math.pow(2, attempt);
        const jitter = Math.random() * 0.3 * delay; // Add 0-30% jitter
        const totalDelay = delay + jitter;

        console.log(
          `Stripe operation failed (attempt ${attempt + 1}/${maxRetries + 1}). ` +
          `Retrying in ${Math.round(totalDelay)}ms... Error: ${error.message}`
        );

        await new Promise(resolve => setTimeout(resolve, totalDelay));
      } else {
        // Non-Stripe errors are not retried
        throw error;
      }
    }
  }

  // All retries exhausted
  throw lastError;
}

/**
 * Generates an idempotency key for Stripe operations
 * Prevents duplicate charges from retries or double-clicks
 */
export function generateIdempotencyKey(
  operation: string,
  userId?: string,
  additionalData?: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const parts = [operation, userId, additionalData, timestamp, random]
    .filter(Boolean)
    .join('-');

  return parts.substring(0, 255); // Stripe limit
>>>>>>> origin/main
}
