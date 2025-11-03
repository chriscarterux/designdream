'use client';

import useSWR from 'swr';
import { useState } from 'react';
import type { BillingData, SubscriptionAction } from '@/types/billing.types';

interface UseBillingOptions {
  customerId?: string;
  refreshInterval?: number;
}

interface UseBillingReturn {
  billingData: BillingData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refresh: () => void;
  executeAction: (
    action: SubscriptionAction
  ) => Promise<{ success: boolean; message: string }>;
  isExecutingAction: boolean;
}

const fetcher = async (url: string): Promise<BillingData> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch billing data');
  }

  const data = await response.json();
  return data;
};

/**
 * Hook for managing billing state and actions
 */
export function useBilling(options: UseBillingOptions = {}): UseBillingReturn {
  const { customerId, refreshInterval = 0 } = options;
  const [isExecutingAction, setIsExecutingAction] = useState(false);

  // Use SWR for data fetching with automatic revalidation
  const {
    data: billingData,
    error,
    isLoading,
    mutate,
  } = useSWR<BillingData>(
    customerId ? `/api/billing?customerId=${customerId}` : null,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  /**
   * Execute a subscription action (cancel, pause, resume, etc.)
   */
  const executeAction = async (
    action: SubscriptionAction
  ): Promise<{ success: boolean; message: string }> => {
    setIsExecutingAction(true);

    try {
      const response = await fetch('/api/billing/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          customerId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Revalidate data after successful action
        await mutate();
        return {
          success: true,
          message: result.message || 'Action completed successfully',
        };
      } else {
        return {
          success: false,
          message: result.error || 'Action failed',
        };
      }
    } catch (error) {
      console.error('Error executing action:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    } finally {
      setIsExecutingAction(false);
    }
  };

  /**
   * Manually refresh billing data
   */
  const refresh = () => {
    mutate();
  };

  return {
    billingData: billingData || null,
    isLoading,
    isError: !!error,
    error: error || null,
    refresh,
    executeAction,
    isExecutingAction,
  };
}
