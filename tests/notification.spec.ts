import { test, expect, type Page } from '@playwright/test';

const RM_USER = 'rm_user@nuvama.com';
const EXEC_USER = 'exec_user@nuvama.com';
const PASSWORD = 'cockpit2025';

const loginAs = async (page: Page, email: string) => {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test.describe('Login Notification for RM and Executive', () => {
  test('RM dashboard shows equity flow notification after 15 seconds', async ({ page }) => {
    // Login as RM
    await loginAs(page, RM_USER);
    await expect(page).toHaveURL(/\/rm$/);

    // Wait for dashboard to load
    await expect(page.getByText('Morning Rajesh, Welcome to Cockpit')).toBeVisible();

    // Notification should NOT be visible immediately
    await expect(page.getByTestId('notification-popup')).not.toBeVisible();

    // Wait 15 seconds for notification to appear
    await page.waitForTimeout(15000);

    // Notification should now be visible
    const notification = page.getByTestId('notification-popup');
    await expect(notification).toBeVisible();

    // Check notification content
    await expect(notification).toContainText('Equity Flow Signal');
    await expect(notification).toContainText('Belrise Industries Block Sale surged ~13%');
    await expect(notification).toContainText('click more for detail report');
  });

  test('Executive dashboard shows equity flow notification after 15 seconds', async ({ page }) => {
    // Login as Executive
    await loginAs(page, EXEC_USER);
    await expect(page).toHaveURL(/\/executive$/);

    // Wait for dashboard to load
    await expect(page.getByText('Managing Director - Artificial Intelligence Hub')).toBeVisible();

    // Notification should NOT be visible immediately
    await expect(page.getByTestId('notification-popup')).not.toBeVisible();

    // Wait 15 seconds for notification to appear
    await page.waitForTimeout(15000);

    // Notification should now be visible
    const notification = page.getByTestId('notification-popup');
    await expect(notification).toBeVisible();

    // Check notification content
    await expect(notification).toContainText('Equity Flow Signal');
    await expect(notification).toContainText('Belrise Industries Block Sale surged ~13%');
  });

  test('Notification can be dismissed', async ({ page }) => {
    // Login as RM
    await loginAs(page, RM_USER);
    await expect(page).toHaveURL(/\/rm$/);

    // Wait for notification
    await page.waitForTimeout(15000);
    const notification = page.getByTestId('notification-popup');
    await expect(notification).toBeVisible();

    // Click dismiss button (X icon)
    await notification.getByRole('button', { name: 'Dismiss notification' }).click();

    // Notification should disappear
    await expect(notification).not.toBeVisible();
  });

  test('Notification appears near the notification bell button', async ({ page }) => {
    // Login as RM
    await loginAs(page, RM_USER);
    await expect(page).toHaveURL(/\/rm$/);

    // Wait for notification
    await page.waitForTimeout(15000);
    const notification = page.getByTestId('notification-popup');
    await expect(notification).toBeVisible();

    // Get position of notification
    const notificationBox = await notification.boundingBox();
    expect(notificationBox).not.toBeNull();

    // Notification should be positioned from the right side (near the header buttons)
    if (notificationBox) {
      expect(notificationBox.x).toBeGreaterThan(500); // Should be on right side
    }
  });

  test('Notification only shows once per session', async ({ page }) => {
    // Login as RM
    await loginAs(page, RM_USER);
    await expect(page).toHaveURL(/\/rm$/);

    // Wait for notification
    await page.waitForTimeout(15000);
    const notification = page.getByTestId('notification-popup');
    await expect(notification).toBeVisible();

    // Dismiss notification
    await notification.getByRole('button', { name: 'Dismiss notification' }).click();
    await expect(notification).not.toBeVisible();

    // Navigate away and back
    await page.goto('/signals');
    await page.goto('/rm');

    // Wait another 15 seconds
    await page.waitForTimeout(15000);

    // Notification should NOT appear again
    await expect(page.getByTestId('notification-popup')).not.toBeVisible();
  });

  test('Notification shows on new session after clearing storage', async ({ page }) => {
    // Login as RM
    await loginAs(page, RM_USER);
    await expect(page).toHaveURL(/\/rm$/);

    // Wait for notification
    await page.waitForTimeout(15000);
    let notification = page.getByTestId('notification-popup');
    await expect(notification).toBeVisible();

    // Dismiss it
    await notification.getByRole('button', { name: 'Dismiss notification' }).click();

    // Clear session storage (simulating new session)
    await page.evaluate(() => {
      sessionStorage.clear();
    });

    // Reload page
    await page.reload();

    // Wait for notification again
    await page.waitForTimeout(15000);
    notification = page.getByTestId('notification-popup');
    await expect(notification).toBeVisible();
  });
});
