# Design Dream Scope Change - Basecamp Integration

**Date:** 2025-11-03
**Status:** In Progress - Major Architecture Change

---

## Summary

Removing custom Kanban board implementation in favor of Basecamp REST API integration for project and request management.

---

## Why This Change?

### Original Plan (From PRD + Linear):
- Build custom Kanban queue board with 5 columns
- Client manages requests through custom portal
- Admin manages queue through dashboard
- Custom SLA tracking system

### Actual Requirements (User Clarification):
- Use Basecamp to manage customer projects
- Create a Basecamp project per customer on signup
- Use intake form to run automated script for project setup
- Simple customer dashboard with Stripe billing link + Basecamp form access
- Email notifications (to customer + copy to admin)

### Key Difference:
**We should NOT be building our own queue management system.** We should leverage Basecamp's existing project management capabilities instead.

---

## What We've Built (That Needs Removal)

### ❌ Code to Remove:

1. **Kanban Components** (~500 lines)
   - `/src/components/kanban/kanban-board.tsx`
   - `/src/components/kanban/kanban-column.tsx`
   - `/src/components/kanban/request-card.tsx`

2. **Kanban Hooks** (~200 lines)
   - `/src/hooks/use-kanban.tsx`

3. **Kanban Page** (~150 lines)
   - `/src/app/dashboard/queue/page.tsx`

4. **Kanban Types** (~100 lines)
   - `/src/types/kanban.ts` (partial - keep Request type, remove Column types)

5. **Kanban Tests** (~527 lines, 38 tests)
   - `/src/__tests__/e2e/kanban-board.test.tsx`
   - `KANBAN_TEST_FIXES.md`

6. **Admin Dashboard** (if built)
   - Any admin queue management features

7. **SLA Tracking System** (if built)
   - Custom SLA tracking components/features

**Total Removal:** ~1,500+ lines of code, 38 tests

---

## What We're Building Instead

### ✅ Basecamp Integration:

1. **Basecamp API Client** (`/src/lib/basecamp/`)
   - Authentication (OAuth 2.0)
   - Project creation
   - To-do list management
   - Comment posting
   - File uploads
   - Webhook handling

2. **Signup Flow Integration**
   - On Stripe checkout success → Create Basecamp project
   - Project template with standard columns:
     - Backlog
     - Up Next
     - In Progress
     - Review
     - Done

3. **Intake Form** (`/src/app/dashboard/intake/page.tsx`)
   - Collects client info after signup
   - Triggers automated project setup script
   - Creates initial to-dos in Basecamp
   - Sends welcome email

4. **Simple Customer Dashboard** (`/src/app/dashboard/page.tsx`)
   - Welcome message
   - Link to Stripe billing portal
   - Link to Basecamp project (direct access)
   - Recent activity summary
   - Submit new request (opens Basecamp form)

5. **Email Notification System** (`/src/lib/email/`)
   - Welcome email on signup
   - Project created notification
   - Request status updates
   - Copy admin on all notifications

6. **Webhook Receiver** (`/src/app/api/webhooks/basecamp/route.ts`)
   - Receives Basecamp events
   - Logs activity
   - Triggers notifications

---

## What We're Keeping

### ✅ Already Built & Correct:

1. **Authentication System** (HOW-241, HOW-242)
   - Login/Signup pages
   - Auth context and hooks
   - Protected routes
   - Status: ✅ 65 tests passing

2. **Landing Page** (HOW-243)
   - Marketing site
   - Pricing section
   - FAQ
   - Status: ✅ 84 tests passing

3. **Stripe Checkout** (HOW-250)
   - Subscription creation
   - Payment processing
   - Success/cancel handling
   - Status: ✅ 22 tests passing

4. **Supabase Setup** (HOW-240)
   - Database configuration
   - Client/subscription tables
   - Status: ✅ 25 tests passing

5. **Dashboard Layout** (HOW-245)
   - Sidebar navigation
   - Top bar
   - Mobile responsive
   - Status: ✅ (tests exist)

**Total Keeping:** ~196 passing tests across 4 features

---

## Migration Steps

### Phase 1: Remove Kanban (Immediate)
- [ ] Delete `/src/components/kanban/` directory
- [ ] Delete `/src/hooks/use-kanban.tsx`
- [ ] Delete `/src/app/dashboard/queue/` page
- [ ] Delete `/src/__tests__/e2e/kanban-board.test.tsx`
- [ ] Delete `KANBAN_TEST_FIXES.md`
- [ ] Update `/src/types/kanban.ts` (keep Request, remove Column types)
- [ ] Update TEST_SUITE_SUMMARY.md (remove Kanban section)
- [ ] Update PROJECT-MEMORY.md (remove Kanban references)
- [ ] Remove dashboard nav link to /dashboard/queue

### Phase 2: Basecamp API Integration (1-2 days)
- [ ] Research Basecamp 4 REST API docs
- [ ] Set up Basecamp OAuth app
- [ ] Create API client (`/src/lib/basecamp/client.ts`)
- [ ] Implement project creation
- [ ] Implement to-do list management
- [ ] Test API integration

