import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  /**
   * Optional identifier for the rate limit
   */
  identifier?: string;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  success: boolean;
  /**
   * Current number of requests in the window
   */
  limit: number;
  /**
   * Remaining requests allowed
   */
  remaining: number;
  /**
   * Timestamp when the rate limit resets (in milliseconds)
   */
  reset: number;
  /**
   * Whether the request is rate limited
   */
  isRateLimited: boolean;
  /**
   * Time until reset in seconds
   */
  retryAfter?: number;
}

/**
 * In-memory rate limiter for development/fallback
 */
class InMemoryRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  async limit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const key = `${config.identifier || 'default'}:${identifier}`;
    const entry = this.requests.get(key);

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    if (!entry || now > entry.resetTime) {
      // Create new entry
      const resetTime = now + config.windowMs;
      this.requests.set(key, { count: 1, resetTime });

      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: resetTime,
        isRateLimited: false,
      };
    }

    // Check if rate limit exceeded
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: entry.resetTime,
        isRateLimited: true,
        retryAfter,
      };
    }

    // Increment counter
    entry.count++;

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      reset: entry.resetTime,
      isRateLimited: false,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Initialize rate limiter instances
let authLimiter: Ratelimit | InMemoryRateLimiter;
let passwordResetLimiter: Ratelimit | InMemoryRateLimiter;

// Check if Upstash Redis is configured
const isUpstashConfigured =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

if (isUpstashConfigured) {
  // Use Upstash Redis for production
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // Rate limiter for authentication endpoints
  // 5 attempts per 15 minutes
  authLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: 'ratelimit:auth',
  });

  // Rate limiter for password reset
  // 10 attempts per hour
  passwordResetLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
    prefix: 'ratelimit:password-reset',
  });
} else {
  // Use in-memory rate limiter for development
  console.warn(
    'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not configured. Using in-memory rate limiter.'
  );

  const inMemoryLimiter = new InMemoryRateLimiter();
  authLimiter = inMemoryLimiter;
  passwordResetLimiter = inMemoryLimiter;
}

/**
 * Rate limit authentication attempts
 * Limit: 5 attempts per 15 minutes
 */
export async function rateLimit(identifier: string): Promise<RateLimitResult> {
  if (authLimiter instanceof InMemoryRateLimiter) {
    return authLimiter.limit(identifier, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      identifier: 'auth',
    });
  }

  const result = await authLimiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
    isRateLimited: !result.success,
    retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
  };
}

/**
 * Rate limit password reset attempts
 * Limit: 10 attempts per hour
 */
export async function rateLimitPasswordReset(
  identifier: string
): Promise<RateLimitResult> {
  if (passwordResetLimiter instanceof InMemoryRateLimiter) {
    return passwordResetLimiter.limit(identifier, {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
      identifier: 'password-reset',
    });
  }

  const result = await passwordResetLimiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
    isRateLimited: !result.success,
    retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
  };
}

/**
 * Get IP address from request
 */
export function getClientIP(request: Request): string {
  // Try various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Format retry-after time in a human-readable format
 */
export function formatRetryAfter(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
