import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * API Route to test Supabase connection
 * GET /api/test-connection
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Test 1: Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError && authError.message !== 'Auth session missing!') {
      throw authError
    }

    // Test 2: Try to query the database schema to confirm connection
    // Using 'any' to bypass type checking for system schema
    const { data: tables, error: tablesError } = await (supabase as any)
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5)

    // It's okay if this fails - it means RLS is protecting the schema
    // The important thing is that we got a response from Supabase
    const hasConnection = !tablesError ||
      tablesError.message.includes('schema') ||
      tablesError.code === 'PGRST204' ||
      tablesError.code === 'PGRST205'

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      tests: {
        connection: {
          status: 'ok',
          message: 'Successfully connected to Supabase',
        },
        auth: {
          status: user ? 'authenticated' : 'anonymous',
          user: user ? { id: user.id, email: user.email } : null,
        },
        database: {
          status: hasConnection ? 'ok' : 'warning',
          message: hasConnection
            ? 'Database connection verified'
            : 'Could not verify database access',
          availableTables: tables?.length || 0,
        },
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })
  } catch (error) {
    console.error('Supabase connection test failed:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Supabase connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
      { status: 500 }
    )
  }
}