### Phase 3: Signup Integration (1 day)
- [ ] Hook Stripe webhook to create Basecamp project
- [ ] Send project invitation email
- [ ] Store Basecamp project ID in database
- [ ] Test end-to-end signup flow

### Phase 4: Intake Form (1 day)
- [ ] Build intake form UI
- [ ] Collect client preferences
- [ ] Trigger automated setup script
- [ ] Create initial to-dos

### Phase 5: Customer Dashboard (1 day)
- [ ] Simplify dashboard to essentials
- [ ] Add Stripe billing portal link
- [ ] Add Basecamp project link
- [ ] Add "Submit Request" button (links to Basecamp)

### Phase 6: Email System (1 day)
- [ ] Set up email provider (Resend or SendGrid)
- [ ] Create email templates
- [ ] Welcome email
- [ ] Request status notifications
- [ ] CC admin on all emails

### Phase 7: Testing (1 day)
- [ ] Write E2E tests for Basecamp integration
- [ ] Test full signup → project creation flow
- [ ] Test intake form → automation
- [ ] Test email notifications
- [ ] Update test suite documentation

### Phase 8: Linear Updates (0.5 days)
- [ ] Mark HOW-248 as "Won't Do" or "Replaced by Basecamp"
- [ ] Create new issues for Basecamp integration
- [ ] Update existing issues to reflect Basecamp approach
- [ ] Update project roadmap

---

## Updated Architecture

### Before (Kanban):
```
User → Custom Portal → Custom Kanban Board → Database → Admin Dashboard
```

### After (Basecamp):
```
User → Stripe Checkout → Basecamp Project Created → Email Sent
User → Simple Dashboard → Links to Stripe Portal + Basecamp
User → Basecamp (native) → Submit/Manage Requests
Admin → Basecamp (native) → Manage All Client Projects
```

---

## Impact Analysis

### Test Suite Changes:
- **Removing:** 38 Kanban tests (~527 lines)
- **Keeping:** 196 tests (Auth, Landing, Stripe, Supabase)
- **Adding:** ~30 Basecamp integration tests
- **Net Change:** -8 tests, but more accurate to requirements

### Code Changes:
- **Removing:** ~1,500 lines (Kanban implementation)
- **Adding:** ~800 lines (Basecamp integration + email)
- **Net Change:** -700 lines (simpler, cleaner)

### Timeline:
- **Removal:** 0.5 days
- **Basecamp Integration:** 5-6 days
- **Total:** 1 week to complete migration

---

## Benefits of This Approach

1. **Leverage Existing Tools:** Basecamp is battle-tested project management
2. **Reduce Maintenance:** No custom queue system to maintain
3. **Better UX:** Clients use familiar Basecamp interface
4. **Simpler Codebase:** ~700 fewer lines of code
5. **Faster Development:** Less custom UI to build
6. **Mobile Support:** Basecamp has native mobile apps
7. **Collaboration:** Built-in comments, file sharing, etc.

---

## Risks & Mitigations

### Risk 1: Basecamp API Changes
**Mitigation:**
- Use stable REST API (not beta features)
- Monitor Basecamp changelog
- Abstract API calls behind our client layer

### Risk 2: Basecamp Costs ($99/mo per account)
**Mitigation:**
- Single Basecamp account for all clients
- Each client gets their own project
- Cost amortized across all subscriptions

### Risk 3: Client Learning Curve
**Mitigation:**
- Basecamp is user-friendly
- Provide onboarding video
- "How to Submit a Request" guide

### Risk 4: Limited Customization
**Mitigation:**
- Use Basecamp API to add custom workflows
- Webhooks for automation
- Our portal for metrics/analytics

---

## Basecamp API Resources

**Documentation:**
- API Docs: https://github.com/basecamp/bc3-api
- OAuth Guide: https://github.com/basecamp/api/blob/master/sections/authentication.md
- Webhooks: https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md

**Key Endpoints:**
- `POST /projects.json` - Create project
- `POST /buckets/{project}/todosets/{todoset}/todos.json` - Create to-do
- `POST /buckets/{project}/comments.json` - Add comment
- `POST /buckets/{project}/uploads.json` - Upload file

**Rate Limits:**
- 50 requests per 10 seconds
- OAuth required (no API keys)

---

## Next Steps

1. ✅ Document scope change (this file)
2. 🔄 Remove Kanban code and tests
3. ⏳ Research Basecamp API thoroughly
4. ⏳ Build Basecamp integration
5. ⏳ Update Linear issues
6. ⏳ Write new E2E tests
7. ⏳ Update all documentation

---

## Questions for User

1. Do you already have a Basecamp account? What plan?
2. Should we create a test Basecamp project first?
3. Any specific Basecamp workflow preferences?
4. Which email provider for notifications (Resend, SendGrid, AWS SES)?

---

**Last Updated:** 2025-11-03
**Status:** Scope change approved, migration in progress
