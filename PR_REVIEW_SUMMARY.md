# Pull Request Security & Code Quality Review

**Project:** DesignDream
**Review Date:** November 3, 2025
**Reviewer:** Claude Code Automated Review
**PRs Reviewed:** #1 (Supabase), #2 (Auth), #3 (Landing Page), #7 (Stripe Checkout), #8 (Stripe Webhooks)

---

## Executive Summary

### Overall Assessment
The codebase demonstrates good structure and follows many best practices. However, there are **CRITICAL security issues** that must be addressed before production deployment.

### Critical Issues Found: 5
### High Priority Issues: 8
### Medium Priority Issues: 12
### Low Priority Issues: 6

---

## PR #1: Supabase Setup

### Critical Issues

#### 1. Missing Environment Variable Validation
**Severity:** CRITICAL
**File:** N/A (Missing validation)
**Issue:** No runtime validation of required environment variables

**Impact:** Application may fail silently or behave unpredictably if environment variables are missing or malformed.

**Recommendation:**
Create an environment validation module:

```typescript
// src/lib/env.ts
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const;

export function validateEnv() {
  const missing: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Call in app startup
validateEnv();
```

#### 2. Service Role Key Exposure Risk
**Severity:** CRITICAL
**File:** `.env.local.example`
**Line:** 3-4

**Issue:** While the example file is safe, there's no `.gitignore` rule specifically for `.env` files with service keys, and no documentation warning about the dangers of exposing service role keys.

**Impact:** If service role key is committed or exposed, attackers have full database access bypassing RLS.

**Recommendation:**
1. Add explicit warnings in documentation
2. Add additional `.gitignore` rules:
```gitignore
# Sensitive environment files
.env
.env.local
.env*.local
*.env
*_env
```

3. Add pre-commit hook to scan for exposed keys:
```bash
#!/bin/bash
# .git/hooks/pre-commit
if git diff --cached | grep -i "supabase_service_role_key.*=.*eyJ"; then
  echo "ERROR: Attempting to commit service role key!"
  exit 1
fi
```

### High Priority Issues

#### 3. Missing Database Indexes
**Severity:** HIGH
**File:** N/A (No migration file in this PR)
**Issue:** While schema is mentioned in documentation, actual migration files are missing

**Impact:** Poor query performance as database grows

**Recommendation:**
Add indexes for common query patterns:
```sql
-- Add indexes for performance
CREATE INDEX idx_clients_stripe_customer_id ON clients(stripe_customer_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_projects_client_id_status ON projects(client_id, status);
CREATE INDEX idx_requests_project_id_status ON requests(project_id, status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
```

#### 4. Missing Row Level Security (RLS) Policies
**Severity:** HIGH
**File:** N/A (Missing)
**Issue:** No RLS policies defined for tables

**Impact:** Without RLS, any authenticated user could potentially access any data

**Recommendation:**
Implement RLS policies:
```sql
-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY "Users can view own client data"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own client data"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin policies (assuming admin role)
CREATE POLICY "Admins can view all data"
  ON clients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

### Medium Priority Issues

#### 5. No Database Connection Pooling Configuration
**Severity:** MEDIUM
**File:** Supabase client configuration (not shown in diff)

**Issue:** No explicit connection pooling settings

**Impact:** May hit connection limits under load

**Recommendation:**
Configure pooling:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: { 'x-application-name': 'designdream' },
    },
  }
);
```

#### 6. Missing Database Backup Strategy
**Severity:** MEDIUM
**File:** N/A (Documentation)

**Issue:** No mention of backup strategy or disaster recovery

**Recommendation:**
Document backup strategy:
- Enable Supabase automatic daily backups
- Set up point-in-time recovery
- Document restoration procedure
- Test backup restoration quarterly

---

## PR #2: Authentication Flow

### Critical Issues

#### 7. No Rate Limiting on Auth Endpoints
**Severity:** CRITICAL
**File:** `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`
**Issue:** No rate limiting on authentication endpoints

**Impact:** Vulnerable to brute force attacks and credential stuffing

