/**
 * SLA Tracking Type Definitions
 *
 * Defines types for the 48-hour turnaround SLA tracking system
 */

export type SLAStatus = 'active' | 'paused' | 'met' | 'violated';

export type SLAViolationSeverity = 'minor' | 'major' | 'critical';

export type SLAWarningLevel = 'none' | 'yellow' | 'red';

export interface SLARecord {
  id: string;
  request_id: string;
  target_hours: number;
  started_at: string;
  paused_at: string | null;
  resumed_at: string | null;
  completed_at: string | null;
  total_elapsed_hours: number | null;
  business_hours_elapsed: number | null;
  pause_duration_hours: number;
  status: SLAStatus;
  violation_reason: string | null;
  violation_severity: SLAViolationSeverity | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface SLATimeCalculation {
  started_at: Date;
  current_time: Date;
  paused_at: Date | null;
  pause_duration_hours: number;
  business_hours_elapsed: number;
  total_elapsed_hours: number;
  target_hours: number;
  hours_remaining: number;
  percentage_complete: number;
}

export interface SLAStatusResponse {
  sla_record: SLARecord;
  time_calculation: SLATimeCalculation;
  warning_level: SLAWarningLevel;
  is_at_risk: boolean;
  is_violated: boolean;
  time_remaining_display: string;
  business_hours_remaining: number;
}

export interface SLAPauseRequest {
  request_id: string;
  reason?: string;
}

export interface SLAResumeRequest {
  request_id: string;
}

export interface SLAPauseResponse {
  success: boolean;
  sla_record: SLARecord;
  message: string;
}

export interface SLAResumeResponse {
  success: boolean;
  sla_record: SLARecord;
  message: string;
}

export interface BusinessHoursConfig {
  // Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  workDays: number[];
  startHour: number; // 24-hour format (e.g., 9 for 9am)
  endHour: number; // 24-hour format (e.g., 17 for 5pm)
  timezone: string; // e.g., 'America/New_York'
}

export interface SLAWarningThresholds {
  yellow_hours_remaining: number; // e.g., 12 hours
  red_hours_remaining: number; // e.g., 0 hours (at deadline)
}

export interface SLAMetrics {
  total_requests: number;
  sla_met: number;
  sla_violated: number;
  avg_turnaround_hours: number;
  sla_adherence_percent: number;
  active_slas: number;
  at_risk_slas: number;
}
