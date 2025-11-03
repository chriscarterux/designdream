# SLA Tracking System - Quick Setup Guide

## Installation

### 1. Apply Database Migrations

Run the migrations to set up the database schema:

```bash
# Navigate to the project
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-sla-tracking

# Apply migrations using Supabase CLI
supabase db push

# Or apply manually via Supabase Dashboard
# Go to SQL Editor and run:
# - supabase/migrations/20251102000000_init_schema.sql (if not already run)
# - supabase/migrations/20251103000000_enhanced_sla_tracking.sql
```

### 2. Configure Environment Variables

Ensure your `.env.local` has the required Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Install Dependencies

If you haven't already:

```bash
npm install
```

## Testing the System

### Test 1: Create a Request and Start SLA

```sql
-- Insert a test request
INSERT INTO requests (
  id,
  client_id,
  title,
  description,
  type,
  status
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM clients LIMIT 1), -- Use existing client
  'Test SLA Request',
  'Testing SLA tracking system',
  'design',
  'backlog'
);

-- Move request to in_progress (this triggers SLA start)
UPDATE requests
SET status = 'in_progress'
WHERE title = 'Test SLA Request';

-- Verify SLA record was created
SELECT * FROM sla_records
WHERE request_id = (SELECT id FROM requests WHERE title = 'Test SLA Request');
```

### Test 2: Check SLA Status via API

```bash
# Get request ID
REQUEST_ID="your-request-uuid"

# Test GET endpoint
curl http://localhost:3000/api/sla/$REQUEST_ID
```

Expected response:

```json
{
  "sla_record": {
    "id": "...",
    "status": "active",
    "started_at": "2025-11-03T14:00:00Z",
    ...
  },
  "time_calculation": {
    "business_hours_elapsed": 2.5,
    "hours_remaining": 45.5,
    ...
  },
  "warning_level": "none",
  "is_at_risk": false,
  "time_remaining_display": "5d 5h remaining"
}
```

### Test 3: Pause and Resume SLA

```bash
# Pause SLA
curl -X POST http://localhost:3000/api/sla/pause \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "your-request-uuid",
    "reason": "Waiting for client feedback"
  }'

# Resume SLA
curl -X POST http://localhost:3000/api/sla/resume \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "your-request-uuid"
  }'
```

### Test 4: Test Components

Create a test page to verify components:

```tsx
// app/test-sla/page.tsx
import { SLATimer } from '@/components/sla/SLATimer';
import { SLABadge } from '@/components/sla/SLABadge';

export default function TestSLAPage() {
  const testRequestId = 'your-request-uuid';

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">SLA Component Tests</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Full Timer</h2>
        <SLATimer requestId={testRequestId} showControls={true} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Compact Timer</h2>
        <SLATimer requestId={testRequestId} compact={true} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Badge</h2>
        <SLABadge requestId={testRequestId} />
      </div>
    </div>
  );
}
```

Visit `http://localhost:3000/test-sla` to verify.

## Setting Up Automated Monitoring

### Option 1: Using pg_cron (Recommended)

If your Supabase plan supports extensions:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule SLA checks every hour
SELECT cron.schedule(
  'hourly-sla-check',
  '0 * * * *', -- Every hour at minute 0
  $$SELECT check_sla_violations()$$
);

-- Verify schedule
SELECT * FROM cron.job;
```

### Option 2: Using Edge Function (Supabase)

Create an edge function that runs on a schedule:

```typescript
// supabase/functions/check-sla/index.ts
import { createClient } from '@supabase/supabase-js';

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Run SLA violation check
  const { error } = await supabase.rpc('check_sla_violations');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

Deploy and schedule via Supabase Dashboard.

### Option 3: Using External Cron (Vercel Cron, etc.)

Create an API route:

```typescript
// app/api/cron/check-sla/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.rpc('check_sla_violations');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

Then configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-sla",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Verification Checklist

- [ ] Database migrations applied successfully
- [ ] SLA record created when request moves to "in_progress"
- [ ] Business hours calculation working correctly
- [ ] API endpoints returning correct data
- [ ] React components rendering properly
- [ ] Pause/Resume functionality working
- [ ] Automated SLA checker running hourly
- [ ] Notifications being created for warnings/violations

## Quick Reference

### Files Created

```
src/
├── types/
│   └── sla.types.ts                    # TypeScript type definitions
├── lib/
│   └── sla.ts                          # Helper functions
├── hooks/
│   └── useSLA.ts                       # React hook
├── components/
│   └── sla/
│       ├── SLATimer.tsx                # Full timer component
│       └── SLABadge.tsx                # Compact badge component
└── app/
    └── api/
        └── sla/
            ├── [requestId]/route.ts    # GET status endpoint
            ├── pause/route.ts          # POST pause endpoint
            └── resume/route.ts         # POST resume endpoint

supabase/
└── migrations/
    └── 20251103000000_enhanced_sla_tracking.sql

SLA_TRACKING.md                         # Full documentation
SLA_SETUP.md                            # This file
```

### Key Database Objects

- **Table**: `sla_records`
- **Functions**:
  - `calculate_business_hours(start, end)`
  - `get_current_business_hours_elapsed(sla_id)`
  - `check_sla_violations()`
  - `update_sla_status()` (trigger function)
- **Views**:
  - `sla_dashboard`
  - `sla_at_risk`
  - `sla_metrics_by_client`
- **Trigger**: `update_sla_on_status_change`

### Common Operations

```sql
-- Get all active SLAs
SELECT * FROM sla_dashboard;

-- Get at-risk SLAs
SELECT * FROM sla_at_risk WHERE warning_level != 'green';

-- Get client SLA performance
SELECT * FROM sla_metrics_by_client;

-- Manually run violation check
SELECT check_sla_violations();

-- Check specific SLA
SELECT * FROM sla_records WHERE request_id = 'uuid';
```

## Troubleshooting

### Issue: SLA not created when request moves to in_progress

**Solution**: Check that trigger is installed:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'update_sla_on_status_change';
```

### Issue: Business hours calculation seems incorrect

**Solution**: Test the function:

```sql
-- This should return 8 (one work day)
SELECT calculate_business_hours(
  '2025-11-04 09:00:00-05',  -- Monday 9am
  '2025-11-04 17:00:00-05'   -- Monday 5pm
);
```

### Issue: Components not loading

**Solution**: Check browser console for errors. Verify:

1. Request ID is valid
2. SLA record exists for that request
3. API endpoint is accessible
4. Environment variables are set

### Issue: Notifications not being created

**Solution**: Run the checker manually and check for errors:

```sql
SELECT check_sla_violations();

-- Check if any notifications were created
SELECT * FROM notifications
WHERE type = 'sla_warning'
ORDER BY created_at DESC
LIMIT 10;
```

## Next Steps

1. Integrate SLA components into your request detail pages
2. Add SLA badges to request list views
3. Create an admin SLA monitoring dashboard
4. Set up email notifications (integrate with SendGrid/Postmark)
5. Configure Slack webhooks for critical SLA alerts
6. Add SLA metrics to your analytics dashboard

## Support

For detailed documentation, see [SLA_TRACKING.md](./SLA_TRACKING.md)

For questions or issues:
- Check the database logs in Supabase Dashboard
- Review API endpoint responses
- Test helper functions in isolation
- Verify all migrations have been applied
