# Linear Project Template

This guide explains how to structure Linear projects for Design Dream clients using a proven workflow template.

## Project Structure Overview

Each client project uses:
- **5 Workflow States** for kanban flow
- **Labels** for categorization
- **Projects** for grouping related work
- **Milestones** for tracking deliverables

## Creating a New Client Project

### Step 1: Create the Project

1. In Linear, click **Projects** in sidebar
2. Click **New project**
3. Configure:
   - **Name**: `[Client Name] - [Project Type]`
   - **Identifier**: Short code (e.g., `ACME`, `NIKE`)
   - **Description**: Brief project overview
   - **Target date**: Project deadline
   - **Lead**: Assign project lead

Example:
```
Name: Acme Corp - Website Redesign
Identifier: ACME
Description: Complete redesign of corporate website with new branding
Target date: 2024-03-31
Lead: Chris Carter
```

### Step 2: Configure Workflow States

Linear projects use these standard workflow states:

#### 1. Backlog
- **Purpose**: Unrefined ideas and future tasks
- **SLA**: None (not committed work)
- **Who moves here**: Anyone can create issues here
- **Exit criteria**: Task is well-defined and scoped

#### 2. Todo
- **Purpose**: Ready to start, well-defined tasks
- **SLA**: Begin within 24 hours of moving here
- **Who moves here**: Project lead after refinement
- **Exit criteria**: Work begins

#### 3. In Progress
- **Purpose**: Actively being worked on
- **SLA**: Complete within estimated time + 25% buffer
- **Who moves here**: Developer when starting work
- **Exit criteria**: Work complete and ready for review

#### 4. In Review
- **Purpose**: Completed work awaiting approval
- **SLA**: Review within 24 hours
- **Who moves here**: Developer when work is done
- **Exit criteria**: Approved by client or project lead

#### 5. Done
- **Purpose**: Completed and approved work
- **SLA**: N/A
- **Who moves here**: Reviewer after approval
- **Exit criteria**: None (terminal state)

### Step 3: Create Standard Labels

Labels help categorize and filter issues:

#### By Type
- 🐛 `bug` - Something isn't working
- ✨ `feature` - New functionality
- 📝 `content` - Content updates
- 🎨 `design` - Design work
- 🔧 `maintenance` - Technical debt or refactoring

#### By Priority
- 🔥 `urgent` - Drop everything
- ⚡ `high` - High priority
- 📌 `normal` - Standard priority
- 💤 `low` - Nice to have

#### By Size
- 🐭 `xs` - < 1 hour
- 🐱 `small` - 1-4 hours
- 🐕 `medium` - 4-8 hours
- 🐘 `large` - 8-16 hours
- 🦕 `xl` - > 16 hours (should be broken down)

#### By Status
- 🚧 `blocked` - Cannot proceed
- ⏸️ `on-hold` - Paused waiting for client
- 🔄 `recurring` - Repeating task

### Step 4: Set Up Views

Create custom views for different perspectives:

#### Client View
Filter: `status:Backlog,Todo,In Progress,In Review`
Sort: Priority (High → Low)
Group: Status

Purpose: Shows all active work to clients

#### My Work View
Filter: `assignee:me AND status:Todo,In Progress`
Sort: Priority
Group: Project

Purpose: Personal task list

#### Overdue View
Filter: `dueDate:overdue`
Sort: Due date
Group: Priority

Purpose: Monitor SLA compliance

### Step 5: Configure Project Settings

#### General Settings
- **Access**: Set to "Team" (all team members can view)
- **Default assignee**: Project lead
- **Issue prefix**: Use project identifier (e.g., ACME-1, ACME-2)

#### Notifications
Enable notifications for:
- Issue created
- Issue completed
- Issue blocked
- Comment added
- Status changed

#### SLA Settings
Configure in Design Dream dashboard:
- **Response time**: 4 business hours
- **First update**: 24 hours
- **Resolution time**:
  - XS/Small: 1 business day
  - Medium: 2 business days
  - Large: 3 business days
  - XL: Should be broken down

## Issue Templates

