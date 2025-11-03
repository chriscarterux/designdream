# Git Worktree Workflow Guide

## Overview

This project uses **Git Worktrees** to enable parallel development on multiple issues simultaneously. Instead of constantly switching branches and stashing changes, each issue gets its own working directory.

## What Are Git Worktrees?

Git worktrees allow you to check out multiple branches at the same time in different directories. Think of it as having multiple copies of your repo, each on a different branch, but all sharing the same Git history.

**Benefits:**
- Work on multiple features simultaneously
- No more branch switching or stashing
- Run tests in one worktree while developing in another
- Compare implementations side-by-side
- Each worktree has its own node_modules (isolated dependencies)

## Current Worktree Structure

```
/Users/howdycarter/Documents/projects/
├── designdream/                          # Main working tree (main branch)
│   └── .git/                             # Central Git repository
│
└── designdream-worktrees/                # Worktree directory
    ├── p0-supabase-setup/                # Feature: Supabase setup
    │   └── [branch: feature/p0-supabase-setup]
    ├── p0-auth-flow/                     # Feature: Authentication flow
    │   └── [branch: feature/p0-auth-flow]
    ├── p0-landing-page/                  # Feature: Landing page
    │   └── [branch: feature/p0-landing-page]
    ├── p0-dashboard-layout/              # Feature: Dashboard layout
    │   └── [branch: feature/p0-dashboard-layout]
    └── p0-kanban-board/                  # Feature: Kanban board
        └── [branch: feature/p0-kanban-board]
```

## Quick Commands

### List All Worktrees
```bash
git worktree list
```

### Create a New Worktree
```bash
# Basic syntax
git worktree add <path> -b <branch-name>

# Example for a new P0 issue
git worktree add ../designdream-worktrees/p0-stripe-integration -b feature/p0-stripe-integration

# Example for a P1 issue
git worktree add ../designdream-worktrees/p1-notifications -b feature/p1-notifications
```

### Switch to a Worktree
```bash
# Just cd into the directory
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow

# Or use a shortcut (if you create one in your shell)
alias wt-auth='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow'
```

### Remove a Completed Worktree
```bash
# After merging the branch to main
git worktree remove designdream-worktrees/p0-auth-flow

# Or force remove (if you have uncommitted changes)
git worktree remove --force designdream-worktrees/p0-auth-flow

# Clean up the branch after removing worktree
git branch -d feature/p0-auth-flow
```

### Check Worktree Status
```bash
# From any worktree or main directory
git worktree list
```

## Workflow: Creating and Working with Worktrees

### 1. Create Worktree for New Issue

Before starting a new Linear issue:

```bash
# Navigate to main repo
cd /Users/howdycarter/Documents/projects/designdream

# Create worktree with descriptive name
git worktree add ../designdream-worktrees/p0-billing-page -b feature/p0-billing-page

# Navigate to the new worktree
cd ../designdream-worktrees/p0-billing-page
```

### 2. Set Up Development Environment

Each worktree needs its own dependencies:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables (if needed)
cp /Users/howdycarter/Documents/projects/designdream/.env.local .env.local

# Start development server
npm run dev
```

**Note:** Each worktree can run its own dev server on different ports (3000, 3001, 3002, etc.)

### 3. Develop Your Feature

Work normally in the worktree:

```bash
# Make changes
# Run tests
# Commit regularly

git add .
git commit -m "feat: implement billing page UI"
```

### 4. Merge Back to Main

When your feature is complete:

```bash
# Option A: Merge via GitHub PR (recommended)
git push origin feature/p0-billing-page
# Then create PR on GitHub and merge

# Option B: Direct merge
cd /Users/howdycarter/Documents/projects/designdream  # main worktree
git merge feature/p0-billing-page
git push origin main
```

### 5. Clean Up Worktree

After merging:

```bash
cd /Users/howdycarter/Documents/projects/designdream

# Remove the worktree
git worktree remove designdream-worktrees/p0-billing-page

# Delete the branch (if merged)
git branch -d feature/p0-billing-page

# Delete remote branch
git push origin --delete feature/p0-billing-page
```

## Best Practices

### Naming Conventions

Use consistent naming for worktrees and branches:

```bash
# Priority-based naming
p0-<feature-name>    # Critical MVP features
p1-<feature-name>    # Core features
p2-<feature-name>    # Important features
p3-<feature-name>    # Nice-to-have features

# Examples
p0-supabase-setup
p0-auth-flow
p1-notifications
p2-dark-mode
p3-referral-program
```

### Keep Worktrees Focused

- One worktree = One feature/issue
- Don't work on multiple features in one worktree
- Create separate worktrees for bug fixes vs new features

### Regular Syncing

Keep worktrees in sync with main:

```bash
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow

# Fetch latest changes
git fetch origin

# Rebase on main (recommended)
git rebase origin/main

