'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HistoricalSLAData } from '@/hooks/use-sla-data';

interface SLAChartProps {
  data: HistoricalSLAData[];
}

export function SLAChart({ data }: SLAChartProps) {
  // Format date for display (MM/DD)
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{data.displayDate}</p>
          <div className="space-y-1 text-xs">
            <p className="text-gray-700">
              <span className="font-medium">Adherence:</span> {data.adherence_percent.toFixed(1)}%
            </p>
            <p className="text-green-600">
              <span className="font-medium">Met:</span> {data.met_count} requests
            </p>
            <p className="text-red-600">
              <span className="font-medium">Violated:</span> {data.violated_count} requests
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Total:</span> {data.total_requests} requests
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate overall stats
  const totalRequests = data.reduce((sum, item) => sum + item.total_requests, 0);
  const totalMet = data.reduce((sum, item) => sum + item.met_count, 0);
  const overallAdherence = totalRequests > 0 ? (totalMet / totalRequests) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>SLA Adherence Trend (Last 30 Days)</span>
          <div className="text-sm font-normal text-gray-600">
            Overall: <span className={`font-bold ${overallAdherence >= 90 ? 'text-green-600' : overallAdherence >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
              {overallAdherence.toFixed(1)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No historical data available yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="displayDate"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
                label={{ value: 'Adherence %', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="adherence_percent"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
                name="SLA Adherence %"
              />
              {/* Reference line at 90% (target) */}
              <Line
                type="monotone"
                dataKey={() => 90}
                stroke="#10b981"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Target (90%)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Legend Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{totalRequests}</p>
            <p className="text-xs text-gray-600 mt-1">Total Requests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{totalMet}</p>
            <p className="text-xs text-gray-600 mt-1">SLAs Met</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{totalRequests - totalMet}</p>
            <p className="text-xs text-gray-600 mt-1">SLAs Violated</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
