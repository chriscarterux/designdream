// Email notification types for DesignDream application

export type EmailType =
  | 'sla_warning_yellow'
  | 'sla_warning_red'
  | 'sla_violation'
  | 'new_request'
  | 'status_changed'
  | 'comment_added'
  | 'welcome'
  | 'payment_failed';

export interface EmailRecipient {
  email: string;
  name: string;
  userId?: string;
}

export interface BaseEmailData {
  recipient: EmailRecipient;
  type: EmailType;
}

export interface SLAWarningEmailData extends BaseEmailData {
  type: 'sla_warning_yellow' | 'sla_warning_red';
  request: {
    id: string;
    title: string;
    status: string;
    priority: string;
  };
  sla: {
    hoursRemaining: number;
    targetHours: number;
    hoursElapsed: number;
    warningLevel: 'yellow' | 'red';
  };
  client: {
    companyName: string;
  };
  assignedTo?: {
    name: string;
  };
  requestUrl: string;
}

export interface SLAViolationEmailData extends BaseEmailData {
  type: 'sla_violation';
  request: {
    id: string;
    title: string;
    status: string;
    priority: string;
  };
  sla: {
    hoursElapsed: number;
    targetHours: number;
    hoursOverdue: number;
  };
  client: {
    companyName: string;
  };
  assignedTo?: {
    name: string;
  };
  requestUrl: string;
}

export interface NewRequestEmailData extends BaseEmailData {
  type: 'new_request';
  request: {
    id: string;
    title: string;
    description: string;
    type: string;
    priority: string;
  };
  client: {
    companyName: string;
    contactName: string;
  };
  requestUrl: string;
}

export interface StatusChangedEmailData extends BaseEmailData {
  type: 'status_changed';
  request: {
    id: string;
    title: string;
    oldStatus: string;
    newStatus: string;
  };
  message?: string;
  nextSteps?: string;
  estimatedCompletion?: string;
  requestUrl: string;
}

export interface CommentAddedEmailData extends BaseEmailData {
  type: 'comment_added';
  request: {
    id: string;
    title: string;
  };
  comment: {
    content: string;
    preview: string;
    authorName: string;
    authorType: 'client' | 'admin';
  };
  requestUrl: string;
}

export interface WelcomeEmailData extends BaseEmailData {
  type: 'welcome';
  client: {
    companyName: string;
    contactName: string;
  };
  subscription: {
    planType: string;
  };
  dashboardUrl: string;
  resourcesUrl: string;
}

export interface PaymentFailedEmailData extends BaseEmailData {
  type: 'payment_failed';
  client: {
    companyName: string;
  };
  payment: {
    planName: string;
    amountDue: number;
    currency: string;
    attemptNumber: number;
    nextAttemptDate?: string;
    reason?: string;
  };
  invoiceUrl: string;
  portalUrl: string;
}

export type EmailData =
  | SLAWarningEmailData
  | SLAViolationEmailData
  | NewRequestEmailData
  | StatusChangedEmailData
  | CommentAddedEmailData
  | WelcomeEmailData
  | PaymentFailedEmailData;

export interface EmailPreferences {
  userId: string;
  emailEnabled: boolean;
  slaWarnings: boolean;
  statusUpdates: boolean;
  comments: boolean;
  marketing: boolean;
  updatedAt: Date;
}

export interface EmailDeliveryRecord {
  id: string;
  userId: string;
  email: string;
  emailType: EmailType;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  resendId?: string;
  error?: string;
  sentAt?: Date;
  createdAt: Date;
  metadata: Record<string, any>;
}

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
}
