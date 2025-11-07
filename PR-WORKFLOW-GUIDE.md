# Design Dreams - Pull Request Workflow Guide

## 🎯 Overview

This guide explains the automated PR review and fix workflow using Code Rabbit AI and specialized Claude Code agents.

---

## ✅ Testing Expectations

| Stage | Required Commands | Notes |
| --- | --- | --- |
| **Local (before pushing)** | `npm run lint`<br>`npm run type-check`<br>Targeted tests (`npm run test -- <pattern>`) | Keep iterations fast. Run the suites that exercise the code you touched. |
| **PR / CI** | `npm run lint`<br>`npm run type-check`<br>`npm run test`<br>`npm run test:e2e` (Playwright) | Executed automatically via GitHub Actions. Wait for green builds before merging. |

> **Tip:** If you need a full regression locally (e.g., release candidate), run `npm run test:all`, but it’s not required for every iteration—CI covers it once the PR is open.

## 🔄 Complete Workflow

### Step 1: Create Feature Branch & PR

```bash
# Work in a worktree
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow

# Make your changes and commit
git add .
git commit -m "feat: implement magic link authentication"

# Push to origin
git push origin feature/p0-auth-flow

# Create PR
gh pr create --title "[P0] Implement authentication flow" \
  --body "Implements magic link authentication with Supabase Auth. Closes HOW-XXX" \
  --base main
```

### Step 2: Wait for Code Rabbit Analysis

Code Rabbit automatically reviews all PRs and posts comments within 1-2 minutes.

**What Code Rabbit checks:**
- Code quality and best practices
- Security vulnerabilities
- Performance issues
- TypeScript type safety
- Accessibility concerns
- Test coverage
- Documentation completeness

### Step 3: Review Code Rabbit Comments

#### Automated Review

```bash
cd /Users/howdycarter/Documents/projects/designdream
./scripts/review-pr.sh <pr-number>
```

This script will:
1. Fetch PR details from GitHub
2. Extract all Code Rabbit comments
3. Prepare analysis prompt for Claude Code
4. Show you the comments summary

**Example:**
```bash
./scripts/review-pr.sh 42
```

#### Manual Review

```bash
# View PR with comments
gh pr view 42 --comments

# View just Code Rabbit's comments
gh api repos/chriscarterux/designdream/pulls/42/comments | \
  jq '.[] | select(.user.login == "coderabbitai")'
```

### Step 4: Launch Code Review Agent

The review script prepares a prompt. Now use Claude Code to analyze:

```bash
# Prompt is saved at:
cat /tmp/pr-<number>-analysis-prompt.txt
```

**Launch the agent:**
1. Open Claude Code
2. Use the `code-reviewer` agent
3. Provide the analysis prompt
4. Agent will create `PR-<number>-ACTION-PLAN.md`

**Action Plan includes:**
- Issues categorized by severity (Critical, High, Medium, Low)
- Specific files and line numbers
- Recommended fixes
- Which agent should handle each issue
- Estimated time to fix

### Step 5: Review & Approve Action Plan

```bash
# Read the action plan
cat PR-42-ACTION-PLAN.md

# Example format:
## Critical Issues (🔴 Must Fix)

### 1. SQL Injection Vulnerability
- **File:** `src/app/api/requests/route.ts:45`
- **Issue:** Direct string interpolation in SQL query
- **Fix:** Use parameterized queries
- **Agent:** security-auditor
- **Time:** 15 minutes

### 2. Missing Error Handling
- **File:** `src/app/api/auth/callback/route.ts:23`
- **Issue:** Unhandled promise rejection
- **Fix:** Add try/catch with proper error response
- **Agent:** backend-architect
- **Time:** 10 minutes

## High Priority Issues (🟡 Should Fix)
...
```

**Review the plan:**
- Do the issues make sense?
- Are there false positives to skip?
- Is the priority correct?
- Are the right agents assigned?

### Step 6: Run Automated Fix Script

```bash
cd /Users/howdycarter/Documents/projects/designdream
./scripts/fix-pr-issues.sh 42
```

This script will:
1. Create a fix worktree from the PR branch
2. Install dependencies
3. Copy environment variables
4. Provide instructions for launching agents

### Step 7: Launch Specialized Agents

Based on the action plan, launch appropriate agents **in parallel**:

#### Security Issues → `security-auditor`

