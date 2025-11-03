# GitHub Actions Deployment Setup

This guide explains how to set up GitHub Actions for automated CI/CD with Vercel.

## Overview

The CI/CD pipeline includes:
- Linting and type checking on every push
- Build validation
- Security scanning
- Automatic preview deployments for PRs
- Automatic production deployments to main branch

## Prerequisites

- GitHub repository
- Vercel account connected to GitHub
- Vercel project created

## Setup Steps

### 1. Get Vercel Tokens

#### Vercel Token
1. Go to https://vercel.com/account/tokens
2. Create new token: "GitHub Actions"
3. Copy the token (shown once)

#### Vercel Organization ID
1. Go to Vercel dashboard → Settings → General
2. Copy "Organization ID" or "Team ID"

#### Vercel Project ID
1. Go to your project in Vercel
2. Go to Settings → General
3. Copy "Project ID"

### 2. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel API token | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Vercel organization/team ID | Vercel Settings → General |
| `VERCEL_PROJECT_ID` | Vercel project ID | Project Settings → General |

Optional (for build):
| Secret Name | Description |
|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (for build) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (for build) |

### 3. Enable GitHub Actions

The workflow is already configured in `.github/workflows/ci.yml`.

It will automatically run on:
- Every push to `main` or `develop`
- Every pull request to `main` or `develop`

### 4. Verify Setup

1. Make a test commit and push
2. Go to GitHub → Actions tab
3. Verify workflow runs successfully

## Workflow Details

### Jobs

#### 1. Lint
- Runs ESLint
- Fails on any linting errors

#### 2. Type Check
- Runs TypeScript compiler
- Fails on any type errors

#### 3. Build
- Builds Next.js application
- Uploads build artifacts
- Runs after lint and type check pass

#### 4. Security Scan
- Runs npm audit
- Scans for secrets in code
- Warns on vulnerabilities

#### 5. Deploy Preview
- Deploys to Vercel preview environment
- Only runs on pull requests
- Comments deployment URL on PR

#### 6. Deploy Production
- Deploys to Vercel production
- Only runs on push to main branch
- Requires all other jobs to pass

### Workflow Triggers

```yaml
# Runs on push to main or develop
push:
  branches: [main, develop]

# Runs on PR to main or develop
pull_request:
  branches: [main, develop]
```

## Manual Deployment

You can manually trigger deployments using Vercel CLI:

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Troubleshooting

### Build Fails

**Error:** Type errors or linting errors

**Solution:**
```bash
# Fix locally first
npm run type-check
npm run lint
npm run build
```

### Vercel Token Invalid

**Error:** `Invalid token` or `Unauthorized`

**Solution:**
1. Regenerate token at https://vercel.com/account/tokens
2. Update `VERCEL_TOKEN` secret in GitHub

### Environment Variables Missing

**Error:** Build fails due to missing env vars

**Solution:**
1. Add required env vars to Vercel project settings
2. Or add them as GitHub secrets and pass to build

### Security Scan Fails

**Error:** Secrets detected in code

**Solution:**
1. Remove hardcoded secrets from code
2. Use environment variables instead
3. Commit changes

## Advanced Configuration

### Custom Build Command

Edit `.github/workflows/ci.yml`:

```yaml
- name: Build application
  run: npm run build:production  # Your custom command
```

### Add Test Job

```yaml
test:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    - run: npm ci
    - run: npm test
```

### Conditional Deployment

Deploy only if specific files changed:

```yaml
deploy-production:
  if: |
    github.event_name == 'push' &&
    github.ref == 'refs/heads/main' &&
    contains(github.event.head_commit.modified, 'src/')
```

### Slack Notifications

Add Slack notification on deployment:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## GitHub Secrets Reference

Complete list of secrets you can configure:

### Required
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Optional (for enhanced builds)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SLACK_WEBHOOK` - Slack webhook for notifications
- `SENTRY_AUTH_TOKEN` - Sentry token for source maps

## Best Practices

1. **Keep secrets secure** - Never commit secrets to git
2. **Test locally first** - Run `npm run build` before pushing
3. **Use preview deployments** - Test in preview before merging to main
4. **Monitor workflows** - Check GitHub Actions regularly
5. **Set up notifications** - Get alerted on failures
6. **Review security scans** - Fix vulnerabilities promptly

## Monitoring

### View Workflow Runs
- GitHub → Actions tab
- See all workflow runs
- Click for detailed logs

### View Deployments
- Vercel Dashboard → Deployments
- See all preview and production deployments
- Click for logs and metrics

### Set Up Alerts
- GitHub → Settings → Notifications
- Enable "Actions" notifications
- Get email/Slack on failures

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

**Last Updated:** 2025-01-03
