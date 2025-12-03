'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { FadeIn, FadeInStagger, ScaleIn } from '@/components/animations/fade-in';
import { usePlausible } from '@/hooks/use-plausible';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import LandingHeroVideo from '@/components/LandingHeroVideo';
import { ScheduleCTA } from '@/components/landing/ScheduleCTA';

export default function Home() {
  const { trackEvent } = usePlausible();

  // Track scroll depth milestones
  useScrollTracking();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Content */}
              <div className="text-center lg:text-left">
                <FadeIn delay={0.1} direction="down">
                  <div className="mb-8">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                      Built by a full-stack developer & designer who's shipped at Microsoft, JPMorgan Chase, and Home Depot
                    </span>
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    Your Always-On Design & Development Partner
                  </h1>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
                    Ship websites, mobile apps, and AI-powered features—one task at a time, delivered in 48 hours.
                  </p>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <p className="mb-10 text-lg text-gray-500">
                    No agencies. No freelancer chaos. Just one expert partner who handles design, development, and everything in between.
                  </p>
                </FadeIn>

                <FadeIn delay={0.5}>
                  <div className="flex flex-col gap-4 sm:flex-row lg:justify-start justify-center">
                    <Button asChild size="lg" className="text-lg">
                      <Link
                        href="/subscribe"
                        onClick={() => trackEvent('Hero CTA Click', { props: { location: 'hero' } })}
                      >
                        Start Your Subscription
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <ScheduleCTA
                      variant="outline"
                      size="lg"
                      source="hero"
                      className="text-lg"
                    >
                      Book a 15-minute intro
                    </ScheduleCTA>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Video */}
              <div className="order-first lg:order-last">
                <FadeIn delay={0.6} direction="right">
                  <LandingHeroVideo
                    videoUrl="/videos/hero-video.mp4"
                    posterImage="/videos/hero-poster.jpg"
                    autoPlay={false}
                    showControls={true}
                  />
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-b border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.2}>
            <p className="mb-6 text-center text-sm font-medium text-gray-500">
              Trusted by startups, agencies, and growth teams at:
            </p>
          </FadeIn>
          <FadeInStagger staggerDelay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
              <div className="rounded-lg bg-white px-6 py-3 font-semibold">SaaS</div>
              <div className="rounded-lg bg-white px-6 py-3 font-semibold">E-Commerce</div>
              <div className="rounded-lg bg-white px-6 py-3 font-semibold">Fintech</div>
              <div className="rounded-lg bg-white px-6 py-3 font-semibold">AI</div>
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why Design Dream Exists
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-12 text-xl font-semibold text-gray-900">
                Building a product is hard enough. Managing vendors shouldn't make it harder.
              </p>
            </FadeIn>

            <FadeInStagger staggerDelay={0.15} className="mb-12 grid gap-6 text-left sm:grid-cols-2">
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
            </FadeInStagger>

            <FadeIn delay={0.3}>
              <p className="text-2xl font-bold text-gray-900">There's a better way.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-blue-600 py-20 text-white sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                One Subscription. Unlimited Requests. Consistent Quality.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-12 text-xl text-blue-100">
                Design Dream is your embedded design + dev partner.
              </p>
            </FadeIn>

            <FadeInStagger staggerDelay={0.12} className="mb-12 grid gap-6 text-left sm:grid-cols-2">
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
            </FadeInStagger>

            <FadeIn delay={0.3}>
              <p className="text-xl font-semibold">
                No meetings. No standups. No status updates. Just async work in Linear.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How It Works
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-12 text-lg text-gray-600">Simple 5-Step Process</p>
            </FadeIn>

            <FadeInStagger staggerDelay={0.15} className="grid gap-8">
              {[
                {
                  number: '1',
                  title: 'Subscribe',
                  description: 'Choose your plan and get instant access to Linear. No onboarding meetings, no sales calls, no standups.',
                  icon: Zap
                },
                {
                  number: '2',
                  title: 'Create Issues in Linear',
                  description: 'Describe what you need (design, development, or both). Add unlimited tasks to your backlog.',
                  icon: Layers
                },
                {
                  number: '3',
                  title: 'Move One Issue to "In Progress"',
                  description: 'Drag one task to In Progress when you\'re ready. I\'ll start working on it immediately.',
                  icon: Clock
                },
                {
                  number: '4',
                  title: 'I Work on It',
                  description: 'Full focus on your task. No meetings, no status updates, no interruptions. Just heads-down work.',
                  icon: MessageSquare
                },
                {
                  number: '5',
                  title: 'Review & Move to "Done"',
                  description: 'Review the work (in code or design). Love it? Move to Done. Need changes? Add a comment and I\'ll iterate.',
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
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-gray-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <FadeIn>
              <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                What You Get
              </h2>
            </FadeIn>

            <FadeInStagger staggerDelay={0.15} className="grid gap-8 md:grid-cols-2">
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
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Pricing
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-12 text-lg text-gray-600">One Simple Plan</p>
            </FadeIn>

            <ScaleIn delay={0.2} duration={0.4}>
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
                    <span>Managed via Linear issues (no meetings)</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <span>Pause or cancel anytime</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full text-lg">
                  <Link
                    href="/subscribe"
                    onClick={() => trackEvent('Pricing CTA Click', { props: { location: 'pricing' } })}
                  >
                    Lock In Launch Pricing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">or</p>
                  <ScheduleCTA
                    variant="ghost"
                    size="default"
                    source="pricing"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Talk to us first
                  </ScheduleCTA>
                </div>

                <p className="text-sm text-gray-500 pt-4">
                  Perfect for startups, marketing teams, agencies, and product teams with backlogs.
                </p>
              </CardContent>
            </Card>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* About Chris Carter */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                Built by Someone Who's Been in Your Shoes
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Design Dream was created by Chris Carter, a full-stack developer and designer who got tired of watching great ideas die in backlogs.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <FadeIn delay={0.2} direction="left">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/chris-carter.jpg"
                  alt="Chris Carter, Founder of Design Dream"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority={false}
                  quality={90}
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.3} direction="right">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    15+ Years Building Products at Scale
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    I've spent my career at companies like <span className="font-semibold text-gray-900">Microsoft</span>, <span className="font-semibold text-gray-900">JPMorgan Chase</span>, <span className="font-semibold text-gray-900">Home Depot</span>, and <span className="font-semibold text-gray-900">Indeed</span>, building products used by millions.
                  </p>
                </div>

                <div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    But I kept seeing the same problem: <span className="italic">great ideas stuck in limbo</span> because teams couldn't find reliable design and development partners who understood their urgency.
                  </p>
                </div>

                <div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    So I built Design Dream to be the partner I always wished I had—someone who could take an idea from concept to shipped product without the typical agency overhead, miscommunication, or delays.
                  </p>
                </div>

                <div className="pt-4">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <p className="text-base text-gray-700 leading-relaxed">
                      <span className="font-semibold text-gray-900">"I'm not running an agency.</span> I'm your embedded design and development partner. I work directly on your projects, understand your business context, and treat your deadlines like they're my own."
                    </p>
                    <p className="text-sm text-gray-600 mt-3 font-medium">
                      — Chris Carter, Founder
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Full-Stack Developer
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Product Designer
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know about how Design Dream works
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <Accordion
                type="single"
                collapsible
                className="space-y-4"
                onValueChange={(value) => {
                  if (value) {
                    trackEvent('FAQ Item Opened', { props: { question: value } });
                  }
                }}
              >
                <AccordionItem value="item-1" className="bg-white rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    How does the monthly subscription work?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    For $4,495/month, you get unlimited design and development requests. You can add as many requests to your queue as you need, and I'll work through them one at a time. Each task is delivered within 48 business hours (Mon-Fri, 9am-5pm Central). Once a task is complete, I immediately start the next one in your queue.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    What's the typical turnaround time for requests?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Most requests are delivered within 48 business hours. Simple tasks (bug fixes, minor UI tweaks) can be done in 24 hours or less. More complex features might take 2-3 business days. Track progress directly in Linear—no meetings, no standups, no status calls.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    Can I pause or cancel my subscription?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Absolutely. You can pause your subscription at any time and resume when you're ready. There are no contracts or cancellation fees. If you pause, you won't be charged for the time you're not using the service. Many clients pause during holidays or slow periods and reactivate when they have a new backlog.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    What if I don't like the work or need revisions?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Each request includes two rounds of revisions at no additional cost. If you need changes, just let me know what to adjust, and I'll make it right. My goal is your complete satisfaction. If something's not working, we'll iterate until it does.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-white rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    What types of requests can I submit?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Almost anything related to web design and development: landing pages, web apps, mobile apps (React Native), UI/UX design, frontend development, backend APIs, bug fixes, feature additions, refactoring, performance optimization, responsive design, accessibility improvements, and more. If it can be built with modern web technologies, I can help.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-white rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    What if I have multiple projects or brands?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    No problem! You can submit requests for multiple projects, websites, or brands. Just specify which project each request is for in Linear with labels or in the issue description. I'll work through your queue in priority order, regardless of which project each task belongs to.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-white rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    How do we communicate and manage requests?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Everything happens in Linear. When you subscribe, you'll get access to your dedicated Linear workspace where you create issues for each request. Simply move one issue to "In Progress" when ready, and I'll start working. Review the work in Linear and move it to "Done" when approved. No meetings. No status updates. No standups. Just async work.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="bg-white rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                    Are there any setup fees or long-term contracts?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Nope. No setup fees, no onboarding costs, no long-term commitments. Just a simple monthly subscription that you can pause or cancel anytime. You're billed monthly, and you can adjust your plan whenever your needs change.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">
                  Still have questions?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ScheduleCTA
                    variant="default"
                    size="lg"
                    source="faq"
                  >
                    Schedule a call
                  </ScheduleCTA>
                  <Button asChild variant="outline" size="lg">
                    <a href="mailto:hello@designdream.is">
                      Email us
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Stop Juggling Vendors. Start Shipping.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mb-8 text-xl text-blue-100">
              Unlimited design. Unlimited development. One expert partner.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mb-10 text-lg text-blue-100">
              Pause or cancel anytime. No contracts. No risk.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link
                  href="/subscribe"
                  onClick={() => trackEvent('Final CTA Click', { props: { location: 'final-cta' } })}
                >
                  Start Your Subscription
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <ScheduleCTA
                variant="outline"
                size="lg"
                source="footer"
                className="text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Have questions? Let's talk
              </ScheduleCTA>
            </div>
          </FadeIn>
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
              <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link href="/refund-policy" className="hover:text-gray-900">Refund Policy</Link>
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
