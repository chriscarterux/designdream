import { NextRequest, NextResponse } from 'next/server';
import {
  cancelSubscriptionAtPeriodEnd,
  resumeSubscription,
  pauseSubscription,
  unpauseSubscription,
  getBillingData,
} from '@/lib/stripe-billing';
import type { SubscriptionAction } from '@/types/billing.types';

/**
 * POST /api/billing/actions
 * Execute subscription actions (cancel, pause, resume, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, customerId } = body as {
      action: SubscriptionAction;
      customerId: string;
    };

    if (!action || !customerId) {
      return NextResponse.json(
        { error: 'Action and customer ID are required' },
        { status: 400 }
      );
    }

    // In a production app, you should verify that the authenticated user
    // has permission to perform actions on this customer's subscription
    // Example: const session = await getServerSession();
    // if (session.user.stripeCustomerId !== customerId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    // Get the customer's billing data to find the subscription ID
    const billingData = await getBillingData(customerId);

    if (!billingData) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    const subscriptionId = billingData.subscription.id;
    let success = false;
    let message = '';

    // Execute the requested action
    switch (action) {
      case 'cancel':
        success = await cancelSubscriptionAtPeriodEnd(subscriptionId);
        message = success
          ? 'Your subscription will be canceled at the end of the current billing period'
          : 'Failed to cancel subscription';
        break;

      case 'resume':
        // Check if subscription is paused or set to cancel
        if (billingData.subscription.status === 'paused') {
          success = await unpauseSubscription(subscriptionId);
          message = success
            ? 'Your subscription has been resumed'
            : 'Failed to resume subscription';
        } else if (billingData.subscription.cancelAtPeriodEnd) {
          success = await resumeSubscription(subscriptionId);
          message = success
            ? 'Your subscription will continue and auto-renew'
            : 'Failed to resume subscription';
        } else {
          return NextResponse.json(
            { error: 'Subscription is not paused or set to cancel' },
            { status: 400 }
          );
        }
        break;

      case 'pause':
        success = await pauseSubscription(subscriptionId);
        message = success
          ? 'Your subscription has been paused'
          : 'Failed to pause subscription';
        break;

      case 'update_payment':
        return NextResponse.json(
          {
            error:
              'Use the customer portal endpoint to update payment methods',
          },
          { status: 400 }
        );

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (success) {
      return NextResponse.json({
        success: true,
        message,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error executing subscription action:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
