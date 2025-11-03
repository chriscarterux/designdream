export type RequestPriority = 'urgent' | 'high' | 'medium' | 'low';
export type RequestType = 'design' | 'development' | 'ai';
export type RequestStatus = 'backlog' | 'in_queue' | 'in_progress' | 'in_review' | 'completed';

export interface Client {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface Request {
  id: string;
  title: string;
  description?: string;
  client: Client;
  priority: RequestPriority;
  type: RequestType;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  dueAt: Date;
  assignedTo?: string;
}

export interface QueueColumn {
  id: RequestStatus;
  title: string;
  description: string;
  requests: Request[];
}

export interface QueueFilters {
  clientIds: string[];
  priorities: RequestPriority[];
  types: RequestType[];
  statuses: RequestStatus[];
  search: string;
}

export interface QueueStats {
  total: number;
  byStatus: Record<RequestStatus, number>;
  byClient: Record<string, number>;
  avgTimeByStage: Record<RequestStatus, number>;
  slaComplianceRate: number;
}

export interface BulkAction {
  type: 'status' | 'priority' | 'assign';
  value: string;
  requestIds: string[];
}