**Recommendation:**
Implement rate limiting middleware:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const limit = 5; // 5 attempts
  const window = 15 * 60 * 1000; // 15 minutes

  // Check rate limit for auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const record = rateLimitMap.get(ip);

    if (record) {
      if (now < record.resetTime) {
        if (record.count >= limit) {
          return NextResponse.json(
            { error: 'Too many attempts. Please try again later.' },
            { status: 429 }
          );
        }
        record.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, resetTime: now + window });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + window });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*', '/login', '/signup'],
};
```

**Better Alternative:** Use a service like Upstash Rate Limit or Redis-based solution for production.

#### 8. Weak Password Requirements
**Severity:** CRITICAL
**File:** `src/app/(auth)/signup/page.tsx`
**Issue:** No visible password strength requirements or validation

**Impact:** Users can create weak passwords, making accounts vulnerable to compromise

**Recommendation:**
Implement strong password validation:

```typescript
// src/lib/password-validation.ts
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

export function validatePassword(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Minimum length
  if (password.length < 12) {
    feedback.push('Password must be at least 12 characters long');
  } else {
    score++;
  }

  // Uppercase letter
  if (!/[A-Z]/.test(password)) {
    feedback.push('Include at least one uppercase letter');
  } else {
    score++;
  }

  // Lowercase letter
  if (!/[a-z]/.test(password)) {
    feedback.push('Include at least one lowercase letter');
  } else {
    score++;
  }

  // Number
  if (!/[0-9]/.test(password)) {
    feedback.push('Include at least one number');
  } else {
    score++;
  }

  // Special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Include at least one special character');
  } else {
    score++;
  }

  // Common password check (add list of common passwords)
  const commonPasswords = ['password', '123456', 'qwerty'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Password is too common');
    score = 0;
  }

  return {
    score,
    feedback,
    isValid: score >= 4 && feedback.length === 0,
  };
}
```

Use in signup form with visual feedback.

### High Priority Issues

#### 9. Missing CSRF Protection
**Severity:** HIGH
**File:** Auth endpoints
**Issue:** No CSRF token validation for state-changing operations

**Impact:** Vulnerable to cross-site request forgery attacks

**Recommendation:**
Implement CSRF tokens:

```typescript
// src/lib/csrf.ts
import { randomBytes } from 'crypto';

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

export function verifyCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

// In forms, include CSRF token:
<input type="hidden" name="csrf_token" value={csrfToken} />
```

Use Next.js built-in CSRF protection or a library like `edge-csrf`.

#### 10. Session Fixation Vulnerability
**Severity:** HIGH
**File:** Auth flow
**Issue:** No explicit session regeneration after login

**Impact:** Attacker could hijack session if they can set a session ID before authentication

**Recommendation:**
Ensure Supabase Auth regenerates session tokens on login (it should by default, but verify):

```typescript
// Verify session is fresh after login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (data.session) {
  // Force session refresh to ensure new tokens
  await supabase.auth.refreshSession();
}
```

#### 11. Missing Account Lockout
**Severity:** HIGH
**File:** Login flow
**Issue:** No account lockout after repeated failed login attempts

**Impact:** Vulnerable to brute force attacks

**Recommendation:**
Implement account lockout:

```typescript
// Track failed attempts in database
interface LoginAttempt {
  email: string;
  attempts: number;
  locked_until: Date | null;
  last_attempt: Date;
}

async function checkLoginAttempts(email: string): Promise<boolean> {
  const attempts = await getLoginAttempts(email);

  if (attempts.locked_until && attempts.locked_until > new Date()) {
    throw new Error(
      `Account is locked. Try again after ${attempts.locked_until.toLocaleString()}`
    );
  }

  return true;
}

