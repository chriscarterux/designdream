#!/bin/bash

# RLS Policy Test Runner
# This script runs the RLS test suite against the Supabase database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "========================================="
echo "RLS Policy Test Suite"
echo "========================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI not found${NC}"
    echo "Please install it: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo -e "${RED}Error: Not in a Supabase project directory${NC}"
    echo "Please run this script from the project root"
    exit 1
fi

# Check if local Supabase is running
if ! supabase status &> /dev/null; then
    echo -e "${YELLOW}Local Supabase is not running. Starting...${NC}"
    supabase start
fi

echo -e "${GREEN}Running RLS test suite...${NC}"
echo ""

# Run the test SQL file
supabase db execute --file tests/rls/test_rls_policies.sql

echo ""
echo "========================================="
echo "Test Results"
echo "========================================="
echo ""
echo "Check the output above for PASS/FAIL results."
echo ""
echo "If all tests passed, your RLS policies are working correctly!"
echo "If any tests failed, review the RLS policies and fix the issues."
echo ""
