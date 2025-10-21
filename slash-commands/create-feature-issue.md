# Rule: Generating a Feature Issue (Linear Issue Format)

## Goal

To guide an AI assistant in creating a comprehensive Feature PRD in Linear-compatible markdown format. This document serves as a complete specification for a single feature, including acceptance criteria, task breakdown, testing requirements, and validation evidence. It aligns with Linear's Issue structure.

## Process

1.  **Receive Initial Prompt:** The user describes a specific feature they want to build or references a feature from the project PRD.
2.  **Review Context:** Read the `project-prd.md` if it exists to understand how this feature fits into the larger product vision.
3.  **Analyze Codebase:** Review existing code structure, patterns, components, and conventions to ensure the feature integrates properly.
4.  **Ask Clarifying Questions:** Ask targeted questions about the specific feature functionality, user interactions, edge cases, and acceptance criteria.
5.  **Generate Feature Issue:** Create a comprehensive feature document using the structure outlined below.
6.  **Save Feature Issue:** Save as `/tasks/[n]-feature-[name].md` where `n` is a zero-padded 4-digit sequence (e.g., `0001-feature-user-authentication.md`).

## Clarifying Questions (Examples)

Adapt questions based on the feature, but cover these areas:

*   **User Stories:** "Can you describe specific user stories for this feature? (As a [user], I want to [action] so that [benefit])"
*   **User Interactions:** "Walk me through the user's interaction with this feature step-by-step"
*   **Success Criteria:** "How will we know this feature is working correctly? What are the acceptance criteria?"
*   **Edge Cases:** "What edge cases or error conditions should we handle?"
*   **Data Requirements:** "What data does this feature need to display, collect, or process?"
*   **UI/UX Expectations:** "What should this look like? Are there design mockups or similar features to reference?"
*   **Performance:** "Are there any performance requirements? (e.g., load time, response time)"
*   **Integration Points:** "Does this feature integrate with other parts of the system or external services?"
*   **Testing Scope:** "What level of test coverage is expected? Unit tests? E2E tests?"

## Feature Issue Structure

### 1. Feature Header
```markdown
# Feature: [Feature Name]
**Issue ID:** [n]-feature-[name]
**Status:** 🔴 Not Started | 🟡 In Progress | 🟢 Complete
**Priority:** Critical | High | Medium | Low
**Effort:** S | M | L | XL
**Sprint/Milestone:** [Optional]
```

### 2. Overview
*   **Problem Statement:** What problem does this feature solve?
*   **User Stories:** List 2-5 user stories in "As a [user], I want to [action], so that [benefit]" format
*   **Success Impact:** How will this feature move product metrics?

### 3. Acceptance Criteria
Use Linear-compatible bullet format with checkboxes:

```markdown
## Acceptance Criteria

- [ ] **AC-1**: [Clear, testable criterion]
  - **Tests:** `file.test.ts::testName1, testName2`
  - **Evidence Required:** Screenshot of [specific state] + test output
  - **Verification:** [ ] Manual | [ ] Automated | [ ] Both

- [ ] **AC-2**: [Another criterion]
  - **Tests:** `file.test.ts::testName3`
  - **Evidence Required:** Log output showing [specific behavior]
  - **Verification:** [ ] Manual | [ ] Automated | [ ] Both

[Continue for all acceptance criteria...]
```

Each AC must be:
- **Specific:** Clearly defined success condition
- **Testable:** Can be verified objectively
- **Measurable:** Has clear pass/fail criteria
- **Valuable:** Contributes to user benefit

### 4. Task Breakdown
Sub-issues as checkboxes (maps to Linear sub-issues):

```markdown
## Tasks

### Implementation
- [ ] **T-1.1**: [Specific implementation task]
  - **Acceptance Criteria:** AC-1, AC-2
  - **Estimated Effort:** [S/M/L]

- [ ] **T-1.2**: [Another implementation task]
  - **Acceptance Criteria:** AC-3
  - **Estimated Effort:** [S/M/L]

### Testing
- [ ] **T-2.1**: Write unit tests for [component/function]
  - **Test Coverage Target:** 80%+
  - **Tests AC:** AC-1, AC-2

- [ ] **T-2.2**: Write integration/E2E tests
  - **Test Scenarios:** [List scenarios]
  - **Tests AC:** All

### Code Quality
- [ ] **T-3.1**: Run linting and fix issues
  - **Linter:** ESLint/Prettier/[your linter]
  - **Zero errors/warnings required**

- [ ] **T-3.2**: Code review checklist
  - [ ] Follows project coding standards
  - [ ] No console.logs or debug code
  - [ ] Error handling implemented
  - [ ] Comments added for complex logic

### Documentation
- [ ] **T-4.1**: Update relevant documentation
- [ ] **T-4.2**: Add inline code comments
- [ ] **T-4.3**: Update API documentation (if applicable)
```

