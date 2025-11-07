import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKanban } from '@/hooks/use-kanban';
import type { Request, RequestStatus } from '@/types/kanban';

describe('useKanban Hook', () => {
  describe('Initial State', () => {
    it('should initialize with all columns', () => {
      const { result } = renderHook(() => useKanban());

      expect(result.current.columns).toBeDefined();
      expect(result.current.columns.backlog).toBeDefined();
      expect(result.current.columns['up-next']).toBeDefined();
      expect(result.current.columns['in-progress']).toBeDefined();
      expect(result.current.columns.review).toBeDefined();
      expect(result.current.columns.done).toBeDefined();
    });

    it('should have requests distributed across columns', () => {
      const { result } = renderHook(() => useKanban());
      const columns = result.current.columns;

      const totalRequests = Object.values(columns).reduce(
        (sum, column) => sum + column.requests.length,
        0
      );

      expect(totalRequests).toBeGreaterThan(0);
    });

    it('should set WIP limit on in-progress column', () => {
      const { result } = renderHook(() => useKanban());

      expect(result.current.columns['in-progress'].wipLimit).toBe(1);
    });
  });

  describe('canMoveToColumn', () => {
    it('should allow moving to any column except when WIP limit reached', () => {
      const { result } = renderHook(() => useKanban());

      const testRequest: Request = {
        id: 'test-1',
        title: 'Test Request',
        description: 'Test description',
        type: 'design',
        priority: 'medium',
        status: 'backlog',
        timeline: '2 days',
        clientId: 'client-test',
        clientName: 'Test Client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const canMove = result.current.canMoveToColumn(testRequest, 'up-next');
      expect(canMove.canMove).toBe(true);
    });

    it('should enforce WIP limit for in-progress column', () => {
      const { result } = renderHook(() => useKanban());

      // Find a client that already has a request in progress
      const inProgressRequests = result.current.columns['in-progress'].requests;

      if (inProgressRequests.length > 0) {
        const existingRequest = inProgressRequests[0];

        // Try to move another request from the same client
        const newRequest: Request = {
          id: 'new-test',
          title: 'New Test Request',
          description: 'Test description',
          type: 'design',
          priority: 'medium',
          status: 'backlog',
          timeline: '2 days',
          clientId: existingRequest.clientId,
          clientName: existingRequest.clientName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const canMove = result.current.canMoveToColumn(newRequest, 'in-progress');
        expect(canMove.canMove).toBe(false);
        expect(canMove.reason).toContain('WIP limit reached');
      }
    });

    it('should allow moving same request within in-progress column', () => {
      const { result } = renderHook(() => useKanban());

      const inProgressRequests = result.current.columns['in-progress'].requests;

      if (inProgressRequests.length > 0) {
        const existingRequest = inProgressRequests[0];
        const canMove = result.current.canMoveToColumn(existingRequest, 'in-progress');

        expect(canMove.canMove).toBe(true);
      }
    });
  });

  describe('moveRequest', () => {
    it('should move request between columns', () => {
      const { result } = renderHook(() => useKanban());

      // Find a request in backlog
      const backlogRequests = result.current.columns.backlog.requests;

      if (backlogRequests.length > 0) {
        const requestToMove = backlogRequests[0];
        const initialBacklogCount = backlogRequests.length;
        const initialUpNextCount = result.current.columns['up-next'].requests.length;

        act(() => {
          result.current.moveRequest(requestToMove.id, 'up-next');
        });

        expect(result.current.columns.backlog.requests.length).toBe(
          initialBacklogCount - 1
        );
        expect(result.current.columns['up-next'].requests.length).toBe(
          initialUpNextCount + 1
        );

        // Check that the request has updated status
        const movedRequest = result.current.columns['up-next'].requests.find(
          (r) => r.id === requestToMove.id
        );
        expect(movedRequest?.status).toBe('up-next');
      }
    });

    it('should prevent moving when WIP limit is reached', () => {
      const { result } = renderHook(() => useKanban());

      // Find a client with a request in progress
      const inProgressRequests = result.current.columns['in-progress'].requests;

      if (inProgressRequests.length > 0) {
        const clientWithInProgress = inProgressRequests[0].clientId;

        // Find another request from same client in a different column
        const backlogRequest = result.current.columns.backlog.requests.find(
          (r) => r.clientId === clientWithInProgress
        );

        if (backlogRequest) {
          const initialInProgressCount = inProgressRequests.length;

          act(() => {
            const moved = result.current.moveRequest(
              backlogRequest.id,
              'in-progress'
            );
            expect(moved).toBe(false);
          });

          // Count should not change
          expect(result.current.columns['in-progress'].requests.length).toBe(
            initialInProgressCount
          );
        }
      }
    });

    it('should return false when request is not found', () => {
      const { result } = renderHook(() => useKanban());

      act(() => {
        const moved = result.current.moveRequest('non-existent-id', 'review');
        expect(moved).toBe(false);
      });
    });
  });

  describe('reorderWithinColumn', () => {
    it('should reorder requests within a column', () => {
      const { result } = renderHook(() => useKanban());

      // Find a column with at least 2 requests
      const backlogRequests = result.current.columns.backlog.requests;

      if (backlogRequests.length >= 2) {
        const firstRequest = backlogRequests[0];
        const secondRequest = backlogRequests[1];

        act(() => {
          // Move first request to second position
          result.current.reorderWithinColumn('backlog', firstRequest.id, 1);
        });

        const updatedRequests = result.current.columns.backlog.requests;
        expect(updatedRequests[1].id).toBe(firstRequest.id);
      }
    });

    it('should not affect other columns when reordering', () => {
      const { result } = renderHook(() => useKanban());

      const backlogRequests = result.current.columns.backlog.requests;
      const upNextCount = result.current.columns['up-next'].requests.length;

      if (backlogRequests.length >= 2) {
        act(() => {
          result.current.reorderWithinColumn('backlog', backlogRequests[0].id, 1);
        });

        // Other columns should remain unchanged
        expect(result.current.columns['up-next'].requests.length).toBe(upNextCount);
      }
    });

    it('should handle invalid request id gracefully', () => {
      const { result } = renderHook(() => useKanban());

      act(() => {
        result.current.reorderWithinColumn('backlog', 'non-existent', 0);
      });

      // Should not throw error and state should remain valid
      expect(result.current.columns).toBeDefined();
    });
  });

  describe('Column Structure', () => {
    it('should have correct column titles', () => {
      const { result } = renderHook(() => useKanban());

      expect(result.current.columns.backlog.title).toBe('Backlog');
      expect(result.current.columns['up-next'].title).toBe('Up Next');
      expect(result.current.columns['in-progress'].title).toBe('In Progress');
      expect(result.current.columns.review.title).toBe('Review');
      expect(result.current.columns.done.title).toBe('Done');
    });

    it('should maintain column order', () => {
      const { result } = renderHook(() => useKanban());
      const columnIds = Object.keys(result.current.columns);

      expect(columnIds).toEqual([
        'backlog',
        'up-next',
        'in-progress',
        'review',
        'done',
      ]);
    });
  });

  describe('Request Properties', () => {
    it('should have all required properties on requests', () => {
      const { result } = renderHook(() => useKanban());

      // Check first request in any column
      const allRequests = Object.values(result.current.columns).flatMap(
        (col) => col.requests
      );

      if (allRequests.length > 0) {
        const request = allRequests[0];

        expect(request).toHaveProperty('id');
        expect(request).toHaveProperty('title');
        expect(request).toHaveProperty('description');
        expect(request).toHaveProperty('type');
        expect(request).toHaveProperty('priority');
        expect(request).toHaveProperty('status');
        expect(request).toHaveProperty('clientId');
        expect(request).toHaveProperty('clientName');
        expect(request).toHaveProperty('createdAt');
        expect(request).toHaveProperty('updatedAt');
      }
    });

    it('should have valid request types', () => {
      const { result } = renderHook(() => useKanban());
      const validTypes = [
        'design',
        'development',
        'bug-fix',
        'enhancement',
        'consultation',
      ];

      const allRequests = Object.values(result.current.columns).flatMap(
        (col) => col.requests
      );

      allRequests.forEach((request) => {
        expect(validTypes).toContain(request.type);
      });
    });

    it('should have valid priority levels', () => {
      const { result } = renderHook(() => useKanban());
      const validPriorities = ['low', 'medium', 'high', 'urgent'];

      const allRequests = Object.values(result.current.columns).flatMap(
        (col) => col.requests
      );

      allRequests.forEach((request) => {
        expect(validPriorities).toContain(request.priority);
      });
    });
  });
});
