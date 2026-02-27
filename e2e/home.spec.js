// @ts-check
import { test, expect } from '@playwright/test';
import { waitForProductGrid, waitForHomePage } from './helpers.js';

test.describe('Home page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await waitForHomePage(page);
    await expect(page.getByText('Shop the latest collection')).toBeVisible();
  });

  test('displays product grid', async ({ page }) => {
    await page.goto('/');
    await waitForProductGrid(page);
    const cards = page.locator('.product-card');
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(12);
  });

  test('search bar is visible', async ({ page }) => {
    await page.goto('/');
    await waitForHomePage(page);
    await expect(page.getByRole('main').getByPlaceholder('Search products...')).toBeVisible();
  });

  test('navbar links work', async ({ page }) => {
    await page.goto('/');
    await waitForHomePage(page);
    await page.locator('nav a.navbar__link:not([href*="cart"])').first().click();
    await expect(page).toHaveURL(/\/react-shopping-graphql\/?$/);
    await page.locator('nav a.navbar__link[href*="cart"]').click();
    await expect(page).toHaveURL(/\/cart/);
  });

  test('footer shows copyright', async ({ page }) => {
    await page.goto('/');
    await waitForHomePage(page);
    await expect(page.getByText(/ShopGraphQL.*Built with React/)).toBeVisible();
  });

  test('search filters products', async ({ page }) => {
    await page.goto('/');
    await waitForProductGrid(page);
    const searchInput = page.getByRole('main').getByPlaceholder('Search products...');
    await searchInput.fill('laptop');
    await searchInput.press('Enter');
    await expect(page.getByText(/Search results for/)).toBeVisible({ timeout: 5000 });
  });

  test('sort dropdown works', async ({ page }) => {
    await page.goto('/');
    await waitForProductGrid(page);
    await page.locator('#sort-select').selectOption('{"name":"ASC"}');
    await expect(page.locator('.product-card').first()).toBeVisible();
  });
});
