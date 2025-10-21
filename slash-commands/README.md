# Slash Commands Setup

This directory contains custom slash commands for the DesignDream AI development workflow.

## Quick Setup

Run this command to install all slash commands globally:

```bash
cp slash-commands/*.md ~/.claude/commands/
```

Or install them one at a time:

```bash
cp slash-commands/create-project-prd.md ~/.claude/commands/
cp slash-commands/create-feature-issue.md ~/.claude/commands/
cp slash-commands/generate-tasks.md ~/.claude/commands/
cp slash-commands/process-tasks.md ~/.claude/commands/
```

## Available Commands

After setup, you can use these commands anywhere in your terminal:

### `/create-project-prd`
Create Epic/Product-level PRD defining overall product vision and roadmap.

**Output**: `project-prd.md` in project root

**What it creates**:
- Product overview and vision
- Goals and success metrics
- Target users and personas
- Feature roadmap (MVP → Phase 2 → Phase 3)
- Technical architecture
- Design principles
- Risks and mitigation strategies

### `/create-feature-issue`
Create comprehensive Feature PRD with acceptance criteria, tasks, testing requirements, and validation checklist.

**Output**: `/tasks/[n]-feature-[name].md` (Linear-compatible format)

**What it creates**:
- Feature overview and user stories
- Acceptance criteria (checkbox format)
- Task breakdown (maps to Linear sub-issues)
- Testing requirements (unit, integration, E2E)
- Evidence validation checklist
- Definition of done

### `/generate-tasks`
Generate detailed task list from PRD or Feature Issue with AC tracking.

**Output**: `/tasks/tasks-[feature-id].md`

**What it creates**:
- Acceptance criteria status tracking
- Relevant files section
- Parent tasks and sub-tasks
- Task-to-AC mapping
- AC validation tasks with evidence requirements

### `/process-tasks`
Execute tasks one-by-one with validation gates and evidence collection.

**What it does**:
- Enforces one sub-task at a time workflow
- Runs tests + linting after each sub-task
- Collects evidence for each acceptance criterion
- Enforces quality gates before commits
- Validates all ACs before marking feature complete

## Workflow

1. **Define Product Vision**
   ```bash
   /create-project-prd
   ```

2. **Create Feature Specification**
   ```bash
   /create-feature-issue
   ```

3. **Generate Task List** (optional)
   ```bash
   /generate-tasks
   ```

4. **Implement with Validation**
   ```bash
   /process-tasks
   ```

## Verifying Installation

After copying the commands, you can verify they're installed:

```bash
ls -la ~/.claude/commands/
```

You should see:
- `create-project-prd.md`
- `create-feature-issue.md`
- `generate-tasks.md`
- `process-tasks.md`

## Troubleshooting

### "Unknown slash command" error

1. **Verify files are in the right location**:
   ```bash
   ls ~/.claude/commands/
   ```

2. **Check file permissions**:
   ```bash
   chmod 644 ~/.claude/commands/*.md
   ```

3. **Restart Claude Code** (if running in an editor)

4. **Re-run setup**:
   ```bash
   cp slash-commands/*.md ~/.claude/commands/
   ```

### Commands not showing up

Make sure the `~/.claude/commands/` directory exists:

```bash
mkdir -p ~/.claude/commands
cp slash-commands/*.md ~/.claude/commands/
```

## Updating Commands

When slash commands are updated in this repo:

```bash
# Pull latest changes
git pull

# Re-copy to global directory
cp slash-commands/*.md ~/.claude/commands/
```

## Team Setup

When a new team member clones this repo:

```bash
# Clone repo
git clone https://github.com/chriscarterux/designdream.git
cd designdream

# Install slash commands
cp slash-commands/*.md ~/.claude/commands/

# Verify
ls ~/.claude/commands/
```

## Notes

- Commands are stored globally in `~/.claude/commands/`
- This allows using the same commands across all projects
- The `.claude` directory in the project root is git-ignored (contains local settings)
- Slash commands in this repo are the source of truth
- Update them here and re-copy to global directory when changes are made
