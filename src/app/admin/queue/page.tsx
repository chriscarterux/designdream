'use client';

import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QueueFiltersComponent } from '@/components/admin/queue-filters';
import { QueueStatsComponent } from '@/components/admin/queue-stats';
import { GlobalKanban } from '@/components/admin/global-kanban';
import { BulkActions } from '@/components/admin/bulk-actions';
import { useAdminQueue } from '@/hooks/use-admin-queue';
import { QueueColumn, Request } from '@/types/queue';

export default function GlobalQueuePage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const {
    columns,
    stats,
    filters,
    setFilters,
    selectedIds,
    toggleSelection,
    clearSelection,
    updateRequestStatus,
    bulkUpdateStatus,
    bulkUpdatePriority,
    clients,
  } = useAdminQueue();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Global Queue
          </h1>
          <p className="mt-2 text-slate-600">
            All requests across all clients in one unified view
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
            className={viewMode === 'kanban' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Kanban
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <QueueStatsComponent stats={stats} />

      {/* Filters */}
      <QueueFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        clients={clients}
      />

      {/* Main Content */}
      {viewMode === 'kanban' ? (
        <GlobalKanban
          columns={columns}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onUpdateStatus={updateRequestStatus}
        />
      ) : (
        <ListView
          columns={columns}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
        />
      )}

      {/* Bulk Actions Toolbar */}
      <BulkActions
        selectedCount={selectedIds.size}
        onClearSelection={clearSelection}
        onBulkUpdateStatus={(status) => {
          bulkUpdateStatus(Array.from(selectedIds), status);
        }}
        onBulkUpdatePriority={(priority) => {
          bulkUpdatePriority(Array.from(selectedIds), priority);
        }}
      />
    </div>
  );
}

// List View Component (fallback for non-kanban view)
function ListView({
  columns,
  selectedIds,
  onToggleSelection,
}: {
  columns: QueueColumn[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {columns.map((column) => (
        <div key={column.id} className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">
            {column.title} ({column.requests.length})
          </h3>
          <div className="space-y-2">
            {column.requests.map((request: Request) => (
              <div
                key={request.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(request.id)}
                      onChange={() => onToggleSelection(request.id)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <div>
                      <h4 className="font-medium text-slate-900">{request.title}</h4>
                      <p className="text-sm text-slate-500">
                        {request.id} • {request.client.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {request.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
