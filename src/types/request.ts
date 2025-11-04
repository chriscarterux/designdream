import { RequestFormData, Priority, RequestType } from '@/lib/validations/request.schema';

// Request status type
export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'in-progress'
  | 'completed'
  | 'on-hold'
  | 'cancelled';

// Activity type for timeline
export type ActivityType =
  | 'created'
  | 'status_changed'
  | 'comment_added'
  | 'file_uploaded'
  | 'assignee_changed'
  | 'priority_changed'
  | 'updated';

// Comment interface
export interface Comment {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  attachments?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

// File attachment interface
export interface FileAttachment {
  id: string;
  requestId: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Activity timeline item
export interface ActivityItem {
  id: string;
  requestId: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// User info
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// Full request detail
export interface RequestDetail extends Omit<RequestFormData, 'status'> {
  id: string;
  status: RequestStatus;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAvatar?: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  comments: Comment[];
  attachments: FileAttachment[];
  activities: ActivityItem[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

// Helper function to get status color
export function getStatusColor(status: RequestStatus): string {
  const colors: Record<RequestStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-300',
    submitted: 'bg-blue-100 text-blue-800 border-blue-300',
    'in-review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'in-progress': 'bg-purple-100 text-purple-800 border-purple-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    'on-hold': 'bg-orange-100 text-orange-800 border-orange-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status];
}

// Helper function to get status label
export function getStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    'in-review': 'In Review',
    'in-progress': 'In Progress',
    completed: 'Completed',
    'on-hold': 'On Hold',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Helper function to get relative time
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Helper to get activity icon color
export function getActivityColor(type: ActivityType): string {
  const colors: Record<ActivityType, string> = {
    created: 'text-blue-600',
    status_changed: 'text-purple-600',
    comment_added: 'text-green-600',
    file_uploaded: 'text-orange-600',
    assignee_changed: 'text-indigo-600',
    priority_changed: 'text-red-600',
    updated: 'text-gray-600',
  };
  return colors[type];
}
