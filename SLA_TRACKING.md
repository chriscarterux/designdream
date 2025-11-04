# SLA Tracking System Documentation

## Overview

The SLA (Service Level Agreement) tracking system monitors the 48-hour turnaround guarantee for all in-progress requests. It automatically tracks business hours elapsed, provides real-time warnings, and creates notifications when deadlines are at risk or violated.

## Features

### 1. Automatic SLA Timer Management

- **Auto-start**: Timer automatically starts when a request moves to "In Progress" status
- **Auto-pause**: Timer pauses when request status changes to "Blocked"
- **Auto-resume**: Timer resumes when request moves back to "In Progress"
- **Auto-complete**: Timer completes and records results when request status changes to "Done"

### 2. Business Hours Calculation

The system calculates time based on business hours only:

- **Work Days**: Monday through Friday (excluding weekends)
- **Work Hours**: 9:00 AM to 5:00 PM EST (8 hours per day)
- **Timezone**: America/New_York (EST/EDT)

Example: A request started on Friday at 4:00 PM will have only 1 business hour counted on Friday, then continue counting from Monday at 9:00 AM.

### 3. Warning System

The system provides three warning levels:

| Warning Level | Threshold | Description |
|--------------|-----------|-------------|
| **Green** (None) | > 12 hours remaining | On track, no action needed |
| **Yellow** | ≤ 12 hours remaining | Warning - approaching deadline |
| **Red** | ≤ 0 hours remaining | Critical - deadline reached/exceeded |

### 4. Notification System

Automated notifications are created for:

- **Yellow Warning** (36 hours elapsed): Notifies admins that 12 hours remain
- **Red Alert** (42 hours elapsed): Critical notification that only 6 hours remain
- **Violation** (48+ hours elapsed): SLA violated, notifies both admins and client

### 5. Real-time Monitoring

- Live dashboard showing all active SLAs
- Automatic refresh every 30-60 seconds
- Visual progress bars and color-coded indicators
- Sortable by urgency

## Database Schema

### SLA Records Table

```sql
CREATE TABLE sla_records (
  id uuid PRIMARY KEY,
  request_id uuid REFERENCES requests(id),

  -- Configuration
  target_hours numeric(5,2) DEFAULT 48,

  -- Timing
  started_at timestamp with time zone NOT NULL,
  paused_at timestamp with time zone,
  resumed_at timestamp with time zone,
  completed_at timestamp with time zone,

  -- Metrics
  total_elapsed_hours numeric(7,2),
  business_hours_elapsed numeric(7,2),
  pause_duration_hours numeric(7,2) DEFAULT 0,

  -- Status
  status text CHECK (status IN ('active', 'paused', 'met', 'violated')),

  -- Violation tracking
  violation_reason text,
  violation_severity text CHECK (violation_severity IN ('minor', 'major', 'critical')),

  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);
```

### Database Functions

#### calculate_business_hours(start_time, end_time)

Calculates the number of business hours between two timestamps.

```sql
SELECT calculate_business_hours(
  '2025-11-03 16:00:00-05',  -- Friday 4pm
  '2025-11-06 10:00:00-05'   -- Monday 10am
);
-- Returns: 2.0 (1 hour Friday + 1 hour Monday)
```

#### get_current_business_hours_elapsed(sla_id)

Gets the current business hours elapsed for an active SLA.

```sql
SELECT get_current_business_hours_elapsed('sla-uuid-here');
-- Returns: 24.5
```

#### check_sla_violations()

Checks all active SLAs and creates notifications for warnings/violations. This function should be run periodically (e.g., via cron job every hour).

```sql
SELECT check_sla_violations();
```

### Database Views

#### sla_dashboard

Real-time dashboard of all active SLAs:

```sql
SELECT * FROM sla_dashboard
ORDER BY warning_level, hours_remaining;
```

#### sla_at_risk

Shows only SLAs that are at risk (yellow or red):

```sql
SELECT * FROM sla_at_risk
WHERE warning_level IN ('yellow', 'red');
```

#### sla_metrics_by_client

Performance metrics aggregated by client:

```sql
SELECT * FROM sla_metrics_by_client
ORDER BY sla_adherence_percent DESC;
```

## API Endpoints

### GET /api/sla/[requestId]

Get the current SLA status for a request.

**Response:**

