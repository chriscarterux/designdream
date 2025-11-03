'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sparkles,
  Code,
  Palette,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Repeat,
  Infinity,
  Rocket,
  Heart,
  Mail,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Unlimited Design, Dev & AI Services</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Creative Team,
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                On Demand
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get unlimited design, development, and AI automation work for one flat monthly fee.
              <br />
              No contracts. Pause or cancel anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-6 group"
                onClick={() => scrollToSection('pricing')}
              >
                Start Your Subscription
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => scrollToSection('how-it-works')}
              >
                See How It Works
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>48hr Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Unlimited Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Pause Anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to transform your workflow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary/20 mb-2">01</div>
                <CardTitle className="text-2xl">Subscribe</CardTitle>
                <CardDescription className="text-base">
                  Choose your plan and get instant access to our platform. No setup fees, no hidden costs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Repeat className="w-6 h-6 text-accent" />
                </div>
                <div className="text-4xl font-bold text-accent/20 mb-2">02</div>
                <CardTitle className="text-2xl">Submit Requests</CardTitle>
                <CardDescription className="text-base">
                  Add unlimited requests to your queue. We&apos;ll work through them one by one, prioritizing as you need.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary/20 mb-2">03</div>
                <CardTitle className="text-2xl">Get Deliverables</CardTitle>
                <CardDescription className="text-base">
                  Receive your completed work in 48 hours or less. Request revisions until you&apos;re 100% satisfied.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What You Get</h2>
            <p className="text-xl text-muted-foreground">
              All the services you need, included in one subscription
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Design Services */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Design</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'UI/UX Design',
                    'Brand Identity',
                    'Logo Design',
                    'Marketing Graphics',
                    'Social Media Assets',
                    'Presentation Decks',
                    'Wireframes & Prototypes',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Development Services */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">Development</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Web Development',
                    'Mobile Apps',
                    'Full-Stack Solutions',
                    'API Integration',
                    'Database Design',
                    'E-commerce Sites',
                    'Custom Features',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* AI & Automation Services */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-4">AI & Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'AI Integration',
                    'Workflow Automation',
                    'ChatGPT Integration',
                    'Data Processing',
                    'Custom Bots',
                    'API Automation',
                    'Process Optimization',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">One plan. Unlimited possibilities.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="relative overflow-hidden border-2 border-primary shadow-2xl">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                MOST POPULAR
              </div>
              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-3xl mb-2">Core Plan</CardTitle>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold">$4,495</span>
                  <span className="text-xl text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-base">
                  Everything you need to scale your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Infinity, text: 'Unlimited design & dev requests' },
                    { icon: Clock, text: '48-hour average turnaround' },
                    { icon: Repeat, text: 'Unlimited revisions' },
                    { icon: CheckCircle2, text: 'Dedicated team member' },
                    { icon: Zap, text: 'AI & automation included' },
                    { icon: Code, text: 'Full-stack development' },
                    { icon: Palette, text: 'Professional design work' },
                    { icon: Heart, text: 'Pause or cancel anytime' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-lg">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full text-lg py-6 group" onClick={() => scrollToSection('contact')}>
                  Start Your Subscription
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  No contracts. No setup fees. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Your Partner</h2>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                  CC
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4">Hi, I&apos;m Chris</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      I&apos;m a full-stack developer and designer based in Texas with a passion for creating
                      exceptional digital experiences. After years of working with startups and businesses,
                      I realized something: traditional agency models are broken.
                    </p>
                    <p>
                      Too many companies struggle with expensive retainers, slow turnarounds, and unpredictable
                      costs. That&apos;s why I created this service - to give you unlimited access to world-class
                      design, development, and AI automation for one flat monthly fee.
                    </p>
                    <p className="font-semibold text-foreground">
                      No meetings. No contracts. Just exceptional work, delivered fast.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-muted-foreground">Projects Delivered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">48h</div>
                <div className="text-muted-foreground">Average Turnaround</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg">
                How does the subscription work?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Once subscribed, you get access to our project dashboard where you can add unlimited
                design, development, and AI automation requests. We work on one request at a time,
                delivering each within 48 hours on average. You can prioritize your queue and request
                revisions until you&apos;re completely satisfied.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg">
                What is the average turnaround time?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Most requests are completed within 48 hours on average. Complex projects may take longer,
                but we&apos;ll always communicate timelines upfront. Simple tasks like landing pages or UI
                components often come back even faster.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg">
                How many requests can I have at once?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                You can add as many requests as you&apos;d like to your queue. We work on one request at a
                time to ensure quality and speed. You can prioritize your queue at any time to focus on
                what&apos;s most important to your business.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg">
                What if I don&apos;t like the work?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                No problem! We include unlimited revisions with every request. We&apos;ll keep refining until
                you&apos;re completely happy with the result. Your satisfaction is our priority.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg">
                Can I pause or cancel my subscription?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Absolutely! You can pause or cancel your subscription at any time, no questions asked.
                When you pause, your billing cycle stops and you can resume whenever you&apos;re ready. No
                contracts, no commitments.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left text-lg">
                What technologies do you work with?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                We work with modern web technologies including React, Next.js, Vue, Node.js, Python,
                TypeScript, and more. For design, we use Figma, Adobe Creative Suite, and other industry-
                standard tools. We&apos;re also experienced with AI integrations, automation platforms, and
                various APIs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left text-lg">
                Is there a refund policy?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Due to the high-quality nature of our work, we don&apos;t offer refunds. However, you can
                cancel your subscription at any time to stop future charges. We also offer unlimited
                revisions to ensure you&apos;re satisfied with every deliverable.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join forward-thinking businesses who are scaling faster with unlimited design,
            development, and AI automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 group">
              Start Your Subscription
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Mail className="mr-2 w-5 h-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Design Dreams
              </h3>
              <p className="text-muted-foreground mb-4">
                Unlimited design, development, and AI automation for one flat monthly fee.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Design
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Development
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    AI & Automation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Design Dreams. All rights reserved.</p>
            <p>Based in Texas, serving clients worldwide.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
