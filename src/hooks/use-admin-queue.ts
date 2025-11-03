'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Request,
  QueueFilters,
  QueueStats,
  RequestStatus,
  Client,
} from '@/types/queue';

// Mock data - replace with actual API calls
const mockClients: Client[] = [
  { id: '1', name: 'Acme Corp', color: '#3B82F6' },
  { id: '2', name: 'Tech Startup', color: '#10B981' },
  { id: '3', name: 'Design Studio', color: '#F59E0B' },
  { id: '4', name: 'E-commerce Co', color: '#8B5CF6' },
  { id: '5', name: 'Finance Inc', color: '#EC4899' },
];

const generateMockRequests = (): Request[] => {
  const statuses: RequestStatus[] = [
    'backlog',
    'in_queue',
    'in_progress',
    'in_review',
    'completed',
  ];
  const priorities = ['urgent', 'high', 'medium', 'low'] as const;
  const types = ['design', 'development', 'ai'] as const;
  const titles = [
    'Homepage redesign',
    'API integration',
    'Logo variations',
    'Database optimization',
    'User authentication',
    'Payment gateway',
    'Mobile app UI',
    'Email templates',
    'SEO optimization',
    'Performance audit',
    'Content migration',
    'Social media graphics',
    'Landing page',
    'Blog redesign',
    'Dashboard analytics',
  ];

  return Array.from({ length: 45 }, (_, i) => {
    const client = mockClients[i % mockClients.length];
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const hoursUntilDue = Math.random() * 72;

    return {
      id: `REQ-${String(i + 1).padStart(3, '0')}`,
      title: titles[i % titles.length],
      description: 'Request description goes here',
      client,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt,
      updatedAt: createdAt,
      dueAt: new Date(Date.now() + hoursUntilDue * 60 * 60 * 1000),
      assignedTo: i % 3 === 0 ? 'Designer A' : i % 3 === 1 ? 'Developer B' : undefined,
    };
  });
};

const defaultFilters: QueueFilters = {
  clientIds: [],
  priorities: [],
  types: [],
  statuses: [],
  search: '',
};

export function useAdminQueue() {
  const [requests, setRequests] = useState<Request[]>(generateMockRequests());
  const [filters, setFilters] = useState<QueueFilters>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Client filter
      if (filters.clientIds.length > 0 && !filters.clientIds.includes(request.client.id)) {
        return false;
      }

      // Priority filter
      if (filters.priorities.length > 0 && !filters.priorities.includes(request.priority)) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(request.type)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(request.status)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          request.title.toLowerCase().includes(searchLower) ||
          request.id.toLowerCase().includes(searchLower) ||
          request.client.name.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [requests, filters]);

  // Group requests by status
  const columns = useMemo(() => {
    const statusOrder: RequestStatus[] = [
      'backlog',
      'in_queue',
      'in_progress',
      'in_review',
      'completed',
    ];

    return statusOrder.map((status) => ({
      id: status,
      title: status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      description: getStatusDescription(status),
      requests: filteredRequests.filter((r) => r.status === status),
    }));
  }, [filteredRequests]);

  // Calculate statistics
  const stats = useMemo((): QueueStats => {
    const byStatus: Record<RequestStatus, number> = {
      backlog: 0,
      in_queue: 0,
      in_progress: 0,
      in_review: 0,
      completed: 0,
    };

    const byClient: Record<string, number> = {};

    filteredRequests.forEach((request) => {
      byStatus[request.status]++;
      byClient[request.client.name] = (byClient[request.client.name] || 0) + 1;
    });

    // Calculate SLA compliance (requests completed before due date)
    const completedRequests = filteredRequests.filter((r) => r.status === 'completed');
    const onTimeRequests = completedRequests.filter((r) => r.updatedAt <= r.dueAt);
    const slaComplianceRate =
      completedRequests.length > 0
        ? (onTimeRequests.length / completedRequests.length) * 100
        : 100;

    return {
      total: filteredRequests.length,
      byStatus,
      byClient,
      avgTimeByStage: {
        backlog: 2,
        in_queue: 4,
        in_progress: 8,
        in_review: 2,
        completed: 0,
      },
      slaComplianceRate,
    };
  }, [filteredRequests]);

  // Update request status (drag and drop)
  const updateRequestStatus = useCallback(
    (requestId: string, newStatus: RequestStatus) => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status: newStatus, updatedAt: new Date() }
            : req
        )
      );
    },
    []
  );

  // Bulk update
  const bulkUpdateStatus = useCallback((requestIds: string[], newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        requestIds.includes(req.id)
          ? { ...req, status: newStatus, updatedAt: new Date() }
          : req
      )
    );
    setSelectedIds(new Set());
  }, []);

  // Bulk update priority
  const bulkUpdatePriority = useCallback(
    (requestIds: string[], newPriority: Request['priority']) => {
      setRequests((prev) =>
        prev.map((req) =>
          requestIds.includes(req.id)
            ? { ...req, priority: newPriority, updatedAt: new Date() }
            : req
        )
      );
      setSelectedIds(new Set());
    },
    []
  );

  // Toggle selection
  const toggleSelection = useCallback((requestId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(requestId)) {
        next.delete(requestId);
      } else {
        next.add(requestId);
      }
      return next;
    });
  }, []);

  // Select all in column
  const selectAllInColumn = useCallback((status: RequestStatus) => {
    const columnRequests = filteredRequests.filter((r) => r.status === status);
    setSelectedIds(new Set(columnRequests.map((r) => r.id)));
  }, [filteredRequests]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    requests: filteredRequests,
    columns,
    stats,
    filters,
    setFilters,
    selectedIds,
    toggleSelection,
    selectAllInColumn,
    clearSelection,
    updateRequestStatus,
    bulkUpdateStatus,
    bulkUpdatePriority,
    clients: mockClients,
  };
}

function getStatusDescription(status: RequestStatus): string {
  switch (status) {
    case 'backlog':
      return 'Future requests not yet prioritized';
    case 'in_queue':
      return 'Waiting to be started';
    case 'in_progress':
      return 'Currently being worked on';
    case 'in_review':
      return 'Awaiting client feedback';
    case 'completed':
      return 'Delivered and approved';
  }
}
