import { LinearClient } from '@linear/sdk';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ LINEAR_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new LinearClient({
  apiKey: LINEAR_API_KEY,
});

interface Issue {
  title: string;
  description: string;
  priority: 0 | 1 | 2 | 3; // 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low in Linear
  estimate: number; // hours
  labels: string[];
  team?: string;
}

const issues: Issue[] = [
  // P0 (Critical) - Must Have for MVP
  {
    title: '[P0] Set up Supabase project and database',
    description: `**Labels:** infrastructure, database, p0
**Estimate:** 2 hours

**Description:**
- Create Supabase project
- Configure authentication providers (email magic link)
- Set up storage buckets
- Configure RLS policies
- Deploy initial schema

**Acceptance Criteria:**
- [ ] Supabase project created and accessible
- [ ] Database schema deployed (all tables, RLS policies)
- [ ] Auth configured (magic link working)
- [ ] Storage buckets created (client-uploads, deliverables)
- [ ] Local development environment connected

**Dependencies:** None
**Blocks:** All auth and data features`,
    priority: 1, // Urgent
    estimate: 2,
    labels: ['infrastructure', 'database', 'p0'],
  },
  {
    title: '[P0] Configure environment variables and secrets',
    description: `**Labels:** infrastructure, config, p0
**Estimate:** 1 hour

**Description:**
- Set up \`.env.local\` with all required keys
- Configure Supabase connection
- Add placeholder for Stripe (configure later)

**Acceptance Criteria:**
- [ ] \`.env.local\` created from template
- [ ] Supabase keys added
- [ ] App can connect to Supabase
- [ ] No secrets committed to git`,
    priority: 1,
    estimate: 1,
    labels: ['infrastructure', 'config', 'p0'],
  },
  {
    title: '[P0] Implement authentication flow',
    description: `**Labels:** auth, frontend, p0
**Estimate:** 4 hours

**Description:**
Build complete auth flow with Supabase Auth:
- Login page with magic link
- Signup page
- Auth callback handler
- Logout functionality
- Protected route middleware

**Acceptance Criteria:**
- [ ] User can sign up with email
- [ ] User receives magic link email
- [ ] User can log in via magic link
- [ ] User can log out
- [ ] Protected routes redirect to login
- [ ] Auth state persists across page refresh

**Files to Create:**
- \`src/app/(auth)/login/page.tsx\`
- \`src/app/(auth)/signup/page.tsx\`
- \`src/app/auth/callback/route.ts\`
- \`src/lib/supabase/client.ts\`
- \`src/lib/supabase/server.ts\`
- \`src/middleware.ts\``,
    priority: 1,
    estimate: 4,
    labels: ['auth', 'frontend', 'p0'],
  },
  {
    title: '[P0] Create auth context and hooks',
    description: `**Labels:** auth, frontend, p0
**Estimate:** 2 hours

**Description:**
- Auth provider component
- useAuth hook
- useUser hook
- User profile management

**Acceptance Criteria:**
- [ ] Auth context provides user state globally
- [ ] useAuth() returns auth methods (login, logout, signup)
- [ ] useUser() returns current user data
- [ ] Loading states handled`,
    priority: 1,
    estimate: 2,
    labels: ['auth', 'frontend', 'p0'],
  },
  {
    title: '[P0] Build landing page with pricing',
    description: `**Labels:** marketing, frontend, p0
**Estimate:** 6 hours

**Description:**
Create public-facing landing page using shadcn/ui:
- Hero section with value prop
- "How It Works" (3 steps)
- "What You Get" (service list)
- Pricing section (Core plan: $4,495/mo)
- About section (Chris bio)
- FAQ accordion
- Footer with legal links

**Acceptance Criteria:**
- [ ] Hero section with compelling headline + CTA
- [ ] Process section clearly explains workflow
- [ ] Service list comprehensive
- [ ] Pricing displayed with Stripe checkout CTA
- [ ] FAQ answers common questions
- [ ] Mobile responsive
- [ ] Fast page load (<2s)

**Copy Source:** \`operations/Landing-Page-Copy-Final.md\``,
    priority: 1,
    estimate: 6,
    labels: ['marketing', 'frontend', 'p0'],
  },
  {
    title: '[P0] Create legal pages (Terms, Privacy, Refund)',
    description: `**Labels:** legal, content, p0
**Estimate:** 1 hour

**Description:**
- Terms of Service
- Privacy Policy
- Refund Policy
- Link from footer

**Acceptance Criteria:**
- [ ] All legal pages accessible
- [ ] Content adapted for Texas (Chris location)
- [ ] Footer links to all pages
- [ ] Mobile responsive

**Source:** \`operations/Service-Agreement-Texas.md\``,
    priority: 2,
    estimate: 1,
    labels: ['legal', 'content', 'p0'],
  },
  {
    title: '[P0] Build client dashboard layout',
    description: `**Labels:** dashboard, frontend, p0
**Estimate:** 4 hours

**Description:**
Create authenticated dashboard layout:
- Sidebar navigation
- Top bar with user menu
- Breadcrumbs
- Mobile responsive nav

**Acceptance Criteria:**
- [ ] Sidebar with navigation links
- [ ] Top bar with user avatar + dropdown
- [ ] Mobile hamburger menu works
- [ ] Breadcrumbs show current location
- [ ] Layout used by all dashboard pages

**Routes:**
- \`/dashboard\` - Overview
- \`/dashboard/requests\` - Requests
- \`/dashboard/queue\` - Kanban
- \`/dashboard/billing\` - Subscription`,
    priority: 1,
    estimate: 4,
    labels: ['dashboard', 'frontend', 'p0'],
  },
  {
    title: '[P0] Create dashboard overview page',
    description: `**Labels:** dashboard, frontend, p0
**Estimate:** 3 hours

**Description:**
Dashboard home with:
- Welcome message
- Active task card
- Queue summary stats
- Recent activity feed
- Quick actions (submit request, view queue)

**Acceptance Criteria:**
- [ ] Shows current active task (if any)
- [ ] Displays queue counts (backlog, in progress, review)
- [ ] Recent activity with timestamps
- [ ] Quick action buttons work
- [ ] Empty state when no tasks`,
    priority: 2,
    estimate: 3,
    labels: ['dashboard', 'frontend', 'p0'],
  },
  {
    title: '[P0] Build request submission form',
    description: `**Labels:** requests, frontend, forms, p0
**Estimate:** 5 hours

**Description:**
Multi-step form for submitting requests:
- Request type selection (design/dev/AI)
- Title and description
- Priority selection
- Success criteria (checklist)
- Timeline (ideal/hard deadline)
- File uploads
- Review and submit

**Acceptance Criteria:**
- [ ] Form validation with Zod
- [ ] File upload works (drag & drop)
- [ ] Preview before submit
- [ ] Success confirmation
- [ ] Request appears in queue immediately
- [ ] Handles errors gracefully

**Form Templates:** \`operations/Request-Intake-Templates.md\``,
    priority: 1,
    estimate: 5,
    labels: ['requests', 'frontend', 'forms', 'p0'],
  },
  {
    title: '[P0] Build Kanban queue board',
    description: `**Labels:** queue, frontend, kanban, p0
**Estimate:** 6 hours

**Description:**
Kanban board for request management:
- 5 columns: Backlog, Up Next, In Progress, Review, Done
- Drag-and-drop to reorder within columns
- Request cards with key info
- Click card to view details
- WIP limit indicator

**Acceptance Criteria:**
- [ ] All columns render with requests
- [ ] Drag-and-drop works smoothly
- [ ] Cards show: title, type, priority, timeline
- [ ] Click card opens detail view
- [ ] WIP limit enforced (1 in progress per client)
- [ ] Real-time updates when admin changes status

**Library:** @dnd-kit`,
    priority: 1,
    estimate: 6,
    labels: ['queue', 'frontend', 'kanban', 'p0'],
  },
  {
    title: '[P0] Build request detail view',
    description: `**Labels:** requests, frontend, p0
**Estimate:** 4 hours

**Description:**
Full request page with:
- Request details
- Comments section
- File attachments
- Activity timeline
- Status badge

**Acceptance Criteria:**
- [ ] All request fields displayed
- [ ] Comments can be added
- [ ] Files can be uploaded
- [ ] Activity log shows history
- [ ] Status updates reflected immediately`,
    priority: 2,
    estimate: 4,
    labels: ['requests', 'frontend', 'p0'],
  },
  {
    title: '[P0] Integrate Stripe checkout',
    description: `**Labels:** billing, stripe, backend, p0
**Estimate:** 3 hours

**Description:**
- Create Stripe products/prices
- Checkout session creation
- Redirect to Stripe checkout
- Success/cancel handling

**Acceptance Criteria:**
- [ ] "Subscribe" button creates checkout session
- [ ] Redirects to Stripe hosted checkout
- [ ] Success page after payment
- [ ] Subscription created in database
- [ ] Email confirmation sent

**Price:** $4,495/month recurring`,
    priority: 1,
    estimate: 3,
    labels: ['billing', 'stripe', 'backend', 'p0'],
  },
  {
    title: '[P0] Handle Stripe webhooks',
    description: `**Labels:** billing, stripe, backend, p0
**Estimate:** 3 hours

**Description:**
Webhook endpoint for Stripe events:
- \`customer.subscription.created\`
- \`customer.subscription.updated\`
- \`customer.subscription.deleted\`
- \`invoice.payment_succeeded\`
- \`invoice.payment_failed\`

**Acceptance Criteria:**
- [ ] Webhook endpoint at \`/api/webhooks/stripe\`
- [ ] Signature verification working
- [ ] Subscription status synced to database
- [ ] Failed payments trigger notifications
- [ ] Webhook events logged

**File:** \`src/app/api/webhooks/stripe/route.ts\``,
    priority: 1,
    estimate: 3,
    labels: ['billing', 'stripe', 'backend', 'p0'],
  },
  {
    title: '[P0] Build billing management page',
    description: `**Labels:** billing, frontend, p0
**Estimate:** 2 hours

**Description:**
Client subscription management:
- Current plan display
- Billing cycle dates
- Payment method
- Invoice history
- Cancel/pause subscription

**Acceptance Criteria:**
- [ ] Shows current plan and price
- [ ] Next billing date visible
- [ ] Link to Stripe customer portal
- [ ] Past invoices downloadable
- [ ] Cancel option with confirmation`,
    priority: 2,
    estimate: 2,
    labels: ['billing', 'frontend', 'p0'],
  },
  {
    title: '[P0] Build admin dashboard layout',
    description: `**Labels:** admin, frontend, p0
**Estimate:** 3 hours

**Description:**
Separate admin layout with:
- Admin navigation
- Client switcher
- Global stats
- Quick actions

**Acceptance Criteria:**
- [ ] Admin-only middleware protection
- [ ] Different layout from client dashboard
- [ ] Global navigation
- [ ] Access to all features

**Routes:**
- \`/admin\` - Overview
- \`/admin/clients\` - Client list
- \`/admin/queue\` - Global queue
- \`/admin/sla\` - SLA dashboard`,
    priority: 2,
    estimate: 3,
    labels: ['admin', 'frontend', 'p0'],
  },
  {
    title: '[P0] Build admin client list',
    description: `**Labels:** admin, frontend, p0
**Estimate:** 2 hours

**Description:**
Table of all clients with:
- Company name
- Contact info
- Subscription status
- Active requests count
- Last activity

**Acceptance Criteria:**
- [ ] All clients listed in table
- [ ] Sortable columns
- [ ] Search functionality
- [ ] Click to view client detail
- [ ] Status badges (active/paused/churned)`,
    priority: 2,
    estimate: 2,
    labels: ['admin', 'frontend', 'p0'],
  },
  {
    title: '[P0] Build global queue view',
    description: `**Labels:** admin, queue, frontend, p0
**Estimate:** 4 hours

**Description:**
Admin Kanban showing all requests across all clients:
- All 5 columns
- Color-coded by client
- SLA warnings highlighted
- Assign to self
- Bulk status updates

**Acceptance Criteria:**
- [ ] Shows all client requests
- [ ] Client name visible on each card
- [ ] SLA timers displayed
- [ ] Can move cards between statuses
- [ ] Filters by client, priority, type
- [ ] Overdue tasks highlighted red`,
    priority: 1,
    estimate: 4,
    labels: ['admin', 'queue', 'frontend', 'p0'],
  },
  {
    title: '[P0] Build basic SLA tracking',
    description: `**Labels:** admin, sla, backend, p0
**Estimate:** 3 hours

**Description:**
- SLA timer starts when request moves to "In Progress"
- Calculate business hours elapsed
- Display time remaining
- Highlight violations

**Acceptance Criteria:**
- [ ] Timer starts automatically
- [ ] Only counts business hours (M-F, 9am-5pm)
- [ ] Shows time remaining
- [ ] Alerts at 36 hours (12hr warning)
- [ ] Marks violations at 48 hours

**Database:** \`sla_records\` table with triggers`,
    priority: 2,
    estimate: 3,
    labels: ['admin', 'sla', 'backend', 'p0'],
  },
  {
    title: '[P0] Deploy to Vercel production',
    description: `**Labels:** devops, deployment, p0
**Estimate:** 2 hours

**Description:**
- Connect GitHub to Vercel
- Configure environment variables
- Set up production Supabase
- Configure domain (designdream.is)
- Test production deployment

**Acceptance Criteria:**
- [ ] Production URL accessible
- [ ] Custom domain configured with SSL
- [ ] All features working in production
- [ ] No console errors
- [ ] Performance acceptable (<2s load)`,
    priority: 2,
    estimate: 2,
    labels: ['devops', 'deployment', 'p0'],
  },
  {
    title: '[P0] Set up monitoring and error tracking',
    description: `**Labels:** devops, monitoring, p0
**Estimate:** 1 hour

**Description:**
- Vercel Analytics
- Sentry for error tracking
- Log alerts for critical errors

**Acceptance Criteria:**
- [ ] Sentry integrated
- [ ] Errors logged to Sentry
- [ ] Vercel Analytics enabled
- [ ] Email alerts configured for errors`,
    priority: 3,
    estimate: 1,
    labels: ['devops', 'monitoring', 'p0'],
  },
];

