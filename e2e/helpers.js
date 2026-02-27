// @ts-check
import { expect } from '@playwright/test';

export const PRODUCT_GRID_TIMEOUT = 30_000;
export const PAGE_LOAD_TIMEOUT = 30_000;

export const cartLink = (page) => page.locator('a.navbar__link[href*="cart"]');

export async function waitForProductGrid(page) {
  await expect(page.locator('.product-grid')).toBeVisible({ timeout: PRODUCT_GRID_TIMEOUT });
}

export async function waitForHomePage(page) {
  await expect(page.getByRole('heading', { name: 'Discover Amazing Products' })).toBeVisible({ timeout: PAGE_LOAD_TIMEOUT });
}
