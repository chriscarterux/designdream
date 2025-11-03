# Design Dreams - Technical Documentation

> One-person subscription-based agency offering unlimited design and full-stack development

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 🌳 Git Worktree Workflow

This project uses **Git Worktrees** for parallel development on multiple issues.

**Quick Reference:**
```bash
# List all worktrees
./scripts/list-worktrees.sh

# Create new worktree for an issue
./scripts/create-worktree.sh p0-feature-name

# Check status of all worktrees
./scripts/worktree-status.sh

# Clean up merged worktrees
./scripts/cleanup-worktrees.sh
```

**Active Worktrees:**
- `p0-supabase-setup` - Supabase project and database setup
- `p0-auth-flow` - Authentication implementation
- `p0-landing-page` - Landing page with pricing
- `p0-dashboard-layout` - Client dashboard layout
- `p0-kanban-board` - Kanban queue board

**Documentation:**
- [WORKTREE-QUICKSTART.md](./WORKTREE-QUICKSTART.md) - Quick reference
- [WORKTREE-GUIDE.md](./WORKTREE-GUIDE.md) - Comprehensive guide

## 📁 Project Structure

```
designdream/                       # Main working tree (main branch)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── page.tsx              # Homepage
│   ├── components/
│   │   └── ui/                   # shadcn/ui components (add as needed)
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   ├── hooks/                    # Custom React hooks
│   └── types/                    # TypeScript types
├── supabase/
│   └── migrations/               # Database migrations
├── scripts/                      # Worktree helper scripts
│   ├── create-worktree.sh        # Create new worktree
│   ├── list-worktrees.sh         # List all worktrees
│   ├── cleanup-worktrees.sh      # Clean up merged worktrees
│   └── worktree-status.sh        # Check worktree status
├── public/                       # Static assets
└── [config files]

designdream-worktrees/             # Worktree directory (parallel development)
├── p0-supabase-setup/            # Feature branch worktree
├── p0-auth-flow/                 # Feature branch worktree
├── p0-landing-page/              # Feature branch worktree
├── p0-dashboard-layout/          # Feature branch worktree
└── p0-kanban-board/              # Feature branch worktree
```

## 🛠 Tech Stack

- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Email:** Resend
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Drag & Drop:** @dnd-kit (for Kanban)

## 📚 Documentation

All technical documentation is in the Obsidian vault:

```
/Users/howdycarter/Documents/obsidian-vaults/howdycarter/01_PROJECTS/Design Dreams/technical-docs/
```

**Key Documents:**
- `Architecture-Overview.md` - System architecture and design
- `Database-Schema.md` - Complete database schema
- `Implementation-Plan.md` - 5-day MVP roadmap
- `Linear-Issue-Backlog.md` - All 37 P0-P3 issues
- `Project-Setup-Complete.md` - Setup status and next steps

## 🔧 Development Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production server

# Code Quality
npm run lint          # Run ESLint
npm run type-check    # TypeScript validation
npm run format        # Format code with Prettier

# Database (after Supabase setup)
npm run db:start      # Start local Supabase
npm run db:stop       # Stop local Supabase
npm run db:reset      # Reset database and run migrations
npm run db:migrate    # Run migrations
npm run db:types      # Generate TypeScript types from schema

# Worktree Management
./scripts/list-worktrees.sh       # List all worktrees
./scripts/create-worktree.sh      # Create new worktree
./scripts/worktree-status.sh      # Check status
./scripts/cleanup-worktrees.sh    # Clean up merged
```

## 🗄 Database Setup

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Other platforms: https://supabase.com/docs/guides/cli
```

### 2. Initialize Supabase

```bash
supabase init
supabase start
```

### 3. Create Schema

Copy the schema from `technical-docs/Database-Schema.md` to:
```
supabase/migrations/20251102000000_init_schema.sql
```

Then apply:
```bash
npm run db:reset
```

### 4. Generate Types

