'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SessionDetails {
  customerEmail: string;
  subscriptionId: string;
  amountTotal: number;
  status: string;
}

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    // Fetch session details
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`/api/stripe/checkout-session?session_id=${sessionId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch session details');
        }

        const data = await response.json();
        setSessionDetails(data);
      } catch (err) {
        console.error('Error fetching session details:', err);
        setError('Failed to load subscription details');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading your subscription details...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to verify your subscription'}</p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to DesignDream!
          </h1>
          <p className="text-lg text-gray-600">
            Your subscription is now active
          </p>
        </div>

        {/* Subscription Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{sessionDetails.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subscription ID:</span>
              <span className="font-mono text-sm text-gray-900">{sessionDetails.subscriptionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Amount:</span>
              <span className="font-medium text-gray-900">
                ${(sessionDetails.amountTotal / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {sessionDetails.status}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            What Happens Next?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Check Your Email (Within 5 Minutes)</h3>
                <p className="text-sm text-gray-600">
                  You'll receive a welcome email with your Linear project invite and onboarding guide. Check your spam folder if you don't see it.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Join Your Linear Project (Today)</h3>
                <p className="text-sm text-gray-600">
                  Accept the Linear invite and explore your project workspace. This is where all communication, requests, and deliveries happen.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Submit Your First Request (Anytime)</h3>
                <p className="text-sm text-gray-600">
                  Post your first design or development request in Linear. Be as detailed as possible with requirements, links, and examples.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                4
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Get Your First Delivery (48 Hours)</h3>
                <p className="text-sm text-gray-600">
                  Your completed task will be delivered within 48 business hours. Review it and request up to two rounds of revisions if needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Explanation */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            How DesignDream Works
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Your subscription includes unlimited requests with one active task at a time. Here's our workflow:
          </p>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900 mb-1">Queue</div>
              <div className="text-gray-600">Awaiting start</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900 mb-1">In Progress</div>
              <div className="text-gray-600">Being worked on</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900 mb-1">Review</div>
              <div className="text-gray-600">Ready for feedback</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900 mb-1">Revisions</div>
              <div className="text-gray-600">Making changes</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900 mb-1">Complete</div>
              <div className="text-gray-600">Delivered!</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            <strong>⏱️ Turnaround:</strong> 48 business hours per task (Mon-Fri, 9am-5pm Central)<br/>
            <strong>🔄 Revisions:</strong> Two rounds included per task<br/>
            <strong>📊 Updates:</strong> Daily progress reports via Linear
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 bg-gray-900 text-white text-center px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/settings/billing"
            className="flex-1 bg-gray-100 text-gray-900 text-center px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Manage Subscription
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Questions or need help?{' '}
          <a href="mailto:hello@designdream.is" className="text-blue-600 hover:underline font-medium">
            hello@designdream.is
          </a>
        </p>
      </div>
    </div>
  );
}
