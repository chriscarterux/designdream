import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createHmac } from 'crypto';

/**
 * Generate unsubscribe token for a user
 */
export function generateUnsubscribeToken(userId: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'default-secret-change-in-production';
  const hmac = createHmac('sha256', secret);
  hmac.update(userId);
  return `${userId}.${hmac.digest('hex')}`;
}

/**
 * Verify unsubscribe token
 */
function verifyUnsubscribeToken(token: string): string | null {
  try {
    const [userId, signature] = token.split('.');
    if (!userId || !signature) return null;

    const secret = process.env.UNSUBSCRIBE_SECRET || 'default-secret-change-in-production';
    const hmac = createHmac('sha256', secret);
    hmac.update(userId);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) return null;
    return userId;
  } catch {
    return null;
  }
}

/**
 * Unsubscribe handler - GET request with token in query params
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const type = searchParams.get('type'); // Optional: specific notification type

    if (!token) {
      return NextResponse.json(
        { error: 'Missing unsubscribe token' },
        { status: 400 }
      );
    }

    // Verify token
    const userId = verifyUnsubscribeToken(token);
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired unsubscribe token' },
        { status: 400 }
      );
    }

    // Update email preferences
    const updates: any = { updated_at: new Date().toISOString() };

    if (type === 'all') {
      // Unsubscribe from all emails
      updates.email_enabled = false;
    } else if (type === 'sla_warnings') {
      updates.sla_warnings = false;
    } else if (type === 'status_updates') {
      updates.status_updates = false;
    } else if (type === 'comments') {
      updates.comments = false;
    } else {
      // Default: unsubscribe from all
      updates.email_enabled = false;
    }

    // Upsert preferences (create if doesn't exist)
    const { error } = await supabaseAdmin
      .from('email_preferences')
      .upsert({
        user_id: userId,
        ...updates,
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('Failed to update email preferences:', error);
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    // Return success HTML page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Unsubscribed - DesignDream</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background-color: #f6f9fc;
              margin: 0;
              padding: 40px 20px;
              text-align: center;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #1a1a1a;
              font-size: 24px;
              margin: 0 0 16px;
            }
            p {
              color: #4b5563;
              line-height: 1.6;
              margin: 0 0 24px;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 24px;
            }
            a {
              color: #4f46e5;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            .button {
              display: inline-block;
              background: #4f46e5;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              margin-top: 16px;
            }
            .button:hover {
              background: #4338ca;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>You've been unsubscribed</h1>
            <p>
              You will no longer receive ${type === 'all' ? 'email notifications' : `${type} notifications`} from DesignDream.
            </p>
            <p>
              You can manage your email preferences anytime from your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/settings">account settings</a>.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">Return to Dashboard</a>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in unsubscribe handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
