# Design Dreams - Tech Stack

## Architecture Philosophy

**Lean & Composable:** We integrate best-in-class SaaS tools rather than building custom infrastructure. Supabase serves as the lightweight integration layer, not a full client portal.

**Key Principle:** Use managed services for non-differentiating features (billing, task management), focus development effort on unique value (design + dev delivery workflow).

---

## Core Technologies

### Frontend

**Framework:** Next.js 14+ (App Router)
- **Why:** Best-in-class React framework with server components, built-in routing, and Vercel deployment optimization
- **Features Used:**
  - App Router for file-based routing
  - Server Components for performance
  - API Routes for webhook handlers
  - Metadata API for SEO
  - Image optimization

**UI Library:** shadcn/ui
- **Why:** Accessible, customizable components built on Radix UI primitives
- **Benefits:** Copy/paste components (no package bloat), Tailwind styling, TypeScript support
- **Usage:** Buttons, forms, dialogs, navigation, cards

**Landing Page Blocks:** shadcnblocks
- **Why:** Pre-built, production-ready sections for marketing sites
- **Usage:** Hero sections, pricing tables, feature grids, testimonials, CTAs

**Styling:** Tailwind CSS v3+
- **Why:** Utility-first CSS for rapid UI development
- **Configuration:** Custom design tokens for brand colors, typography, spacing
- **Benefits:** Mobile-first responsive design, built-in dark mode support

**Type Safety:** TypeScript
- **Why:** Catch errors at compile time, improve developer experience
- **Usage:** Strict mode enabled, type all props and API responses

### Backend / Integration Layer

**Database:** Supabase (PostgreSQL)
- **Why:** Managed Postgres with real-time subscriptions, auth, and edge functions
- **Usage:**
  - Store customer records (Stripe ID, subscription status, email)
  - Map customers to Trello boards
  - Sync webhook events from Stripe
- **Schema:**
  ```sql
  -- customers table
  id: uuid (primary key)
  stripe_customer_id: text (unique)
  email: text
  subscription_status: enum (active, paused, canceled)
  subscription_tier: text
  created_at: timestamp
  updated_at: timestamp

  -- trello_boards table
  id: uuid (primary key)
  customer_id: uuid (foreign key → customers)
  trello_board_id: text
  trello_board_url: text
  created_at: timestamp
  ```

**Authentication (Future):** Supabase Auth
- **Current:** Not needed for MVP (Stripe handles customer identity)
- **Future:** If we add custom admin dashboard or client portal

**API Layer:** Next.js API Routes
- **Why:** Co-located with frontend, serverless by default on Vercel
- **Usage:**
  - Stripe webhook handler (`/api/webhooks/stripe`)
  - Supabase queries (create customer, update subscription status)
  - Generate Stripe Customer Portal links

### External Services

#### 1. Stripe (Payments & Billing)
- **Role:** Handles all subscription logic, payment processing, customer portal
- **Features Used:**
  - Subscription Products (e.g., "Standard Plan - $5k/month")
  - Checkout Sessions (for landing page CTA)
  - Customer Portal (pause, cancel, update payment method)
  - Webhooks (sync events to Supabase)
- **Why No Custom Billing UI:** Stripe Customer Portal is feature-complete, secure, and PCI-compliant. Building custom UI adds complexity with no user benefit.

**Webhook Events:**
- `checkout.session.completed` → Create customer record in Supabase, trigger Trello board creation
- `customer.subscription.updated` → Update subscription status
- `customer.subscription.deleted` → Archive Trello board, mark customer as canceled
- `invoice.payment_succeeded` → Log payment (optional for analytics)

#### 2. Trello (Task Management)
- **Role:** Client-facing task board for request submission and progress tracking
- **Setup:**
  - One Trello workspace for Design Dreams
  - One board per client (created via Trello API or Zapier)
  - Board template: Columns (Backlog, In Progress, Review, Done)
  - Labels: Design, Dev, Bug, Question
- **Why No Custom Kanban:** Trello is already familiar to users, has mobile apps, and handles notifications/comments. Building a custom kanban adds development time with marginal UX benefit.

**Automation:**
- Create board on new subscription (Zapier or Trello API)
- Invite customer email to board
- Pre-populate with welcome card and instructions

#### 3. Automation Platform
**Options:** Zapier (easy, no-code) or n8n (self-hosted, advanced)
- **Current Choice:** Zapier for MVP (faster setup)
- **Trigger:** Stripe webhook → New subscription
- **Actions:**
  1. Create Trello board from template
  2. Invite customer to board
  3. Send onboarding email (via SendGrid or Resend)
  4. Add customer + board mapping to Supabase

**Future:** Migrate to n8n if Zapier costs become prohibitive

