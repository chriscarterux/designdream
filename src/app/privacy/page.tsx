import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Design Dream',
  description: 'Learn how Design Dream collects, uses, and protects your data. GDPR and CCPA compliant privacy practices for our subscription design service.',
};

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: November 3, 2024
          </p>
        </div>

        {/* Content */}
        <main role="main" className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Design Dream ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our subscription-based design and development service.
            </p>
            <p className="text-gray-700">
              By using Design Dream, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
            <p className="text-gray-700 mb-4">
              When you subscribe to Design Dream, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Contact Information:</strong> Name, email address, company name</li>
              <li><strong>Payment Information:</strong> Credit card details (processed and stored securely by Stripe, not by us)</li>
              <li><strong>Account Information:</strong> Username, password, subscription preferences</li>
              <li><strong>Project Information:</strong> Design briefs, project requirements, feedback, assets you upload</li>
              <li><strong>Communication Data:</strong> Messages, comments, and communications via Basecamp and email</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Information Collected Automatically</h3>
            <p className="text-gray-700 mb-4">
              When you use our service, we automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, interaction patterns</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies (see Section 7)</li>
              <li><strong>Log Data:</strong> Error logs, performance data, system diagnostics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Information from Third Parties</h3>
            <p className="text-gray-700 mb-4">
              We receive information from:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Stripe:</strong> Payment status, billing information, transaction details</li>
              <li><strong>Basecamp:</strong> Project activity, task completions, comment interactions</li>
              <li><strong>Analytics Providers:</strong> Website usage statistics, traffic sources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Provide the Service:</strong> Process requests, deliver work, manage projects</li>
              <li><strong>Process Payments:</strong> Charge subscriptions, handle billing, issue refunds</li>
              <li><strong>Communicate:</strong> Send project updates, respond to inquiries, provide support</li>
              <li><strong>Improve Service:</strong> Analyze usage patterns, fix bugs, develop new features</li>
              <li><strong>Ensure Security:</strong> Prevent fraud, protect against threats, enforce our Terms</li>
              <li><strong>Legal Compliance:</strong> Meet regulatory requirements, respond to legal requests</li>
              <li><strong>Marketing:</strong> Send newsletters, promotions (with your consent - you can opt out)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-gray-700 mb-4">
              If you are in the European Economic Area (EEA), we process your data based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Contract Performance:</strong> Processing necessary to provide the Service</li>
              <li><strong>Legitimate Interests:</strong> Improving service, preventing fraud, analytics</li>
              <li><strong>Legal Obligation:</strong> Tax compliance, responding to legal requests</li>
              <li><strong>Consent:</strong> Marketing emails, non-essential cookies (you can withdraw consent anytime)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. How We Share Your Information</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We share data with trusted third-party service providers:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Stripe:</strong> Payment processing and billing management</li>
              <li><strong>Basecamp:</strong> Project management and communication</li>
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Vercel:</strong> Hosting and infrastructure</li>
              <li><strong>Anthropic (Claude AI):</strong> Request analysis and automation</li>
              <li><strong>Email Services:</strong> Transactional emails and notifications</li>
            </ul>
            <p className="text-gray-700 mb-4">
              These providers are contractually obligated to protect your data and use it only for the specified purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Legal Requirements</h3>
            <p className="text-gray-700 mb-4">
              We may disclose your information if required by law, court order, or government regulation, or to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Comply with legal processes</li>
              <li>Protect our rights and property</li>
              <li>Prevent fraud or illegal activity</li>
              <li>Protect the safety of our users or the public</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Business Transfers</h3>
            <p className="text-gray-700">
              If Design Dream is acquired, merged, or sells assets, your information may be transferred to the new owner. We will notify you via email before your data is transferred and subject to a different privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Account Data:</strong> Retained while your subscription is active, plus 90 days after cancellation</li>
              <li><strong>Project Files:</strong> Retained for 1 year after subscription ends (then archived or deleted)</li>
              <li><strong>Payment Records:</strong> Retained for 7 years for tax and accounting purposes</li>
              <li><strong>Communication Logs:</strong> Retained for 2 years for support and quality purposes</li>
              <li><strong>Analytics Data:</strong> Aggregated data may be retained indefinitely</li>
            </ul>
            <p className="text-gray-700">
              You may request deletion of your data at any time (see Section 10).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Essential Cookies:</strong> Required for authentication, security, and basic functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the site</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Managing Cookies</h3>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings. Note that disabling essential cookies may affect service functionality. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>View and delete cookies</li>
              <li>Block third-party cookies</li>
              <li>Clear all cookies when closing the browser</li>
              <li>Manage cookie preferences per-site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Encryption:</strong> All data transmitted over HTTPS/TLS</li>
              <li><strong>Payment Security:</strong> PCI DSS compliant payment processing via Stripe</li>
              <li><strong>Access Controls:</strong> Limited employee access based on role requirements</li>
              <li><strong>Authentication:</strong> Secure password hashing and session management</li>
              <li><strong>Monitoring:</strong> Continuous security monitoring and threat detection</li>
              <li><strong>Backups:</strong> Regular encrypted backups of all data</li>
            </ul>
            <p className="text-gray-700">
              While we take reasonable precautions, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              Design Dream operates from the United States. If you are located outside the U.S., your information will be transferred to and processed in the United States, which may have different data protection laws than your country.
            </p>
            <p className="text-gray-700">
              We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses approved by the European Commission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Your Privacy Rights</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.1 Rights for All Users</h3>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
              <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.2 Additional Rights (GDPR - EEA Users)</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Restriction of Processing:</strong> Limit how we use your data</li>
              <li><strong>Object to Processing:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for processing at any time</li>
              <li><strong>Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.3 Additional Rights (CCPA - California Users)</h3>
            <p className="text-gray-700 mb-4">
              California residents have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Know what personal information we collect and how it's used</li>
              <li>Request deletion of personal information</li>
              <li>Opt-out of the "sale" of personal information (we do not sell your data)</li>
              <li>Non-discrimination for exercising privacy rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.4 How to Exercise Your Rights</h3>
            <p className="text-gray-700 mb-4">
              To exercise any of these rights, contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                Email: <a href="mailto:privacy@designdream.is" className="text-blue-600 hover:underline">privacy@designdream.is</a>
              </p>
            </div>
            <p className="text-gray-700 mt-4">
              We will respond to your request within 30 days. We may ask you to verify your identity before processing your request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
            <p className="text-gray-700">
              Design Dream is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will delete it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Third-Party Links</h2>
            <p className="text-gray-700">
              Our service may contain links to third-party websites (e.g., Basecamp, Stripe). We are not responsible for the privacy practices of these sites. We encourage you to read their privacy policies before providing any information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Do Not Track Signals</h2>
            <p className="text-gray-700">
              Some browsers include a "Do Not Track" (DNT) feature. Our service does not currently respond to DNT signals. We will update this policy if we implement DNT response capabilities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last updated" date at the top</li>
              <li>Sending an email notification (for material changes)</li>
            </ul>
            <p className="text-gray-700">
              We encourage you to review this policy periodically. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Design Dream</strong><br />
                Email: <a href="mailto:privacy@designdream.is" className="text-blue-600 hover:underline">privacy@designdream.is</a><br />
                Support: <a href="mailto:hello@designdream.is" className="text-blue-600 hover:underline">hello@designdream.is</a><br />
                Website: <a href="https://designdream.is" className="text-blue-600 hover:underline">designdream.is</a>
              </p>
            </div>
          </section>

          {/* Key Points Summary */}
          <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded">
            <h3 className="font-bold text-gray-900 mb-3">Key Points Summary</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• We collect only the information necessary to provide our service</li>
              <li>• We never sell your personal data to third parties</li>
              <li>• We use industry-standard security measures to protect your data</li>
              <li>• You have full control over your data and can request deletion at any time</li>
              <li>• We comply with GDPR, CCPA, and other privacy regulations</li>
            </ul>
          </div>
        </main>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
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
