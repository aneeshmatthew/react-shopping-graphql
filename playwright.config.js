// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for ShopGraphQL E2E tests.
 *
 * Default: production — https://aneeshmatthew.github.io/react-shopping-graphql/
 * Local:   BASE_URL=http://localhost:5174/react-shopping-graphql npm run test:e2e
 *          (start dev server first: npm run dev)
 */
const baseURL =
  process.env.BASE_URL || 'https://aneeshmatthew.github.io/react-shopping-graphql';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Local: use system Chrome (avoids "Executable doesn't exist" in Cursor/sandbox).
        // CI: uses Playwright Chromium from "npx playwright install chromium --with-deps".
        ...(process.env.PLAYWRIGHT_USE_SYSTEM_CHROME ? { channel: 'chrome' } : {}),
      },
    },
  ],
});