#### 4. Email (Transactional)
**Options:** Resend, SendGrid, or Postmark
- **Current Choice:** Resend (developer-friendly, React Email templates)
- **Usage:**
  - Welcome email on subscription
  - Trello invite notification
  - Daily/weekly progress summaries (future)

#### 5. Analytics
**Options:** Plausible (privacy-focused) or Google Analytics
- **Current Choice:** Plausible for MVP
- **Metrics:**
  - Landing page traffic and conversion rate
  - CTA click rates (Subscribe vs. Book Call)
  - Traffic sources (referral, organic, paid)

#### 6. Calendly (Optional)
- **Role:** "Book Intro Call" CTA for consultative sales
- **Usage:** Embedded on landing page, routed to founder's calendar
- **Future:** May replace with custom booking if volume increases

---

## Deployment & Infrastructure

### Hosting
**Platform:** Vercel
- **Why:** Optimized for Next.js, zero-config deployment, global CDN
- **Features:**
  - Automatic previews for PRs
  - Serverless functions for API routes
  - Edge network for low latency
  - Built-in analytics

**Domain:** Custom domain (e.g., designdreams.io)
- **DNS:** Cloudflare or Vercel DNS
- **SSL:** Automatic via Vercel

### Environment Variables
**Stored in Vercel:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)
- `RESEND_API_KEY` (email)

**Security:**
- Never commit secrets to Git
- Use Vercel's encrypted env vars
- Rotate keys quarterly

### CI/CD
**Pipeline:** GitHub → Vercel
- **Trigger:** Push to `main` branch
- **Steps:**
  1. Run TypeScript type checks
  2. Build Next.js app
  3. Deploy to production (auto-rollback on failure)
- **Preview Deployments:** Every PR gets unique URL

### Monitoring
**Current (MVP):**
- Vercel Analytics (Web Vitals, performance)
- Stripe Dashboard (payments, subscriptions)
- Supabase Logs (database queries, errors)

**Future:**
- Sentry (error tracking)
- LogRocket or Hotjar (session replay)

---

## Integration Architecture

### Data Flow: Subscription Purchase

```
User clicks "Subscribe" on landing page
  ↓
Stripe Checkout Session (hosted by Stripe)
  ↓
Payment successful → Stripe webhook fires
  ↓
Next.js API route (/api/webhooks/stripe)
  ↓
Create customer record in Supabase
  ↓
Zapier triggered by Supabase insert (or Stripe webhook directly)
  ↓
Zapier creates Trello board from template
  ↓
Zapier invites customer email to Trello
  ↓
Zapier sends welcome email via Resend
  ↓
Customer receives email + Trello invite
```

### Data Flow: Subscription Management

```
Customer clicks "Manage Subscription" link
  ↓
Next.js API generates Stripe Customer Portal link
  ↓
Redirect to Stripe-hosted portal
  ↓
Customer pauses/cancels subscription
  ↓
Stripe webhook fires (subscription.updated)
  ↓
Next.js API updates Supabase (subscription_status = paused)
  ↓
(Optional) Zapier archives Trello board if canceled
```

### Data Flow: Task Workflow

```
Customer creates Trello card (new request)
  ↓
Founder moves card to "In Progress"
  ↓
Founder works on task (design in Figma, code in GitHub)
  ↓
Founder adds comment + links to card (Figma file, PR, deploy preview)
  ↓
Founder moves card to "Review"
  ↓
Customer reviews and approves (or requests changes)
  ↓
Founder moves card to "Done"
  ↓
(Optional) Weekly summary email lists completed tasks
```

---

## Development Standards

### Code Quality
- **Linting:** ESLint with Next.js recommended config
- **Formatting:** Prettier (auto-format on save)
- **Git Hooks:** Husky + lint-staged (run linter on pre-commit)
- **Type Checking:** TypeScript strict mode, no `any` types

