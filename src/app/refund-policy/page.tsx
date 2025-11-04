import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicy() {
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
            Refund Policy
          </h1>
          <p className="text-gray-600">
            Last updated: November 3, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-700 mb-4">
              At Design Dream, we are committed to delivering high-quality design and development work. This Refund Policy outlines the circumstances under which refunds may be granted and our process for handling refund requests.
            </p>
            <p className="text-gray-700">
              Due to the nature of our subscription-based service and the significant resources invested in each project, refunds are handled on a case-by-case basis with careful consideration of the specific circumstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. General Refund Policy</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 No Automatic Refunds</h3>
            <p className="text-gray-700 mb-4">
              Design Dream does not offer automatic refunds for subscription payments. Each refund request is evaluated individually based on the circumstances and the amount of work completed during the billing period.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Case-by-Case Evaluation</h3>
            <p className="text-gray-700 mb-4">
              We evaluate refund requests based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Amount of work delivered during the billing period</li>
              <li>Quality of work provided</li>
              <li>Timeliness of deliverables</li>
              <li>Responsiveness to feedback and revisions</li>
              <li>Communication and collaboration efforts</li>
              <li>Reason for the refund request</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Our Commitment</h3>
            <p className="text-gray-700">
              If you're not satisfied with the work, we will first attempt to resolve the issue through additional revisions, project adjustments, or other reasonable accommodations before considering a refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Scenarios Where Refunds May Be Granted</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Service Not Delivered</h3>
            <p className="text-gray-700 mb-4">
              If we fail to deliver any work within the first 30 days of your subscription despite having clear, actionable requests in your backlog, you may be eligible for a full refund of your most recent payment.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Technical Issues</h3>
            <p className="text-gray-700 mb-4">
              If technical problems on our end prevent you from accessing the service for an extended period (more than 7 consecutive days), you may be eligible for a prorated refund for the downtime.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Billing Errors</h3>
            <p className="text-gray-700 mb-4">
              If you were charged incorrectly due to a billing error (e.g., double-charged, charged after cancellation), you will receive a full refund of the erroneous charge.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 First Month Dissatisfaction</h3>
            <p className="text-gray-700 mb-4">
              If you are not satisfied with the service during your first billing cycle, we will work with you to address your concerns. If we cannot resolve the issues to your satisfaction, we may offer a partial refund based on the work completed.
            </p>
            <p className="text-gray-700">
              <strong>Note:</strong> This does not apply if you've received substantial work, used multiple revision rounds, or engaged extensively with the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Scenarios Where Refunds Are Not Granted</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Change of Mind</h3>
            <p className="text-gray-700 mb-4">
              Refunds are not provided if you simply change your mind about the subscription or decide you no longer need the service. In these cases, you should cancel your subscription to prevent future charges.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Work Already Delivered</h3>
            <p className="text-gray-700 mb-4">
              If we have delivered work during the billing period and you have accepted the deliverables (either explicitly or by using them in your business), refunds are generally not granted.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Subjective Dissatisfaction</h3>
            <p className="text-gray-700 mb-4">
              Refunds are not granted for subjective reasons like "I don't like the style" if:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>The work meets the specifications you provided</li>
              <li>The work is of professional quality</li>
              <li>You were offered revision rounds and did not use them</li>
              <li>You did not provide clear feedback during the process</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Lack of Engagement</h3>
            <p className="text-gray-700 mb-4">
              If you did not provide clear requirements, respond to requests for feedback, or engage with the service during the billing period, refunds are not granted. The subscription fee covers our availability and readiness to work on your projects.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.5 Violations of Terms</h3>
            <p className="text-gray-700 mb-4">
              If your subscription was terminated due to violations of our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>, no refund will be provided.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.6 Paused Subscriptions</h3>
            <p className="text-gray-700">
              Since paused subscriptions are not billed, there is nothing to refund during a paused period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund Amounts</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Full Refund</h3>
            <p className="text-gray-700 mb-4">
              Full refunds (100% of the monthly payment) may be granted only in exceptional circumstances, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>No work was delivered despite clear requests</li>
              <li>Billing error or duplicate charge</li>
              <li>Service was completely unavailable</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Partial Refund</h3>
            <p className="text-gray-700 mb-4">
              Partial refunds (prorated based on work completed) may be granted when:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Some work was delivered but did not meet expectations</li>
              <li>Service was unavailable for part of the billing period</li>
              <li>There were significant delays in delivery</li>
            </ul>
            <p className="text-gray-700">
              Partial refunds are calculated based on the value of work delivered during the billing period. For example, if you received 2 weeks of work in a 4-week billing cycle, the maximum refund would be 50% of the monthly fee.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Credits vs. Refunds</h3>
            <p className="text-gray-700">
              In some cases, we may offer account credits instead of cash refunds. Credits can be used for future subscription periods and never expire. This option is available when the issue can be reasonably resolved through continued service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. How to Request a Refund</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Contact Us First</h3>
            <p className="text-gray-700 mb-4">
              Before requesting a refund, please contact us to discuss your concerns. In most cases, we can resolve issues through:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Additional revision rounds</li>
              <li>Reassigning the project to a different designer or developer</li>
              <li>Adjusting the project scope or requirements</li>
              <li>Extending the delivery timeline</li>
              <li>Providing additional support or guidance</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Refund Request Process</h3>
            <p className="text-gray-700 mb-4">
              If you still wish to request a refund after discussing your concerns:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4">
              <li className="mb-2">
                <strong>Email us:</strong> Send a detailed refund request to <a href="mailto:hello@designdream.is" className="text-blue-600 hover:underline">hello@designdream.is</a>
              </li>
              <li className="mb-2">
                <strong>Include details:</strong> Describe the reason for the refund request, specific issues you experienced, and any attempts to resolve them
              </li>
              <li className="mb-2">
                <strong>Provide documentation:</strong> Include relevant communications, project briefs, deliverables, and feedback
              </li>
              <li className="mb-2">
                <strong>Allow review time:</strong> We will review your request within 5 business days
              </li>
              <li className="mb-2">
                <strong>Receive decision:</strong> We will respond with our decision and, if approved, the refund amount
              </li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Refund Processing Time</h3>
            <p className="text-gray-700 mb-4">
              Once approved, refunds are processed within 10 business days. Depending on your payment method and financial institution, it may take an additional 5-10 business days for the refund to appear in your account.
            </p>
            <p className="text-gray-700">
              Refunds are issued to the original payment method used for the subscription.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Chargebacks</h2>
            <p className="text-gray-700 mb-4">
              <strong>Important:</strong> If you initiate a chargeback without first contacting us to resolve the issue, your subscription will be immediately terminated and you will be banned from using Design Dream in the future.
            </p>
            <p className="text-gray-700 mb-4">
              Chargebacks should only be used in cases of fraud or unauthorized charges. For all other issues, please follow our refund request process outlined above.
            </p>
            <p className="text-gray-700">
              We reserve the right to pursue legal action to recover costs associated with unjustified chargebacks.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cancellation vs. Refunds</h2>
            <p className="text-gray-700 mb-4">
              Cancelling your subscription is different from requesting a refund:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Cancellation:</strong> Stops future billing but does not refund current payment. You retain access until the end of the paid period.</li>
              <li><strong>Refund:</strong> Returns all or part of your current payment, typically with immediate loss of access.</li>
            </ul>
            <p className="text-gray-700">
              If you're unsure whether you want to continue, we recommend pausing your subscription instead of canceling. Paused subscriptions can be resumed at any time without losing your account history or settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disputes</h2>
            <p className="text-gray-700 mb-4">
              If your refund request is denied and you disagree with our decision, you may:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 mb-4">
              <li>Request a detailed explanation of the denial reason</li>
              <li>Provide additional information or documentation to support your request</li>
              <li>Request escalation to senior management for final review</li>
            </ol>
            <p className="text-gray-700">
              All refund decisions are final after the escalation review. Disputes related to refunds are subject to the dispute resolution terms outlined in our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Refund Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Material changes will be communicated via email.
            </p>
            <p className="text-gray-700">
              Changes to this policy do not apply retroactively. Refund requests are evaluated based on the policy in effect at the time of the transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For refund requests or questions about this policy, please contact:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Design Dream</strong><br />
                Email: <a href="mailto:hello@designdream.is" className="text-blue-600 hover:underline">hello@designdream.is</a><br />
                Website: <a href="https://designdream.is" className="text-blue-600 hover:underline">designdream.is</a>
              </p>
            </div>
          </section>

          {/* Best Practices Summary */}
          <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded">
            <h3 className="font-bold text-gray-900 mb-3">How to Avoid Needing a Refund</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Provide clear, detailed project briefs and requirements</li>
              <li>• Respond promptly to requests for feedback or clarification</li>
              <li>• Use your revision rounds to refine work before final delivery</li>
              <li>• Communicate concerns early so we can address them proactively</li>
              <li>• Review delivered work carefully before accepting it</li>
              <li>• Contact us immediately if you're not satisfied with anything</li>
            </ul>
          </div>

          {/* Satisfaction Guarantee */}
          <div className="mt-8 p-6 bg-green-50 border-l-4 border-green-600 rounded">
            <h3 className="font-bold text-gray-900 mb-3">Our Satisfaction Commitment</h3>
            <p className="text-gray-700">
              Your satisfaction is our priority. While we don't offer automatic refunds, we are committed to working with you to resolve any issues and deliver work you're happy with. Most concerns can be addressed through communication, revisions, and collaboration. We encourage you to reach out at the first sign of dissatisfaction so we can make things right.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
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
