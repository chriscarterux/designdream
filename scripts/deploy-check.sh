#!/bin/bash

# ============================================
# DesignDream Pre-Deployment Validation Script
# ============================================
# Run this before deploying to production
# Usage: ./scripts/deploy-check.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}DesignDream Pre-Deployment Validation${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Function to print section header
print_section() {
    echo -e "${BLUE}➜ $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASSED++))
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((FAILED++))
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

# ============================================
# 1. Environment Check
# ============================================
print_section "1. Environment Validation"

# Check Node version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"

    # Check if version is >= 18
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        print_success "Node.js version compatible (>= 18)"
    else
        print_error "Node.js version too old. Requires >= 18.x"
    fi
else
    print_error "Node.js not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not installed"
fi

echo ""

# ============================================
# 2. Dependencies Check
# ============================================
print_section "2. Dependencies Validation"

if [ -f "package-lock.json" ]; then
    print_success "package-lock.json exists"
else
    print_warning "package-lock.json not found"
fi

if [ -d "node_modules" ]; then
    print_success "node_modules directory exists"
else
    print_warning "node_modules not installed. Run: npm install"
fi

echo ""

# ============================================
# 3. TypeScript Check
# ============================================
print_section "3. TypeScript Validation"

echo "Running TypeScript type check..."
if npm run type-check &> /dev/null; then
    print_success "TypeScript types valid"
else
    print_error "TypeScript type errors found. Run: npm run type-check"
fi

echo ""

# ============================================
# 4. Build Check
# ============================================
print_section "4. Build Validation"

echo "Running production build..."
if npm run build &> /dev/null; then
    print_success "Production build successful"
else
    print_error "Production build failed. Run: npm run build"
fi

echo ""

# ============================================
# 5. Lint Check
# ============================================
print_section "5. Linting Validation"

echo "Running ESLint..."
if npm run lint &> /dev/null; then
    print_success "No linting errors"
else
    print_error "Linting errors found. Run: npm run lint"
fi

echo ""

# ============================================
# 6. Environment Variables Check
# ============================================
print_section "6. Environment Variables Validation"

# Check if .env.production.example exists
if [ -f ".env.production.example" ]; then
    print_success ".env.production.example exists"
else
    print_warning ".env.production.example not found"
fi

# Check for required variables in .env.local (for reference)
if [ -f ".env.local" ]; then
    print_success ".env.local exists"

    # Required variables
    REQUIRED_VARS=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        "STRIPE_SECRET_KEY"
        "STRIPE_WEBHOOK_SECRET"
        "RESEND_API_KEY"
        "NEXT_PUBLIC_APP_URL"
    )

    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env.local 2>/dev/null; then
            if grep "^$var=.*placeholder" .env.local &>/dev/null || grep "^$var=$" .env.local &>/dev/null; then
                print_warning "$var is placeholder or empty"
            else
                print_success "$var is set"
            fi
        else
            print_warning "$var not found in .env.local"
        fi
    done
else
    print_warning ".env.local not found (expected for local dev)"
fi

echo ""

# ============================================
# 7. Security Check
# ============================================
print_section "7. Security Validation"

# Check for sensitive data in code
echo "Scanning for potential secrets in code..."

SENSITIVE_PATTERNS=(
    "sk_live_"
    "pk_live_"
    "whsec_"
    "password.*=.*['\"]"
    "secret.*=.*['\"]"
    "api_key.*=.*['\"]"
)

FOUND_SECRETS=false
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if grep -r "$pattern" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" &>/dev/null; then
        print_error "Potential secret found matching: $pattern"
        FOUND_SECRETS=true
    fi
done

if [ "$FOUND_SECRETS" = false ]; then
    print_success "No obvious secrets found in code"
fi

# Check for console.log in production code
if grep -r "console\\.log" src/ --include="*.ts" --include="*.tsx" --exclude="*.test.*" &>/dev/null; then
    print_warning "console.log found in source code"
else
    print_success "No console.log in production code"
fi

# Check for debugger statements
if grep -r "debugger" src/ --include="*.ts" --include="*.tsx" &>/dev/null; then
    print_error "debugger statements found in code"
else
    print_success "No debugger statements"
fi

echo ""

# ============================================
# 8. File Structure Check
# ============================================
print_section "8. File Structure Validation"

REQUIRED_FILES=(
    "package.json"
    "next.config.mjs"
    "tsconfig.json"
    "vercel.json"
    ".vercelignore"
    ".env.production.example"
    "DEPLOYMENT.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file exists"
    else
        print_error "$file missing"
    fi
done

echo ""

# ============================================
# 9. Git Status Check
# ============================================
print_section "9. Git Status Validation"

if git rev-parse --git-dir > /dev/null 2>&1; then
    print_success "Git repository initialized"

    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Uncommitted changes found"
        echo "  Run: git status"
    else
        print_success "No uncommitted changes"
    fi

    # Check current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    print_success "Current branch: $CURRENT_BRANCH"

    if [ "$CURRENT_BRANCH" = "main" ]; then
        print_success "On main branch (ready for production deploy)"
    else
        print_warning "Not on main branch (will deploy as preview)"
    fi
else
    print_error "Not a git repository"
fi

echo ""

# ============================================
# 10. Vercel Configuration Check
# ============================================
print_section "10. Vercel Configuration Validation"

if [ -f "vercel.json" ]; then
    # Check if valid JSON
    if python3 -m json.tool vercel.json &> /dev/null; then
        print_success "vercel.json is valid JSON"
    else
        print_error "vercel.json is invalid JSON"
    fi
else
    print_warning "vercel.json not found"
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    print_success "Vercel CLI installed"
else
    print_warning "Vercel CLI not installed. Install: npm i -g vercel"
fi

echo ""

# ============================================
# 11. Database Check
# ============================================
print_section "11. Database Validation"

# Check for migration files
if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(find supabase/migrations -name "*.sql" | wc -l)
    print_success "Found $MIGRATION_COUNT migration files"
else
    print_warning "No migration directory found"
fi

echo ""

# ============================================
# Summary
# ============================================
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}Validation Summary${NC}"
echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}Passed:   $PASSED${NC}"
echo -e "${RED}Failed:   $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "To deploy to production:"
    echo "  1. Commit any remaining changes"
    echo "  2. Push to main branch: git push origin main"
    echo "  3. Or deploy via CLI: vercel --prod"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Deployment validation failed!${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    echo ""
    exit 1
fi
