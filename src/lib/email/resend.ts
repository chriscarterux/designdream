// Resend client configuration for email notifications

import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || 'DesignDream <notifications@designdream.is>',
  adminEmail: process.env.RESEND_ADMIN_EMAIL || 'admin@designdream.is',
  replyTo: process.env.RESEND_REPLY_TO_EMAIL || 'support@designdream.is',

  // Test mode - if true, all emails go to admin
  testMode: process.env.EMAIL_TEST_MODE === 'true',

  // Rate limiting (emails per minute)
  rateLimit: 100,
};

// Helper to get the correct recipient email (test mode override)
export function getRecipientEmail(email: string): string {
  if (EMAIL_CONFIG.testMode) {
    console.log(`[EMAIL TEST MODE] Would send to: ${email}, redirecting to: ${EMAIL_CONFIG.adminEmail}`);
    return EMAIL_CONFIG.adminEmail;
  }
  return email;
}

// Helper to format email subject with environment prefix
export function formatSubject(subject: string): string {
  const env = process.env.NODE_ENV;
  if (env === 'test') {
    return `[TEST] ${subject}`;
  }
  return subject;
}
