import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Layers,
  Smartphone,
  Palette,
  Sparkles,
  Clock,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                Built by a VP who's shipped at Microsoft, JPMorgan Chase, and Home Depot
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Always-On Design & Development Partner
            </h1>

            <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
              Ship websites, mobile apps, and AI-powered features—one task at a time, delivered in 48 hours.
            </p>

            <p className="mb-10 text-lg text-gray-500">
              No agencies. No freelancer chaos. Just one expert partner who handles design, development, and everything in between.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/subscribe">
                  Start Your Subscription
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-b border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-sm font-medium text-gray-500">
            Trusted by startups, agencies, and growth teams at:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="rounded-lg bg-white px-6 py-3 font-semibold">SaaS</div>
            <div className="rounded-lg bg-white px-6 py-3 font-semibold">E-Commerce</div>
            <div className="rounded-lg bg-white px-6 py-3 font-semibold">Fintech</div>
            <div className="rounded-lg bg-white px-6 py-3 font-semibold">AI</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Design Dream Exists
            </h2>
            <p className="mb-12 text-xl font-semibold text-gray-900">
              Building a product is hard enough. Managing vendors shouldn't make it harder.
            </p>

            <div className="mb-12 grid gap-6 text-left sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-gray-700">A freelance designer who disappears for weeks</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-gray-700">An agency charging $20k/month with endless meetings</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-gray-700">An overbooked dev team with a 3-month backlog</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-gray-700">Launch dates slipping because handoffs keep failing</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-2xl font-bold text-gray-900">There's a better way.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-blue-600 py-20 text-white sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              One Subscription. Unlimited Requests. Consistent Quality.
            </h2>
            <p className="mb-12 text-xl text-blue-100">
              Design Dream is your embedded design + dev partner.
            </p>

            <div className="mb-12 grid gap-6 text-left sm:grid-cols-2">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 text-white">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0" />
                    <p><strong>Unlimited design requests</strong> (UI/UX, branding, mobile app screens)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 text-white">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0" />
                    <p><strong>Unlimited development</strong> (websites, web apps, mobile apps, features)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 text-white">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0" />
                    <p><strong>AI-powered features</strong> (ChatGPT-style integrations, automations)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 text-white">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0" />
                    <p><strong>One task at a time, delivered in 48 hours</strong></p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 sm:col-span-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-center gap-3 text-white">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0" />
                    <p><strong>Pause or cancel anytime</strong> (no contracts, no hard feelings)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-xl font-semibold">
              No vendor juggling. No handoff delays. Just fast, high-quality work.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mb-12 text-lg text-gray-600">Simple 5-Step Process</p>

            <div className="grid gap-8">
              {[
                {
                  number: '1',
                  title: 'Subscribe',
                  description: 'Choose your plan and start immediately. No onboarding meetings, no sales calls.',
                  icon: Zap
                },
                {
                  number: '2',
                  title: 'Add Requests to Your Queue',
                  description: 'Use Basecamp to submit unlimited design and development requests. Prioritize what matters most.',
                  icon: Layers
                },
                {
                  number: '3',
                  title: 'I Work on One Task at a Time',
                  description: 'Full focus = better quality and faster delivery. No context switching, no multitasking.',
                  icon: Clock
                },
                {
                  number: '4',
                  title: 'Get Daily Updates',
                  description: 'Know exactly where things stand. Transparency builds trust.',
                  icon: MessageSquare
                },
                {
                  number: '5',
                  title: 'Review, Approve, Repeat',
                  description: 'Love it? Move to the next task. Need tweaks? Two rounds of revisions included per task.',
                  icon: RefreshCw
                }
              ].map((step) => (
                <Card key={step.number} className="text-left">
                  <CardContent className="flex gap-6 pt-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-gray-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What You Get
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Palette className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>Product Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> UI/UX for web and mobile apps</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> User flows and wireframes</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> Interactive prototypes (Figma, Framer)</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> Design systems and component libraries</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> Responsive layouts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Layers className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle>Web Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> Landing pages and marketing sites</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> Web applications (SaaS, dashboards)</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> E-commerce sites</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> CMS integration</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> Frontend + backend (Next.js, React, Node.js)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle>Mobile App Design & Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> iOS and Android app design (Figma)</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> React Native development</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> App prototypes and user testing</li>
                    <li className="flex gap-2 text-gray-500"><span className="text-xs">Note: Native iOS/Android quoted separately</span></li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                  </div>
                  <CardTitle>AI & Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> ChatGPT-style chat integrations</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> AI-powered search and recommendations</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> Workflow automation</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" /> Custom AI features for your product</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pricing
            </h2>
            <p className="mb-12 text-lg text-gray-600">One Simple Plan</p>

            <Card className="border-2 border-blue-600">
              <CardHeader className="space-y-4 pb-8">
                <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  Limited Time
                </div>
                <div>
                  <div className="mb-2 text-5xl font-bold text-gray-900">$4,495</div>
                  <div className="text-gray-600">/month</div>
                </div>
                <p className="text-sm text-amber-600 font-semibold">
                  First 10 clients lock in $4,495/month forever<br />
                  (Price increases to $5,995/month after first 10)
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                <div className="space-y-3 text-left">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span>Unlimited design requests</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span>Unlimited development requests</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span>One task active at a time (ensures quality + speed)</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span>48-hour turnaround per task</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span>Two rounds of revisions per task</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span>Daily progress updates via Basecamp</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span>Pause or cancel anytime</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full text-lg">
                  <Link href="/subscribe">
                    Lock In Launch Pricing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="text-sm text-gray-500 pt-4">
                  Perfect for startups, marketing teams, agencies, and product teams with backlogs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Stop Juggling Vendors. Start Shipping.
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Unlimited design. Unlimited development. One expert partner.
          </p>
          <p className="mb-10 text-lg text-blue-100">
            Pause or cancel anytime. No contracts. No risk.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link href="/subscribe">
              Start Your Subscription
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-6 text-gray-600">
              Still have questions? Email me:{' '}
              <a href="mailto:hello@designdream.is" className="text-blue-600 hover:underline">
                hello@designdream.is
              </a>
            </p>
            <div className="mb-6 flex justify-center gap-6 text-sm text-gray-600">
              <Link href="/legal/terms" className="hover:text-gray-900">Terms of Service</Link>
              <Link href="/legal/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link href="/legal/refund" className="hover:text-gray-900">Refund Policy</Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Design Dream. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