# Or merge main into your branch
git merge origin/main
```

### Managing Node Modules

Each worktree has its own `node_modules`:

```bash
# Initial install in new worktree
npm install --legacy-peer-deps

# Update dependencies when package.json changes
npm install --legacy-peer-deps
```

**Tip:** This can use disk space. Consider removing node_modules in inactive worktrees:

```bash
rm -rf /Users/howdycarter/Documents/projects/designdream-worktrees/p0-completed-feature/node_modules
```

### Handling Shared Files

Some files are shared across all worktrees:
- `.env.local` - Copy manually or symlink
- Configuration files - Shared via Git

**Symlink environment file (optional):**
```bash
ln -s /Users/howdycarter/Documents/projects/designdream/.env.local .env.local
```

## Common Scenarios

### Scenario 1: Working on Multiple Features

You're building auth while also working on the landing page:

```bash
# Terminal 1 - Auth work
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow
npm run dev  # Runs on :3000

# Terminal 2 - Landing page work
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-landing-page
npm run dev  # Runs on :3001
```

### Scenario 2: Testing Production Build

Test a production build without affecting your dev work:

```bash
# Terminal 1 - Keep developing
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow
npm run dev

# Terminal 2 - Test production build
cd /Users/howdycarter/Documents/projects/designdream
npm run build
npm run start
```

### Scenario 3: Reviewing PR While Developing

Check out a PR in a temporary worktree:

```bash
# Create temporary worktree for PR review
git worktree add ../designdream-worktrees/pr-review -b review/pr-123

cd ../designdream-worktrees/pr-review
git pull origin feature-branch-name

# Review, test, then remove
cd ..
git worktree remove pr-review
git branch -d review/pr-123
```

### Scenario 4: Hotfix on Production

Need to fix a bug while working on features:

```bash
# Create hotfix worktree from main
git worktree add ../designdream-worktrees/hotfix-auth-bug -b hotfix/auth-bug

cd ../designdream-worktrees/hotfix-auth-bug

# Fix bug, commit, push
git add .
git commit -m "fix: resolve auth token expiration issue"
git push origin hotfix/auth-bug

# Merge immediately, then remove
cd /Users/howdycarter/Documents/projects/designdream
git merge hotfix/auth-bug
git push origin main

git worktree remove designdream-worktrees/hotfix-auth-bug
git branch -d hotfix/auth-bug
```

## Troubleshooting

### Error: "worktree already exists"

```bash
# List all worktrees to find the conflict
git worktree list

# Remove the conflicting worktree
git worktree remove <path>
```

### Error: "branch already checked out"

You can't check out a branch that's already active in another worktree.

```bash
# List worktrees to see where it's checked out
git worktree list

# Either use that existing worktree, or remove it first
git worktree remove <path>
```

### Stale Worktree References

If a worktree directory was deleted manually:

```bash
# Clean up stale references
git worktree prune

# Verify
git worktree list
```

### Port Conflicts

If you run multiple dev servers:

```bash
# Next.js will auto-increment ports
# First instance: localhost:3000
# Second instance: localhost:3001
# Third instance: localhost:3002
```

Or manually specify ports:

```bash
PORT=3005 npm run dev
```

## Helper Scripts

### Quick Worktree Creation

Add to `/Users/howdycarter/Documents/projects/designdream/scripts/create-worktree.sh`:

```bash
#!/bin/bash
# Usage: ./scripts/create-worktree.sh p0-new-feature

if [ -z "$1" ]; then
  echo "Usage: $0 <feature-name>"
  echo "Example: $0 p0-stripe-integration"
  exit 1
fi

FEATURE_NAME=$1
BRANCH_NAME="feature/${FEATURE_NAME}"
WORKTREE_PATH="/Users/howdycarter/Documents/projects/designdream-worktrees/${FEATURE_NAME}"

echo "Creating worktree for: ${FEATURE_NAME}"
echo "Branch: ${BRANCH_NAME}"
echo "Path: ${WORKTREE_PATH}"

cd /Users/howdycarter/Documents/projects/designdream
git worktree add "${WORKTREE_PATH}" -b "${BRANCH_NAME}"

echo ""
echo "✅ Worktree created!"
echo ""
echo "Next steps:"
echo "  cd ${WORKTREE_PATH}"
echo "  npm install --legacy-peer-deps"
echo "  npm run dev"
```

### List Active Worktrees

Add to `/Users/howdycarter/Documents/projects/designdream/scripts/list-worktrees.sh`:

```bash
#!/bin/bash
echo "Active Git Worktrees:"
echo ""
git worktree list
echo ""
echo "Total worktrees: $(git worktree list | wc -l)"
```

### Cleanup Merged Worktrees

Add to `/Users/howdycarter/Documents/projects/designdream/scripts/cleanup-worktrees.sh`:

```bash
#!/bin/bash
# Removes worktrees for branches that have been merged to main

