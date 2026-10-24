import { devices } from "@playwright/test";
import { withGuidepup } from "@guidepup/playwright";

const config = withGuidepup({
  reportSlowTests: null,
  timeout: 1 * 60 * 1000,
  retries: 0,
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});

export default config;
