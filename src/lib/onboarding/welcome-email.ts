/**
 * Welcome Email Automation for Client Onboarding
 * Sends branded welcome email using React Email templates
 */

import { Resend } from 'resend';
import { render } from '@react-email/render';
import ClientWelcomeEmail from '@/emails/client-welcome';
import type { WelcomeEmailResult } from '@/types/onboarding.types';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'DesignDream <notifications@designdream.is>';
const RESEND_REPLY_TO_EMAIL = process.env.RESEND_REPLY_TO_EMAIL || 'support@designdream.is';
const EMAIL_TEST_MODE = process.env.EMAIL_TEST_MODE === 'true';

export interface WelcomeEmailData {
  email: string;
  firstName: string;
  companyName: string;
  linearProjectUrl: string;
  figmaFileUrl: string;
  repoUrl: string;
  stripePortalUrl: string;
}

/**
 * Send welcome email to newly onboarded client
 */
export async function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<WelcomeEmailResult> {
  try {
    // Validate required environment variables
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);

    // Render email template to HTML
    const emailHtml = await render(
      ClientWelcomeEmail({
        firstName: data.firstName,
        companyName: data.companyName,
        linearProjectUrl: data.linearProjectUrl,
        figmaFileUrl: data.figmaFileUrl,
        repoUrl: data.repoUrl,
        stripePortalUrl: data.stripePortalUrl,
      })
    );

    // Email subject line
    const subject = `Welcome to Design Dream, ${data.firstName}! Your design board is ready 🎨`;

    // Handle test mode (logs email instead of sending)
    if (EMAIL_TEST_MODE) {
      console.log('📧 EMAIL TEST MODE - Would send email:');
      console.log(`   To: ${data.email}`);
      console.log(`   From: ${RESEND_FROM_EMAIL}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Company: ${data.companyName}`);
      console.log(`   Linear: ${data.linearProjectUrl}`);

      return {
        emailId: `test-${Date.now()}`,
        success: true,
      };
    }

    console.log(`Sending welcome email to ${data.email}...`);

    // Send email via Resend
    const result = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: data.email,
      subject,
      html: emailHtml,
      reply_to: RESEND_REPLY_TO_EMAIL,
      tags: [
        { name: 'category', value: 'onboarding' },
        { name: 'type', value: 'welcome' },
        { name: 'company', value: data.companyName },
      ],
    });

    if (!result.data?.id) {
      throw new Error('Resend API returned no email ID');
    }

    console.log(`✅ Welcome email sent successfully`);
    console.log(`   Email ID: ${result.data.id}`);
    console.log(`   Recipient: ${data.email}`);

    return {
      emailId: result.data.id,
      success: true,
    };
  } catch (error) {
    console.error('Failed to send welcome email:', error);

    return {
      emailId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate email configuration (useful for health checks)
 */
export async function validateEmailConfiguration(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    if (!RESEND_FROM_EMAIL) {
      throw new Error('RESEND_FROM_EMAIL is not configured');
    }

    // Initialize Resend client to validate API key format
    const resend = new Resend(RESEND_API_KEY);

    console.log('✅ Email configuration validated');
    console.log(`   From: ${RESEND_FROM_EMAIL}`);
    console.log(`   Reply-To: ${RESEND_REPLY_TO_EMAIL}`);
    console.log(`   Test Mode: ${EMAIL_TEST_MODE}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to validate email configuration:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