cd /Users/howdycarter/Documents/projects/designdream

echo "Checking for merged branches..."

# Get list of merged branches
MERGED_BRANCHES=$(git branch --merged main | grep -v "main" | grep "feature/" | sed 's/^[ *]*//')

if [ -z "$MERGED_BRANCHES" ]; then
  echo "No merged feature branches found."
  exit 0
fi

echo "Found merged branches:"
echo "$MERGED_BRANCHES"
echo ""

for branch in $MERGED_BRANCHES; do
  # Extract feature name from branch
  FEATURE_NAME=$(echo $branch | sed 's/feature\///')
  WORKTREE_PATH="/Users/howdycarter/Documents/projects/designdream-worktrees/${FEATURE_NAME}"

  if [ -d "$WORKTREE_PATH" ]; then
    echo "Removing worktree: ${FEATURE_NAME}"
    git worktree remove "$WORKTREE_PATH" 2>/dev/null || echo "  Skipping (may have uncommitted changes)"
  fi

  echo "Deleting branch: ${branch}"
  git branch -d "$branch" 2>/dev/null || echo "  Branch already deleted"
done

echo ""
echo "Cleanup complete!"
git worktree list
```

## Tips & Tricks

### VS Code Integration

Open multiple worktrees in VS Code workspaces:

1. Create a workspace file: `designdream.code-workspace`
2. Add each worktree as a folder:

```json
{
  "folders": [
    { "path": "/Users/howdycarter/Documents/projects/designdream" },
    { "path": "/Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow" },
    { "path": "/Users/howdycarter/Documents/projects/designdream-worktrees/p0-landing-page" }
  ],
  "settings": {}
}
```

### Shell Aliases

Add to your `.zshrc` or `.bashrc`:

```bash
# Worktree shortcuts
alias wt-list='git worktree list'
alias wt-main='cd /Users/howdycarter/Documents/projects/designdream'
alias wt-auth='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow'
alias wt-landing='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-landing-page'
alias wt-dashboard='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-dashboard-layout'
alias wt-kanban='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-kanban-board'
alias wt-supabase='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-supabase-setup'

# Quick worktree creation
function wt-create() {
  cd /Users/howdycarter/Documents/projects/designdream
  ./scripts/create-worktree.sh "$1"
}

# Quick cleanup
alias wt-cleanup='cd /Users/howdycarter/Documents/projects/designdream && ./scripts/cleanup-worktrees.sh'
```

### Disk Space Management

Monitor disk usage:

```bash
# Check size of all worktrees
du -sh /Users/howdycarter/Documents/projects/designdream-worktrees/*

# Remove node_modules from inactive worktrees
find /Users/howdycarter/Documents/projects/designdream-worktrees -name "node_modules" -type d -prune -exec rm -rf '{}' +
```

## Current Active Worktrees

### P0 (Critical) - MVP Blockers

1. **p0-supabase-setup** (`feature/p0-supabase-setup`)
   - Set up Supabase project and database
   - Deploy schema, configure RLS, set up auth
   - Estimate: 2 hours

2. **p0-auth-flow** (`feature/p0-auth-flow`)
   - Implement authentication flow
   - Magic link login, signup, protected routes
   - Estimate: 4 hours

3. **p0-landing-page** (`feature/p0-landing-page`)
   - Build landing page with pricing
   - Hero, features, pricing, FAQ
   - Estimate: 6 hours

4. **p0-dashboard-layout** (`feature/p0-dashboard-layout`)
   - Build client dashboard layout
   - Sidebar, navigation, responsive design
   - Estimate: 4 hours

5. **p0-kanban-board** (`feature/p0-kanban-board`)
   - Build Kanban queue board
   - Drag-and-drop, 5 columns, request cards
   - Estimate: 6 hours

## Next Steps

1. **Install dependencies** in each worktree you want to use:
   ```bash
   cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow
   npm install --legacy-peer-deps
   ```

2. **Copy environment variables** to active worktrees:
   ```bash
   cp /Users/howdycarter/Documents/projects/designdream/.env.local \
      /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow/.env.local
   ```

3. **Start developing** in your chosen worktree:
   ```bash
   cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow
   npm run dev
   ```

4. **Make the helper scripts executable**:
   ```bash
   chmod +x /Users/howdycarter/Documents/projects/designdream/scripts/*.sh
   ```

## Resources

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Linear Issue Backlog](/Users/howdycarter/Documents/obsidian-vaults/howdycarter/01_PROJECTS/Design Dreams/technical-docs/Linear-Issue-Backlog.md)
- [Technical README](/Users/howdycarter/Documents/projects/designdream/TECHNICAL-README.md)

---

**Last Updated:** 2025-11-03
**Status:** Active - 5 worktrees created for P0 issues
