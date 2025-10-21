# Task List Management with Acceptance Criteria Validation

Guidelines for managing task lists in markdown files to track progress on completing a PRD with full acceptance criteria validation and evidence collection

## Task Implementation Protocol

### Working Through Tasks
- **One sub-task at a time:** Do **NOT** start the next sub‑task until you ask the user for permission and they say "yes" or "y"
- **Track AC Progress:** After completing each sub-task, note which acceptance criteria (AC) it helps validate

### Sub-Task Completion Protocol
1. When you finish a **sub‑task**:
   - Run relevant unit tests for that sub-task
   - Run linting: `npm run lint` or `eslint [files]`
   - Fix any linting errors
   - Mark the sub-task as completed `[x]`
   - Update the AC status if this sub-task validates any criteria

### Parent Task Completion Protocol
2. If **all** subtasks underneath a parent task are now `[x]`, follow this sequence:
   - **Run Full Test Suite**: `pytest`, `npm test`, `bin/rails test`, etc.
   - **Check Test Coverage**: Ensure coverage meets target (typically 80%+)
   - **Run Linting**: `npm run lint` or equivalent - must pass with ZERO errors/warnings
   - **Clean Up**: Remove any temporary files, console.logs, debug code, commented code
   - **Code Review Self-Check**:
     - [ ] Follows project coding standards
     - [ ] No debug code or console.logs
     - [ ] Error handling implemented
     - [ ] Comments added for complex logic
     - [ ] No hardcoded values (use constants/env vars)
   - **Only if all checks pass**: Stage changes (`git add .`)
   - **Commit**: Use conventional commit format with `-m` flags:
     ```
     git commit -m "feat: add payment validation logic" -m "- Validates card type and expiry" -m "- Adds unit tests for edge cases" -m "Related to T1.0 - Validates AC-1, AC-2"
     ```
3. Mark the **parent task** as completed `[x]`
4. Stop and wait for user's go-ahead before proceeding

### Acceptance Criteria Validation Protocol

When you reach AC validation tasks:

1. **For Each Acceptance Criterion:**
   - [ ] **Run Specific Tests**: Execute tests mapped to this AC
     ```bash
     npm test [test-file] --testNamePattern="[pattern]"
     ```
   - [ ] **Collect Test Evidence**: Save test output
     ```bash
     npm test [test-file] > /tasks/evidence/[feature-id]/ac-[n]/test-output.log
     ```
   - [ ] **Capture Visual Evidence** (if applicable):
     - Take screenshots showing the AC is met
     - Save to `/tasks/evidence/[feature-id]/ac-[n]/screenshot-[description].png`
   - [ ] **Collect Log Evidence** (if applicable):
     - Run application and capture relevant logs
     - Save to `/tasks/evidence/[feature-id]/ac-[n]/logs.txt`
   - [ ] **Manual Verification Checklist**:
     - Follow manual verification steps from Feature Issue
     - Document results in `/tasks/evidence/[feature-id]/ac-[n]/manual-verification.md`
   - [ ] **Performance Validation** (if applicable):
     - Run performance tests
     - Verify metrics meet requirements
     - Save results to `/tasks/evidence/[feature-id]/ac-[n]/performance.txt`

2. **Update AC Status:**
   - Change AC status from 🔴 Not Started → 🟡 In Progress → 🟢 Complete
   - Mark AC checkbox as `[x]` in task list
   - Mark AC checkbox as `[x]` in original Feature Issue

3. **Evidence Checklist Completion:**
   - Verify all required evidence collected
   - Create evidence index: `/tasks/evidence/[feature-id]/ac-[n]/README.md` listing all evidence files
   - Review evidence quality - is it sufficient to prove AC is met?

### Feature Completion Gate

Before marking the entire feature complete:

