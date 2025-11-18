# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

DesignDream is a one-person subscription-based agency platform offering unlimited design and full-stack development services. Built with Next.js 14 (App Router), Supabase, Stripe, and TypeScript.

## Essential Commands

### Development
```bash
# Install dependencies (required flag due to peer dependency conflicts)
npm install --legacy-peer-deps

# Start dev server (auto-finds available port starting at 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Run linter
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

### Testing
```bash
# Unit tests (Jest)
npm run test
npm run test:watch
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:ui

# Run all tests
npm run test:all
```

**Coverage Requirements:** Minimum 70% coverage for branches, functions, lines, and statements.

### Database (Supabase)
```bash
# Start local Supabase instance
npm run db:start

# Stop local instance
npm run db:stop

# Reset database and run all migrations
npm run db:reset

# Run pending migrations
npm run db:migrate

# Generate TypeScript types from schema
npm run db:types
```

**Important:** After modifying database schema, always run `npm run db:types` to update `src/types/database.types.ts`.

### Email Development
```bash
# Preview emails locally (runs on port 3001)
npm run email:dev
```

## Architecture Overview

### Tech Stack
- **Framework:** Next.js 14.2 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** Stripe (subscriptions + webhooks)
- **Email:** Resend with React Email
- **Forms:** React Hook Form + Zod validation
- **Testing:** Jest (unit) + Playwright (E2E)
- **Monitoring:** Sentry
- **Rate Limiting:** Upstash Redis

### Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group (login, signup)
│   ├── dashboard/           # Protected client dashboard
│   ├── admin/               # Admin-only routes
│   ├── api/                 # API routes
│   │   ├── webhooks/        # Webhook handlers (Stripe, internal)
│   │   ├── stripe/          # Stripe operations
│   │   ├── uploads/         # File upload endpoints
│   │   └── billing/         # Billing operations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Auth forms and components
│   ├── kanban/              # Kanban board (@dnd-kit)
│   ├── uploads/             # File upload components
│   ├── billing/             # Stripe/billing UI
│   └── providers/           # React context providers
├── lib/
│   ├── supabase/            # Supabase client utilities
│   │   ├── client.ts        # Browser client (Client Components)
│   │   ├── server.ts        # Server client (Server Components/Actions)
│   │   └── middleware.ts    # Session refresh middleware
│   ├── email/               # Email utilities and templates
│   ├── storage/             # File storage utilities
│   ├── rate-limit.ts        # Rate limiting logic
│   ├── sla.ts               # SLA tracking
│   └── linear.ts            # Linear integration
├── hooks/                   # Custom React hooks
└── types/
    ├── database.types.ts    # Generated from Supabase schema
    └── upload.types.ts      # File upload types
```

### Key Architectural Patterns

#### 1. Supabase Client Usage
- **Client Components:** Use `createClient()` from `@/lib/supabase/client`
- **Server Components:** Use `await createClient()` from `@/lib/supabase/server`
- **Server Actions:** Use `await createClient()` from `@/lib/supabase/server`
- **Admin Operations:** Use `createAdminClient()` (bypasses RLS - use with caution)
- **Never** expose the service role key to the client

#### 2. Authentication Flow
- Auth provider wraps the app at root layout
- Middleware (`src/middleware.ts`) handles:
  - Session refresh on every request
  - Protected route redirects
  - Rate limiting for auth endpoints
  - Auth route redirects (if already logged in)
- Protected routes: `/dashboard`, `/projects`, `/settings`, `/profile`, `/admin`
- Auth routes: `/login`, `/signup`

#### 3. Route Protection
The middleware automatically:
1. Refreshes Supabase session
2. Applies rate limiting to `/login`, `/signup`, `/forgot-password`
3. Redirects unauthenticated users from protected routes to `/login?redirect={path}`
4. Redirects authenticated users from auth pages to `/dashboard`

#### 4. Database Migrations
- Migrations stored in `supabase/migrations/`
- Naming convention: `YYYYMMDDHHMMSS_description.sql`
- Key migrations include:
  - Initial schema with users, clients, requests, subscriptions
  - Row Level Security (RLS) policies
  - Performance indexes
  - Stripe webhook logging
  - File attachments and storage buckets
  - SLA tracking enhancements

#### 5. File Uploads
- Uses Supabase Storage buckets
- Components in `src/components/uploads/`
- API routes in `src/app/api/uploads/`
- Supports: Images, PDFs, design files, archives, videos (max 50MB)
- Features: drag-drop, progress tracking, validation, thumbnails
- See `FILE_UPLOADS.md` for full documentation

#### 6. Stripe Integration
- Webhook handler at `src/app/api/webhooks/stripe/route.ts`
- Subscription management in `src/app/api/billing/`
- Health check system to validate Stripe configuration on startup
- Events handled: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- See `STRIPE_INTEGRATION.md` for setup details

#### 7. Rate Limiting
- Powered by Upstash Redis
- Applied to auth endpoints via middleware
- Returns 429 status with `Retry-After` header when exceeded
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Development Workflow

### Git Worktree System
This project uses **Git Worktrees** for parallel development:

```bash
# List worktrees
./scripts/list-worktrees.sh

# Create new worktree for feature
./scripts/create-worktree.sh feature-name

# Check status of all worktrees
./scripts/worktree-status.sh

# Clean up merged worktrees
./scripts/cleanup-worktrees.sh
```

