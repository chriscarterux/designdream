import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Design Dream',
  description: 'Design Dream Terms & Conditions - Subscription terms, refund policy, service limitations, and legal agreement for unlimited design and development services.',
};

export default function TermsOfService() {
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
            Terms & Conditions
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
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-zinc-300 mb-4">
              These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("Client," "you," or "your") and Christopher Carter, doing business as Design Dream ("Design Dream," "we," "us," or "our"), a sole proprietorship operating under the laws of the State of Texas.
            </p>
            <p className="text-zinc-300 mb-4">
              By subscribing to, accessing, or using Design Dream's services, you acknowledge that you have read, understood, and agree to be bound by these Terms, together with our Privacy Policy. If you do not agree to these Terms, you must not use our services.
            </p>
            <p className="text-zinc-300">
              These Terms are governed by the laws of the State of Texas and the Texas Business & Commerce Code. Any violation of these Terms may result in immediate termination of your subscription without refund.
            </p>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
            <p className="text-zinc-300 mb-4">
              Design Dream provides unlimited design and development services on a monthly subscription basis. Our services include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-2">
              <li><strong>Design Services:</strong> UI/UX design, web design, mobile app design, branding, graphic design, and design system creation</li>
              <li><strong>Development Services:</strong> Website development, web application development, mobile app development (React Native), API development, feature implementation, and code optimization</li>
              <li><strong>Revisions:</strong> Unlimited revisions on active tasks until you are satisfied with the deliverable</li>
              <li><strong>Project Management:</strong> All work is managed through Linear, where you create issues, prioritize tasks, and track progress</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Workflow</h3>
            <p className="text-zinc-300 mb-4">
              Our workflow operates as follows:
            </p>
            <ol className="list-decimal pl-6 text-zinc-300 mb-4 space-y-2">
              <li>You create issues in your Linear workspace describing tasks or requests</li>
              <li>You move one issue to "In Progress" when you want us to work on it</li>
              <li>We deliver the work within approximately 48 hours (target, not guaranteed)</li>
              <li>You review the work and request revisions or move the next task to "In Progress"</li>
              <li>Process repeats for unlimited tasks throughout your subscription period</li>
            </ol>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 One Active Task at a Time</h3>
            <p className="text-zinc-300">
              To ensure quality and timely delivery, we work on one active task at a time per subscriber. You may have unlimited issues in your Linear backlog and can prioritize them in any order. Once a task is completed, you may immediately move the next task to "In Progress."
            </p>
          </section>

          {/* Subscription Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Subscription Terms</h2>

            <h3 className="text-xl font-semibold text-white mb-3">3.1 Pricing and Billing Cycle</h3>
            <p className="text-zinc-300 mb-4">
              The Design Dream subscription is priced at $4,495 per month. Your subscription operates on a 31-day billing cycle, charged upfront at the start of each cycle.
            </p>
            <p className="text-zinc-300 mb-4">
              <strong className="text-white">Upfront Payment Model:</strong> Payment for each billing cycle is due and charged in full at the beginning of the 31-day period. You are purchasing access to the service for the entire upcoming billing cycle. No pro-rated billing is offered for partial months.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Payment Processing</h3>
            <p className="text-zinc-300 mb-4">
              All payments are processed securely through Stripe, Inc. By subscribing, you authorize us to charge your payment method on file at the start of each billing cycle. You are responsible for maintaining valid payment information.
            </p>
            <p className="text-zinc-300 mb-4">
              If payment fails, your access to the service will be immediately suspended until payment is received. Failed payments may result in late fees or termination of your subscription.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Automatic Renewal</h3>
            <p className="text-zinc-300 mb-4">
              Your subscription automatically renews at the end of each 31-day billing cycle unless you cancel before the renewal date. By subscribing, you authorize recurring charges to your payment method.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.4 Price Changes</h3>
            <p className="text-zinc-300">
              We reserve the right to modify our subscription pricing at any time. If we increase the subscription price, we will provide you with at least 30 days' advance notice via email. The new pricing will apply to your next billing cycle. Continued use of the service after the price change constitutes acceptance of the new price.
            </p>
          </section>

          {/* Cancellation and Refund Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Cancellation and Refund Policy</h2>

            <h3 className="text-xl font-semibold text-white mb-3">4.1 Cancellation</h3>
            <p className="text-zinc-300 mb-4">
              You may cancel your subscription at any time by contacting us at christophercarter@hey.com or through your billing portal. To avoid being charged for the next billing cycle, you must cancel at least 24 hours before your next renewal date.
            </p>
            <p className="text-zinc-300 mb-4">
              Upon cancellation, you will retain access to the service until the end of your current paid billing cycle. No partial refunds are provided for early cancellation within a billing cycle.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Refund Policy</h3>
            <p className="text-zinc-300 mb-4">
              <strong className="text-white">Due to the nature of our upfront payment model and the immediate availability of our services, our refund policy is strict.</strong> By subscribing, you acknowledge that you are purchasing access to services for a full 31-day billing cycle and that refunds are severely limited.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
              <h4 className="text-lg font-semibold text-white mb-3">Refund Eligibility:</h4>

              <div className="mb-4">
                <p className="text-white font-semibold mb-2">First 7 Days (Partial Refund)</p>
                <p className="text-zinc-300">
                  If you request a refund within the first 7 days of your initial billing cycle only, you may be eligible for a partial refund calculated as follows:
                </p>
                <ul className="list-disc pl-6 text-zinc-300 mt-2 space-y-1">
                  <li>Pro-rated refund based on unused days in the billing cycle</li>
                  <li>Minus the fair market value of any work completed and delivered</li>
                  <li>Minus a $500 administrative fee</li>
                </ul>
                <p className="text-zinc-300 mt-2 italic">
                  Example: If you paid $4,495 for a 31-day cycle, request a refund on day 5, and we completed $1,200 worth of work, your refund would be: [($4,495 / 31) × 26 remaining days] - $1,200 - $500 = $2,058.
                </p>
              </div>

              <div className="mb-4">
                <p className="text-white font-semibold mb-2">After 7 Days (No Refund)</p>
                <p className="text-zinc-300">
                  After the first 7 days of your initial billing cycle, no refunds will be issued under any circumstances. Your payment for the billing cycle is final and non-refundable.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">Subsequent Billing Cycles (No Refund)</p>
                <p className="text-zinc-300">
                  The 7-day partial refund window applies only to your first billing cycle. All subsequent billing cycles are 100% non-refundable from day one. By continuing your subscription beyond the first cycle, you acknowledge this no-refund policy.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Completed Work is Non-Refundable</h3>
            <p className="text-zinc-300 mb-4">
              Any work that has been completed, delivered, or made available to you—including design files, source code, documentation, or any other deliverables—is immediately considered "delivered" and is 100% non-refundable. Even if you do not download, use, or are unsatisfied with the work, delivered work cannot be refunded.
            </p>
            <p className="text-zinc-300 mb-4">
              You retain ownership and full rights to use all delivered work regardless of refund status.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.4 Pause Instead of Cancel</h3>
            <p className="text-zinc-300 mb-4">
              <strong className="text-white">We strongly encourage pausing your subscription instead of canceling.</strong> Pausing allows you to temporarily suspend billing while retaining your account, work history, and the ability to resume service at any time. There is no limit to how long you can pause.
            </p>
            <p className="text-zinc-300">
              To pause your subscription, contact us at christophercarter@hey.com. Pausing takes effect at the end of your current billing cycle.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.5 Termination by Design Dream</h3>
            <p className="text-zinc-300">
              We reserve the right to terminate your subscription immediately and without refund if you:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mt-2 space-y-1">
              <li>Violate these Terms & Conditions</li>
              <li>Use the service for illegal, unethical, or harmful purposes</li>
              <li>Engage in abusive, threatening, or harassing behavior</li>
              <li>Attempt to resell or white-label our services without authorization</li>
              <li>Initiate a chargeback or payment dispute in bad faith</li>
            </ul>
          </section>

          {/* Pause Subscription */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Pause Subscription</h2>
            <p className="text-zinc-300 mb-4">
              You may pause your subscription at any time. While paused:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>You will not be charged for billing cycles</li>
              <li>You cannot submit new requests or receive new work</li>
              <li>You retain access to all previously completed work and files</li>
              <li>Your Linear workspace and communication history remain accessible</li>
            </ul>
            <p className="text-zinc-300 mb-4">
              To resume your subscription, simply contact us or reactivate through your billing portal. Billing will resume immediately, and you can begin submitting new requests.
            </p>
            <p className="text-zinc-300">
              There is no fee to pause or resume your subscription, and you may do so as many times as needed.
            </p>
          </section>

          {/* Scope and Limitations */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Scope and Limitations</h2>

            <h3 className="text-xl font-semibold text-white mb-3">6.1 Turnaround Time</h3>
            <p className="text-zinc-300 mb-4">
              We target a 48-hour turnaround time for most tasks. This is an average target, not a guaranteed delivery time. Actual turnaround depends on:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Complexity and scope of the task</li>
              <li>Clarity and completeness of requirements</li>
              <li>Availability of necessary assets or information from you</li>
              <li>Current workload and queue position</li>
            </ul>
            <p className="text-zinc-300 mb-4">
              Complex projects may be broken into multiple sequential tasks. We will communicate expected timelines for larger projects.
            </p>
            <p className="text-zinc-300">
              <strong className="text-white">No Guaranteed Timelines:</strong> We do not guarantee specific delivery dates or timelines. The 48-hour target is an estimate only and does not create any enforceable obligation.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.2 Unlimited Revisions</h3>
            <p className="text-zinc-300 mb-4">
              Each task includes unlimited revisions until you are satisfied with the result. Revisions must be requested through Linear by providing clear feedback and specific changes needed.
            </p>
            <p className="text-zinc-300">
              Major scope changes or entirely new directions may be treated as separate tasks.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.3 Excluded Services</h3>
            <p className="text-zinc-300 mb-4">
              The following services are NOT included in your subscription:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>3D modeling, animation, or video production/editing</li>
              <li>Physical product design, packaging design, or print production</li>
              <li>Content writing, copywriting, SEO services, or marketing strategy</li>
              <li>Server administration, DevOps, or infrastructure management</li>
              <li>Ongoing maintenance, monitoring, or hosting services</li>
              <li>Third-party services, licenses, or subscriptions (fonts, stock images, APIs, etc.)</li>
              <li>Work for illegal, harmful, unethical, or adult content purposes</li>
              <li>White-label services or resale to your clients</li>
            </ul>
          </section>

          {/* Deliverables and Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Deliverables and Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-white mb-3">7.1 Ownership of Work Product</h3>
            <p className="text-zinc-300 mb-4">
              Upon full payment of the subscription fees for the billing cycle in which work was completed, you own all rights, title, and interest in the final work product created specifically for you, including:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Design files (Figma, Sketch, Adobe files, etc.)</li>
              <li>Source code and repositories</li>
              <li>Documentation and specifications</li>
              <li>Final deliverable assets</li>
            </ul>
            <p className="text-zinc-300">
              We retain no ownership rights or claims to your completed work once paid for.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.2 Delivery Method</h3>
            <p className="text-zinc-300 mb-4">
              Deliverables are provided through:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li><strong>Design Files:</strong> Shared via Figma links or file transfer</li>
              <li><strong>Code:</strong> Delivered via GitHub repository access or zip files</li>
              <li><strong>Assets:</strong> Provided through Linear attachments or file sharing services</li>
            </ul>
            <p className="text-zinc-300">
              You are responsible for downloading and backing up all deliverables. We are not responsible for lost or deleted files after delivery.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.3 Third-Party Components</h3>
            <p className="text-zinc-300 mb-4">
              Work may incorporate third-party libraries, frameworks, fonts, icons, and tools (e.g., React, Next.js, Tailwind CSS, Font Awesome) that are subject to their own licenses. You receive the right to use these components in accordance with their respective licenses (typically open-source licenses like MIT, Apache 2.0, etc.).
            </p>
            <p className="text-zinc-300">
              <strong className="text-white">You are responsible for:</strong> Purchasing any commercial licenses for premium fonts, stock assets, APIs, or services required for your project. We do not provide or include paid third-party licenses unless explicitly agreed upon.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.4 Portfolio and Marketing Rights</h3>
            <p className="text-zinc-300 mb-4">
              We reserve the right to display completed work in our portfolio, case studies, marketing materials, and social media for promotional purposes. This includes screenshots, descriptions, and attributions.
            </p>
            <p className="text-zinc-300">
              If you require confidentiality and do not want your project displayed publicly, you must notify us in writing at the start of the project. We will honor reasonable confidentiality requests.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.5 Your Content and Materials</h3>
            <p className="text-zinc-300 mb-4">
              You retain full ownership of all content, assets, materials, and information you provide to us (text, images, logos, data, etc.). By providing these materials, you grant us a limited, non-exclusive license to use them solely for the purpose of delivering the service.
            </p>
            <p className="text-zinc-300">
              You warrant that you own or have the legal right to use all materials provided to us and that using them will not infringe on any third-party rights.
            </p>
          </section>

          {/* Acceptable Use */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Acceptable Use Policy</h2>
            <p className="text-zinc-300 mb-4">
              You agree to use Design Dream's services in compliance with all applicable laws and regulations. You may not use our services for:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Illegal, fraudulent, or deceptive activities</li>
              <li>Hate speech, harassment, discrimination, or promotion of violence</li>
              <li>Adult content, pornography, or sexually explicit material</li>
              <li>Gambling, cryptocurrency schemes, or "get rich quick" scams</li>
              <li>Phishing, malware, spyware, or other malicious software</li>
              <li>Spam, unsolicited marketing, or pyramid schemes</li>
              <li>Infringement of intellectual property or violation of third-party rights</li>
              <li>Any purpose we deem harmful, unethical, or contrary to our values</li>
            </ul>
            <p className="text-zinc-300">
              <strong className="text-white">We reserve the right to refuse any project</strong> at our sole discretion. If we determine a project violates this policy, we will terminate the project and potentially your subscription without refund.
            </p>
          </section>

          {/* Warranties and Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Warranties and Disclaimers</h2>

            <h3 className="text-xl font-semibold text-white mb-3">9.1 Service Provided "As-Is"</h3>
            <p className="text-zinc-300 mb-4">
              DESIGN DREAM'S SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="text-zinc-300">
              While we strive to deliver high-quality work that meets professional standards, we do not warrant that:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mt-2 space-y-1">
              <li>The service will be uninterrupted, timely, secure, or error-free</li>
              <li>The deliverables will meet all of your requirements or expectations</li>
              <li>Any errors in deliverables will be corrected within a specific timeframe</li>
              <li>The service will be compatible with all third-party systems or platforms</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">9.2 No Guarantee of Results</h3>
            <p className="text-zinc-300 mb-4">
              We do not guarantee specific business outcomes, results, or performance metrics from using our deliverables, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Increased revenue, sales, or profits</li>
              <li>Improved conversion rates or user engagement</li>
              <li>Higher search engine rankings or web traffic</li>
              <li>Successful fundraising or business growth</li>
            </ul>
            <p className="text-zinc-300">
              Success depends on numerous factors outside our control, including your implementation, market conditions, competition, and business strategy.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">9.3 Third-Party Services</h3>
            <p className="text-zinc-300">
              We are not responsible for the functionality, availability, or performance of third-party services, platforms, or APIs integrated into your deliverables (e.g., Stripe, Supabase, Vercel, AWS, APIs). Issues with third-party services are beyond our control and not covered under your subscription.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-zinc-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY TEXAS LAW, DESIGN DREAM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data, files, or work product</li>
              <li>Business interruption or downtime</li>
              <li>Loss of goodwill or reputation</li>
              <li>Cost of substitute services or procurement</li>
              <li>Any other intangible losses</li>
            </ul>
            <p className="text-zinc-300 mb-4">
              THIS LIMITATION APPLIES EVEN IF DESIGN DREAM HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND REGARDLESS OF THE LEGAL THEORY (CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE).
            </p>
            <p className="text-zinc-300">
              <strong className="text-white">Total Liability Cap:</strong> In no event shall Design Dream's total aggregate liability to you for all claims arising from or related to the service exceed the total amount of fees you paid to Design Dream in the three (3) months immediately preceding the event giving rise to liability.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
            <p className="text-zinc-300 mb-4">
              You agree to indemnify, defend, and hold harmless Design Dream, Christopher Carter, and our affiliates, contractors, and licensors from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>Your use of the service or deliverables</li>
              <li>Your violation of these Terms & Conditions</li>
              <li>Your infringement of any third-party intellectual property or other rights</li>
              <li>Content, materials, or information you provide to us</li>
              <li>Your violation of any applicable laws or regulations</li>
            </ul>
            <p className="text-zinc-300">
              This indemnification obligation survives termination of these Terms and your subscription.
            </p>
          </section>

          {/* Confidentiality */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Confidentiality</h2>
            <p className="text-zinc-300 mb-4">
              We treat all client information, project details, business data, and proprietary information as confidential. We will not disclose your confidential information to third parties without your consent, except:
            </p>
            <ul className="list-disc pl-6 text-zinc-300 mb-4 space-y-1">
              <li>As required to perform the service (e.g., sharing with necessary contractors)</li>
              <li>As required by law, court order, or government regulation</li>
              <li>To protect our legal rights or defend against claims</li>
            </ul>
            <p className="text-zinc-300">
              You agree to keep confidential any proprietary methods, processes, or business information shared by Design Dream during the provision of services.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">13. Dispute Resolution and Governing Law</h2>

            <h3 className="text-xl font-semibold text-white mb-3">13.1 Governing Law</h3>
            <p className="text-zinc-300 mb-4">
              These Terms & Conditions are governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law principles. The Texas Business & Commerce Code shall apply to all subscription and payment terms.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">13.2 Jurisdiction and Venue</h3>
            <p className="text-zinc-300 mb-4">
              Any legal action, suit, or proceeding arising out of or relating to these Terms or the service shall be brought exclusively in the state or federal courts located in Travis County, Texas. You irrevocably consent to the jurisdiction and venue of such courts and waive any objection to the convenience of such forum.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">13.3 Informal Resolution</h3>
            <p className="text-zinc-300 mb-4">
              Before initiating any legal proceeding, the parties agree to attempt to resolve any dispute informally by contacting us at christophercarter@hey.com. We will work in good faith to resolve disputes amicably.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">13.4 Binding Arbitration</h3>
            <p className="text-zinc-300 mb-4">
              If informal resolution fails, any dispute shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. Arbitration shall take place in Travis County, Texas, or remotely via video conference.
            </p>
            <p className="text-zinc-300 mb-4">
              The arbitrator's decision shall be final and binding, and judgment may be entered in any court of competent jurisdiction. Each party shall bear its own costs and fees, unless otherwise awarded by the arbitrator.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">13.5 Class Action Waiver</h3>
            <p className="text-zinc-300">
              YOU AGREE THAT ANY DISPUTE SHALL BE RESOLVED ON AN INDIVIDUAL BASIS ONLY AND NOT AS A CLASS ACTION, CONSOLIDATED ACTION, OR REPRESENTATIVE ACTION. YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.
            </p>
          </section>

          {/* Modifications to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">14. Modifications to Terms</h2>
            <p className="text-zinc-300 mb-4">
              We reserve the right to modify these Terms & Conditions at any time. We will notify active subscribers of material changes via email at least 30 days before the changes take effect.
            </p>
            <p className="text-zinc-300 mb-4">
              The updated Terms will be posted on our website with a revised "Last updated" date. Your continued use of the service after the effective date of changes constitutes acceptance of the modified Terms.
            </p>
            <p className="text-zinc-300">
              If you do not agree to the modified Terms, you may cancel your subscription before the changes take effect. Cancellations made in response to Terms changes will follow the standard cancellation policy (no refund for current billing cycle).
            </p>
          </section>

          {/* General Provisions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">15. General Provisions</h2>

            <h3 className="text-xl font-semibold text-white mb-3">15.1 Entire Agreement</h3>
            <p className="text-zinc-300 mb-4">
              These Terms & Conditions, together with our Privacy Policy, constitute the entire agreement between you and Design Dream regarding the service and supersede all prior agreements, understandings, or representations.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">15.2 Severability</h3>
            <p className="text-zinc-300 mb-4">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">15.3 Waiver</h3>
            <p className="text-zinc-300 mb-4">
              Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver must be in writing and signed by an authorized representative of Design Dream.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">15.4 Assignment</h3>
            <p className="text-zinc-300 mb-4">
              You may not assign, transfer, or delegate these Terms or your subscription without our prior written consent. We may assign or transfer these Terms and our obligations at any time without restriction.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">15.5 Force Majeure</h3>
            <p className="text-zinc-300 mb-4">
              Design Dream shall not be liable for any delay or failure to perform due to circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, labor disputes, or internet/telecommunications failures.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">15.6 Survival</h3>
            <p className="text-zinc-300">
              Sections relating to intellectual property, confidentiality, warranties, limitation of liability, indemnification, dispute resolution, and general provisions shall survive termination of these Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">16. Contact Information</h2>
            <p className="text-zinc-300 mb-4">
              If you have questions, concerns, or requests regarding these Terms & Conditions, please contact us:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <p className="text-zinc-300">
                <strong className="text-white">Design Dream</strong><br />
                Christopher Carter, Sole Proprietor<br />
                Email: <a href="mailto:christophercarter@hey.com" className="text-violet-400 hover:text-violet-300 underline">christophercarter@hey.com</a><br />
                Website: <a href="https://designdream.is" className="text-violet-400 hover:text-violet-300 underline">designdream.is</a><br />
                Legal Inquiries: <a href="mailto:legal@designdream.is" className="text-violet-400 hover:text-violet-300 underline">legal@designdream.is</a>
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <div className="mt-12 p-6 bg-violet-950/30 border border-violet-800/50 rounded-lg">
            <h3 className="font-bold text-white mb-3">Acknowledgment and Acceptance</h3>
            <p className="text-zinc-300 mb-3">
              BY SUBSCRIBING TO DESIGN DREAM, CLICKING "I AGREE," OR USING THE SERVICE, YOU ACKNOWLEDGE THAT:
            </p>
            <ul className="text-zinc-300 space-y-2 list-disc pl-6">
              <li>You have read and understood these Terms & Conditions in their entirety</li>
              <li>You agree to be legally bound by these Terms</li>
              <li>You understand the refund policy and its limitations</li>
              <li>You understand that payment is charged upfront for each 31-day billing cycle</li>
              <li>You are authorized to enter into this agreement</li>
              <li>You are at least 18 years of age</li>
            </ul>
          </div>
        </main>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">
              Privacy Policy
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
