import { NextResponse } from 'next/server';
import type { ClientActivity } from '@/types/client';

export async function GET() {
  // Mock activity data
  const activities: ClientActivity[] = [
    {
      id: '1',
      requestId: '1',
      requestTitle: 'Redesign landing page hero section',
      type: 'status_changed',
      title: 'Status updated to In Progress',
      description: 'Sarah Designer started working on your request',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      requestId: '1',
      requestTitle: 'Redesign landing page hero section',
      type: 'comment_added',
      title: 'New comment on your request',
      description: 'Sarah Designer: "I\'ve created some initial mockups for review"',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      requestId: '2',
      requestTitle: 'Create social media graphics',
      type: 'file_uploaded',
      title: 'New files uploaded',
      description: 'Mike Creative uploaded 3 design files',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      requestId: '3',
      requestTitle: 'Build custom contact form',
      type: 'request_submitted',
      title: 'New request submitted',
      description: 'Your request has been received and is awaiting review',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      type: 'payment_processed',
      title: 'Payment successful',
      description: 'Your monthly subscription payment of $99 was processed',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      requestId: '4',
      requestTitle: 'AI chatbot integration',
      type: 'request_completed',
      title: 'Request completed',
      description: 'AI chatbot integration has been completed and deployed',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '7',
      requestId: '5',
      requestTitle: 'Update brand colors',
      type: 'request_completed',
      title: 'Request completed',
      description: 'Brand colors have been updated across all dashboard components',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return NextResponse.json({ activities });
}
