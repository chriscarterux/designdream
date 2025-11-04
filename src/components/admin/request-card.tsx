'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, AlertTriangle, User, GripVertical } from 'lucide-react';
import { Request } from '@/types/queue';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface RequestCardProps {
  request: Request;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  isDragging?: boolean;
}

export function RequestCard({
  request,
  isSelected,
  onToggleSelection,
  isDragging = false,
}: RequestCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Calculate time until due
  const getTimeUntilDue = () => {
    const now = new Date();
    const diff = request.dueAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (diff < 0) {
      const overdueDays = Math.floor(-diff / (1000 * 60 * 60 * 24));
      const overdueHours = Math.floor((-diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return {
        text: overdueDays > 0 ? `${overdueDays}d overdue` : `${overdueHours}h overdue`,
        status: 'overdue' as const,
      };
    } else if (hours < 12) {
      return {
        text: `${hours}h remaining`,
        status: 'warning' as const,
      };
    } else if (days === 0) {
      return {
        text: `${hours}h remaining`,
        status: 'normal' as const,
      };
    } else {
      return {
        text: `${days}d remaining`,
        status: 'normal' as const,
      };
    }
  };

  const timeInfo = getTimeUntilDue();

  const getPriorityColor = (priority: Request['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: Request['type']) => {
    switch (type) {
      case 'design':
        return '🎨';
      case 'development':
        return '💻';
      case 'ai':
        return '🤖';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md',
        isSortableDragging && 'opacity-50',
        isDragging && 'cursor-grabbing shadow-xl',
        isSelected && 'ring-2 ring-purple-500',
        timeInfo.status === 'overdue' && 'border-red-300 bg-red-50',
        timeInfo.status === 'warning' && 'border-yellow-300 bg-yellow-50'
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-1/2 -translate-y-1/2 cursor-grab rounded bg-slate-100 p-1 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>

      <div className="space-y-2">
        {/* Header with checkbox and client */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(request.id)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium leading-tight text-slate-900">
                {request.title}
              </h4>
              <div className="mt-1 flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: request.client.color }}
                />
                <span className="text-xs text-slate-600">{request.client.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Request details */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-xs">
            {request.id}
          </Badge>
          <span className="text-xs">{getTypeIcon(request.type)}</span>
          <Badge
            variant="outline"
            className={cn('text-xs', getPriorityColor(request.priority))}
          >
            {request.priority}
          </Badge>
        </div>

        {/* SLA warning */}
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium',
            timeInfo.status === 'overdue' &&
              'bg-red-100 text-red-700 border border-red-200',
            timeInfo.status === 'warning' &&
              'bg-yellow-100 text-yellow-700 border border-yellow-200',
            timeInfo.status === 'normal' && 'bg-slate-100 text-slate-600'
          )}
        >
          {timeInfo.status === 'overdue' ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : (
            <Clock className="h-3.5 w-3.5" />
          )}
          <span>{timeInfo.text}</span>
        </div>

        {/* Assignee */}
        {request.assignedTo && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <User className="h-3 w-3" />
            <span>{request.assignedTo}</span>
          </div>
        )}
      </div>
    </div>
  );
}
