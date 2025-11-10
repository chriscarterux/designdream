# Automated Client Onboarding System

## Overview

When a client subscribes to Design Dream's monthly subscription via Stripe, our system automatically:

1. **Creates Linear Project** - Custom kanban board with 3-column workflow
2. **Sets Up Figma File** - Dedicated design file for the client
3. **Creates Git Repository** - Private repo for code/design assets
4. **Generates Documentation** - Pre-filled project description with all details
5. **Sends Welcome Email** - Onboarding email with access links and instructions

**Zero manual setup required** - clients can start submitting requests immediately after payment.

## Client Workflow (3-Column Kanban)

Unlike the standard 5-state workflow, client projects use a simplified 3-column board:

| Column | Purpose | Rules |
|--------|---------|-------|
| **Backlog** | All design requests waiting to be worked on | Unlimited issues allowed |
| **Current Request** | Active work in progress | **Only 1 issue allowed** |
| **Approved** | Completed and approved by client | Archives after 30 days |

## Onboarding Flow

```
Stripe Subscription Created
         ↓
Stripe Webhook → Design Dream API
         ↓
Create Linear Project (with custom description)
         ↓
Create Figma File (from template)
         ↓
Create Git Repository (private)
         ↓
Generate Stripe Customer Portal Link
         ↓
Send Welcome Email
         ↓
Client receives email with:
  - Linear project link
  - Figma file link
  - Stripe portal link
  - Getting started guide
```

## Project Description Template

Each new client project includes this description:

```markdown
# {Company Name}

**Subscriber:** {First Name} {Last Name}
**Email:** {Email}
**Subscription:** {Plan Name} - ${Price}/month
**Manage Subscription:** [Click here]({Stripe Portal Link})

---

## Welcome to your design board

Here you will submit and manage all of your design requests.

You'll notice there are a total of 3 columns here:

- **Backlog**: All requests you need done. There is no limit to how many requests can be in this list.
- **Current Request**: Tell your designer to begin working on a request by dragging an issue here to this column. You may only have one active request at a time.
- **Approved**: A request is placed here by you once it is approved by you and you receive all the desired files.

---

## Find your design files

Design Dream keeps a record of all your design and code files for the lifetime of your subscription should you need to reference them at anytime. You can find your links here:

- **Figma:** [{Figma File Link}]({Figma File Link})
- **Repository:** [{Repo Link}]({Repo Link})

---

## Branding

Please attach any relevant documents, links, or details related to your brand (brand guide, website URL, logo, etc.)

Add them here or create a new issue titled "Brand Assets" with attachments.

---

## Manage Your Subscription

To manage your subscription, please sign in here: [{Stripe Portal Link}]({Stripe Portal Link})

You can:
- Update payment method
- View invoices
- Change plan
- Cancel subscription
```

## Technical Architecture

### Components

1. **Stripe Webhook Handler** (`/api/webhooks/stripe`)
   - Listens for `customer.subscription.created`
   - Validates webhook signature
   - Triggers onboarding automation

2. **Linear Project Creator** (`/lib/onboarding/linear-project.ts`)
   - Creates project via Linear API
   - Sets up 3-column workflow states
   - Fills project description with customer data

3. **Figma File Creator** (`/lib/onboarding/figma-automation.ts`)
   - Duplicates template file via Figma API
   - Renames for client
   - Grants client view/edit access

4. **Repository Creator** (`/lib/onboarding/repo-automation.ts`)
   - Creates private GitHub repo
   - Adds initial README
   - Configures access permissions

5. **Email Sender** (`/lib/onboarding/welcome-email.ts`)
   - Sends branded welcome email
   - Includes all access links
   - Provides getting started guide

### Environment Variables Required

```bash
# Linear
LINEAR_API_KEY=lin_api_...
LINEAR_TEAM_ID=...

# Figma
FIGMA_ACCESS_TOKEN=...
FIGMA_TEMPLATE_FILE_KEY=...
FIGMA_TEAM_ID=...

# GitHub
GITHUB_TOKEN=...
GITHUB_ORG=chriscarterux

# Stripe
STRIPE_SECRET_KEY=sk_live_...

# Email (Resend)
RESEND_API_KEY=re_...
```

## Customization Options

### Project Templates

Different subscription tiers can have different templates:

- **Basic Plan**: Simple 3-column board
- **Pro Plan**: 3-column board + custom labels
- **Enterprise**: 5-column board with advanced workflow

### Figma Templates

Create tier-specific Figma templates:

- **Basic**: Single page with brand kit
- **Pro**: Multi-page with components library
- **Enterprise**: Full design system

### Email Templates

Customize welcome emails per tier:

- **Basic**: Simple welcome message
- **Pro**: Detailed onboarding checklist
- **Enterprise**: White-glove onboarding call scheduling

## Documentation

- [Setup Guide](./01-setup-guide.md) - Configure all integrations
- [Linear Project Template](./02-linear-template.md) - Customize project structure
- [Figma Automation](./03-figma-automation.md) - Set up Figma integration
- [Repository Automation](./04-repo-automation.md) - Configure GitHub automation
- [Email Templates](./05-email-templates.md) - Customize welcome emails
- [Testing Guide](./06-testing-guide.md) - Test onboarding flow
- [Troubleshooting](./07-troubleshooting.md) - Common issues and fixes

## Success Metrics

Track these KPIs to measure onboarding effectiveness:

| Metric | Target | Current |
|--------|--------|---------|
| Time from payment to project ready | < 2 minutes | TBD |
| Successful automated setups | > 99% | TBD |
| Time to first request submitted | < 24 hours | TBD |
| Client activation rate | > 80% | TBD |
| Support tickets during onboarding | < 5% | TBD |

## Rollback Plan

If automation fails, manual fallback:

1. Alert sent to admin
2. Manual Linear project creation
3. Manual Figma setup
4. Manual welcome email
5. Log failure for debugging

## Future Enhancements

- **Notion workspace** - Create client-specific Notion docs
- **Slack channel** - Auto-invite client to dedicated channel
- **Calendar booking** - Schedule kickoff call
- **Loom video** - Personalized welcome video
- **Client portal** - Custom dashboard for file access
