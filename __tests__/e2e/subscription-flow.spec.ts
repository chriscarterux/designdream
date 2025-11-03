import { test, expect } from '@playwright/test';

test.describe('Subscription Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display pricing information on homepage', async ({ page }) => {
    // Should show monthly price
    await expect(page.locator('text=$4,495')).toBeVisible();

    // Should show subscribe button
    await expect(page.locator('button:has-text("Subscribe")')).toBeVisible();
  });

  test('should navigate to subscription checkout', async ({ page }) => {
    // Click subscribe button
    await page.click('button:has-text("Subscribe")');

    // Should show auth or checkout page
    await expect(page).toHaveURL(/.*subscribe|.*auth/);
  });

  test('should complete subscription flow with test card', async ({ page }) => {
    // Navigate to checkout (assuming user is logged in)
    await page.goto('/subscribe');

    // Wait for Stripe checkout to load
    await page.waitForSelector('[data-testid="stripe-checkout"]', {
      timeout: 10000,
    });

    // Fill in test card details
    // Note: In real tests, you'd use Stripe's test mode
    const cardElement = page.frameLocator('iframe').locator(
      'input[name="cardnumber"]'
    );
    if (await cardElement.isVisible()) {
      await cardElement.fill('4242 4242 4242 4242');
    }

    // Fill expiry
    const expiryElement = page.frameLocator('iframe').locator(
      'input[name="exp-date"]'
    );
    if (await expiryElement.isVisible()) {
      await expiryElement.fill('12/25');
    }

    // Fill CVC
    const cvcElement = page.frameLocator('iframe').locator('input[name="cvc"]');
    if (await cvcElement.isVisible()) {
      await cvcElement.fill('123');
    }

    // Submit payment
    await page.click('button:has-text("Subscribe")');

    // Should redirect to success page
    await expect(page).toHaveURL(/.*success/, { timeout: 15000 });

    // Should show success message
    await expect(
      page.locator('text=Subscription activated')
    ).toBeVisible();
  });

  test('should show subscription details in billing page', async ({ page }) => {
    // Navigate to billing (assuming user has active subscription)
    await page.goto('/dashboard/billing');

    // Should show subscription status
    await expect(page.locator('text=Active')).toBeVisible();

    // Should show plan details
    await expect(page.locator('text=$4,495')).toBeVisible();
    await expect(page.locator('text=/month')).toBeVisible();

    // Should show payment method
    await expect(page.locator('text=Visa')).toBeVisible();
    await expect(page.locator('text=•••• 4242')).toBeVisible();
  });

  test('should display billing history', async ({ page }) => {
    await page.goto('/dashboard/billing');

    // Should show invoices section
    await expect(page.locator('text=Billing History')).toBeVisible();

    // Should show at least one invoice
    await expect(page.locator('[data-testid="invoice-row"]')).toBeVisible();

    // Invoice should have required details
    await expect(page.locator('text=Paid')).toBeVisible();
  });

  test('should allow subscription cancellation', async ({ page }) => {
    await page.goto('/dashboard/billing');

    // Click cancel button
    await page.click('button:has-text("Cancel Subscription")');

    // Should show confirmation dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(
      page.locator('text=Are you sure you want to cancel?')
    ).toBeVisible();

    // Confirm cancellation
    await page.click('button:has-text("Yes, cancel")');

    // Should show success message
    await expect(
      page.locator('text=Subscription will cancel at period end')
    ).toBeVisible();

    // Status should update
    await expect(page.locator('text=Canceling')).toBeVisible();
  });

  test('should allow subscription reactivation', async ({ page }) => {
    await page.goto('/dashboard/billing');

    // Assuming subscription is set to cancel
    await page.click('button:has-text("Cancel Subscription")');
    await page.click('button:has-text("Yes, cancel")');

    // Wait for cancellation to process
    await expect(page.locator('text=Canceling')).toBeVisible();

    // Should show reactivate button
    await expect(page.locator('button:has-text("Reactivate")')).toBeVisible();

    // Click reactivate
    await page.click('button:has-text("Reactivate")');

    // Should show success message
    await expect(
      page.locator('text=Subscription reactivated')
    ).toBeVisible();

    // Status should return to active
    await expect(page.locator('text=Active')).toBeVisible();
  });

  test('should handle payment method update', async ({ page }) => {
    await page.goto('/dashboard/billing');

    // Click update payment method
    await page.click('button:has-text("Update Payment Method")');

    // Should open Stripe customer portal
    await expect(page).toHaveURL(/.*stripe\.com.*/, { timeout: 10000 });
  });

  test('should show cancel page when checkout is canceled', async ({
    page,
  }) => {
    await page.goto('/subscribe');

    // Simulate cancellation (click back or close)
    await page.click('[data-testid="cancel-checkout"]');

    // Should redirect to cancel page
    await expect(page).toHaveURL(/.*cancel/);

    // Should show appropriate message
    await expect(
      page.locator('text=Subscription canceled')
    ).toBeVisible();

    // Should offer to try again
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });

  test('should display usage statistics', async ({ page }) => {
    await page.goto('/dashboard/billing');

    // Should show usage metrics
    await expect(page.locator('text=Requests This Month')).toBeVisible();
    await expect(page.locator('text=Average Turnaround')).toBeVisible();
    await expect(page.locator('text=Total Value Delivered')).toBeVisible();

    // Should have numeric values
    await expect(page.locator('[data-testid="requests-count"]')).toHaveText(
      /\d+/
    );
  });
});
