'use client';

import Link from 'next/link';
import { Clock, MessageSquare, Paperclip, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getRequestTypeLabel,
  formatRelativeTime,
  type ClientRequest,
} from '@/types/client';
import { cn } from '@/lib/utils';

interface RequestCardProps {
  request: ClientRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const isActive = ['submitted', 'in-review', 'in-progress'].includes(request.status);
  const showSLA = isActive && request.slaRemaining !== undefined;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn('text-xs', getStatusColor(request.status))}>
                {getStatusLabel(request.status)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getRequestTypeLabel(request.requestType)}
              </Badge>
            </div>
            <Link
              href={`/dashboard/requests/${request.id}`}
              className="group"
            >
              <h3 className="font-semibold text-lg leading-tight group-hover:text-purple-600 transition-colors">
                {request.title}
              </h3>
            </Link>
          </div>
          <span className={cn('text-xs font-medium', getPriorityColor(request.priority))}>
            {request.priority.toUpperCase()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>

        {/* SLA Timer */}
        {showSLA && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-orange-900 font-medium">
                {request.slaRemaining && request.slaRemaining > 0
                  ? `${Math.ceil(request.slaRemaining / 3600000)}h remaining`
                  : 'SLA deadline passed'}
              </span>
            </div>
          </div>
        )}

        {/* Assignee */}
        {request.assigneeName && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-700">
                  {request.assigneeName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <span>Assigned to {request.assigneeName}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span>{request.commentCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Paperclip className="h-4 w-4" />
            <span>{request.attachmentCount}</span>
          </div>
          <span className="text-xs">
            Updated {formatRelativeTime(request.updatedAt)}
          </span>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/requests/${request.id}`}>
            View
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
