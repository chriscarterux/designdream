#!/bin/bash

# DesignDream Workflow Setup Script
# Installs slash commands for AI-assisted development

set -e

echo "🚀 Setting up DesignDream workflow..."
echo ""

# Create global commands directory if it doesn't exist
if [ ! -d "$HOME/.claude/commands" ]; then
    echo "📁 Creating ~/.claude/commands directory..."
    mkdir -p "$HOME/.claude/commands"
fi

# Copy slash commands
echo "📋 Installing slash commands..."
cp slash-commands/create-project-prd.md ~/.claude/commands/
cp slash-commands/create-feature-issue.md ~/.claude/commands/
cp slash-commands/generate-tasks.md ~/.claude/commands/
cp slash-commands/process-tasks.md ~/.claude/commands/

echo ""
echo "✅ Setup complete!"
echo ""
echo "Available commands:"
echo "  /create-project-prd   - Create Epic/Product-level PRD"
echo "  /create-feature-issue - Create Feature PRD with acceptance criteria"
echo "  /generate-tasks       - Generate task list with AC tracking"
echo "  /process-tasks        - Execute tasks with validation gates"
echo ""
echo "Try running: /create-project-prd"
echo ""
