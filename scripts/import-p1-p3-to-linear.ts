import { LinearClient } from '@linear/sdk';

const LINEAR_API_KEY = 'YOUR_LINEAR_API_KEY_HERE';

const client = new LinearClient({
  apiKey: LINEAR_API_KEY,
});

interface Issue {
  title: string;
  description: string;
  priority: 0 | 1 | 2 | 3 | 4;
  estimate: number;
  labels: string[];
}

const issues: Issue[] = [
  // P1 (High) - Core Features
  {
    title: '[P1] Build in-app notification system',
    description: `**Labels:** notifications, frontend, p1
**Estimate:** 3 hours

**Description:**
- Notification bell icon in top bar
- Dropdown with notification list
- Unread count badge
- Mark as read
- Click to navigate

**Acceptance Criteria:**
- [ ] Bell icon shows unread count
- [ ] Dropdown lists recent notifications
- [ ] Can mark individual as read
- [ ] Can mark all as read
- [ ] Click navigates to related item`,
    priority: 2, // High
    estimate: 3,
    labels: ['notifications', 'frontend', 'p1'],
  },
  {
    title: '[P1] Set up email notifications',
    description: `**Labels:** notifications, email, backend, p1
**Estimate:** 4 hours

**Description:**
Email notifications via Resend:
- Request status changes
- New comments
- Deliveries ready
- SLA warnings
- Payment issues

**Acceptance Criteria:**
- [ ] Resend API configured
- [ ] Email templates created (HTML)
- [ ] Triggers on key events
- [ ] Unsubscribe link included
- [ ] Emails delivered reliably`,
    priority: 2,
    estimate: 4,
    labels: ['notifications', 'email', 'backend', 'p1'],
  },
  {
    title: '[P1] Build deliverables page',
    description: `**Labels:** deliverables, frontend, p1
**Estimate:** 2 hours

**Description:**
Page to view and download completed work:
- List of all deliverables
- Filter by request
- Download files
- View links (Figma, GitHub PRs)

**Acceptance Criteria:**
- [ ] All deliverables listed
- [ ] Files downloadable
- [ ] Links clickable
- [ ] Organized by request
- [ ] Search functionality`,
    priority: 2,
    estimate: 2,
    labels: ['deliverables', 'frontend', 'p1'],
  },
  {
    title: '[P1] Build settings page',
    description: `**Labels:** settings, frontend, p1
**Estimate:** 2 hours

**Description:**
User settings:
- Profile (name, email, phone)
- Company info
- Notification preferences
- Password/auth settings

**Acceptance Criteria:**
- [ ] Can update profile
- [ ] Can update company details
- [ ] Can toggle notification preferences
- [ ] Changes saved to database
- [ ] Success confirmation`,
    priority: 2,
    estimate: 2,
    labels: ['settings', 'frontend', 'p1'],
  },
  {
    title: '[P1] Add comments to requests',
    description: `**Labels:** requests, comments, frontend, p1
**Estimate:** 3 hours

**Description:**
Comment thread on request detail page:
- Add comments
- View comment history
- File attachments in comments
- Real-time updates

**Acceptance Criteria:**
- [ ] Can add text comments
- [ ] Can attach files to comments
- [ ] Comments show author and timestamp
- [ ] Real-time updates (Supabase Realtime)
- [ ] Markdown formatting supported`,
    priority: 2,
    estimate: 3,
    labels: ['requests', 'comments', 'frontend', 'p1'],
  },
  {
    title: '[P1] Implement SLA dashboard',
    description: `**Labels:** admin, sla, frontend, p1
**Estimate:** 3 hours

**Description:**
Admin SLA tracking page:
- Active SLAs with timers
- Historical adherence metrics
- Per-client SLA performance
- Violation alerts

**Acceptance Criteria:**
- [ ] All active SLAs visible with timers
- [ ] Charts show adherence % (line graph)
- [ ] Table of per-client performance
- [ ] Violations highlighted
- [ ] Export to CSV`,
    priority: 2,
    estimate: 3,
    labels: ['admin', 'sla', 'frontend', 'p1'],
  },

  // P2 (Medium) - Important Features
  {
    title: '[P2] Implement real-time updates (Supabase Realtime)',
    description: `**Labels:** realtime, backend, p2
**Estimate:** 3 hours

**Description:**
Live updates for:
- New comments
- Status changes
- Queue reordering

**Acceptance Criteria:**
- [ ] Changes appear without refresh
- [ ] Subscriptions managed properly
- [ ] No memory leaks
- [ ] Works across tabs`,
    priority: 3, // Medium
    estimate: 3,
    labels: ['realtime', 'backend', 'p2'],
  },
  {
    title: '[P2] Add file preview for uploaded assets',
    description: `**Labels:** files, frontend, p2
**Estimate:** 2 hours

**Description:**
Preview images and PDFs inline:
- Image previews
- PDF viewer
- Video previews
- Download button

**Acceptance Criteria:**
- [ ] Images show thumbnails
- [ ] PDFs open in viewer
- [ ] Videos playable
- [ ] Download always available`,
    priority: 3,
    estimate: 2,
    labels: ['files', 'frontend', 'p2'],
  },
  {
    title: '[P2] Build advanced filtering and search',
    description: `**Labels:** search, frontend, p2
**Estimate:** 3 hours

**Description:**
Advanced filters for requests:
- Search by title/description
- Filter by type, priority, status
- Date range filters
- Save filter presets

**Acceptance Criteria:**
- [ ] Search works across all fields
- [ ] Filters are combinable
- [ ] Results update instantly
- [ ] Can save favorite filters`,
    priority: 3,
    estimate: 3,
    labels: ['search', 'frontend', 'p2'],
  },
  {
    title: '[P2] Add dark mode toggle',
    description: `**Labels:** ui, theming, frontend, p2
**Estimate:** 2 hours

**Description:**
Theme switcher with next-themes:
- Light/dark mode toggle
- Respects system preference
- Persists selection
- Smooth transitions

**Acceptance Criteria:**
- [ ] Toggle in user menu
- [ ] Defaults to system preference
- [ ] Persists across sessions
- [ ] All components support both modes`,
    priority: 3,
    estimate: 2,
    labels: ['ui', 'theming', 'frontend', 'p2'],
  },
  {
    title: '[P2] Create onboarding flow for new clients',
    description: `**Labels:** onboarding, frontend, p2
**Estimate:** 4 hours

**Description:**
Guided onboarding after signup:
- Welcome tour
- Submit first request
- Upload brand assets
- Set up profile

**Acceptance Criteria:**
- [ ] Tour highlights key features
- [ ] Can skip or complete
- [ ] Progress tracked
- [ ] Only shows once

**Reference:** operations/Client-Onboarding-Flow.md`,
    priority: 3,
    estimate: 4,
    labels: ['onboarding', 'frontend', 'p2'],
  },
  {
    title: '[P2] Build analytics dashboard',
    description: `**Labels:** admin, analytics, p2
**Estimate:** 4 hours

**Description:**
Business metrics for admin:
- MRR
- Active clients
- Churn rate
- Average turnaround time
- SLA adherence %
- Request volume

**Acceptance Criteria:**
- [ ] All metrics displayed with charts
- [ ] Date range filters
- [ ] Export to CSV
- [ ] Real-time updates`,
    priority: 3,
    estimate: 4,
    labels: ['admin', 'analytics', 'p2'],
  },

  // P3 (Low) - Nice to Have
  {
    title: '[P3] Integrate Basecamp API',
    description: `**Labels:** integrations, basecamp, backend, p3
**Estimate:** 8 hours

**Description:**
Sync with Basecamp:
- Auto-create projects on signup
- Sync requests to to-dos
- Sync comments bidirectionally
- Handle Basecamp webhooks

**Acceptance Criteria:**
- [ ] OAuth connection to Basecamp
- [ ] Projects created automatically
- [ ] Requests synced to to-dos
- [ ] Comments synced both ways
- [ ] Status updates synced

**Note:** Can launch without this - do manual Basecamp setup initially`,
    priority: 4, // Low
    estimate: 8,
    labels: ['integrations', 'basecamp', 'backend', 'p3'],
  },
  {
    title: '[P3] Add team member invites',
    description: `**Labels:** auth, team, p3
**Estimate:** 4 hours

**Description:**
Allow clients to invite team members:
- Send invite emails
- Team member signup
- Role management (viewer vs admin)
- Activity scoped by team

**Acceptance Criteria:**
- [ ] Can send invite by email
- [ ] Invite expires after 7 days
- [ ] Team members see same data
- [ ] Roles enforced (viewer can't edit)`,
    priority: 4,
    estimate: 4,
    labels: ['auth', 'team', 'p3'],
  },
  {
    title: '[P3] Build referral program',
    description: `**Labels:** growth, marketing, p3
**Estimate:** 6 hours

**Description:**
Client referral program:
- Unique referral codes
- Track referrals
- Reward both parties
- Referral dashboard

**Acceptance Criteria:**
- [ ] Each client has referral code
- [ ] Tracked when new signup uses code
- [ ] Discounts applied automatically
- [ ] Dashboard shows referrals`,
    priority: 4,
    estimate: 6,
    labels: ['growth', 'marketing', 'p3'],
  },
  {
    title: '[P3] Add AI-assisted request categorization',
    description: `**Labels:** ai, automation, p3
**Estimate:** 4 hours

**Description:**
Auto-categorize and estimate requests:
- Detect request type
- Suggest priority
- Estimate hours
- Flag unclear requests

**Acceptance Criteria:**
- [ ] Type auto-selected (can override)
- [ ] Priority suggested
- [ ] Estimate shown
- [ ] Admin can adjust`,
    priority: 4,
    estimate: 4,
    labels: ['ai', 'automation', 'p3'],
  },
  {
    title: '[P3] Build component library showcase',
    description: `**Labels:** marketing, content, p3
**Estimate:** 6 hours

**Description:**
Public page showcasing design system:
- Component examples
- Code snippets
- Interactive demos
- Download design files

**Acceptance Criteria:**
- [ ] All components showcased
- [ ] Copy code button works
- [ ] Interactive demos
- [ ] SEO optimized`,
    priority: 4,
    estimate: 6,
    labels: ['marketing', 'content', 'p3'],
  },
];

async function main() {
  try {
    console.log('🚀 Starting Linear import (P1-P3 issues)...\n');

    const viewer = await client.viewer;
    console.log(`✅ Authenticated as: ${viewer.name} (${viewer.email})\n`);

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
      'notifications',
      'email',
      'deliverables',
      'settings',
      'comments',
      'realtime',
      'files',
      'search',
      'ui',
      'theming',
      'onboarding',
      'analytics',
      'integrations',
      'basecamp',
      'team',
      'growth',
      'ai',
      'automation',
      'p1',
      'p2',
      'p3',
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
