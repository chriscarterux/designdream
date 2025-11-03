import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.click('text=Sign In');

    // Should navigate to auth page
    await expect(page).toHaveURL(/.*auth/);

    // Should show email input
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/auth/login');

    // Enter invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid email')).toBeVisible();
  });

  test('should handle successful login flow', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill in valid credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Should show user menu
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should handle logout', async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/dashboard');

    // Open user menu
    await page.click('[data-testid="user-menu"]');

    // Click logout
    await page.click('text=Log out');

    // Should redirect to home
    await expect(page).toHaveURL('/');

    // Should show sign in button again
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should persist auth state on page reload', async ({ page }) => {
    await page.goto('/auth/login');

    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);

    // Reload page
    await page.reload();

    // Should still be on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Click submit and immediately check for loading state
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test('should handle password reset request', async ({ page }) => {
    await page.goto('/auth/login');

    // Click forgot password link
    await page.click('text=Forgot password?');

    // Should navigate to reset page
    await expect(page).toHaveURL(/.*reset/);

    // Fill email
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(
      page.locator('text=Password reset email sent')
    ).toBeVisible();
  });

  test('should redirect to login when accessing protected route', async ({
    page,
  }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/.*auth/);

    // Should show login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