```bash
npm run db:types
```

## 🎨 Adding UI Components (shadcn/ui)

```bash
# Initialize shadcn/ui (if not done)
npx shadcn-ui@latest init

# Add components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add table

# See all components: https://ui.shadcn.com
```

## 🔐 Environment Variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.local.example` for full template.

## 🚢 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

Or connect GitHub repo to Vercel dashboard for automatic deployments.

## 📦 Dependencies

### Core (production)
- Next.js, React, TypeScript
- Supabase (database + auth)
- Stripe (payments)
- React Hook Form + Zod (forms)
- Tailwind CSS (styling)
- SWR (data fetching)

### Development
- ESLint + Prettier (code quality)
- TypeScript (type checking)
- Supabase CLI (local development)

## 🎯 MVP Features (5-day plan)

### Day 1: Foundation
- [x] Project setup ✅
- [x] Git worktree workflow ✅
- [ ] Supabase configuration
- [ ] Landing page

### Day 2: Auth + Dashboard
- [ ] Authentication flow
- [ ] Client dashboard layout
- [ ] Request submission

### Day 3: Queue Management
- [ ] Kanban board
- [ ] Request detail view
- [ ] Comments

### Day 4: Billing + Admin
- [ ] Stripe integration
- [ ] Admin dashboard
- [ ] SLA tracking

### Day 5: Polish + Deploy
- [ ] Notifications
- [ ] Email templates
- [ ] Production deployment

## 🐛 Troubleshooting

### Dependencies won't install
```bash
npm install --legacy-peer-deps
```

### Port already in use
Next.js will automatically try ports 3001, 3002, etc.

### TypeScript errors
```bash
npm run type-check
```

### Database issues
```bash
supabase stop
supabase start
npm run db:reset
```

### Worktree issues
```bash
# List all worktrees
git worktree list

# Clean up stale references
git worktree prune

# Remove specific worktree
git worktree remove <path>
```

## 📖 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Stripe Docs](https://stripe.com/docs)
- [Git Worktree Docs](https://git-scm.com/docs/git-worktree)

## 🤝 Development Workflow

### Working on a new feature

```bash
# 1. Create worktree for issue
./scripts/create-worktree.sh p0-stripe-integration

# 2. Navigate to worktree
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-stripe-integration

# 3. Install dependencies
npm install --legacy-peer-deps

# 4. Copy environment variables
cp /Users/howdycarter/Documents/projects/designdream/.env.local .env.local

# 5. Start development
npm run dev

# 6. Develop, commit, push
git add .
git commit -m "feat: implement stripe integration"
git push origin feature/p0-stripe-integration

# 7. Create PR and merge

# 8. Clean up (after merge)
cd /Users/howdycarter/Documents/projects/designdream
./scripts/cleanup-worktrees.sh
```

### Working on multiple features simultaneously

```bash
# Terminal 1 - Auth work
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow
npm run dev  # Runs on :3000

# Terminal 2 - Landing page work
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-landing-page
npm run dev  # Runs on :3001

# Terminal 3 - Dashboard work
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-dashboard-layout
npm run dev  # Runs on :3002
```

## 📝 Notes

- Using `--legacy-peer-deps` due to some package conflicts
- Ports 3000-3001 may be in use, app runs on next available port
- Some npm warnings are non-critical and don't block development
- Each worktree can have its own dev server running
- Worktrees share the same .git directory but have independent working copies

## 🔗 Links

- **Repository:** https://github.com/chriscarterux/designdream
- **Documentation:** See Obsidian vault
- **PRD:** `01_PROJECTS/Design Dreams/Design Dreams- One-Person Unlimited Design & Development Agency (PRD).md`
- **Linear Issues:** `technical-docs/Linear-Issue-Backlog.md`

---

**Status:** ✅ Setup Complete - Worktree Workflow Active - Ready for Parallel Development

*Last Updated: 2025-11-03*
