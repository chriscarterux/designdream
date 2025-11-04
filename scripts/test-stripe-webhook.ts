#!/usr/bin/env tsx

/**
 * Test Stripe Webhook Integration
 *
 * This script helps test the Stripe webhook integration by creating
 * test subscriptions and monitoring the webhook events.
 *
 * Usage:
 *   npm run tsx scripts/test-stripe-webhook.ts
 *
 * Prerequisites:
 *   - Stripe CLI installed and authenticated
 *   - Development server running (npm run dev)
 *   - Webhook forwarding active (stripe listen --forward-to localhost:3000/api/webhooks/stripe)
 *   - Environment variables configured in .env.local
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Validate environment variables
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Test configuration
const TEST_EMAIL = `test+${Date.now()}@example.com`;
const TEST_PRICE_ID = process.env.TEST_PRICE_ID || 'price_test_example';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkWebhookEvent(eventId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('webhook_events')
    .select('*')
    .eq('stripe_event_id', eventId)
    .single();

  if (error) {
    return false;
  }

  return data?.processed === true;
}

async function checkSubscription(subscriptionId: string): Promise<any> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

async function main() {
  log('\n🚀 Starting Stripe Webhook Test\n', 'bright');

  try {
    // Step 1: Create test customer
    log('📝 Step 1: Creating test customer...', 'cyan');
    const customer = await stripe.customers.create({
      email: TEST_EMAIL,
      name: 'Test Customer',
      metadata: {
        test: 'true',
        created_by: 'test-script',
      },
    });
    log(`✓ Customer created: ${customer.id}`, 'green');

    // Step 2: Create test subscription
    log('\n📝 Step 2: Creating test subscription...', 'cyan');
    log('⚠️  Make sure you have a valid price ID in TEST_PRICE_ID env var', 'yellow');

    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: TEST_PRICE_ID }],
        payment_behavior: 'default_incomplete',
        metadata: {
          test: 'true',
        },
      });
      log(`✓ Subscription created: ${subscription.id}`, 'green');
      log(`  Status: ${subscription.status}`, 'blue');

      // Step 3: Wait for webhook processing
      log('\n📝 Step 3: Waiting for webhook processing...', 'cyan');
      log('  This should take a few seconds...', 'blue');

      let attempts = 0;
      const maxAttempts = 10;
      let webhookProcessed = false;

      while (attempts < maxAttempts && !webhookProcessed) {
        await sleep(2000); // Wait 2 seconds between checks
        attempts++;

        // Check if webhook was processed
        const events = await stripe.events.list({
          limit: 100,
          type: 'customer.subscription.created',
        });

        const relevantEvent = events.data.find(
          (e) => (e.data.object as any).id === subscription.id
        );

        if (relevantEvent) {
          webhookProcessed = await checkWebhookEvent(relevantEvent.id);
          if (webhookProcessed) {
            log(`✓ Webhook event processed: ${relevantEvent.id}`, 'green');
            break;
          }
        }

        log(`  Attempt ${attempts}/${maxAttempts}...`, 'blue');
      }

      if (!webhookProcessed) {
        log('⚠️  Webhook not processed after 20 seconds', 'yellow');
        log('  Check if webhook forwarding is active', 'yellow');
      }

      // Step 4: Verify database records
      log('\n📝 Step 4: Verifying database records...', 'cyan');

      await sleep(1000); // Give database a moment to update

      const dbSubscription = await checkSubscription(subscription.id);
      if (dbSubscription) {
        log('✓ Subscription found in database', 'green');
        log(`  Status: ${dbSubscription.status}`, 'blue');
        log(`  Plan ID: ${dbSubscription.plan_id}`, 'blue');
      } else {
        log('❌ Subscription not found in database', 'red');
      }

      // Step 5: Update subscription (trigger subscription.updated)
      log('\n📝 Step 5: Testing subscription update...', 'cyan');
      await stripe.subscriptions.update(subscription.id, {
        metadata: {
          test: 'true',
          updated: 'true',
        },
      });
      log('✓ Subscription updated', 'green');

      await sleep(3000);

      // Step 6: Cancel subscription (trigger subscription.deleted)
      log('\n📝 Step 6: Testing subscription cancellation...', 'cyan');
      await stripe.subscriptions.cancel(subscription.id);
      log('✓ Subscription canceled', 'green');

      await sleep(3000);

      // Verify cancellation in database
      const canceledSubscription = await checkSubscription(subscription.id);
      if (canceledSubscription && canceledSubscription.status === 'canceled') {
        log('✓ Cancellation reflected in database', 'green');
      } else {
        log('⚠️  Cancellation not yet reflected in database', 'yellow');
      }
    } catch (subscriptionError) {
      log('\n❌ Error creating subscription', 'red');
      log('   This is likely due to invalid TEST_PRICE_ID', 'yellow');
      log('   Please set a valid Stripe price ID in your .env.local', 'yellow');
      log(`   Error: ${(subscriptionError as Error).message}`, 'red');
    }

    // Final summary
    log('\n' + '='.repeat(60), 'bright');
    log('Test Summary', 'bright');
    log('='.repeat(60), 'bright');
    log(`Test Customer: ${customer.id}`, 'blue');
    log(`Test Email: ${TEST_EMAIL}`, 'blue');

    // Query webhook events
    const { data: webhookEvents } = await supabase
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (webhookEvents && webhookEvents.length > 0) {
      log('\nRecent Webhook Events:', 'cyan');
      webhookEvents.forEach((event: any) => {
        log(`  - ${event.event_type} (${event.processed ? '✓' : '⏳'})`, 'blue');
      });
    }

    log('\n✅ Test completed successfully!', 'green');
    log('\nNext steps:', 'bright');
    log('  1. Check webhook forwarding terminal for events', 'blue');
    log('  2. Query database to verify all records', 'blue');
    log('  3. Check Stripe Dashboard for customer and subscription', 'blue');

    // Cleanup reminder
    log('\n⚠️  Cleanup reminder:', 'yellow');
    log(`  Delete test customer: stripe customers delete ${customer.id}`, 'yellow');
  } catch (error) {
    log('\n❌ Test failed with error:', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
main().catch(console.error);
