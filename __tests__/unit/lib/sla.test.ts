import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateBusinessHours,
  calculateTotalHours,
  calculateSLATime,
  getTimeRemainingDisplay,
  getWarningLevel,
  isSLAAtRisk,
  isSLAViolated,
  getNextBusinessHour,
  calculateEstimatedCompletion,
  formatDuration,
  isBusinessHour,
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_WARNING_THRESHOLDS,
} from '@/lib/sla';
import type { SLARecord } from '@/types/sla.types';

describe('SLA Calculations', () => {
  describe('calculateBusinessHours', () => {
    it('should return 0 when start time is after end time', () => {
      const start = new Date('2025-01-10T10:00:00');
      const end = new Date('2025-01-10T09:00:00');
      expect(calculateBusinessHours(start, end)).toBe(0);
    });

    it('should return 0 when times are equal', () => {
      const time = new Date('2025-01-10T10:00:00');
      expect(calculateBusinessHours(time, time)).toBe(0);
    });

    it('should exclude weekends completely', () => {
      // Friday 5pm to Monday 9am
      const friday = new Date('2025-01-10T17:00:00'); // Friday 5pm
      const monday = new Date('2025-01-13T09:00:00'); // Monday 9am
      expect(calculateBusinessHours(friday, monday)).toBe(0);
    });

    it('should only count hours within 9am-5pm', () => {
      // 8am to 6pm on same day
      const start = new Date('2025-01-10T08:00:00'); // 8am Friday
      const end = new Date('2025-01-10T18:00:00'); // 6pm Friday
      // Should only count 9am-5pm = 8 hours
      expect(calculateBusinessHours(start, end)).toBe(8);
    });

    it('should handle multi-day spans correctly', () => {
      // Monday 10am to Wednesday 3pm
      const monday = new Date('2025-01-13T10:00:00'); // Monday 10am
      const wednesday = new Date('2025-01-15T15:00:00'); // Wednesday 3pm
      // Monday 10am-5pm = 7hrs
      // Tuesday 9am-5pm = 8hrs
      // Wednesday 9am-3pm = 6hrs
      // Total = 21hrs
      expect(calculateBusinessHours(monday, wednesday)).toBe(21);
    });

    it('should handle single business hour span', () => {
      const start = new Date('2025-01-10T10:00:00'); // Friday 10am
      const end = new Date('2025-01-10T11:00:00'); // Friday 11am
      expect(calculateBusinessHours(start, end)).toBe(1);
    });

    it('should handle overnight span (evening to morning)', () => {
      const evening = new Date('2025-01-10T16:00:00'); // Friday 4pm
      const morning = new Date('2025-01-13T10:00:00'); // Monday 10am
      // Friday 4pm-5pm = 1hr
      // Monday 9am-10am = 1hr
      // Total = 2hrs
      expect(calculateBusinessHours(evening, morning)).toBe(2);
    });

    it('should exclude Saturday and Sunday', () => {
      const saturday = new Date('2025-01-11T10:00:00'); // Saturday 10am
      const sunday = new Date('2025-01-12T15:00:00'); // Sunday 3pm
      expect(calculateBusinessHours(saturday, sunday)).toBe(0);
    });
  });

  describe('calculateTotalHours', () => {
    it('should calculate total hours correctly', () => {
      const start = new Date('2025-01-10T10:00:00');
      const end = new Date('2025-01-10T14:00:00');
      expect(calculateTotalHours(start, end)).toBe(4);
    });

    it('should handle fractional hours', () => {
      const start = new Date('2025-01-10T10:00:00');
      const end = new Date('2025-01-10T10:30:00');
      expect(calculateTotalHours(start, end)).toBe(0.5);
    });

    it('should handle multi-day spans', () => {
      const start = new Date('2025-01-10T10:00:00');
      const end = new Date('2025-01-12T10:00:00');
      expect(calculateTotalHours(start, end)).toBe(48);
    });
  });

  describe('calculateSLATime', () => {
    it('should calculate time correctly for active SLA', () => {
      const startedAt = new Date('2025-01-13T10:00:00'); // Monday 10am

      // Mock Date.now() to return a fixed time
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-13T14:00:00')); // Monday 2pm

      const slaRecord: SLARecord = {
        id: '1',
        request_id: 'req-1',
        started_at: startedAt.toISOString(),
        target_hours: 48,
        business_hours_elapsed: 0,
        hours_remaining: 48,
        warning_level: 'none',
        is_paused: false,
        paused_at: null,
        pause_duration_hours: 0,
        created_at: startedAt.toISOString(),
        updated_at: startedAt.toISOString(),
      };

      const result = calculateSLATime(slaRecord);

      expect(result.business_hours_elapsed).toBe(4); // 10am-2pm = 4 hours
      expect(result.hours_remaining).toBe(44); // 48 - 4 = 44
      expect(result.percentage_complete).toBeCloseTo(8.33, 1); // 4/48 * 100

      vi.useRealTimers();
    });

    it('should handle paused SLA correctly', () => {
      const startedAt = new Date('2025-01-13T10:00:00');
      const pausedAt = new Date('2025-01-13T12:00:00');

      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-13T15:00:00')); // Current time after pause

      const slaRecord: SLARecord = {
        id: '1',
        request_id: 'req-1',
        started_at: startedAt.toISOString(),
        target_hours: 48,
        business_hours_elapsed: 0,
        hours_remaining: 48,
        warning_level: 'none',
        is_paused: true,
        paused_at: pausedAt.toISOString(),
        pause_duration_hours: 0,
        created_at: startedAt.toISOString(),
        updated_at: startedAt.toISOString(),
      };

      const result = calculateSLATime(slaRecord);

      // Should only count time until pause
      expect(result.business_hours_elapsed).toBe(2); // 10am-12pm = 2 hours

      vi.useRealTimers();
    });

    it('should not exceed 100% completion', () => {
      const startedAt = new Date('2025-01-01T10:00:00');

      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T10:00:00')); // Way past deadline

      const slaRecord: SLARecord = {
        id: '1',
        request_id: 'req-1',
        started_at: startedAt.toISOString(),
        target_hours: 48,
        business_hours_elapsed: 0,
        hours_remaining: 0,
        warning_level: 'red',
        is_paused: false,
        paused_at: null,
        pause_duration_hours: 0,
        created_at: startedAt.toISOString(),
        updated_at: startedAt.toISOString(),
      };

      const result = calculateSLATime(slaRecord);

      expect(result.percentage_complete).toBe(100);
      expect(result.hours_remaining).toBe(0);

      vi.useRealTimers();
    });
  });

  describe('getTimeRemainingDisplay', () => {
    it('should display days and hours', () => {
      expect(getTimeRemainingDisplay(20)).toBe('2d 4h remaining');
    });

    it('should display days only', () => {
      expect(getTimeRemainingDisplay(16)).toBe('2d remaining');
    });

    it('should display hours only', () => {
      expect(getTimeRemainingDisplay(5)).toBe('5h remaining');
    });

    it('should display minutes for less than 1 hour', () => {
      expect(getTimeRemainingDisplay(0.5)).toBe('30m remaining');
    });

    it('should show deadline passed for 0 or negative', () => {
      expect(getTimeRemainingDisplay(0)).toBe('SLA deadline passed');
      expect(getTimeRemainingDisplay(-5)).toBe('SLA deadline passed');
    });
  });

  describe('getWarningLevel', () => {
    it('should return "none" for sufficient time remaining', () => {
      expect(getWarningLevel(20)).toBe('none');
    });

    it('should return "yellow" when within warning threshold', () => {
      expect(getWarningLevel(10)).toBe('yellow');
      expect(getWarningLevel(5)).toBe('yellow');
    });

    it('should return "red" at or past deadline', () => {
      expect(getWarningLevel(0)).toBe('red');
      expect(getWarningLevel(-5)).toBe('red');
    });

    it('should respect custom thresholds', () => {
      const customThresholds = {
        yellow_hours_remaining: 24,
        red_hours_remaining: 8,
      };

      expect(getWarningLevel(30, customThresholds)).toBe('none');
      expect(getWarningLevel(20, customThresholds)).toBe('yellow');
      expect(getWarningLevel(5, customThresholds)).toBe('red');
    });
  });

  describe('isSLAAtRisk', () => {
    it('should return true when hours remaining is within threshold', () => {
      expect(isSLAAtRisk(10)).toBe(true);
      expect(isSLAAtRisk(5)).toBe(true);
      expect(isSLAAtRisk(0)).toBe(true);
    });

    it('should return false when sufficient time remains', () => {
      expect(isSLAAtRisk(20)).toBe(false);
      expect(isSLAAtRisk(15)).toBe(false);
    });
  });

  describe('isSLAViolated', () => {
    it('should return true when deadline has passed', () => {
      expect(isSLAViolated(0)).toBe(true);
      expect(isSLAViolated(-5)).toBe(true);
    });

    it('should return false when time remains', () => {
      expect(isSLAViolated(1)).toBe(false);
      expect(isSLAViolated(10)).toBe(false);
    });
  });

  describe('getNextBusinessHour', () => {
    it('should return next hour if within business hours', () => {
      const time = new Date('2025-01-13T10:00:00'); // Monday 10am
      const next = getNextBusinessHour(time);
      expect(next.getHours()).toBe(11);
      expect(next.getDate()).toBe(13);
    });

    it('should jump to next day start if after business hours', () => {
      const time = new Date('2025-01-13T17:00:00'); // Monday 5pm
      const next = getNextBusinessHour(time);
      expect(next.getHours()).toBe(9);
      expect(next.getDate()).toBe(14); // Tuesday
    });

    it('should skip weekend to Monday', () => {
      const time = new Date('2025-01-10T14:00:00'); // Friday 2pm
      const next = getNextBusinessHour(time);
      expect(next.getHours()).toBe(15); // Friday 3pm

      // Test from evening
      const evening = new Date('2025-01-10T17:00:00'); // Friday 5pm
      const nextMonday = getNextBusinessHour(evening);
      expect(nextMonday.getDay()).toBe(1); // Monday
      expect(nextMonday.getHours()).toBe(9);
    });

    it('should handle weekend correctly', () => {
      const saturday = new Date('2025-01-11T10:00:00'); // Saturday
      const next = getNextBusinessHour(saturday);
      expect(next.getDay()).toBe(1); // Monday
      expect(next.getHours()).toBe(9);
    });
  });

  describe('calculateEstimatedCompletion', () => {
    it('should calculate completion time correctly', () => {
      const currentTime = new Date('2025-01-13T10:00:00'); // Monday 10am
      const estimated = calculateEstimatedCompletion(8, currentTime);

      // 8 hours from Monday 10am should be Tuesday 10am
      expect(estimated.getDay()).toBe(2); // Tuesday
      expect(estimated.getHours()).toBe(10);
    });

    it('should handle overnight correctly', () => {
      const currentTime = new Date('2025-01-13T16:00:00'); // Monday 4pm
      const estimated = calculateEstimatedCompletion(2, currentTime);

      // 2 hours from Monday 4pm:
      // Monday 4pm-5pm = 1hr
      // Tuesday 9am-10am = 1hr
      // Result: Tuesday 10am
      expect(estimated.getDay()).toBe(2); // Tuesday
      expect(estimated.getHours()).toBe(10);
    });
  });

  describe('formatDuration', () => {
    it('should format minutes for less than 1 hour', () => {
      expect(formatDuration(0.5)).toBe('30 minutes');
      expect(formatDuration(0.25)).toBe('15 minutes');
    });

    it('should format hours for less than 24', () => {
      expect(formatDuration(5)).toBe('5.0 hours');
      expect(formatDuration(12.5)).toBe('12.5 hours');
    });

    it('should format days and hours for 24+ hours', () => {
      expect(formatDuration(25)).toBe('1d 1h');
      expect(formatDuration(48)).toBe('2d 0h');
      expect(formatDuration(50.5)).toBe('2d 3h');
    });
  });

  describe('isBusinessHour', () => {
    it('should return true for business hours on weekdays', () => {
      const mondayMorning = new Date('2025-01-13T10:00:00'); // Monday 10am
      expect(isBusinessHour(mondayMorning)).toBe(true);

      const fridayAfternoon = new Date('2025-01-10T14:00:00'); // Friday 2pm
      expect(isBusinessHour(fridayAfternoon)).toBe(true);
    });

    it('should return false for hours outside 9am-5pm', () => {
      const earlyMorning = new Date('2025-01-13T08:00:00'); // Monday 8am
      expect(isBusinessHour(earlyMorning)).toBe(false);

      const evening = new Date('2025-01-13T17:00:00'); // Monday 5pm
      expect(isBusinessHour(evening)).toBe(false);
    });

    it('should return false for weekends', () => {
      const saturday = new Date('2025-01-11T10:00:00'); // Saturday 10am
      expect(isBusinessHour(saturday)).toBe(false);

      const sunday = new Date('2025-01-12T10:00:00'); // Sunday 10am
      expect(isBusinessHour(sunday)).toBe(false);
    });
  });
});
