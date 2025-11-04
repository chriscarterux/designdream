import { NextRequest, NextResponse } from 'next/server';
import type { ClientRequest } from '@/types/client';

// Mock request data
const mockRequest: ClientRequest = {
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
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // In production, fetch from database
  const request_data = { ...mockRequest, id };

  return NextResponse.json({ request: request_data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // In production, update in database
  const updatedRequest = {
    ...mockRequest,
    id,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ request: updatedRequest });
}
