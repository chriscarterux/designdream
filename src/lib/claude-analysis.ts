/**
 * Claude API Integration for Task Complexity Analysis
 * Analyzes client requests to determine if they're SIMPLE or COMPLEX
 */

import Anthropic from '@anthropic-ai/sdk';
import type { TaskComplexityAnalysis } from '@/types/basecamp.types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ANALYSIS_PROMPT = `You are analyzing a client's design/development request to determine its complexity.

**SIMPLE tasks (3-8 hours):**
- Single UI component creation
- Simple design mockup (1-2 screens)
- Bug fixes
- Minor copy/content changes
- Simple CSS/styling changes
- Basic icon/graphic design
- Email template design
- Single landing page section

**COMPLEX projects (multi-week):**
- Full website redesign
- Multi-page application
- E-commerce platform
- Complete brand identity
- Video production
- Multiple integrations
- Database architecture
- Authentication system
- Complex state management
- Multi-step user flows

Analyze the following request and respond in this EXACT JSON format:
{
  "complexity": "SIMPLE" or "COMPLEX",
  "estimatedHours": <number>,
  "reasoning": "<brief explanation>",
  "suggestedAction": "<what should happen next>",
  "suggestedSubtasks": ["<subtask 1>", "<subtask 2>"] // only for COMPLEX
}

Request Title: {{TITLE}}

Request Description: {{DESCRIPTION}}

Respond ONLY with valid JSON, no markdown formatting.`;

/**
 * Analyze task complexity using Claude API
 * @param title - Task title
 * @param description - Task description
 * @returns Complexity analysis with classification and suggestions
 */
export async function analyzeTaskComplexity(
  title: string,
  description: string
): Promise<TaskComplexityAnalysis> {
  try {
    console.log('Analyzing task with Claude:', { title, description: description.substring(0, 100) });

    const prompt = ANALYSIS_PROMPT
      .replace('{{TITLE}}', title)
      .replace('{{DESCRIPTION}}', description || 'No description provided');

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.3, // Lower temperature for more consistent analysis
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content from response
    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('');

    console.log('Claude response:', responseText);

    // Parse JSON response
    const analysis: TaskComplexityAnalysis = JSON.parse(responseText);

    // Validate response structure
    if (!analysis.complexity || !['SIMPLE', 'COMPLEX'].includes(analysis.complexity)) {
      throw new Error('Invalid complexity classification from Claude');
    }

    if (typeof analysis.estimatedHours !== 'number') {
      throw new Error('Invalid estimatedHours from Claude');
    }

    console.log('Task analysis complete:', analysis);

    return analysis;
  } catch (error) {
    console.error('Error analyzing task with Claude:', error);

    // Fallback: default to SIMPLE if Claude API fails
    return {
      complexity: 'SIMPLE',
      estimatedHours: 5,
      reasoning: 'Error analyzing with AI, defaulting to SIMPLE classification. Please review manually.',
      suggestedAction: 'Manual review recommended due to analysis error.',
    };
  }
}

/**
 * Format analysis for human-readable logging
 */
export function logAnalysis(analysis: TaskComplexityAnalysis): void {
  console.log('\n=== Task Complexity Analysis ===');
  console.log(`Classification: ${analysis.complexity}`);
  console.log(`Estimated Hours: ${analysis.estimatedHours}`);
  console.log(`Reasoning: ${analysis.reasoning}`);
  console.log(`Suggested Action: ${analysis.suggestedAction}`);
  if (analysis.suggestedSubtasks) {
    console.log('Suggested Subtasks:');
    analysis.suggestedSubtasks.forEach((task, i) => {
      console.log(`  ${i + 1}. ${task}`);
    });
  }
  console.log('==============================\n');
}
