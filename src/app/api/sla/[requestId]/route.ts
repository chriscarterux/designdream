/**
 * SLA Status API Endpoint
 *
 * GET /api/sla/[requestId] - Get current SLA status for a request
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  calculateSLATime,
  getWarningLevel,
  isSLAAtRisk,
  isSLAViolated,
  getTimeRemainingDisplay,
} from '@/lib/sla';
import { SLARecord, SLAStatusResponse } from '@/types/sla.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the active SLA record for this request
    const { data: slaRecord, error: slaError } = await supabase
      .from('sla_records')
      .select('*')
      .eq('request_id', requestId)
      .in('status', ['active', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (slaError || !slaRecord) {
      // No active SLA record found
      return NextResponse.json(
        {
          error: 'No active SLA record found for this request',
          details: slaError?.message,
        },
        { status: 404 }
      );
    }

    // Calculate current SLA time information
    const timeCalculation = calculateSLATime(slaRecord as SLARecord);

    // Determine warning level and risk status
    const warningLevel = getWarningLevel(timeCalculation.hours_remaining);
    const isAtRisk = isSLAAtRisk(timeCalculation.hours_remaining);
    const isViolated = isSLAViolated(timeCalculation.hours_remaining);

    // Get human-readable time remaining
    const timeRemainingDisplay = getTimeRemainingDisplay(
      timeCalculation.hours_remaining
    );

    // Build response
    const response: SLAStatusResponse = {
      sla_record: slaRecord as SLARecord,
      time_calculation: timeCalculation,
      warning_level: warningLevel,
      is_at_risk: isAtRisk,
      is_violated: isViolated,
      time_remaining_display: timeRemainingDisplay,
      business_hours_remaining: timeCalculation.hours_remaining,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching SLA status:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch SLA status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