async function recordFailedAttempt(email: string) {
  const attempts = await getLoginAttempts(email);
  const newAttempts = attempts.attempts + 1;

  if (newAttempts >= 5) {
    const lockDuration = Math.min(30 * Math.pow(2, newAttempts - 5), 1440); // Max 24 hours
    await lockAccount(email, lockDuration);
  } else {
    await incrementAttempts(email);
  }
}
```

### Medium Priority Issues

#### 12. No Email Verification Enforcement
**Severity:** MEDIUM
**File:** Signup flow
**Issue:** While email verification is mentioned, unclear if it's enforced

**Impact:** Fake accounts, spam, invalid email addresses in database

**Recommendation:**
Enforce email verification:

```typescript
// In protected routes
export async function requireVerifiedEmail() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email_confirmed_at) {
    redirect('/verify-email');
  }
}
```

Configure Supabase Auth settings:
- Enable email confirmation requirement
- Set appropriate email templates
- Configure email rate limits

#### 13. Missing 2FA Support
**Severity:** MEDIUM
**File:** Auth system
**Issue:** No two-factor authentication option

**Impact:** Accounts are less secure, especially for admin users

**Recommendation:**
Add 2FA support:
- Supabase supports TOTP-based 2FA
- Implement enrollment flow
- Require 2FA for admin accounts
- Provide backup codes

```typescript
// Enable 2FA
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
});

// Verify TOTP code
const { data, error } = await supabase.auth.mfa.verify({
  factorId: data.id,
  challengeId: challenge.id,
  code: '123456',
});
```

---

## PR #3: Landing Page

### High Priority Issues

#### 14. Missing Content Security Policy (CSP)
**Severity:** HIGH
**File:** Layout/Headers
**Issue:** No Content Security Policy headers configured

**Impact:** Vulnerable to XSS attacks, clickjacking, and other injection attacks

**Recommendation:**
Add CSP headers in `next.config.js`:

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://*.supabase.co https://api.stripe.com;
      frame-src https://js.stripe.com https://hooks.stripe.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

#### 15. No Input Sanitization on Forms
**Severity:** HIGH
**File:** Contact/Subscribe forms
**Issue:** User input not visibly sanitized

**Impact:** Potential XSS vulnerabilities

**Recommendation:**
Sanitize all user inputs:

```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: [],
  });
}

// Use in form handlers
const sanitizedEmail = sanitizeInput(email);
const sanitizedMessage = sanitizeInput(message);
```

### Medium Priority Issues

#### 16. Missing SEO Metadata
**Severity:** MEDIUM
**File:** Page components
**Issue:** Incomplete or missing meta tags for SEO

**Impact:** Poor search engine visibility

**Recommendation:**
Add comprehensive meta tags:

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'DesignDream - Unlimited Design & Development',
    template: '%s | DesignDream',
  },
  description: 'Subscribe to unlimited design and full-stack development. Fast turnaround, premium quality, cancel anytime.',
  keywords: ['design subscription', 'development subscription', 'unlimited design', 'web development'],
  authors: [{ name: 'DesignDream' }],
  creator: 'DesignDream',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://designdream.com',
    title: 'DesignDream - Unlimited Design & Development',
    description: 'Subscribe to unlimited design and full-stack development.',
    siteName: 'DesignDream',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DesignDream',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DesignDream - Unlimited Design & Development',
    description: 'Subscribe to unlimited design and full-stack development.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

#### 17. Missing Accessibility Features
**Severity:** MEDIUM
**File:** Various components
**Issue:** Potential accessibility issues

**Impact:** Excludes users with disabilities, potential ADA compliance issues

**Recommendation:**
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Add focus indicators
- Test with screen readers
- Ensure color contrast ratios meet WCAG AA standards

```typescript
// Example improvements
<button
  aria-label="Subscribe to monthly plan"
  onClick={handleSubscribe}
>
  Subscribe Now
</button>

<form
  aria-labelledby="contact-form-title"
  role="form"
>
  <h2 id="contact-form-title">Contact Us</h2>
  {/* form fields */}
</form>
```

#### 18. No Performance Optimization
**Severity:** MEDIUM
**File:** Images, fonts, assets
**Issue:** No evidence of image optimization or lazy loading

**Impact:** Slow page load times, poor Core Web Vitals

**Recommendation:**
Optimize assets:

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero-image.png"
  alt="DesignDream dashboard"
  width={1200}
  height={630}
  priority // For above-fold images
  placeholder="blur" // Add blur placeholder
/>

// For below-fold images
<Image
  src="/feature-image.png"
  alt="Feature description"
  width={800}
  height={600}
  loading="lazy"
/>
```

