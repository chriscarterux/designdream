// Email template rendering functions

import { render } from '@react-email/render';
import SLAWarningEmail from '@/emails/sla-warning';
import SLAViolationEmail from '@/emails/sla-violation';
import NewRequestEmail from '@/emails/new-request';
import StatusChangedEmail from '@/emails/status-changed';
import CommentAddedEmail from '@/emails/comment-added';
import WelcomeEmail from '@/emails/welcome';
import PaymentFailedEmail from '@/emails/payment-failed';
import type {
  EmailData,
  SLAWarningEmailData,
  SLAViolationEmailData,
  NewRequestEmailData,
  StatusChangedEmailData,
  CommentAddedEmailData,
  WelcomeEmailData,
  PaymentFailedEmailData,
} from '@/types/email.types';

// Template rendering functions
export async function renderSLAWarningEmail(data: SLAWarningEmailData): Promise<string> {
  return await render(
    SLAWarningEmail({
      requestTitle: data.request.title,
      requestStatus: data.request.status,
      requestPriority: data.request.priority,
      hoursRemaining: data.sla.hoursRemaining,
      hoursElapsed: data.sla.hoursElapsed,
      targetHours: data.sla.targetHours,
      warningLevel: data.sla.warningLevel,
      companyName: data.client.companyName,
      assignedToName: data.assignedTo?.name,
      requestUrl: data.requestUrl,
      recipientName: data.recipient.name,
    })
  );
}

export async function renderSLAViolationEmail(data: SLAViolationEmailData): Promise<string> {
  return await render(
    SLAViolationEmail({
      requestTitle: data.request.title,
      requestStatus: data.request.status,
      requestPriority: data.request.priority,
      hoursElapsed: data.sla.hoursElapsed,
      targetHours: data.sla.targetHours,
      hoursOverdue: data.sla.hoursOverdue,
      companyName: data.client.companyName,
      assignedToName: data.assignedTo?.name,
      requestUrl: data.requestUrl,
      recipientName: data.recipient.name,
    })
  );
}

export async function renderNewRequestEmail(data: NewRequestEmailData): Promise<string> {
  return await render(
    NewRequestEmail({
      requestTitle: data.request.title,
      requestDescription: data.request.description,
      requestType: data.request.type,
      requestPriority: data.request.priority,
      companyName: data.client.companyName,
      contactName: data.client.contactName,
      requestUrl: data.requestUrl,
      recipientName: data.recipient.name,
    })
  );
}

export async function renderStatusChangedEmail(data: StatusChangedEmailData): Promise<string> {
  return await render(
    StatusChangedEmail({
      requestTitle: data.request.title,
      oldStatus: data.request.oldStatus,
      newStatus: data.request.newStatus,
      message: data.message,
      nextSteps: data.nextSteps,
      estimatedCompletion: data.estimatedCompletion,
      requestUrl: data.requestUrl,
      recipientName: data.recipient.name,
    })
  );
}

export async function renderCommentAddedEmail(data: CommentAddedEmailData): Promise<string> {
  return await render(
    CommentAddedEmail({
      requestTitle: data.request.title,
      commentPreview: data.comment.preview,
      commentContent: data.comment.content,
      authorName: data.comment.authorName,
      authorType: data.comment.authorType,
      requestUrl: data.requestUrl,
      recipientName: data.recipient.name,
    })
  );
}

export async function renderWelcomeEmail(data: WelcomeEmailData): Promise<string> {
  return await render(
    WelcomeEmail({
      companyName: data.client.companyName,
      contactName: data.client.contactName,
      planType: data.subscription.planType,
      dashboardUrl: data.dashboardUrl,
      resourcesUrl: data.resourcesUrl,
    })
  );
}

export async function renderPaymentFailedEmail(data: PaymentFailedEmailData): Promise<string> {
  return await render(
    PaymentFailedEmail({
      recipientName: data.recipient.name,
      companyName: data.client.companyName,
      planName: data.payment.planName,
      amountDue: data.payment.amountDue,
      currency: data.payment.currency,
      attemptNumber: data.payment.attemptNumber,
      nextAttemptDate: data.payment.nextAttemptDate,
      reason: data.payment.reason,
      invoiceUrl: data.invoiceUrl,
      portalUrl: data.portalUrl,
    })
  );
}

// Main template renderer
export async function renderEmailTemplate(data: EmailData): Promise<string> {
  switch (data.type) {
    case 'sla_warning_yellow':
    case 'sla_warning_red':
      return await renderSLAWarningEmail(data as SLAWarningEmailData);

    case 'sla_violation':
      return await renderSLAViolationEmail(data as SLAViolationEmailData);

    case 'new_request':
      return await renderNewRequestEmail(data as NewRequestEmailData);

    case 'status_changed':
      return await renderStatusChangedEmail(data as StatusChangedEmailData);

    case 'comment_added':
      return await renderCommentAddedEmail(data as CommentAddedEmailData);

    case 'welcome':
      return await renderWelcomeEmail(data as WelcomeEmailData);

    case 'payment_failed':
      return await renderPaymentFailedEmail(data as PaymentFailedEmailData);

    default:
      throw new Error(`Unknown email type: ${(data as any).type}`);
  }
}

// Get email subject based on type
export function getEmailSubject(data: EmailData): string {
  switch (data.type) {
    case 'sla_warning_yellow':
      return `SLA Warning: ${(data as SLAWarningEmailData).request.title} - ${Math.round((data as SLAWarningEmailData).sla.hoursRemaining)} hours remaining`;

    case 'sla_warning_red':
      return `URGENT: ${(data as SLAWarningEmailData).request.title} - ${Math.round((data as SLAWarningEmailData).sla.hoursRemaining)} hours remaining`;

    case 'sla_violation':
      return `SLA VIOLATED: ${(data as SLAViolationEmailData).request.title}`;

    case 'new_request':
      return `New Request: ${(data as NewRequestEmailData).request.title}`;

    case 'status_changed':
      const statusData = data as StatusChangedEmailData;
      const status = statusData.request.newStatus.replace('_', ' ');
      return `Status Update: ${statusData.request.title} is now ${status}`;

    case 'comment_added':
      const commentData = data as CommentAddedEmailData;
      return `New comment from ${commentData.comment.authorName} on "${commentData.request.title}"`;

    case 'welcome':
      return `Welcome to DesignDream, ${(data as WelcomeEmailData).client.contactName}!`;

    case 'payment_failed':
      const paymentData = data as PaymentFailedEmailData;
      return `Payment Failed: ${paymentData.payment.planName} - Action Required`;

    default:
      return 'DesignDream Notification';
  }
}
