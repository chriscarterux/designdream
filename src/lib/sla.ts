/**
 * SLA Calculation and Helper Functions
 *
 * Provides utilities for calculating and monitoring 48-hour SLA compliance
 */

import {
  SLAWarningLevel,
  SLATimeCalculation,
  BusinessHoursConfig,
  SLAWarningThresholds,
  SLARecord,
} from '@/types/sla.types';

/**
 * Default business hours configuration (M-F, 9am-5pm EST)
 */
export const DEFAULT_BUSINESS_HOURS: BusinessHoursConfig = {
  workDays: [1, 2, 3, 4, 5], // Monday through Friday
  startHour: 9,
  endHour: 17,
  timezone: 'America/New_York',
};

/**
 * Default SLA warning thresholds
 */
export const DEFAULT_WARNING_THRESHOLDS: SLAWarningThresholds = {
  yellow_hours_remaining: 12, // Yellow warning at 36 hours (12 hours before deadline)
  red_hours_remaining: 0, // Red alert at 48 hours (deadline)
};

/**
 * Calculate business hours elapsed between two timestamps
 *
 * @param startTime - Start timestamp
 * @param endTime - End timestamp
 * @param config - Business hours configuration
 * @returns Number of business hours elapsed
 */
export function calculateBusinessHours(
  startTime: Date,
  endTime: Date,
  config: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS
): number {
  if (startTime >= endTime) {
    return 0;
  }

  let businessHours = 0;
  const currentTime = new Date(startTime);

  // Iterate hour by hour
  while (currentTime < endTime) {
    const dayOfWeek = currentTime.getDay();
    const hourOfDay = currentTime.getHours();

    // Check if current hour is during business hours
    if (
      config.workDays.includes(dayOfWeek) &&
      hourOfDay >= config.startHour &&
      hourOfDay < config.endHour
    ) {
      businessHours += 1;
    }

    // Move to next hour
    currentTime.setHours(currentTime.getHours() + 1);
  }

  return businessHours;
}

/**
 * Calculate total elapsed hours (not just business hours)
 *
 * @param startTime - Start timestamp
 * @param endTime - End timestamp
 * @returns Number of total hours elapsed
 */
export function calculateTotalHours(startTime: Date, endTime: Date): number {
  const diffMs = endTime.getTime() - startTime.getTime();
  return diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
}

/**
 * Calculate detailed SLA time information
 *
 * @param slaRecord - SLA record from database
 * @param config - Business hours configuration
 * @returns Detailed time calculation
 */
export function calculateSLATime(
  slaRecord: SLARecord,
  config: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS
): SLATimeCalculation {
  const startedAt = new Date(slaRecord.started_at);
  const currentTime = new Date();
  const pausedAt = slaRecord.paused_at ? new Date(slaRecord.paused_at) : null;
  const pauseDurationHours = slaRecord.pause_duration_hours || 0;

  // Calculate elapsed time
  const effectiveEndTime = pausedAt || currentTime;
  const businessHoursElapsed = calculateBusinessHours(
    startedAt,
    effectiveEndTime,
    config
  );
  const totalElapsedHours = calculateTotalHours(startedAt, effectiveEndTime);

  // Calculate remaining time
  const targetHours = slaRecord.target_hours;
  const hoursRemaining = Math.max(0, targetHours - businessHoursElapsed);
  const percentageComplete = Math.min(
    100,
    (businessHoursElapsed / targetHours) * 100
  );

  return {
    started_at: startedAt,
    current_time: currentTime,
    paused_at: pausedAt,
    pause_duration_hours: pauseDurationHours,
    business_hours_elapsed: businessHoursElapsed,
    total_elapsed_hours: totalElapsedHours,
    target_hours: targetHours,
    hours_remaining: hoursRemaining,
    percentage_complete: percentageComplete,
  };
}

/**
 * Get time remaining in a human-readable format
 *
 * @param hoursRemaining - Hours remaining until deadline
 * @returns Human-readable time string
 */
