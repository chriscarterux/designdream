/**
 * Linear API Integration
 * Handles fetching issues and posting comments
 */

import type {
  LinearIssue,
  LinearComment,
  LinearCommentInput,
  LinearAPIResponse,
  IssueQueryResult,
  CommentMutationResult,
  TaskComplexityAnalysis,
} from '@/types/linear.types';

const LINEAR_API_URL = 'https://api.linear.app/graphql';
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

if (!LINEAR_API_KEY) {
  console.warn('LINEAR_API_KEY environment variable is not set');
}

if (!LINEAR_TEAM_ID) {
  console.warn('LINEAR_TEAM_ID environment variable is not set');
}

/**
 * Make a GraphQL request to Linear API
 */
async function linearGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const response = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: LINEAR_API_KEY || '',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Linear API HTTP error: ${response.status} ${response.statusText}`
    );
  }

  const result: LinearAPIResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    console.error('Linear API errors:', result.errors);
    throw new Error(
      `Linear API error: ${result.errors[0].message}`
    );
  }

  if (!result.data) {
    throw new Error('Linear API returned no data');
  }

  return result.data;
}

/**
 * Fetch full issue details from Linear
 * @param issueId - The issue ID or identifier (e.g., "HOW-123")
 * @returns Full issue object with description, assignees, etc.
 */
export async function fetchIssueDetails(
  issueId: string
): Promise<LinearIssue> {
  const query = `
    query GetIssue($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        description
        priority
        priorityLabel
        state {
          id
          name
          type
          color
          position
        }
        team {
          id
          name
          key
        }
        assignee {
          id
          name
          email
          avatarUrl
          displayName
          active
        }
        creator {
          id
          name
          email
          avatarUrl
          displayName
          active
        }
        project {
          id
          name
          description
          state
          targetDate
          startDate
          url
        }
        labels {
          nodes {
            id
            name
            color
            description
          }
        }
        createdAt
        updatedAt
        completedAt
        canceledAt
        dueDate
        estimate
        url
        branchName
      }
    }
  `;

  try {
    const result = await linearGraphQL<IssueQueryResult>(query, {
      id: issueId,
    });

    console.log(`Fetched issue ${result.issue.identifier} from Linear`);
    return result.issue;
  } catch (error) {
    console.error('Failed to fetch issue details:', error);
    throw error;
  }
}

/**
 * Post a comment to a Linear issue
 * @param issueId - The issue ID
 * @param body - Markdown content to post
 * @returns The created comment object
 */
export async function postComment(
  issueId: string,
  body: string
): Promise<LinearComment> {
  const mutation = `
    mutation CreateComment($input: CommentCreateInput!) {
      commentCreate(input: $input) {
        success
        comment {
          id
          body
          user {
            id
            name
            email
            avatarUrl
          }
          issue {
            id
            identifier
          }
          createdAt
          updatedAt
          url
        }
      }
    }
  `;

  const input: LinearCommentInput = {
    issueId,
    body,
  };

  try {
    const result = await linearGraphQL<CommentMutationResult>(mutation, {
      input,
    });

    if (!result.commentCreate.success) {
      throw new Error('Failed to create comment');
    }

    console.log(
      `Posted comment to issue ${result.commentCreate.comment.issue.identifier}`
    );
    return result.commentCreate.comment;
  } catch (error) {
    console.error('Failed to post comment:', error);
    throw error;
  }
}

/**
 * Check if an issue already has a complexity analysis comment
 * @param issueId - The issue ID
 * @returns True if analysis comment exists
 */
export async function hasComplexityAnalysis(
  issueId: string
): Promise<boolean> {
  const query = `
    query GetIssueComments($id: String!) {
      issue(id: $id) {
        comments {
          nodes {
            body
            user {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const result = await linearGraphQL<{
      issue: {
        comments: { nodes: Array<{ body: string; user: { name: string } }> };
      };
    }>(query, { id: issueId });

    // Check if any comment contains complexity analysis
    const hasAnalysis = result.issue.comments.nodes.some(
      (comment) =>
        comment.body.includes('Task Complexity Analysis') ||
        comment.body.includes('Analyzed by Design Dream AI')
    );

    return hasAnalysis;
  } catch (error) {
    console.error('Failed to check for existing analysis:', error);
    return false;
  }
}

/**
 * Format analysis result as Markdown for Linear comment
 * @param analysis - Task complexity analysis from Claude
 * @returns Markdown-formatted comment content
 */
export function formatAnalysisAsComment(
  analysis: TaskComplexityAnalysis
): string {
  const isSimple = analysis.complexity === 'SIMPLE';
  const statusEmoji = isSimple ? '✅' : '🔍';

  let markdown = `## ${statusEmoji} Task Complexity Analysis

**Classification:** ${analysis.complexity} (${analysis.estimatedHours} hours estimated)

**Reasoning:** ${analysis.reasoning}

**Next Steps:** ${analysis.suggestedAction}`;

  if (analysis.suggestedSubtasks && analysis.suggestedSubtasks.length > 0) {
    markdown += '\n\n**Suggested Breakdown:**\n';
    analysis.suggestedSubtasks.forEach((subtask) => {
      markdown += `- ${subtask}\n`;
    });
  }

  markdown += '\n\n_Analyzed by Design Dream AI_';

  return markdown;
}

/**
 * Verify Linear webhook signature
 * @param payload - Raw request body
 * @param signature - Signature from webhook header
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const crypto = require('crypto');
  const secret = process.env.LINEAR_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('LINEAR_WEBHOOK_SECRET not set, skipping verification');
    return true; // Allow in development
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const computedSignature = hmac.digest('hex');

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    return false;
  }
}

/**
 * Calculate SLA metrics for an issue
 * @param issue - Linear issue with timestamps
 * @returns SLA metrics including response and resolution times
 */
export function calculateSLAMetrics(issue: LinearIssue): {
  responseTimeMinutes?: number;
  resolutionTimeMinutes?: number;
  slaStatus: 'met' | 'at-risk' | 'breached';
} {
  const createdAt = new Date(issue.createdAt);
  const now = new Date();

  // Calculate first response time (time to first comment)
  // This would need comment timestamps from the issue
  const responseTimeMinutes = undefined; // TODO: Calculate from comments

  // Calculate resolution time (time to completion)
  let resolutionTimeMinutes: number | undefined;
  if (issue.completedAt) {
    const completedAt = new Date(issue.completedAt);
    resolutionTimeMinutes =
      (completedAt.getTime() - createdAt.getTime()) / (1000 * 60);
  }

  // Determine SLA status based on priority and estimated hours
  // Simple: 4 hours = 240 minutes
  // Medium: 1 day = 1440 minutes
  // Large: 3 days = 4320 minutes
  let slaThreshold = 1440; // Default: 1 day

  if (issue.estimate) {
    if (issue.estimate <= 4) {
      slaThreshold = 240; // 4 hours for simple tasks
    } else if (issue.estimate <= 8) {
      slaThreshold = 1440; // 1 day for medium tasks
    } else {
      slaThreshold = 4320; // 3 days for large tasks
    }
  }

  // Calculate current time elapsed
  const elapsedMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

  let slaStatus: 'met' | 'at-risk' | 'breached';
  if (issue.completedAt) {
    // Completed: check if within SLA
    slaStatus =
      resolutionTimeMinutes && resolutionTimeMinutes <= slaThreshold
        ? 'met'
        : 'breached';
  } else {
    // In progress: check if at risk
    if (elapsedMinutes > slaThreshold) {
      slaStatus = 'breached';
    } else if (elapsedMinutes > slaThreshold * 0.8) {
      slaStatus = 'at-risk';
    } else {
      slaStatus = 'met';
    }
  }

  return {
    responseTimeMinutes,
    resolutionTimeMinutes,
    slaStatus,
  };
}
