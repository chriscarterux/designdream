'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QueueFilters, Client } from '@/types/queue';

interface QueueFiltersProps {
  filters: QueueFilters;
  onFiltersChange: (filters: QueueFilters) => void;
  clients: Client[];
}

export function QueueFiltersComponent({
  filters,
  onFiltersChange,
  clients,
}: QueueFiltersProps) {
  const activeFilterCount =
    filters.clientIds.length +
    filters.priorities.length +
    filters.types.length +
    filters.statuses.length +
    (filters.search ? 1 : 0);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const toggleClientFilter = (clientId: string) => {
    const newClientIds = filters.clientIds.includes(clientId)
      ? filters.clientIds.filter((id) => id !== clientId)
      : [...filters.clientIds, clientId];
    onFiltersChange({ ...filters, clientIds: newClientIds });
  };

  const togglePriorityFilter = (priority: 'urgent' | 'high' | 'medium' | 'low') => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const toggleTypeFilter = (type: 'design' | 'development' | 'ai') => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const toggleStatusFilter = (
    status: 'backlog' | 'in_queue' | 'in_progress' | 'in_review' | 'completed'
  ) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      clientIds: [],
      priorities: [],
      types: [],
      statuses: [],
      search: '',
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Clear */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by title, ID, or client..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {/* Client Filters */}
        <div className="flex flex-wrap gap-2">
          {clients.map((client) => {
            const isActive = filters.clientIds.includes(client.id);
            return (
              <Button
                key={client.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleClientFilter(client.id)}
                className="gap-2"
                style={
                  isActive
                    ? {
                        backgroundColor: client.color,
                        borderColor: client.color,
                      }
                    : {}
                }
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: client.color }}
                />
                {client.name}
              </Button>
            );
          })}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Priority Filters */}
        <Button
          variant={filters.priorities.includes('urgent') ? 'default' : 'outline'}
          size="sm"
          onClick={() => togglePriorityFilter('urgent')}
          className={
            filters.priorities.includes('urgent')
              ? 'bg-red-600 hover:bg-red-700'
              : ''
          }
        >
          Urgent
        </Button>
        <Button
          variant={filters.priorities.includes('high') ? 'default' : 'outline'}
          size="sm"
          onClick={() => togglePriorityFilter('high')}
          className={
            filters.priorities.includes('high')
              ? 'bg-orange-600 hover:bg-orange-700'
              : ''
          }
        >
          High
        </Button>
        <Button
          variant={filters.priorities.includes('medium') ? 'default' : 'outline'}
          size="sm"
          onClick={() => togglePriorityFilter('medium')}
          className={
            filters.priorities.includes('medium')
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : ''
          }
        >
          Medium
        </Button>
        <Button
          variant={filters.priorities.includes('low') ? 'default' : 'outline'}
          size="sm"
          onClick={() => togglePriorityFilter('low')}
          className={
            filters.priorities.includes('low')
              ? 'bg-blue-600 hover:bg-blue-700'
              : ''
          }
        >
          Low
        </Button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Type Filters */}
        <Button
          variant={filters.types.includes('design') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleTypeFilter('design')}
          className={
            filters.types.includes('design')
              ? 'bg-purple-600 hover:bg-purple-700'
              : ''
          }
        >
          Design
        </Button>
        <Button
          variant={filters.types.includes('development') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleTypeFilter('development')}
          className={
            filters.types.includes('development')
              ? 'bg-green-600 hover:bg-green-700'
              : ''
          }
        >
          Development
        </Button>
        <Button
          variant={filters.types.includes('ai') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleTypeFilter('ai')}
          className={
            filters.types.includes('ai') ? 'bg-indigo-600 hover:bg-indigo-700' : ''
          }
        >
          AI
        </Button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Status Filters */}
        <Button
          variant={filters.statuses.includes('backlog') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleStatusFilter('backlog')}
        >
          Backlog
        </Button>
        <Button
          variant={filters.statuses.includes('in_queue') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleStatusFilter('in_queue')}
        >
          In Queue
        </Button>
        <Button
          variant={filters.statuses.includes('in_progress') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleStatusFilter('in_progress')}
        >
          In Progress
        </Button>
        <Button
          variant={filters.statuses.includes('in_review') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleStatusFilter('in_review')}
        >
          In Review
        </Button>
        <Button
          variant={filters.statuses.includes('completed') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleStatusFilter('completed')}
        >
          Completed
        </Button>
      </div>
    </div>
  );
}
