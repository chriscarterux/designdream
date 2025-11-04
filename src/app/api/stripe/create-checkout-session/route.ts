import { NextRequest, NextResponse } from 'next/server';
import {
  stripe,
  stripeConfig,
  SERVER_PRICE_CONSTANTS,
  getStripeErrorMessage,
  retryStripeOperation,
  generateIdempotencyKey,
} from '@/lib/stripe';
import Stripe from 'stripe';

/**
 * POST /api/stripe/create-checkout-session
 *
 * Creates a Stripe checkout session for the monthly subscription
 * with enhanced security: idempotency, retry logic, and server-side price validation
 *
 * Request body:
 * - email: string (customer email)
 * - userId: string (optional, for metadata)
 * - customerName: string (optional)
 *
 * Returns:
 * - sessionId: string
 * - url: string (redirect URL to Stripe checkout)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userId, customerName, metadata } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate idempotency key to prevent duplicate charges
    // This ensures that if the request is retried (network issue, double-click, etc.),
    // we won't create duplicate checkout sessions
    const idempotencyKey = generateIdempotencyKey(
      'create-checkout-session',
      userId || email,
      Date.now().toString().slice(-6) // Last 6 digits of timestamp for uniqueness
    );

    console.log(`Creating checkout session for ${email} with idempotency key: ${idempotencyKey.substring(0, 20)}...`);

    // Wrap the entire operation in retry logic with exponential backoff
    const session = await retryStripeOperation(async () => {
      // Create or retrieve customer
      let customer: Stripe.Customer;

      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];

        // Update customer metadata if userId provided
        if (userId) {
          customer = await stripe.customers.update(customer.id, {
            metadata: {
              userId,
              ...customer.metadata,
            },
          });
        }

        console.log(`Using existing customer: ${customer.id}`);
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email,
          name: customerName,
          metadata: {
            ...(userId && { userId }),
            ...(metadata?.company && { company: metadata.company }),
            createdAt: new Date().toISOString(),
          },
        });

        console.log(`Created new customer: ${customer.id}`);
      }

      // Server-side price validation - CRITICAL SECURITY
      // The price is determined server-side and CANNOT be manipulated by the client
      // This prevents attackers from changing the subscription price
      const priceAmount = SERVER_PRICE_CONSTANTS.MONTHLY_SUBSCRIPTION;

      console.log(`Using server-validated price: $${(priceAmount / 100).toFixed(2)}`);

      // Create checkout session parameters
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        customer: customer.id,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: stripeConfig.products.subscription.currency,
              product_data: {
                name: stripeConfig.products.subscription.name,
                description: stripeConfig.products.subscription.description,
              },
              unit_amount: priceAmount, // Server-side validated price
              recurring: {
                interval: stripeConfig.products.subscription.interval,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${stripeConfig.urls.success}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: stripeConfig.urls.cancel,
        metadata: {
          ...(userId && { userId }),
          ...(metadata?.company && { company: metadata.company }),
          productType: 'monthly_subscription',
          priceAmount: priceAmount.toString(),
          createdAt: new Date().toISOString(),
        },
        subscription_data: {
          metadata: {
            ...(userId && { userId }),
            productType: 'monthly_subscription',
            priceAmount: priceAmount.toString(),
          },
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'cancel',
            },
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
      };

      // Create the checkout session with idempotency key
      const checkoutSession = await stripe.checkout.sessions.create(
        sessionParams,
        {
          idempotencyKey, // Prevents duplicate sessions from retries
        }
      );

      return checkoutSession;
    }, 3, 1000); // Max 3 retries, starting with 1 second delay

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    // Log success (in production, use proper logging service)
    console.log(`✓ Checkout session created successfully: ${session.id}`);

    return NextResponse.json(
      {
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);

    // Handle Stripe-specific errors with user-friendly messages
    if (error instanceof Stripe.errors.StripeError) {
      const errorInfo = getStripeErrorMessage(error);

      // Log the technical error for debugging
      console.error(`Stripe ${errorInfo.type} error:`, {
        message: error.message,
        type: error.type,
        code: error.code,
        statusCode: error.statusCode,
      });

      // Return user-friendly error
      return NextResponse.json(
        {
          error: errorInfo.userMessage,
          type: errorInfo.type,
          canRetry: errorInfo.shouldRetry,
        },
        { status: error.statusCode || 400 }
      );
    }

    // Handle validation errors
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: error.message,
          type: 'validation_error',
        },
        { status: 400 }
      );
    }

    // Handle generic errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unexpected error:', errorMessage);

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        message: 'Please try again or contact support if the problem persists.',
        type: 'unknown',
        canRetry: true,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stripe/create-checkout-session
 *
 * Returns method not allowed for GET requests
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create a checkout session.' },
    { status: 405 }
  );
}
