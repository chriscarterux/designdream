import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * Webhook Cleanup Endpoint
 *
 * Cleans up old webhook events and resolved failures.
 * Should be called periodically (daily/weekly) via cron job.
 *
 * SECURITY: This endpoint should be protected with authentication
 * or called only from trusted sources (e.g., Vercel Cron).
 */

export const runtime = 'nodejs';

/**
 * POST /api/webhooks/cleanup
 * Clean up old webhook events and failures
 *
 * Query params:
 * - dryRun: If 'true', returns what would be deleted without deleting
 * - eventAge: Days to keep events (default: 30)
 * - failureAge: Days to keep resolved/abandoned failures (default: 90)
 */
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const dryRun = url.searchParams.get('dryRun') === 'true';
    const eventAge = parseInt(url.searchParams.get('eventAge') || '30');
    const failureAge = parseInt(url.searchParams.get('failureAge') || '90');

    // Calculate cutoff dates
    const eventCutoffDate = new Date();
    eventCutoffDate.setDate(eventCutoffDate.getDate() - eventAge);

    const failureCutoffDate = new Date();
    failureCutoffDate.setDate(failureCutoffDate.getDate() - failureAge);

    // Count events to be deleted
    const { count: eventsToDelete } = await supabaseAdmin
      .from('webhook_events')
      .select('*', { count: 'exact', head: true })
      .eq('processed', true)
      .lt('created_at', eventCutoffDate.toISOString());

    const { count: failuresToDelete } = await supabaseAdmin
      .from('webhook_failures')
      .select('*', { count: 'exact', head: true })
      .in('status', ['resolved', 'abandoned'])
      .lt('created_at', failureCutoffDate.toISOString());

    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        message: 'Dry run - no data was deleted',
        summary: {
          eventsToDelete: eventsToDelete || 0,
          failuresToDelete: failuresToDelete || 0,
        },
        config: {
          eventAge,
          failureAge,
          eventCutoffDate: eventCutoffDate.toISOString(),
          failureCutoffDate: failureCutoffDate.toISOString(),
        },
      });
    }

    // Delete old webhook events
    const { error: eventsError } = await supabaseAdmin
      .from('webhook_events')
      .delete()
      .eq('processed', true)
      .lt('created_at', eventCutoffDate.toISOString());

    if (eventsError) {
      console.error('Error deleting old events:', eventsError);
    }

    // Delete old resolved/abandoned failures
    const { error: failuresError } = await supabaseAdmin
      .from('webhook_failures')
      .delete()
      .in('status', ['resolved', 'abandoned'])
      .lt('created_at', failureCutoffDate.toISOString());

    if (failuresError) {
      console.error('Error deleting old failures:', failuresError);
    }

    console.log(`Cleanup completed: ${eventsToDelete} events, ${failuresToDelete} failures`);

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      summary: {
        eventsDeleted: eventsToDelete || 0,
        failuresDeleted: failuresToDelete || 0,
      },
      config: {
        eventAge,
        failureAge,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error('Cleanup error:', err);
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        message: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/cleanup
 * Get cleanup statistics
 */
export async function GET() {
  try {
    // Get total webhook events
    const { count: totalEvents } = await supabaseAdmin
      .from('webhook_events')
      .select('*', { count: 'exact', head: true });

    // Get processed events older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: oldEvents } = await supabaseAdmin
      .from('webhook_events')
      .select('*', { count: 'exact', head: true })
      .eq('processed', true)
      .lt('created_at', thirtyDaysAgo.toISOString());

    // Get total failures
    const { count: totalFailures } = await supabaseAdmin
      .from('webhook_failures')
      .select('*', { count: 'exact', head: true });

    // Get resolved/abandoned failures older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { count: oldFailures } = await supabaseAdmin
      .from('webhook_failures')
      .select('*', { count: 'exact', head: true })
      .in('status', ['resolved', 'abandoned'])
      .lt('created_at', ninetyDaysAgo.toISOString());

    return NextResponse.json({
      events: {
        total: totalEvents || 0,
        eligibleForCleanup: oldEvents || 0,
      },
      failures: {
        total: totalFailures || 0,
        eligibleForCleanup: oldFailures || 0,
      },
      recommendation: {
        runCleanup: (oldEvents || 0) > 100 || (oldFailures || 0) > 50,
        message:
          (oldEvents || 0) > 100 || (oldFailures || 0) > 50
            ? 'Consider running cleanup to free up database space'
            : 'No cleanup needed at this time',
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: 'Failed to get cleanup stats',
        message: err.message,
      },
      { status: 500 }
    );
  }
}
