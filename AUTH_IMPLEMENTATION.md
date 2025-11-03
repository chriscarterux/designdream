# Authentication Implementation

This document describes the authentication flow implementation using Supabase Auth.

## Features

- Email/Password authentication
- Magic link authentication (passwordless)
- Protected route middleware
- Auth context and hooks
- Type-safe authentication
- Loading states and error handling
- Email verification support
- Session management

## Architecture

### Auth Provider (`src/components/providers/auth-provider.tsx`)

The `AuthProvider` component wraps the application and provides authentication state and methods throughout the component tree using React Context.

**State:**
- `user`: Current authenticated user
- `session`: Current session
- `isLoading`: Loading state
- `isAuthenticated`: Authentication status

**Methods:**
- `signIn(email, password)`: Sign in with email/password
- `signUp(email, password, metadata)`: Create new account
- `signInWithMagicLink(email)`: Request magic link
- `signOut()`: Sign out current user
- `refreshSession()`: Refresh current session

### Hooks

#### `useAuth()`
Returns the full authentication context with state and methods.

```tsx
const { user, isAuthenticated, signIn, signOut } = useAuth();
```

#### `useUser()`
Returns just the current user (or null if not authenticated).

```tsx
const user = useUser();
```

#### `useIsAuthenticated()`
Returns boolean authentication status.

```tsx
const isAuthenticated = useIsAuthenticated();
```

#### `useRequireAuth()`
Returns user or throws error if not authenticated. Use in protected components.

```tsx
const user = useRequireAuth(); // Throws if not authenticated
```

### Middleware (`src/middleware.ts`)

The middleware protects routes and handles authentication redirects:

**Protected Routes:**
- `/dashboard`
- `/projects`
- `/settings`
- `/profile`
- `/admin`

**Auth Routes (redirect if authenticated):**
- `/login`
- `/signup`

**Public Routes:**
- `/`
- `/about`
- `/pricing`
- `/contact`
- `/blog`

### Pages

#### Login (`src/app/(auth)/login/page.tsx`)
- Two-factor login method selection (password or magic link)
- Email/password sign in
- Magic link sign in
- Redirect to previous page after login
- Error handling
- Loading states

#### Signup (`src/app/(auth)/signup/page.tsx`)
- Full name, email, password fields
- Password confirmation
- Email verification flow
- Automatic redirect after verification
- Error handling
- Loading states

#### Dashboard (`src/app/dashboard/page.tsx`)
- Protected route example
- User information display
- Sign out functionality
- Loading states

### Auth Callback (`src/app/auth/callback/route.ts`)

Handles authentication callbacks for:
- Email confirmation links
- Magic link authentication
- Password reset confirmations

## Authentication Flows

### Email/Password Flow

1. User enters email and password on `/login`
2. `signIn()` method calls `supabase.auth.signInWithPassword()`
3. If email confirmation is enabled:
   - User receives confirmation email
   - User clicks link in email
   - Redirected to `/auth/callback` with code
   - Code exchanged for session
   - Redirected to dashboard
4. If email confirmation is disabled:
   - Session created immediately
   - User redirected to dashboard

### Magic Link Flow

1. User enters email on `/login` and selects magic link
2. `signInWithMagicLink()` method calls `supabase.auth.signInWithOtp()`
3. User receives magic link email
4. User clicks link in email
5. Redirected to `/auth/callback` with code
6. Code exchanged for session
7. Redirected to dashboard

### Signup Flow

1. User enters details on `/signup`
2. `signUp()` method calls `supabase.auth.signUp()`
3. If email confirmation is enabled:
   - User receives confirmation email
   - Success message shown
   - User clicks link in email
   - Redirected to `/auth/callback`
   - Redirected to dashboard
4. If email confirmation is disabled:
   - Session created immediately
   - User redirected to dashboard

## Protected Routes

The middleware checks authentication status for all routes:

1. Request matches protected route pattern
2. Middleware checks for valid session
3. If no session: redirect to `/login?redirect=/original-path`
4. If session exists: allow access
5. After login: redirect to original path

## Session Management

Sessions are managed automatically by Supabase:

- Sessions stored in HTTP-only cookies
- Automatic token refresh
- Session synchronized across tabs
- Auth state changes trigger context updates

## Error Handling

All auth methods handle errors gracefully:

```tsx
try {
  await signIn(email, password);
} catch (error) {
  // Error is AuthError from Supabase
  console.error(error.message);
}
```

Common errors:
- Invalid credentials
- Email already registered
- Network errors
- Invalid magic link
- Expired session

## Type Safety

All authentication types are properly typed:

```tsx
import { User, Session } from '@supabase/supabase-js';
import { AuthContextValue } from '@/types/auth.types';
```

## Integration with Supabase

This implementation uses placeholder Supabase client utilities:
- `@/lib/supabase/client` - Browser client
- `@/lib/supabase/server` - Server client
- `@/lib/supabase/middleware` - Middleware client

These will be properly implemented in the **P1 Supabase Setup** worktree.

## Environment Variables

Required environment variables (add to `.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing the Implementation

1. Set up Supabase project (P1 worktree)
2. Configure environment variables
3. Start development server: `npm run dev`
4. Visit `/signup` to create account
5. Check email for verification link
6. Visit `/login` to sign in
7. Try magic link authentication
8. Visit `/dashboard` (protected route)
9. Try accessing `/dashboard` while logged out

## Next Steps

After Supabase setup in P1 worktree:
1. Replace placeholder client utilities
2. Configure Supabase Auth settings
3. Customize email templates
4. Add social auth providers (optional)
5. Set up password recovery flow
6. Add profile management pages
