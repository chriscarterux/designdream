#!/bin/bash

# cleanup-worktrees.sh
# Removes worktrees for branches that have been merged to main
# Usage: ./scripts/cleanup-worktrees.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

MAIN_REPO="/Users/howdycarter/Documents/projects/designdream"
WORKTREE_BASE="/Users/howdycarter/Documents/projects/designdream-worktrees"

echo ""
echo -e "${BLUE}Cleaning up merged worktrees...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Navigate to main repo
cd "${MAIN_REPO}"

# Update from remote
echo "Fetching latest changes from remote..."
git fetch origin --prune
echo ""

# Get list of merged branches (exclude main and current branch)
MERGED_BRANCHES=$(git branch --merged main | grep -v "main" | grep -v "^\*" | sed 's/^[ *]*//' || true)

if [ -z "$MERGED_BRANCHES" ]; then
  echo -e "${GREEN}✅ No merged branches found. Nothing to clean up!${NC}"
  echo ""
  git worktree list
  echo ""
  exit 0
fi

echo -e "${YELLOW}Found merged branches:${NC}"
echo "$MERGED_BRANCHES"
echo ""

REMOVED_COUNT=0
SKIPPED_COUNT=0

for branch in $MERGED_BRANCHES; do
  # Extract feature name from branch
  if [[ $branch == feature/* ]]; then
    FEATURE_NAME=$(echo "$branch" | sed 's|feature/||')
    WORKTREE_PATH="${WORKTREE_BASE}/${FEATURE_NAME}"

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "Processing: ${YELLOW}${FEATURE_NAME}${NC}"

    # Check if worktree exists
    if [ -d "$WORKTREE_PATH" ]; then
      echo "  Worktree path: ${WORKTREE_PATH}"

      # Try to remove worktree
      if git worktree remove "$WORKTREE_PATH" 2>/dev/null; then
        echo -e "  ${GREEN}✓ Worktree removed${NC}"
        ((REMOVED_COUNT++))
      else
        echo -e "  ${RED}✗ Skipped (uncommitted changes or in use)${NC}"
        echo "    Run manually: git worktree remove --force ${WORKTREE_PATH}"
        ((SKIPPED_COUNT++))
        continue
      fi
    else
      echo "  No worktree found at expected path"
    fi

    # Delete the branch
    if git branch -d "$branch" 2>/dev/null; then
      echo -e "  ${GREEN}✓ Branch deleted${NC}"
    else
      echo -e "  ${YELLOW}⚠ Branch already deleted or protected${NC}"
    fi

    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Cleanup Summary:${NC}"
echo "  Removed: ${REMOVED_COUNT} worktree(s)"
echo "  Skipped: ${SKIPPED_COUNT} worktree(s)"
echo ""

# Prune any stale references
echo "Pruning stale worktree references..."
git worktree prune
echo ""

echo -e "${BLUE}Current worktrees:${NC}"
git worktree list
echo ""

if [ $SKIPPED_COUNT -gt 0 ]; then
  echo -e "${YELLOW}Note:${NC} Some worktrees were skipped due to uncommitted changes."
  echo "Review them and remove manually if needed using:"
  echo -e "  ${BLUE}git worktree remove --force <path>${NC}"
  echo ""
fi