Optimize fonts:
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent FOUT
  preload: true,
});
```

---

## PR #7: Stripe Checkout

### Critical Issues

#### 19. Stripe Secret Key Not Validated
**Severity:** CRITICAL
**File:** `src/lib/stripe.ts`
**Issue:** No runtime validation that Stripe secret key is present and valid

**Impact:** Application will crash or fail silently when creating checkout sessions

**Recommendation:**
Add validation:

```typescript
// src/lib/stripe.ts
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'STRIPE_SECRET_KEY is not defined. Please add it to your environment variables.'
  );
}

if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  throw new Error(
    'STRIPE_SECRET_KEY appears to be invalid. It should start with "sk_".'
  );
}

// Warn if using test key in production
if (
  process.env.NODE_ENV === 'production' &&
  process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')
) {
  console.error(
    'WARNING: Using Stripe test key in production environment!'
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});
```

#### 20. No Amount Verification on Server
**Severity:** CRITICAL
**File:** `src/app/api/stripe/create-checkout-session/route.ts`
**Issue:** Price amount is set in code but not verified against a source of truth

**Impact:** If code is manipulated, incorrect amounts could be charged

**Recommendation:**
Verify amounts against database or configuration:

```typescript
// Store prices in database or secure config
const VALID_PLANS = {
  monthly: {
    id: 'monthly_subscription',
    amount: 449500, // $4,495.00
    currency: 'usd',
  },
} as const;

// In checkout session creation
export async function POST(request: NextRequest) {
  const { planId } = await request.json();

  const plan = VALID_PLANS[planId as keyof typeof VALID_PLANS];

  if (!plan) {
    return NextResponse.json(
      { error: 'Invalid plan selected' },
      { status: 400 }
    );
  }

  // Use validated plan.amount instead of stripeConfig
  const session = await stripe.checkout.sessions.create({
    // ... other params
    line_items: [{
      price_data: {
        currency: plan.currency,
        unit_amount: plan.amount, // From validated source
        // ...
      },
    }],
  });
}
```

### High Priority Issues

#### 21. Missing Idempotency Keys
**Severity:** HIGH
**File:** Stripe API calls
**Issue:** No idempotency keys used for Stripe API requests

**Impact:** Network issues could cause duplicate charges or subscriptions

**Recommendation:**
Add idempotency keys:

```typescript
import { randomUUID } from 'crypto';

const session = await stripe.checkout.sessions.create(
  sessionParams,
  {
    idempotencyKey: `checkout_${userId}_${randomUUID()}`,
  }
);
```

Store idempotency keys to prevent duplicate API calls:

```typescript
// Store in database or Redis
interface IdempotencyRecord {
  key: string;
  response: any;
  created_at: Date;
}

async function withIdempotency<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  const existing = await getIdempotencyRecord(key);

  if (existing && Date.now() - existing.created_at.getTime() < 24 * 60 * 60 * 1000) {
    return existing.response as T;
  }

  const result = await fn();
  await storeIdempotencyRecord(key, result);

  return result;
}
```

#### 22. No Webhook Signature Timeout
**Severity:** HIGH
**File:** Webhook handler (if exists)
**Issue:** Missing tolerance for webhook signature verification

**Impact:** Legitimate webhooks might be rejected due to clock skew

**Recommendation:**
Add tolerance to signature verification:

```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret,
  300 // 5 minute tolerance for clock skew
);
```

#### 23. Success URL Contains Session in Query Param
**Severity:** HIGH
**File:** Checkout session creation
**Issue:** Session ID exposed in URL can be accessed from browser history

**Impact:** Session ID could be stolen from browser history or logs

**Recommendation:**
While this is Stripe's standard pattern, consider additional verification:

```typescript
// In success page
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  // Verify session belongs to authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const session = await stripe.checkout.sessions.retrieve(
    searchParams.session_id
  );

  // Verify session belongs to this user
  const subscription = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', session.subscription)
    .single();

  if (subscription.data?.user_id !== user.id) {
    return <div>Unauthorized</div>;
  }

  // ... render success page
}
```

### Medium Priority Issues

#### 24. No Retry Logic for Failed API Calls
**Severity:** MEDIUM
**File:** Stripe API integration
**Issue:** No retry logic for transient Stripe API failures

**Impact:** Temporary network issues could cause checkout failures

**Recommendation:**
Implement exponential backoff retry:

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Don't retry on client errors
      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        throw error;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}

// Usage
const session = await withRetry(() =>
  stripe.checkout.sessions.create(sessionParams)
);
```

