import { defineConfig, devices } from "@playwright/test";

const publicBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const localBaseURL = "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: publicBaseURL ?? localBaseURL,
    trace: "retain-on-failure",
  },
  webServer: publicBaseURL
    ? undefined
    : {
        command: "npm run start -- --hostname 127.0.0.1 --port 3000",
        url: `${localBaseURL}/api/health`,
        reuseExistingServer: false,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
