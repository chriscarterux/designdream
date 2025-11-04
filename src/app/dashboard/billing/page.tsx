'use client';

import { useRouter } from 'next/navigation';
import { CreditCard, Loader2 } from 'lucide-react';
import { CurrentPlan } from '@/components/billing/current-plan';
import { PaymentMethod } from '@/components/billing/payment-method';
import { InvoiceTable } from '@/components/billing/invoice-table';
import { SubscriptionActions } from '@/components/billing/subscription-actions';
import { UsageStatsComponent } from '@/components/billing/usage-stats';
import { useBilling } from '@/hooks/use-billing';
import { toast } from 'sonner';

export default function BillingPage() {
  const router = useRouter();

  // In a real app, you would get the customerId from the authenticated user
  // For now, we'll use a mock customerId or get it from the session
  const customerId = 'cus_mock123'; // This should come from auth context/session

  const { billingData, isLoading, isError, executeAction } = useBilling({
    customerId,
    refreshInterval: 60000, // Refresh every minute
  });

  const handleUpdatePaymentMethod = async () => {
    try {
      const response = await fetch('/api/billing/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        toast.error('Failed to open customer portal');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open customer portal');
    }
  };

  const handleSubscriptionAction = async (action: string) => {
    const result = await executeAction(action as any);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    return result;
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading billing information...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !billingData) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">
            No Active Subscription
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have an active subscription yet.
          </p>
          <button
            onClick={() => router.push('/subscribe')}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and view invoices
        </p>
      </div>

      {/* Current Plan */}
      <CurrentPlan subscription={billingData.subscription} />

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Payment Method */}
        <PaymentMethod
          paymentMethod={billingData.paymentMethod}
          onUpdatePaymentMethod={handleUpdatePaymentMethod}
        />

        {/* Usage Stats */}
        <UsageStatsComponent usage={billingData.usage} />
      </div>

      {/* Subscription Actions */}
      <SubscriptionActions
        subscription={billingData.subscription}
        onAction={handleSubscriptionAction}
        onOpenCustomerPortal={handleUpdatePaymentMethod}
      />

      {/* Invoice History */}
      <InvoiceTable invoices={billingData.invoices} />
    </div>
  );
}
