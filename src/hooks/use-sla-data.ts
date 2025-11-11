'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Types based on database views
export interface ActiveSLA {
  sla_id: string;
  request_id: string;
  request_title: string;
  priority: number;
  request_type: string;
  client_id: string;
  company_name: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  started_at: string;
  target_hours: number;
  current_hours_elapsed: number;
  hours_remaining: number;
  completion_percentage: number;
  warning_level: 'green' | 'yellow' | 'red';
  status: 'active' | 'paused';
  paused_at: string | null;
}

export interface ClientSLAMetrics {
  client_id: string;
  company_name: string;
  total_completed_requests: number;
  sla_met_count: number;
  sla_violated_count: number;
  avg_completion_hours: number;
  sla_adherence_percent: number;
  current_at_risk_count: number;
}

export interface HistoricalSLAData {
  date: string;
  adherence_percent: number;
  total_requests: number;
  met_count: number;
  violated_count: number;
}

interface UseSLADataReturn {
  activeSLAs: ActiveSLA[];
  clientMetrics: ClientSLAMetrics[];
  historicalData: HistoricalSLAData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSLAData(): UseSLADataReturn {
  const [activeSLAs, setActiveSLAs] = useState<ActiveSLA[]>([]);
  const [clientMetrics, setClientMetrics] = useState<ClientSLAMetrics[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalSLAData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch active SLAs from the dashboard view
      const { data: activeSLAData, error: activeSLAError } = await supabase
        .from('sla_dashboard')
        .select('*')
        .order('hours_remaining', { ascending: true });

      if (activeSLAError) throw activeSLAError;

      // Fetch client SLA metrics
      const { data: clientMetricsData, error: clientMetricsError } = await supabase
        .from('sla_metrics_by_client')
        .select('*')
        .order('sla_adherence_percent', { ascending: false });

      if (clientMetricsError) throw clientMetricsError;

      // Fetch historical SLA data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: historicalSLAData, error: historicalError } = await supabase
        .from('sla_records')
        .select('completed_at, status, target_hours, business_hours_elapsed')
        .not('completed_at', 'is', null)
        .gte('completed_at', thirtyDaysAgo.toISOString())
        .order('completed_at', { ascending: true });

      if (historicalError) throw historicalError;

      // Aggregate historical data by day
      const dataByDay = new Map<string, { met: number; violated: number }>();

      historicalSLAData?.forEach((record: any) => {
        const date = new Date(record.completed_at).toISOString().split('T')[0];
        const current = dataByDay.get(date) || { met: 0, violated: 0 };

        if (record.status === 'met') {
          current.met++;
        } else if (record.status === 'violated') {
          current.violated++;
        }

        dataByDay.set(date, current);
      });

      // Convert to array and calculate adherence percentage
      const historicalArray: HistoricalSLAData[] = Array.from(dataByDay.entries())
        .map(([date, counts]) => {
          const total = counts.met + counts.violated;
          return {
            date,
            adherence_percent: total > 0 ? (counts.met / total) * 100 : 0,
            total_requests: total,
            met_count: counts.met,
            violated_count: counts.violated,
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      setActiveSLAs(activeSLAData as ActiveSLA[] || []);
      setClientMetrics(clientMetricsData as ClientSLAMetrics[] || []);
      setHistoricalData(historicalArray);
    } catch (err) {
      console.error('Error fetching SLA data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch SLA data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up real-time subscription for active SLAs
  useEffect(() => {
    fetchData();

    // Subscribe to sla_records changes
    const channel = supabase
      .channel('sla_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sla_records',
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    // Refresh every minute to update timers
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchData]);

  return {
    activeSLAs,
    clientMetrics,
    historicalData,
    isLoading,
    error,
    refetch: fetchData,
  };
}
