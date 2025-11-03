import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 *
 * Used for monitoring and uptime checks
 * Returns system status and basic diagnostics
 */
export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks: {
        server: 'ok',
        // Add more checks as needed (database, cache, etc.)
      },
    };

    // Optional: Add database check
    // You can add a simple query to verify database connectivity
    // const dbCheck = await checkDatabase();
    // health.checks.database = dbCheck ? 'ok' : 'error';

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
