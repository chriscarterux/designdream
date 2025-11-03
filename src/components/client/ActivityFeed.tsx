'use client';

import {
  FileText,
  MessageSquare,
  Upload,
  CheckCircle2,
  Clock,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, type ClientActivity } from '@/types/client';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: ClientActivity[];
  isLoading?: boolean;
  maxItems?: number;
}

const activityIcons = {
  request_submitted: FileText,
  request_updated: AlertCircle,
  status_changed: Clock,
  comment_added: MessageSquare,
  file_uploaded: Upload,
  request_completed: CheckCircle2,
  payment_processed: CreditCard,
  subscription_updated: CreditCard,
};

const activityColors = {
  request_submitted: 'text-blue-600 bg-blue-100',
  request_updated: 'text-purple-600 bg-purple-100',
  status_changed: 'text-orange-600 bg-orange-100',
  comment_added: 'text-green-600 bg-green-100',
  file_uploaded: 'text-indigo-600 bg-indigo-100',
  request_completed: 'text-green-600 bg-green-100',
  payment_processed: 'text-emerald-600 bg-emerald-100',
  subscription_updated: 'text-purple-600 bg-purple-100',
};

export function ActivityFeed({ activities, isLoading, maxItems }: ActivityFeedProps) {
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates on your requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates on your requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">Activity will appear here as you interact with requests</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates on your requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity) => {
            const Icon = activityIcons[activity.type] || AlertCircle;
            const colorClass = activityColors[activity.type] || 'text-gray-600 bg-gray-100';

            return (
              <div key={activity.id} className="flex gap-4">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', colorClass)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      {activity.requestTitle && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {activity.requestTitle}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
