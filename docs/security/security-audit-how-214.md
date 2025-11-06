# HOW-214 Security Audit – Stripe, Webhooks, Data Privacy

**Date:** 2025-11-06  
**Auditor:** AI assistant (feature/how-214-security branch)  
**Scope:** Stripe integration, webhook handling, site security headers, dependency audit, privacy & access controls

---

## Quick Summary

- ✅ Stripe keys are environment-backed and server-side price validation is enforced. Webhook signature verification exists in both webhook handlers.
- ⚠️ Webhook secret is optional in `src/lib/stripe.ts`; missing secret means verification happens with an empty string. Recommend making it required (throw on startup).
- ⚠️ `stripe.ts` logs the first 12 characters of the secret key even in production. Remove logging to avoid leaking key prefixes in observability tooling.
- ⚠️ Basecamp webhook receiver has no shared-secret verification—anyone can POST. Needs HMAC validation or signed token check at the edge.
- ⚠️ `vercel.json` lacks `Strict-Transport-Security` and a Content Security Policy. Also `Access-Control-Allow-Origin: *` on `/api/*` opens responses to public scripts. Tighten headers.
- ⚠️ `npm audit --audit-level=high` reports 1 critical (Next.js CVEs) and 4 additional vulnerabilities. Requires upgrading Next.js ≥ 14.2.33 (or 15.1+) and dependent packages (`react-email`, `@supabase/ssr` etc.).
- ✅ Privacy policy (`/privacy`) is comprehensive, but there is no cookie consent / tracking opt-in mechanism called out in code. Ensure consent banner is wired before analytics launch.
- ⚠️ No mention of 2FA enforcement for admin accounts, nor documented access review cadence. Capture in ops runbook.
- ✅ Rate limiting exists for auth routes (`src/middleware.ts`) and Supabase middleware handles sessions with RLS on database tables.

---

## Detailed Findings & Recommendations

### 1. Stripe Integration

| Check | Status | Notes |
| --- | --- | --- |
| Secrets stored in env | ✅ | Validated via `src/lib/env.ts` and `.env` docs. |
| Secret exposure | ⚠️ | `src/lib/stripe.ts` logs `key.substring(0, 12)` on every cold start. Remove logging or restrict to local dev. |
| Publishable vs secret separation | ✅ | Client code only references `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. |
| Webhook signature verification | ✅/⚠️ | Handlers verify signature, but `STRIPE_WEBHOOK_SECRET` defaults to `''`. Throw if missing so verification can’t silently fail. |
| HTTPS enforcement | ⚠️ | Relying on Vercel, but no HSTS header. Add `Strict-Transport-Security` in `vercel.json`. |
| Rate limiting / idempotency | ✅ | Checkout session uses idempotency keys; middleware enforces rate limiting on auth routes. |
| Logging hygiene | ⚠️ | `create-checkout-session` logs customer email and Stripe IDs. Redact in production. |

### 2. Webhooks (Basecamp & internal)

| Check | Status | Notes |
| --- | --- | --- |
| Basecamp webhook auth | ❌ | `src/app/api/webhooks/basecamp/route.ts` trusts any POST. Implement shared secret (Basecamp supports Basic Auth or signature). |
| Payload sanitisation | ⚠️ | Handler logs payload snippets. Redact PII before logging. |
| Webhook retry handling | ✅ | Stripe handler uses DB-backed idempotency + dead-letter queue. |
| Test endpoint leakage | ⚠️ | `/api/webhooks/test` reveals config (whether secrets exist). Restrict to authenticated admins or remove in prod. |

### 3. Application / Headers / Infrastructure

| Check | Status | Notes |
| --- | --- | --- |
| Security headers | ⚠️ | `vercel.json` missing CSP & HSTS. Add `Content-Security-Policy` and `Strict-Transport-Security`. |
| CORS policy | ⚠️ | `/api/(.*)` returns `Access-Control-Allow-Origin: *` with `Allow-Credentials: true` (disallowed). Lock to app origin or drop `Allow-Credentials`. |
| Next.js vulnerabilities | ❌ | `npm audit` flags 14.2.18. Upgrade ≥14.2.33 (or 15.x). |
| Dependency vulnerabilities | ⚠️ | `@supabase/ssr` (cookie <0.7.0) and `react-email` (esbuild) inherit CVEs. Update after Next.js upgrade. |
| Supabase keys | ✅ | Server-side only; RLS enabled. |

### 4. Data Privacy & Compliance

| Check | Status | Notes |
| --- | --- | --- |
| Privacy policy | ✅ | `/privacy` covers GDPR/CCPA (updated Nov 3, 2024). |
| Cookie consent | ⚠️ | No consent banner detected. Add one before analytics launch. |
| Data retention & deletion | ⚠️ | Policy mentions deletion but no automated workflow documented. Define process + SLA. |
| Breach response plan | ⚠️ | No documented plan found. Add to ops runbook. |

### 5. Access Control & Operational Security

| Check | Status | Notes |
| --- | --- | --- |
| Strong passwords | ✅ | Supabase auth uses zxcvbn meter and validation. |
| 2FA on critical accounts | ⚠️ | No enforcement documented. Require 2FA on Stripe, Vercel, Basecamp, GitHub. |
| Least privilege | ⚠️ | Need evidence of periodic access reviews. Track in ops checklist. |
| Audit logging | ✅/⚠️ | Stripe events persisted via `webhook_events`, but Basecamp actions only logged to console. Store in Supabase for traceability. |

---

## `npm audit --audit-level=high` (2025-11-06)

```
# npm audit report
5 vulnerabilities (2 low, 2 moderate, 1 critical)
- Critical: next@14.2.18 (multiple GHSA advisories)
- Moderate: esbuild via react-email
- Low: cookie via @supabase/ssr
```

> Remediation: upgrade `next` ≥ 14.2.33 (or 15.1+), then bump `react-email` & `@supabase/ssr`, rerun `npm audit`.

---

## Required Follow-Up Actions

1. **Stripe** – Remove secret key logging, require `STRIPE_WEBHOOK_SECRET`, redact PII in logs.
2. **Basecamp Webhooks** – ✅ Require shared secret/basic auth for POST & GET; still need to restrict `/api/webhooks/test`.
3. **HTTP Security** – Add HSTS & CSP headers, tighten CORS on `/api/*`.
4. **Dependencies** – Plan Next.js upgrade, then update vulnerable packages (see plan below).
5. **Privacy & Ops** – Implement cookie consent, document deletion/breach processes, enforce 2FA and access reviews.

Tracking issue: HOW-214 remains open until the above mitigations are implemented and verified.

### Dependency Upgrade Plan

1. Upgrade `next` to ≥14.2.33 (or 15.1+) and rerun `npm audit`.
2. Update `react-email` (≥4.3.2) so it depends on patched `esbuild`.
3. Update `@supabase/ssr` (≥0.7.x) to pull `cookie` ≥0.7.0.
4. Reinstall / redeploy, then re-run: `npm run lint`, `npm run test`, `npm run test:e2e`, manual Stripe checkout smoke test.
5. Capture results in HOW-214 before closing ticket.
