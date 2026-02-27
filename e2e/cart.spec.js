// @ts-check
import { test, expect } from '@playwright/test';

const cartLink = (page) => page.locator('a.navbar__link[href*="cart"]');

test.describe('Cart', () => {
  test('empty cart shows empty state', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    await cartLink(page).click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start Shopping' })).toBeVisible();
  });

  test('add to cart from product card updates badge', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    const firstCard = page.locator('.product-card').first();
    await firstCard.locator('.product-card__quick-add').click();
    await expect(page.locator('.navbar__cart-badge')).toHaveText('1');
  });

  test('add to cart and view cart page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    const firstCard = page.locator('.product-card').first();
    const productName = await firstCard.locator('.product-card__name').textContent();
    await firstCard.locator('.product-card__quick-add').click();
    await cartLink(page).click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.cart-table__name')).toContainText(productName?.trim() ?? '');
    await expect(page.locator('.cart-summary__total')).toBeVisible();
  });

  test('quantity controls work', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    await page.locator('.product-card').first().locator('.product-card__quick-add').click();
    await cartLink(page).click();
    await expect(page.locator('.quantity-control__value')).toHaveText('1');
    await page.getByLabel('Increase quantity').click();
    await expect(page.locator('.quantity-control__value')).toHaveText('2');
    await page.getByLabel('Decrease quantity').click();
    await expect(page.locator('.quantity-control__value')).toHaveText('1');
  });

  test('remove from cart', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-grid')).toBeVisible({ timeout: 10000 });
    await page.locator('.product-card').first().locator('.product-card__quick-add').click();
    await cartLink(page).click();
    await expect(page.locator('.cart-table__row')).toHaveCount(1);
    await page.getByRole('button', { name: /Remove/ }).click();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });
});
