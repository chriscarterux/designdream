/**
 * Basecamp 3 API Integration
 * Handles fetching todos and posting comments
 */

import axios from 'axios';
import type {
  BasecampTodo,
  BasecampCommentPayload,
} from '@/types/basecamp.types';

const BASECAMP_API_URL = 'https://3.basecampapi.com';
const BASECAMP_ACCOUNT_ID = process.env.BASECAMP_ACCOUNT_ID || '5909943';
const BASECAMP_ACCESS_TOKEN = process.env.BASECAMP_ACCESS_TOKEN;

if (!BASECAMP_ACCESS_TOKEN) {
  console.warn('BASECAMP_ACCESS_TOKEN environment variable is not set');
}

/**
 * Create axios instance with Basecamp authentication
 */
const basecampClient = axios.create({
  baseURL: `${BASECAMP_API_URL}/${BASECAMP_ACCOUNT_ID}`,
  headers: {
    Authorization: `Bearer ${BASECAMP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'DesignDream Webhook Handler (hello@designdream.is)',
  },
});

/**
 * Fetch full todo details from Basecamp
 * @param bucketId - The project/bucket ID
 * @param todoId - The todo ID
 * @returns Full todo object with description, assignees, etc.
 */
export async function fetchTodoDetails(
  bucketId: number,
  todoId: number
): Promise<BasecampTodo> {
  try {
    const response = await basecampClient.get<BasecampTodo>(
      `/buckets/${bucketId}/todos/${todoId}.json`
    );

    console.log(`Fetched todo ${todoId} from bucket ${bucketId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch todo details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(
        `Basecamp API error: ${error.response?.status} ${error.response?.statusText}`
      );
    }
    throw error;
  }
}

/**
 * Post a comment to a Basecamp recording (todo, message, etc.)
 * @param bucketId - The project/bucket ID
 * @param recordingId - The recording (todo) ID
 * @param content - HTML content to post
 * @returns The created comment object
 */
export async function postComment(
  bucketId: number,
  recordingId: number,
  content: string
): Promise<any> {
  try {
    const payload: BasecampCommentPayload = {
      content,
    };

    const response = await basecampClient.post(
      `/buckets/${bucketId}/recordings/${recordingId}/comments.json`,
      payload
    );

    console.log(`Posted comment to recording ${recordingId} in bucket ${bucketId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to post comment:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(
        `Basecamp API error: ${error.response?.status} ${error.response?.statusText}`
      );
    }
    throw error;
  }
}

/**
 * Format analysis result as HTML for Basecamp comment
 * @param analysis - Task complexity analysis from Claude
 * @returns HTML-formatted comment content
 */
export function formatAnalysisAsComment(analysis: {
  complexity: 'SIMPLE' | 'COMPLEX';
  estimatedHours: number;
  reasoning: string;
  suggestedAction: string;
  suggestedSubtasks?: string[];
}): string {
  const isSimple = analysis.complexity === 'SIMPLE';
  const statusEmoji = isSimple ? '✅' : '🔍';
  const statusColor = isSimple ? '#22c55e' : '#f59e0b';

  let html = `<div>
    <p><strong style="color: ${statusColor};">${statusEmoji} Task Complexity Analysis</strong></p>
    <p><strong>Classification:</strong> ${analysis.complexity} (${analysis.estimatedHours} hours estimated)</p>
    <p><strong>Reasoning:</strong> ${analysis.reasoning}</p>
    <p><strong>Next Steps:</strong> ${analysis.suggestedAction}</p>`;

  if (analysis.suggestedSubtasks && analysis.suggestedSubtasks.length > 0) {
    html += `<p><strong>Suggested Breakdown:</strong></p><ul>`;
    analysis.suggestedSubtasks.forEach((subtask) => {
      html += `<li>${subtask}</li>`;
    });
    html += `</ul>`;
  }

  html += `<p><em>Analyzed by DesignDream AI</em></p></div>`;

  return html;
}
