'use client';

import {
  ListTodo,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { QueueStats } from '@/types/queue';

interface QueueStatsProps {
  stats: QueueStats;
}

export function QueueStatsComponent({ stats }: QueueStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {/* Total Requests */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600">Total</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <ListTodo className="h-8 w-8 text-slate-400" />
        </div>
      </div>

      {/* Backlog */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600">Backlog</p>
            <p className="mt-1 text-2xl font-bold text-slate-600">
              {stats.byStatus.backlog}
            </p>
          </div>
          <div className="rounded-full bg-slate-100 p-2">
            <ListTodo className="h-4 w-4 text-slate-600" />
          </div>
        </div>
      </div>

      {/* In Queue */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-yellow-700">In Queue</p>
            <p className="mt-1 text-2xl font-bold text-yellow-700">
              {stats.byStatus.in_queue}
            </p>
          </div>
          <div className="rounded-full bg-yellow-100 p-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-700">In Progress</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">
              {stats.byStatus.in_progress}
            </p>
          </div>
          <div className="rounded-full bg-blue-100 p-2">
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </div>

      {/* In Review */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-700">In Review</p>
            <p className="mt-1 text-2xl font-bold text-purple-700">
              {stats.byStatus.in_review}
            </p>
          </div>
          <div className="rounded-full bg-purple-100 p-2">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-green-700">Completed</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {stats.byStatus.completed}
            </p>
          </div>
          <div className="rounded-full bg-green-100 p-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
        </div>
      </div>

      {/* SLA Compliance */}
      <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:col-span-2 lg:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600">SLA Compliance Rate</p>
            <p className="mt-1 text-3xl font-bold text-purple-700">
              {stats.slaComplianceRate.toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Requests completed on time
            </p>
          </div>
          <TrendingUp className="h-10 w-10 text-purple-500" />
        </div>
      </div>

      {/* Client Breakdown */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:col-span-2 lg:col-span-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">By Client</h3>
          <Users className="h-4 w-4 text-slate-400" />
        </div>
        <div className="space-y-2">
          {Object.entries(stats.byClient)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([client, count]) => (
              <div key={client} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{client}</span>
                <span className="font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          {Object.keys(stats.byClient).length > 3 && (
            <div className="pt-1 text-xs text-slate-500">
              +{Object.keys(stats.byClient).length - 3} more clients
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
