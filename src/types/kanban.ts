export type RequestPriority = 'urgent' | 'high' | 'medium' | 'low';
export type RequestType = 'design' | 'development' | 'bug-fix' | 'enhancement' | 'consultation';
export type RequestStatus = 'backlog' | 'up-next' | 'in-progress' | 'review' | 'done';

export interface Request {
  id: string;
  title: string;
  description?: string;
  type: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  timeline?: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: RequestStatus;
  title: string;
  requests: Request[];
  wipLimit?: number;
}

export interface KanbanState {
  columns: Record<RequestStatus, Column>;
}

export interface DragEndEvent {
  active: {
    id: string;
  };
  over: {
    id: string;
  } | null;
}
