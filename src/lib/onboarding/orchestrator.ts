/**
 * Client Onboarding Orchestration Service
 * Coordinates all onboarding automation steps
 */

import { createClientProject } from './linear-project';
import { createClientFigmaFile } from './figma-automation';
import { createClientRepository } from './repo-automation';
import { sendWelcomeEmail } from './welcome-email';
import type {
  ClientOnboardingData,
  OnboardingResult,
  OnboardingStepResult
} from '@/types/onboarding.types';

const RESEND_ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL || 'admin@designdream.is';

/**
 * Execute complete client onboarding automation
 *
 * This orchestrates all onboarding steps in sequence:
 * 1. Create Linear project
 * 2. Duplicate Figma file
 * 3. Create GitHub repository
 * 4. Send welcome email
 *
 * Each step is independent and can fail without blocking others.
 * Failed steps are logged and collected in the errors array.
 */
export async function executeClientOnboarding(
  data: ClientOnboardingData
): Promise<OnboardingResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const results: OnboardingStepResult[] = [];

  console.log('========================================');
  console.log('🚀 Starting client onboarding automation');
  console.log(`   Company: ${data.companyName}`);
  console.log(`   Contact: ${data.firstName} ${data.lastName} (${data.email})`);
  console.log(`   Customer ID: ${data.stripeCustomerId}`);
  console.log('========================================');

  // Step 1: Create Linear Project
  console.log('\n📊 Step 1/4: Creating Linear project...');
  const linearResult = await createClientProject({
    companyName: data.companyName,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    stripePortalUrl: data.stripePortalUrl,
  });

  results.push({
    step: 'linear_project',
    success: linearResult.success,
    error: linearResult.error,
    data: linearResult,
  });

  if (linearResult.success) {
    console.log(`✅ Linear project created: ${linearResult.projectUrl}`);
  } else {
    console.error(`❌ Linear project failed: ${linearResult.error}`);
    errors.push(`Linear project: ${linearResult.error}`);
  }

  // Step 2: Duplicate Figma File
  console.log('\n🎨 Step 2/4: Duplicating Figma template...');
  const figmaResult = await createClientFigmaFile({
    companyName: data.companyName,
    email: data.email,
  });

  results.push({
    step: 'figma_file',
    success: figmaResult.success,
    error: figmaResult.error,
    data: figmaResult,
  });

  if (figmaResult.success) {
    console.log(`✅ Figma file created: ${figmaResult.fileUrl}`);
  } else {
    console.error(`❌ Figma file failed: ${figmaResult.error}`);
    errors.push(`Figma file: ${figmaResult.error}`);
  }

  // Step 3: Create GitHub Repository
  console.log('\n💻 Step 3/4: Creating GitHub repository...');
  const repoResult = await createClientRepository({
    companyName: data.companyName,
    email: data.email,
    figmaFileUrl: figmaResult.fileUrl,
    stripePortalUrl: data.stripePortalUrl,
  });

  results.push({
    step: 'github_repo',
    success: repoResult.success,
    error: repoResult.error,
    data: repoResult,
  });

  if (repoResult.success) {
    console.log(`✅ GitHub repo created: ${repoResult.repoUrl}`);
  } else {
    console.error(`❌ GitHub repo failed: ${repoResult.error}`);
    errors.push(`GitHub repo: ${repoResult.error}`);
  }

  // Step 4: Send Welcome Email
  console.log('\n📧 Step 4/4: Sending welcome email...');
  const emailResult = await sendWelcomeEmail({
    email: data.email,
    firstName: data.firstName,
    companyName: data.companyName,
    linearProjectUrl: linearResult.projectUrl || 'https://linear.app',
    figmaFileUrl: figmaResult.fileUrl || 'https://figma.com',
    repoUrl: repoResult.repoUrl || 'https://github.com',
    stripePortalUrl: data.stripePortalUrl,
  });

  results.push({
    step: 'welcome_email',
    success: emailResult.success,
    error: emailResult.error,
    data: emailResult,
  });

  if (emailResult.success) {
    console.log(`✅ Welcome email sent (ID: ${emailResult.emailId})`);
  } else {
    console.error(`❌ Welcome email failed: ${emailResult.error}`);
    errors.push(`Welcome email: ${emailResult.error}`);
  }

  // Summary
  const duration = Date.now() - startTime;
  const successCount = results.filter(r => r.success).length;
  const totalSteps = results.length;

  console.log('\n========================================');
  console.log('✨ Client onboarding complete');
  console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
  console.log(`   Success: ${successCount}/${totalSteps} steps`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(error => console.log(`   - ${error}`));
  } else {
    console.log('   Status: All steps completed successfully! 🎉');
  }
  console.log('========================================\n');

  // Determine overall success (at least Linear and Email must succeed)
  const criticalStepsSucceeded = linearResult.success && emailResult.success;
  const overallSuccess = errors.length === 0;

  // If there were any failures, alert admin
  if (errors.length > 0) {
    await sendAdminAlert({
      companyName: data.companyName,
      email: data.email,
      errors,
      results,
      duration,
    });
  }

  return {
    success: overallSuccess,
    clientId: data.stripeCustomerId,
    linearProject: linearResult.success ? linearResult : undefined,
    figmaFile: figmaResult.success ? figmaResult : undefined,
    githubRepo: repoResult.success ? repoResult : undefined,
    welcomeEmail: emailResult.success ? emailResult : undefined,
    errors,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Send admin alert for failed onboarding steps
 */
async function sendAdminAlert(data: {
  companyName: string;
  email: string;
  errors: string[];
  results: OnboardingStepResult[];
  duration: number;
}): Promise<void> {
  try {
    console.log('\n📨 Sending admin alert for onboarding failures...');

    // In production, this would send an email via Resend
    // For now, just log the alert
    console.log('=== ADMIN ALERT ===');
    console.log(`Client onboarding had ${data.errors.length} failure(s)`);
    console.log(`Company: ${data.companyName}`);
    console.log(`Email: ${data.email}`);
    console.log(`Duration: ${(data.duration / 1000).toFixed(2)}s`);
    console.log('\nFailed steps:');
    data.errors.forEach(error => console.log(`  - ${error}`));
    console.log('\nAll results:');
    data.results.forEach(result => {
      console.log(`  ${result.step}: ${result.success ? '✅' : '❌'} ${result.error || ''}`);
    });
    console.log('==================\n');

    // TODO: Implement actual email alert to admin
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL,
    //   to: RESEND_ADMIN_EMAIL,
    //   subject: `⚠️ Client Onboarding Failures: ${data.companyName}`,
    //   html: generateAdminAlertHTML(data),
    // });
  } catch (error) {
    console.error('Failed to send admin alert:', error);
  }
}

/**
 * Health check for all onboarding services
 * Validates that all required environment variables and APIs are configured
 */
export async function validateOnboardingServices(): Promise<{
  success: boolean;
  services: Record<string, { configured: boolean; error?: string }>;
}> {
  console.log('🔍 Validating onboarding services...\n');

  const services: Record<string, { configured: boolean; error?: string }> = {};

  // Check Linear configuration
  try {
    if (!process.env.LINEAR_API_KEY) {
      throw new Error('LINEAR_API_KEY not configured');
    }
    if (!process.env.LINEAR_TEAM_ID) {
      throw new Error('LINEAR_TEAM_ID not configured');
    }
    services.linear = { configured: true };
    console.log('✅ Linear: Configured');
  } catch (error) {
    services.linear = {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    console.log(`❌ Linear: ${services.linear.error}`);
  }

  // Check Figma configuration
  try {
    if (!process.env.FIGMA_ACCESS_TOKEN) {
      throw new Error('FIGMA_ACCESS_TOKEN not configured');
    }
    if (!process.env.FIGMA_TEMPLATE_FILE_KEY) {
      throw new Error('FIGMA_TEMPLATE_FILE_KEY not configured');
    }
    if (!process.env.FIGMA_TEAM_ID) {
      throw new Error('FIGMA_TEAM_ID not configured');
    }
    services.figma = { configured: true };
    console.log('✅ Figma: Configured');
  } catch (error) {
    services.figma = {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    console.log(`❌ Figma: ${services.figma.error}`);
  }

  // Check GitHub configuration
  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN not configured');
    }
    if (!process.env.GITHUB_ORG) {
      throw new Error('GITHUB_ORG not configured');
    }
    services.github = { configured: true };
    console.log('✅ GitHub: Configured');
  } catch (error) {
    services.github = {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    console.log(`❌ GitHub: ${services.github.error}`);
  }

  // Check Email configuration
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }
    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error('RESEND_FROM_EMAIL not configured');
    }
    services.email = { configured: true };
    console.log('✅ Email (Resend): Configured');
  } catch (error) {
    services.email = {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    console.log(`❌ Email: ${services.email.error}`);
  }

  // Check Stripe configuration
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    services.stripe = { configured: true };
    console.log('✅ Stripe: Configured');
  } catch (error) {
    services.stripe = {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    console.log(`❌ Stripe: ${services.stripe.error}`);
  }

  const allConfigured = Object.values(services).every(s => s.configured);

  console.log(allConfigured ? '\n✨ All services configured!' : '\n⚠️ Some services not configured');

  return {
    success: allConfigured,
    services,
  };
}
