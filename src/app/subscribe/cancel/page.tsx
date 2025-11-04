import Link from 'next/link';

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        {/* Cancel Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscription Cancelled
          </h1>
          <p className="text-lg text-gray-600">
            Your payment was not completed
          </p>
        </div>

        {/* Message */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">
            No charges have been made to your account. You can return to complete your subscription at any time.
          </p>
          <p className="text-gray-600 text-sm">
            If you experienced any issues during checkout, please don't hesitate to reach out to our support team.
          </p>
        </div>

        {/* Why Subscribe Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Why Subscribe to DesignDream?
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Unlimited projects and team collaboration</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Advanced design tools and templates</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Priority support and onboarding</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime with no commitments</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/subscribe"
            className="block w-full bg-gray-900 text-white text-center px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-900 text-center px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Return to Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Have questions about pricing or features?
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="/pricing" className="text-gray-900 hover:underline">
              View Pricing
            </a>
            <span className="text-gray-300">|</span>
            <a href="mailto:support@designdream.com" className="text-gray-900 hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
