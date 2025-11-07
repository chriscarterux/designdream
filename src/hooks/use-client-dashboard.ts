'use client';

import useSWR from 'swr';
import type { ClientStats, ClientActivity } from '@/types/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useClientDashboard() {
  const { data: statsData, error: statsError, isLoading: statsLoading } = useSWR<{
    stats: ClientStats;
  }>('/api/client/stats', fetcher, {
    refreshInterval: 60000, // Refresh every minute
  });

  const { data: activityData, error: activityError, isLoading: activityLoading } = useSWR<{
    activities: ClientActivity[];
  }>('/api/client/activity', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  return {
    stats: statsData?.stats,
    activities: activityData?.activities || [],
    isLoading: statsLoading || activityLoading,
    isError: statsError || activityError,
  };
}
