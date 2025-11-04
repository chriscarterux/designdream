// Email notification webhook handler
// Handles internal events that trigger email notifications

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, sendBatchEmails } from '@/lib/email/send';
import type { EmailData } from '@/types/email.types';

// Initialize Supabase client
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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.designdream.is';

// Verify internal webhook secret
function verifyWebhookSecret(request: NextRequest): boolean {
  const secret = request.headers.get('x-webhook-secret');
  return secret === process.env.INTERNAL_WEBHOOK_SECRET;
}

// Handle new request submission
async function handleNewRequest(requestId: string): Promise<void> {
  const { data: request, error } = await supabase
    .from('requests')
    .select(
      `
      *,
      client:clients(*)
    `
    )
    .eq('id', requestId)
    .single();

  if (error || !request) {
    throw new Error(`Request not found: ${requestId}`);
  }

  // Get all active admins
  const { data: admins } = await supabase
    .from('admin_users')
    .select('*')
    .eq('status', 'active');

  if (!admins || admins.length === 0) {
    console.warn('[Notification] No active admins found for new request notification');
    return;
  }

  // Prepare emails for all admins
  const emails: EmailData[] = admins.map((admin) => ({
    type: 'new_request',
    recipient: {
      email: admin.email,
      name: admin.name,
      userId: admin.auth_user_id,
    },
    request: {
      id: request.id,
      title: request.title,
      description: request.description || '',
      type: request.type,
      priority: request.priority,
    },
    client: {
      companyName: request.client.company_name,
      contactName: request.client.contact_name,
    },
    requestUrl: `${appUrl}/admin/queue`,
  }));

  await sendBatchEmails(emails);
}

// Handle status change
async function handleStatusChange(
  requestId: string,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  const { data: request, error } = await supabase
    .from('requests')
    .select(
      `
      *,
      client:clients(*)
    `
    )
    .eq('id', requestId)
    .single();

  if (error || !request) {
    throw new Error(`Request not found: ${requestId}`);
  }

  // Only notify client about meaningful status changes
  const notifiableStatuses = ['in_progress', 'review', 'done', 'blocked'];
  if (!notifiableStatuses.includes(newStatus)) {
    return;
  }

  // Get client user
  const { data: clientUser } = await supabase
    .from('clients')
    .select('auth_user_id, email, contact_name')
    .eq('id', request.client_id)
    .single();

  if (!clientUser) {
    console.warn(`[Notification] Client user not found for request: ${requestId}`);
    return;
  }

  // Get auth user email if not in client table
  let clientEmail = clientUser.email;
  if (!clientEmail && clientUser.auth_user_id) {
    const { data: authUser } = await supabase.auth.admin.getUserById(clientUser.auth_user_id);
    clientEmail = authUser.user?.email || '';
  }

  if (!clientEmail) {
    console.warn(`[Notification] No email found for client`);
    return;
  }

  // Customize message based on status
  let message = '';
  let nextSteps = '';

  switch (newStatus) {
    case 'in_progress':
      message = 'Great news! We\'ve started working on your request and you\'ll see updates soon.';
      nextSteps = 'We\'ll keep you posted on progress. Feel free to check in anytime.';
      break;
    case 'review':
      message = 'Your request is ready for review! We\'ve completed the work and would love your feedback.';
      nextSteps = 'Please review the deliverables and let us know if you\'d like any changes.';
      break;
    case 'done':
      message = 'Your request has been completed! All deliverables are ready for you.';
      nextSteps = 'Check out what we\'ve created. We hope you love it!';
      break;
    case 'blocked':
      message = 'We need some additional information from you to continue with this request.';
      nextSteps = 'Please review the request details and provide the information we need to proceed.';
      break;
  }

  const emailData: EmailData = {
    type: 'status_changed',
    recipient: {
      email: clientEmail,
      name: clientUser.contact_name || 'there',
      userId: clientUser.auth_user_id,
    },
    request: {
      id: request.id,
      title: request.title,
      oldStatus,
      newStatus,
    },
    message,
    nextSteps,
    requestUrl: `${appUrl}/dashboard/requests/${request.id}`,
  };

  await sendEmail(emailData);
}

