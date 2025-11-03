'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Request } from '@/types/kanban';
import {
  AlertCircle,
  ArrowUp,
  Circle,
  Clock,
  Code,
  MessageSquare,
  Paintbrush,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface RequestCardProps {
  request: Request;
  onClick?: () => void;
}

const priorityConfig = {
  urgent: {
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    icon: AlertCircle,
  },
  high: {
    color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    icon: ArrowUp,
  },
  medium: {
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    icon: Circle,
  },
  low: {
    color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
    icon: Circle,
  },
};

const typeConfig = {
  design: {
    label: 'Design',
    icon: Paintbrush,
    color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  },
  development: {
    label: 'Development',
    icon: Code,
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  },
  'bug-fix': {
    label: 'Bug Fix',
    icon: Wrench,
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  },
  enhancement: {
    label: 'Enhancement',
    icon: Sparkles,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
  },
  consultation: {
    label: 'Consultation',
    icon: MessageSquare,
    color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  },
};

export function RequestCard({ request, onClick }: RequestCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyle = priorityConfig[request.priority];
  const typeStyle = typeConfig[request.type];
  const PriorityIcon = priorityStyle.icon;
  const TypeIcon = typeStyle.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'touch-none',
        isDragging && 'opacity-50'
      )}
    >
      <Card
        className={cn(
          'cursor-move transition-all hover:shadow-md border-l-4',
          priorityStyle.color.split(' ')[2], // Extract border color
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header with priority and type badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                {request.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <PriorityIcon className={cn('h-4 w-4', priorityStyle.color.split(' ')[1])} />
            </div>
          </div>

          {/* Description */}
          {request.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {request.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn('text-xs border', typeStyle.color)}
            >
              <TypeIcon className="h-3 w-3 mr-1" />
              {typeStyle.label}
            </Badge>
            <Badge
              variant="outline"
              className={cn('text-xs border', priorityStyle.color)}
            >
              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
            </Badge>
          </div>

          {/* Footer with client and timeline */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="font-medium truncate">{request.clientName}</span>
            {request.timeline && (
              <span className="flex items-center gap-1 flex-shrink-0">
                <Clock className="h-3 w-3" />
                {request.timeline}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
