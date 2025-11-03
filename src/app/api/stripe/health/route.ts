import { NextResponse } from 'next/server';
import { checkStripeHealth, pingStripeAPI, validateWebhookSecret } from '@/lib/stripe-health';

/**
 * GET /api/stripe/health
 *
 * Returns the health status of Stripe integration
 * Useful for monitoring and debugging
 */
export async function GET() {
  try {
    const healthCheck = await checkStripeHealth();
    const webhookValidation = validateWebhookSecret();

    return NextResponse.json(
      {
        ...healthCheck,
        webhook: {
          configured: webhookValidation.valid,
          error: webhookValidation.error,
        },
      },
      {
        status: healthCheck.status === 'healthy' ? 200 : 503,
      }
    );
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

/**
 * HEAD /api/stripe/health
 *
 * Lightweight health check - just pings Stripe API
 */
export async function HEAD() {
  const isHealthy = await pingStripeAPI();

  return new NextResponse(null, {
    status: isHealthy ? 200 : 503,
  });
}