```bash
# In Claude Code, launch security-auditor agent
Agent: security-auditor
Context: Fix security issues in PR #42
Action Plan: PR-42-ACTION-PLAN.md (Critical Issues section)
Worktree: /Users/howdycarter/Documents/projects/designdream-worktrees/fix-pr-42
```

#### Backend Code → `backend-architect`

```bash
# In Claude Code, launch backend-architect agent
Agent: backend-architect
Context: Fix backend code issues in PR #42
Action Plan: PR-42-ACTION-PLAN.md (High Priority Backend section)
Worktree: /Users/howdycarter/Documents/projects/designdream-worktrees/fix-pr-42
```

#### Frontend Code → `frontend-developer`

```bash
# In Claude Code, launch frontend-developer agent
Agent: frontend-developer
Context: Fix frontend issues in PR #42
Action Plan: PR-42-ACTION-PLAN.md (High Priority Frontend section)
Worktree: /Users/howdycarter/Documents/projects/designdream-worktrees/fix-pr-42
```

#### Test Issues → `test-writer-fixer`

```bash
# In Claude Code, launch test-writer-fixer agent
Agent: test-writer-fixer
Context: Fix test issues in PR #42
Action Plan: PR-42-ACTION-PLAN.md (Testing section)
Worktree: /Users/howdycarter/Documents/projects/designdream-worktrees/fix-pr-42
```

**Agents will:**
1. Read the action plan
2. Navigate to the worktree
3. Fix assigned issues
4. Run tests to verify fixes
5. Commit changes with descriptive messages
6. Report completion

### Step 8: Review Agent Fixes

```bash
cd /Users/howdycarter/Documents/projects/designdream-worktrees/fix-pr-42

# View commits made by agents
git log --oneline origin/feature/p0-auth-flow..HEAD

# Review changes
git diff origin/feature/p0-auth-flow

# Run tests
npm test

# Run type check
npm run type-check

# Test in browser
npm run dev
```

### Step 9: Push Fixed Code

```bash
cd /Users/howdycarter/Documents/projects/designdream-worktrees/fix-pr-42

# Push fixes to PR branch
git push origin feature/p0-auth-flow

# Or force push if needed (use carefully!)
git push origin feature/p0-auth-flow --force
```

### Step 10: Code Rabbit Re-Review

Code Rabbit automatically detects the new commits and re-reviews the PR.

**Check status:**
```bash
gh pr view 42 --comments
```

**If issues remain:**
- Repeat from Step 3 with new comments
- Usually only takes 1-2 iterations

**If approved:**
- Code Rabbit will mark PR as approved
- Ready to merge!

### Step 11: Merge PR

```bash
# Merge via CLI
gh pr merge 42 --squash --delete-branch

# Or merge via GitHub web interface
```

### Step 12: Clean Up Worktrees

```bash
cd /Users/howdycarter/Documents/projects/designdream

# Clean up all merged worktrees
./scripts/cleanup-worktrees.sh

# Or manually remove specific worktree
git worktree remove ../designdream-worktrees/fix-pr-42
```

---

## 📝 Quick Reference Commands

### Create PR
```bash
gh pr create --title "Title" --body "Description" --base main
```

### Review PR
```bash
./scripts/review-pr.sh <pr-number>
```

### Fix PR Issues
```bash
./scripts/fix-pr-issues.sh <pr-number>
```

### View PR
```bash
gh pr view <pr-number>
gh pr view <pr-number> --comments
gh pr view <pr-number> --web
```

### View Diff
```bash
gh pr diff <pr-number>
```

### Check Status
```bash
gh pr status
gh pr list
```

### Merge PR
```bash
gh pr merge <pr-number> --squash --delete-branch
```

---

## 🎨 Code Rabbit Comment Types

### 🔴 Critical (Must Fix Before Merge)
- **Security vulnerabilities**: SQL injection, XSS, CSRF, etc.
- **Breaking changes**: API changes, schema changes
- **Data loss risks**: Migration issues, deletion without backups
- **Critical bugs**: Null pointer, infinite loops, memory leaks

### 🟡 High (Should Fix)
- **Code quality**: Bad patterns, unmaintainable code
- **Performance**: N+1 queries, missing indexes, inefficient loops
- **Type safety**: Improper TypeScript usage, `any` types
- **Error handling**: Missing try/catch, unhandled promises
- **Best practices**: Violated conventions, incorrect patterns

### 🟢 Medium (Nice to Have)
- **Style**: Formatting, naming conventions
- **Minor improvements**: Simplification opportunities
- **Documentation**: Missing or unclear comments
- **Accessibility**: Minor a11y improvements
- **Test coverage**: Missing tests for edge cases