// Handle new comment
async function handleNewComment(commentId: string): Promise<void> {
  const { data: comment, error } = await supabase
    .from('comments')
    .select(
      `
      *,
      request:requests(
        *,
        client:clients(*)
      )
    `
    )
    .eq('id', commentId)
    .single();

  if (error || !comment) {
    throw new Error(`Comment not found: ${commentId}`);
  }

  const emails: EmailData[] = [];

  // Notify client if comment is from admin
  if (comment.author_type === 'admin') {
    const { data: clientUser } = await supabase
      .from('clients')
      .select('auth_user_id, email, contact_name')
      .eq('id', comment.request.client_id)
      .single();

    if (clientUser) {
      let clientEmail = clientUser.email;
      if (!clientEmail && clientUser.auth_user_id) {
        const { data: authUser } = await supabase.auth.admin.getUserById(clientUser.auth_user_id);
        clientEmail = authUser.user?.email || '';
      }

      if (clientEmail) {
        emails.push({
          type: 'comment_added',
          recipient: {
            email: clientEmail,
            name: clientUser.contact_name || 'there',
            userId: clientUser.auth_user_id,
          },
          request: {
            id: comment.request.id,
            title: comment.request.title,
          },
          comment: {
            content: comment.content,
            preview: comment.content.substring(0, 150) + (comment.content.length > 150 ? '...' : ''),
            authorName: comment.author_name,
            authorType: 'admin',
          },
          requestUrl: `${appUrl}/dashboard/requests/${comment.request.id}#comments`,
        });
      }
    }
  }

  // Notify assigned admin if comment is from client
  if (comment.author_type === 'client' && comment.request.assigned_to) {
    const { data: admin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', comment.request.assigned_to)
      .single();

    if (admin) {
      emails.push({
        type: 'comment_added',
        recipient: {
          email: admin.email,
          name: admin.name,
          userId: admin.auth_user_id,
        },
        request: {
          id: comment.request.id,
          title: comment.request.title,
        },
        comment: {
          content: comment.content,
          preview: comment.content.substring(0, 150) + (comment.content.length > 150 ? '...' : ''),
          authorName: comment.author_name,
          authorType: 'client',
        },
        requestUrl: `${appUrl}/admin/requests/${comment.request.id}#comments`,
      });
    }
  }

  if (emails.length > 0) {
    await sendBatchEmails(emails);
  }
}

// Handle welcome email for new subscription
async function handleWelcome(clientId: string): Promise<void> {
  const { data: client, error } = await supabase
    .from('clients')
    .select(
      `
      *,
      subscription:subscriptions(*)
    `
    )
    .eq('id', clientId)
    .single();

  if (error || !client) {
    throw new Error(`Client not found: ${clientId}`);
  }

  // Get client email
  let clientEmail = client.email;
  if (!clientEmail && client.auth_user_id) {
    const { data: authUser } = await supabase.auth.admin.getUserById(client.auth_user_id);
    clientEmail = authUser.user?.email || '';
  }

  if (!clientEmail) {
    console.warn(`[Notification] No email found for client: ${clientId}`);
    return;
  }

  const emailData: EmailData = {
    type: 'welcome',
    recipient: {
      email: clientEmail,
      name: client.contact_name,
      userId: client.auth_user_id,
    },
    client: {
      companyName: client.company_name,
      contactName: client.contact_name,
    },
    subscription: {
      planType: client.subscription?.plan_type || 'core',
    },
    dashboardUrl: `${appUrl}/dashboard`,
    resourcesUrl: `${appUrl}/resources`,
  };

  await sendEmail(emailData);
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    if (!verifyWebhookSecret(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    console.log(`[Notification] Received webhook: ${type}`, data);

    // Handle different event types
    switch (type) {
      case 'new_request':
        await handleNewRequest(data.requestId);
        break;

      case 'status_changed':
        await handleStatusChange(data.requestId, data.oldStatus, data.newStatus);
        break;

      case 'comment_added':
        await handleNewComment(data.commentId);
        break;

      case 'welcome':
        await handleWelcome(data.clientId);
        break;

      default:
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Notification] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
