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

## 📁 Project Structure

```
designdream/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   └── page.tsx          # Homepage
│   ├── components/
│   │   └── ui/               # shadcn/ui components (add as needed)
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript types
├── supabase/
│   └── migrations/           # Database migrations
├── public/                   # Static assets
└── [config files]
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

## 📖 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Stripe Docs](https://stripe.com/docs)

## 🤝 Contributing

This is a solo project, but following best practices:

1. Create feature branches
2. Write tests (when ready)
3. Keep commits atomic
4. Document as you go

## 📝 Notes

- Using `--legacy-peer-deps` due to some package conflicts
- Ports 3000-3001 may be in use, app runs on next available port
- Some npm warnings are non-critical and don't block development

## 🔗 Links

- **Repository:** https://github.com/chriscarterux/designdream
- **Documentation:** See Obsidian vault
- **PRD:** `01_PROJECTS/Design Dreams/Design Dreams- One-Person Unlimited Design & Development Agency (PRD).md`

---

**Status:** ✅ Setup Complete - Ready for MVP Development

*Last Updated: 2025-11-02*
