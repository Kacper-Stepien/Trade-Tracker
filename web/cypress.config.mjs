import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    env: {
      // API base URL for e2e tests
      apiUrl: "http://localhost:3000/api",
    },
    setupNodeEvents(_on, config) {
      return config;
    },
  },
});
