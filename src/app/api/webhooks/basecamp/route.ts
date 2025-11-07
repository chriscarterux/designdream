// Basecamp Webhook Receiver
// Handles incoming webhooks from Basecamp and analyzes requests with Claude

import { NextRequest, NextResponse } from 'next/server';
import { getBasecampClient } from '@/lib/basecamp/client';
import type { BasecampWebhookPayload, RequestAnalysis } from '@/lib/basecamp/types';

// Anthropic client for request analysis
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/webhooks/basecamp
 * Receives webhooks from Basecamp when customers create/update todos
 */
export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const payload: BasecampWebhookPayload = await request.json();

    console.log('📨 Received Basecamp webhook:', {
      kind: payload.kind,
      id: payload.id,
      recordingType: payload.recording?.type,
    });

    // Only process todo created events in Request Backlog
    if (payload.kind !== 'todo_created') {
      console.log(`Ignoring event: ${payload.kind}`);
      return NextResponse.json({ received: true, processed: false });
    }

    // Check if this is in the Request Backlog list
    const parentTitle = payload.details.parent?.title || '';
    if (!parentTitle.toLowerCase().includes('request backlog')) {
      console.log(`Ignoring todo not in Request Backlog: ${parentTitle}`);
      return NextResponse.json({ received: true, processed: false });
    }

    // Extract todo details
    const todoId = payload.details.id;
    const todoTitle = payload.details.title || '';
    const todoContent = payload.details.content || payload.details.description || '';
    const projectId = payload.details.bucket.id;

    console.log('📝 Processing new request:', {
      todoId,
      todoTitle,
      projectId,
    });

    // Analyze the request with Claude
    const analysis = await analyzeRequest(todoTitle, todoContent);

    console.log('🤖 Claude analysis:', analysis);

    // Post response back to Basecamp
    await respondToRequest(projectId, todoId, analysis);

    console.log('✅ Successfully processed and responded to request');

    return NextResponse.json({
      received: true,
      processed: true,
      analysis: {
        complexity: analysis.complexity,
        estimated_hours: analysis.estimated_hours,
      },
    });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);

    return NextResponse.json(
      {
        received: true,
        processed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Analyze request complexity with Claude
 */
async function analyzeRequest(
  title: string,
  content: string
): Promise<RequestAnalysis> {
  const prompt = `You are analyzing a client request for a design/development subscription service (Design Dream).

Request Title: ${title}
Request Details: ${content || 'No additional details provided'}

Determine:
1. Is this a simple task (3-8 hours of work)?
2. Or is this a multi-week project that needs breakdown?

Respond in JSON format:
{
  "complexity": "SIMPLE" or "COMPLEX",
  "estimated_hours": number,
  "reasoning": "brief explanation (1-2 sentences)",
  "task_breakdown": [] (empty if SIMPLE, array of phase objects if COMPLEX)
}

If COMPLEX, provide task_breakdown with this structure:
[
  {
    "phase": "Phase 1: Foundation",
    "tasks": [
      {
        "title": "Task title",
        "description": "What needs to be done",
        "estimated_hours": 4
      }
    ]
  }
]

Guidelines:
- Each task should be 3-8 hours
- SIMPLE: Single deliverable, clear scope (design mockup, bug fix, small feature)
- COMPLEX: Multiple deliverables, requires phases (full website, app feature, major redesign)
- Be realistic with estimates
- If unclear scope, default to SIMPLE and ask for clarification`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const firstBlock = message.content[0];
    const responseText = firstBlock.type === 'text' ? firstBlock.text : '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    }

    // Fallback if no JSON found
    console.warn('Could not parse JSON from Claude response');
    return {
      complexity: 'SIMPLE',
      estimated_hours: 6,
      reasoning:
        'Could not parse AI response, defaulting to simple task. Please review and clarify scope.',
    };
  } catch (error) {
    console.error('Error calling Claude API:', error);
    // Return safe default
    return {
      complexity: 'SIMPLE',
      estimated_hours: 6,
      reasoning:
        'Error analyzing request automatically. I will review manually and respond within 24 hours.',
    };
  }
}

/**
 * Post analysis response back to Basecamp
 */
async function respondToRequest(
  projectId: number,
  todoId: number,
  analysis: RequestAnalysis
): Promise<void> {
  const client = getBasecampClient();

  let responseMessage = '';

  if (analysis.complexity === 'SIMPLE') {
    // Simple task response
    responseMessage = `✅ **Task Approved**

This looks like a straightforward task (estimated ${analysis.estimated_hours} hours).

**Reasoning:** ${analysis.reasoning}

**Next Steps:**
I'm moving this to "Up Next" in the queue. I'll start work based on current queue position and provide updates along the way.

**Expected Timeline:**
- Start: Based on current queue
- Delivery: 48 business hours from start

I'll post an update when I begin work!`;
  } else {
    // Complex project response
    const totalHours = analysis.task_breakdown?.reduce(
      (sum, phase) =>
        sum + phase.tasks.reduce((s, task) => s + task.estimated_hours, 0),
      0
    ) || 0;

    const totalWeeks = Math.ceil(totalHours / 40);

    responseMessage = `📋 **Project Breakdown Needed**

This looks like a multi-week project (estimated ${totalHours}+ hours, ~${totalWeeks} weeks).

**Reasoning:** ${analysis.reasoning}

I've broken this down into phases and tasks below. Each task is 3-8 hours and can be completed within the 48hr SLA.

---

## Suggested Breakdown

${analysis.task_breakdown
  ?.map(
    (phase) => `
### ${phase.phase}

${phase.tasks
  .map(
    (task) => `
**${task.title}** (${task.estimated_hours}h)
${task.description}
`
  )
  .join('\n')}
`
  )
  .join('\n---\n')}

---

**Next Steps:**
Please review this breakdown. If it looks good, I'll create separate tasks in your backlog for each item. You can then prioritize which to tackle first.

**Questions or Changes?**
Reply here if you want to adjust the scope, combine/split tasks, or change priorities.

I'll wait for your feedback before proceeding!`;
  }

  // Post comment to the todo
  await client.postComment({
    projectId,
    recordingId: todoId,
    content: responseMessage,
  });

  console.log(`✅ Posted response to todo ${todoId}`);
}

/**
 * GET /api/webhooks/basecamp
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Basecamp webhook receiver is running',
    timestamp: new Date().toISOString(),
  });
}