#### 25. Missing Customer Portal Link
**Severity:** MEDIUM
**File:** Dashboard/Settings
**Issue:** No link to Stripe Customer Portal for managing subscription

**Impact:** Users can't easily manage their subscription, update payment methods, or view invoices

**Recommendation:**
Add Customer Portal:

```typescript
// src/app/api/stripe/create-portal-session/route.ts
export async function POST(request: NextRequest) {
  const { customerId } = await request.json();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}

// In dashboard
<button onClick={openCustomerPortal}>
  Manage Subscription
</button>
```

Configure Customer Portal in Stripe Dashboard with allowed features.

---

## PR #8: Stripe Webhooks

### Critical Issues

#### 26. Webhook Endpoint Not Protected from Replay Attacks
**Severity:** CRITICAL
**File:** `src/app/api/webhooks/stripe/route.ts`
**Issue:** While idempotency is mentioned, need to verify webhook timestamp validation

**Impact:** Attackers could replay old webhook events

**Recommendation:**
Ensure timestamp validation:

```typescript
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  try {
    // constructEvent automatically validates timestamp
    // Default tolerance is 300 seconds (5 minutes)
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      webhookSecret,
      300 // Explicit tolerance
    );

    // Additional check: reject events older than 5 minutes
    const eventAge = Date.now() - (event.created * 1000);
    if (eventAge > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Event too old' },
        { status: 400 }
      );
    }

    // ... process event
  } catch (error) {
    // Log signature verification failures
    console.error('Webhook signature verification failed:', error);

    // Alert on repeated failures (potential attack)
    await alertSecurityTeam('Webhook signature verification failed');

    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    );
  }
}
```

### High Priority Issues

#### 27. Database Operations Not in Transactions
**Severity:** HIGH
**File:** `src/lib/stripe-webhooks.ts`
**Issue:** Multiple database operations not wrapped in transactions

**Impact:** Partial updates could leave database in inconsistent state

**Recommendation:**
Use transactions:

```typescript
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Use Supabase transaction
  const { data, error } = await supabaseAdmin.rpc('handle_subscription_created', {
    p_subscription_id: subscription.id,
    p_customer_id: subscription.customer as string,
    p_status: subscription.status,
    // ... other params
  });

  if (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }

  return data;
}

// Create stored procedure in database
CREATE OR REPLACE FUNCTION handle_subscription_created(
  p_subscription_id TEXT,
  p_customer_id TEXT,
  p_status TEXT,
  p_current_period_start TIMESTAMPTZ,
  p_current_period_end TIMESTAMPTZ
) RETURNS JSON AS $$
DECLARE
  v_client_id UUID;
  v_subscription_id UUID;
BEGIN
  -- Start transaction (implicit in function)

  -- Find client
  SELECT id INTO v_client_id
  FROM clients
  WHERE stripe_customer_id = p_customer_id;

  IF v_client_id IS NULL THEN
    RAISE EXCEPTION 'Client not found for customer %', p_customer_id;
  END IF;

  -- Create subscription
  INSERT INTO subscriptions (
    client_id,
    stripe_subscription_id,
    stripe_customer_id,
    status,
    current_period_start,
    current_period_end
  ) VALUES (
    v_client_id,
    p_subscription_id,
    p_customer_id,
    p_status,
    p_current_period_start,
    p_current_period_end
  ) RETURNING id INTO v_subscription_id;

  -- Update client status
  UPDATE clients
  SET subscription_status = p_status,
      updated_at = NOW()
  WHERE id = v_client_id;

  RETURN json_build_object(
    'success', true,
    'subscription_id', v_subscription_id
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback handled automatically
    RAISE;
END;
$$ LANGUAGE plpgsql;
```

