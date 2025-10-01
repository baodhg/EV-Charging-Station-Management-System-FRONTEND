import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  webServer: { command: 'npm run dev -- --port 5173', port: 5173, reuseExistingServer: !process.env.CI },
  projects: [ { name: 'chromium', use: { ...devices['Desktop Chrome'] } } ],
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']]
});
