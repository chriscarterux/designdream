import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last updated: November 3, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using Design Dream's services ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
            </p>
            <p className="text-gray-700">
              Design Dream is a subscription-based design and development service operated by Christopher Carter ("we," "us," or "our"). These Terms apply to all subscribers, visitors, and users of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 mb-4">
              Design Dream provides unlimited design and development services on a subscription basis. Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>UI/UX design, branding, and mobile app design</li>
              <li>Web development (Next.js, React, Node.js)</li>
              <li>Mobile app development (React Native)</li>
              <li>AI-powered features and automations</li>
              <li>Project management via Basecamp</li>
            </ul>
            <p className="text-gray-700">
              Work is delivered one task at a time with an average turnaround of 48 business hours per task. Larger projects are broken into multiple tasks delivered sequentially.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Subscription Terms</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Subscription Plans</h3>
            <p className="text-gray-700 mb-4">
              Our monthly subscription is billed at $4,495/month. The first 10 subscribers lock in this rate permanently. After the first 10 subscriptions, the price increases to $5,995/month for new subscribers.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Billing</h3>
            <p className="text-gray-700 mb-4">
              Subscriptions are billed monthly in advance. Payment is due on the same day each month as your initial subscription date. All payments are processed securely through Stripe.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Active Subscription Required</h3>
            <p className="text-gray-700 mb-4">
              You must maintain an active subscription to submit requests and receive work. If your subscription lapses due to payment failure, your access will be suspended until payment is received.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Pausing Subscription</h3>
            <p className="text-gray-700">
              You may pause your subscription at any time. While paused, you cannot submit new requests or receive work, but you retain access to previously completed work. Paused subscriptions do not accrue billing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Service Limitations</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 One Task at a Time</h3>
            <p className="text-gray-700 mb-4">
              To ensure quality and speed, we work on one task at a time per subscriber. You may have unlimited requests in your backlog and can prioritize them in any order.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Turnaround Time</h3>
            <p className="text-gray-700 mb-4">
              Average turnaround is 48 business hours per task (Monday-Friday, 9am-5pm Central Time). Actual delivery time depends on task complexity. Complex projects are broken into smaller tasks, each delivered within 48 hours.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Revisions</h3>
            <p className="text-gray-700 mb-4">
              Each task includes two rounds of revisions. Additional revisions beyond two rounds require a new request in the backlog.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Excluded Services</h3>
            <p className="text-gray-700 mb-4">
              The following are not included in the Service:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>3D modeling, animation, or video editing</li>
              <li>Physical product design or packaging</li>
              <li>Content writing, copywriting, or SEO services</li>
              <li>Server administration or infrastructure management</li>
              <li>White-label or resale of services to third parties</li>
              <li>Work for illegal, unethical, or harmful purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Ownership of Deliverables</h3>
            <p className="text-gray-700 mb-4">
              Upon full payment, you own the final deliverables created specifically for you. This includes designs, code, and other work products. We retain no ownership rights to completed and paid work.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 License to Tools and Frameworks</h3>
            <p className="text-gray-700 mb-4">
              Work may incorporate third-party libraries, frameworks, and tools (e.g., React, Next.js, Tailwind CSS) subject to their respective open-source licenses. You receive all rights to use these in accordance with their licenses.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Portfolio Rights</h3>
            <p className="text-gray-700 mb-4">
              We reserve the right to display completed work in our portfolio, case studies, and marketing materials unless you explicitly request confidentiality in writing.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.4 Your Content</h3>
            <p className="text-gray-700">
              You retain ownership of all content, materials, and assets you provide to us. You grant us a license to use these materials solely for the purpose of providing the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cancellation and Refunds</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Cancellation</h3>
            <p className="text-gray-700 mb-4">
              You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. You will retain access to the Service until the end of the paid period.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Refund Policy</h3>
            <p className="text-gray-700 mb-4">
              Due to the nature of our service, refunds are handled on a case-by-case basis. See our <Link href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</Link> for details.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Termination by Us</h3>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate your subscription if you violate these Terms, engage in abusive behavior, or use the Service for illegal purposes. In such cases, no refund will be provided for the remaining subscription period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Confidentiality</h2>
            <p className="text-gray-700 mb-4">
              We treat all client projects and information as confidential. We will not disclose your business information, project details, or proprietary data to third parties without your consent.
            </p>
            <p className="text-gray-700">
              You agree to keep any proprietary processes, methods, or business information shared by Design Dream confidential.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Warranties and Disclaimers</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Professional Standards</h3>
            <p className="text-gray-700 mb-4">
              We strive to deliver high-quality work that meets professional standards. However, all work is provided "as is" without warranties of any kind, express or implied.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 No Guarantee of Results</h3>
            <p className="text-gray-700 mb-4">
              We do not guarantee specific business outcomes, conversion rates, traffic increases, or other results from using our deliverables. Success depends on many factors beyond our control.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">8.3 Third-Party Services</h3>
            <p className="text-gray-700">
              We are not responsible for issues with third-party platforms, services, or APIs that may affect the functionality of delivered work (e.g., Stripe, Vercel, AWS).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, Design Dream shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of the Service.
            </p>
            <p className="text-gray-700">
              Our total liability to you for any claims arising from the Service is limited to the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold Design Dream harmless from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or your infringement of any third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We may update these Terms from time to time. We will notify subscribers of material changes via email at least 30 days before the changes take effect. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
            <p className="text-gray-700">
              If you do not agree to the updated Terms, you may cancel your subscription before the changes take effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of the State of Texas, United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Dallas County, Texas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Design Dream</strong><br />
                Email: <a href="mailto:hello@designdream.is" className="text-blue-600 hover:underline">hello@designdream.is</a><br />
                Website: <a href="https://designdream.is" className="text-blue-600 hover:underline">designdream.is</a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
            <p className="text-gray-700">
              These Terms, together with our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> and <Link href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</Link>, constitute the entire agreement between you and Design Dream regarding the Service.
            </p>
          </section>

          {/* Acknowledgment */}
          <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-700 font-medium">
              By subscribing to Design Dream, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="text-blue-600 hover:underline">
              Refund Policy
            </Link>
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
