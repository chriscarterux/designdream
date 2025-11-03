// Client Dashboard Types

export interface ClientRequest {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  requestType: RequestType;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  deadline?: string;
  estimatedTimeline: string;
  completedAt?: string;
  slaDeadline?: string;
  slaRemaining?: number;
  assigneeName?: string;
  assigneeAvatar?: string;
  commentCount: number;
  attachmentCount: number;
}

export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'in-progress'
  | 'completed'
  | 'on-hold'
  | 'cancelled';

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RequestType = 'design' | 'development' | 'ai';

export interface ClientActivity {
  id: string;
  requestId?: string;
  requestTitle?: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export type ActivityType =
  | 'request_submitted'
  | 'request_updated'
  | 'status_changed'
  | 'comment_added'
  | 'file_uploaded'
  | 'request_completed'
  | 'payment_processed'
  | 'subscription_updated';

export interface ClientStats {
  activeRequests: number;
  completedThisMonth: number;
  totalCompleted: number;
  averageTurnaround: string;
  totalSpent: number;
}

export interface ClientSubscription {
  id: string;
  plan: 'standard' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'draft';
  created: string;
  dueDate?: string;
  paidAt?: string;
  hostedInvoiceUrl?: string;
  pdfUrl?: string;
}

// Helper functions
export function getStatusColor(status: RequestStatus): string {
  const colors = {
    draft: 'bg-gray-100 text-gray-800 border-gray-300',
    submitted: 'bg-blue-100 text-blue-800 border-blue-300',
    'in-review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'in-progress': 'bg-purple-100 text-purple-800 border-purple-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    'on-hold': 'bg-orange-100 text-orange-800 border-orange-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status] || colors.draft;
}

export function getStatusLabel(status: RequestStatus): string {
  const labels = {
    draft: 'Draft',
    submitted: 'Submitted',
    'in-review': 'In Review',
    'in-progress': 'In Progress',
    completed: 'Completed',
    'on-hold': 'On Hold',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
}

export function getPriorityColor(priority: RequestPriority): string {
  const colors = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
  };
  return colors[priority] || colors.medium;
}

export function getPriorityLabel(priority: RequestPriority): string {
  const labels = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    urgent: 'Urgent',
  };
  return labels[priority] || priority;
}

export function getRequestTypeLabel(type: RequestType): string {
  const labels = {
    design: 'Design',
    development: 'Development',
    ai: 'AI/Automation',
  };
  return labels[type] || type;
}

export function formatCurrency(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}
