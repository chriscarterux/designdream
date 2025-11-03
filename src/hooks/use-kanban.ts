'use client';

import { useState, useCallback } from 'react';
import type { Request, RequestStatus, KanbanState } from '@/types/kanban';

// Mock data for development
const mockRequests: Request[] = [
  {
    id: '1',
    title: 'Redesign landing page hero section',
    description: 'Update the hero section with new branding',
    type: 'design',
    priority: 'high',
    status: 'backlog',
    timeline: '3 days',
    clientId: 'client-1',
    clientName: 'Acme Corp',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Fix mobile navigation bug',
    description: 'Navigation menu not working on mobile devices',
    type: 'bug-fix',
    priority: 'urgent',
    status: 'up-next',
    timeline: '1 day',
    clientId: 'client-2',
    clientName: 'TechStart Inc',
    createdAt: '2025-11-01T11:00:00Z',
    updatedAt: '2025-11-01T11:00:00Z',
  },
  {
    id: '3',
    title: 'Implement user dashboard',
    description: 'Create a dashboard for user analytics',
    type: 'development',
    priority: 'medium',
    status: 'in-progress',
    timeline: '5 days',
    clientId: 'client-1',
    clientName: 'Acme Corp',
    createdAt: '2025-10-28T09:00:00Z',
    updatedAt: '2025-11-02T14:00:00Z',
  },
  {
    id: '4',
    title: 'Code review for checkout flow',
    description: 'Review and provide feedback on new checkout implementation',
    type: 'consultation',
    priority: 'medium',
    status: 'review',
    timeline: '2 days',
    clientId: 'client-3',
    clientName: 'ShopEasy',
    createdAt: '2025-10-30T13:00:00Z',
    updatedAt: '2025-11-02T16:00:00Z',
  },
  {
    id: '5',
    title: 'Update brand guidelines',
    description: 'Refresh brand colors and typography',
    type: 'design',
    priority: 'low',
    status: 'done',
    timeline: '2 days',
    clientId: 'client-2',
    clientName: 'TechStart Inc',
    createdAt: '2025-10-25T10:00:00Z',
    updatedAt: '2025-10-31T17:00:00Z',
  },
  {
    id: '6',
    title: 'Add dark mode support',
    description: 'Implement dark mode across the application',
    type: 'enhancement',
    priority: 'medium',
    status: 'backlog',
    timeline: '4 days',
    clientId: 'client-3',
    clientName: 'ShopEasy',
    createdAt: '2025-11-02T08:00:00Z',
    updatedAt: '2025-11-02T08:00:00Z',
  },
  {
    id: '7',
    title: 'Optimize image loading',
    description: 'Improve page load times by optimizing images',
    type: 'enhancement',
    priority: 'high',
    status: 'up-next',
    timeline: '2 days',
    clientId: 'client-1',
    clientName: 'Acme Corp',
    createdAt: '2025-11-02T09:00:00Z',
    updatedAt: '2025-11-02T09:00:00Z',
  },
  {
    id: '8',
    title: 'Create email templates',
    description: 'Design and code responsive email templates',
    type: 'design',
    priority: 'medium',
    status: 'backlog',
    timeline: '3 days',
    clientId: 'client-2',
    clientName: 'TechStart Inc',
    createdAt: '2025-11-02T11:00:00Z',
    updatedAt: '2025-11-02T11:00:00Z',
  },
];

const initialColumns: RequestStatus[] = ['backlog', 'up-next', 'in-progress', 'review', 'done'];

function initializeKanbanState(requests: Request[]): KanbanState {
  const columns: KanbanState['columns'] = {
    backlog: {
      id: 'backlog',
      title: 'Backlog',
      requests: [],
    },
    'up-next': {
      id: 'up-next',
      title: 'Up Next',
      requests: [],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      requests: [],
      wipLimit: 1, // WIP limit: 1 request per client
    },
    review: {
      id: 'review',
      title: 'Review',
      requests: [],
    },
    done: {
      id: 'done',
      title: 'Done',
      requests: [],
    },
  };

  // Distribute requests into columns
  requests.forEach((request) => {
    columns[request.status].requests.push(request);
  });

  return { columns };
}

export function useKanban() {
  const [state, setState] = useState<KanbanState>(() =>
    initializeKanbanState(mockRequests)
  );

  const canMoveToColumn = useCallback(
    (request: Request, targetColumnId: RequestStatus): { canMove: boolean; reason?: string } => {
      const targetColumn = state.columns[targetColumnId];

      // Check WIP limit for "In Progress" column
      if (targetColumnId === 'in-progress' && targetColumn.wipLimit) {
        const clientRequestsInProgress = targetColumn.requests.filter(
          (r) => r.clientId === request.clientId
        );

        if (
          clientRequestsInProgress.length >= targetColumn.wipLimit &&
          !clientRequestsInProgress.some((r) => r.id === request.id)
        ) {
          return {
            canMove: false,
            reason: `WIP limit reached: ${request.clientName} already has ${targetColumn.wipLimit} request(s) in progress`,
          };
        }
      }

      return { canMove: true };
    },
    [state.columns]
  );

  const moveRequest = useCallback(
    (requestId: string, targetColumnId: RequestStatus): boolean => {
      let movedRequest: Request | undefined;
      let sourceColumnId: RequestStatus | undefined;

      // Find the request and remove it from its current column
      for (const columnId of initialColumns) {
        const column = state.columns[columnId];
        const requestIndex = column.requests.findIndex((r) => r.id === requestId);

        if (requestIndex !== -1) {
          movedRequest = column.requests[requestIndex];
          sourceColumnId = columnId;
          break;
        }
      }

      if (!movedRequest || !sourceColumnId) {
        return false;
      }

      // Check if move is allowed
      const { canMove, reason } = canMoveToColumn(movedRequest, targetColumnId);

      if (!canMove) {
        // In a real app, you'd show this to the user
        console.warn(reason);
        return false;
      }

      // Optimistic update
      setState((prevState) => {
        const newColumns = { ...prevState.columns };

        // Remove from source column
        newColumns[sourceColumnId!] = {
          ...newColumns[sourceColumnId!],
          requests: newColumns[sourceColumnId!].requests.filter((r) => r.id !== requestId),
        };

        // Add to target column with updated status
        const updatedRequest = { ...movedRequest!, status: targetColumnId };
        newColumns[targetColumnId] = {
          ...newColumns[targetColumnId],
          requests: [...newColumns[targetColumnId].requests, updatedRequest],
        };

        return { columns: newColumns };
      });

      // TODO: In a real app, sync with backend here
      // await updateRequestStatus(requestId, targetColumnId);

      return true;
    },
    [state.columns, canMoveToColumn]
  );

  const reorderWithinColumn = useCallback(
    (columnId: RequestStatus, requestId: string, newIndex: number) => {
      setState((prevState) => {
        const column = prevState.columns[columnId];
        const oldIndex = column.requests.findIndex((r) => r.id === requestId);

        if (oldIndex === -1) return prevState;

        const newRequests = [...column.requests];
        const [removed] = newRequests.splice(oldIndex, 1);
        newRequests.splice(newIndex, 0, removed);

        return {
          columns: {
            ...prevState.columns,
            [columnId]: {
              ...column,
              requests: newRequests,
            },
          },
        };
      });

      // TODO: In a real app, sync order with backend
      // await updateRequestOrder(columnId, newOrder);
    },
    []
  );

  return {
    columns: state.columns,
    moveRequest,
    reorderWithinColumn,
    canMoveToColumn,
  };
}
