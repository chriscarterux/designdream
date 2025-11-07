/**
 * Basecamp 3 API Webhook Types
 * Based on: https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md
 */

export interface BasecampWebhookPayload {
  id: number;
  kind: string;
  details: Record<string, any>;
  created_at: string;
  recording: BasecampRecording;
  creator: BasecampPerson;
  bucket?: BasecampBucket;
}

export interface BasecampRecording {
  id: number;
  status: 'active' | 'archived' | 'trashed';
  type: string;
  title: string;
  url: string;
  app_url?: string;
}

export interface BasecampPerson {
  id: number;
  attachable_sgid?: string;
  name: string;
  email_address?: string;
  personable_type?: string;
  title?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  admin?: boolean;
  owner?: boolean;
  avatar_url?: string;
  company?: {
    id: number;
    name: string;
  };
}

export interface BasecampBucket {
  id: number;
  name: string;
  type: string;
}

/**
 * Full Todo object from Basecamp API
 * This is fetched separately after receiving webhook
 * as webhook payloads have limited detail
 */
export interface BasecampTodo {
  id: number;
  status: 'active' | 'archived' | 'trashed';
  type: 'Todo';
  title: string;
  description: string;
  completed: boolean;
  completion: string | null;
  content: string;
  url: string;
  app_url: string;
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
  created_at: string;
  updated_at: string;
  comments_count: number;
  comments_url: string;
  assignees: BasecampPerson[];
}

/**
 * Comment payload to post to Basecamp
 */
export interface BasecampCommentPayload {
  content: string; // HTML content
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