#### 28. No Dead Letter Queue for Failed Webhooks
**Severity:** HIGH
**File:** Webhook handling
**Issue:** Failed webhooks are logged but not queued for retry

**Impact:** Data inconsistencies if webhooks fail permanently

**Recommendation:**
Implement retry queue:

```typescript
// src/lib/webhook-queue.ts
interface FailedWebhook {
  id: string;
  event_id: string;
  event_type: string;
  payload: any;
  error: string;
  retry_count: number;
  next_retry_at: Date;
  created_at: Date;
}

async function queueFailedWebhook(
  eventId: string,
  eventType: string,
  payload: any,
  error: string
) {
  await supabaseAdmin.from('webhook_retry_queue').insert({
    event_id: eventId,
    event_type: eventType,
    payload,
    error,
    retry_count: 0,
    next_retry_at: new Date(Date.now() + 5 * 60 * 1000), // Retry in 5 minutes
  });
}

// Background job to process retry queue
async function processWebhookRetries() {
  const { data: retries } = await supabaseAdmin
    .from('webhook_retry_queue')
    .select('*')
    .lt('next_retry_at', new Date())
    .lt('retry_count', 5) // Max 5 retries
    .order('created_at', { ascending: true })
    .limit(10);

  for (const retry of retries || []) {
    try {
      await processWebhookEvent(retry.payload);

      // Success - remove from queue
      await supabaseAdmin
        .from('webhook_retry_queue')
        .delete()
        .eq('id', retry.id);
    } catch (error) {
      // Failed - update retry count and schedule next retry
      const nextRetry = Date.now() + Math.pow(2, retry.retry_count + 1) * 60 * 1000;

      await supabaseAdmin
        .from('webhook_retry_queue')
        .update({
          retry_count: retry.retry_count + 1,
          next_retry_at: new Date(nextRetry),
          error: error.message,
        })
        .eq('id', retry.id);

      // Alert if max retries exceeded
      if (retry.retry_count >= 4) {
        await alertSecurityTeam(`Webhook ${retry.event_id} failed after 5 retries`);
      }
    }
  }
}
```

#### 29. Missing Monitoring and Alerting
**Severity:** HIGH
**File:** Webhook processing
**Issue:** No monitoring or alerting for webhook failures

**Impact:** Silent failures could go unnoticed

**Recommendation:**
Add monitoring:

```typescript
// src/lib/monitoring.ts
interface WebhookMetrics {
  total_received: number;
  total_processed: number;
  total_failed: number;
  avg_processing_time: number;
  last_webhook_at: Date;
}

async function recordWebhookMetrics(
  eventType: string,
  success: boolean,
  processingTime: number
) {
  await supabaseAdmin.from('webhook_metrics').insert({
    event_type: eventType,
    success,
    processing_time: processingTime,
    timestamp: new Date(),
  });
}

// Alert on anomalies
async function checkWebhookHealth() {
  const { data: metrics } = await supabaseAdmin
    .from('webhook_metrics')
    .select('*')
    .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000)) // Last hour
    .order('timestamp', { ascending: false });

  if (!metrics || metrics.length === 0) {
    await alertSecurityTeam('No webhooks received in the last hour');
    return;
  }

  const failureRate =
    metrics.filter(m => !m.success).length / metrics.length;

  if (failureRate > 0.1) { // 10% failure rate
    await alertSecurityTeam(
      `High webhook failure rate: ${(failureRate * 100).toFixed(1)}%`
    );
  }
}

// Set up monitoring dashboard queries
CREATE VIEW webhook_health AS
SELECT
  event_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE success = true) as successful,
  COUNT(*) FILTER (WHERE success = false) as failed,
  AVG(processing_time) as avg_time_ms,
  MAX(timestamp) as last_event_at
FROM webhook_metrics
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY event_type;
```

### Medium Priority Issues

#### 30. No Webhook Event Archival Strategy
**Severity:** MEDIUM
**File:** `webhook_events` table
**Issue:** No strategy for archiving old webhook events

**Impact:** Database bloat, slower queries over time

**Recommendation:**
Implement archival:

