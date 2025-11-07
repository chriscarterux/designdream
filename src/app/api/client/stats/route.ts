import { NextResponse } from 'next/server';
import type { ClientStats } from '@/types/client';

export async function GET() {
  // Mock stats data
  const stats: ClientStats = {
    activeRequests: 3,
    completedThisMonth: 5,
    totalCompleted: 42,
    averageTurnaround: '4.2 days',
    totalSpent: 99000, // $990 in cents
  };

  return NextResponse.json({ stats });
}
