# Testing Documentation

Comprehensive testing suite for the DesignDream application, covering unit tests, integration tests, and end-to-end tests.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Coverage Reports](#coverage-reports)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Overview

This project uses a modern testing stack designed for speed, reliability, and developer experience:

- **Vitest**: Fast unit and integration testing
- **Playwright**: End-to-end browser testing
- **React Testing Library**: Component testing with user-centric approach
- **Happy-DOM**: Lightweight DOM implementation for unit tests

## Testing Stack

### Vitest

Fast, modern test runner with native TypeScript support, hot module replacement, and parallel test execution.

**Key Features:**
- Native ESM support
- TypeScript out of the box
- Compatible with Jest APIs
- Built-in code coverage
- Watch mode with HMR

### Playwright

Reliable end-to-end testing across all modern browsers (Chromium, Firefox, WebKit).

**Key Features:**
- Cross-browser testing
- Auto-wait for elements
- Network interception
- Screenshots and videos
- Parallel execution

### React Testing Library

User-centric component testing that encourages testing behavior over implementation.

**Key Features:**
- Query elements like users do
- Encourages accessibility
- Works with any test runner
- Async utilities built-in

## Installation

All testing dependencies are already installed. To reinstall or update:

```bash
# Install all dependencies
npm install

# Install Playwright browsers (first time only)
npm run playwright:install
```

## Running Tests

### Unit & Integration Tests

```bash
# Run all unit/integration tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug
```

### All Tests

```bash
# Run all tests (unit, integration, and E2E)
npm run test:all
```

## Test Structure

```
__tests__/
├── unit/                      # Unit tests (pure functions, utilities)
│   ├── lib/
│   │   ├── sla.test.ts              # SLA calculation tests (48 tests)
│   │   ├── stripe-billing.test.ts   # Billing logic tests (24 tests)
│   │   └── validations.test.ts      # Form validation tests (25 tests)
│   └── components/            # Component unit tests
│
├── integration/               # Integration tests (hooks, API)
│   ├── api/                   # API route tests
│   │   ├── billing.test.ts
│   │   ├── stripe.test.ts
│   │   └── sla.test.ts
│   └── hooks/                 # Custom hooks tests
│       ├── use-billing.test.ts      # Billing hook tests (30 tests)
│       └── use-kanban.test.ts       # Kanban hook tests (35 tests)
│
└── e2e/                       # End-to-end tests (user flows)
    ├── auth-flow.spec.ts            # Authentication tests (8 tests)
    ├── subscription-flow.spec.ts    # Subscription tests (12 tests)
    ├── request-submission.spec.ts   # Request form tests (15 tests)
    └── admin-queue.spec.ts          # Admin queue tests (18 tests)
```

## Writing Tests

### Unit Tests Example

```typescript
// __tests__/unit/lib/example.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/example';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected-output');
  });

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('');
    expect(myFunction(null)).toBe(null);
  });
});
```

### Component Tests Example

```typescript
// __tests__/unit/components/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests Example

```typescript
// __tests__/integration/hooks/use-example.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExample } from '@/hooks/use-example';

describe('useExample', () => {
  it('should fetch data on mount', async () => {
    const { result } = renderHook(() => useExample());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### E2E Tests Example

```typescript
// __tests__/e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test('should complete user flow', async ({ page }) => {
  await page.goto('/');

  await page.click('button:has-text("Get Started")');

  await expect(page).toHaveURL('/signup');

  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Success')).toBeVisible();
});
```

## Test Coverage

### Current Coverage

Total tests: **197 tests**

**Unit Tests:**
- SLA Calculations: 48 tests
- Stripe Billing: 24 tests
- Form Validations: 25 tests
- **Subtotal: 97 tests**

**Integration Tests:**
- Kanban Hook: 35 tests
- Billing Hook: 30 tests
- **Subtotal: 65 tests**

**E2E Tests:**
- Auth Flow: 8 tests
- Subscription Flow: 12 tests
- Request Submission: 15 tests
- Admin Queue: 18 tests
- **Subtotal: 53 tests**

### Generating Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Coverage will be output to:
# - Terminal (text summary)
# - coverage/index.html (detailed HTML report)
# - coverage/coverage.json (JSON data)
```

### Coverage Thresholds

Target coverage goals:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run unit/integration tests
        run: npm run test:run

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage.json

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            coverage/
            playwright-report/
```

## Best Practices

### General Testing Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Test from the user's perspective

2. **Keep Tests Isolated**
   - Each test should be independent
   - Use `beforeEach` for setup, `afterEach` for cleanup

3. **Use Descriptive Names**
   - Test names should describe what is being tested
   - Use "should" statements: `should return user data when valid`

4. **Arrange-Act-Assert Pattern**
   ```typescript
   it('should update user profile', () => {
     // Arrange: Set up test data
     const user = { id: 1, name: 'John' };

     // Act: Perform the action
     const result = updateUser(user);

     // Assert: Verify the result
     expect(result.name).toBe('John');
   });
   ```

5. **Test Edge Cases**
   - Empty inputs
   - Null/undefined values
   - Boundary conditions
   - Error scenarios

### Unit Testing Best Practices

- Test pure functions in isolation
- Mock external dependencies
- Keep tests fast (<100ms per test)
- One assertion per test when possible
- Use data-driven tests for multiple scenarios

### Integration Testing Best Practices

- Test component interactions
- Test custom hooks with real data
- Mock only external services (APIs, databases)
- Test happy paths and error scenarios
- Verify side effects and state updates

### E2E Testing Best Practices

- Test critical user journeys
- Use data-testid attributes for stable selectors
- Keep tests independent (no shared state)
- Handle async operations with waitFor
- Use page objects for complex pages
- Take screenshots on failure
- Run in parallel when possible

### Testing Async Code

```typescript
// Using async/await
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Using waitFor
it('should update after delay', async () => {
  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Mocking Best Practices

```typescript
// Mock modules
vi.mock('@/lib/api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1 }))
}));

// Mock functions
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async-value');

// Restore mocks
beforeEach(() => {
  vi.clearAllMocks();
});
```

### Accessibility Testing

Always consider accessibility in tests:

```typescript
// Good: Test by accessible role
const button = screen.getByRole('button', { name: 'Submit' });

// Good: Test by label
const input = screen.getByLabelText('Email address');

// Avoid: Test by implementation details
const button = screen.getByClassName('btn-primary');
```

## Debugging Tests

### Unit/Integration Tests

```bash
# Run specific test file
npm test -- sla.test.ts

# Run tests matching pattern
npm test -- --grep "SLA"

# Run tests in UI mode for debugging
npm run test:ui
```

### E2E Tests

```bash
# Run specific test file
npm run test:e2e -- auth-flow

# Debug mode (step through tests)
npm run test:e2e:debug

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### Common Issues

**Tests timing out:**
- Increase timeout in test config
- Check for unresolved promises
- Ensure async operations complete

**Flaky tests:**
- Add proper waits for async operations
- Avoid hard-coded delays (use waitFor)
- Ensure proper cleanup between tests

**Module not found:**
- Check path aliases in vitest.config.ts
- Verify imports use correct paths
- Run `npm install` to ensure dependencies

## Performance

### Test Execution Times

- **Unit tests**: ~2-5 seconds for full suite
- **Integration tests**: ~5-10 seconds for full suite
- **E2E tests**: ~2-3 minutes for full suite

### Optimization Tips

1. **Run tests in parallel**
   - Vitest runs in parallel by default
   - Playwright can run multiple workers

2. **Use watch mode in development**
   - Only runs tests for changed files
   - Faster feedback loop

3. **Skip slow tests during development**
   ```typescript
   it.skip('slow test', () => {
     // This test will be skipped
   });
   ```

4. **Use test.only for focused development**
   ```typescript
   it.only('test I am working on', () => {
     // Only this test will run
   });
   ```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

For questions or issues with the test suite:
1. Check this documentation
2. Review existing test examples
3. Consult official documentation
4. Ask the team in development channel