### ⚪ Low/Ignore (Optional or False Positives)
- **Subjective preferences**: Alternative approaches
- **Over-engineering**: Unnecessary abstractions
- **Out of scope**: Issues not related to the PR
- **False positives**: Code Rabbit misunderstandings

---

## 🤖 Agent Assignment Guide

| Issue Type | Agent | Expertise |
|-----------|-------|-----------|
| Security vulnerabilities | `security-auditor` | XSS, SQL injection, CSRF, auth issues |
| Backend API code | `backend-architect` | Express routes, database queries, business logic |
| Frontend components | `frontend-developer` | React components, state management, UI |
| Database schema | `database-architect` | Migrations, indexes, relationships, RLS |
| Test failures | `test-writer-fixer` | Unit tests, integration tests, test coverage |
| TypeScript errors | `backend-architect` or `frontend-developer` | Type safety, interfaces, generics |
| Performance issues | `backend-architect` | Query optimization, caching, algorithms |
| Accessibility | `frontend-developer` | ARIA, keyboard nav, screen readers |
| DevOps/deployment | `devops-automator` | CI/CD, environment config, deployment |
| General code quality | `code-reviewer` | Code patterns, architecture, refactoring |

---

## 💡 Best Practices

### For PR Authors

1. **Keep PRs small** - Easier to review, faster to fix
2. **One feature per PR** - Don't mix unrelated changes
3. **Write descriptive commits** - Use conventional commit format
4. **Add tests** - Code Rabbit checks test coverage
5. **Update documentation** - Keep README and docs in sync
6. **Self-review first** - Check your own code before submitting
7. **Link Linear issues** - Reference issue numbers in PR body

### For Code Rabbit Reviews

1. **Don't ignore all suggestions** - Code Rabbit finds real issues
2. **Fix Critical/High first** - Lower priorities can wait
3. **Add comments for skips** - Explain why you're not fixing something
4. **Learn from patterns** - Code Rabbit highlights common mistakes
5. **Use it as a learning tool** - Improve your code quality over time

### For Agent Fixes

1. **Review agent changes** - Agents aren't perfect, verify fixes
2. **Run tests after fixes** - Ensure agents didn't break anything
3. **Keep agents focused** - Don't overload one agent with all issues
4. **Use parallel agents** - Speed up fixes by running multiple agents
5. **Provide context** - Give agents the full action plan for better fixes

---

## 🚨 Troubleshooting

### Code Rabbit Not Commenting

**Problem:** Code Rabbit hasn't posted any comments yet.

**Solution:**
```bash
# Wait 2-3 minutes for analysis
# Check PR status
gh pr view <pr-number> --json state,statusCheckRollup

# Code Rabbit usually comments within 5 minutes
# If still nothing, check Code Rabbit is enabled in repo settings
```

### Fix Worktree Creation Failed

**Problem:** `git worktree add` fails with "already exists".

**Solution:**
```bash
# Remove existing worktree
git worktree remove ../designdream-worktrees/fix-pr-42 --force

# Clean up references
git worktree prune

# Try again
./scripts/fix-pr-issues.sh 42
```

### Agent Not Finding Files

**Problem:** Agent says files don't exist in worktree.

**Solution:**
```bash
# Verify worktree exists
cd /Users/howdycarter/Documents/projects/designdream-worktrees/fix-pr-42

# Verify files are there
ls -la src/app/api/

# Ensure agent is using correct path
# Path should be: /Users/howdycarter/Documents/projects/designdream-worktrees/fix-pr-42
```

### Push Rejected

**Problem:** `git push` fails with "updates were rejected".

**Solution:**
```bash
# Fetch latest changes
git fetch origin

# Rebase on top of remote branch
git rebase origin/feature/p0-auth-flow

# Resolve conflicts if any
git status
# ... fix conflicts ...
git add .
git rebase --continue

# Force push (use with caution!)
git push origin feature/p0-auth-flow --force-with-lease
```

---

## 📚 Additional Resources

- **GitHub CLI Docs**: https://cli.github.com/manual/
- **Git Worktree Docs**: https://git-scm.com/docs/git-worktree
- **Code Rabbit**: https://coderabbit.ai/docs
- **Conventional Commits**: https://www.conventionalcommits.org/

---

*Last Updated: 2025-11-02*
*Part of Design Dreams project documentation*