async function main() {
  try {
    console.log('🚀 Starting Linear import...\n');

    // Get the viewer (current user)
    const viewer = await client.viewer;
    console.log(`✅ Authenticated as: ${viewer.name} (${viewer.email})\n`);

    // Get teams
    const teams = await client.teams();
    if (teams.nodes.length === 0) {
      console.log('❌ No teams found. Please create a team in Linear first.');
      return;
    }

    const team = teams.nodes[0];
    console.log(`📊 Using team: ${team.name}\n`);

    // Get or create labels
    console.log('🏷️  Setting up labels...');
    const existingLabels = await client.issueLabels();
    const labelMap = new Map<string, string>();

    for (const label of existingLabels.nodes) {
      labelMap.set(label.name.toLowerCase(), label.id);
    }

    const requiredLabels = [
      'infrastructure',
      'database',
      'p0',
      'auth',
      'frontend',
      'config',
      'marketing',
      'legal',
      'content',
      'dashboard',
      'requests',
      'forms',
      'queue',
      'kanban',
      'billing',
      'stripe',
      'backend',
      'admin',
      'sla',
      'devops',
      'deployment',
      'monitoring',
    ];

    for (const labelName of requiredLabels) {
      if (!labelMap.has(labelName.toLowerCase())) {
        const newLabel = await client.createIssueLabel({
          name: labelName,
          teamId: team.id,
        });
        labelMap.set(labelName.toLowerCase(), newLabel.issueLabel!.id);
        console.log(`  ✅ Created label: ${labelName}`);
      } else {
        console.log(`  ℹ️  Label already exists: ${labelName}`);
      }
    }

    console.log(`\n📝 Creating ${issues.length} issues...\n`);

    let created = 0;
    let failed = 0;

    for (const issue of issues) {
      try {
        const labelIds = issue.labels
          .map((label) => labelMap.get(label.toLowerCase()))
          .filter((id): id is string => id !== undefined);

        const result = await client.createIssue({
          teamId: team.id,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          estimate: issue.estimate,
          labelIds,
        });

        if (result.success) {
          created++;
          console.log(`  ✅ ${issue.title}`);
        } else {
          failed++;
          console.log(`  ❌ Failed: ${issue.title}`);
        }
      } catch (error) {
        failed++;
        console.log(`  ❌ Error creating ${issue.title}: ${error}`);
      }
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`  ✅ Created: ${created} issues`);
    if (failed > 0) {
      console.log(`  ❌ Failed: ${failed} issues`);
    }
    console.log(`\n🔗 View in Linear: https://linear.app/${team.key}/team/${team.key}/all`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
