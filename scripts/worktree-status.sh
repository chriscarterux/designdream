#!/bin/bash

# worktree-status.sh
# Shows status of all worktrees including uncommitted changes
# Usage: ./scripts/worktree-status.sh

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}Worktree Status Report${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get list of all worktrees
WORKTREE_LIST=$(git worktree list --porcelain)

# Parse worktrees
CURRENT_PATH=""
CURRENT_BRANCH=""

while IFS= read -r line; do
  if [[ $line == worktree* ]]; then
    # If we have a previous worktree, check its status
    if [[ -n "$CURRENT_PATH" ]]; then
      check_worktree_status "$CURRENT_PATH" "$CURRENT_BRANCH"
    fi

    CURRENT_PATH=$(echo "$line" | awk '{print $2}')
  elif [[ $line == branch* ]]; then
    CURRENT_BRANCH=$(echo "$line" | awk '{print $2}' | sed 's|refs/heads/||')
  fi
done <<< "$WORKTREE_LIST"

# Check the last worktree
if [[ -n "$CURRENT_PATH" ]]; then
  check_worktree_status "$CURRENT_PATH" "$CURRENT_BRANCH"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to check individual worktree status
check_worktree_status() {
  local path=$1
  local branch=$2
  local name=$(basename "$path")

  echo -e "${GREEN}📁 ${name}${NC}"
  echo -e "   Branch: ${YELLOW}${branch}${NC}"
  echo -e "   Path:   ${path}"

  # Change to worktree directory
  cd "$path"

  # Check if there are uncommitted changes
  if [[ -n $(git status --porcelain) ]]; then
    echo -e "   Status: ${RED}⚠ Uncommitted changes${NC}"

    # Count changes
    MODIFIED=$(git status --porcelain | grep "^ M" | wc -l | xargs)
    ADDED=$(git status --porcelain | grep "^A" | wc -l | xargs)
    DELETED=$(git status --porcelain | grep "^ D" | wc -l | xargs)
    UNTRACKED=$(git status --porcelain | grep "^??" | wc -l | xargs)

    echo -e "   Changes:"
    if [ "$MODIFIED" != "0" ]; then
      echo -e "     ${YELLOW}Modified: ${MODIFIED}${NC}"
    fi
    if [ "$ADDED" != "0" ]; then
      echo -e "     ${GREEN}Added: ${ADDED}${NC}"
    fi
    if [ "$DELETED" != "0" ]; then
      echo -e "     ${RED}Deleted: ${DELETED}${NC}"
    fi
    if [ "$UNTRACKED" != "0" ]; then
      echo -e "     ${CYAN}Untracked: ${UNTRACKED}${NC}"
    fi
  else
    echo -e "   Status: ${GREEN}✓ Clean${NC}"
  fi

  # Check commits ahead of main
  AHEAD=$(git rev-list --count main..${branch} 2>/dev/null || echo "0")
  if [ "$AHEAD" != "0" ]; then
    echo -e "   Commits ahead of main: ${CYAN}${AHEAD}${NC}"
  fi

  # Check if dev server is running
  if lsof -i :3000-3010 2>/dev/null | grep -q "node"; then
    echo -e "   Dev server: ${GREEN}⚡ Running${NC}"
  fi

  echo ""
}

export -f check_worktree_status
