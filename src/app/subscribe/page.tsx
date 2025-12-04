'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatStripeAmount, stripeConfig } from '@/lib/stripe';
import { ArrowLeft, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { usePlausible } from '@/hooks/use-plausible';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = usePlausible();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Validate name (at least 2 characters)
      const trimmedName = name.trim();
      if (!trimmedName || trimmedName.length < 2) {
        throw new Error('Please enter a valid name');
      }

      // Sanitize inputs
      const sanitizedCompany = company.trim().slice(0, 100);

      // Track subscribe form submission
      trackEvent('Subscribe Form Submit', {
        props: {
          hasCompany: sanitizedCompany ? 'yes' : 'no',
        },
      });

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          customerName: trimmedName,
          metadata: {
            company: sanitizedCompany || undefined,
          },
          // Note: userId will be added when authentication is implemented
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;

    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            First 10 clients lock in this rate forever
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Design Dream Subscription
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your always-on design & development partner. Unlimited requests, delivered in 48 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pricing Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-blue-600">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Monthly Subscription
              </h2>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900">
                  {formatStripeAmount(stripeConfig.products.subscription.priceAmount)}
                </span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="mt-2 text-sm text-amber-600 font-semibold">
                Limited time: First 10 clients only
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900">What's included:</h3>
              <ul className="space-y-3">
                {[
                  'Unlimited design requests',
                  'Unlimited development requests',
                  'UI/UX, branding, mobile app design',
                  'Web development (Next.js, React, Node.js)',
                  'Mobile app development (React Native)',
                  'AI-powered features & automations',
                  'One task at a time (ensures quality)',
                  '48-hour turnaround per task',
                  'Two rounds of revisions per task',
                  'Daily progress updates via Basecamp',
                  'Pause or cancel anytime',
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Perfect for:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Startups, agencies, marketing teams, and product teams with backlogs
              </p>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get Started Today
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="Chris Carter"
                  required
                  maxLength={100}
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="chris@yourcompany.com"
                  required
                  maxLength={254}
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  disabled={loading}
                />
              </div>

              {/* Company Field */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="Your Company"
                  maxLength={100}
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div role="alert" aria-live="polite" className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-400 mr-2 flex-shrink-0"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Continue to Secure Checkout'
                )}
              </button>

              {/* Security Notice */}
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Lock className="h-4 w-4 mr-1" />
                Secure checkout powered by Stripe
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-blue-600">1.</span>
                  <span>Complete secure payment via Stripe</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">2.</span>
                  <span>Get instant access to your Basecamp project</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">3.</span>
                  <span>Submit your first request and see results in 48 hours</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                Questions? Email{' '}
                <a href="mailto:christophercarter@hey.com" className="text-blue-600 hover:underline">
                  christophercarter@hey.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can pause or cancel your subscription at any time. No contracts, no hard feelings. You'll keep access until the end of your current billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What does "one task at a time" mean?
              </h3>
              <p className="text-gray-600 text-sm">
                To ensure quality and speed, one task is active at a time. You can have unlimited requests in your backlog and prioritize them however you want.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How fast will I get my work?
              </h3>
              <p className="text-gray-600 text-sm">
                Each task is delivered within 48 business hours (Monday-Friday, 9am-5pm Central). Larger projects are broken into tasks delivered every 48 hours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure payment processor, Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 text-sm">
                Due to the high quality of work, refunds are handled on a case-by-case basis. Contact us if you're not satisfied and we'll make it right.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is this price locked in forever?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! The first 10 clients lock in $4,495/month forever. After that, the price increases to $5,995/month for new subscribers.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Backed by 15+ years of experience at:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 font-semibold">
            <span>Microsoft</span>
            <span className="text-gray-300">•</span>
            <span>JPMorgan Chase</span>
            <span className="text-gray-300">•</span>
            <span>Home Depot</span>
            <span className="text-gray-300">•</span>
            <span>Indeed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
