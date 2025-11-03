#!/bin/bash

# create-worktree.sh
# Creates a new git worktree for a feature branch
# Usage: ./scripts/create-worktree.sh <feature-name>
# Example: ./scripts/create-worktree.sh p0-stripe-integration

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if feature name provided
if [ -z "$1" ]; then
  echo "Usage: $0 <feature-name>"
  echo ""
  echo "Examples:"
  echo "  $0 p0-stripe-integration"
  echo "  $0 p1-notifications"
  echo "  $0 p2-dark-mode"
  echo ""
  echo "Naming convention:"
  echo "  p0-<name>  Critical/MVP features"
  echo "  p1-<name>  Core features"
  echo "  p2-<name>  Important features"
  echo "  p3-<name>  Nice-to-have features"
  exit 1
fi

FEATURE_NAME=$1
BRANCH_NAME="feature/${FEATURE_NAME}"
WORKTREE_BASE="/Users/howdycarter/Documents/projects/designdream-worktrees"
WORKTREE_PATH="${WORKTREE_BASE}/${FEATURE_NAME}"
MAIN_REPO="/Users/howdycarter/Documents/projects/designdream"

echo ""
echo -e "${BLUE}Creating worktree for: ${FEATURE_NAME}${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Branch:     ${BRANCH_NAME}"
echo "Path:       ${WORKTREE_PATH}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Navigate to main repo
cd "${MAIN_REPO}"

# Create worktree
git worktree add "${WORKTREE_PATH}" -b "${BRANCH_NAME}"

echo ""
echo -e "${GREEN}✅ Worktree created successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Navigate to worktree:"
echo "     ${BLUE}cd ${WORKTREE_PATH}${NC}"
echo ""
echo "  2. Install dependencies:"
echo "     ${BLUE}npm install --legacy-peer-deps${NC}"
echo ""
echo "  3. Copy environment variables (if needed):"
echo "     ${BLUE}cp ${MAIN_REPO}/.env.local .env.local${NC}"
echo ""
echo "  4. Start development:"
echo "     ${BLUE}npm run dev${NC}"
echo ""
echo -e "${YELLOW}Tip:${NC} Create a shell alias for quick access:"
echo "  ${BLUE}alias wt-${FEATURE_NAME}='cd ${WORKTREE_PATH}'${NC}"
echo ""