export function getTimeRemainingDisplay(hoursRemaining: number): string {
  if (hoursRemaining <= 0) {
    return 'SLA deadline passed';
  }

  const days = Math.floor(hoursRemaining / 8); // 8 business hours per day
  const hours = Math.floor(hoursRemaining % 8);

  if (days > 0 && hours > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (days > 0) {
    return `${days}d remaining`;
  } else if (hours > 0) {
    return `${hours}h remaining`;
  } else {
    const minutes = Math.floor((hoursRemaining % 1) * 60);
    return `${minutes}m remaining`;
  }
}

/**
 * Determine warning level based on time remaining
 *
 * @param hoursRemaining - Hours remaining until deadline
 * @param thresholds - Warning thresholds configuration
 * @returns Warning level
 */
export function getWarningLevel(
  hoursRemaining: number,
  thresholds: SLAWarningThresholds = DEFAULT_WARNING_THRESHOLDS
): SLAWarningLevel {
  if (hoursRemaining <= thresholds.red_hours_remaining) {
    return 'red';
  } else if (hoursRemaining <= thresholds.yellow_hours_remaining) {
    return 'yellow';
  }
  return 'none';
}

/**
 * Check if SLA is at risk (within warning threshold)
 *
 * @param hoursRemaining - Hours remaining until deadline
 * @param thresholds - Warning thresholds configuration
 * @returns True if SLA is at risk
 */
export function isSLAAtRisk(
  hoursRemaining: number,
  thresholds: SLAWarningThresholds = DEFAULT_WARNING_THRESHOLDS
): boolean {
  return hoursRemaining <= thresholds.yellow_hours_remaining;
}

/**
 * Check if SLA has been violated
 *
 * @param hoursRemaining - Hours remaining until deadline
 * @returns True if SLA is violated
 */
export function isSLAViolated(hoursRemaining: number): boolean {
  return hoursRemaining <= 0;
}

/**
 * Calculate the next business hour after a given time
 *
 * @param time - Starting time
 * @param config - Business hours configuration
 * @returns Next business hour
 */
export function getNextBusinessHour(
  time: Date,
  config: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS
): Date {
  const nextHour = new Date(time);
  nextHour.setHours(nextHour.getHours() + 1);
  nextHour.setMinutes(0);
  nextHour.setSeconds(0);
  nextHour.setMilliseconds(0);

  // Keep advancing until we hit a business hour
  while (true) {
    const dayOfWeek = nextHour.getDay();
    const hourOfDay = nextHour.getHours();

    if (
      config.workDays.includes(dayOfWeek) &&
      hourOfDay >= config.startHour &&
      hourOfDay < config.endHour
    ) {
      return nextHour;
    }

    // If after business hours, jump to next day at start hour
    if (hourOfDay >= config.endHour) {
      nextHour.setDate(nextHour.getDate() + 1);
      nextHour.setHours(config.startHour);
    }
    // If before business hours, jump to start hour
    else if (hourOfDay < config.startHour) {
      nextHour.setHours(config.startHour);
    }
    // If weekend, jump to Monday
    else if (!config.workDays.includes(dayOfWeek)) {
      nextHour.setDate(nextHour.getDate() + 1);
      nextHour.setHours(config.startHour);
    }
  }
}

/**
 * Calculate estimated completion time based on business hours remaining
 *
 * @param hoursRemaining - Business hours remaining
 * @param currentTime - Current timestamp
 * @param config - Business hours configuration
 * @returns Estimated completion timestamp
 */
export function calculateEstimatedCompletion(
  hoursRemaining: number,
  currentTime: Date = new Date(),
  config: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS
): Date {
  let hoursToAdd = hoursRemaining;
  let estimatedTime = new Date(currentTime);

  while (hoursToAdd > 0) {
    estimatedTime = getNextBusinessHour(estimatedTime, config);
    hoursToAdd -= 1;
  }

  return estimatedTime;
}

/**
 * Format duration in hours to a readable string
 *
 * @param hours - Number of hours
 * @returns Formatted string
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)} hours`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours.toFixed(0)}h`;
  }
}

/**
 * Validate if a timestamp is during business hours
 *
 * @param time - Timestamp to check
 * @param config - Business hours configuration
 * @returns True if during business hours
 */
export function isBusinessHour(
  time: Date,
  config: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS
): boolean {
  const dayOfWeek = time.getDay();
  const hourOfDay = time.getHours();

  return (
    config.workDays.includes(dayOfWeek) &&
    hourOfDay >= config.startHour &&
    hourOfDay < config.endHour
  );
}
