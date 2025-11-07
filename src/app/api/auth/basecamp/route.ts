/**
 * Basecamp OAuth 2.0 Authorization Flow - Step 1: Initiate Authorization
 *
 * This endpoint redirects the user to Basecamp's authorization page.
 * After the user authorizes, Basecamp redirects back to /api/auth/basecamp/callback
 *
 * Usage: Visit https://designdream.is/api/auth/basecamp to start OAuth flow
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.BASECAMP_CLIENT_ID;
  const redirectUri = process.env.BASECAMP_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error: 'OAuth configuration missing',
        message: 'BASECAMP_CLIENT_ID and BASECAMP_REDIRECT_URI must be set in environment variables'
      },
      { status: 500 }
    );
  }

  // Construct the Basecamp authorization URL
  const authorizationUrl = new URL('https://launchpad.37signals.com/authorization/new');
  authorizationUrl.searchParams.set('type', 'web_server');
  authorizationUrl.searchParams.set('client_id', clientId);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);

  console.log('Redirecting to Basecamp OAuth:', authorizationUrl.toString());

  // Redirect the user to Basecamp's authorization page
  return NextResponse.redirect(authorizationUrl.toString());
}
