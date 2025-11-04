// Request Types for Design Dream
// These types are used for requests managed in Basecamp

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
  basecampTodoId?: string; // Basecamp to-do item ID
  basecampProjectId?: string; // Basecamp project ID
}

// Basecamp-specific types
export interface BasecampProject {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  createdAt: string;
  status: 'active' | 'paused' | 'archived';
}

export interface BasecampTodo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  todoListId: string;
  assigneeIds: string[];
  createdAt: string;
  completedAt?: string;
}
