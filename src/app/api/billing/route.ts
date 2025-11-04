import { NextRequest, NextResponse } from 'next/server';
import { getBillingData } from '@/lib/stripe-billing';

/**
 * GET /api/billing
 * Fetch billing data for a customer
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // In a production app, you should verify that the authenticated user
    // has permission to access this customer's billing data
    // Example: const session = await getServerSession();
    // if (session.user.stripeCustomerId !== customerId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    const billingData = await getBillingData(customerId);

    if (!billingData) {
      return NextResponse.json(
        { error: 'No billing data found' },
        { status: 404 }
      );
    }

    return NextResponse.json(billingData);
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
