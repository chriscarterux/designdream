#!/bin/bash

# list-worktrees.sh
# Lists all active git worktrees with helpful information
# Usage: ./scripts/list-worktrees.sh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}Active Git Worktrees${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get worktree list
WORKTREES=$(git worktree list --porcelain)

# Parse and display worktrees
while IFS= read -r line; do
  if [[ $line == worktree* ]]; then
    WORKTREE_PATH=$(echo "$line" | awk '{print $2}')
  elif [[ $line == branch* ]]; then
    BRANCH=$(echo "$line" | awk '{print $2}' | sed 's|refs/heads/||')

    # Get worktree name from path
    WORKTREE_NAME=$(basename "$WORKTREE_PATH")

    # Check if it's the main worktree
    if [[ $BRANCH == "main" ]]; then
      echo -e "${GREEN}📁 ${WORKTREE_NAME}${NC} ${CYAN}(main branch)${NC}"
    else
      echo -e "${GREEN}📁 ${WORKTREE_NAME}${NC}"
      echo -e "   Branch: ${YELLOW}${BRANCH}${NC}"
    fi

    echo -e "   Path:   ${WORKTREE_PATH}"

    # Check if node_modules exists
    if [ -d "${WORKTREE_PATH}/node_modules" ]; then
      SIZE=$(du -sh "${WORKTREE_PATH}/node_modules" 2>/dev/null | awk '{print $1}')
      echo -e "   Size:   ${SIZE} (with node_modules)"
    else
      echo -e "   Size:   No node_modules installed"
    fi

    echo ""
  fi
done <<< "$WORKTREES"

# Count total worktrees
TOTAL=$(git worktree list | wc -l | xargs)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Total worktrees: ${TOTAL}${NC}"
echo ""

# Show quick access tips
echo -e "${YELLOW}Quick access:${NC}"
echo -e "  Main repo:      ${BLUE}cd /Users/howdycarter/Documents/projects/designdream${NC}"
echo -e "  Worktree dir:   ${BLUE}cd /Users/howdycarter/Documents/projects/designdream-worktrees${NC}"
echo ""
