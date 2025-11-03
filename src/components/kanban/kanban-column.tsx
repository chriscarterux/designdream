'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { RequestCard } from './request-card';
import type { Column } from '@/types/kanban';
import { AlertCircle } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  onCardClick?: (requestId: string) => void;
}

const columnStyles: Record<string, { bg: string; badge: string }> = {
  backlog: {
    bg: 'bg-gray-50 dark:bg-gray-900/50',
    badge: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  'up-next': {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    badge: 'bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  'in-progress': {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    badge: 'bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  review: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    badge: 'bg-amber-200 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  },
  done: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    badge: 'bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
};

export function KanbanColumn({ column, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const style = columnStyles[column.id] || columnStyles.backlog;

  // Check if WIP limit is reached for in-progress column
  const isWipLimitReached =
    column.wipLimit && column.requests.length >= column.wipLimit;

  // Get unique client count in the column
  const uniqueClients = new Set(column.requests.map((r) => r.clientId)).size;

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border-2 transition-all',
        style.bg,
        isOver && 'border-[#6E56CF] shadow-lg',
        !isOver && 'border-transparent'
      )}
    >
      {/* Column Header */}
      <div className="p-4 border-b bg-background/50 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            {column.title}
          </h2>
          <Badge variant="outline" className={cn('ml-2', style.badge)}>
            {column.requests.length}
          </Badge>
        </div>

        {/* WIP Limit Indicator */}
        {column.wipLimit && (
          <div
            className={cn(
              'flex items-center gap-2 text-xs mt-2 px-2 py-1 rounded',
              isWipLimitReached
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <AlertCircle className="h-3 w-3" />
            <span>
              {isWipLimitReached ? (
                <>WIP Limit Reached ({uniqueClients} client{uniqueClients !== 1 ? 's' : ''})</>
              ) : (
                <>WIP Limit: {column.wipLimit} per client</>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Column Content - Droppable Area */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-4 space-y-3 min-h-[500px] overflow-y-auto',
          column.requests.length === 0 && 'flex items-center justify-center'
        )}
      >
        {column.requests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            Drop requests here
          </p>
        ) : (
          <SortableContext
            items={column.requests.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => onCardClick?.(request.id)}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
