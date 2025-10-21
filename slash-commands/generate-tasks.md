# Rule: Generating a Task List from a PRD

## Goal

To guide an AI assistant in creating a detailed, step-by-step task list in Markdown format based on an existing Product Requirements Document (PRD) or Feature Issue. The task list should guide a developer through implementation with full acceptance criteria tracking and validation requirements.

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/tasks/`
- **Filename:** `tasks-[prd-file-name].md` (e.g., `tasks-0001-prd-user-profile-editing.md`)

## Process

1.  **Receive PRD Reference:** The user points the AI to a specific PRD file or Feature Issue
2.  **Read Project Context:** If `project-prd.md` exists, read it to understand overall product vision
3.  **Analyze PRD/Feature:** Read and analyze the functional requirements, user stories, acceptance criteria, and other sections
4.  **Extract Acceptance Criteria:** If this is a Feature Issue, extract all acceptance criteria (AC-1, AC-2, etc.) and their validation requirements
5.  **Assess Current State:** Review the existing codebase to understand existing infrastructure, architectural patterns and conventions. Also, identify any existing components or features that already exist and could be relevant to the PRD requirements. Then, identify existing related files, components, and utilities that can be leveraged or need modification.
6.  **Phase 1: Generate Parent Tasks:** Based on the PRD analysis and current state assessment, create the file and generate the main, high-level tasks required to implement the feature. Use your judgement on how many high-level tasks to use. It's likely to be about five tasks. Present these tasks to the user in the specified format (without sub-tasks yet). Inform the user: "I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."
7.  **Wait for Confirmation:** Pause and wait for the user to respond with "Go".
8.  **Phase 2: Generate Sub-Tasks:** Once the user confirms, break down each parent task into smaller, actionable sub-tasks necessary to complete the parent task. Ensure sub-tasks logically follow from the parent task, cover the implementation details implied by the PRD, and consider existing codebase patterns where relevant without being constrained by them. **Each sub-task should reference which acceptance criteria it helps fulfill.**
9.  **Identify Relevant Files:** Based on the tasks and PRD, identify potential files that will need to be created or modified. List these under the `Relevant Files` section, including corresponding test files if applicable.
10. **Add AC Validation Tasks:** For each acceptance criterion from the Feature Issue, add specific validation sub-tasks that include evidence collection requirements.
11. **Generate Final Output:** Combine the parent tasks, sub-tasks, AC tracking, relevant files, and notes into the final Markdown structure.
12. **Save Task List:** Save the generated document in the `/tasks/` directory with the filename `tasks-[prd-file-name].md`, where `[prd-file-name]` matches the base name of the input PRD file (e.g., if the input was `0001-prd-user-profile-editing.md`, the output is `tasks-0001-prd-user-profile-editing.md`).

## Output Format

The generated task list _must_ follow this structure:

```markdown
## Acceptance Criteria Status

Track which acceptance criteria are met:

- [ ] **AC-1**: [Copy from feature issue] - 🔴 Not Started
  - **Validation Tasks:** T-X.X, T-Y.Y
  - **Evidence Required:** [Copy from feature issue]

- [ ] **AC-2**: [Copy from feature issue] - 🔴 Not Started
  - **Validation Tasks:** T-Z.Z
  - **Evidence Required:** [Copy from feature issue]

[Continue for all ACs from feature issue...]

## Relevant Files

- `path/to/potential/file1.ts` - Brief description of why this file is relevant (e.g., Contains the main component for this feature).
- `path/to/file1.test.ts` - Unit tests for `file1.ts`.
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission).
- `path/to/another/file.test.tsx` - Unit tests for `another/file.tsx`.
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations).
- `lib/utils/helpers.test.ts` - Unit tests for `helpers.ts`.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- Evidence should be saved to `/tasks/evidence/[feature-id]/ac-[n]/`

## Tasks

- [ ] 1.0 Parent Task Title
  - [ ] 1.1 [Sub-task description 1.1] **[Validates: AC-1]**
  - [ ] 1.2 [Sub-task description 1.2] **[Validates: AC-1, AC-2]**
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 [Sub-task description 2.1] **[Validates: AC-3]**
- [ ] 3.0 Acceptance Criteria Validation
  - [ ] 3.1 Validate AC-1: [Specific validation steps]
    - [ ] Run tests: `npm test [test-files]`
    - [ ] Collect screenshot: [Description]
    - [ ] Verify manually: [Steps]
    - [ ] Save evidence to `/tasks/evidence/[feature-id]/ac-1/`
  - [ ] 3.2 Validate AC-2: [Specific validation steps]
    - [ ] Run tests: `npm test [test-files]`
    - [ ] Collect log output: [Description]
    - [ ] Save evidence to `/tasks/evidence/[feature-id]/ac-2/`
  - [ ] 3.3 Final validation: All ACs verified and marked complete
```

## Interaction Model

The process explicitly requires a pause after generating parent tasks to get user confirmation ("Go") before proceeding to generate the detailed sub-tasks. This ensures the high-level plan aligns with user expectations before diving into details.

## Target Audience

Assume the primary reader of the task list is a **junior developer** who will implement the feature with awareness of the existing codebase context.
