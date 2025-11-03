#!/bin/bash

# Design Dreams - Automated PR Fix Script
# Dispatches agents to worktrees to fix Code Rabbit issues

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PR_NUMBER=$1
ACTION_PLAN="PR-${PR_NUMBER}-ACTION-PLAN.md"

if [ -z "$PR_NUMBER" ]; then
  echo -e "${RED}❌ Error: PR number required${NC}"
  echo "Usage: ./scripts/fix-pr-issues.sh <pr-number>"
  exit 1
fi

if [ ! -f "/tmp/pr-${PR_NUMBER}-ready.txt" ]; then
  echo -e "${RED}❌ Error: PR not prepared${NC}"
  echo "Run ./scripts/review-pr.sh $PR_NUMBER first"
  exit 1
fi

if [ ! -f "$ACTION_PLAN" ]; then
  echo -e "${RED}❌ Error: Action plan not found${NC}"
  echo "Expected file: $ACTION_PLAN"
  echo "Create this file with the code review agent analysis first"
  exit 1
fi

# Read PR details
PR_INFO=$(cat /tmp/pr-${PR_NUMBER}-ready.txt)
PR_BRANCH=$(echo $PR_INFO | cut -d'|' -f2)
PR_URL=$(echo $PR_INFO | cut -d'|' -f3)

echo -e "${BLUE}🔧 Fixing issues for PR #${PR_NUMBER}${NC}"
echo -e "${BLUE}Branch:${NC} $PR_BRANCH"
echo -e "${BLUE}Action Plan:${NC} $ACTION_PLAN\n"

# Show action plan summary
echo -e "${GREEN}📋 Action Plan Summary:${NC}"
cat $ACTION_PLAN | head -30
echo -e "\n${YELLOW}... (see $ACTION_PLAN for full details)${NC}\n"

# Confirm before proceeding
read -p "$(echo -e ${YELLOW}Proceed with fixes? [y/N]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}❌ Aborted${NC}"
  exit 0
fi

# Create fix worktree
WORKTREE_NAME="fix-pr-${PR_NUMBER}"
WORKTREE_PATH="../designdream-worktrees/${WORKTREE_NAME}"

echo -e "\n${GREEN}🌲 Creating fix worktree...${NC}"
echo -e "  ${BLUE}Name:${NC} $WORKTREE_NAME"
echo -e "  ${BLUE}Path:${NC} $WORKTREE_PATH"
echo -e "  ${BLUE}Branch:${NC} $PR_BRANCH\n"

# Check if worktree already exists
if [ -d "$WORKTREE_PATH" ]; then
  echo -e "${YELLOW}⚠️  Worktree already exists. Removing...${NC}"
  git worktree remove $WORKTREE_PATH --force
fi

# Create the worktree from PR branch
git fetch origin
git worktree add -b ${WORKTREE_NAME} $WORKTREE_PATH origin/$PR_BRANCH

cd $WORKTREE_PATH

echo -e "${GREEN}✅ Worktree created${NC}\n"

# Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm install --legacy-peer-deps --silent

# Copy environment
echo -e "${GREEN}🔐 Copying environment variables...${NC}"
cp /Users/howdycarter/Documents/projects/designdream/.env.local .env.local

echo -e "${GREEN}✅ Environment ready${NC}\n"

# Now hand off to agents
cat <<EOF
${BLUE}══════════════════════════════════════════════════════════════${NC}
${GREEN}✅ Fix worktree ready!${NC}

${BLUE}Location:${NC} $WORKTREE_PATH

${BLUE}Next Steps:${NC}

1. ${YELLOW}Launch specialized agents in Claude Code${NC}

   Based on your action plan, launch appropriate agents:

   ${GREEN}For security issues:${NC}
   - Use 'security-auditor' agent
   - Point it to: $WORKTREE_PATH
   - Reference: $ACTION_PLAN

   ${GREEN}For backend code:${NC}
   - Use 'backend-architect' agent
   - Point it to: $WORKTREE_PATH
   - Reference: $ACTION_PLAN

   ${GREEN}For frontend code:${NC}
   - Use 'frontend-developer' agent
   - Point it to: $WORKTREE_PATH
   - Reference: $ACTION_PLAN

   ${GREEN}For test issues:${NC}
   - Use 'test-writer-fixer' agent
   - Point it to: $WORKTREE_PATH
   - Reference: $ACTION_PLAN

2. ${YELLOW}Agents will:${NC}
   - Read the action plan
   - Fix assigned issues
   - Run tests
   - Commit changes to $PR_BRANCH

3. ${YELLOW}After all agents complete:${NC}
   cd $WORKTREE_PATH
   git push origin $PR_BRANCH

4. ${YELLOW}Code Rabbit will re-review automatically${NC}

5. ${YELLOW}Clean up when done:${NC}
   cd /Users/howdycarter/Documents/projects/designdream
   ./scripts/cleanup-worktrees.sh

${BLUE}Quick Commands:${NC}
   Navigate:   cd $WORKTREE_PATH
   Dev server: npm run dev
   Run tests:  npm test
   View PR:    gh pr view ${PR_NUMBER}
   Push:       git push origin $PR_BRANCH

${BLUE}══════════════════════════════════════════════════════════════${NC}
EOF

exit 0
