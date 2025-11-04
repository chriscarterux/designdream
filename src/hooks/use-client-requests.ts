'use client';

import useSWR from 'swr';
import type { ClientRequest } from '@/types/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useClientRequests(status?: string) {
  const params = new URLSearchParams();
  if (status && status !== 'all') {
    params.append('status', status);
  }

  const { data, error, isLoading, mutate } = useSWR<{ requests: ClientRequest[] }>(
    `/api/client/requests?${params.toString()}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    requests: data?.requests || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useClientRequest(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ request: ClientRequest }>(
    id ? `/api/client/requests/${id}` : null,
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds for active request
      revalidateOnFocus: true,
    }
  );

  return {
    request: data?.request,
    isLoading,
    isError: error,
    mutate,
  };
}
