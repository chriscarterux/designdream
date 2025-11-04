/**
 * SLA Pause API Endpoint
 *
 * POST /api/sla/pause - Pause the SLA timer for a request
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SLAPauseRequest, SLAPauseResponse, SLARecord } from '@/types/sla.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SLAPauseRequest = await request.json();
    const { request_id, reason } = body;

    if (!request_id) {
      return NextResponse.json(
        { error: 'request_id is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the active SLA record
    const { data: existingSla, error: fetchError } = await supabase
      .from('sla_records')
      .select('*')
      .eq('request_id', request_id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !existingSla) {
      return NextResponse.json(
        {
          error: 'No active SLA record found for this request',
          details: fetchError?.message,
        },
        { status: 404 }
      );
    }

    // Check if already paused
    if (existingSla.status === 'paused') {
      return NextResponse.json(
        {
          error: 'SLA is already paused',
          sla_record: existingSla,
        },
        { status: 400 }
      );
    }

    // Update SLA record to paused status
    const { data: updatedSla, error: updateError } = await supabase
      .from('sla_records')
      .update({
        status: 'paused',
        paused_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          ...existingSla.metadata,
          pause_reason: reason || 'Manual pause',
          paused_by: 'admin', // TODO: Get from authenticated user
        },
      })
      .eq('id', existingSla.id)
      .select()
      .single();

    if (updateError || !updatedSla) {
      return NextResponse.json(
        {
          error: 'Failed to pause SLA timer',
          details: updateError?.message,
        },
        { status: 500 }
      );
    }

    // Build response
    const response: SLAPauseResponse = {
      success: true,
      sla_record: updatedSla as SLARecord,
      message: 'SLA timer paused successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error pausing SLA timer:', error);
    return NextResponse.json(
      {
        error: 'Failed to pause SLA timer',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