### 5. Testing Requirements

```markdown
## Testing Requirements

### Unit Tests
- **Coverage Target:** 80%+ line coverage
- **Test Files:**
  - `src/components/[component].test.tsx`
  - `src/utils/[utility].test.ts`
- **Key Test Cases:**
  - Happy path scenarios
  - Edge cases: [list specific edge cases]
  - Error conditions: [list error scenarios]

### Integration Tests
- **Test Scenarios:**
  1. [Scenario description]
  2. [Another scenario]

### E2E Tests (if applicable)
- **User Flows:**
  1. [Complete user flow to test]
  2. [Another flow]

### Performance Tests
- **Metrics to Validate:**
  - Load time < [X]ms
  - Response time < [Y]ms
  - Memory usage < [Z]MB
```

### 6. Evidence Checklist

```markdown
## Validation Evidence

Each AC requires evidence before being marked complete:

### AC-1 Evidence
- [ ] Screenshot: [Description of what screenshot should show]
- [ ] Test Output: `npm test [test-file]` with all tests passing
- [ ] Manual Verification: [Steps to manually verify]
- **Evidence Location:** `/tasks/evidence/[n]-feature-[name]/ac-1/`

### AC-2 Evidence
- [ ] Screenshot: [Description]
- [ ] Log Output: [What logs should demonstrate]
- [ ] Test Output: [Specific test results]
- **Evidence Location:** `/tasks/evidence/[n]-feature-[name]/ac-2/`

[Continue for all ACs...]

### Final Validation
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Linting passed with zero errors
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Feature deployed to staging
- [ ] Manual QA completed
- [ ] Product owner approval received
```

### 7. Implementation Notes

```markdown
## Implementation Notes

### Existing Code to Leverage
- `src/components/[existing-component]` - Can be extended for [purpose]
- `src/utils/[existing-utility]` - Provides [relevant functionality]

### New Files to Create
- `src/components/[new-component].tsx` - [Purpose]
- `src/components/[new-component].test.tsx` - Unit tests
- `src/hooks/[new-hook].ts` - [Purpose]

### Files to Modify
- `src/[existing-file]` - Add [specific changes]

### Technical Decisions
- **Choice:** [Technical decision made]
  - **Rationale:** [Why this approach?]
  - **Alternatives Considered:** [What else was considered?]

### Dependencies
- **New Dependencies:** [List any new npm packages needed]
- **Version Requirements:** [Specific version constraints]
```

### 8. Definition of Done

```markdown
## Definition of Done

This feature is considered complete when:

- [ ] All acceptance criteria verified and marked `[x]`
- [ ] All tasks completed and marked `[x]`
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage meets target (80%+)
- [ ] Linting passes with zero errors
- [ ] Code reviewed and approved
- [ ] All evidence collected and documented
- [ ] Documentation updated
- [ ] Feature deployed to staging
- [ ] Product owner sign-off received
- [ ] Feature merged to main branch
```

## Output

*   **Format:** Markdown (`.md`) - Linear copy-paste compatible
*   **Location:** `/tasks/`
*   **Filename:** `[n]-feature-[name].md`
*   **Evidence Directory:** `/tasks/evidence/[n]-feature-[name]/`

## Workflow Integration

After creating the feature issue:

1. **Copy to Linear:** The markdown format is designed to copy-paste directly into Linear
2. **Create Sub-Issues:** Each task can become a Linear sub-issue
3. **Track Progress:** Update checkboxes as work progresses
4. **Collect Evidence:** Save screenshots, logs, and test outputs to evidence directory
5. **Final Validation:** Mark feature complete only when all criteria met

## Final Instructions

1. Read `project-prd.md` for context before generating
2. Analyze existing codebase patterns and structure
3. Ask clarifying questions to ensure comprehensive AC coverage
4. Generate complete feature issue with all sections
5. Create evidence directory structure: `/tasks/evidence/[n]-feature-[name]/`
6. After completion, remind user: "Use `/process-tasks` to implement this feature step-by-step with validation gates."
