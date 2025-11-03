/**
 * useSLA Hook
 *
 * React hook for managing SLA status and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { SLAStatusResponse } from '@/types/sla.types';

interface UseSLAOptions {
  requestId: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseSLAReturn {
  slaStatus: SLAStatusResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  pauseSLA: (reason?: string) => Promise<void>;
  resumeSLA: () => Promise<void>;
}

export function useSLA({
  requestId,
  autoRefresh = true,
  refreshInterval = 60000, // Default: refresh every minute
}: UseSLAOptions): UseSLAReturn {
  const [slaStatus, setSlaStatus] = useState<SLAStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch SLA status
  const fetchSLAStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/sla/${requestId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch SLA status');
      }

      const data: SLAStatusResponse = await response.json();
      setSlaStatus(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching SLA status:', err);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  // Pause SLA timer
  const pauseSLA = useCallback(
    async (reason?: string) => {
      try {
        setError(null);

        const response = await fetch('/api/sla/pause', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request_id: requestId,
            reason,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to pause SLA timer');
        }

        // Refresh SLA status after pausing
        await fetchSLAStatus();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error pausing SLA:', err);
        throw err;
      }
    },
    [requestId, fetchSLAStatus]
  );

  // Resume SLA timer
  const resumeSLA = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch('/api/sla/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resume SLA timer');
      }

      // Refresh SLA status after resuming
      await fetchSLAStatus();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error resuming SLA:', err);
      throw err;
    }
  }, [requestId, fetchSLAStatus]);

  // Initial fetch
  useEffect(() => {
    fetchSLAStatus();
  }, [fetchSLAStatus]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchSLAStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchSLAStatus]);

  return {
    slaStatus,
    loading,
    error,
    refetch: fetchSLAStatus,
    pauseSLA,
    resumeSLA,
  };
}
