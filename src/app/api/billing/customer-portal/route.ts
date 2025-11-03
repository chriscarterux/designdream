import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe-billing';

/**
 * POST /api/billing/customer-portal
 * Create a Stripe Customer Portal session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, returnUrl } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // In a production app, you should verify that the authenticated user
    // has permission to access this customer's portal
    // Example: const session = await getServerSession();
    // if (session.user.stripeCustomerId !== customerId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    const portalSession = await createCustomerPortalSession(
      customerId,
      returnUrl
    );

    return NextResponse.json(portalSession);
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