```sql
-- Create archive table
CREATE TABLE webhook_events_archive (LIKE webhook_events INCLUDING ALL);

-- Archive old events (run monthly)
WITH archived AS (
  DELETE FROM webhook_events
  WHERE created_at < NOW() - INTERVAL '90 days'
  RETURNING *
)
INSERT INTO webhook_events_archive
SELECT * FROM archived;

-- Or use table partitioning
CREATE TABLE webhook_events (
  -- ... columns
) PARTITION BY RANGE (created_at);

CREATE TABLE webhook_events_2025_11 PARTITION OF webhook_events
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

---

## Cross-Cutting Concerns

### Security Headers (ALL PRs)

**Severity:** HIGH

All API routes and pages should include security headers. Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];
```

### Error Handling (ALL PRs)

**Severity:** MEDIUM

Standardize error handling across all API routes:

```typescript
// src/lib/api-error.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Stripe.errors.StripeError) {
    return NextResponse.json(
      {
        error: 'Payment processing error',
        code: error.code,
      },
      { status: 400 }
    );
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : 'Unknown error',
    },
    { status: 500 }
  );
}
```

### Logging (ALL PRs)

**Severity:** MEDIUM

Implement structured logging:

```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'token',
      'secret',
      'apiKey'
    ],
    remove: true,
  },
});

// Usage
logger.info({ userId, action: 'login' }, 'User logged in');
logger.error({ error, userId }, 'Failed to process payment');
```

### TypeScript Strict Mode (ALL PRs)

**Severity:** LOW

Enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## Testing Recommendations

### Unit Tests

Add unit tests for critical business logic:

```typescript
// src/lib/__tests__/stripe-webhooks.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { handleSubscriptionCreated } from '../stripe-webhooks';

describe('Stripe Webhook Handlers', () => {
  beforeEach(() => {
    // Setup test database
  });

  it('should create subscription record', async () => {
    const mockSubscription = {
      id: 'sub_test123',
      customer: 'cus_test123',
      status: 'active',
      // ... other fields
    };

    const result = await handleSubscriptionCreated(mockSubscription);

    expect(result.success).toBe(true);
    // ... more assertions
  });

  it('should handle duplicate subscription creation', async () => {
    // Test idempotency
  });
});
```

### Integration Tests

Add integration tests for API routes:

```typescript
// src/app/api/stripe/create-checkout-session/__tests__/route.test.ts
import { describe, it, expect } from 'vitest';
import { POST } from '../route';

describe('POST /api/stripe/create-checkout-session', () => {
  it('should create checkout session', async () => {
    const request = new Request('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        userId: 'user_123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('sessionId');
    expect(data).toHaveProperty('url');
  });

  it('should reject invalid email', async () => {
    // Test validation
  });
});
```

### End-to-End Tests

Add E2E tests for critical flows:

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  await page.goto('/subscribe');

  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  // Should redirect to Stripe Checkout
  await expect(page).toHaveURL(/checkout\.stripe\.com/);

  // Fill in test card
  await page.fill('[name="cardnumber"]', '4242424242424242');
  await page.fill('[name="exp-date"]', '12/34');
  await page.fill('[name="cvc"]', '123');
  await page.fill('[name="postal"]', '12345');

  await page.click('button[type="submit"]');

  // Should redirect to success page
  await expect(page).toHaveURL(/\/subscribe\/success/);
});
```

---

## Performance Recommendations

### Database Query Optimization

1. Add indexes (mentioned in issue #3)
2. Use database views for complex queries
3. Implement query result caching with Redis
4. Use connection pooling

### API Response Caching

```typescript
// src/lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function cached<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);

  if (cached) {
    return cached as T;
  }

  const result = await fn();
  await redis.set(key, result, { ex: ttl });

  return result;
}

// Usage
const subscriptions = await cached(
  `user:${userId}:subscriptions`,
  300, // 5 minutes
  () => fetchSubscriptions(userId)
);
```

### Image Optimization

Use Next.js Image component with proper sizing and formats:

```typescript
<Image
  src="/hero.png"
  alt="Hero image"
  width={1200}
  height={630}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## Deployment Checklist

### Before Production Deployment

