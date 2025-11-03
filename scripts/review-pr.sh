#!/bin/bash

# Design Dreams - Automated PR Review Script
# Reviews Code Rabbit comments and dispatches fix agents to worktrees

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PR_NUMBER=$1

if [ -z "$PR_NUMBER" ]; then
  echo -e "${RED}❌ Error: PR number required${NC}"
  echo "Usage: ./scripts/review-pr.sh <pr-number>"
  exit 1
fi

echo -e "${BLUE}🔍 Reviewing PR #${PR_NUMBER}...${NC}\n"

# Step 1: Fetch PR details
echo -e "${GREEN}📋 Step 1: Fetching PR details...${NC}"
gh pr view $PR_NUMBER --json title,headRefName,baseRefName,url,author,body > /tmp/pr-${PR_NUMBER}.json

PR_TITLE=$(jq -r '.title' /tmp/pr-${PR_NUMBER}.json)
PR_BRANCH=$(jq -r '.headRefName' /tmp/pr-${PR_NUMBER}.json)
PR_URL=$(jq -r '.url' /tmp/pr-${PR_NUMBER}.json)
PR_AUTHOR=$(jq -r '.author.login' /tmp/pr-${PR_NUMBER}.json)

echo -e "  ${BLUE}Title:${NC} $PR_TITLE"
echo -e "  ${BLUE}Branch:${NC} $PR_BRANCH"
echo -e "  ${BLUE}Author:${NC} $PR_AUTHOR"
echo -e "  ${BLUE}URL:${NC} $PR_URL\n"

# Step 2: Fetch Code Rabbit comments
echo -e "${GREEN}🤖 Step 2: Fetching Code Rabbit comments...${NC}"
gh pr view $PR_NUMBER --comments --json comments > /tmp/pr-${PR_NUMBER}-comments.json

CODE_RABBIT_COMMENTS=$(jq '[.comments[] | select(.author.login == "coderabbitai")]' /tmp/pr-${PR_NUMBER}-comments.json)
COMMENT_COUNT=$(echo "$CODE_RABBIT_COMMENTS" | jq 'length')

if [ "$COMMENT_COUNT" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  No Code Rabbit comments found yet.${NC}"
  echo -e "${YELLOW}   Code Rabbit may still be analyzing this PR.${NC}"
  echo -e "${YELLOW}   Wait a few minutes and try again.${NC}\n"
  exit 0
fi

echo -e "  ${BLUE}Found:${NC} $COMMENT_COUNT Code Rabbit comment(s)\n"

# Step 3: Save comments for agent analysis
echo -e "${GREEN}📝 Step 3: Preparing comments for agent analysis...${NC}"
echo "$CODE_RABBIT_COMMENTS" > /tmp/pr-${PR_NUMBER}-coderabbit.json

# Step 4: Create analysis prompt for agent
cat > /tmp/pr-${PR_NUMBER}-analysis-prompt.txt <<EOF
Analyze the Code Rabbit comments for PR #${PR_NUMBER}:

**PR Details:**
- Title: $PR_TITLE
- Branch: $PR_BRANCH
- Author: $PR_AUTHOR
- URL: $PR_URL

**Code Rabbit Comments:**
$(cat /tmp/pr-${PR_NUMBER}-coderabbit.json | jq -r '.[] | "\n---\nComment by: \(.author.login)\nPosted: \(.createdAt)\n\(.body)\n"')

**Your Task:**

1. **Categorize Issues** by severity:
   - 🔴 Critical (must fix before merge): Security, bugs, breaking changes
   - 🟡 High (should fix): Code quality, performance, best practices
   - 🟢 Medium (nice to have): Style, minor improvements, suggestions
   - ⚪ Low/Ignore (false positives): Comments that don't apply

2. **Create Action Plan** with:
   - Issue category
   - File and line numbers affected
   - Description of the issue
   - Recommended fix approach
   - Which specialized agent should handle it:
     * security-auditor (security issues)
     * backend-architect (backend code)
     * frontend-developer (UI/components)
     * test-writer-fixer (tests)
     * code-reviewer (general code quality)

3. **Prioritize** the fixes in execution order

4. **Estimate** time to fix all issues (in hours)

**Output Format:**

Provide a structured action plan in markdown format that can be saved as PR-${PR_NUMBER}-ACTION-PLAN.md
EOF

echo -e "  ${BLUE}Analysis prompt:${NC} /tmp/pr-${PR_NUMBER}-analysis-prompt.txt\n"

# Step 5: Launch agent for analysis
echo -e "${GREEN}🚀 Step 5: Launching code review agent...${NC}"
echo -e "${YELLOW}📌 This will be done via Claude Code${NC}\n"

# Step 6: Instructions for next steps
cat <<EOF
${BLUE}══════════════════════════════════════════════════════════════${NC}
${GREEN}✅ PR review preparation complete!${NC}

${BLUE}Next Steps:${NC}

1. ${YELLOW}Review the analysis prompt:${NC}
   cat /tmp/pr-${PR_NUMBER}-analysis-prompt.txt

2. ${YELLOW}Launch Claude Code agent to analyze:${NC}
   Use the 'code-reviewer' agent with the prompt above

3. ${YELLOW}Agent will create an action plan:${NC}
   PR-${PR_NUMBER}-ACTION-PLAN.md

4. ${YELLOW}Review and approve the plan${NC}

5. ${YELLOW}Run the fix script:${NC}
   ./scripts/fix-pr-issues.sh ${PR_NUMBER}

${BLUE}Quick Commands:${NC}
   View PR:       gh pr view ${PR_NUMBER}
   View comments: gh pr view ${PR_NUMBER} --comments
   View diff:     gh pr diff ${PR_NUMBER}

${BLUE}═══════════════════════════════════════════════════════════════${NC}
EOF

# Create a marker file for the fix script
echo "$PR_NUMBER|$PR_BRANCH|$PR_URL" > /tmp/pr-${PR_NUMBER}-ready.txt

exit 0
