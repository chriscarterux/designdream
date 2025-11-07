import { stripe, formatStripeAmount } from './stripe';
import type {
  BillingData,
  SubscriptionInfo,
  PaymentMethodInfo,
  Invoice,
  SubscriptionStatusDisplay,
  SubscriptionStatus,
  CustomerPortalSession,
} from '@/types/billing.types';
import Stripe from 'stripe';

/**
 * Fetch complete billing data for a customer
 */
export async function getBillingData(
  customerId: string
): Promise<BillingData | null> {
  try {
    // Fetch subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
    });

    if (!subscriptions.data.length) {
      return null;
    }

    const subscription = subscriptions.data[0];

    // Fetch payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
      limit: 1,
    });

    // Fetch invoices
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 12,
    });

    return {
      subscription: formatSubscriptionInfo(subscription),
      paymentMethod: paymentMethods.data.length
        ? formatPaymentMethodInfo(paymentMethods.data[0])
        : null,
      invoices: invoices.data.map(formatInvoice),
      usage: {
        requestsThisMonth: 0, // This would come from your database
        requestsAllTime: 0, // This would come from your database
        averageTurnaroundHours: 0, // This would come from your database
        totalValueDelivered: 0, // This would come from your database
        currentMonthStart: new Date(subscription.current_period_start * 1000),
        currentMonthEnd: new Date(subscription.current_period_end * 1000),
      },
    };
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return null;
  }
}

/**
 * Format Stripe subscription to our SubscriptionInfo type
 */
function formatSubscriptionInfo(
  subscription: Stripe.Subscription
): SubscriptionInfo {
  const price = subscription.items.data[0]?.price;

  const product = price?.product;
  let planName = 'DesignDream Monthly';

  if (product && typeof product !== 'string' && 'name' in product) {
    planName = product.name || 'DesignDream Monthly';
  }

  return {
    id: subscription.id,
    customerId:
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id,
    status: subscription.status as SubscriptionStatus,
    planName,
    planPrice: price?.unit_amount || 449500,
    currency: price?.currency || 'usd',
    interval: (price?.recurring?.interval as 'month' | 'year') || 'month',
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
    createdAt: new Date(subscription.created * 1000),
  };
}

/**
 * Format Stripe payment method to our PaymentMethodInfo type
 */
function formatPaymentMethodInfo(
  paymentMethod: Stripe.PaymentMethod
): PaymentMethodInfo {
  return {
    id: paymentMethod.id,
    type: paymentMethod.type as 'card' | 'us_bank_account' | 'other',
    card: paymentMethod.card
      ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year,
        }
      : undefined,
    bankAccount: paymentMethod.us_bank_account
      ? {
          bankName: paymentMethod.us_bank_account.bank_name || 'Unknown',
          last4: paymentMethod.us_bank_account.last4 || '',
        }
      : undefined,
  };
}

/**
 * Format Stripe invoice to our Invoice type
 */
function formatInvoice(invoice: Stripe.Invoice): Invoice {
  return {
    id: invoice.id,
    number: invoice.number,
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency,
    status: invoice.status as Invoice['status'],
    created: new Date(invoice.created * 1000),
    dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
    pdfUrl: invoice.invoice_pdf || null,
    hostedInvoiceUrl: invoice.hosted_invoice_url || null,
    periodStart: new Date(invoice.period_start * 1000),
    periodEnd: new Date(invoice.period_end * 1000),
  };
}

/**
 * Create a Stripe Customer Portal session
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl?: string
): Promise<CustomerPortalSession> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url:
      returnUrl ||
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing`,
  });

  return {
    url: session.url,
  };
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<boolean> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
}

/**
 * Resume a subscription that was set to cancel
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<boolean> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return true;
  } catch (error) {
    console.error('Error resuming subscription:', error);
    return false;
  }
}

/**
 * Pause a subscription
 */
export async function pauseSubscription(
  subscriptionId: string
): Promise<boolean> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: 'mark_uncollectible',
      },
    });
    return true;
  } catch (error) {
    console.error('Error pausing subscription:', error);
    return false;
  }
}

/**
 * Resume a paused subscription
 */
export async function unpauseSubscription(
  subscriptionId: string
): Promise<boolean> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null,
    });
    return true;
  } catch (error) {
    console.error('Error unpausing subscription:', error);
    return false;
  }
}

/**
 * Get status display information
 */
export function getSubscriptionStatusDisplay(
  status: SubscriptionStatus,
  cancelAtPeriodEnd: boolean
): SubscriptionStatusDisplay {
  if (cancelAtPeriodEnd) {
    return {
      label: 'Canceling',
      variant: 'warning',
      description: 'Your subscription will end at the current period',
    };
  }

  switch (status) {
    case 'active':
      return {
        label: 'Active',
        variant: 'success',
        description: 'Your subscription is active and in good standing',
      };
    case 'trialing':
      return {
        label: 'Trial',
        variant: 'default',
        description: 'Your trial period is active',
      };
    case 'past_due':
      return {
        label: 'Past Due',
        variant: 'warning',
        description: 'Payment is past due. Please update your payment method',
      };
    case 'canceled':
      return {
        label: 'Canceled',
        variant: 'destructive',
        description: 'Your subscription has been canceled',
      };
    case 'unpaid':
      return {
        label: 'Unpaid',
        variant: 'destructive',
        description: 'Payment failed. Please update your payment method',
      };
    case 'paused':
      return {
        label: 'Paused',
        variant: 'secondary',
        description: 'Your subscription is paused',
      };
    case 'incomplete':
      return {
        label: 'Incomplete',
        variant: 'warning',
        description: 'Subscription setup is incomplete',
      };
    case 'incomplete_expired':
      return {
        label: 'Expired',
        variant: 'destructive',
        description: 'Subscription setup expired',
      };
    default:
      return {
        label: status,
        variant: 'default',
        description: '',
      };
  }
}

/**
 * Format card brand for display
 */
export function formatCardBrand(brand: string): string {
  const brands: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    diners: 'Diners Club',
    jcb: 'JCB',
    unionpay: 'UnionPay',
  };

  return brands[brand.toLowerCase()] || brand;
}