Worktrees are created in `../designdream-worktrees/` directory.

### Structured Task Management
The project uses a slash command system for structured development:

- `/create-project-prd` - Create product roadmap
- `/create-feature-issue` - Create feature specification with acceptance criteria
- `/generate-tasks` - Break down features into tasks
- `/process-tasks` - Execute tasks with validation gates

Feature issues are stored in `tasks/` directory with evidence collection for acceptance criteria. See `README.md` for full workflow.

### Environment Variables
Copy `.env.local.example` to `.env.local` and configure:
- Supabase URL and keys
- Stripe keys and webhook secret
- Resend API key and email addresses
- Internal webhook secret
- Basecamp integration (optional)
- Anthropic API key (for webhook analysis)

**Never commit `.env.local` or expose service role keys.**

## Testing Strategy

### Unit Tests (Jest)
- Located in `src/__tests__/` or co-located with source files
- Use `@testing-library/react` for component tests
- Mock Supabase clients and external services
- Run before commits

### E2E Tests (Playwright)
- Located in `__tests__/e2e/`
- Test critical user flows (auth, subscriptions, requests)
- Run on multiple browsers (Chromium, Firefox, WebKit)
- Auto-start dev server on port 3000

### Test Files
- Unit tests: `*.test.ts` or `*.test.tsx`
- E2E tests: `__tests__/e2e/*.test.ts`
- Setup: `jest.setup.js` for global test configuration

## Important Conventions

### TypeScript
- Strict mode enabled
- Path alias: `@/*` maps to `src/*`
- Always type API responses and database queries
- Generate types after schema changes: `npm run db:types`

### Styling
- Use Tailwind CSS utility classes
- Use shadcn/ui components from `src/components/ui/`
- Add new shadcn components: `npx shadcn-ui@latest add <component>`
- Custom styles in `src/app/globals.css`

### API Routes
- Use Next.js Route Handlers (not Pages API)
- Always validate request bodies with Zod
- Return proper HTTP status codes
- Handle errors gracefully with try/catch
- Apply rate limiting where appropriate

### Forms
- Use React Hook Form + Zod for validation
- Define schemas in the component or shared schema file
- Handle loading and error states
- Provide clear error messages

### Security
- All database tables use Row Level Security (RLS)
- Validate all user input
- Use prepared statements (Supabase does this automatically)
- Never expose service role key to client
- Verify webhook signatures (Stripe webhooks)
- Apply rate limiting to sensitive endpoints

## Common Tasks

### Adding a New shadcn/ui Component
```bash
npx shadcn-ui@latest add button
# Component added to src/components/ui/button.tsx
```

### Creating a New Database Migration
```bash
# Create migration file
supabase migration new migration_name

# Edit the file in supabase/migrations/
# Apply migration
npm run db:reset

# Generate updated types
npm run db:types
```

### Setting Up Stripe Webhooks (Local Development)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Debugging Authentication Issues
1. Check Supabase session: `supabase.auth.getSession()`
2. Verify middleware is running: Check Network tab for redirects
3. Check cookie presence: Look for `sb-*` cookies
4. Review middleware logs in terminal

### Running Single Test File
```bash
# Jest
npm run test -- path/to/test.test.ts

# Playwright
npm run test:e2e -- tests/filename.test.ts
```

## Known Issues & Workarounds

### NPM Install Requires `--legacy-peer-deps`
Some packages have peer dependency conflicts. Always use:
```bash
npm install --legacy-peer-deps
```

### Port Already in Use
Next.js auto-increments port (3000 → 3001 → 3002...). Check console for actual port.

### Supabase Types Not Updating
After schema changes:
```bash
npm run db:reset  # Apply migrations
npm run db:types  # Regenerate types
```

### Multiple Worktrees Running Dev Servers
Each worktree can run its own dev server on a different port. The first will use 3000, second 3001, etc.

## Documentation Reference

For detailed information, see:
- `README.md` - Workflow and slash commands
- `TECHNICAL-README.md` - Setup and tech stack
- `AUTH_IMPLEMENTATION.md` - Authentication details
- `FILE_UPLOADS.md` - File upload system
- `STRIPE_INTEGRATION.md` - Stripe setup and webhooks
- `DEPLOYMENT.md` - Production deployment
- `src/lib/supabase/README.md` - Supabase client usage

## External Integrations

### Linear
- SDK: `@linear/sdk`
- Used for project management sync
- Configuration in `src/lib/linear.ts`

### Basecamp
- OAuth integration for client collaboration
- Project creation and file sharing
- Configuration via environment variables

### Sentry
- Error monitoring and alerting
- Configured in `sentry.*.config.ts`
- Source maps uploaded in production builds

## Development Tips

1. **Always use the correct Supabase client** - Client vs Server vs Admin contexts matter for auth and RLS
2. **Run tests after changes** - Especially for auth, billing, and critical flows
3. **Check TypeScript errors** - Run `npm run type-check` before committing
4. **Use the worktree system** - Enables parallel feature development without branch switching
5. **Collect evidence for features** - Follow the structured task workflow for quality assurance
6. **Never skip migrations** - Always create migration files for schema changes
7. **Rate limits apply in development** - Clear Redis or use different IPs when testing auth flows repeatedly
