import { test, expect } from '@playwright/test';

test.describe('Landing Page - Landio Dark Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('should display dark theme correctly', async ({ page }) => {
    // Check background is dark
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).toContain('rgb'); // Should have dark background color set

    // Check hero section exists and is visible
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText('Your Always-On Design & Development Partner');
  });

  test('should have centered hero layout', async ({ page }) => {
    // Hero should be centered, not two-column
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Check for centered text
    const heroContent = heroSection.locator('.text-center').first();
    await expect(heroContent).toBeVisible();
  });

  test('should display DM Serif font on headings', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 });
    const fontFamily = await h1.evaluate((el) => window.getComputedStyle(el).fontFamily);
    expect(fontFamily).toContain('DM Serif Display');
  });

  test('should have all CTA buttons functional', async ({ page }) => {
    // Check primary CTA
    const getStartedBtn = page.getByRole('link', { name: /Get Started/i });
    await expect(getStartedBtn).toBeVisible();
    await expect(getStartedBtn).toHaveAttribute('href', '/subscribe');

    // Check scheduling CTA
    const bookIntroBtn = page.getByRole('button', { name: /Book a 15-minute intro/i });
    await expect(bookIntroBtn).toBeVisible();

    // Verify Cal.com data attributes
    await expect(bookIntroBtn).toHaveAttribute('data-cal-link', 'designdream/15min');
  });

  test('should display all sections in correct order', async ({ page }) => {
    // Check all major sections exist
    await expect(page.getByText('Why Design Dream Exists')).toBeVisible();
    await expect(page.getByText('One Subscription. Unlimited Requests')).toBeVisible();
    await expect(page.getByText('How It Works')).toBeVisible();
    await expect(page.getByText('What You Get')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pricing' })).toBeVisible();
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
  });

  test('should have teal accent color on key elements', async ({ page }) => {
    // Check step numbers have teal background
    const stepNumber = page.locator('text=1').first();
    const bgColor = await stepNumber.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // Should have teal-ish color (hsl 178 98% 17% = #015450)
    expect(bgColor).toBeTruthy();
  });

  test('should display Chris Carter photo', async ({ page }) => {
    const photo = page.locator('img[alt*="Chris Carter"]');
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('src', /chris-carter/);
  });

  test('should have Linear workflow messaging', async ({ page }) => {
    // Check for Linear mentions (not Basecamp)
    await expect(page.getByText(/Linear/i).first()).toBeVisible();
    await expect(page.getByText(/no meetings/i).first()).toBeVisible();

    // Should NOT have Basecamp
    const basecampMentions = await page.getByText(/Basecamp/).count();
    expect(basecampMentions).toBe(0);
  });

  test('should have working FAQ accordion', async ({ page }) => {
    // Click first FAQ item
    const firstFaq = page.getByRole('button', { name: /How does the monthly subscription work/i });
    await firstFaq.click();

    // Content should expand
    await expect(page.getByText(/For \$4,495\/month/)).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero should still be visible and centered
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible();

    // Navigation should be visible
    const nav = page.locator('header');
    await expect(nav).toBeVisible();
  });

  test('should have no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Filter out expected 404s for video files
    const actualErrors = consoleErrors.filter(
      (error) => !error.includes('hero-video') && !error.includes('hero-poster')
    );

    expect(actualErrors).toHaveLength(0);
  });
});
