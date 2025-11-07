// Email sending functions with error handling and retry logic

import { resend, EMAIL_CONFIG, getRecipientEmail, formatSubject } from './resend';
import { renderEmailTemplate, getEmailSubject } from './templates';
import { createClient } from '@supabase/supabase-js';
import type { EmailData, EmailSendResult, EmailPreferences } from '@/types/email.types';

// Initialize Supabase client for service role operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Rate limiting tracker
const emailRateLimiter = new Map<string, number[]>();

// Check if user has opted out of email notifications
async function checkEmailPreferences(userId?: string, emailType?: string): Promise<boolean> {
  if (!userId) return true; // Allow if no user ID (system emails)

  try {
    const { data, error } = await supabase
      .from('email_preferences')
      .select('email_enabled, sla_warnings, status_updates, comments')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // If no preferences found, default to enabled
      return true;
    }

    // Check global email setting
    if (!data.email_enabled) return false;

    // Check specific email type preference
    if (emailType?.includes('sla_warning') && !data.sla_warnings) return false;
    if (emailType === 'status_changed' && !data.status_updates) return false;
    if (emailType === 'comment_added' && !data.comments) return false;

    return true;
  } catch (error) {
    console.error('[Email] Error checking preferences:', error);
    // Fail open - allow email if there's an error checking preferences
    return true;
  }
}

// Rate limiting check
function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Get recent sends for this email
  const recentSends = emailRateLimiter.get(email) || [];
  const recentSendsInWindow = recentSends.filter((time) => time > oneMinuteAgo);

  // Update tracker
  emailRateLimiter.set(email, [...recentSendsInWindow, now]);

  // Check if over rate limit
  return recentSendsInWindow.length < EMAIL_CONFIG.rateLimit;
}

// Log email delivery to database
async function logEmailDelivery(
  email: string,
  emailType: string,
  status: 'pending' | 'sent' | 'failed',
  resendId?: string,
  error?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('email_delivery_log').insert({
      email,
      email_type: emailType,
      status,
      resend_id: resendId,
      error,
      metadata: metadata || {},
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    });
  } catch (err) {
    console.error('[Email] Error logging delivery:', err);
    // Don't throw - logging failure shouldn't prevent email sending
  }
}

