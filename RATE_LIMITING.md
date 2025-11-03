# Rate Limiting Documentation

## Overview

This application implements rate limiting to prevent brute force attacks and credential stuffing on authentication endpoints. Rate limiting is applied to login, signup, and password reset pages to protect against malicious activity.

## Rate Limit Configuration

### Authentication Endpoints
- **Limit**: 5 attempts per 15 minutes
- **Applied to**:
  - `/login` - Login page
  - `/signup` - Signup page
  - `/forgot-password` - Password reset page

### Password Reset
- **Limit**: 10 attempts per hour
- **Applied to**: Password reset requests

## Implementation

### Backend (Middleware)

Rate limiting is enforced at the middleware level (`src/middleware.ts`) before requests reach the authentication pages. The middleware:

1. Identifies the client by IP address
2. Tracks requests per IP per route
3. Returns 429 (Too Many Requests) when limit exceeded
4. Includes rate limit headers in all responses

### Rate Limit Headers

All responses include the following headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed
- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Reset`: Timestamp when the rate limit window resets
- `Retry-After`: (On 429 responses) Seconds until the client can retry

### Client-Side Handling

Both login and signup pages handle rate limiting with:

1. **User-Friendly Error Messages**: Clear explanation of why the request was blocked
2. **Countdown Timer**: Real-time display showing when user can retry
3. **Automatic Reset**: Form becomes available again when limit expires

## Storage Options

### Production (Upstash Redis)

For production environments, configure Upstash Redis:

```bash
# .env.local or production environment variables
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### Development (In-Memory)

If Upstash is not configured, the system automatically falls back to in-memory rate limiting:
- Uses a Map to store request counts
- Suitable for development and testing
- Data is lost when server restarts
- Not suitable for production with multiple server instances

## Security Features

### IP-Based Tracking
- Rate limits are applied per IP address
- Supports multiple proxy headers:
  - `x-forwarded-for`
  - `x-real-ip`
  - `cf-connecting-ip` (Cloudflare)

### Sliding Window
- Uses sliding window algorithm for accurate rate limiting
- Prevents burst attacks at window boundaries
- More precise than fixed window approach

### Fail-Safe Behavior
- If rate limiting fails, requests continue normally
- Errors are logged for monitoring
- Prevents rate limiting from breaking authentication

## Testing Rate Limiting

### Manual Testing

1. Visit the login page: `http://localhost:3000/login`
2. Attempt to login 6 times with any credentials
3. On the 6th attempt, you should see the rate limit error
4. Observe the countdown timer showing time until retry

### Expected Behavior

**First 5 attempts:**
- Normal login behavior
- Headers show decreasing `X-RateLimit-Remaining`

**6th attempt onwards:**
- 429 status response (if middleware rejects before page load)
- Error message displayed on page
- Countdown timer showing wait time
- Form disabled until timer expires

### Using cURL

```bash
# Check rate limit headers
for i in {1..6}; do
  echo "Attempt $i:"
  curl -I http://localhost:3000/login
  echo ""
done
```

## Rate Limit Response Format

When rate limited, the middleware returns:

```json
{
  "error": "Too many attempts",
  "message": "You have exceeded the maximum number of attempts. Please try again in 14 minutes.",
  "retryAfter": 840
}
```

## Monitoring

### Key Metrics to Track

1. **Rate Limit Hit Rate**: How often users hit the limit
2. **False Positives**: Legitimate users being blocked
3. **Attack Attempts**: Pattern of malicious requests
4. **Geographic Distribution**: Where requests originate

### Logging

Rate limiting errors are logged to the console:
```typescript
console.error('Rate limiting error:', error);
```

In production, configure proper logging service integration.

## Customization

### Adjusting Limits

Edit `/src/lib/rate-limit.ts`:

```typescript
// Change authentication limit
authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '15 m'), // 10 requests per 15 min
  analytics: true,
  prefix: 'ratelimit:auth',
});

// Change password reset limit
passwordResetLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 requests per hour
  analytics: true,
  prefix: 'ratelimit:password-reset',
});
```

### Adding New Protected Routes

Edit `/src/middleware.ts`:

```typescript
const rateLimitedRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password', // Add new route here
];
```

## Best Practices

1. **Monitor Regularly**: Check rate limiting metrics to detect attacks
2. **Adjust Based on Usage**: Fine-tune limits based on legitimate user patterns
3. **Geographic Blocking**: Consider additional blocking for suspicious regions
4. **CAPTCHA Integration**: Add CAPTCHA after multiple failed attempts
5. **Alert on Spikes**: Set up alerts for unusual rate limit patterns
6. **Whitelist Internal IPs**: Exclude your own monitoring/testing IPs

## Troubleshooting

### Rate Limit Not Working

1. Check if Upstash is configured correctly
2. Verify middleware is running (check middleware.ts matcher)
3. Check console for rate limiting errors
4. Ensure IP detection is working (check headers)

### Too Strict / Too Lenient

Adjust the limits in `rate-limit.ts` based on:
- User feedback
- Attack patterns observed
- Legitimate usage patterns
- Business requirements

### Multiple Server Instances

With multiple server instances:
- **Must use** Upstash Redis (in-memory won't work)
- Each instance will share the same rate limit state
- Consistent rate limiting across all instances

## Security Considerations

1. **DDoS Protection**: Rate limiting alone doesn't prevent DDoS. Use Cloudflare or similar
2. **VPN/Proxy**: Attackers can bypass IP-based limits using VPNs
3. **Account Lockout**: Consider adding account-level lockout after repeated failures
4. **Progressive Delays**: Increase wait time after multiple violations
5. **CAPTCHA**: Add CAPTCHA for suspicious activity patterns

## Future Enhancements

- [ ] Account-based rate limiting (not just IP)
- [ ] Progressive penalty (increasing wait times)
- [ ] CAPTCHA integration after threshold
- [ ] Whitelist/blacklist management UI
- [ ] Real-time monitoring dashboard
- [ ] Geographic blocking configuration
- [ ] API endpoints for rate limit management
- [ ] Integration with security monitoring services

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0
