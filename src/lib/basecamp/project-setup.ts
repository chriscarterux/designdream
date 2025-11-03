// Basecamp Project Setup for New Customers

import { getBasecampClient } from './client';
import type { BasecampProject, BasecampTodoList } from './types';

interface CustomerInfo {
  name: string;
  email: string;
  company?: string;
  stripeCustomerId: string;
}

/**
 * Create a complete Basecamp project for a new customer
 * Following the template from Basecamp-Project-Template.md
 */
export async function createCustomerProject(
  customer: CustomerInfo
): Promise<BasecampProject> {
  const client = getBasecampClient();

  // Step 1: Create the project
  const projectName = `${customer.company || customer.name} - Design Dream`;
  const projectDescription = `Client: ${customer.name} (${customer.email})
Stripe ID: ${customer.stripeCustomerId}
Started: ${new Date().toISOString().split('T')[0]}

This is your Design Dream project workspace. Add requests, track progress, and communicate about all design and development work here.`;

  console.log(`Creating Basecamp project: ${projectName}`);
  const project = await client.createProject({
    name: projectName,
    description: projectDescription,
  });

  console.log(`✅ Created project ${project.id}: ${project.name}`);

  // Step 2: Get the todoset for this project
  const todoSet = await client.getTodoSet(project.id);
  console.log(`Found todoset ${todoSet.id} for project`);

  // Step 3: Create todo lists following template structure
  const todoLists = await createProjectTodoLists(project.id, todoSet.id);

  // Step 4: Add initial tasks to Client Onboarding list
  await addOnboardingTasks(project.id, todoLists.onboarding.id);

  // Step 5: Register webhook for this project
  const webhookUrl =
    process.env.NEXT_PUBLIC_APP_URL + '/api/webhooks/basecamp';
  try {
    await client.registerWebhook(project.id, webhookUrl);
    console.log(`✅ Registered webhook for project ${project.id}`);
  } catch (error) {
    console.error(`⚠️ Could not register webhook:`, error);
    // Don't fail project creation if webhook fails
  }

  console.log(`🎉 Customer project setup complete!`);
  return project;
}

/**
 * Create all todo lists for the project template
 */
async function createProjectTodoLists(
  projectId: number,
  todoSetId: number
): Promise<Record<string, BasecampTodoList>> {
  const client = getBasecampClient();

  const lists = [
    {
      key: 'onboarding',
      name: '📋 Client Onboarding',
      description:
        'Complete these tasks to get started with Design Dream. Welcome!',
    },
    {
      key: 'backlog',
      name: '🎯 Request Backlog',
      description:
        'Add new design/development requests here. Use the Request Template pinned in Docs.',
    },
    {
      key: 'upNext',
      name: '⏭️ Up Next (Scoped & Ready)',
      description:
        'Requests that have been reviewed and scoped. Next in queue for work.',
    },
    {
      key: 'inProgress',
      name: '🚧 In Progress (ONE TASK MAX)',
      description:
        'Currently active work. 48hr SLA timer is running for this task.',
    },
    {
      key: 'needsFeedback',
      name: '🔄 Needs Client Feedback',
      description:
        'Work paused waiting for your input. SLA timer is paused. Please respond within 24-48 hours.',
    },
    {
      key: 'done',
      name: '✅ Done (Last 30 Days)',
      description:
        'Completed and delivered work. Archived after 30 days to keep list clean.',
    },
  ];

  const created: Record<string, BasecampTodoList> = {};

  for (const list of lists) {
    console.log(`Creating todo list: ${list.name}`);
    const todoList = await client.createTodoList({
      projectId,
      todoSetId,
      name: list.name,
      description: list.description,
    });
    created[list.key] = todoList;
    console.log(`✅ Created: ${todoList.name}`);
  }

  return created;
}

/**
 * Add initial onboarding tasks
 */
async function addOnboardingTasks(
  projectId: number,
  onboardingListId: number
): Promise<void> {
  const client = getBasecampClient();

  const tasks = [
    {
      content: '👋 Welcome to Design Dream!',
      description: `Thank you for subscribing! This Basecamp project is your workspace for all design and development requests.

**Quick Start:**
1. Check out the pinned "How to Request New Work" doc
2. Upload your brand assets to Files & Docs
3. Submit your first request using the template

Looking forward to building great things together!

— Chris Carter
Design Dream`,
    },
    {
      content: '📖 Read "How to Request New Work" guide',
      description:
        'This doc explains how to submit requests, what to include, and what happens next. Pin located in Docs & Files section.',
    },
    {
      content: '📤 Upload brand assets (logos, colors, fonts)',
      description: `Please upload:
- Logo files (SVG, PNG)
- Brand colors (hex codes)
- Typography/fonts
- Any existing design system or style guides
- Reference materials

This helps me maintain consistency across all work.`,
    },
    {
      content: '🔐 Share access credentials (if needed)',
      description: `If I need access to:
- Website/hosting (cPanel, Vercel, etc.)
- Domain registrar
- Analytics (Google Analytics, etc.)
- Git repositories
- CMS or databases

Please share via 1Password shared vault or post securely here.`,
    },
    {
      content: '✍️ Submit your first request',
      description: `Use the Request Template in the "🎯 Request Backlog" list.

Not sure what to start with? Common first requests:
- Website audit and recommendations
- Landing page design
- Feature enhancement
- Bug fixes
- Performance optimization

I'll review and respond within 24 hours!`,
    },
  ];

  for (const task of tasks) {
    await client.createTodo({
      projectId,
      todoListId: onboardingListId,
      content: task.content,
      description: task.description,
    });
    console.log(`✅ Added task: ${task.content}`);
  }
}

/**
 * Invite customer to their Basecamp project
 */
export async function inviteCustomerToProject(
  projectId: number,
  customerEmail: string
): Promise<void> {
  // Note: Basecamp requires people to be added to the account first
  // This would typically be done manually or via their admin panel
  // The API doesn't support direct email invitations

  console.log(
    `📧 Manual step: Invite ${customerEmail} to project ${projectId} via Basecamp admin panel`
  );

  // TODO: Send email to admin with invitation link
  // Or implement automated invitation flow via Basecamp admin API
}

/**
 * Archive old completed tasks (run periodically)
 */
export async function archiveCompletedTasks(projectId: number): Promise<void> {
  const client = getBasecampClient();

  // Get the "Done" todo list
  const todoSet = await client.getTodoSet(projectId);
  const todoLists = await client.getTodoLists(projectId, todoSet.id);

  const doneList = todoLists.find((list) => list.name.includes('Done'));
  if (!doneList) {
    console.log('No "Done" list found');
    return;
  }

  // Get all todos in Done list
  const todos = await client.getTodos(projectId, doneList.id);

  // Find todos older than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const oldTodos = todos.filter(
    (todo) => new Date(todo.updated_at) < thirtyDaysAgo
  );

  console.log(
    `Found ${oldTodos.length} tasks older than 30 days in Done list`
  );

  // Note: Basecamp doesn't have an "archive" API
  // Tasks stay in the list, but you could move them to a separate "Archived" list
  // or mark them in some way. For now, just log.

  if (oldTodos.length > 0) {
    console.log(
      `Consider manually archiving these ${oldTodos.length} old tasks`
    );
  }
}

/**
 * Get project by customer email or Stripe ID
 */
export async function findCustomerProject(
  searchTerm: string
): Promise<BasecampProject | null> {
  const client = getBasecampClient();

  const projects = await client.getProjects();

  const found = projects.find(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return found || null;
}
