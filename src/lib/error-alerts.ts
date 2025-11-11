/**
 * Error Alert Utilities
 *
 * Provides functions to capture and alert on critical errors
 */

import * as Sentry from '@sentry/nextjs';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

/**
 * Capture an error with Sentry and optionally send email alerts for critical errors
 */
export async function captureError(
  error: Error,
  context?: {
    severity?: ErrorSeverity;
    user?: { id?: string; email?: string; name?: string };
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  const { severity = ErrorSeverity.Medium, user, tags, extra } = context || {};

  // Capture with Sentry
  Sentry.captureException(error, {
    level: mapSeverityToSentryLevel(severity),
    user: user ? {
      id: user.id,
      email: user.email,
      username: user.name,
    } : undefined,
    tags,
    extra,
  });

  // Send email alert for critical errors in production
  if (severity === ErrorSeverity.Critical && process.env.NODE_ENV === 'production') {
    await sendCriticalErrorEmail(error, context);
  }
}

/**
 * Map error severity to Sentry severity level
 */
function mapSeverityToSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
  switch (severity) {
    case ErrorSeverity.Low:
      return 'info';
    case ErrorSeverity.Medium:
      return 'warning';
    case ErrorSeverity.High:
      return 'error';
    case ErrorSeverity.Critical:
      return 'fatal';
    default:
      return 'error';
  }
}

/**
 * Send email alert for critical errors
 */
async function sendCriticalErrorEmail(
  error: Error,
  context?: {
    user?: { id?: string; email?: string; name?: string };
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  if (!resend || !process.env.RESEND_ADMIN_EMAIL) {
    console.error('Resend not configured, skipping critical error email');
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'alerts@designdream.is',
      to: process.env.RESEND_ADMIN_EMAIL,
      subject: `🚨 Critical Error in Design Dreams`,
      html: `
        <h1>Critical Error Alert</h1>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>

        <h2>Error Details</h2>
        <pre>${error.message}</pre>
        <pre>${error.stack}</pre>

        ${context?.user ? `
        <h2>User Context</h2>
        <ul>
          ${context.user.id ? `<li>ID: ${context.user.id}</li>` : ''}
          ${context.user.email ? `<li>Email: ${context.user.email}</li>` : ''}
          ${context.user.name ? `<li>Name: ${context.user.name}</li>` : ''}
        </ul>
        ` : ''}

        ${context?.tags ? `
        <h2>Tags</h2>
        <ul>
          ${Object.entries(context.tags).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
        </ul>
        ` : ''}

        ${context?.extra ? `
        <h2>Additional Context</h2>
        <pre>${JSON.stringify(context.extra, null, 2)}</pre>
        ` : ''}

        <p><a href="https://sentry.io/${process.env.SENTRY_ORG}/${process.env.SENTRY_PROJECT}">View in Sentry Dashboard →</a></p>
      `,
    });
  } catch (emailError) {
    console.error('Failed to send critical error email:', emailError);
    // Capture this error too, but don't send another email to avoid loops
    Sentry.captureException(emailError, {
      level: 'error',
      tags: { error_type: 'email_alert_failure' },
    });
  }
}

/**
 * Capture a message (not an error) with Sentry
 */
export function captureMessage(
  message: string,
  severity: ErrorSeverity = ErrorSeverity.Medium,
  context?: {
    user?: { id?: string; email?: string; name?: string };
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  const { user, tags, extra } = context || {};

  Sentry.captureMessage(message, {
    level: mapSeverityToSentryLevel(severity),
    user: user ? {
      id: user.id,
      email: user.email,
      username: user.name,
    } : undefined,
    tags,
    extra,
  });
}
