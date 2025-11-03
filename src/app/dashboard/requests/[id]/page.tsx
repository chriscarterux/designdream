'use client';

import { use } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { RequestDetailComponent } from '@/components/requests/request-detail';
import { Button } from '@/components/ui/button';
import { RequestDetail } from '@/types/request';

// Mock data - replace with actual data fetching
const mockRequests: Record<string, RequestDetail> = {
  '1': {
    id: '1',
    requestType: 'design',
    title: 'Redesign user dashboard layout',
    description: `We need to redesign the user dashboard to improve usability and modernize the interface. The current design is outdated and users have reported difficulty finding key features.

Key areas to focus on:
- Navigation structure
- Information hierarchy
- Visual design and spacing
- Mobile responsiveness
- Performance optimization`,
    priority: 'high',
    status: 'in-progress',
    estimatedTimeline: '2-3 weeks',
    deadline: '2025-12-01',
    successCriteria: [
      {
        id: '1',
        text: 'All main features accessible within 2 clicks',
        completed: true,
      },
      {
        id: '2',
        text: 'Mobile-responsive design tested on all devices',
        completed: false,
      },
      {
        id: '3',
        text: 'Page load time under 2 seconds',
        completed: false,
      },
      {
        id: '4',
        text: 'User testing with at least 5 participants',
        completed: false,
      },
    ],
    files: [],
    clientId: 'user-1',
    clientName: 'John Doe',
    clientEmail: 'john.doe@example.com',
    assigneeId: 'team-1',
    assigneeName: 'Sarah Smith',
    comments: [
      {
        id: 'c1',
        requestId: '1',
        authorId: 'user-1',
        authorName: 'John Doe',
        content: 'Looking forward to seeing the initial mockups. When can we expect those?',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'c2',
        requestId: '1',
        authorId: 'team-1',
        authorName: 'Sarah Smith',
        content: 'I will have the initial mockups ready by end of week. Will focus on the navigation structure first.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    attachments: [
      {
        id: 'f1',
        requestId: '1',
        name: 'current-dashboard.png',
        size: 245600,
        type: 'image/png',
        url: 'https://placehold.co/1200x800/purple/white?text=Current+Dashboard',
        uploadedBy: 'user-1',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'f2',
        requestId: '1',
        name: 'requirements.pdf',
        size: 102400,
        type: 'application/pdf',
        url: '#',
        uploadedBy: 'user-1',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
    activities: [
      {
        id: 'a1',
        requestId: '1',
        type: 'created',
        userId: 'user-1',
        userName: 'John Doe',
        description: 'Created the request',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'a2',
        requestId: '1',
        type: 'status_changed',
        userId: 'admin-1',
        userName: 'Admin User',
        description: 'Changed status from submitted to in-review',
        metadata: { oldStatus: 'submitted', newStatus: 'in-review' },
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 'a3',
        requestId: '1',
        type: 'assignee_changed',
        userId: 'admin-1',
        userName: 'Admin User',
        description: 'Assigned to Sarah Smith',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 'a4',
        requestId: '1',
        type: 'file_uploaded',
        userId: 'user-1',
        userName: 'John Doe',
        description: 'Uploaded current-dashboard.png',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'a5',
        requestId: '1',
        type: 'status_changed',
        userId: 'team-1',
        userName: 'Sarah Smith',
        description: 'Changed status from in-review to in-progress',
        metadata: { oldStatus: 'in-review', newStatus: 'in-progress' },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'a6',
        requestId: '1',
        type: 'comment_added',
        userId: 'user-1',
        userName: 'John Doe',
        description: 'Added a comment',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'a7',
        requestId: '1',
        type: 'comment_added',
        userId: 'team-1',
        userName: 'Sarah Smith',
        description: 'Added a comment',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  '2': {
    id: '2',
    requestType: 'development',
    title: 'Implement user authentication system',
    description: 'Build a complete authentication system with login, registration, password reset, and email verification.',
    priority: 'urgent',
    status: 'submitted',
    estimatedTimeline: '1 week',
    successCriteria: [
      {
        id: '1',
        text: 'Secure authentication with JWT tokens',
        completed: false,
      },
      {
        id: '2',
        text: 'Email verification workflow',
        completed: false,
      },
      {
        id: '3',
        text: 'Password reset functionality',
        completed: false,
      },
    ],
    files: [],
    clientId: 'user-2',
    clientName: 'Jane Smith',
    clientEmail: 'jane.smith@example.com',
    comments: [],
    attachments: [],
    activities: [
      {
        id: 'a1',
        requestId: '2',
        type: 'created',
        userId: 'user-2',
        userName: 'Jane Smith',
        description: 'Created the request',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RequestDetailPage({ params }: PageProps) {
  const { id } = use(params);

  // In a real app, you would fetch the request data here
  const request = mockRequests[id];

  if (!request) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
          <p className="text-gray-600 mb-6">
            The request you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/dashboard/requests">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Requests
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Handle request updates
  const handleUpdate = async (updatedRequest: RequestDetail) => {
    console.log('Request updated:', updatedRequest);
    // In a real app, make API call to save changes
    // await updateRequest(updatedRequest);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Link>
        </Button>
      </div>

      {/* Request detail */}
      <RequestDetailComponent
        request={request}
        onUpdate={handleUpdate}
        canEdit={true}
        canChangeStatus={true}
      />
    </div>
  );
}
