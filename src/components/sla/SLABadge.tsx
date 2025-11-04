/**
 * SLABadge Component
 *
 * A compact badge showing SLA status at a glance
 */

'use client';

import { useSLA } from '@/hooks/useSLA';
import { SLAWarningLevel } from '@/types/sla.types';

interface SLABadgeProps {
  requestId: string;
  showTime?: boolean;
}

export function SLABadge({ requestId, showTime = true }: SLABadgeProps) {
  const { slaStatus, loading, error } = useSLA({
    requestId,
    autoRefresh: true,
    refreshInterval: 60000, // Refresh every minute
  });

  if (loading && !slaStatus) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 animate-pulse">
        Loading...
      </span>
    );
  }

  if (error || !slaStatus) {
    return null;
  }

  const { warning_level, time_remaining_display, sla_record } = slaStatus;
  const isPaused = sla_record.status === 'paused';

  // Determine badge color based on warning level
  const getBadgeClasses = (level: SLAWarningLevel) => {
    if (isPaused) {
      return 'bg-gray-100 text-gray-700';
    }

    switch (level) {
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getBadgeText = () => {
    if (isPaused) {
      return 'SLA Paused';
    }
    return showTime ? time_remaining_display : 'On Track';
  };

  const badgeIcon = () => {
    if (isPaused) {
      return '⏸';
    }
    switch (warning_level) {
      case 'red':
        return '🔴';
      case 'yellow':
        return '🟡';
      default:
        return '🟢';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(
        warning_level
      )}`}
    >
      <span>{badgeIcon()}</span>
      <span>{getBadgeText()}</span>
    </span>
  );
}
