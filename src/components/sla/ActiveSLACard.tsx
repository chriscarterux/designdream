'use client';

import { Clock, AlertTriangle, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { ActiveSLA } from '@/hooks/use-sla-data';

interface ActiveSLACardProps {
  sla: ActiveSLA;
}

export function ActiveSLACard({ sla }: ActiveSLACardProps) {
  const getWarningColor = (level: string) => {
    switch (level) {
      case 'red':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'yellow':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      default:
        return 'bg-green-100 border-green-500 text-green-900';
    }
  };

  const getWarningBadgeColor = (level: string) => {
    switch (level) {
      case 'red':
        return 'bg-red-600 hover:bg-red-700';
      case 'yellow':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-green-600 hover:bg-green-700';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'red':
        return 'bg-red-600';
      case 'yellow':
        return 'bg-yellow-600';
      default:
        return 'bg-green-600';
    }
  };

  const formatHours = (hours: number): string => {
    if (hours < 0) {
      return `${Math.abs(hours).toFixed(1)}h OVERDUE`;
    }
    if (hours < 1) {
      return `${(hours * 60).toFixed(0)}m`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const getPriorityLabel = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'Urgent';
      case 2:
        return 'High';
      case 3:
        return 'Normal';
      case 4:
        return 'Low';
      default:
        return 'No Priority';
    }
  };

  return (
    <Link href={`/admin/requests/${sla.request_id}`}>
      <Card className={`cursor-pointer transition-all hover:shadow-lg border-l-4 ${getWarningColor(sla.warning_level)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{sla.request_title}</h3>
              <p className="text-sm text-gray-600 truncate">{sla.company_name}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <Badge className={getWarningBadgeColor(sla.warning_level)}>
                {sla.warning_level.toUpperCase()}
              </Badge>
              {sla.status === 'paused' && (
                <Badge variant="outline" className="text-xs">
                  <Pause className="h-3 w-3 mr-1" />
                  Paused
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>{sla.completion_percentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full transition-all ${getProgressColor(sla.warning_level)}`}
                style={{ width: `${Math.min(sla.completion_percentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Time Remaining:</span>
            </div>
            <span className={`text-sm font-bold ${
              sla.hours_remaining <= 0 ? 'text-red-600' :
              sla.hours_remaining <= 6 ? 'text-orange-600' :
              'text-gray-900'
            }`}>
              {formatHours(sla.hours_remaining)}
            </span>
          </div>

          {/* Elapsed Time */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Elapsed:</span>
            <span>{formatHours(sla.current_hours_elapsed)}</span>
          </div>

          {/* Target & Priority */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Target:</span>
              <span className="font-medium text-gray-900">{sla.target_hours}h</span>
            </div>
            <Badge variant="outline">{getPriorityLabel(sla.priority)}</Badge>
          </div>

          {/* Violation Warning */}
          {sla.hours_remaining <= 0 && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-800 font-medium">
                SLA VIOLATED - Immediate action required
              </p>
            </div>
          )}

          {/* Assigned To */}
          {sla.assigned_to_name && (
            <div className="text-xs text-gray-500 pt-1 border-t">
              Assigned to: <span className="font-medium">{sla.assigned_to_name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
