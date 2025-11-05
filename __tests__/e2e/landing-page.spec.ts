import { test, expect } from '@playwright/test';

test.describe('Landing Page (HOW-195 Requirements)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all required landing page sections', async ({ page }) => {
    // Hero section with value prop
    await expect(page.getByRole('heading', { name: /Your Always-On|One Partner/ })).toBeVisible();

    // How It Works section (use heading specifically)
    await expect(page.getByRole('heading', { name: 'How It Works' })).toBeVisible();

    // What You Get section
    await expect(page.getByRole('heading', { name: 'What You Get' })).toBeVisible();

    // Pricing section
    await expect(page.locator('text=$4,495').first()).toBeVisible();
    await expect(page.locator('text=/month/').first()).toBeVisible();

    // About Chris Carter section
    await expect(page.getByRole('heading', { name: /Chris Carter|Built by Someone Who/ })).toBeVisible();
    await expect(page.locator('text=/Microsoft|JPMorgan/').first()).toBeVisible();

    // FAQ section
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
  });

  test('full user journey: Homepage → How It Works → Pricing → Subscribe', async ({ page }) => {
    // Step 1: Land on homepage
    await expect(page).toHaveTitle(/Design Dream/);

    // Step 2: Scroll to "How It Works" section (use heading)
    const howItWorksSection = page.getByRole('heading', { name: 'How It Works' });
    await howItWorksSection.scrollIntoViewIfNeeded();
    await expect(howItWorksSection).toBeVisible();

    // Step 3: Verify 5-step process is visible (use heading for Subscribe step)
    await expect(page.getByRole('heading', { name: 'Subscribe' })).toBeVisible();

    // Step 4: Scroll to pricing
    const pricingSection = page.getByRole('heading', { name: /Simple, Transparent Pricing|Pricing/ });
    await pricingSection.scrollIntoViewIfNeeded();

    // Step 5: Verify pricing details
    await expect(page.locator('text=$4,495').first()).toBeVisible();
    await expect(page.locator('text=Unlimited requests').first()).toBeVisible();

    // Step 6: Click Subscribe button
    const subscribeButton = page.locator('a:has-text("Start"), button:has-text("Start")').first();
    await subscribeButton.click();

    // Step 7: Should navigate to subscription page
    await expect(page).toHaveURL(/.*subscribe/);
  });

  test('should have working CTA buttons that link to Stripe checkout', async ({ page }) => {
    // Find all CTA buttons
    const ctaButtons = page.locator('a:has-text("Start"), button:has-text("Subscribe")');

    // At least one CTA should be visible
    await expect(ctaButtons.first()).toBeVisible();

    // Click the first CTA
    await ctaButtons.first().click();

    // Should navigate to subscription or auth page
    await expect(page).toHaveURL(/.*subscribe|.*auth|.*login/);
  });

  test('should have working legal page links in footer', async ({ page }) => {
    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    // Test Terms of Service link
    const termsLink = page.locator('a[href="/terms"]');
    await expect(termsLink).toBeVisible();
    await termsLink.click();
    await expect(page).toHaveURL(/.*terms/);
    await expect(page.getByRole('heading', { name: 'Terms of Service', level: 1 })).toBeVisible();
    await page.goBack();

    // Test Privacy Policy link
    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink).toBeVisible();
    await privacyLink.click();
    await expect(page).toHaveURL(/.*privacy/);
    await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
    await page.goBack();

    // Test Refund Policy link
    const refundLink = page.locator('a[href="/refund-policy"]');
    await expect(refundLink).toBeVisible();
    await refundLink.click();
    await expect(page).toHaveURL(/.*refund/);
    await expect(page.getByRole('heading', { name: 'Refund Policy', level: 1 })).toBeVisible();
  });

  test('should display About Chris Carter section with correct details', async ({ page }) => {
    // Scroll to About section (use heading)
    const aboutSection = page.getByRole('heading', { name: /Built by Someone Who/ });
    await aboutSection.scrollIntoViewIfNeeded();

    // Should mention experience (use heading for "15+ Years")
    await expect(page.getByRole('heading', { name: /15\+ Years/ })).toBeVisible();

    // Should have professional image
    const aboutImage = page.locator('img[alt*="Chris Carter"]');
    await expect(aboutImage).toBeVisible();

    // Should have quote (use first match)
    await expect(page.locator('text=/embedded|partner/').first()).toBeVisible();
  });

  test('should display FAQ section with Accordion functionality', async ({ page }) => {
    // Scroll to FAQ (use heading)
    const faqSection = page.getByRole('heading', { name: 'Frequently Asked Questions' });
    await faqSection.scrollIntoViewIfNeeded();
    await expect(faqSection).toBeVisible();

    // Find an accordion trigger
    const firstQuestion = page.locator('button:has-text("How does the monthly subscription work?")');
    await expect(firstQuestion).toBeVisible();

    // Click to expand
    await firstQuestion.click();

    // Answer should be visible (use first match)
    await expect(page.locator('text=/\\$4,495.*month.*unlimited/').first()).toBeVisible();

    // Click again to collapse
    await firstQuestion.click();
  });

  test('should have responsive mobile layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    // Reload to ensure mobile layout
    await page.reload();

    // Hero should be visible on mobile (use heading)
    await expect(page.getByRole('heading', { name: /Your Always-On|One Partner/ })).toBeVisible();

    // CTA should be visible
    const mobileCTA = page.locator('a:has-text("Start"), button:has-text("Subscribe")').first();
    await expect(mobileCTA).toBeVisible();

    // Pricing should stack vertically on mobile
    await page.locator('text=$4,495').first().scrollIntoViewIfNeeded();
    await expect(page.locator('text=$4,495').first()).toBeVisible();
  });

  test('should display animations with Framer Motion', async ({ page }) => {
    // Scroll through page to trigger animations (use headings)
    const sections = [
      page.getByRole('heading', { name: 'How It Works' }),
      page.getByRole('heading', { name: 'What You Get' }),
      page.locator('text=$4,495').first(),
    ];

    for (const section of sections) {
      await section.scrollIntoViewIfNeeded();
      // Wait for animation to complete
      await page.waitForTimeout(500);
      await expect(section).toBeVisible();
    }
  });

  test('should have accessible keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // First focusable element should be a link or button
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(firstFocused);

    // Continue tabbing to verify focus trap doesn't exist
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Should still be on the page (not stuck)
    await expect(page).toHaveURL('/');
  });

  test('should have proper semantic HTML and ARIA labels', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();

    // Check for descriptive link text (not just "Click here")
    const links = await page.locator('a').all();
    for (const link of links.slice(0, 5)) { // Check first 5 links
      const text = await link.textContent();
      expect(text?.trim()).not.toBe('');
      expect(text?.toLowerCase()).not.toContain('click here');
    }
  });

  test('should load images with proper alt text', async ({ page }) => {
    // Find all images
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Check first few images have alt text
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy(); // Should have alt attribute
      }
    }
  });

  test('should have email contact link', async ({ page }) => {
    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    // Should have email link
    const emailLink = page.locator('a[href^="mailto:"]');
    await expect(emailLink.first()).toBeVisible();

    // Should be hello@designdream.is
    const href = await emailLink.first().getAttribute('href');
    expect(href).toContain('hello@designdream.is');
  });

  test('should show social proof or company logos', async ({ page }) => {
    // Check for mentions of major companies
    const bodyText = await page.locator('body').textContent();
    const hasSocialProof =
      bodyText?.includes('Microsoft') ||
      bodyText?.includes('JPMorgan') ||
      bodyText?.includes('Home Depot') ||
      bodyText?.includes('Indeed');

    expect(hasSocialProof).toBeTruthy();
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(2000); // Wait for any async errors

    // Filter out expected errors (like missing analytics in dev)
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('plausible') &&
        !error.includes('analytics') &&
        !error.includes('favicon')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
