'use client';

import {
  FileUp,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Flag,
  Edit,
  Circle,
} from 'lucide-react';
import { ActivityItem, getRelativeTime, getActivityColor } from '@/types/request';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  activities: ActivityItem[];
  className?: string;
}

// Get icon for activity type
function getActivityIcon(type: ActivityItem['type']) {
  const icons = {
    created: Circle,
    status_changed: CheckCircle2,
    comment_added: MessageSquare,
    file_uploaded: FileUp,
    assignee_changed: UserPlus,
    priority_changed: Flag,
    updated: Edit,
  };
  return icons[type] || Circle;
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        const isLast = index === activities.length - 1;

        return (
          <div key={activity.id} className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200" />
            )}

            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm',
                getActivityColor(activity.type)
              )}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.userAvatar} />
                      <AvatarFallback className="text-xs">
                        {activity.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{activity.userName}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-2 rounded-md bg-gray-50 p-2 text-xs text-gray-600">
                      {activity.type === 'status_changed' && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activity.metadata.oldStatus}</span>
                          <span>→</span>
                          <span className="font-medium">{activity.metadata.newStatus}</span>
                        </div>
                      )}
                      {activity.type !== 'status_changed' && (
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
                <time className="text-xs text-gray-500 whitespace-nowrap">
                  {getRelativeTime(activity.createdAt)}
                </time>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
