import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIP, formatRetryAfter } from '@/lib/rate-limit';

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
 * Routes that require rate limiting
 */
const rateLimitedRoutes = ['/login', '/signup', '/forgot-password'];

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

/**
 * Apply rate limiting headers to response
 */
function applyRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  reset: number
): NextResponse {
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to auth routes
  if (matchesRoute(pathname, rateLimitedRoutes)) {
    const ip = getClientIP(request);
    const identifier = `${ip}:${pathname}`;

    try {
      const result = await rateLimit(identifier);

      if (result.isRateLimited) {
        // Create rate limit error response
        const response = new NextResponse(
          JSON.stringify({
            error: 'Too many attempts',
            message: `You have exceeded the maximum number of attempts. Please try again in ${formatRetryAfter(result.retryAfter || 0)}.`,
            retryAfter: result.retryAfter,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': (result.retryAfter || 0).toString(),
            },
          }
        );

        return applyRateLimitHeaders(
          response,
          result.limit,
          result.remaining,
          result.reset
        );
      }

      // Continue with normal flow but add rate limit headers
      const { response: sessionResponse } = await updateSession(request);
      const updatedResponse = applyRateLimitHeaders(
        NextResponse.next({ request: { headers: sessionResponse.headers } }),
        result.limit,
        result.remaining,
        result.reset
      );

      // Copy cookies from updateSession response
      sessionResponse.cookies.getAll().forEach((cookie) => {
        updatedResponse.cookies.set(cookie);
      });

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
        const redirectResponse = NextResponse.redirect(redirectUrl);

        // Copy rate limit headers to redirect response
        updatedResponse.headers.forEach((value, key) => {
          if (key.startsWith('x-ratelimit')) {
            redirectResponse.headers.set(key, value);
          }
        });

        // Copy cookies
        sessionResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie);
        });

        return redirectResponse;
      }

      // Handle auth routes (redirect to dashboard if already logged in)
      if (matchesRoute(pathname, authRoutes) && isAuthenticated) {
        const redirect = request.nextUrl.searchParams.get('redirect');
        const redirectUrl = new URL(redirect || '/dashboard', request.url);
        const redirectResponse = NextResponse.redirect(redirectUrl);

        // Copy rate limit headers to redirect response
        updatedResponse.headers.forEach((value, key) => {
          if (key.startsWith('x-ratelimit')) {
            redirectResponse.headers.set(key, value);
          }
        });

        // Copy cookies
        sessionResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie);
        });

        return redirectResponse;
      }

      return updatedResponse;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Continue with normal flow if rate limiting fails
    }
  }

  // Update session and get the response for non-rate-limited routes
  const { response } = await updateSession(request);

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
