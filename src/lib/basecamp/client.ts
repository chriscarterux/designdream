// Basecamp API Client for Design Dream

import type {
  BasecampAccount,
  BasecampProject,
  BasecampTodoSet,
  BasecampTodoList,
  BasecampTodo,
  BasecampComment,
  CreateProjectParams,
  CreateTodoListParams,
  CreateTodoParams,
  PostCommentParams,
} from './types';

const BASECAMP_API_BASE = 'https://3.basecampapi.com';
const USER_AGENT = 'Design Dream (hello@designdream.is)';

export class BasecampClient {
  private accountId: string;
  private accessToken: string;

  constructor(accountId: string, accessToken: string) {
    this.accountId = accountId;
    this.accessToken = accessToken;
  }

  /**
   * Make authenticated request to Basecamp API
   */
  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const url = `${BASECAMP_API_BASE}/${this.accountId}${path}`;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'User-Agent': USER_AGENT,
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Basecamp API error: ${response.status} ${response.statusText} - ${error}`
      );
    }

    return response.json();
  }

  // ============================================
  // PROJECTS
  // ============================================

  /**
   * Get all projects
   */
  async getProjects(): Promise<BasecampProject[]> {
    return this.request<BasecampProject[]>('GET', '/projects.json');
  }

  /**
   * Get a single project
   */
  async getProject(projectId: number): Promise<BasecampProject> {
    return this.request<BasecampProject>('GET', `/projects/${projectId}.json`);
  }

  /**
   * Create a new project
   */
  async createProject(params: CreateProjectParams): Promise<BasecampProject> {
    return this.request<BasecampProject>('POST', '/projects.json', params);
  }

  /**
   * Update project
   */
  async updateProject(
    projectId: number,
    params: Partial<CreateProjectParams>
  ): Promise<BasecampProject> {
    return this.request<BasecampProject>(
      'PUT',
      `/projects/${projectId}.json`,
      params
    );
  }

  // ============================================
  // TODO SETS & LISTS
  // ============================================

  /**
   * Get todoset for a project
   */
  async getTodoSet(projectId: number): Promise<BasecampTodoSet> {
    return this.request<BasecampTodoSet>(
      'GET',
      `/buckets/${projectId}/todosets.json`
    );
  }

  /**
   * Get all todo lists in a todoset
   */
  async getTodoLists(
    projectId: number,
    todoSetId: number
  ): Promise<BasecampTodoList[]> {
    return this.request<BasecampTodoList[]>(
      'GET',
      `/buckets/${projectId}/todosets/${todoSetId}/todolists.json`
    );
  }

  /**
   * Get a single todo list
   */
  async getTodoList(
    projectId: number,
    todoListId: number
  ): Promise<BasecampTodoList> {
    return this.request<BasecampTodoList>(
      'GET',
      `/buckets/${projectId}/todolists/${todoListId}.json`
    );
  }

  /**
   * Create a new todo list
   */
  async createTodoList(
    params: CreateTodoListParams
  ): Promise<BasecampTodoList> {
    const { projectId, todoSetId, ...body } = params;
    return this.request<BasecampTodoList>(
      'POST',
      `/buckets/${projectId}/todosets/${todoSetId}/todolists.json`,
      body
    );
  }

  // ============================================
  // TODOS
  // ============================================

  /**
   * Get all todos in a list
   */
  async getTodos(
    projectId: number,
    todoListId: number
  ): Promise<BasecampTodo[]> {
    return this.request<BasecampTodo[]>(
      'GET',
      `/buckets/${projectId}/todolists/${todoListId}/todos.json`
    );
  }

  /**
   * Get a single todo
   */
  async getTodo(projectId: number, todoId: number): Promise<BasecampTodo> {
    return this.request<BasecampTodo>(
      'GET',
      `/buckets/${projectId}/todos/${todoId}.json`
    );
  }

  /**
   * Create a new todo
   */
  async createTodo(params: CreateTodoParams): Promise<BasecampTodo> {
    const { projectId, todoListId, ...body } = params;
    return this.request<BasecampTodo>(
      'POST',
      `/buckets/${projectId}/todolists/${todoListId}/todos.json`,
      body
    );
  }

  /**
   * Update a todo
   */
  async updateTodo(
    projectId: number,
    todoId: number,
    params: Partial<Omit<CreateTodoParams, 'projectId' | 'todoListId'>>
  ): Promise<BasecampTodo> {
    return this.request<BasecampTodo>(
      'PUT',
      `/buckets/${projectId}/todos/${todoId}.json`,
      params
    );
  }

  /**
   * Complete a todo
   */
  async completeTodo(projectId: number, todoId: number): Promise<void> {
    await this.request<void>(
      'POST',
      `/buckets/${projectId}/todos/${todoId}/completion.json`,
      {}
    );
  }

  /**
   * Uncomplete a todo
   */
  async uncompleteTodo(projectId: number, todoId: number): Promise<void> {
    await this.request<void>(
      'DELETE',
      `/buckets/${projectId}/todos/${todoId}/completion.json`
    );
  }

  // ============================================
  // COMMENTS
  // ============================================

  /**
   * Post a comment on any recording (todo, message, etc.)
   */
  async postComment(params: PostCommentParams): Promise<BasecampComment> {
    const { projectId, recordingId, content } = params;
    return this.request<BasecampComment>(
      'POST',
      `/buckets/${projectId}/recordings/${recordingId}/comments.json`,
      { content }
    );
  }

  /**
   * Get comments for a recording
   */
  async getComments(
    projectId: number,
    recordingId: number
  ): Promise<BasecampComment[]> {
    return this.request<BasecampComment[]>(
      'GET',
      `/buckets/${projectId}/recordings/${recordingId}/comments.json`
    );
  }

  // ============================================
  // WEBHOOKS
  // ============================================

  /**
   * Register a webhook for a project
   */
  async registerWebhook(
    projectId: number,
    callbackUrl: string
  ): Promise<{ id: number; url: string }> {
    return this.request<{ id: number; url: string }>(
      'POST',
      `/buckets/${projectId}/webhooks.json`,
      {
        payload_url: callbackUrl,
      }
    );
  }

  /**
   * List webhooks for a project
   */
  async listWebhooks(
    projectId: number
  ): Promise<Array<{ id: number; url: string; active: boolean }>> {
    return this.request<Array<{ id: number; url: string; active: boolean }>>(
      'GET',
      `/buckets/${projectId}/webhooks.json`
    );
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(projectId: number, webhookId: number): Promise<void> {
    await this.request<void>(
      'DELETE',
      `/buckets/${projectId}/webhooks/${webhookId}.json`
    );
  }

  // ============================================
  // PEOPLE
  // ============================================

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return this.request('GET', '/my/profile.json');
  }

  /**
   * Get all people in account
   */
  async getPeople() {
    return this.request('GET', '/people.json');
  }

  /**
   * Grant access to a project
   */
  async grantAccess(projectId: number, personIds: number[]): Promise<void> {
    await this.request('PUT', `/projects/${projectId}/people/users.json`, {
      grant: personIds,
    });
  }

  /**
   * Revoke access from a project
   */
  async revokeAccess(projectId: number, personIds: number[]): Promise<void> {
    await this.request('PUT', `/projects/${projectId}/people/users.json`, {
      revoke: personIds,
    });
  }
}

/**
 * Create a Basecamp client instance
 */
export function createBasecampClient(
  accountId?: string,
  accessToken?: string
): BasecampClient {
  const account = accountId || process.env.BASECAMP_ACCOUNT_ID;
  const token = accessToken || process.env.BASECAMP_ACCESS_TOKEN;

  if (!account || !token) {
    throw new Error(
      'Basecamp credentials not configured. Set BASECAMP_ACCOUNT_ID and BASECAMP_ACCESS_TOKEN environment variables.'
    );
  }

  return new BasecampClient(account, token);
}

/**
 * Get Basecamp client (server-side only)
 */
export function getBasecampClient(): BasecampClient {
  return createBasecampClient();
}
