'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, User, ArrowRight } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@/types/request';
import { getRequestTypeLabel, getPriorityLabel } from '@/lib/validations/request.schema';
import { cn } from '@/lib/utils';

// Mock data - replace with actual data fetching
const mockRequests = [
  {
    id: '1',
    title: 'Redesign user dashboard layout',
    requestType: 'design' as const,
    priority: 'high' as const,
    status: 'in-progress' as const,
    clientName: 'John Doe',
    estimatedTimeline: '2-3 weeks',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Implement user authentication system',
    requestType: 'development' as const,
    priority: 'urgent' as const,
    status: 'submitted' as const,
    clientName: 'Jane Smith',
    estimatedTimeline: '1 week',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'AI chatbot for customer support',
    requestType: 'ai' as const,
    priority: 'medium' as const,
    status: 'in-review' as const,
    clientName: 'Mike Johnson',
    estimatedTimeline: '3-4 weeks',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export default function RequestsPage() {
  const hasRequests = mockRequests.length > 0;

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
          <p className="mt-2 text-gray-600">
            View and manage your design and development requests
          </p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {!hasRequests ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Requests</CardTitle>
            <CardDescription>
              All your submitted requests will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500">No requests yet</p>
              <Link href="/dashboard/requests/new">
                <Button variant="outline" className="mt-4">
                  Create your first request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <Link key={request.id} href={`/dashboard/requests/${request.id}`}>
              <Card className="group hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn('border', getStatusColor(request.status))}>
                          {getStatusLabel(request.status)}
                        </Badge>
                        <Badge variant="outline">
                          {getRequestTypeLabel(request.requestType)}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300">
                          {getPriorityLabel(request.priority)}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold group-hover:text-purple-600 transition-colors">
                        {request.title}
                      </h3>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{request.clientName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{request.estimatedTimeline}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span>Updated {getRelativeTime(request.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Arrow icon */}
                    <div className="flex items-center text-gray-400 group-hover:text-purple-600 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
