import { NextRequest, NextResponse } from 'next/server';
import { stripe, stripeConfig } from '@/lib/stripe';
import Stripe from 'stripe';

/**
 * POST /api/stripe/create-checkout-session
 *
 * Creates a Stripe checkout session for the monthly subscription
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
    const { email, userId, customerName } = body;

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
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email,
        name: customerName,
        metadata: {
          ...(userId && { userId }),
          createdAt: new Date().toISOString(),
        },
      });
    }

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
            unit_amount: stripeConfig.products.subscription.priceAmount,
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
        productType: 'monthly_subscription',
        priceAmount: stripeConfig.products.subscription.priceAmount.toString(),
      },
      subscription_data: {
        metadata: {
          ...(userId && { userId }),
          productType: 'monthly_subscription',
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

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    // Log success (in production, use proper logging service)
    console.log(`Checkout session created: ${session.id} for customer: ${customer.id}`);

    return NextResponse.json(
      {
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: 'Payment processing error',
          message: error.message,
          type: error.type,
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
