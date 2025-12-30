import { test, expect, type Page } from '@playwright/test';

const RM_USER = 'rm_user@kairoscapital.mu';
const EXEC_USER = 'exec_user@kairoscapital.mu';
const PASSWORD = 'cockpit2025';

const loginAs = async (page: Page, email: string) => {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('RM login redirects to /rm', async ({ page }) => {
  await loginAs(page, RM_USER);
  await expect(page).toHaveURL(/\/rm$/);
});

test('Executive login redirects to /executive', async ({ page }) => {
  await loginAs(page, EXEC_USER);
  await expect(page).toHaveURL(/\/executive$/);
});

test('RM cannot access executive dashboard', async ({ page }) => {
  await loginAs(page, RM_USER);
  await page.goto('/executive');
  await expect(page).toHaveURL(/\/rm/);
});

test('User menu toggles and logout clears auth', async ({ page }) => {
  await loginAs(page, RM_USER);
  await expect(page).toHaveURL(/\/rm$/);

  const userMenuButton = page.locator('button[aria-haspopup="menu"]');
  await userMenuButton.click();
  await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();

  await page.mouse.click(10, 10);
  await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeHidden();

  await userMenuButton.click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login$/);

  const storedAuth = await page.evaluate(() => ({
    local: localStorage.getItem('kairos_auth'),
    session: sessionStorage.getItem('kairos_auth'),
  }));
  expect(storedAuth.local).toBeNull();
  expect(storedAuth.session).toBeNull();
});
