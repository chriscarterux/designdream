'use client';

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
import { useState } from 'react';
import { KanbanColumn } from './kanban-column';
import { RequestCard } from './request-card';
import { useKanban } from '@/hooks/use-kanban';
import type { Request, RequestStatus } from '@/types/kanban';

interface KanbanBoardProps {
  onCardClick?: (requestId: string) => void;
}

export function KanbanBoard({ onCardClick }: KanbanBoardProps) {
  const { columns, moveRequest, reorderWithinColumn } = useKanban();
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);

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
    const { active } = event;

    // Find the request being dragged
    let foundRequest: Request | undefined;
    Object.values(columns).forEach((column) => {
      const request = column.requests.find((r) => r.id === active.id);
      if (request) {
        foundRequest = request;
      }
    });

    if (foundRequest) {
      setActiveRequest(foundRequest);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveRequest(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source column
    let sourceColumnId: RequestStatus | undefined;
    for (const [columnId, column] of Object.entries(columns)) {
      if (column.requests.some((r) => r.id === activeId)) {
        sourceColumnId = columnId as RequestStatus;
        break;
      }
    }

    if (!sourceColumnId) return;

    // Check if overId is a column (dropped on column itself)
    const targetColumn = columns[overId as RequestStatus];
    if (targetColumn) {
      // Dropped directly on a column
      if (sourceColumnId !== overId) {
        moveRequest(activeId, overId as RequestStatus);
      }
      return;
    }

    // Otherwise, overId is a request card
    // Find which column the target card is in
    let targetColumnId: RequestStatus | undefined;
    let targetIndex = -1;
    for (const [columnId, column] of Object.entries(columns)) {
      const index = column.requests.findIndex((r) => r.id === overId);
      if (index !== -1) {
        targetColumnId = columnId as RequestStatus;
        targetIndex = index;
        break;
      }
    }

    if (!targetColumnId) return;

    if (sourceColumnId === targetColumnId) {
      // Reordering within the same column
      reorderWithinColumn(sourceColumnId, activeId, targetIndex);
    } else {
      // Moving to a different column
      moveRequest(activeId, targetColumnId);
    }
  };

  const handleDragCancel = () => {
    setActiveRequest(null);
  };

  const columnOrder: RequestStatus[] = [
    'backlog',
    'up-next',
    'in-progress',
    'review',
    'done',
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columnOrder.map((columnId) => (
          <KanbanColumn
            key={columnId}
            column={columns[columnId]}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeRequest ? (
          <div className="rotate-3">
            <RequestCard request={activeRequest} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
