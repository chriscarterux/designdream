/**
 * Basecamp OAuth 2.0 Authorization Flow - Step 2: Handle Callback
 *
 * After the user authorizes on Basecamp, they are redirected here with an authorization code.
 * This endpoint exchanges the code for an access token and refresh token.
 *
 * The access token should be stored securely (in database or environment variables)
 * and used for all subsequent Basecamp API requests.
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface BasecampTokenResponse {
  access_token: string;
  token_type: string;
  expires_at: number; // Unix timestamp
  refresh_token?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle authorization denial
  if (error) {
    console.error('Basecamp OAuth error:', error);
    return NextResponse.json(
      {
        error: 'Authorization denied',
        message: `User denied authorization: ${error}`
      },
      { status: 400 }
    );
  }

  // Validate authorization code
  if (!code) {
    return NextResponse.json(
      {
        error: 'Missing authorization code',
        message: 'No authorization code received from Basecamp'
      },
      { status: 400 }
    );
  }

  const clientId = process.env.BASECAMP_CLIENT_ID;
  const clientSecret = process.env.BASECAMP_CLIENT_SECRET;
  const redirectUri = process.env.BASECAMP_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        error: 'OAuth configuration missing',
        message: 'BASECAMP_CLIENT_ID, BASECAMP_CLIENT_SECRET, and BASECAMP_REDIRECT_URI must be set'
      },
      { status: 500 }
    );
  }

  try {
    // Exchange authorization code for access token
    console.log('Exchanging authorization code for access token...');

    // Create form-encoded body (OAuth 2.0 spec requires form encoding)
    const params = new URLSearchParams({
      type: 'web_server',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
    });

    const tokenResponse = await axios.post<BasecampTokenResponse>(
      'https://launchpad.37signals.com/authorization/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const { access_token, expires_at, refresh_token } = tokenResponse.data;

    console.log('✅ Successfully obtained Basecamp access token');
    console.log('Token expires at:', new Date(expires_at * 1000).toISOString());

    // In production, you would store this token securely in a database
    // For now, we'll display it so you can add it to .env.local

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Basecamp OAuth Success</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #22c55e;
              margin-top: 0;
            }
            code {
              background: #f3f4f6;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Monaco', 'Courier New', monospace;
              font-size: 14px;
            }
            .token-box {
              background: #1f2937;
              color: #10b981;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              font-family: 'Monaco', 'Courier New', monospace;
              font-size: 13px;
              overflow-wrap: break-word;
              word-break: break-all;
            }
            .warning {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 15px 0;
            }
            .success {
              background: #d1fae5;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 15px 0;
            }
            button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              margin-top: 10px;
            }
            button:hover {
              background: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Basecamp Authorization Successful!</h1>

            <div class="success">
              <strong>Access token obtained successfully</strong><br>
              Expires: ${new Date(expires_at * 1000).toLocaleString()}
            </div>

            <h2>Next Steps:</h2>
            <ol>
              <li>Copy the access token below</li>
              <li>Add it to your <code>.env.local</code> file</li>
              <li>Replace <code>BASECAMP_ACCESS_TOKEN=your_basecamp_oauth_token_here</code></li>
              <li>Restart your development server</li>
            </ol>

            <h3>Access Token:</h3>
            <div class="token-box" id="accessToken">${access_token}</div>
            <button onclick="copyToken('accessToken')">📋 Copy Access Token</button>

            ${refresh_token ? `
              <h3>Refresh Token:</h3>
              <div class="token-box" id="refreshToken">${refresh_token}</div>
              <button onclick="copyToken('refreshToken')">📋 Copy Refresh Token</button>
              <p><em>Save the refresh token to get a new access token when this one expires.</em></p>
            ` : ''}

            <div class="warning">
              <strong>⚠️ Security Warning:</strong><br>
              Keep these tokens secret! Never commit them to version control.
              Store them only in <code>.env.local</code> which is git-ignored.
            </div>

            <h3>Update .env.local:</h3>
            <div class="token-box">
BASECAMP_ACCESS_TOKEN=${access_token}${refresh_token ? `\nBASECAMP_REFRESH_TOKEN=${refresh_token}` : ''}
            </div>

            <p>After updating your environment variables, your Basecamp webhook should be fully authenticated!</p>
          </div>

          <script>
            function copyToken(elementId) {
              const element = document.getElementById(elementId);
              const text = element.textContent;
              navigator.clipboard.writeText(text).then(() => {
                alert('✅ Token copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Failed to exchange authorization code:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'Token exchange failed',
          message: error.response?.data || error.message,
          status: error.response?.status,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Token exchange failed',
        message: String(error),
      },
      { status: 500 }
    );
  }
}
