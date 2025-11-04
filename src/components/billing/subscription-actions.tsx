'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Pause,
  Play,
  RotateCcw,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SubscriptionInfo, SubscriptionAction } from '@/types/billing.types';

interface SubscriptionActionsProps {
  subscription: SubscriptionInfo;
  onAction: (
    action: SubscriptionAction
  ) => Promise<{ success: boolean; message: string }>;
  onOpenCustomerPortal: () => void;
  isLoading?: boolean;
}

export function SubscriptionActions({
  subscription,
  onAction,
  onOpenCustomerPortal,
  isLoading = false,
}: SubscriptionActionsProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: SubscriptionAction | null;
    title: string;
    description: string;
    confirmLabel: string;
    variant: 'default' | 'destructive';
  }>({
    open: false,
    action: null,
    title: '',
    description: '',
    confirmLabel: '',
    variant: 'default',
  });

  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = async () => {
    if (!confirmDialog.action) return;

    setActionLoading(true);
    try {
      await onAction(confirmDialog.action);
    } finally {
      setActionLoading(false);
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const openConfirmDialog = (
    action: SubscriptionAction,
    title: string,
    description: string,
    confirmLabel: string,
    variant: 'default' | 'destructive' = 'default'
  ) => {
    setConfirmDialog({
      open: true,
      action,
      title,
      description,
      confirmLabel,
      variant,
    });
  };

  const canCancel =
    subscription.status === 'active' && !subscription.cancelAtPeriodEnd;
  const canResume = subscription.cancelAtPeriodEnd;
  const canPause = subscription.status === 'active' && !subscription.cancelAtPeriodEnd;
  const isPaused = subscription.status === 'paused';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            Manage your subscription settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Update Payment Method */}
          <div className="flex items-start justify-between rounded-lg border p-4">
            <div className="flex-1">
              <p className="font-medium">Update Payment Method</p>
              <p className="text-sm text-muted-foreground">
                Change your credit card or payment information
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCustomerPortal}
              disabled={isLoading}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Update
            </Button>
          </div>

          {/* Resume Subscription */}
          {canResume && (
            <div className="flex items-start justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  <p className="font-medium">Resume Subscription</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Continue your subscription past the current period
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() =>
                  openConfirmDialog(
                    'resume',
                    'Resume Subscription',
                    'Your subscription will continue and auto-renew at the end of the current billing period.',
                    'Resume Subscription'
                  )
                }
                disabled={isLoading}
              >
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
            </div>
          )}

          {/* Unpause Subscription */}
          {isPaused && (
            <div className="flex items-start justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-primary" />
                  <p className="font-medium">Resume Subscription</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reactivate your paused subscription
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() =>
                  openConfirmDialog(
                    'resume',
                    'Resume Subscription',
                    'Your subscription will be reactivated and billing will resume.',
                    'Resume Subscription'
                  )
                }
                disabled={isLoading}
              >
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
            </div>
          )}

          {/* Pause Subscription */}
          {canPause && (
            <div className="flex items-start justify-between rounded-lg border p-4">
              <div className="flex-1">
                <p className="font-medium">Pause Subscription</p>
                <p className="text-sm text-muted-foreground">
                  Temporarily pause your subscription and billing
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openConfirmDialog(
                    'pause',
                    'Pause Subscription',
                    'Your subscription will be paused and you will not be charged. You can resume at any time.',
                    'Pause Subscription'
                  )
                }
                disabled={isLoading}
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            </div>
          )}

          {/* Cancel Subscription */}
          {canCancel && (
            <div className="flex items-start justify-between rounded-lg border border-destructive/20 p-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <p className="font-medium">Cancel Subscription</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cancel your subscription at the end of the current billing
                  period
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  openConfirmDialog(
                    'cancel',
                    'Cancel Subscription',
                    'Your subscription will be canceled at the end of the current billing period. You will retain access until then.',
                    'Cancel Subscription',
                    'destructive'
                  )
                }
                disabled={isLoading}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.variant}
              onClick={handleAction}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : confirmDialog.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
