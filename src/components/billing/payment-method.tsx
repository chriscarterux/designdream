'use client';

import { CreditCard, Building2, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PaymentMethodInfo } from '@/types/billing.types';
import { formatCardBrand } from '@/lib/stripe-billing';

interface PaymentMethodProps {
  paymentMethod: PaymentMethodInfo | null;
  onUpdatePaymentMethod: () => void;
  isLoading?: boolean;
}

export function PaymentMethod({
  paymentMethod,
  onUpdatePaymentMethod,
  isLoading = false,
}: PaymentMethodProps) {
  const renderPaymentMethodDetails = () => {
    if (!paymentMethod) {
      return (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium">No payment method on file</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a payment method to keep your subscription active
          </p>
        </div>
      );
    }

    if (paymentMethod.type === 'card' && paymentMethod.card) {
      const { brand, last4, expMonth, expYear } = paymentMethod.card;
      return (
        <div className="flex items-start space-x-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">
              {formatCardBrand(brand)} ending in {last4}
            </p>
            <p className="text-sm text-muted-foreground">
              Expires {expMonth.toString().padStart(2, '0')}/{expYear}
            </p>
          </div>
        </div>
      );
    }

    if (
      paymentMethod.type === 'us_bank_account' &&
      paymentMethod.bankAccount
    ) {
      const { bankName, last4 } = paymentMethod.bankAccount;
      return (
        <div className="flex items-start space-x-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">
              {bankName} ending in {last4}
            </p>
            <p className="text-sm text-muted-foreground">Bank Account</p>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Payment method type: {paymentMethod.type}
        </p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment information</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdatePaymentMethod}
            disabled={isLoading}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {paymentMethod ? 'Update' : 'Add Payment Method'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>{renderPaymentMethodDetails()}</CardContent>
    </Card>
  );
}