Create templates for common issue types:

### Bug Report Template
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser:
- Device:
- OS:

## Screenshots
[Attach screenshots]
```

### Feature Request Template
```markdown
## User Story
As a [type of user], I want [goal] so that [benefit]

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Design Mockups
[Attach designs if available]

## Technical Notes
Any technical considerations
```

### Content Update Template
```markdown
## Page/Section
Which page or section needs updating

## Current Content
What's there now

## New Content
What it should say

## Context
Why this change is needed
```

## Client Onboarding Checklist

When adding a new client to Linear:

- [ ] Create project
- [ ] Configure workflow states
- [ ] Set up labels
- [ ] Create views
- [ ] Add issue templates
- [ ] Invite client team members
- [ ] Set permissions (clients = Guests with limited access)
- [ ] Create initial issues from project scope
- [ ] Schedule kickoff meeting
- [ ] Test webhook integration
- [ ] Verify AI analysis is working

## Client Permissions

Set appropriate access levels:

### Guest (Client Team Members)
- View issues in their project
- Create issues
- Comment on issues
- Cannot delete or change settings

### Member (Design Dream Team)
- Full access to issues
- Can manage workflows
- Can configure labels and views

### Admin (Project Leads)
- All member permissions
- Can manage project settings
- Can add/remove team members

## Best Practices

### Issue Creation
- Write clear, actionable titles
- Include acceptance criteria
- Add relevant labels
- Set priority
- Estimate size
- Assign to appropriate person

### Issue Updates
- Comment when status changes
- Tag people when input needed
- Update estimates if scope changes
- Add screenshots/recordings
- Link related issues

### Workflow Hygiene
- Move issues promptly to reflect reality
- Don't let issues sit in "In Review" >24 hours
- Break down XL issues into smaller tasks
- Archive completed projects quarterly
- Review and groom Backlog monthly

## Example: Complete Project Setup

Here's a complete example for a website redesign project:

**Project**: Acme Corp Website Redesign
**Identifier**: ACME
**Team**: 1 designer, 2 developers, 1 client lead

**Initial Issues**:
```
ACME-1: Discovery & Requirements Gathering [design][medium] → Backlog
ACME-2: Create wireframes [design][medium] → Backlog
ACME-3: Design homepage mockup [design][large] → Todo
ACME-4: Set up development environment [maintenance][small] → Todo
ACME-5: Build component library [feature][large] → Backlog
```

**Views**:
- "Client Dashboard" - Shows all non-backlog items
- "Design Work" - Filtered to [design] label
- "Development" - Filtered to assigned developers
- "This Week" - Due this week, sorted by priority

**Workflow**:
1. Client creates issue: "Update About page copy"
2. Issue goes to Backlog
3. Design Dream AI analyzes → Posts comment: "SIMPLE task, 2 hours"
4. Project lead reviews → Moves to Todo
5. Developer starts → Moves to In Progress
6. Developer completes → Moves to In Review
7. Client approves → Moves to Done

## Troubleshooting

### Issues Not Moving Through Workflow

**Problem**: Issues stuck in one state

**Solutions**:
- Set up automation rules to remind assignees
- Review SLA dashboard for bottlenecks
- Hold daily standups to discuss blockers
- Use "blocked" label to track impediments

### Too Many Issues in Backlog

**Problem**: Backlog becomes overwhelming

**Solutions**:
- Schedule monthly grooming sessions
- Archive issues >6 months old with no activity
- Use priorities to focus on top items
- Break down epics into smaller issues only when ready

### Client Confusion About Workflow

**Problem**: Client doesn't understand states

**Solutions**:
- Share this documentation
- Add descriptions to workflow states
- Create video walkthrough
- Schedule training session

## Next Steps

1. [Test your project setup](./03-testing-guide.md)
2. Invite your client
3. Create initial issues
4. Monitor SLA compliance

## Resources

- [Linear Projects Guide](https://linear.app/docs/projects)
- [Linear Workflows Documentation](https://linear.app/docs/workflows)
- [Design Dream Dashboard](https://designdream.is/dashboard)
