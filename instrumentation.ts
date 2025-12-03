/**
 * Next.js Instrumentation File
 *
 * Initializes Sentry error tracking for server, client, and edge runtimes.
 * This approach fixes the webpack module loading issues by using Next.js 14's
 * instrumentation hook instead of auto-importing config files.
 *
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side initialization
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime initialization
    await import('./sentry.edge.config');
  }
}

// Client-side initialization happens automatically via sentry.client.config.ts
// when the Sentry Next.js plugin processes the build
