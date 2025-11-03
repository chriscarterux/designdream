import { test, expect } from '@playwright/test';

test.describe('Request Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Assume user is logged in
    await page.goto('/dashboard');
  });

  test('should display request form', async ({ page }) => {
    // Click new request button
    await page.click('button:has-text("New Request")');

    // Should show form
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();

    // Should show request type selector
    await expect(page.locator('[name="type"]')).toBeVisible();

    // Should show priority selector
    await expect(page.locator('[name="priority"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    // Try to submit without filling fields
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
  });

  test('should validate title length', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    // Enter too short title
    await page.fill('input[name="title"]', 'abc');
    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=Title must be at least 5 characters')
    ).toBeVisible();

    // Enter valid title
    await page.fill('input[name="title"]', 'Valid Request Title');

    // Error should disappear
    await expect(
      page.locator('text=Title must be at least 5 characters')
    ).not.toBeVisible();
  });

  test('should validate description length', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    await page.fill('input[name="title"]', 'Valid Title');

    // Enter too short description
    await page.fill('textarea[name="description"]', 'Too short');
    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=Description must be at least 20 characters')
    ).toBeVisible();
  });

  test('should submit valid request successfully', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    // Fill in valid data
    await page.fill('input[name="title"]', 'Redesign homepage hero section');
    await page.fill(
      'textarea[name="description"]',
      'We need to update the hero section with new branding and messaging to better reflect our value proposition.'
    );

    // Select type
    await page.selectOption('select[name="type"]', 'design');

    // Select priority
    await page.selectOption('select[name="priority"]', 'high');

    // Optional: Add timeline
    await page.fill('input[name="timeline"]', '3 days');

    // Submit
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(
      page.locator('text=Request submitted successfully')
    ).toBeVisible();

    // Should redirect to queue
    await expect(page).toHaveURL(/.*queue/);

    // Should see new request in backlog
    await expect(
      page.locator('text=Redesign homepage hero section')
    ).toBeVisible();
  });

  test('should handle file upload', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    // Fill required fields
    await page.fill('input[name="title"]', 'Design request with assets');
    await page.fill(
      'textarea[name="description"]',
      'Please review the attached mockup and provide feedback on the design direction.'
    );
    await page.selectOption('select[name="type"]', 'design');
    await page.selectOption('select[name="priority"]', 'medium');

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'mockup.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-content'),
    });

    // Should show file name
    await expect(page.locator('text=mockup.png')).toBeVisible();

    // Submit
    await page.click('button[type="submit"]');

    await expect(
      page.locator('text=Request submitted successfully')
    ).toBeVisible();
  });

  test('should validate file size', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    // Fill required fields
    await page.fill('input[name="title"]', 'Request with large file');
    await page.fill(
      'textarea[name="description"]',
      'This request has a file that is too large to upload.'
    );

    // Try to upload large file (simulated)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'large-file.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(11 * 1024 * 1024), // 11MB
    });

    // Should show error
    await expect(
      page.locator('text=File size must not exceed 10MB')
    ).toBeVisible();
  });

  test('should validate file type', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    await page.fill('input[name="title"]', 'Request with invalid file');
    await page.fill(
      'textarea[name="description"]',
      'This request has an invalid file type.'
    );

    // Try to upload invalid file type
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'script.js',
      mimeType: 'application/javascript',
      buffer: Buffer.from('console.log("hello")'),
    });

    // Should show error
    await expect(
      page.locator('text=File type must be JPEG, PNG, GIF, or PDF')
    ).toBeVisible();
  });

  test('should allow request type selection', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    const types = ['design', 'development', 'bug-fix', 'enhancement', 'consultation'];

    for (const type of types) {
      await page.selectOption('select[name="type"]', type);
      const selectedValue = await page.locator('select[name="type"]').inputValue();
      expect(selectedValue).toBe(type);
    }
  });

  test('should allow priority selection', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    const priorities = ['low', 'medium', 'high', 'urgent'];

    for (const priority of priorities) {
      await page.selectOption('select[name="priority"]', priority);
      const selectedValue = await page
        .locator('select[name="priority"]')
        .inputValue();
      expect(selectedValue).toBe(priority);
    }
  });

  test('should show character count for description', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    const description = 'This is a test description';
    await page.fill('textarea[name="description"]', description);

    // Should show character count
    await expect(
      page.locator(`text=${description.length}`)
    ).toBeVisible();
  });

  test('should save draft automatically', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    // Fill in some data
    await page.fill('input[name="title"]', 'Draft request');
    await page.fill(
      'textarea[name="description"]',
      'This is a draft that should be saved automatically.'
    );

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Should show saved indicator
    await expect(page.locator('text=Draft saved')).toBeVisible();

    // Navigate away and back
    await page.goto('/dashboard');
    await page.goto('/dashboard/requests/new');

    // Should restore draft
    await expect(page.locator('input[name="title"]')).toHaveValue(
      'Draft request'
    );
  });

  test('should clear form after successful submission', async ({ page }) => {
    await page.goto('/dashboard/requests/new');

    // Fill and submit
    await page.fill('input[name="title"]', 'Test request');
    await page.fill(
      'textarea[name="description"]',
      'This request will be submitted and form will be cleared.'
    );
    await page.selectOption('select[name="type"]', 'design');
    await page.selectOption('select[name="priority"]', 'medium');
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(
      page.locator('text=Request submitted successfully')
    ).toBeVisible();

    // If redirected back to form, fields should be empty
    if (await page.locator('input[name="title"]').isVisible()) {
      await expect(page.locator('input[name="title"]')).toHaveValue('');
    }
  });
});
