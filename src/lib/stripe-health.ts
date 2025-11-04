import { stripe } from './stripe';
import Stripe from 'stripe';

/**
 * Health check result interface
 */
export interface StripeHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    apiConnection: boolean;
    accountAccess: boolean;
    webhookConfigured: boolean;
  };
  details: {
    accountId?: string;
    accountName?: string;
    isLiveMode?: boolean;
    webhookEndpoints?: number;
    errors?: string[];
  };
  timestamp: string;
}

/**
 * Performs a comprehensive health check of Stripe integration
 * This should be called on application startup to verify Stripe is properly configured
 *
 * @returns Health check results with connection status and configuration details
 */
export async function checkStripeHealth(): Promise<StripeHealthCheck> {
  const errors: string[] = [];
  const checks = {
    apiConnection: false,
    accountAccess: false,
    webhookConfigured: false,
  };
  const details: StripeHealthCheck['details'] = {};

  try {
    // Test 1: Verify API connection by retrieving account details
    console.log('Running Stripe health check...');

    try {
      const account = await stripe.accounts.retrieve();
      checks.apiConnection = true;
      checks.accountAccess = true;

      details.accountId = account.id;
      details.accountName = account.business_profile?.name || account.email || 'Unknown';
      details.isLiveMode = !account.id.startsWith('acct_test_');

      console.log(`✓ Connected to Stripe account: ${details.accountName} (${details.accountId})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Account access failed: ${message}`);
      console.error(`✗ Failed to connect to Stripe account: ${message}`);

      if (error instanceof Stripe.errors.StripeAuthenticationError) {
        errors.push('API key authentication failed. Please verify STRIPE_SECRET_KEY is correct.');
      }
    }

    // Test 2: Check webhook configuration (optional but recommended)
    try {
      const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
      details.webhookEndpoints = webhooks.data.length;

      if (webhooks.data.length > 0) {
        checks.webhookConfigured = true;
        console.log(`✓ Found ${webhooks.data.length} webhook endpoint(s) configured`);

        // Check if any webhook is enabled for our expected events
        const hasSubscriptionEvents = webhooks.data.some(webhook =>
          webhook.enabled_events.includes('customer.subscription.created') ||
          webhook.enabled_events.includes('customer.subscription.updated')
        );

        if (!hasSubscriptionEvents) {
          console.warn(
            '⚠️  No webhook endpoints configured for subscription events. ' +
            'Subscription updates may not be reflected in your app.'
          );
        }
      } else {
        console.warn(
          '⚠️  No webhook endpoints configured. ' +
          'Set up webhooks at https://dashboard.stripe.com/webhooks for production.'
        );
      }
    } catch (error) {
      // Webhook check is optional - don't fail health check if this errors
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`⚠️  Could not check webhook configuration: ${message}`);
    }

    // Test 3: Verify we can create test objects (price retrieval)
    try {
      // Just verify we can make API calls successfully
      // We already did this with accounts.retrieve(), so this is redundant
      // But leaving structure for future expanded checks
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`API operation test failed: ${message}`);
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Health check failed: ${message}`);
    console.error(`✗ Stripe health check failed: ${message}`);
  }

  // Store errors in details
  if (errors.length > 0) {
    details.errors = errors;
  }

  // Determine overall status
  let status: StripeHealthCheck['status'];
  if (checks.apiConnection && checks.accountAccess) {
    if (checks.webhookConfigured) {
      status = 'healthy';
    } else {
      status = 'degraded'; // Works but missing webhooks
    }
  } else {
    status = 'unhealthy';
  }

  const result: StripeHealthCheck = {
    status,
    checks,
    details,
    timestamp: new Date().toISOString(),
  };

  if (status === 'healthy') {
    console.log('✓ Stripe health check passed - all systems operational');
  } else if (status === 'degraded') {
    console.warn('⚠️  Stripe health check passed with warnings - some features may be limited');
  } else {
    console.error('✗ Stripe health check failed - payment processing unavailable');
  }

  return result;
}

/**
 * Lightweight Stripe API ping to check connectivity
 * Useful for monitoring endpoints
 *
 * @returns true if Stripe API is reachable, false otherwise
 */
export async function pingStripeAPI(): Promise<boolean> {
  try {
    await stripe.accounts.retrieve();
    return true;
  } catch (error) {
    console.error('Stripe API ping failed:', error);
    return false;
  }
}

/**
 * Validates that webhook secret is configured
 * Call this when setting up webhook handlers
 *
 * @returns true if webhook secret exists and has correct format
 */
export function validateWebhookSecret(): {
  valid: boolean;
  error?: string;
} {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return {
      valid: false,
      error: 'STRIPE_WEBHOOK_SECRET is not configured. Webhooks cannot be verified without this.',
    };
  }

  // Validate format (should start with whsec_)
  if (!secret.startsWith('whsec_')) {
    return {
      valid: false,
      error: 'STRIPE_WEBHOOK_SECRET has invalid format. Expected format: whsec_...',
    };
  }

  return { valid: true };
}

/**
 * Runs health check on startup (if enabled)
 * Set STRIPE_HEALTH_CHECK_ON_STARTUP=true to enable
 */
export async function runStartupHealthCheck(): Promise<void> {
  const enabled = process.env.STRIPE_HEALTH_CHECK_ON_STARTUP === 'true';

  if (!enabled) {
    console.log('Stripe startup health check disabled (set STRIPE_HEALTH_CHECK_ON_STARTUP=true to enable)');
    return;
  }

  console.log('Running Stripe startup health check...');
  const result = await checkStripeHealth();

  if (result.status === 'unhealthy') {
    console.error(
      '\n' +
      '═══════════════════════════════════════════════════════════\n' +
      '  STRIPE CONFIGURATION ERROR\n' +
      '═══════════════════════════════════════════════════════════\n' +
      '\n' +
      'Stripe health check failed. Payment processing will not work.\n' +
      '\n' +
      'Errors:\n' +
      (result.details.errors?.map(e => `  - ${e}`).join('\n') || '  - Unknown error') +
      '\n\n' +
      'Please verify:\n' +
      '  1. STRIPE_SECRET_KEY is set in .env.local\n' +
      '  2. API key is valid and has correct permissions\n' +
      '  3. Network connectivity to Stripe API\n' +
      '\n' +
      'See: https://dashboard.stripe.com/apikeys\n' +
      '═══════════════════════════════════════════════════════════\n'
    );

    // In production, you might want to prevent server startup
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Stripe health check failed - cannot start server with invalid Stripe configuration');
    }
  }
}