### Component Structure
```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   ├── api/              # API routes
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── landing/          # Landing page sections (Hero, Pricing, etc.)
│   └── shared/           # Shared components (Header, Footer)
├── lib/                  # Utility functions
│   ├── stripe.ts         # Stripe client
│   ├── supabase.ts       # Supabase client
│   └── trello.ts         # Trello API helpers (future)
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

### Testing (Future)
- **Unit Tests:** Vitest or Jest (for utility functions)
- **E2E Tests:** Playwright (for critical user flows like checkout)
- **Coverage Goal:** 80%+ for business logic

---

## Design System

### Typography
- **Headings:** Inter or Satoshi (modern, readable)
- **Body:** Inter or System UI
- **Code:** Fira Code or JetBrains Mono

### Colors
- **Primary:** Blue/Purple gradient (trust, tech-forward)
- **Accent:** Bright green or orange (CTAs, highlights)
- **Neutral:** Gray scale (background, text, borders)

### Components
- **Buttons:** Primary, secondary, ghost variants
- **Cards:** Elevated, bordered, gradient backgrounds
- **Forms:** Input, textarea, select, checkbox (all shadcn/ui)
- **Icons:** Lucide Icons (consistent, tree-shakeable)

---

## Product-Specific Decisions

### Why Supabase Over Custom Backend?
- **Speed:** Pre-built auth, database, real-time all-in-one
- **Cost:** Free tier sufficient for MVP, scales affordably
- **Developer Experience:** Auto-generated APIs, TypeScript types
- **Flexibility:** Can extend with Edge Functions if needed

### Why Stripe Customer Portal Over Custom Billing UI?
- **Security:** PCI compliance handled by Stripe
- **Features:** Pause, cancel, update payment all built-in
- **Maintenance:** No code to maintain, automatic updates
- **UX:** Users familiar with Stripe interface

### Why Trello Over Custom Kanban?
- **Adoption:** Clients already know Trello (zero learning curve)
- **Mobile:** Native iOS/Android apps for on-the-go updates
- **Notifications:** Built-in email/push notifications for comments
- **Collaboration:** Easy to invite stakeholders, add attachments
- **Cost:** Free tier supports unlimited boards

### Future Considerations

**If We Outgrow This Stack:**
- **Supabase → PostgreSQL on Railway/Render:** More control, same database
- **Zapier → n8n or custom Next.js cron jobs:** Cost optimization
- **Trello → Linear or custom board:** If we need tighter integration or white-labeling

**Red Flags to Watch:**
- Zapier costs >$100/month → migrate to n8n
- Supabase edge functions hitting limits → move to dedicated Node.js server
- Trello API rate limits → cache board state in Supabase

---

## Security Best Practices

### Stripe Webhooks
- Verify webhook signatures using `stripe.webhooks.constructEvent()`
- Never trust webhook data without signature verification
- Use idempotency keys for database writes

### Supabase
- Use Row Level Security (RLS) for customer data isolation (future)
- Use service role key only on server-side (never expose in client)
- Sanitize all user inputs to prevent SQL injection

### Environment Variables
- Store all secrets in Vercel env vars (encrypted at rest)
- Use `.env.local` for local development (gitignored)
- Rotate API keys every 90 days

### HTTPS Only
- Enforce HTTPS redirects (automatic on Vercel)
- Set `Secure` flag on all cookies
- Use HSTS headers

---

## Performance Targets

### Landing Page
- **Lighthouse Score:** 90+ across all metrics
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1
- **Time to Interactive:** <3s on 4G

### API Routes
- **Webhook Processing:** <500ms (Stripe requires response in <5s)
- **Database Queries:** <200ms average

### Optimizations
- Use Next.js Image component for automatic optimization
- Lazy load below-the-fold components
- Minimize third-party scripts (analytics, calendly)
- Use edge functions for low-latency API responses

---

## Documentation

### For Developers (Future Hires)
- `README.md`: Setup instructions, env vars, local development
- `ARCHITECTURE.md`: System design, data flows
- `API.md`: API route documentation (inputs, outputs, examples)

### For Clients
- Trello "Getting Started" card: How to submit requests, expected SLAs
- Email templates: Onboarding sequence, progress updates
- FAQ page on landing site (future)

---

## Open Questions / Decisions Needed

1. **Email Platform:** Resend vs. SendGrid vs. Postmark?
   - **Recommendation:** Resend (best DX, React Email support)

2. **Analytics:** Plausible vs. Google Analytics?
   - **Recommendation:** Plausible (privacy, simpler, aligns with brand)

3. **Automation:** Zapier vs. n8n?
   - **Recommendation:** Start with Zapier (faster), migrate to n8n if costs rise

4. **Onboarding Calls:** Required or optional?
   - **Recommendation:** Optional for MVP, required for Enterprise tier (future)

5. **Design Handoff:** Figma links in Trello or separate delivery method?
   - **Recommendation:** Attach to Trello cards (single source of truth)

---

## Summary

**Stack at a Glance:**
- **Frontend:** Next.js 14, shadcn/ui, Tailwind, TypeScript
- **Backend:** Supabase (Postgres), Next.js API Routes
- **Payments:** Stripe (Checkout, Subscriptions, Customer Portal)
- **Task Management:** Trello (boards, automation via API/Zapier)
- **Automation:** Zapier (MVP), n8n (future)
- **Email:** Resend
- **Analytics:** Plausible
- **Hosting:** Vercel
- **Version Control:** GitHub

**Philosophy:** Compose best-of-breed tools, minimize custom code, ship fast, iterate based on customer feedback.
