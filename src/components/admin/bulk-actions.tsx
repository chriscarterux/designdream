'use client';

import { CheckSquare, X, Flag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RequestStatus } from '@/types/queue';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkUpdateStatus: (status: RequestStatus) => void;
  onBulkUpdatePriority: (priority: 'urgent' | 'high' | 'medium' | 'low') => void;
}

export function BulkActions({
  selectedCount,
  onClearSelection,
  onBulkUpdateStatus,
  onBulkUpdatePriority,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          {/* Selection Info */}
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-slate-900">
              {selectedCount} selected
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Status Update */}
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-slate-500" />
            <Select onValueChange={(value) => onBulkUpdateStatus(value as RequestStatus)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="in_queue">In Queue</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Update */}
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-slate-500" />
            <Select
              onValueChange={(value) =>
                onBulkUpdatePriority(value as 'urgent' | 'high' | 'medium' | 'low')
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Change priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Urgent
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    High
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    Medium
                  </span>
                </SelectItem>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Low
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Clear Selection */}
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
