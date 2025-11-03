import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // TODO: Implement proper authentication check
    // For now, this is a placeholder that always allows access
    // In a real implementation, you would:
    // 1. Check for a valid session cookie/token
    // 2. Verify the user has admin role
    // 3. Redirect to login if not authenticated

    // Example of what proper auth would look like:
    // const session = await getSession(request);
    // if (!session || !session.user) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
    // if (session.user.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url));
    // }

    // For development, we'll just log the access
    console.log('Admin route accessed:', pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
