import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-server';
import { handleWebhookEvent } from '@/lib/stripe-webhooks';

/**
 * Webhook Retry Endpoint
 *
 * Allows manual retry of failed webhooks from the dead letter queue.
 * This endpoint should be protected with authentication in production.
 */

export const runtime = 'nodejs';

/**
 * GET /api/webhooks/retry
 * List failed webhooks ready for retry
 */
export async function GET() {
  try {
    const { data: failures, error } = await supabaseAdmin
      .from('webhook_failures')
      .select('*')
      .in('status', ['pending', 'retrying'])
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    // Categorize failures
    const readyForRetry = failures?.filter(
      f => !f.next_retry_at || new Date(f.next_retry_at) <= new Date()
    ) || [];

    const awaitingRetry = failures?.filter(
      f => f.next_retry_at && new Date(f.next_retry_at) > new Date()
    ) || [];

    return NextResponse.json({
      total: failures?.length || 0,
      readyForRetry: readyForRetry.length,
      awaitingRetry: awaitingRetry.length,
      failures: {
        ready: readyForRetry,
        awaiting: awaitingRetry,
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: 'Failed to fetch failures',
        message: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/webhooks/retry
 * Retry a specific failed webhook or all ready webhooks
 *
 * Body:
 * - failureId: UUID of specific failure to retry (optional)
 * - retryAll: boolean to retry all ready failures (optional)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { failureId, retryAll } = body;

    if (!failureId && !retryAll) {
      return NextResponse.json(
        {
          error: 'Missing parameter',
          message: 'Provide either failureId or retryAll=true',
        },
        { status: 400 }
      );
    }

    let failuresToRetry;

    if (failureId) {
      // Retry specific failure
      const { data, error } = await supabaseAdmin
        .from('webhook_failures')
        .select('*')
        .eq('id', failureId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Failure not found' },
          { status: 404 }
        );
      }

      failuresToRetry = [data];
    } else {
      // Retry all ready failures
      const { data, error } = await supabaseAdmin
        .from('webhook_failures')
        .select('*')
        .in('status', ['pending', 'retrying'])
        .lte('next_retry_at', new Date().toISOString())
        .limit(10); // Limit to prevent overwhelming system

      if (error) {
        throw error;
      }

      failuresToRetry = data || [];
    }

    const results = [];

    for (const failure of failuresToRetry) {
      try {
        // Reconstruct Stripe event from payload
        const event: Stripe.Event = {
          id: failure.stripe_event_id,
          type: failure.event_type,
          data: {
            object: failure.payload,
          },
          created: Math.floor(new Date(failure.created_at).getTime() / 1000),
          livemode: false,
          pending_webhooks: 0,
          request: null,
          object: 'event',
          api_version: null,
        };

        // Retry processing
        const result = await handleWebhookEvent(event);

        if (result.success) {
          // Mark as resolved
          await supabaseAdmin
            .from('webhook_failures')
            .update({
              status: 'resolved',
              resolved_at: new Date().toISOString(),
              resolution_notes: 'Successfully retried',
            })
            .eq('id', failure.id);

          results.push({
            failureId: failure.id,
            eventId: failure.stripe_event_id,
            success: true,
            message: 'Retry successful',
          });
        } else {
          // Update retry count and next retry time
          const retryCount = failure.retry_count + 1;
          const maxRetries = failure.max_retries || 5;

          // Calculate next retry time with exponential backoff
          const nextRetryMinutes = Math.pow(2, retryCount) * 5;
          const nextRetryAt = new Date(Date.now() + nextRetryMinutes * 60 * 1000);

          const status = retryCount >= maxRetries ? 'abandoned' : 'pending';

          await supabaseAdmin
            .from('webhook_failures')
            .update({
              retry_count: retryCount,
              last_retry_at: new Date().toISOString(),
              next_retry_at: status === 'abandoned' ? null : nextRetryAt.toISOString(),
              status,
              error_message: result.error?.message || result.message,
            })
            .eq('id', failure.id);

          results.push({
            failureId: failure.id,
            eventId: failure.stripe_event_id,
            success: false,
            message: result.message,
            retryCount,
            maxRetries,
            status,
            nextRetryAt: status === 'abandoned' ? null : nextRetryAt.toISOString(),
          });
        }
      } catch (error) {
        const err = error as Error;
        results.push({
          failureId: failure.id,
          eventId: failure.stripe_event_id,
          success: false,
          error: err.message,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
      results,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: 'Retry failed',
        message: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/webhooks/retry/:id
 * Mark a failed webhook as resolved without retrying
 */
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const failureId = url.searchParams.get('id');

    if (!failureId) {
      return NextResponse.json(
        { error: 'Missing failure ID' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('webhook_failures')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolution_notes: 'Manually resolved without retry',
      })
      .eq('id', failureId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Failure marked as resolved',
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: 'Failed to resolve',
        message: err.message,
      },
      { status: 500 }
    );
  }
}
