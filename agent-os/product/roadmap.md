# Design Dreams - Product Roadmap

## Overview

This roadmap prioritizes getting to market quickly with a lean, composable architecture. We're integrating best-in-class tools (Stripe, Trello) rather than building custom infrastructure.

**Core Principle:** Ship fast, validate with real customers, iterate based on feedback.

---

## Phase 1: Landing Page & Brand Foundation
**Timeline:** Week 1-2
**Status:** In Progress

### Objectives
- Establish online presence and credibility
- Drive 5-8% visitor-to-lead conversion
- Enable self-service subscription and consultation booking

### Deliverables

#### 1.1 Marketing Site
- [ ] **Hero Section**
  - Headline: Value prop (unlimited design + dev, fixed monthly rate)
  - CTA: "Subscribe Now" or "Book Intro Call"
  - Trust signals: Client logos, testimonials (if available)

- [ ] **Value Proposition Section**
  - Problem/solution framework
  - Key benefits (speed, quality, flexibility, cost)
  - Visual comparison vs. hiring or traditional agencies

- [ ] **How It Works**
  - Step 1: Subscribe
  - Step 2: Get Trello invite + submit requests
  - Step 3: Receive daily updates + deliverables
  - Step 4: Approve, iterate, or pause subscription

- [ ] **What You Get**
  - Design: Figma files, design systems, UI/UX
  - Development: Next.js apps, PRs, production deployment support
  - Workflow: Trello board, daily updates, 1-2 day turnaround

- [ ] **About / Why Me**
  - Founder story and credentials
  - Tech stack and process
  - AI/automation advantage

- [ ] **Pricing**
  - Subscription tiers (e.g., Standard, Pro)
  - What's included / not included
  - Pause/cancel policy
  - CTA: Stripe Checkout link or "Book Call" button

- [ ] **Footer**
  - Contact info, social links
  - Terms of Service, Privacy Policy (placeholder OK for MVP)

#### 1.2 Technical Foundation
- [ ] Next.js 14+ app (App Router)
- [ ] shadcn/ui component library
- [ ] shadcnblocks for landing page sections
- [ ] Tailwind CSS styling
- [ ] Mobile-responsive design
- [ ] SEO basics (metadata, sitemap)
- [ ] Analytics integration (Plausible or Google Analytics)

#### 1.3 Deployment
- [ ] Deploy to Vercel
- [ ] Custom domain setup
- [ ] SSL certificate (automatic via Vercel)

### Success Criteria
- Landing page live and accessible
- Page load time <2 seconds
- Mobile-friendly (Google Mobile-Friendly Test)
- CTAs functional (Stripe link, Calendly embed)

---

## Phase 2: Stripe Integration & Payment Flow
**Timeline:** Week 2-3
**Status:** Not Started

### Objectives
- Enable self-service subscription purchases
- Automate payment collection and renewals
- Provide customer portal for subscription management

### Deliverables

#### 2.1 Stripe Setup
- [ ] Create Stripe account
- [ ] Configure subscription products (e.g., "Standard Plan - $5k/month")
- [ ] Set up pricing tiers (if multiple plans)
- [ ] Enable Customer Portal (pause, cancel, update payment method)
- [ ] Configure webhooks for subscription events

#### 2.2 Checkout Flow
- [ ] Embed Stripe Checkout on landing page CTAs
- [ ] Pass metadata (plan type, user email) to Stripe
- [ ] Redirect to success page after payment
- [ ] Send welcome email (via Stripe or manual for MVP)

#### 2.3 Supabase Integration (Glue Layer)
- [ ] Set up Supabase project
- [ ] Create `customers` table (Stripe customer ID, email, subscription status)
- [ ] Create `trello_boards` table (customer ID → Trello board URL mapping)
- [ ] Webhook handler: Stripe → Supabase (sync subscription events)

#### 2.4 Customer Portal Access
- [ ] Add "Manage Subscription" link on success page
- [ ] Generate Stripe Customer Portal links
- [ ] Allow customers to pause/cancel via Stripe (no custom UI)

### Success Criteria
- Customer can subscribe via landing page
- Payment processed successfully
- Subscription data synced to Supabase
- Customer can access Stripe portal to manage subscription

---

## Phase 3: Trello Automation & Client Onboarding
**Timeline:** Week 3-4
**Status:** Not Started

### Objectives
- Automate Trello board creation for new clients
- Establish standardized workflow (request → in progress → review → done)
- Enable async client communication via Trello

### Deliverables

#### 3.1 Trello Setup
- [ ] Create Trello workspace for Design Dreams
- [ ] Design board template (columns: Backlog, In Progress, Review, Done)
- [ ] Add default labels (Design, Dev, Bug, Question)
- [ ] Create card templates for common request types

#### 3.2 Automation (Zapier or n8n)
- [ ] Trigger: New subscription in Stripe
- [ ] Action 1: Create Trello board from template
- [ ] Action 2: Invite customer email to Trello board
- [ ] Action 3: Add customer record to Supabase (`trello_boards` table)
- [ ] Action 4: Send onboarding email with Trello link and instructions

