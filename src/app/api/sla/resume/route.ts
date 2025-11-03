/**
 * SLA Resume API Endpoint
 *
 * POST /api/sla/resume - Resume the SLA timer for a paused request
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SLAResumeRequest, SLAResumeResponse, SLARecord } from '@/types/sla.types';
import { calculateTotalHours } from '@/lib/sla';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SLAResumeRequest = await request.json();
    const { request_id } = body;

    if (!request_id) {
      return NextResponse.json(
        { error: 'request_id is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the paused SLA record
    const { data: existingSla, error: fetchError } = await supabase
      .from('sla_records')
      .select('*')
      .eq('request_id', request_id)
      .eq('status', 'paused')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !existingSla) {
      return NextResponse.json(
        {
          error: 'No paused SLA record found for this request',
          details: fetchError?.message,
        },
        { status: 404 }
      );
    }

    // Check if already active
    if (existingSla.status === 'active') {
      return NextResponse.json(
        {
          error: 'SLA is already active',
          sla_record: existingSla,
        },
        { status: 400 }
      );
    }

    // Calculate pause duration
    const pausedAt = new Date(existingSla.paused_at);
    const resumeTime = new Date();
    const pauseDuration = calculateTotalHours(pausedAt, resumeTime);
    const totalPauseDuration =
      (existingSla.pause_duration_hours || 0) + pauseDuration;

    // Update SLA record to active status
    const { data: updatedSla, error: updateError } = await supabase
      .from('sla_records')
      .update({
        status: 'active',
        resumed_at: resumeTime.toISOString(),
        pause_duration_hours: totalPauseDuration,
        updated_at: resumeTime.toISOString(),
        metadata: {
          ...existingSla.metadata,
          last_pause_duration_hours: pauseDuration,
          resumed_by: 'admin', // TODO: Get from authenticated user
        },
      })
      .eq('id', existingSla.id)
      .select()
      .single();

    if (updateError || !updatedSla) {
      return NextResponse.json(
        {
          error: 'Failed to resume SLA timer',
          details: updateError?.message,
        },
        { status: 500 }
      );
    }

    // Build response
    const response: SLAResumeResponse = {
      success: true,
      sla_record: updatedSla as SLARecord,
      message: `SLA timer resumed successfully. Pause duration: ${pauseDuration.toFixed(
        2
      )} hours`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error resuming SLA timer:', error);
    return NextResponse.json(
      {
        error: 'Failed to resume SLA timer',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
