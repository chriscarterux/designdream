import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createClient } from '@/lib/supabase/server';

/**
 * Protected routes that require authentication
 */
const protectedRoutes = [
  '/dashboard',
  '/projects',
  '/settings',
  '/profile',
  '/admin',
];

/**
 * Auth routes that should redirect to dashboard if already authenticated
 */
const authRoutes = ['/login', '/signup'];

/**
 * Public routes that don't require authentication
 */
const publicRoutes = ['/', '/about', '/pricing', '/contact', '/blog'];

/**
 * Check if a path matches any of the given route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update session and get the response
  const response = await updateSession(request);

  // Check authentication status
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Handle protected routes
  if (matchesRoute(pathname, protectedRoutes) && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle auth routes (redirect to dashboard if already logged in)
  if (matchesRoute(pathname, authRoutes) && isAuthenticated) {
    const redirect = request.nextUrl.searchParams.get('redirect');
    const redirectUrl = new URL(redirect || '/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api routes that handle their own auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
