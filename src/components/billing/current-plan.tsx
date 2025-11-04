'use client';

import { Calendar, CreditCard, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionInfo } from '@/types/billing.types';
import { formatStripeAmount, formatDate } from '@/lib/stripe';
import { getSubscriptionStatusDisplay } from '@/lib/stripe-billing';

interface CurrentPlanProps {
  subscription: SubscriptionInfo;
}

export function CurrentPlan({ subscription }: CurrentPlanProps) {
  const statusDisplay = getSubscriptionStatusDisplay(
    subscription.status,
    subscription.cancelAtPeriodEnd
  );

  const daysUntilRenewal = Math.ceil(
    (subscription.currentPeriodEnd.getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </div>
          <Badge variant={statusDisplay.variant}>{statusDisplay.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Info */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{subscription.planName}</h3>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {formatStripeAmount(subscription.planPrice)}
              </p>
              <p className="text-sm text-muted-foreground">
                per {subscription.interval}
              </p>
            </div>
          </div>
          {statusDisplay.description && (
            <p className="text-sm text-muted-foreground">
              {statusDisplay.description}
            </p>
          )}
        </div>

        {/* Billing Cycle */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start space-x-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Current Billing Period</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(subscription.currentPeriodStart)}
              </p>
              <p className="text-sm text-muted-foreground">
                to {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">
                {subscription.cancelAtPeriodEnd ? 'Ends In' : 'Renews In'}
              </p>
              <p className="text-2xl font-bold">
                {daysUntilRenewal} day{daysUntilRenewal !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                {subscription.cancelAtPeriodEnd
                  ? 'Subscription will not renew'
                  : 'Auto-renewal enabled'}
              </p>
            </div>
          </div>
        </div>

        {/* Trial Info */}
        {subscription.trialEnd && subscription.trialEnd > new Date() && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Trial Period Active</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your trial ends on {formatDate(subscription.trialEnd)}
            </p>
          </div>
        )}

        {/* Cancelation Warning */}
        {subscription.cancelAtPeriodEnd && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">
              Subscription Ending
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your subscription will end on{' '}
              {formatDate(subscription.currentPeriodEnd)}. You will lose access
              to all features after this date.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
