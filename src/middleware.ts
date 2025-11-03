import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a simplified middleware for demonstration
// In production, integrate with your actual auth provider (Supabase, NextAuth, etc.)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Check for authentication cookie/token
    const authToken = request.cookies.get('auth-token');

    // If no auth token, redirect to login
    // For this demo, we'll allow access but in production this should redirect
    if (!authToken && process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
