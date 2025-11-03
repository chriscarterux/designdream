## Tech stack

Define your technical stack below. This serves as a reference for all team members and helps maintain consistency across the project.

### Framework & Runtime
- **Application Framework:** Next.js 14+ (App Router)
- **Language/Runtime:** TypeScript, Node.js 18+
- **Package Manager:** pnpm (preferred) or npm

### Frontend
- **JavaScript Framework:** React 18+ (via Next.js)
- **CSS Framework:** Tailwind CSS 3+
- **UI Components:** shadcn/ui
- **Component Library:** shadcnblocks (https://www.shadcnblocks.com/)
- **Styling:** Tailwind + CSS Modules where needed

### Database & Storage
- **Database:** Supabase (PostgreSQL)
- **ORM/Query Builder:** Supabase Client SDK
- **Storage:** Supabase Storage for files and assets
- **Realtime:** Supabase Realtime for live updates
- **Caching:** Next.js built-in caching, Supabase query caching

### Authentication & Authorization
- **Authentication:** Supabase Auth
- **Session Management:** Supabase sessions with Next.js middleware
- **Row Level Security:** Supabase RLS policies

### Testing & Quality
- **Test Framework:** Vitest (unit), Playwright (e2e)
- **Linting/Formatting:** ESLint, Prettier, TypeScript strict mode
- **Type Safety:** TypeScript with strict configuration

### Deployment & Infrastructure
- **Hosting:** Vercel (preferred for Next.js)
- **Database Hosting:** Supabase Cloud
- **CI/CD:** GitHub Actions + Vercel automatic deployments
- **Edge Functions:** Vercel Edge Functions or Supabase Edge Functions

### Third-Party Services
- **Authentication:** Supabase Auth (email, OAuth providers)
- **Email:** Supabase SMTP or dedicated service (SendGrid, Resend)
- **Monitoring:** Vercel Analytics, Sentry for error tracking
- **Analytics:** Vercel Analytics, PostHog, or similar

### AI & Automation (Design Dreams Specific)
- **LLM Integration:** OpenAI API, Anthropic Claude API
- **RAG/Vector Store:** Supabase with pgvector extension
- **Workflow Automation:** Supabase Edge Functions, webhooks
- **AI Features:** Prompt chains, retrieval systems, agent workflows

### Design System
- **Component Library:** shadcn/ui components
- **Component Blocks:** shadcnblocks for rapid prototyping
- **Icons:** lucide-react (compatible with shadcn)
- **Typography:** Inter or similar modern sans-serif
- **Color System:** Tailwind color palette with custom theme extensions

### Development Workflow
- **Version Control:** Git + GitHub
- **Branching Strategy:** Feature branches → PR → Main
- **Code Review:** Required PR reviews before merge
- **Database Migrations:** Supabase migrations via CLI
- **Environment Management:** .env.local for development, Vercel env vars for production
