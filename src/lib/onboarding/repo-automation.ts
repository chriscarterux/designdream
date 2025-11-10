/**
 * GitHub Repository Automation for Client Onboarding
 * Automatically creates private repositories for new clients
 */

import type { GitHubRepoResult } from '@/types/onboarding.types';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG || 'chriscarterux';

export interface RepositoryData {
  companyName: string;
  email: string;
  figmaFileUrl?: string;
  stripePortalUrl?: string;
}

interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  default_branch: string;
}

interface GitHubFileResponse {
  content: {
    name: string;
    path: string;
    sha: string;
    html_url: string;
  };
}

/**
 * Sanitize company name for use as repository name
 * Example: "Acme Corp" → "acme-corp"
 */
function sanitizeRepoName(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate README content for client repository
 */
function generateReadmeContent(data: RepositoryData): string {
  return `# ${data.companyName} - Design Files

This repository contains all design files, assets, and deliverables for ${data.companyName}.

## 📁 Structure

- \`/designs\` - Source design files (Figma exports, Sketch, etc.)
- \`/assets\` - Logos, images, fonts, and other brand assets
- \`/deliverables\` - Final delivered files ready for use

## 🔗 Quick Links

${data.figmaFileUrl ? `**Design Files:** ${data.figmaFileUrl}\n` : '**Design Files:** _Will be added during onboarding_\n'}${data.stripePortalUrl ? `**Manage Subscription:** ${data.stripePortalUrl}\n` : ''}
## 📋 How to Use This Repository

1. **Upload brand assets** - Add your logos, fonts, and style guides to \`/assets\`
2. **Review designs** - Find exported design files in \`/designs\`
3. **Download deliverables** - Final files are in \`/deliverables\`

## 💬 Questions?

Contact us at [hello@designdream.is](mailto:hello@designdream.is)

---

*Repository managed by [Design Dream](https://designdream.is)*
`;
}

/**
 * Generate README content for designs directory
 */
function generateDesignsReadme(): string {
  return `# Designs

This directory contains source design files exported from Figma, Sketch, or other design tools.

## Organization

- Group files by project or feature
- Use descriptive names
- Include version numbers when applicable

## File Types

Common formats you'll find here:
- \`.fig\` - Figma files
- \`.sketch\` - Sketch files
- \`.svg\` - Vector graphics
- \`.png\` / \`.jpg\` - Rasterized exports
`;
}

/**
 * Generate README content for assets directory
 */
function generateAssetsReadme(): string {
  return `# Assets

This directory contains brand assets like logos, fonts, and images.

## Structure

- \`/logos\` - Company logos in various formats
- \`/images\` - Marketing images, photos, graphics
- \`/fonts\` - Custom typography files

## Best Practices

- Use SVG for logos when possible
- Include multiple logo variations (light/dark, horizontal/stacked)
- Keep original, uncompressed versions
`;
}

/**
 * Generate README content for deliverables directory
 */
function generateDeliverablesReadme(): string {
  return `# Deliverables

This directory contains final, approved deliverables ready for use.

## Organization

Files are organized by delivery date and project:
- \`YYYY-MM-DD-project-name/\`

## Usage

These files are production-ready and approved for:
- Website implementation
- Marketing materials
- Product development
- Client distribution
`;
}

/**
 * Make a GitHub API request
 */
async function githubAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not configured');
  }

  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

/**
 * Create a file in a GitHub repository
 */
async function createRepoFile(
  repoFullName: string,
  path: string,
  content: string,
  message: string
): Promise<void> {
  // Base64 encode the content
  const encodedContent = Buffer.from(content).toString('base64');

  await githubAPI<GitHubFileResponse>(`/repos/${repoFullName}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: encodedContent,
    }),
  });

  console.log(`   ✅ Created ${path}`);
}

/**
 * Create a GitHub repository for a new client
 */
export async function createClientRepository(
  data: RepositoryData
): Promise<GitHubRepoResult> {
  try {
    // Validate required environment variables
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is not configured');
    }

    if (!GITHUB_ORG) {
      throw new Error('GITHUB_ORG is not configured');
    }

    // Generate repository name
    const repoName = `${sanitizeRepoName(data.companyName)}-design-files`;

    console.log(`Creating GitHub repository for ${data.companyName}...`);
    console.log(`   Repository name: ${repoName}`);

    // Step 1: Create the repository
    const repo = await githubAPI<GitHubRepoResponse>(`/orgs/${GITHUB_ORG}/repos`, {
      method: 'POST',
      body: JSON.stringify({
        name: repoName,
        description: `Design files and assets for ${data.companyName}`,
        private: true,
        auto_init: true, // Creates initial commit with README
        has_issues: false,
        has_projects: false,
        has_wiki: false,
      }),
    });

    console.log(`✅ Repository created: ${repo.full_name}`);
    console.log(`   URL: ${repo.html_url}`);

    // Small delay to ensure repo is ready for file operations
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Add initial file structure
    console.log('   Adding initial file structure...');

    const repoFullName = repo.full_name;

    // Update main README.md
    await createRepoFile(
      repoFullName,
      'README.md',
      generateReadmeContent(data),
      'docs: update README with client information'
    );

    // Create directory structure with README files
    await createRepoFile(
      repoFullName,
      'designs/README.md',
      generateDesignsReadme(),
      'docs: add designs directory'
    );

    await createRepoFile(
      repoFullName,
      'assets/README.md',
      generateAssetsReadme(),
      'docs: add assets directory'
    );

    await createRepoFile(
      repoFullName,
      'assets/logos/README.md',
      '# Logos\n\nPlace company logos here in various formats (SVG, PNG, etc.).\n',
      'docs: add logos directory'
    );

    await createRepoFile(
      repoFullName,
      'assets/images/README.md',
      '# Images\n\nPlace marketing images, photos, and graphics here.\n',
      'docs: add images directory'
    );

    await createRepoFile(
      repoFullName,
      'assets/fonts/README.md',
      '# Fonts\n\nPlace custom typography files here (.ttf, .otf, .woff, .woff2).\n',
      'docs: add fonts directory'
    );

    await createRepoFile(
      repoFullName,
      'deliverables/README.md',
      generateDeliverablesReadme(),
      'docs: add deliverables directory'
    );

    // Create .gitignore
    await createRepoFile(
      repoFullName,
      '.gitignore',
      `# macOS
.DS_Store
.AppleDouble
.LSOverride

# Thumbnails
._*

# Files that might appear in the root
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini

# Adobe
*.psd~
*.ai~

# Temporary files
*.tmp
*.temp
*.cache
`,
      'chore: add .gitignore for design files'
    );

    console.log('✅ Repository setup complete');

    return {
      repoName: repo.name,
      repoUrl: repo.html_url,
      success: true,
    };
  } catch (error) {
    console.error('Failed to create GitHub repository:', error);

    return {
      repoName: '',
      repoUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate GitHub configuration (useful for health checks)
 */
export async function validateGitHubConfiguration(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is not configured');
    }

    if (!GITHUB_ORG) {
      throw new Error('GITHUB_ORG is not configured');
    }

    // Verify token has access to organization
    const org = await githubAPI<{ login: string; name: string }>(
      `/orgs/${GITHUB_ORG}`
    );

    console.log('✅ GitHub configuration validated');
    console.log(`   Organization: ${org.name} (@${org.login})`);

    return { success: true };
  } catch (error) {
    console.error('Failed to validate GitHub configuration:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
