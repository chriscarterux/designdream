# Basecamp Project Template Structure

Complete specification for creating reusable client project templates in Basecamp.

## Template Overview

**Purpose**: Standardize client onboarding and project management
**Time to Create**: 20-30 minutes (one-time setup)
**Usage**: Duplicate for each new client

## Project Naming Convention

```
[Client Company Name] - Design Dreams
```

**Examples**:
- Acme Startup - Design Dreams
- TechCorp Inc - Design Dreams
- Sarah's Bakery - Design Dreams

## To-Do List Structure

Create exactly 5 to-do lists in this order:

### 1. 📥 Request Backlog

**Description to add**:
```
Add all your design and development requests here. We work through them one at a time in order of priority. Feel free to add as many as you need - your queue is unlimited!

💡 Use the Request Template (pinned above) to ensure your requests have all the details I need to deliver great work quickly.
```

**Permissions**:
- Client can add to-dos: ✅ YES
- Client can comment: ✅ YES
- Client can complete: ❌ NO (only you mark as complete)

**Initial To-Dos** (add these as placeholders):
- ✏️ Example: Design new homepage hero section
- ✏️ Example: Fix mobile navigation bug
- ✏️ Example: Create email template for newsletter

### 2. ⏭️ Up Next

**Description to add**:
```
The next 1-3 tasks in your queue. These are prioritized and will be worked on soon.

I review this list daily and move items to "In Progress" based on your priorities and my availability.
```

**Purpose**: Gives client visibility into what's coming next

**Initial State**: Empty (tasks move here from Backlog)

### 3. 🔨 In Progress

**Description to add**:
```
Currently being worked on. One task at a time to ensure quality and speed.

You'll see daily updates here as I make progress. Feel free to ask questions or provide feedback anytime!

⏱️ SLA: 48 business hours from start to completion
```

**Purpose**: Active work visibility

**Initial State**: Empty (one task at a time moves here)

### 4. 👀 Review

**Description to add**:
```
Completed tasks ready for your review!

Please review within 24-48 hours if possible. You get 2 rounds of revisions per task if needed.

✅ Approve and I'll move it to Done
🔄 Request changes and I'll move it back to In Progress
```

**Purpose**: Client QA and approval gate

**Initial State**: Empty (completed work moves here)

### 5. ✅ Done

**Description to add**:
```
Approved and shipped! 🎉

All your completed and approved work lives here. Feel free to reference past deliveries anytime.
```

**Purpose**: Archive of completed work

**Initial State**: Empty (builds up over time)

## Pinned Documents

Create these documents and pin them to the top of the project:

### Document 1: "📝 Request Template - Please Use This!"

Content:
```markdown
# Design Dreams Request Template

Please copy/paste this template when adding new requests to your backlog. The more details you provide, the faster and better the result!

---

## Request Title
[Brief, descriptive title]

## What You Need
[Describe what you're looking for]

Example: "I need a new landing page hero section that highlights our AI-powered features and includes a strong CTA to start a free trial."

## Context & Background
- What problem does this solve?
- Who is the audience?
- What's the use case or user story?

## Design Preferences (if applicable)
- Style direction: [modern, minimal, bold, playful, professional, etc.]
- Colors: [specific colors or "use brand colors"]
- Inspiration: [links to examples you like]

## Technical Requirements (if applicable)
- Platform: [web, mobile, email, etc.]
- Framework: [React, Vue, plain HTML, etc.]
- Responsive? [yes/no]
- Integrations needed: [Stripe, APIs, etc.]

## Assets & References
- Brand guidelines: [link or upload]
- Logo files: [upload]
- Content/copy: [paste or upload]
- Examples you like: [links]
- Examples you DON'T like: [links]

## Priority
- 🔴 High: Need this ASAP (please explain why)
- 🟡 Medium: Important but not urgent
- 🟢 Low: Nice to have, no rush

## Success Criteria
How will you know this is done well?

Example: "Users can clearly see our key features, the CTA button stands out, and the page loads in under 2 seconds on mobile."

## Questions or Notes
[Anything else I should know?]

---

✨ **Pro Tips**:
- Be specific! "Make the button bigger" → "Increase CTA button to 16px font, 48px height"
- Share examples! Links to designs or sites you like help a ton
- Don't worry about formatting! Just get your thoughts down
- Questions? Just ask in the comments below!
```

### Document 2: "🎉 Welcome to Design Dreams!"