// Main email sending function
export async function sendEmail(data: EmailData, retryCount = 0): Promise<EmailSendResult> {
  const maxRetries = 3;
  const recipientEmail = getRecipientEmail(data.recipient.email);

  try {
    // Check email preferences (skip for welcome emails)
    if (data.type !== 'welcome') {
      const canSend = await checkEmailPreferences(data.recipient.userId, data.type);
      if (!canSend) {
        console.log(`[Email] User ${data.recipient.userId} has opted out of ${data.type} emails`);
        return {
          success: false,
          error: 'User has opted out of this email type',
        };
      }
    }

    // Check rate limit
    if (!checkRateLimit(recipientEmail)) {
      console.warn(`[Email] Rate limit exceeded for ${recipientEmail}`);
      return {
        success: false,
        error: 'Rate limit exceeded',
      };
    }

    // Render email template
    const html = await renderEmailTemplate(data);
    const subject = formatSubject(getEmailSubject(data));

    // Log pending
    await logEmailDelivery(recipientEmail, data.type, 'pending', undefined, undefined, {
      recipient_name: data.recipient.name,
      subject,
    });

    // Send email via Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: recipientEmail,
      subject,
      html,
      reply_to: EMAIL_CONFIG.replyTo,
    });

    if (resendError) {
      throw resendError;
    }

    // Log success
    await logEmailDelivery(recipientEmail, data.type, 'sent', resendData?.id, undefined, {
      recipient_name: data.recipient.name,
      subject,
    });

    console.log(`[Email] Sent ${data.type} email to ${recipientEmail} (ID: ${resendData?.id})`);

    return {
      success: true,
      id: resendData?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Email] Error sending ${data.type} email to ${recipientEmail}:`, errorMessage);

    // Retry logic
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`[Email] Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return sendEmail(data, retryCount + 1);
    }

    // Log failure
    await logEmailDelivery(recipientEmail, data.type, 'failed', undefined, errorMessage, {
      recipient_name: data.recipient.name,
      retry_count: retryCount,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Batch send emails (with concurrency control)
export async function sendBatchEmails(
  emailsData: EmailData[],
  concurrency = 5
): Promise<EmailSendResult[]> {
  const results: EmailSendResult[] = [];
  const queue = [...emailsData];

  async function processBatch() {
    while (queue.length > 0) {
      const batch = queue.splice(0, concurrency);
      const batchResults = await Promise.all(batch.map((data) => sendEmail(data)));
      results.push(...batchResults);
    }
  }

  await processBatch();
  return results;
}

// Helper: Send SLA warning email
export async function sendSLAWarningEmail(
  requestId: string,
  warningLevel: 'yellow' | 'red'
): Promise<EmailSendResult[]> {
  try {
    // Fetch request, SLA, client, and assigned user data
    const { data: request, error } = await supabase
      .from('requests')
      .select(
        `
        *,
        client:clients(*),
        assigned_to_user:admin_users(*)
      `
      )
      .eq('id', requestId)
      .single();

    if (error || !request) {
      throw new Error(`Request not found: ${requestId}`);
    }

    // Get SLA data
    const { data: slaRecord } = await supabase
      .from('sla_records')
      .select('*')
      .eq('request_id', requestId)
      .eq('status', 'active')
      .single();

    if (!slaRecord) {
      throw new Error(`Active SLA record not found for request: ${requestId}`);
    }

    const hoursElapsed = slaRecord.business_hours_elapsed || 0;
    const targetHours = slaRecord.target_hours || 48;
    const hoursRemaining = targetHours - hoursElapsed;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.designdream.is';

    // Prepare email data
    const emails: EmailData[] = [];

    // Send to assigned admin
    if (request.assigned_to_user) {
      emails.push({
        type: warningLevel === 'red' ? 'sla_warning_red' : 'sla_warning_yellow',
        recipient: {
          email: request.assigned_to_user.email,
          name: request.assigned_to_user.name,
          userId: request.assigned_to_user.auth_user_id,
        },
        request: {
          id: request.id,
          title: request.title,
          status: request.status,
          priority: request.priority,
        },
        sla: {
          hoursRemaining,
          hoursElapsed,
          targetHours,
          warningLevel,
        },
        client: {
          companyName: request.client.company_name,
        },
        assignedTo: {
          name: request.assigned_to_user.name,
        },
        requestUrl: `${appUrl}/admin/requests/${request.id}`,
      });
    }

    // Send to all active admins
    const { data: admins } = await supabase
      .from('admin_users')
      .select('*')
      .eq('status', 'active');

    if (admins) {
      admins.forEach((admin) => {
        // Skip if already added (assigned user)
        if (admin.id === request.assigned_to) return;

        emails.push({
          type: warningLevel === 'red' ? 'sla_warning_red' : 'sla_warning_yellow',
          recipient: {
            email: admin.email,
            name: admin.name,
            userId: admin.auth_user_id,
          },
          request: {
            id: request.id,
            title: request.title,
            status: request.status,
            priority: request.priority,
          },
          sla: {
            hoursRemaining,
            hoursElapsed,
            targetHours,
            warningLevel,
          },
          client: {
            companyName: request.client.company_name,
          },
          assignedTo: request.assigned_to_user
            ? {
                name: request.assigned_to_user.name,
              }
            : undefined,
          requestUrl: `${appUrl}/admin/requests/${request.id}`,
        });
      });
    }

    return sendBatchEmails(emails);
  } catch (error) {
    console.error('[Email] Error sending SLA warning emails:', error);
    return [{ success: false, error: error instanceof Error ? error.message : 'Unknown error' }];
  }
}

// Export all email sending helpers
export { checkEmailPreferences, checkRateLimit, logEmailDelivery };
