'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { QueueColumn } from '@/types/queue';
import { RequestCard } from './request-card';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  column: QueueColumn;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
}

export function KanbanColumn({
  column,
  selectedIds,
  onToggleSelection,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'backlog':
        return 'bg-slate-50 border-slate-200';
      case 'in_queue':
        return 'bg-yellow-50 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'in_review':
        return 'bg-purple-50 border-purple-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getHeaderColor = (columnId: string) => {
    switch (columnId) {
      case 'backlog':
        return 'text-slate-700';
      case 'in_queue':
        return 'text-yellow-700';
      case 'in_progress':
        return 'text-blue-700';
      case 'in_review':
        return 'text-purple-700';
      case 'completed':
        return 'text-green-700';
      default:
        return 'text-slate-700';
    }
  };

  return (
    <div className="flex min-w-[320px] flex-1 flex-col">
      {/* Column Header */}
      <div className={`mb-3 flex items-center justify-between rounded-t-lg border-t-4 ${getColumnColor(column.id)} p-3`}>
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold ${getHeaderColor(column.id)}`}>
            {column.title}
          </h3>
          <Badge variant="secondary" className="rounded-full">
            {column.requests.length}
          </Badge>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 rounded-lg border-2 border-dashed p-2 transition-colors ${
          isOver
            ? 'border-purple-400 bg-purple-50'
            : 'border-transparent bg-slate-50'
        }`}
        style={{ minHeight: '400px' }}
      >
        <SortableContext
          items={column.requests.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.requests.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white">
              <p className="text-sm text-slate-400">No requests</p>
            </div>
          ) : (
            column.requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                isSelected={selectedIds.has(request.id)}
                onToggleSelection={onToggleSelection}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
