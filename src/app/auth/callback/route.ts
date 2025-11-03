import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback handler for email confirmation and magic links
 *
 * This route handles:
 * - Email confirmation links
 * - Magic link authentication
 * - Password reset confirmations
 *
 * After verification, users are redirected to the appropriate page
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // Handle errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, error_description);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error_description || error)}`,
        requestUrl.origin
      )
    );
  }

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Failed to verify authentication')}`,
          requestUrl.origin
        )
      );
    }

    // Successful authentication - redirect to the next page
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code provided - redirect to login
  return NextResponse.redirect(
    new URL('/login?error=No authentication code provided', requestUrl.origin)
  );
}
