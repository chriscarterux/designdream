'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useClientRequest } from '@/hooks/use-client-requests';

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { request, isLoading, isError } = useClientRequest(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Link>
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">Request not found</p>
              <p className="text-sm">The request you're looking for doesn't exist or has been removed.</p>
              <Button variant="outline" className="mt-6" asChild>
                <Link href="/dashboard/requests">Return to Requests</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard/requests">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Link>
      </Button>

      {/* Request Detail Component - reuse from p0-request-form */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{request.title}</h1>
              <p className="text-gray-600">{request.description}</p>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Request Details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Priority</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.priority}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.requestType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600">
                Full request detail view with comments, attachments, and activity timeline would be implemented here.
                This would reuse components from p0-request-form.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