- [ ] All critical issues addressed
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] CSRF protection enabled
- [ ] CSP headers configured
- [ ] Environment variables validated
- [ ] Database indexes created
- [ ] RLS policies enabled and tested
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Penetration testing completed
- [ ] GDPR compliance reviewed
- [ ] Terms of Service and Privacy Policy in place
- [ ] SSL certificate configured
- [ ] CDN configured for static assets
- [ ] Database connection pooling configured
- [ ] Webhook endpoints verified
- [ ] 2FA enabled for admin accounts
- [ ] Incident response plan documented
- [ ] Disaster recovery plan tested

### Production Environment Variables

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... # KEEP SECRET

# Stripe (PRODUCTION KEYS!)
STRIPE_SECRET_KEY=sk_live_... # NOT sk_test_!
STRIPE_WEBHOOK_SECRET=whsec_... # Production webhook secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=info

# Optional: Redis for caching/rate limiting
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Optional: Email
RESEND_API_KEY=re_...
```

---

## Monitoring & Observability

### Error Tracking

Integrate Sentry or similar:

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    return event;
  },
});
```

### Application Performance Monitoring (APM)

Track key metrics:
- API response times
- Database query times
- Stripe API call latencies
- Webhook processing times
- Error rates
- User session duration

### Health Check Endpoints

```typescript
// src/app/api/health/route.ts
export async function GET() {
  const checks = {
    database: false,
    stripe: false,
    redis: false,
  };

  try {
    // Check database
    await supabaseAdmin.from('clients').select('id').limit(1);
    checks.database = true;

    // Check Stripe
    await stripe.balance.retrieve();
    checks.stripe = true;

    // Check Redis
    if (redis) {
      await redis.ping();
      checks.redis = true;
    }

    const allHealthy = Object.values(checks).every(Boolean);

    return NextResponse.json(
      {
        status: allHealthy ? 'healthy' : 'degraded',
        checks,
        timestamp: new Date().toISOString(),
      },
      { status: allHealthy ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        checks,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

---

## Summary of Priority Actions

### Must Fix Before Production (Critical)

1. **Add environment variable validation** (#1)
2. **Implement rate limiting on auth endpoints** (#7)
3. **Enforce strong password requirements** (#8)
4. **Validate Stripe secret key at runtime** (#19)
5. **Verify amounts on server side** (#20)
6. **Protect webhooks from replay attacks** (#26)

### Should Fix Soon (High Priority)

1. **Add database indexes** (#3)
2. **Implement RLS policies** (#4)
3. **Add CSRF protection** (#9)
4. **Implement account lockout** (#11)
5. **Add Content Security Policy** (#14)
6. **Add idempotency keys to Stripe calls** (#21)
7. **Use transactions for webhook database operations** (#27)
8. **Implement webhook retry queue** (#28)
9. **Add monitoring and alerting** (#29)

### Recommended Improvements (Medium Priority)

1. **Configure connection pooling** (#5)
2. **Document backup strategy** (#6)
3. **Enforce email verification** (#12)
4. **Add input sanitization** (#15)
5. **Implement retry logic for API calls** (#24)
6. **Add customer portal** (#25)
7. **Implement webhook archival** (#30)

### Nice to Have (Low Priority)

1. **Add SEO metadata** (#16)
2. **Improve accessibility** (#17)
3. **Optimize performance** (#18)
4. **Add 2FA support** (#13)

---

## Conclusion

The codebase shows good structure and many best practices are followed. However, there are critical security issues that must be addressed before production deployment, particularly around:

1. **Authentication security** (rate limiting, password strength, account lockout)
2. **Stripe integration security** (amount verification, idempotency, webhook protection)
3. **Database security** (RLS policies, indexes, transactions)
4. **Infrastructure security** (CSP, security headers, environment validation)

Addressing the critical and high-priority issues will significantly improve the security posture and reliability of the application.

---

**Review completed:** November 3, 2025
**Next review recommended:** After critical issues are addressed
**Estimated time to address critical issues:** 2-3 days
**Estimated time to address all high-priority issues:** 1 week

For questions or clarifications on any finding, please review the specific issue details above.
