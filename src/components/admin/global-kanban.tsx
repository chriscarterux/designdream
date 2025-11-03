'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { QueueColumn, RequestStatus } from '@/types/queue';
import { KanbanColumn } from './kanban-column';
import { RequestCard } from './request-card';

interface GlobalKanbanProps {
  columns: QueueColumn[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onUpdateStatus: (requestId: string, newStatus: RequestStatus) => void;
}

export function GlobalKanban({
  columns,
  selectedIds,
  onToggleSelection,
  onUpdateStatus,
}: GlobalKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dropping on a column
    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      onUpdateStatus(activeId, targetColumn.id);
    } else {
      // Dropped on another card, find which column it belongs to
      const targetRequest = columns
        .flatMap((col) => col.requests)
        .find((req) => req.id === overId);
      if (targetRequest) {
        onUpdateStatus(activeId, targetRequest.status);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Get the active request for drag overlay
  const activeRequest = activeId
    ? columns.flatMap((col) => col.requests).find((req) => req.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            selectedIds={selectedIds}
            onToggleSelection={onToggleSelection}
          />
        ))}
      </div>

      <DragOverlay>
        {activeRequest ? (
          <div className="rotate-3 opacity-90">
            <RequestCard
              request={activeRequest}
              isSelected={selectedIds.has(activeRequest.id)}
              onToggleSelection={onToggleSelection}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
