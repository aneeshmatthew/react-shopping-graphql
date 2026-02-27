// @ts-check
import { test, expect } from '@playwright/test';

const cartLink = (page) => page.locator('a.navbar__link[href*="cart"]');

test.describe('Product detail page', () => {
  test('navigates from product card to detail', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    const firstCard = page.locator('.product-card').first();
    const productName = await firstCard.locator('.product-card__name').textContent();
    await firstCard.click();
    await expect(page).toHaveURL(/\/product\//);
    await expect(page.getByRole('heading', { name: productName?.trim() ?? '' })).toBeVisible();
  });

  test('shows product info and add to cart button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    await page.locator('.product-card').first().click();
    await expect(page.locator('.product-detail__name')).toBeVisible();
    await expect(page.locator('.product-detail__price')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible();
  });

  test('add to cart from detail page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    const productName = await page.locator('.product-card').first().locator('.product-card__name').textContent();
    await page.locator('.product-card').first().click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByRole('button', { name: '✓ Added to Cart' })).toBeVisible();
    await cartLink(page).click();
    await expect(page.locator('.cart-table__name')).toContainText(productName?.trim() ?? '');
  });

  test('breadcrumb links work', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    await page.locator('.product-card').first().click();
    await page.getByRole('link', { name: 'Products' }).first().click();
    await expect(page).toHaveURL(/\/react-shopping-graphql\/?$/);
  });
});
