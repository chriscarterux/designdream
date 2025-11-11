'use client';

import { useState } from 'react';
import { Download, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSLAData } from '@/hooks/use-sla-data';
import { ActiveSLACard } from '@/components/sla/ActiveSLACard';
import { SLAChart } from '@/components/sla/SLAChart';
import { ClientMetricsTable } from '@/components/sla/ClientMetricsTable';

export default function SLADashboardPage() {
  const { activeSLAs, clientMetrics, historicalData, isLoading, error, refetch } = useSLAData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      // Prepare CSV data
      const headers = [
        'Client',
        'Total Requests',
        'SLAs Met',
        'SLAs Violated',
        'Adherence %',
        'Avg Completion (hours)',
        'At Risk Count',
      ];

      const rows = clientMetrics.map((metric) => [
        metric.company_name,
        metric.total_completed_requests.toString(),
        metric.sla_met_count.toString(),
        metric.sla_violated_count.toString(),
        metric.sla_adherence_percent.toFixed(2),
        metric.avg_completion_hours.toFixed(2),
        metric.current_at_risk_count.toString(),
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `sla-metrics-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Count violations
  const violationsCount = activeSLAs.filter((sla) => sla.warning_level === 'red').length;
  const warningsCount = activeSLAs.filter((sla) => sla.warning_level === 'yellow').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading SLA dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-800 font-medium mb-2">Error Loading SLA Dashboard</p>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SLA Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor service level agreement compliance and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            disabled={isExporting || clientMetrics.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      {(violationsCount > 0 || warningsCount > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-900">
                  Active SLA Alerts
                </p>
                <p className="text-sm text-orange-700">
                  {violationsCount > 0 && `${violationsCount} SLA${violationsCount !== 1 ? 's' : ''} violated`}
                  {violationsCount > 0 && warningsCount > 0 && ' • '}
                  {warningsCount > 0 && `${warningsCount} approaching deadline`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active SLAs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Active SLAs ({activeSLAs.length})
        </h2>
        {activeSLAs.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium mb-1">No Active SLAs</p>
                <p className="text-sm">All requests are either completed or not yet in progress</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSLAs.map((sla) => (
              <ActiveSLACard key={sla.sla_id} sla={sla} />
            ))}
          </div>
        )}
      </div>

      {/* Historical Chart */}
      <SLAChart data={historicalData} />

      {/* Client Metrics Table */}
      <ClientMetricsTable metrics={clientMetrics} />
    </div>
  );
}