Content:
```markdown
# Welcome to Design Dreams! 🎉

Thanks for subscribing! I'm excited to be your dedicated design and development partner.

## How This Works

### 1. Add Requests to Your Backlog
Use the "📥 Request Backlog" list to add all your design and development needs. No limit - add as many as you want!

### 2. I'll Prioritize & Start Work
I review your backlog daily and move the next priority item to "🔨 In Progress". One task at a time ensures quality and speed.

### 3. Daily Updates
You'll see progress updates in Basecamp as I work. Feel free to comment with questions or feedback anytime!

### 4. Review & Approve
When done, I move tasks to "👀 Review" for your approval. You get 2 rounds of revisions if needed.

### 5. Shipped!
Once approved, it moves to "✅ Done" and you're ready to use it!

## SLA & Expectations

- **Turnaround**: 48 business hours per task
- **Working Hours**: Monday-Friday, 9am-5pm Central Time
- **Response Time**: I respond to messages within 2-4 hours during business hours
- **Updates**: Daily progress reports for active tasks

## Communication

- **Best way to reach me**: Right here in Basecamp!
- **Urgent requests**: Mark priority as HIGH and add a note
- **Questions**: Comment on any task or send me a message
- **Email**: hello@designdream.is (but Basecamp is faster!)

## What's Included

✅ Unlimited requests (one active at a time)
✅ Design: UI/UX, graphics, branding, presentations
✅ Development: Web apps, websites, features, bug fixes
✅ Revisions: 2 rounds per task
✅ Daily updates and communication

## What's NOT Included

❌ Ongoing server maintenance
❌ Video production/editing
❌ Content writing (I design, you provide copy)
❌ Phone calls (async-first to maximize productivity!)

## Getting Started

 1. **Add your first request** using the Request Template
 2. **Share any brand assets** (logos, colors, fonts)
 3. **Set priorities** so I know what matters most
 4. **Check back daily** for updates!

Questions? Just ask! Let's build something great together. 🚀
```

### Document 3: "📋 Service Agreement" (Optional)

Upload your contract/terms of service PDF here, or link to it:
```
See full terms: https://designdream.is/terms
```

## Message Board Setup

### Welcome Message

Post this as your first message in the project:

**Title**: "🎉 Welcome [Client Name]! Let's Get Started"

**Content**:
```
Hi [Client Name]!

Welcome to Design Dreams! I'm thrilled to be your dedicated design and development partner.

I've set up this Basecamp project as your central hub for all requests, updates, and deliveries. Here's what's inside:

📥 **Request Backlog**: Add all your requests here
⏭️ **Up Next**: See what's coming soon
🔨 **In Progress**: Watch real-time progress
👀 **Review**: Approve completed work
✅ **Done**: Your archive of shipped work

**To get started**:
1. Review the "Welcome to Design Dreams" document (pinned above)
2. Check out the "Request Template" for submitting tasks
3. Add your first request to the Backlog!

I'll start working on your first task within 24 hours of receiving it. You'll get daily updates right here in Basecamp.

Questions? Just comment below or message me anytime!

Let's build something great! 🚀

– Chris
```

## Permissions & Access

### Client Access Settings

In Basecamp project settings:

**Can See**:
- ✅ To-do lists
- ✅ Pinned documents
- ✅ Message board
- ✅ Files & uploads

**Can Do**:
- ✅ Add to-dos to Backlog
- ✅ Comment on to-dos
- ✅ Upload files
- ✅ Post messages
- ❌ Edit to-do list structure
- ❌ Delete to-dos (only you can)
- ❌ See other client projects

## Template Creation Steps

### In Basecamp:

1. **Create New Project**
   - Click "New Project"
   - Name: "Design Dreams - Client Template"
   - Description: "Master template for client projects"

2. **Set Up To-Do Lists**
   - Add 5 lists (in order above)
   - Add descriptions to each
   - Add example placeholders to Backlog

3. **Create Pinned Documents**
   - Add "Request Template" doc
   - Add "Welcome to Design Dreams" doc
   - Pin both to top
   - Mark as "Important"

4. **Post Welcome Message**
   - Go to Message Board
   - Post welcome message template
   - Pin it

5. **Configure Permissions**
   - Set client access level
   - Enable/disable features

6. **Save as Template**
   - Basecamp automatically treats this as reusable
   - You'll duplicate it for each new client

## Using the Template

When a new client subscribes:

1. **Duplicate the template project**
   - Settings → Duplicate this project
2. **Rename it**
   - Replace "Client Template" with "[Client Name] - Design Dreams"
3. **Customize welcome message**
   - Replace [Client Name] with their actual name
4. **Invite client**
   - Add their email address
   - Set access level to "Client"
5. **Register webhook** (for automation)
   - See HOW-203 for webhook registration

## Maintenance

**Monthly Review**:
- Update template if you find better wording
- Add FAQ items based on common client questions
- Keep documents current with your evolving process

**Version Control**:
- Keep ONE master template
- Name it clearly: "Design Dreams - Client Template [DO NOT DELETE]"
- Lock it so you don't accidentally invite a real client to it

## Next Steps

- ✅ Test the template with a dummy project
- ✅ Create request template (see 03-request-template.md)
- ✅ Invite test user and run through workflow
- ✅ Make tweaks based on testing
- ✅ Ready to onboard first real client!

---

**Need inspiration?** Check out these examples:
- [Designjoy Basecamp structure](https://designjoy.co/workflow)
- [ManyPixels client portal](https://manypixels.co)

---

Template creation checklist:

- [ ] Project created
- [ ] 5 to-do lists added with descriptions
- [ ] Example placeholders in Backlog
- [ ] Request Template document created and pinned
- [ ] Welcome document created and pinned
- [ ] Welcome message posted
- [ ] Permissions configured
- [ ] Template saved
- [ ] Ready to duplicate for clients

Estimated time: 30 minutes

---

Questions? hello@designdream.is