```json
{
  "sla_record": {
    "id": "uuid",
    "request_id": "uuid",
    "target_hours": 48,
    "started_at": "2025-11-03T09:00:00Z",
    "status": "active",
    "business_hours_elapsed": 24.5,
    ...
  },
  "time_calculation": {
    "started_at": "2025-11-03T09:00:00Z",
    "current_time": "2025-11-06T14:30:00Z",
    "business_hours_elapsed": 24.5,
    "hours_remaining": 23.5,
    "percentage_complete": 51.0,
    ...
  },
  "warning_level": "yellow",
  "is_at_risk": true,
  "is_violated": false,
  "time_remaining_display": "2d 7h remaining",
  "business_hours_remaining": 23.5
}
```

### POST /api/sla/pause

Pause the SLA timer for a request.

**Request Body:**

```json
{
  "request_id": "uuid",
  "reason": "Waiting for client feedback"
}
```

**Response:**

```json
{
  "success": true,
  "sla_record": { ... },
  "message": "SLA timer paused successfully"
}
```

### POST /api/sla/resume

Resume a paused SLA timer.

**Request Body:**

```json
{
  "request_id": "uuid"
}
```

**Response:**

```json
{
  "success": true,
  "sla_record": { ... },
  "message": "SLA timer resumed successfully. Pause duration: 2.5 hours"
}
```

## React Components

### SLATimer

Full SLA timer display with progress bar and controls.

```tsx
import { SLATimer } from '@/components/sla/SLATimer';

// Full display with controls
<SLATimer requestId={requestId} showControls={true} />

// Compact display
<SLATimer requestId={requestId} compact={true} />
```

**Props:**

- `requestId` (required): The request ID to track
- `compact` (optional): Show compact version (default: false)
- `showControls` (optional): Show pause/resume buttons (default: false)

### SLABadge

Compact badge for displaying SLA status inline.

```tsx
import { SLABadge } from '@/components/sla/SLABadge';

<SLABadge requestId={requestId} showTime={true} />
```

**Props:**

- `requestId` (required): The request ID to track
- `showTime` (optional): Show time remaining (default: true)

## React Hook

### useSLA

Hook for accessing SLA data and controls.

```tsx
import { useSLA } from '@/hooks/useSLA';

const { slaStatus, loading, error, pauseSLA, resumeSLA, refetch } = useSLA({
  requestId: 'uuid',
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
});

// Pause the timer
await pauseSLA('Waiting for client');

// Resume the timer
await resumeSLA();

// Manually refresh
await refetch();
```

## Helper Functions

### calculateBusinessHours(startTime, endTime, config?)

Calculate business hours between two dates.

```typescript
import { calculateBusinessHours } from '@/lib/sla';

const hours = calculateBusinessHours(
  new Date('2025-11-03T16:00:00'),
  new Date('2025-11-06T10:00:00')
);
// Returns: 2
```

### getTimeRemainingDisplay(hoursRemaining)

Get human-readable time remaining.

```typescript
import { getTimeRemainingDisplay } from '@/lib/sla';

getTimeRemainingDisplay(25.5); // "3d 1h remaining"
getTimeRemainingDisplay(7.5);  // "7h remaining"
getTimeRemainingDisplay(0.5);  // "30m remaining"
getTimeRemainingDisplay(-2);   // "SLA deadline passed"
```

### isSLAAtRisk(hoursRemaining, thresholds?)

Check if SLA is at risk.

```typescript
import { isSLAAtRisk } from '@/lib/sla';

isSLAAtRisk(15); // false
isSLAAtRisk(10); // true (default threshold: 12 hours)
```

### isSLAViolated(hoursRemaining)

Check if SLA is violated.

```typescript
import { isSLAViolated } from '@/lib/sla';

isSLAViolated(5);  // false
isSLAViolated(-1); // true
```

## Usage Examples

### Example 1: Display SLA Timer on Request Detail Page

```tsx
// app/dashboard/requests/[id]/page.tsx
import { SLATimer } from '@/components/sla/SLATimer';

export default function RequestDetailPage({ params }) {
  const { id } = params;

  return (
    <div className="space-y-6">
      <h1>Request Details</h1>

      {/* Show SLA timer if request is in progress */}
      <SLATimer requestId={id} showControls={true} />

      {/* Rest of request details */}
    </div>
  );
}
```

### Example 2: Show SLA Badge in Request List

```tsx
// components/RequestList.tsx
import { SLABadge } from '@/components/sla/SLABadge';

export function RequestList({ requests }) {
  return (
    <div>
      {requests.map(request => (
        <div key={request.id} className="flex items-center justify-between">
          <span>{request.title}</span>
          {request.status === 'in_progress' && (
            <SLABadge requestId={request.id} />
          )}
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Custom SLA Display with Hook

```tsx
// components/CustomSLADisplay.tsx
import { useSLA } from '@/hooks/useSLA';

