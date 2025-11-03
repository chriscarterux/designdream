'use client';

import { KanbanBoard } from '@/components/kanban/kanban-board';
import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function QueuePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCardClick = (requestId: string) => {
    // TODO: Open request details modal/drawer
    console.log('Card clicked:', requestId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Request Queue</h1>
            <p className="text-muted-foreground mt-1">
              Manage and prioritize client requests
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#6E56CF] text-white font-medium hover:bg-[#5D47B8] transition-colors"
            onClick={() => {
              // TODO: Open new request dialog
              console.log('Add new request');
            }}
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#6E56CF] focus:border-transparent"
            />
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            onClick={() => {
              // TODO: Open filter menu
              console.log('Open filters');
            }}
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto py-6">
        <KanbanBoard onCardClick={handleCardClick} />
      </div>

      {/* Info Footer */}
      <div className="border-t pt-4 pb-2">
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Urgent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span>Low</span>
          </div>
          <div className="ml-auto">
            <span className="font-medium">Tip:</span> Drag cards to move between columns or reorder within a column
          </div>
        </div>
      </div>
    </div>
  );
}