#### 3.3 Onboarding Documentation
- [ ] Create "Getting Started" Trello card (pinned to board)
- [ ] Instructions: How to submit requests, expected turnaround, communication norms
- [ ] FAQ: Common questions about process, scope, deliverables

#### 3.4 Internal Process
- [ ] Daily Trello check-in routine
- [ ] Move cards through workflow stages
- [ ] Add comments with progress updates
- [ ] Attach Figma links, PR links, deploy previews to cards

### Success Criteria
- New subscriber automatically gets Trello board invite
- Board pre-populated with welcome card and template
- Customer can submit first request within 24 hours of subscription
- Process documented for repeatability

---

## Phase 4: Client Onboarding Flow & Communication
**Timeline:** Week 4-5
**Status:** Not Started

### Objectives
- Streamline first-time client experience
- Set expectations and gather project context
- Establish communication rhythm

### Deliverables

#### 4.1 Onboarding Email Sequence
- [ ] Email 1: Welcome + Trello invite (automated via Stripe webhook)
- [ ] Email 2: "How to Submit Your First Request" (day 1)
- [ ] Email 3: "What to Expect" (day 2)
- [ ] Optional: "Book Onboarding Call" CTA for complex projects

#### 4.2 Request Intake Form (Optional)
- [ ] Simple Typeform or Tally form for structured requests
- [ ] Automatically create Trello card from form submission
- [ ] Alternative: Clients create Trello cards directly (lower friction)

#### 4.3 Communication Norms
- [ ] Daily updates on active tasks (Trello comments)
- [ ] Response SLA: <4 hours for questions
- [ ] Weekly check-in summary (automated or manual)

#### 4.4 Client Offboarding
- [ ] Archive Trello board when subscription canceled
- [ ] Send final deliverables summary
- [ ] Request testimonial/feedback

### Success Criteria
- New client submits first request within 48 hours
- Client receives daily progress update
- Client satisfaction survey shows 4+ stars

---

## Phase 5: Admin Dashboard (Optional - Future)
**Timeline:** Month 2-3
**Status:** Backlog

### Objectives
- Centralize business operations and metrics
- Monitor subscription health and task throughput
- Optimize workflow bottlenecks

### Deliverables

#### 5.1 Admin Panel (Next.js + Supabase)
- [ ] Dashboard: Active subscriptions, MRR, churn rate
- [ ] Customer list: View Trello boards, subscription status, contact info
- [ ] Task metrics: Average turnaround time, tasks completed/month
- [ ] Stripe integration: View invoices, payment history

#### 5.2 Workflow Insights
- [ ] Identify bottleneck stages (e.g., tasks stuck in "Review")
- [ ] Track task types (design vs. dev ratio)
- [ ] Client activity heatmap (who's submitting most requests)

#### 5.3 Automation Opportunities
- [ ] Auto-pause subscription if client inactive >30 days
- [ ] Send "reactivate" email to paused subscribers
- [ ] Generate monthly reports for clients (tasks completed, hours saved)

### Success Criteria
- Single-pane-of-glass view of business health
- Actionable insights to improve turnaround SLA
- Reduced manual admin work

---

## Phase 6: Growth & Optimization (Future)
**Timeline:** Month 3-6
**Status:** Backlog

### Potential Features
- **Tiered Plans:** Standard, Pro, Enterprise with different SLAs
- **Add-Ons:** Priority support, dedicated Slack channel, video calls
- **Referral Program:** 1 month free for successful referrals
- **Case Studies:** Showcase client success stories on landing page
- **Content Marketing:** Blog posts on design/dev best practices
- **Partnerships:** Integrate with no-code tools, CMS platforms

### Success Criteria
- MRR growth rate: 20%+ month-over-month
- Organic traffic: 500+ monthly visitors
- Brand recognition in indie hacker community

---

## Risk Mitigation

### Capacity Risk
- **Risk:** Over-subscription leads to SLA misses
- **Mitigation:** Cap active subscriptions to 3-5 until proven scalable

### Quality Risk
- **Risk:** Fast turnaround compromises quality
- **Mitigation:** Use pre-built components (shadcn, shadcnblocks), maintain code review checklist

### Churn Risk
- **Risk:** Clients pause/cancel after 1-2 months
- **Mitigation:** Deliver high-value tasks early, maintain communication cadence, gather feedback proactively

### Technical Debt Risk
- **Risk:** Quick MVP leads to unmaintainable codebase
- **Mitigation:** Follow established tech stack standards, document architecture decisions

---

## Next Steps

**Immediate Priorities (This Week):**
1. Complete landing page content and design
2. Set up Stripe products and checkout flow
3. Configure Supabase database schema
4. Deploy landing page to production

**Week 2-3:**
1. Integrate Stripe webhooks with Supabase
2. Set up Trello automation (board creation, invites)
3. Launch beta with 1-2 pilot customers

**Week 4+:**
1. Refine onboarding based on pilot feedback
2. Optimize landing page conversion (A/B testing)
3. Begin outreach and marketing efforts
