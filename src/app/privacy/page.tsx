import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Design Dream',
  description: 'Learn how Design Dream collects, uses, and protects your data. GDPR and CCPA compliant privacy practices for our subscription design service.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-violet-400 hover:text-violet-300 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-400">
            Last updated: December 4, 2024
          </p>
          <p className="text-zinc-400 mt-2">
            Effective Date: December 4, 2024
          </p>
        </div>

        {/* Content */}
        <main role="main" className="prose prose-invert prose-lg max-w-none">

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-zinc-300 mb-4">
              Design Dream ("we," "us," or "our") is operated by Christopher Carter, a sole proprietorship based in Texas, United States. We are committed to protecting your privacy and handling your personal data with transparency and care.
            </p>
            <p className="text-zinc-300 mb-4">
              This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use our subscription-based design and development service. This policy applies to all users of designdream.is and related services.
            </p>
            <p className="text-zinc-300">
              By using Design Dream, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with this policy, please do not use our service.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-white mb-3">2.1 Information You Provide Directly</h3>
            <p className="text-zinc-300 mb-4">
              When you subscribe to Design Dream or interact with our service, you provide us with the following information:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password, company name (optional)</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address, and payment history (processed securely by Stripe—we do not store your full payment card details)</li>
              <li><strong>Project Information:</strong> Design briefs, project requirements, task descriptions, feedback, files, images, logos, and any other materials you upload or share through Linear</li>
              <li><strong>Communication Data:</strong> Messages, comments, emails, and other communications exchanged with us through Linear, email, or Cal.com</li>
              <li><strong>Support Requests:</strong> Information you provide when contacting customer support</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Information Collected Automatically</h3>
            <p className="text-zinc-300 mb-4">
              When you visit our website or use our service, we automatically collect certain information:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on pages, click patterns, and navigation paths</li>
              <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device type, screen resolution, and language preferences</li>
              <li><strong>Analytics Data:</strong> Aggregate, anonymized data collected via Plausible Analytics (privacy-friendly, no personal identifiers)</li>
              <li><strong>Log Data:</strong> Server logs, error reports, access times, and system diagnostics</li>
              <li><strong>Cookies:</strong> Minimal essential cookies for authentication and functionality (see Section 8)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Information from Third-Party Services</h3>
            <p className="text-zinc-300 mb-4">
              We use trusted third-party services to operate Design Dream. These services may share certain information with us:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-2">
              <li><strong>Stripe:</strong> Payment status, transaction details, billing history, and subscription status</li>
              <li><strong>Linear:</strong> Task activity, project data, comments, file attachments, and workspace interactions</li>
              <li><strong>Cal.com:</strong> Appointment scheduling data, meeting times, and calendar availability</li>
              <li><strong>Supabase:</strong> User authentication, database records, and session management</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-zinc-300 mb-4">
              We collect and use your personal information for the following purposes:
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">3.1 Provide the Service</h3>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Process your subscription and manage your account</li>
              <li>Deliver design and development work according to your requests</li>
              <li>Manage projects and tasks through Linear</li>
              <li>Communicate with you about your projects and provide updates</li>
              <li>Schedule meetings and consultations via Cal.com</li>
              <li>Deliver completed files, designs, and code</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Process Payments</h3>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Charge subscription fees and process payments via Stripe</li>
              <li>Issue invoices and receipts</li>
              <li>Handle refund requests and cancellations</li>
              <li>Prevent fraud and unauthorized transactions</li>
              <li>Maintain accurate billing and tax records</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Improve Our Service</h3>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Analyze usage patterns and user behavior to improve features</li>
              <li>Fix bugs, errors, and technical issues</li>
              <li>Develop new features and enhancements</li>
              <li>Conduct research and testing to optimize user experience</li>
              <li>Gather feedback and measure customer satisfaction</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.4 Security and Legal Compliance</h3>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Protect against fraud, abuse, and security threats</li>
              <li>Enforce our Terms & Conditions and other policies</li>
              <li>Comply with legal obligations, including tax laws and regulations</li>
              <li>Respond to legal requests, court orders, and government inquiries</li>
              <li>Protect our rights, property, and safety, as well as those of our users</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.5 Marketing (With Your Consent)</h3>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Send promotional emails, newsletters, and service updates (you can opt out anytime)</li>
              <li>Share company news, blog posts, and case studies</li>
              <li>Notify you of new features, services, or special offers</li>
            </ul>
          </section>

          {/* Legal Basis for Processing (GDPR) */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-zinc-300 mb-4">
              If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, we process your personal data based on the following legal grounds:
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Contract Performance</h4>
              <p className="text-zinc-300">
                Processing necessary to provide the service, manage your subscription, deliver work, and fulfill our contractual obligations to you.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Legitimate Interests</h4>
              <p className="text-zinc-300">
                Processing necessary for our legitimate business interests, including improving service quality, preventing fraud, ensuring security, analyzing usage, and conducting business operations—provided these interests do not override your rights.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Legal Obligation</h4>
              <p className="text-zinc-300">
                Processing required to comply with legal and regulatory requirements, including tax laws, financial record-keeping, and responding to lawful government requests.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Consent</h4>
              <p className="text-zinc-300">
                Processing based on your explicit consent for marketing emails, newsletters, and non-essential cookies. You may withdraw consent at any time without affecting the lawfulness of processing before withdrawal.
              </p>
            </div>
          </section>

          {/* How We Share Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. How We Share Your Information</h2>
            <p className="text-zinc-300 mb-4">
              <strong className="text-white">We do not sell your personal data to third parties.</strong> We only share your information in the following limited circumstances:
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">5.1 Service Providers</h3>
            <p className="text-zinc-300 mb-4">
              We share data with trusted third-party service providers who help us operate the service. These providers are contractually obligated to protect your data and use it only for the specified purposes:
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Payment Processing:</h4>
              <p className="text-zinc-300 mb-2">
                <strong>Stripe, Inc.</strong> - Processes payments, manages subscriptions, stores payment card data securely, and handles billing.
              </p>
              <p className="text-zinc-400 text-sm">
                Privacy Policy: <a href="https://stripe.com/privacy" className="text-violet-400 hover:text-violet-300 underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Project Management:</h4>
              <p className="text-zinc-300 mb-2">
                <strong>Linear</strong> - Hosts your project workspace, stores tasks, comments, attachments, and facilitates communication between you and our team.
              </p>
              <p className="text-zinc-400 text-sm">
                Privacy Policy: <a href="https://linear.app/privacy" className="text-violet-400 hover:text-violet-300 underline" target="_blank" rel="noopener noreferrer">linear.app/privacy</a>
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Database & Authentication:</h4>
              <p className="text-zinc-300 mb-2">
                <strong>Supabase</strong> - Provides database hosting (PostgreSQL), user authentication, and secure data storage. Data is stored on US-based servers.
              </p>
              <p className="text-zinc-400 text-sm">
                Privacy Policy: <a href="https://supabase.com/privacy" className="text-violet-400 hover:text-violet-300 underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Analytics:</h4>
              <p className="text-zinc-300 mb-2">
                <strong>Plausible Analytics</strong> - Privacy-friendly website analytics. Does not use cookies, does not track personal data, and does not collect personally identifiable information. All data is aggregated and anonymized. GDPR, CCPA, and PECR compliant.
              </p>
              <p className="text-zinc-400 text-sm">
                Privacy Policy: <a href="https://plausible.io/privacy" className="text-violet-400 hover:text-violet-300 underline" target="_blank" rel="noopener noreferrer">plausible.io/privacy</a>
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Scheduling:</h4>
              <p className="text-zinc-300 mb-2">
                <strong>Cal.com</strong> - Handles appointment scheduling and calendar management. Uses functional cookies only for booking functionality.
              </p>
              <p className="text-zinc-400 text-sm">
                Privacy Policy: <a href="https://cal.com/privacy" className="text-violet-400 hover:text-violet-300 underline" target="_blank" rel="noopener noreferrer">cal.com/privacy</a>
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Legal Requirements</h3>
            <p className="text-zinc-300 mb-4">
              We may disclose your information if required by law or in response to valid legal requests, including:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Complying with court orders, subpoenas, or government regulations</li>
              <li>Responding to lawful requests from law enforcement or regulatory authorities</li>
              <li>Protecting our rights, property, or safety</li>
              <li>Preventing fraud, illegal activity, or security threats</li>
              <li>Enforcing our Terms & Conditions or other agreements</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3 Business Transfers</h3>
            <p className="text-zinc-300 mb-4">
              If Design Dream is acquired by another company, merges with another business, or sells substantially all of its assets, your personal information may be transferred to the new owner as part of the transaction.
            </p>
            <p className="text-zinc-300">
              In such an event, we will notify you via email at least 30 days before your data is transferred and becomes subject to a different privacy policy. You will have the opportunity to delete your account before the transfer.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.4 With Your Consent</h3>
            <p className="text-zinc-300">
              We may share your information with third parties when you explicitly consent, such as when you authorize us to share portfolio work publicly or integrate with additional third-party tools.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
            <p className="text-zinc-300 mb-4">
              We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy and to comply with legal obligations:
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Account Data</h4>
              <p className="text-zinc-300">
                Retained while your subscription is active, plus 90 days after cancellation to allow for reactivation. After 90 days, account data is permanently deleted unless you request earlier deletion.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Project Files & Deliverables</h4>
              <p className="text-zinc-300">
                Retained for 1 year after subscription ends to allow you to access completed work. After 1 year, files may be archived or deleted. You are responsible for downloading and backing up your files.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Payment & Billing Records</h4>
              <p className="text-zinc-300">
                Retained for 7 years to comply with US tax laws, accounting standards, and financial regulations. This includes invoices, receipts, transaction history, and subscription records.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Communication Logs</h4>
              <p className="text-zinc-300">
                Retained for 2 years for customer support, quality assurance, and dispute resolution purposes. Includes emails, Linear comments, and support tickets.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-2">Analytics Data</h4>
              <p className="text-zinc-300">
                Aggregated, anonymized analytics data may be retained indefinitely as it contains no personally identifiable information.
              </p>
            </div>

            <p className="text-zinc-300 mt-4">
              You may request deletion of your data at any time by contacting us (see Section 11). Some data may be retained longer if required by law or necessary to resolve disputes.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. International Data Transfers</h2>
            <p className="text-zinc-300 mb-4">
              Design Dream operates from the United States (Texas). If you are located outside the United States, your personal information will be transferred to, stored, and processed in the United States, which may have different data protection laws than your country or region.
            </p>
            <p className="text-zinc-300 mb-4">
              <strong className="text-white">For EEA, UK, and Swiss Users:</strong> We ensure appropriate safeguards are in place for international data transfers, including:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Service providers certified under the EU-US Data Privacy Framework (where applicable)</li>
              <li>Adequate data protection agreements with all third-party processors</li>
            </ul>
            <p className="text-zinc-300">
              By using Design Dream, you consent to the transfer of your information to the United States and processing in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-zinc-300 mb-4">
              Design Dream uses minimal cookies and tracking technologies. We prioritize privacy and do not use invasive tracking or third-party advertising cookies.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">8.1 Types of Cookies We Use</h3>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Essential Cookies (Required)</h4>
              <p className="text-zinc-300">
                Necessary for authentication, security, and basic service functionality. These cookies enable you to log in, maintain your session, and use core features. You cannot opt out of essential cookies as the service will not function without them.
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                Examples: Session tokens, authentication cookies, security tokens
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Functional Cookies (Optional)</h4>
              <p className="text-zinc-300">
                Remember your preferences, settings, and choices. These improve your user experience but are not strictly necessary.
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                Examples: Language preferences, theme settings (dark mode)
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.2 No Tracking Cookies</h3>
            <p className="text-zinc-300 mb-4">
              <strong className="text-white">We do not use:</strong>
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Third-party advertising cookies or trackers</li>
              <li>Cross-site tracking or behavioral profiling</li>
              <li>Social media tracking pixels (Facebook Pixel, LinkedIn Insight Tag, etc.)</li>
              <li>Google Analytics or other invasive analytics platforms</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.3 Plausible Analytics (Privacy-Friendly)</h3>
            <p className="text-zinc-300 mb-4">
              We use Plausible Analytics, a privacy-first analytics service that:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li><strong>Does not use cookies</strong> - No cookie banners needed</li>
              <li><strong>Does not track personal data</strong> - No IP addresses, user IDs, or identifying information</li>
              <li><strong>Does not collect PII</strong> - Fully GDPR, CCPA, and PECR compliant</li>
              <li><strong>Aggregates data only</strong> - All analytics are anonymous and aggregated</li>
              <li><strong>Open source and transparent</strong> - Code is publicly auditable</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.4 Managing Cookies</h3>
            <p className="text-zinc-300 mb-4">
              You can control and delete cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>View and delete cookies</li>
              <li>Block third-party cookies</li>
              <li>Clear all cookies when closing the browser</li>
              <li>Set alerts when cookies are sent</li>
            </ul>
            <p className="text-zinc-300">
              Note: Disabling essential cookies will prevent you from using Design Dream, as they are required for authentication and core functionality.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Data Security</h2>
            <p className="text-zinc-300 mb-4">
              We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction:
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">9.1 Technical Safeguards</h3>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-2">
              <li><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers is encrypted using HTTPS/TLS (Transport Layer Security)</li>
              <li><strong>Encryption at Rest:</strong> Sensitive data stored in databases is encrypted using AES-256 encryption</li>
              <li><strong>Secure Password Storage:</strong> Passwords are hashed using bcrypt with salt, making them irreversible</li>
              <li><strong>Payment Security:</strong> Payment card data is processed and stored by Stripe, a PCI DSS Level 1 certified payment processor. We never store full credit card numbers</li>
              <li><strong>Regular Backups:</strong> Encrypted daily backups stored securely with limited access</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">9.2 Access Controls</h3>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Limited employee and contractor access based on role and need-to-know</li>
              <li>Multi-factor authentication (MFA) required for administrative access</li>
              <li>Regular access reviews and principle of least privilege</li>
              <li>All access is logged and monitored</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">9.3 Monitoring & Response</h3>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Continuous security monitoring and intrusion detection</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Incident response plan for data breaches</li>
              <li>Security patches and updates applied promptly</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">9.4 Data Breach Notification</h3>
            <p className="text-zinc-300 mb-4">
              In the unlikely event of a data breach that affects your personal information, we will:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Notify affected users via email within 72 hours of discovery (GDPR requirement)</li>
              <li>Notify relevant supervisory authorities as required by law</li>
              <li>Provide details about the breach, data affected, and steps being taken</li>
              <li>Offer guidance on how you can protect yourself</li>
            </ul>

            <p className="text-zinc-300">
              <strong className="text-white">Important:</strong> While we implement robust security measures, no method of transmission or storage is 100% secure. We cannot guarantee absolute security of your data. You are responsible for maintaining the confidentiality of your password and account credentials.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Third-Party Links and Services</h2>
            <p className="text-zinc-300 mb-4">
              Our service may contain links to third-party websites, services, or resources (e.g., Stripe, Linear, Figma, GitHub). We are not responsible for the privacy practices or content of these third-party sites.
            </p>
            <p className="text-zinc-300">
              We strongly encourage you to review the privacy policies of any third-party services you interact with. This Privacy Policy applies only to information collected by Design Dream, not to information collected by third parties.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Your Privacy Rights</h2>

            <h3 className="text-xl font-semibold text-white mb-3">11.1 Rights for All Users</h3>
            <p className="text-zinc-300 mb-4">
              Regardless of your location, you have the following rights:
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Access Your Data</h4>
              <p className="text-zinc-300">
                Request a copy of the personal data we hold about you. We will provide this in a structured, commonly used, and machine-readable format (e.g., JSON, CSV).
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Correct Your Data</h4>
              <p className="text-zinc-300">
                Update or correct inaccurate or incomplete personal information. You can update most information directly in your account settings or by contacting us.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Delete Your Data</h4>
              <p className="text-zinc-300">
                Request deletion of your personal data (right to be forgotten). We will permanently delete your data within 30 days, except where we are legally required to retain it (e.g., tax records).
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Data Portability</h4>
              <p className="text-zinc-300">
                Receive your data in a portable format and transfer it to another service provider. We provide exports in common formats like JSON, CSV, or ZIP archives.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-white mb-2">Opt-Out of Marketing</h4>
              <p className="text-zinc-300">
                Unsubscribe from promotional emails and newsletters at any time by clicking the "unsubscribe" link in emails or contacting us. You will still receive transactional emails (receipts, account notifications).
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">11.2 Additional Rights for EEA/UK Users (GDPR)</h3>
            <p className="text-zinc-300 mb-4">
              If you are in the European Economic Area, United Kingdom, or Switzerland, you have additional rights under GDPR:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li><strong>Restriction of Processing:</strong> Request that we limit how we use your data in certain circumstances</li>
              <li><strong>Object to Processing:</strong> Object to processing based on legitimate interests or for direct marketing purposes</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for processing at any time (does not affect lawfulness of processing before withdrawal)</li>
              <li><strong>Lodge a Complaint:</strong> File a complaint with your local data protection authority if you believe we have violated your privacy rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">11.3 Additional Rights for California Users (CCPA/CPRA)</h3>
            <p className="text-zinc-300 mb-4">
              If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li><strong>Right to Know:</strong> Know what personal information we collect, use, disclose, and sell (we do not sell your data)</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt-out of the "sale" or "sharing" of personal information (we do not sell or share your data)</li>
              <li><strong>Right to Non-Discrimination:</strong> Not be discriminated against for exercising your privacy rights</li>
              <li><strong>Right to Limit:</strong> Limit the use and disclosure of sensitive personal information</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">11.4 How to Exercise Your Rights</h3>
            <p className="text-zinc-300 mb-4">
              To exercise any of these rights, please contact us at:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <p className="text-zinc-300">
                <strong className="text-white">Email:</strong> <a href="mailto:privacy@designdream.is" className="text-violet-400 hover:text-violet-300 underline">privacy@designdream.is</a><br />
                <strong className="text-white">Subject Line:</strong> Privacy Rights Request<br />
                <strong className="text-white">Include:</strong> Your name, email address, and specific request
              </p>
            </div>
            <p className="text-zinc-300 mt-4">
              We will respond to your request within 30 days (or as required by applicable law). We may ask you to verify your identity before processing your request to protect against unauthorized access.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Children's Privacy</h2>
            <p className="text-zinc-300 mb-4">
              Design Dream is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>
            <p className="text-zinc-300">
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at privacy@designdream.is. We will promptly delete such information from our systems.
            </p>
          </section>

          {/* Do Not Track */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">13. Do Not Track (DNT) Signals</h2>
            <p className="text-zinc-300 mb-4">
              Some web browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Because there is no common industry standard for DNT, our website does not currently respond to DNT signals.
            </p>
            <p className="text-zinc-300">
              However, we use privacy-friendly Plausible Analytics that does not track users or collect personally identifiable information, making DNT signals unnecessary for our analytics.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to This Privacy Policy</h2>
            <p className="text-zinc-300 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, legal requirements, or for other operational reasons.
            </p>
            <p className="text-zinc-300 mb-4">
              When we make material changes, we will:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Post the updated Privacy Policy on this page with a new "Last updated" date</li>
              <li>Notify active subscribers via email at least 30 days before material changes take effect</li>
              <li>For significant changes affecting your rights, request your consent where required by law</li>
            </ul>
            <p className="text-zinc-300">
              We encourage you to review this Privacy Policy periodically. Your continued use of the service after changes are posted constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Us</h2>
            <p className="text-zinc-300 mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <p className="text-zinc-300">
                <strong className="text-white">Design Dream</strong><br />
                Christopher Carter, Sole Proprietor<br />
                <strong className="text-white">Privacy Inquiries:</strong> <a href="mailto:privacy@designdream.is" className="text-violet-400 hover:text-violet-300 underline">privacy@designdream.is</a><br />
                <strong className="text-white">General Support:</strong> <a href="mailto:hello@designdream.is" className="text-violet-400 hover:text-violet-300 underline">hello@designdream.is</a><br />
                <strong className="text-white">Website:</strong> <a href="https://designdream.is" className="text-violet-400 hover:text-violet-300 underline">designdream.is</a>
              </p>
            </div>
          </section>

          {/* Summary Box */}
          <div className="mt-12 p-6 bg-violet-950/30 border border-violet-800/50 rounded-lg">
            <h3 className="font-bold text-white mb-3">Privacy Policy Key Points</h3>
            <ul className="text-zinc-300 space-y-2">
              <li><strong className="text-white">We do not sell your data</strong> - Your personal information is never sold to third parties</li>
              <li><strong className="text-white">Minimal data collection</strong> - We collect only what's necessary to provide the service</li>
              <li><strong className="text-white">Privacy-friendly analytics</strong> - Plausible Analytics collects no personal data or cookies</li>
              <li><strong className="text-white">Strong security</strong> - Industry-standard encryption, secure payment processing, and access controls</li>
              <li><strong className="text-white">Your rights respected</strong> - Access, correct, delete, or export your data anytime</li>
              <li><strong className="text-white">GDPR & CCPA compliant</strong> - Full compliance with major privacy regulations</li>
              <li><strong className="text-white">Transparent practices</strong> - Clear communication about data use and third-party services</li>
            </ul>
          </div>
        </main>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/" className="text-violet-400 hover:text-violet-300 transition-colors">
              Home
            </Link>
          </div>
          <p className="text-zinc-500 text-sm mt-4">
            © {new Date().getFullYear()} Design Dream. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
