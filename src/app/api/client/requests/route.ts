import { NextRequest, NextResponse } from 'next/server';
import type { ClientRequest } from '@/types/client';

// Mock data
const mockRequests: ClientRequest[] = [
  {
    id: '1',
    title: 'Redesign landing page hero section',
    description: 'Update the hero section with a more modern design, including new imagery and improved CTA placement.',
    status: 'in-progress',
    priority: 'high',
    requestType: 'design',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    estimatedTimeline: '3-5 days',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    slaRemaining: 2 * 24 * 60 * 60 * 1000,
    assigneeName: 'Sarah Designer',
    assigneeAvatar: '',
    commentCount: 5,
    attachmentCount: 3,
  },
  {
    id: '2',
    title: 'Create social media graphics for product launch',
    description: 'Need a set of graphics for Instagram, Facebook, and Twitter announcing our new product launch.',
    status: 'in-review',
    priority: 'urgent',
    requestType: 'design',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    estimatedTimeline: '1-2 days',
    slaDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    slaRemaining: 1 * 24 * 60 * 60 * 1000,
    assigneeName: 'Mike Creative',
    assigneeAvatar: '',
    commentCount: 3,
    attachmentCount: 8,
  },
  {
    id: '3',
    title: 'Build custom contact form with validation',
    description: 'Implement a multi-step contact form with field validation and email notifications.',
    status: 'submitted',
    priority: 'medium',
    requestType: 'development',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    estimatedTimeline: '5-7 days',
    commentCount: 0,
    attachmentCount: 2,
  },
  {
    id: '4',
    title: 'AI chatbot integration for customer support',
    description: 'Integrate an AI-powered chatbot to handle common customer support queries.',
    status: 'completed',
    priority: 'low',
    requestType: 'ai',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTimeline: '10-14 days',
    assigneeName: 'Alex Developer',
    assigneeAvatar: '',
    commentCount: 12,
    attachmentCount: 5,
  },
  {
    id: '5',
    title: 'Update brand colors across dashboard',
    description: 'Apply new brand color palette to all dashboard components.',
    status: 'completed',
    priority: 'medium',
    requestType: 'design',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedTimeline: '2-3 days',
    assigneeName: 'Sarah Designer',
    assigneeAvatar: '',
    commentCount: 4,
    attachmentCount: 1,
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');

  let filteredRequests = mockRequests;

  if (status && status !== 'all') {
    filteredRequests = mockRequests.filter((req) => req.status === status);
  }

  return NextResponse.json({ requests: filteredRequests });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newRequest: ClientRequest = {
    id: String(Date.now()),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commentCount: 0,
    attachmentCount: 0,
  };

  return NextResponse.json({ request: newRequest }, { status: 201 });
}
