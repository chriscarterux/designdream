/**
 * Linear API Types
 * Based on: https://developers.linear.app/docs/graphql/working-with-the-graphql-api
 */

/**
 * Linear webhook payload structure
 */
export interface LinearWebhookPayload {
  action: 'create' | 'update' | 'remove';
  type: 'Issue' | 'Comment' | 'Project';
  data: LinearIssue | LinearComment | LinearProject;
  url: string;
  createdAt: string;
  updatedFrom?: Partial<LinearIssue>;
  organizationId: string;
  webhookTimestamp: number;
  webhookId: string;
}

/**
 * Linear Issue from API or webhook
 */
export interface LinearIssue {
  id: string;
  identifier: string; // e.g., "HOW-123"
  title: string;
  description?: string;
  priority: number; // 0=None, 1=Urgent, 2=High, 3=Normal, 4=Low
  priorityLabel: string;
  state: LinearWorkflowState;
  team: LinearTeam;
  assignee?: LinearUser;
  creator: LinearUser;
  project?: LinearProject;
  labels: LinearLabel[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  canceledAt?: string;
  dueDate?: string;
  estimate?: number;
  url: string;
  branchName?: string;
  comments: LinearComment[];
}

/**
 * Linear workflow state (e.g., Backlog, Todo, In Progress, Done)
 */
export interface LinearWorkflowState {
  id: string;
  name: string;
  type: 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled';
  color: string;
  position: number;
}

/**
 * Linear team
 */
export interface LinearTeam {
  id: string;
  name: string;
  key: string; // e.g., "HOW"
}

/**
 * Linear user
 */
export interface LinearUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  displayName?: string;
  active: boolean;
}

/**
 * Linear project
 */
export interface LinearProject {
  id: string;
  name: string;
  description?: string;
  state: string;
  targetDate?: string;
  startDate?: string;
  lead?: LinearUser;
  url: string;
}

/**
 * Linear label
 */
export interface LinearLabel {
  id: string;
  name: string;
  color: string;
  description?: string;
}

/**
 * Linear comment
 */
export interface LinearComment {
  id: string;
  body: string;
  user: LinearUser;
  issue: {
    id: string;
    identifier: string;
  };
  createdAt: string;
  updatedAt: string;
  url: string;
}

/**
 * Comment payload to post to Linear
 */
export interface LinearCommentInput {
  body: string; // Markdown content
  issueId: string;
}

/**
 * Task complexity analysis result from Claude
 */
export interface TaskComplexityAnalysis {
  complexity: 'SIMPLE' | 'COMPLEX';
  estimatedHours: number;
  reasoning: string;
  suggestedAction: string;
  suggestedSubtasks?: string[];
}

/**
 * SLA tracking metrics
 */
export interface IssueSLAMetrics {
  issueId: string;
  identifier: string;
  createdAt: string;
  firstResponseAt?: string;
  startedAt?: string; // Moved to "In Progress"
  completedAt?: string; // Moved to "Done"
  responseTimeMinutes?: number;
  resolutionTimeMinutes?: number;
  slaStatus: 'met' | 'at-risk' | 'breached';
}

/**
 * Linear GraphQL query result types
 */
export interface LinearAPIResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: any;
  }>;
}

export interface IssueQueryResult {
  issue: LinearIssue;
}

export interface IssuesQueryResult {
  issues: {
    nodes: LinearIssue[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

export interface CommentMutationResult {
  commentCreate: {
    success: boolean;
    comment: LinearComment;
  };
}
