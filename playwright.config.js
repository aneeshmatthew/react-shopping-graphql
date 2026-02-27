// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for ShopGraphQL E2E tests.
 *
 * Default: localhost (npm run test:e2e)
 * Production: npm run test:e2e:prod
 * Custom: BASE_URL=https://... npm run test:e2e
 *
 * If production tests fail with 404: ensure the app is deployed to GitHub Pages
 * and BASE_URL matches your GitHub username (e.g. aneeshmathew.github.io).
 */
const baseURL =
  process.env.BASE_URL || 'https://aneeshmathew.github.io/react-shopping-graphql';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 60_000 : 30_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    launchOptions: process.env.CI ? { args: ['--no-sandbox'] } : {},
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use system Chrome when PLAYWRIGHT_USE_SYSTEM_CHROME=1 (local).
        // CI sets PLAYWRIGHT_USE_SYSTEM_CHROME=0 and installs Chromium via playwright install.
        ...(process.env.PLAYWRIGHT_USE_SYSTEM_CHROME !== '0' ? { channel: 'chrome' } : {}),
      },
    },
  ],
});
