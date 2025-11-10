/**
 * Linear Project Auto-Creation for Client Onboarding
 * Automatically creates Linear projects with custom 3-column workflow
 */

const LINEAR_API_URL = 'https://api.linear.app/graphql';
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

// Workflow state IDs (to be configured in environment)
const LINEAR_BACKLOG_STATE_ID = process.env.LINEAR_BACKLOG_STATE_ID;
const LINEAR_CURRENT_REQUEST_STATE_ID = process.env.LINEAR_CURRENT_REQUEST_STATE_ID;
const LINEAR_APPROVED_STATE_ID = process.env.LINEAR_APPROVED_STATE_ID;

export interface ClientProjectData {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  stripePortalUrl: string;
  figmaFileUrl?: string;
  repoUrl?: string;
}

export interface ProjectCreationResult {
  projectId: string;
  projectUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Generate project description template
 */
function generateProjectDescription(data: ClientProjectData): string {
  const fullName = `${data.firstName} ${data.lastName}`;

  return `# ${data.companyName} - Design Dream Project

## Welcome to Design Dream! 🎨

Welcome aboard, ${data.firstName}! This is your centralized hub for all design and development requests.

---

## 📋 How It Works

Your project uses a **3-column workflow**:

1. **Backlog** - Submit unlimited requests here. Add all your ideas, designs, and development needs.
2. **Current Request** - Only 1 active request at a time. We'll move requests here when we start working.
3. **Approved** - Completed work that you've reviewed and approved.

---

## 📊 Your Project Details

**Company:** ${data.companyName}
**Contact:** ${fullName} (${data.email})
**Subscription:** [Manage Subscription](${data.stripePortalUrl})

---

## 🎯 Quick Links

${data.figmaFileUrl ? `**Figma Design File:** ${data.figmaFileUrl}\n` : '**Figma Design File:** _Will be added during onboarding_\n'}
${data.repoUrl ? `**GitHub Repository:** ${data.repoUrl}\n` : '**GitHub Repository:** _Will be added during onboarding_\n'}

---

## 🎨 Brand Assets

Share your brand assets here:
- Logo files
- Brand colors
- Typography
- Style guides
- Any existing design systems

---

## 💡 Getting Started

1. **Create your first request** - Click the "+ New Issue" button
2. **Add details** - Include title, description, and any reference files
3. **We'll prioritize** - Your request moves to "Current Request" when we start
4. **Review & approve** - Completed work moves to "Approved" for your review

---

## 📞 Support

Questions? Need help? Contact us:
- **Email:** hello@designdream.is
- **Response Time:** Within 4 business hours

---

**Project Created:** ${new Date().toISOString().split('T')[0]}
**Subscription Status:** Active
`;
}

/**
 * Make a GraphQL request to Linear API
 */
async function linearGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  if (!LINEAR_API_KEY) {
    throw new Error('LINEAR_API_KEY is not configured');
  }

  const response = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: LINEAR_API_KEY,
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

  const result: { data?: T; errors?: Array<{ message: string }> } = await response.json();

  if (result.errors && result.errors.length > 0) {
    console.error('Linear API errors:', result.errors);
    throw new Error(`Linear API error: ${result.errors[0].message}`);
  }

  if (!result.data) {
    throw new Error('Linear API returned no data');
  }

  return result.data;
}

/**
 * Create a Linear project for a new client
 */
export async function createClientProject(
  data: ClientProjectData
): Promise<ProjectCreationResult> {
  try {
    // Validate required environment variables
    if (!LINEAR_API_KEY) {
      throw new Error('LINEAR_API_KEY is not configured');
    }

    if (!LINEAR_TEAM_ID) {
      throw new Error('LINEAR_TEAM_ID is not configured');
    }

    // Generate project description
    const description = generateProjectDescription(data);

    // Create project via Linear API
    const mutation = `
      mutation CreateProject($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
          success
          project {
            id
            name
            description
            url
            state
            createdAt
          }
        }
      }
    `;

    const input = {
      name: `${data.companyName} - Design Dream`,
      description,
      teamIds: [LINEAR_TEAM_ID],
      state: 'started', // Active project
    };

    console.log(`Creating Linear project for ${data.companyName}...`);

    const result = await linearGraphQL<{
      projectCreate: {
        success: boolean;
        project: {
          id: string;
          name: string;
          description: string;
          url: string;
          state: string;
          createdAt: string;
        };
      };
    }>(mutation, { input });

    if (!result.projectCreate.success) {
      throw new Error('Failed to create Linear project');
    }

    const project = result.projectCreate.project;

    console.log(`✅ Created Linear project: ${project.name} (${project.id})`);
    console.log(`   URL: ${project.url}`);

    return {
      projectId: project.id,
      projectUrl: project.url,
      success: true,
    };
  } catch (error) {
    console.error('Failed to create Linear project:', error);

    return {
      projectId: '',
      projectUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
