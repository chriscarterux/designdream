import { test, expect } from '@playwright/test';

test.describe('Admin Queue Management', () => {
  test.beforeEach(async ({ page }) => {
    // Assume admin is logged in
    await page.goto('/dashboard/queue');
  });

  test('should display kanban board with all columns', async ({ page }) => {
    // Should show all 5 columns
    await expect(page.locator('text=Backlog')).toBeVisible();
    await expect(page.locator('text=Up Next')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Review')).toBeVisible();
    await expect(page.locator('text=Done')).toBeVisible();
  });

  test('should display requests in columns', async ({ page }) => {
    // Should have at least one request card visible
    await expect(page.locator('[data-testid="request-card"]')).toBeVisible();

    // Request card should show key information
    const firstCard = page.locator('[data-testid="request-card"]').first();
    await expect(firstCard.locator('[data-testid="request-title"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="client-name"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="request-type"]')).toBeVisible();
  });

  test('should show request details on click', async ({ page }) => {
    // Click on a request card
    await page.click('[data-testid="request-card"]');

    // Should open detail modal/panel
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Should show full request details
    await expect(page.locator('[data-testid="request-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="created-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="updated-date"]')).toBeVisible();
  });

  test('should drag and drop request between columns', async ({ page }) => {
    // Find a request in backlog
    const backlogColumn = page.locator('[data-column="backlog"]');
    const upNextColumn = page.locator('[data-column="up-next"]');

    const requestCard = backlogColumn
      .locator('[data-testid="request-card"]')
      .first();

    if (await requestCard.isVisible()) {
      const requestTitle = await requestCard
        .locator('[data-testid="request-title"]')
        .textContent();

      // Drag to up-next column
      await requestCard.dragTo(upNextColumn);

      // Verify request moved
      await expect(
        upNextColumn.locator(`text=${requestTitle}`)
      ).toBeVisible();
    }
  });

  test('should enforce WIP limit on in-progress column', async ({ page }) => {
    // Try to move multiple requests from same client to in-progress
    const inProgressColumn = page.locator('[data-column="in-progress"]');

    // Get current count
    const currentCount = await inProgressColumn
      .locator('[data-testid="request-card"]')
      .count();

    // If there's already a request in progress for a client
    if (currentCount > 0) {
      const firstCard = inProgressColumn
        .locator('[data-testid="request-card"]')
        .first();
      const clientName = await firstCard
        .locator('[data-testid="client-name"]')
        .textContent();

      // Find another request from same client in backlog
      const backlogColumn = page.locator('[data-column="backlog"]');
      const sameClientCard = backlogColumn
        .locator(`[data-testid="request-card"]:has-text("${clientName}")`)
        .first();

      if (await sameClientCard.isVisible()) {
        // Try to drag to in-progress
        await sameClientCard.dragTo(inProgressColumn);

        // Should show WIP limit error
        await expect(page.locator('text=WIP limit reached')).toBeVisible();

        // Request should stay in backlog
        await expect(
          backlogColumn.locator(`text=${await sameClientCard.textContent()}`)
        ).toBeVisible();
      }
    }
  });

  test('should filter requests by client', async ({ page }) => {
    // Open filter menu
    await page.click('[data-testid="filter-button"]');

    // Select a client
    await page.click('[data-testid="client-filter"]');
    await page.click('[data-testid="client-option"]');

    // Should show only requests from that client
    const clientName = await page
      .locator('[data-testid="client-option"]')
      .first()
      .textContent();

    const visibleCards = page.locator('[data-testid="request-card"]');
    const count = await visibleCards.count();

    for (let i = 0; i < count; i++) {
      const card = visibleCards.nth(i);
      await expect(card.locator(`text=${clientName}`)).toBeVisible();
    }
  });

  test('should filter requests by priority', async ({ page }) => {
    // Open filter menu
    await page.click('[data-testid="filter-button"]');

    // Select priority
    await page.click('[data-testid="priority-filter"]');
    await page.click('[data-testid="priority-urgent"]');

    // Should show only urgent requests
    const visibleCards = page.locator('[data-testid="request-card"]');
    const count = await visibleCards.count();

    for (let i = 0; i < count; i++) {
      const card = visibleCards.nth(i);
      await expect(
        card.locator('[data-testid="priority-badge"]:has-text("urgent")')
      ).toBeVisible();
    }
  });

  test('should show SLA status indicators', async ({ page }) => {
    // Requests should show SLA indicators
    const requestCards = page.locator('[data-testid="request-card"]');

    if ((await requestCards.count()) > 0) {
      const firstCard = requestCards.first();

      // Should have SLA indicator
      await expect(
        firstCard.locator('[data-testid="sla-indicator"]')
      ).toBeVisible();

      // Should show time remaining
      await expect(
        firstCard.locator('[data-testid="time-remaining"]')
      ).toBeVisible();
    }
  });

  test('should highlight requests at risk', async ({ page }) => {
    // Find requests with yellow or red SLA warning
    const atRiskCards = page.locator(
      '[data-testid="request-card"][data-sla-warning="yellow"], [data-testid="request-card"][data-sla-warning="red"]'
    );

    if ((await atRiskCards.count()) > 0) {
      const atRiskCard = atRiskCards.first();

      // Should have visual indicator
      await expect(
        atRiskCard.locator('[data-testid="warning-indicator"]')
      ).toBeVisible();

      // Background or border should be highlighted
      const bgColor = await atRiskCard.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );

      // Should not be default white/transparent
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('should reorder requests within a column', async ({ page }) => {
    const backlogColumn = page.locator('[data-column="backlog"]');
    const requestCards = backlogColumn.locator('[data-testid="request-card"]');

    if ((await requestCards.count()) >= 2) {
      const firstCard = requestCards.nth(0);
      const secondCard = requestCards.nth(1);

      const firstTitle = await firstCard
        .locator('[data-testid="request-title"]')
        .textContent();

      // Drag first card below second card
      await firstCard.dragTo(secondCard, { targetPosition: { x: 0, y: 100 } });

      // First card should now be in second position
      const newFirstCard = backlogColumn
        .locator('[data-testid="request-card"]')
        .nth(1);
      await expect(
        newFirstCard.locator(`text=${firstTitle}`)
      ).toBeVisible();
    }
  });

  test('should update request status when moved', async ({ page }) => {
    const backlogColumn = page.locator('[data-column="backlog"]');
    const reviewColumn = page.locator('[data-column="review"]');

    const requestCard = backlogColumn
      .locator('[data-testid="request-card"]')
      .first();

    if (await requestCard.isVisible()) {
      const requestTitle = await requestCard
        .locator('[data-testid="request-title"]')
        .textContent();

      // Move to review
      await requestCard.dragTo(reviewColumn);

      // Click on the moved request
      await reviewColumn.locator(`text=${requestTitle}`).click();

      // Check status in detail view
      await expect(
        page.locator('[data-testid="request-status"]:has-text("review")')
      ).toBeVisible();
    }
  });

  test('should search for requests', async ({ page }) => {
    // Enter search term
    await page.fill('[data-testid="search-input"]', 'redesign');

    // Should filter results
    const visibleCards = page.locator('[data-testid="request-card"]');

    if ((await visibleCards.count()) > 0) {
      const count = await visibleCards.count();

      for (let i = 0; i < count; i++) {
        const card = visibleCards.nth(i);
        const text = await card.textContent();
        expect(text?.toLowerCase()).toContain('redesign');
      }
    }
  });

  test('should show empty state when no requests', async ({ page }) => {
    // Filter to show no results
    await page.fill('[data-testid="search-input"]', 'nonexistentrequest12345');

    // Should show empty state
    await expect(page.locator('text=No requests found')).toBeVisible();
  });

  test('should display request count per column', async ({ page }) => {
    const columns = [
      'backlog',
      'up-next',
      'in-progress',
      'review',
      'done',
    ];

    for (const columnId of columns) {
      const column = page.locator(`[data-column="${columnId}"]`);
      const countBadge = column.locator('[data-testid="request-count"]');

      if (await countBadge.isVisible()) {
        const countText = await countBadge.textContent();
        expect(countText).toMatch(/\d+/);
      }
    }
  });

  test('should refresh board data', async ({ page }) => {
    // Click refresh button
    await page.click('[data-testid="refresh-button"]');

    // Should show loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();

    // Should reload data
    await expect(
      page.locator('[data-testid="loading-spinner"]')
    ).not.toBeVisible({ timeout: 5000 });

    // Board should still be visible
    await expect(page.locator('[data-testid="request-card"]')).toBeVisible();
  });
});
