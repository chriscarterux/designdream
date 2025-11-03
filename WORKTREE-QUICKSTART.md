# Git Worktree Quick Reference

## Quick Commands

### List all worktrees
```bash
./scripts/list-worktrees.sh
# or
git worktree list
```

### Create new worktree
```bash
./scripts/create-worktree.sh p0-feature-name
# or manually
git worktree add ../designdream-worktrees/p0-feature-name -b feature/p0-feature-name
```

### Switch to a worktree
```bash
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow
```

### Remove completed worktree
```bash
git worktree remove designdream-worktrees/p0-feature-name
git branch -d feature/p0-feature-name
```

### Clean up merged worktrees
```bash
./scripts/cleanup-worktrees.sh
```

### Check worktree status
```bash
./scripts/worktree-status.sh
```

## Current Active Worktrees

1. **p0-supabase-setup** - Supabase project and database setup
   ```bash
   cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-supabase-setup
   ```

2. **p0-auth-flow** - Authentication implementation
   ```bash
   cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow
   ```

3. **p0-landing-page** - Landing page with pricing
   ```bash
   cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-landing-page
   ```

4. **p0-dashboard-layout** - Client dashboard layout
   ```bash
   cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-dashboard-layout
   ```

5. **p0-kanban-board** - Kanban queue board
   ```bash
   cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-kanban-board
   ```

## First Time Setup (per worktree)

When you start working in a new worktree:

```bash
# 1. Navigate to worktree
cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Copy environment variables
cp /Users/howdycarter/Documents/projects/designdream/.env.local .env.local

# 4. Start dev server
npm run dev
```

## Shell Aliases (Optional)

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# Main repo
alias wt-main='cd /Users/howdycarter/Documents/projects/designdream'

# Active worktrees
alias wt-supabase='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-supabase-setup'
alias wt-auth='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-auth-flow'
alias wt-landing='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-landing-page'
alias wt-dashboard='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-dashboard-layout'
alias wt-kanban='cd /Users/howdycarter/Documents/projects/designdream-worktrees/p0-kanban-board'

# Utilities
alias wt-list='/Users/howdycarter/Documents/projects/designdream/scripts/list-worktrees.sh'
alias wt-status='/Users/howdycarter/Documents/projects/designdream/scripts/worktree-status.sh'
```

Then reload your shell: `source ~/.zshrc`

## Common Workflows

### Start working on a new issue
```bash
# Create worktree
./scripts/create-worktree.sh p1-notifications

# Navigate and set up
cd ../designdream-worktrees/p1-notifications
npm install --legacy-peer-deps
cp /Users/howdycarter/Documents/projects/designdream/.env.local .env.local
npm run dev
```

### Merge completed work
```bash
# Push branch
git push origin feature/p1-notifications

# Create PR on GitHub, review, and merge

# Back in main repo
cd /Users/howdycarter/Documents/projects/designdream
git pull origin main

# Clean up
./scripts/cleanup-worktrees.sh
```

### Work on multiple features simultaneously
```bash
# Terminal 1 - Auth work
wt-auth
npm run dev  # Runs on :3000

# Terminal 2 - Landing page
wt-landing
npm run dev  # Runs on :3001

# Terminal 3 - Dashboard
wt-dashboard
npm run dev  # Runs on :3002
```

## Troubleshooting

### "Port already in use"
Next.js auto-increments: 3000 → 3001 → 3002
Or set manually: `PORT=3005 npm run dev`

### "Branch already checked out"
That branch is in another worktree. List all: `git worktree list`

### Stale worktree references
```bash
git worktree prune
```

### Remove node_modules to save space
```bash
rm -rf /Users/howdycarter/Documents/projects/designdream-worktrees/*/node_modules
```

## Full Documentation

For comprehensive guide, see: [WORKTREE-GUIDE.md](./WORKTREE-GUIDE.md)

---

**Quick Help:**
```bash
./scripts/list-worktrees.sh       # Show all worktrees
./scripts/create-worktree.sh      # Create new (shows usage)
./scripts/cleanup-worktrees.sh    # Clean up merged
./scripts/worktree-status.sh      # Show status of all
```
