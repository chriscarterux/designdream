// Basecamp API Types for Design Dream

export interface BasecampAccount {
  id: number;
  name: string;
  href: string;
  product: string;
}

export interface BasecampProject {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  url: string;
  app_url: string;
  dock: BasecampDock[];
  bookmarked: boolean;
}

export interface BasecampDock {
  id: number;
  title: string;
  name: string;
  enabled: boolean;
  position: number | null;
  url: string;
  app_url: string;
}

export interface BasecampTodoSet {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  type: string;
  url: string;
  app_url: string;
  title: string;
  name: string;
  completed: boolean;
  completed_ratio: string;
  todolists_count: number;
  todolists_url: string;
}

export interface BasecampTodoList {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  title: string;
  type: string;
  url: string;
  app_url: string;
  parent: {
    id: number;
    title: string;
    type: string;
    url: string;
    app_url: string;
  };
  bucket: {
    id: number;
    name: string;
    type: string;
  };
  todos_url: string;
  completed: boolean;
  completed_ratio: string;
  name: string;
  todos_count: number;
}

export interface BasecampTodo {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  title: string;
  inherits_status: boolean;
  type: string;
  url: string;
  app_url: string;
  content: string;
  description: string;
  completed: boolean;
  starts_on: string | null;
  due_on: string | null;
  assignees: BasecampPerson[];
  completion: BasecampCompletion | null;
  bucket: {
    id: number;
    name: string;
    type: string;
  };
  creator: BasecampPerson;
  parent: {
    id: number;
    title: string;
    type: string;
    url: string;
    app_url: string;
  };
  comments_count: number;
  comments_url: string;
  position: number;
}

export interface BasecampPerson {
  id: number;
  attachable_sgid: string;
  name: string;
  email_address: string;
  personable_type: string;
  title: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
  admin: boolean;
  owner: boolean;
  time_zone: string;
  avatar_url: string;
  company: {
    id: number;
    name: string;
  };
}

export interface BasecampCompletion {
  created_at: string;
  creator: BasecampPerson;
}

export interface BasecampComment {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  title: string;
  inherits_status: boolean;
  type: string;
  url: string;
  app_url: string;
  parent: {
    id: number;
    title: string;
    type: string;
    url: string;
    app_url: string;
  };
  bucket: {
    id: number;
    name: string;
    type: string;
  };
  creator: BasecampPerson;
  content: string;
}

export interface BasecampWebhookPayload {
  id: number;
  kind: string;
  details: {
    id: number;
    title?: string;
    content?: string;
    description?: string;
    url: string;
    app_url: string;
    type: string;
    bucket: {
      id: number;
      name: string;
      type: string;
    };
    creator?: BasecampPerson;
    parent?: {
      id: number;
      title: string;
      type: string;
      url: string;
      app_url: string;
    };
  };
  creator: {
    id: number;
    name: string;
    email_address: string;
    avatar_url: string;
  };
  created_at: string;
  recording: {
    id: number;
    status: string;
    created_at: string;
    updated_at: string;
    title: string;
    inherits_status: boolean;
    type: string;
    url: string;
    app_url: string;
    bucket: {
      id: number;
      name: string;
      type: string;
    };
    creator: BasecampPerson;
    content?: string;
  };
}

// Request Analysis Types
export interface RequestAnalysis {
  complexity: 'SIMPLE' | 'COMPLEX';
  estimated_hours: number;
  reasoning: string;
  task_breakdown?: TaskBreakdown[];
}

export interface TaskBreakdown {
  phase: string;
  tasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  estimated_hours: number;
}

// Project Creation Types
export interface CreateProjectParams {
  name: string;
  description: string;
}

export interface CreateTodoListParams {
  projectId: number;
  todoSetId: number;
  name: string;
  description?: string;
}

export interface CreateTodoParams {
  projectId: number;
  todoListId: number;
  content: string;
  description?: string;
  due_on?: string;
  assignee_ids?: number[];
}

export interface PostCommentParams {
  projectId: number;
  recordingId: number;
  content: string;
}
