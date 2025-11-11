'use client';

import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ClientSLAMetrics } from '@/hooks/use-sla-data';

interface ClientMetricsTableProps {
  metrics: ClientSLAMetrics[];
}

export function ClientMetricsTable({ metrics }: ClientMetricsTableProps) {
  const getAdherenceColor = (percent: number): string => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAdherenceBadge = (percent: number) => {
    if (percent >= 90) {
      return <Badge className="bg-green-600">Excellent</Badge>;
    }
    if (percent >= 70) {
      return <Badge className="bg-yellow-600">Good</Badge>;
    }
    return <Badge className="bg-red-600">Needs Attention</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Per-Client SLA Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <p>No client metrics available yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Adherence
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Met
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Violated
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Avg. Time
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    At Risk
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.map((metric) => (
                  <tr
                    key={metric.client_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Client Name */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{metric.company_name}</div>
                    </td>

                    {/* Adherence Percentage */}
                    <td className="px-4 py-3 text-center">
                      <div className={`text-lg font-bold ${getAdherenceColor(metric.sla_adherence_percent)}`}>
                        {metric.sla_adherence_percent.toFixed(1)}%
                      </div>
                    </td>

                    {/* Total Requests */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {metric.total_completed_requests}
                        </span>
                      </div>
                    </td>

                    {/* Met Count */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {metric.sla_met_count}
                        </span>
                      </div>
                    </td>

                    {/* Violated Count */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-700">
                          {metric.sla_violated_count}
                        </span>
                      </div>
                    </td>

                    {/* Average Completion Time */}
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900">
                        {metric.avg_completion_hours.toFixed(1)}h
                      </span>
                    </td>

                    {/* At Risk Count */}
                    <td className="px-4 py-3 text-center">
                      {metric.current_at_risk_count > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-700">
                            {metric.current_at_risk_count}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">0</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 text-center">
                      {getAdherenceBadge(metric.sla_adherence_percent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
