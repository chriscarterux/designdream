/**
 * Type definitions for client onboarding automation
 */

/**
 * Client data for onboarding
 */
export interface ClientOnboardingData {
  // Client information
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;

  // Stripe information
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePortalUrl: string;

  // Optional external links (filled during onboarding)
  figmaFileUrl?: string;
  repoUrl?: string;
}

/**
 * Result of Linear project creation
 */
export interface LinearProjectResult {
  projectId: string;
  projectUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Result of Figma file duplication
 */
export interface FigmaFileResult {
  fileKey: string;
  fileUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Result of GitHub repository creation
 */
export interface GitHubRepoResult {
  repoName: string;
  repoUrl: string;
  success: boolean;
  error?: string;
}

/**
 * Result of welcome email sending
 */
export interface WelcomeEmailResult {
  emailId: string;
  success: boolean;
  error?: string;
}

/**
 * Complete onboarding result
 */
export interface OnboardingResult {
  success: boolean;
  clientId: string;
  linearProject?: LinearProjectResult;
  figmaFile?: FigmaFileResult;
  githubRepo?: GitHubRepoResult;
  welcomeEmail?: WelcomeEmailResult;
  errors: string[];
  completedAt: string;
}

/**
 * Onboarding step status
 */
export type OnboardingStep =
  | 'linear_project'
  | 'figma_file'
  | 'github_repo'
  | 'welcome_email';

/**
 * Onboarding step result
 */
export interface OnboardingStepResult {
  step: OnboardingStep;
  success: boolean;
  error?: string;
  data?: any;
}
