'use client';

import { Activity, BarChart3, Clock, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { UsageStats } from '@/types/billing.types';
import { formatDate } from '@/lib/stripe';

interface UsageStatsProps {
  usage: UsageStats;
}

export function UsageStatsComponent({ usage }: UsageStatsProps) {
  const stats = [
    {
      label: 'Requests This Month',
      value: usage.requestsThisMonth.toLocaleString(),
      icon: Activity,
      description: `Since ${formatDate(usage.currentMonthStart)}`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'All-Time Requests',
      value: usage.requestsAllTime.toLocaleString(),
      icon: BarChart3,
      description: 'Total requests processed',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Avg. Turnaround',
      value: `${usage.averageTurnaroundHours}h`,
      icon: Clock,
      description: 'Average completion time',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Value Delivered',
      value: `$${usage.totalValueDelivered.toLocaleString()}`,
      icon: TrendingUp,
      description: 'Estimated total value',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>
          Your activity and value metrics for the current period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className={`rounded-lg ${stat.bgColor} p-2`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-medium">Current Billing Period</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(usage.currentMonthStart)} -{' '}
            {formatDate(usage.currentMonthEnd)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
