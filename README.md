# DesignDream

AI-powered design and development workspace with structured workflow management.

## Workflow Overview

This project uses a structured development workflow aligned with Linear's project management approach:

```
Epic/Project PRD → Feature Issues → Task Lists → Implementation → Validation
```

## Quick Start

### 1. Create Project PRD (Epic Level)

Define your product vision and roadmap:

```bash
/create-project-prd
```

This creates `project-prd.md` with:
- Product overview and vision
- Goals and success metrics
- Target users
- Feature roadmap (MVP → Phase 2 → Phase 3)
- Technical architecture
- Design principles

### 2. Create Feature Issues

For each feature in your roadmap:

```bash
/create-feature-issue
```

This creates `/tasks/[n]-feature-[name].md` with:
- Feature overview and user stories
- **Acceptance Criteria** (Linear-compatible format)
- Task breakdown (maps to Linear sub-issues)
- Testing requirements
- Evidence validation checklist
- Definition of done

### 3. Generate Task Lists (Optional)

Break down feature into granular tasks:

```bash
/generate-tasks
```

This creates `/tasks/tasks-[feature-id].md` with:
- Acceptance criteria status tracking
- Relevant files
- Parent tasks and sub-tasks
- AC validation tasks
- Evidence collection requirements

### 4. Implement with Validation

Execute tasks with strict quality gates:

```bash
/process-tasks
```

This enforces:
- One sub-task at a time with approval gates
- Test and lint after each sub-task
- Evidence collection for each AC
- Code quality checks before commits
- Feature completion gates

## Slash Commands

### `/create-project-prd`
Create Epic/Product-level PRD defining overall product vision and roadmap.

### `/create-feature-issue`
Create comprehensive Feature PRD with acceptance criteria, tasks, testing requirements, and validation checklist.

### `/generate-tasks`
Generate detailed task list from PRD or Feature Issue with AC tracking.

### `/process-tasks`
Execute tasks one-by-one with validation gates and evidence collection.

### `/create-prd` (Legacy)
Create simple feature PRD without AC tracking.

## Directory Structure

```
/
├── project-prd.md                  # Epic/Product-level PRD
├── tasks/
│   ├── 0001-feature-auth.md        # Feature Issue (Linear Issue)
│   ├── 0002-feature-dashboard.md   # Feature Issue
│   ├── tasks-0001-feature-auth.md  # Detailed task list (optional)
│   └── evidence/                   # Validation evidence
│       └── 0001-feature-auth/
│           ├── ac-1/
│           │   ├── test-output.log
│           │   ├── screenshot.png
│           │   ├── manual-verification.md
│           │   └── README.md
│           └── ac-2/
│               └── ...
└── README.md
```

## Acceptance Criteria Format

Feature Issues include acceptance criteria in Linear-compatible format:

```markdown
## Acceptance Criteria

- [ ] **AC-1**: User can log in with email and password
  - **Tests:** `auth.test.ts::testEmailLogin`
  - **Evidence Required:** Screenshot of successful login + test output
  - **Verification:** [ ] Manual | [ ] Automated

- [ ] **AC-2**: Invalid credentials show error message
  - **Tests:** `auth.test.ts::testInvalidCredentials`
  - **Evidence Required:** Screenshot of error state + test output
  - **Verification:** [ ] Manual | [ ] Automated
```

## Linear Integration

All markdown is designed to copy-paste directly into Linear:

1. **Project PRD** → Linear Initiative/Epic
2. **Feature Issue** → Linear Issue
3. **Tasks** → Linear Sub-issues
4. **Acceptance Criteria** → Checkbox items in Linear

### Optional: Linear API Integration

Future enhancement: Sync directly with Linear API to auto-create issues and sub-issues.

## Workflow Example

### Phase 1: Project Setup
```bash
# Define product vision
/create-project-prd
# Answer questions about product
# Review generated project-prd.md
```

### Phase 2: Feature Planning
```bash
# Create feature from roadmap
/create-feature-issue
# Describe: "User authentication with email/password"
# Answer clarifying questions
# Review generated /tasks/0001-feature-user-authentication.md
```

### Phase 3: Implementation
```bash
# Execute feature tasks
/process-tasks
# Work through tasks one-by-one
# Tests run after each sub-task
# Evidence collected for each AC
# Feature marked complete when all gates pass
```

## Evidence Collection

Each acceptance criterion requires evidence:

- **Test Output**: Automated test results
- **Screenshots**: Visual proof of functionality
- **Logs**: Application behavior logs
- **Manual Verification**: Manual testing results
- **Performance Metrics**: Performance test results

Evidence is saved to `/tasks/evidence/[feature-id]/ac-[n]/`

## Quality Gates

### Sub-Task Level
- ✅ Unit tests passing
- ✅ Linting clean
- ✅ AC status updated

### Parent Task Level
- ✅ Full test suite passing
- ✅ Test coverage ≥ 80%
- ✅ Zero linting errors/warnings
- ✅ Code review self-check passed
- ✅ No debug code

### Feature Level
- ✅ All tasks completed
- ✅ All ACs validated
- ✅ All evidence collected
- ✅ 100% tests passing
- ✅ Coverage target met
- ✅ Documentation updated
- ✅ Clean codebase (no debug code)

## Benefits

### For Solo Developers
- Structured approach prevents scope creep
- Quality gates ensure production-ready code
- Evidence collection creates portfolio documentation
- Methodical progress tracking

### For Teams
- Clear handoffs between team members
- Objective completion criteria
- Audit trail of all decisions
- Easy onboarding with comprehensive docs

### For Product Managers
- Clear feature specifications
- Measurable acceptance criteria
- Evidence-based sign-off
- Transparent progress tracking

## Best Practices

1. **Start with Project PRD**: Define vision before features
2. **One Feature at a Time**: Complete features fully before starting new ones
3. **Collect Evidence**: Don't skip evidence collection
4. **Small Commits**: Commit after each parent task
5. **Test Coverage**: Maintain ≥80% coverage
6. **Clean Code**: Remove all debug code before commits
7. **Document Decisions**: Use implementation notes in feature issues

## Troubleshooting

### "Too many acceptance criteria"
Break feature into smaller features. Each feature should have 3-7 ACs max.

### "Evidence collection is slow"
Automate screenshot capture and log collection with scripts.

### "Tests taking too long"
Run focused test suites per sub-task, full suite only for parent tasks.

### "Linting too strict"
Configure linter rules in project, but don't skip linting.

## Future Enhancements

- [ ] Linear API integration for auto-sync
- [ ] GitHub Actions for automated testing
- [ ] Evidence collection automation scripts
- [ ] Coverage tracking dashboard
- [ ] AI-powered AC generation
- [ ] Template library for common features

## Contributing

When contributing:

1. Create feature issue for your contribution
2. Follow `/process-tasks` workflow
3. Collect all evidence
4. Pass all quality gates
5. Submit PR with evidence links

## License

MIT

---

**Built with ❤️ using AI-assisted development workflow**