- [ ] **All Tasks Completed**: All parent tasks and sub-tasks marked `[x]`
- [ ] **All ACs Validated**: All acceptance criteria marked `[x]`
- [ ] **All Evidence Collected**: Every AC has complete evidence package
- [ ] **Full Test Suite Passing**: 100% of tests passing
- [ ] **Coverage Target Met**: Test coverage meets or exceeds target (80%+)
- [ ] **Linting Clean**: Zero linting errors or warnings
- [ ] **Code Reviewed**: Self-review checklist completed
- [ ] **Documentation Updated**: README, API docs, inline comments updated
- [ ] **No Debug Code**: All console.logs, debuggers, commented code removed
- [ ] **Final Commit**: Create final commit summarizing feature completion
  ```bash
  git commit -m "feat: complete [feature-name]" -m "✅ All acceptance criteria validated" -m "- AC-1: [brief description]" -m "- AC-2: [brief description]" -m "- Test coverage: X%" -m "- Evidence collected in /tasks/evidence/[feature-id]/"
  ```

**ONLY** after all these gates are passed can the feature be marked complete.

## Task List Maintenance

1. **Update the task list as you work:**
   - Mark tasks and subtasks as completed (`[x]`) per the protocol above
   - Update AC status indicators (🔴 → 🟡 → 🟢)
   - Add new tasks as they emerge
   - Link tasks to the ACs they validate

2. **Maintain the "Relevant Files" section:**
   - List every file created or modified
   - Give each file a one‑line description of its purpose
   - Include test files and evidence files

3. **Maintain the "Acceptance Criteria Status" section:**
   - Update AC status as work progresses
   - Mark ACs complete only after evidence collected
   - Link to evidence directory for each AC

## AI Instructions

When working with task lists, the AI must:

1. **Before Starting Any Work:**
   - Read the Feature Issue to understand all acceptance criteria
   - Review the task list to see which sub-task is next
   - Identify which AC(s) this task will help validate
   - Create evidence directory if it doesn't exist: `/tasks/evidence/[feature-id]/`

2. **During Implementation:**
   - Follow the strict one-sub-task-at-a-time protocol
   - Run tests and linting after each sub-task
   - Update task list immediately after completing sub-task
   - Update AC status as tasks validate criteria

3. **After Sub-Task Completion:**
   - Mark the sub-task `[x]`
   - Update AC progress indicators
   - Pause and wait for user approval before proceeding

4. **After Parent Task Completion:**
   - Run full test suite
   - Check test coverage
   - Run linting (must be clean)
   - Code review self-check
   - Clean up debug code
   - Commit with conventional format
   - Mark parent task `[x]`

5. **During AC Validation:**
   - Execute all tests for this AC
   - Collect all required evidence (screenshots, logs, test output)
   - Save evidence to proper directory structure
   - Create evidence index/README
   - Verify evidence quality
   - Update AC status to 🟢 Complete
   - Mark AC `[x]` in both task list AND feature issue

6. **Before Feature Completion:**
   - Verify ALL completion gates passed
   - Review all evidence packages
   - Ensure zero linting errors
   - Confirm 100% test pass rate
   - Validate coverage meets target
   - Create final summary commit

7. **Continuous Maintenance:**
   - Keep task list file updated in real-time
   - Keep "Relevant Files" section current
   - Keep "Acceptance Criteria Status" current
   - Add newly discovered tasks immediately
   - Document any blockers or issues in task notes

## Evidence Directory Structure

```
/tasks/evidence/
  [feature-id]/
    ac-1/
      test-output.log
      screenshot-login-success.png
      manual-verification.md
      README.md (index of all evidence)
    ac-2/
      test-output.log
      logs.txt
      screenshot-error-state.png
      README.md
    ac-3/
      ...
```

## Strict Rules - Never Violate

1. ❌ **NEVER** skip running tests after a sub-task
2. ❌ **NEVER** commit code that fails linting
3. ❌ **NEVER** mark AC complete without collecting ALL required evidence
4. ❌ **NEVER** proceed to next sub-task without user approval
5. ❌ **NEVER** mark feature complete if any AC is incomplete
6. ❌ **NEVER** leave debug code (console.logs, debuggers) in commits
7. ✅ **ALWAYS** collect evidence before marking AC complete
8. ✅ **ALWAYS** run full test suite before marking parent task complete
9. ✅ **ALWAYS** update both task list AND feature issue when marking AC complete
10. ✅ **ALWAYS** pause and wait for user approval between sub-tasks
