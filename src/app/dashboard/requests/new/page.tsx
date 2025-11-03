'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RequestForm } from '@/components/forms/request-form';
import { useLoadDraft } from '@/hooks/use-request-form';
import { RequestFormData } from '@/lib/validations/request.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NewRequestPage() {
  const router = useRouter();
  const { draft, loadDraft, clearDraft } = useLoadDraft();
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [useDraft, setUseDraft] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      setShowDraftPrompt(true);
    }
  }, [loadDraft]);

  // Handle form submission
  const handleSubmit = async (data: RequestFormData) => {
    try {
      console.log('Submitting request:', data);

      // In a real application, you would send this to your API
      // const response = await fetch('/api/requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear the draft after successful submission
      clearDraft();

      // Show success message (you could use a toast library here)
      alert('Request submitted successfully!');

      // Redirect to requests list
      router.push('/dashboard/requests');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  // Handle draft decision
  const handleUseDraft = () => {
    setUseDraft(true);
    setShowDraftPrompt(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftPrompt(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Request</h1>
        <p className="mt-2 text-gray-600">
          Submit a new design, development, or AI request to the team
        </p>
      </div>

      {/* Draft prompt */}
      {showDraftPrompt && (
        <Card className="mb-6 border-purple-200 bg-purple-50">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <CardTitle className="text-base">Saved Draft Found</CardTitle>
                <CardDescription>
                  You have an unfinished request. Would you like to continue where you
                  left off?
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={handleUseDraft}
                variant="default"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continue Draft
              </Button>
              <Button onClick={handleDiscardDraft} variant="outline">
                Start Fresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request form */}
      {!showDraftPrompt && (
        <RequestForm
          defaultValues={useDraft ? draft || undefined : undefined}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