export function CustomSLADisplay({ requestId }) {
  const { slaStatus, loading, pauseSLA, resumeSLA } = useSLA({
    requestId,
    autoRefresh: true,
  });

  if (loading) return <div>Loading...</div>;
  if (!slaStatus) return null;

  const { warning_level, time_remaining_display } = slaStatus;

  return (
    <div>
      <h3>Time Remaining: {time_remaining_display}</h3>
      <p>Status: {warning_level}</p>

      <button onClick={() => pauseSLA('Custom reason')}>
        Pause
      </button>
      <button onClick={() => resumeSLA()}>
        Resume
      </button>
    </div>
  );
}
```

## Monitoring and Maintenance

### Setting Up Automated SLA Checks

Create a cron job or scheduled task to run the SLA violation checker:

```sql
-- Run this every hour via pg_cron or external scheduler
SELECT check_sla_violations();
```

Using pg_cron (if installed):

```sql
-- Install pg_cron extension
CREATE EXTENSION pg_cron;

-- Schedule hourly SLA checks
SELECT cron.schedule(
  'check-sla-violations',
  '0 * * * *', -- Every hour at minute 0
  $$SELECT check_sla_violations()$$
);
```

### Monitoring Queries

Get all at-risk SLAs:

```sql
SELECT * FROM sla_at_risk
WHERE warning_level IN ('yellow', 'red')
ORDER BY hours_remaining ASC;
```

Get SLA performance summary:

```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'active') as active_slas,
  COUNT(*) FILTER (WHERE status = 'met') as slas_met,
  COUNT(*) FILTER (WHERE status = 'violated') as slas_violated,
  ROUND(AVG(business_hours_elapsed), 2) as avg_completion_hours
FROM sla_records
WHERE created_at >= now() - interval '30 days';
```

## Configuration

### Customizing Business Hours

Edit the configuration in `src/lib/sla.ts`:

```typescript
export const DEFAULT_BUSINESS_HOURS: BusinessHoursConfig = {
  workDays: [1, 2, 3, 4, 5], // Mon-Fri
  startHour: 9,              // 9am
  endHour: 17,               // 5pm
  timezone: 'America/New_York',
};
```

### Customizing Warning Thresholds

```typescript
export const DEFAULT_WARNING_THRESHOLDS: SLAWarningThresholds = {
  yellow_hours_remaining: 12, // Yellow at 36 hours
  red_hours_remaining: 0,     // Red at 48 hours
};
```

## Troubleshooting

### SLA Not Starting Automatically

Check that the trigger is installed:

```sql
SELECT * FROM pg_trigger
WHERE tgname = 'update_sla_on_status_change';
```

### Business Hours Calculation Seems Wrong

Test the calculation function:

```sql
SELECT calculate_business_hours(
  '2025-11-03 09:00:00-05',
  '2025-11-03 17:00:00-05'
);
-- Should return: 8.0
```

### Notifications Not Being Created

Run the violation checker manually:

```sql
SELECT check_sla_violations();
```

Check for created notifications:

```sql
SELECT * FROM notifications
WHERE type = 'sla_warning'
ORDER BY created_at DESC;
```

## Performance Considerations

- **Indexing**: All necessary indexes are created by the migration
- **View Performance**: The dashboard view uses a function call which is efficient for small datasets but may need optimization for 1000+ active SLAs
- **Auto-refresh**: Default refresh intervals are conservative (30-60s). Adjust based on your needs
- **Caching**: Consider implementing Redis caching for frequently accessed SLA data

## Future Enhancements

Potential improvements to consider:

1. **Email Notifications**: Integrate with email service (SendGrid, Postmark, etc.)
2. **Slack Integration**: Post SLA warnings to Slack channels
3. **Custom SLA Targets**: Allow different SLA targets per client or request type
4. **SLA Metrics Dashboard**: Build a comprehensive analytics dashboard
5. **Historical Trending**: Track SLA performance over time
6. **Client-specific Business Hours**: Support different timezones per client
7. **Automatic Escalation**: Auto-assign to managers when SLA at risk

## Support

For issues or questions, refer to:

- Database schema: `supabase/migrations/20251102000000_init_schema.sql`
- Enhanced migrations: `supabase/migrations/20251103000000_enhanced_sla_tracking.sql`
- Type definitions: `src/types/sla.types.ts`
- Helper functions: `src/lib/sla.ts`
