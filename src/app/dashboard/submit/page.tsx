'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SubmitRequestPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    // Submit request logic
    console.log('Submitting request:', data);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to success or request detail
    router.push('/dashboard/requests');
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submit New Request</h1>
        <p className="text-gray-600 mt-1">
          Fill out the form below to submit a new design request. We'll review it and get started right away.
        </p>
      </div>

      {/* Request Form */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              This page would integrate the multi-step RequestForm component from p0-request-form.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              The form includes: Request Type, Details, Priority & Timeline, Success Criteria, File Upload, and Review steps.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-gray-400">Component to import:</p>
              <code className="block bg-gray-100 p-3 rounded text-xs">
                {`import { RequestForm } from '@/components/forms/request-form';`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
