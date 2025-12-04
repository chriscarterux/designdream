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
import { ScheduleCTA } from '@/components/landing/ScheduleCTA';
import { Header } from '@/components/landing/Header';
import { LogoTicker } from '@/components/landing/LogoTicker';

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
    <div>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-32 sm:py-40 lg:py-48">
          {/* Radial gradient glow effect */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn delay={0.1} direction="down">
                <div className="mb-8">
                  <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
                    Built by a full-stack developer & designer who's shipped at Microsoft, JPMorgan Chase, and Home Depot
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="mb-6 text-5xl font-normal tracking-tight sm:text-6xl lg:text-7xl">
                  Your Always-On Design & Development Partner
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="mb-8 text-xl text-muted-foreground sm:text-2xl font-light max-w-3xl mx-auto">
                  Ship websites, mobile apps, and AI-powered features—one task at a time, delivered in 48 hours.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <p className="mb-12 text-lg text-muted-foreground/80 max-w-2xl mx-auto">
                  No agencies. No freelancer chaos. Just one expert partner who handles design, development, and everything in between.
                </p>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg" className="text-lg rounded-full px-8">
                    <Link
                      href="/subscribe"
                      onClick={() => trackEvent('Hero CTA Click', { props: { location: 'hero' } })}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <ScheduleCTA
                    variant="outline"
                    size="lg"
                    source="hero"
                    className="text-lg rounded-full px-8 border-primary/50 text-primary hover:bg-primary/10"
                  >
                    Book a 15-minute intro
                  </ScheduleCTA>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

      {/* Social Proof Bar */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <FadeIn delay={0.2}>
              <p className="mb-12 text-sm font-medium text-muted-foreground">
                Delivered projects for companies including:
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <LogoTicker />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-4xl font-normal tracking-tight sm:text-5xl">
                Why Design Dream Exists
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-16 text-xl font-light text-muted-foreground max-w-3xl mx-auto">
                Building a product is hard enough. Managing vendors shouldn't make it harder.
              </p>
            </FadeIn>

            <FadeInStagger staggerDelay={0.15} className="mb-16 grid gap-6 text-left sm:grid-cols-2">
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500/80" />
                    <p className="text-muted-foreground">A freelance designer who disappears for weeks</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500/80" />
                    <p className="text-muted-foreground">An agency charging $20k/month with endless meetings</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500/80" />
                    <p className="text-muted-foreground">An overbooked dev team with a 3-month backlog</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-red-500/80" />
                    <p className="text-muted-foreground">Launch dates slipping because handoffs keep failing</p>
                  </div>
                </CardContent>
              </Card>
            </FadeInStagger>

            <FadeIn delay={0.3}>
              <p className="text-2xl font-normal text-foreground">There's a better way.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-4xl font-normal tracking-tight sm:text-5xl">
                One Subscription. Unlimited Requests. Consistent Quality.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-16 text-xl font-light text-muted-foreground">
                Design Dream is your embedded design + dev partner.
              </p>
            </FadeIn>

            <FadeInStagger staggerDelay={0.12} className="mb-16 grid gap-6 text-left sm:grid-cols-2">
              <Card className="border-border bg-card hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-foreground"><strong>Unlimited design requests</strong> (UI/UX, branding, mobile app screens)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-foreground"><strong>Unlimited development</strong> (websites, web apps, mobile apps, features)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-foreground"><strong>AI-powered features</strong> (ChatGPT-style integrations, automations)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-foreground"><strong>One task at a time, delivered in 48 hours</strong></p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:border-primary/50 transition-colors sm:col-span-2">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-4">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-foreground"><strong>Pause or cancel anytime</strong> (no contracts, no hard feelings)</p>
                  </div>
                </CardContent>
              </Card>
            </FadeInStagger>

            <FadeIn delay={0.3}>
              <p className="text-xl font-light text-foreground">
                No meetings. No standups. Just async work in Linear.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-4xl font-normal tracking-tight sm:text-5xl">
                How It Works
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-16 text-lg font-light text-muted-foreground">Simple 5-Step Process</p>
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
                <Card key={step.number} className="border-border bg-card text-left hover:border-primary/30 transition-colors">
                  <CardContent className="flex gap-6 pt-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-normal text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <FadeIn>
              <h2 className="mb-16 text-center text-4xl font-normal tracking-tight sm:text-5xl">
                What You Get
              </h2>
            </FadeIn>

            <FadeInStagger staggerDelay={0.15} className="grid gap-8 md:grid-cols-2">
              <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Product Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> UI/UX for web and mobile apps</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> User flows and wireframes</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> Interactive prototypes (Figma, Framer)</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> Design systems and component libraries</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> Responsive layouts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Web Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> Landing pages and marketing sites</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> Web applications (SaaS, dashboards)</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> E-commerce sites</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> CMS integration</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> Frontend + backend (Next.js, React, Node.js)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Mobile App Design & Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> iOS and Android app design (Figma)</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> React Native development</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> App prototypes and user testing</li>
                    <li className="flex gap-2 text-muted-foreground/60"><span className="text-xs">Note: Native iOS/Android quoted separately</span></li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">AI & Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> ChatGPT-style chat integrations</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> AI-powered search and recommendations</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> Workflow automation</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /> Custom AI features for your product</li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-20 lg:py-32">
        {/* Radial gradient glow effect */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="mb-6 text-4xl font-normal tracking-tight sm:text-5xl">
                Pricing
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mb-16 text-lg font-light text-muted-foreground">One Simple Plan</p>
            </FadeIn>

            <ScaleIn delay={0.2} duration={0.4}>
              <Card className="border-2 border-primary/50 bg-card shadow-lg shadow-primary/5">
              <CardHeader className="space-y-4 pb-8">
                <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-semibold text-primary">
                  Limited Availability
                </div>
                <div>
                  <div className="mb-2 text-5xl font-bold text-foreground">$4,495</div>
                  <div className="text-muted-foreground">/month</div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Only a few spots available each month to ensure quality and focus.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                <div className="space-y-3 text-left">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground">Unlimited design requests</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground">Unlimited development requests</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground">One task active at a time (ensures quality + speed)</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground">48-hour turnaround per task</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground">Unlimited revisions (you control priority)</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground">Managed via Linear (no meetings)</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground">Pause or cancel anytime</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full text-lg">
                  <Link
                    href="/subscribe"
                    onClick={() => trackEvent('Pricing CTA Click', { props: { location: 'pricing' } })}
                  >
                    Start Shipping Your Dream
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">or</p>
                  <ScheduleCTA
                    variant="ghost"
                    size="default"
                    source="pricing"
                    className="text-primary hover:text-primary/80"
                  >
                    Talk to us first
                  </ScheduleCTA>
                </div>

                <p className="text-sm text-muted-foreground pt-4">
                  Perfect for startups, marketing teams, agencies, and product teams with backlogs.
                </p>
              </CardContent>
            </Card>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* About Chris Carter */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-normal sm:text-5xl mb-4">
                Built by Someone Who's Been in Your Shoes
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
                Design Dream was created by Chris Carter, a full-stack developer and designer who got tired of watching great ideas die in backlogs.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <FadeIn delay={0.2} direction="left">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-border shadow-xl">
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
                  <h3 className="text-2xl font-normal text-foreground mb-4">
                    15+ Years Building Products at Scale
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    I've spent my career at companies like <span className="font-semibold text-foreground">Microsoft</span>, <span className="font-semibold text-foreground">JPMorgan Chase</span>, <span className="font-semibold text-foreground">Home Depot</span>, and <span className="font-semibold text-foreground">Indeed</span>, building products used by millions.
                  </p>
                </div>

                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    But I kept seeing the same problem: <span className="italic text-foreground">great ideas stuck in limbo</span> because teams couldn't find reliable design and development partners who understood their urgency.
                  </p>
                </div>

                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    So I built Design Dream to be the partner I always wished I had—someone who could take an idea from concept to shipped product without the typical agency overhead, miscommunication, or delays.
                  </p>
                </div>

                <div className="pt-4">
                  <div className="bg-card rounded-lg p-6 border border-primary/20">
                    <p className="text-base text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">"I'm not running an agency.</span> I'm your embedded design and development partner. I work directly on your projects, understand your business context, and treat your deadlines like they're my own."
                    </p>
                    <p className="text-sm text-muted-foreground mt-3 font-medium">
                      — Chris Carter, Founder
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 border border-primary/20 text-primary">
                    Full-Stack Developer
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 border border-primary/20 text-primary">
                    Product Designer
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-normal sm:text-5xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
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
                <AccordionItem value="item-1" className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left text-lg font-normal text-foreground hover:text-primary">
                    How does the monthly subscription work?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    For $4,495/month, you get unlimited design and development requests. You can add as many requests to your queue as you need, and I'll work through them one at a time. Each task is delivered within 48 business hours (Mon-Fri, 9am-5pm Central). Once a task is complete, I immediately start the next one in your queue.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left text-lg font-normal text-foreground hover:text-primary">
                    What's the typical turnaround time for requests?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Most requests are delivered within 48 business hours. Simple tasks (bug fixes, minor UI tweaks) can be done in 24 hours or less. More complex features might take 2-3 business days. Track progress directly in Linear—no meetings, no standups, no status calls.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left text-lg font-normal text-foreground hover:text-primary">
                    Can I pause or cancel my subscription?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Absolutely. You can pause your subscription at any time and resume when you're ready. There are no contracts or cancellation fees. If you pause, you won't be charged for the time you're not using the service. Many clients pause during holidays or slow periods and reactivate when they have a new backlog.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left text-lg font-normal text-foreground hover:text-primary">
                    What if I don't like the work or need revisions?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Simply move the issue back to "In Progress" and I'll start working on it immediately—since you can only have one active issue at a time, it becomes the priority. Add a comment explaining what to change, and I'll make it happen. You control the board, so you decide what gets worked on. There's no limit on revisions—it's unlimited design and development, one issue at a time, until you're completely satisfied.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left text-lg font-normal text-foreground hover:text-primary">
                    What types of requests can I submit?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Almost anything related to web design and development: landing pages, web apps, mobile apps (React Native), UI/UX design, frontend development, backend APIs, bug fixes, feature additions, refactoring, performance optimization, responsive design, accessibility improvements, and more. If it can be built with modern web technologies, I can help.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left text-lg font-normal text-foreground hover:text-primary">
                    What if I have multiple projects or brands?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    No problem! You can submit requests for multiple projects, websites, or brands. Just specify which project each request is for in Linear with labels or in the issue description. I'll work through your queue in priority order, regardless of which project each task belongs to.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left text-lg font-normal text-foreground hover:text-primary">
                    How do we communicate and manage requests?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Everything happens in Linear. When you subscribe, you'll get access to your dedicated Linear workspace where you create issues for each request. Simply move one issue to "In Progress" when ready, and I'll start working. Review the work in Linear and move it to "Done" when approved. No meetings. No status updates. No standups. Just async work.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left text-lg font-normal text-foreground hover:text-primary">
                    Are there any setup fees or long-term contracts?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Nope. No setup fees, no onboarding costs, no long-term commitments. Just a simple monthly subscription that you can pause or cancel anytime. You're billed monthly, and you can adjust your plan whenever your needs change.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-4">
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
                    <a href="mailto:christophercarter@hey.com">
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
      <section className="relative py-20 lg:py-32">
        {/* Radial gradient glow effect */}
        <div className="absolute inset-0 -z-10 opacity-15">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="mb-6 text-4xl font-normal sm:text-5xl">
              Stop Juggling Vendors. Start Shipping.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mb-8 text-xl text-muted-foreground font-light">
              Unlimited design. Unlimited development. One expert partner.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mb-10 text-lg text-muted-foreground/80">
              Pause or cancel anytime. No contracts. No risk.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
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
                className="text-lg border-primary/50 text-primary hover:bg-primary/10"
              >
                Have questions? Let's talk
              </ScheduleCTA>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.svg"
                alt="Design Dream"
                width={180}
                height={60}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="mb-6 text-muted-foreground">
              Still have questions? Email me:{' '}
              <a href="mailto:christophercarter@hey.com" className="text-primary hover:underline">
                christophercarter@hey.com
              </a>
            </p>
            <div className="mb-6 flex justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            </div>
            <p className="text-sm text-muted-foreground/60">
              © 2025 Design Dream. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
    </div>
  );
}
