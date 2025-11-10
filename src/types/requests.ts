// Request Types for Design Dream
// These types are used for requests managed in Linear

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
  linearIssueId?: string; // Linear issue ID
  linearProjectId?: string; // Linear project ID
}

// Linear-specific types
export interface LinearProject {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  createdAt: string;
  status: 'active' | 'paused' | 'archived';
}

export interface LinearIssue {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  projectId: string;
  assigneeIds: string[];
  createdAt: string;
  completedAt?: string;
}
