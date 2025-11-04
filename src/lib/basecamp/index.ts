// Basecamp Integration - Main Exports

// Client
export { BasecampClient, createBasecampClient, getBasecampClient } from './client';

// Project Setup
export {
  createCustomerProject,
  inviteCustomerToProject,
  archiveCompletedTasks,
  findCustomerProject,
} from './project-setup';

// Types
export type {
  BasecampAccount,
  BasecampProject,
  BasecampTodoSet,
  BasecampTodoList,
  BasecampTodo,
  BasecampComment,
  BasecampPerson,
  BasecampWebhookPayload,
  RequestAnalysis,
  TaskBreakdown,
  CreateProjectParams,
  CreateTodoListParams,
  CreateTodoParams,
  PostCommentParams,
} from './types';
