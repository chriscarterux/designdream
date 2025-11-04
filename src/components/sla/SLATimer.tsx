/**
 * SLATimer Component
 *
 * Displays a visual SLA timer with warning indicators
 */

'use client';

import { useSLA } from '@/hooks/useSLA';
import { SLAWarningLevel } from '@/types/sla.types';

interface SLATimerProps {
  requestId: string;
  compact?: boolean;
  showControls?: boolean;
}

export function SLATimer({
  requestId,
  compact = false,
  showControls = false,
}: SLATimerProps) {
  const { slaStatus, loading, error, pauseSLA, resumeSLA } = useSLA({
    requestId,
    autoRefresh: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  if (loading && !slaStatus) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-gray-500">
        {error.includes('No active SLA') ? 'No active SLA' : 'Error loading SLA'}
      </div>
    );
  }

  if (!slaStatus) {
    return null;
  }

  const { warning_level, time_remaining_display, sla_record, time_calculation } =
    slaStatus;

  // Determine color classes based on warning level
  const getColorClasses = (level: SLAWarningLevel) => {
    switch (level) {
      case 'red':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          badge: 'bg-red-100 text-red-800',
          progress: 'bg-red-500',
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          badge: 'bg-yellow-100 text-yellow-800',
          progress: 'bg-yellow-500',
        };
      default:
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          badge: 'bg-green-100 text-green-800',
          progress: 'bg-green-500',
        };
    }
  };

  const colors = getColorClasses(warning_level);
  const isPaused = sla_record.status === 'paused';

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${colors.text}`}>
          {time_remaining_display}
        </span>
        {isPaused && (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
            Paused
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg} p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900">SLA Status</h3>
          <p className={`text-lg font-semibold ${colors.text} mt-1`}>
            {time_remaining_display}
          </p>
        </div>
        {isPaused && (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            Timer Paused
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${colors.progress} h-2 rounded-full transition-all duration-300`}
            style={{
              width: `${Math.min(100, time_calculation.percentage_complete)}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>
            {time_calculation.business_hours_elapsed.toFixed(1)} hours elapsed
          </span>
          <span>{time_calculation.target_hours} hour target</span>
        </div>
      </div>

      {/* Warning Message */}
      {warning_level === 'red' && (
        <div className="text-sm text-red-700 font-medium mb-3">
          URGENT: SLA deadline approaching or exceeded!
        </div>
      )}
      {warning_level === 'yellow' && (
        <div className="text-sm text-yellow-700 font-medium mb-3">
          Warning: Less than 12 hours remaining
        </div>
      )}

      {/* Control Buttons */}
      {showControls && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
          {!isPaused ? (
            <button
              onClick={() => pauseSLA('Manual pause from UI')}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Pause Timer
            </button>
          ) : (
            <button
              onClick={() => resumeSLA()}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Resume Timer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
