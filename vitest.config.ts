import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    setupFiles: ["app/test/nuxt/setup.ts"],
    exclude: ["**/app/test/e2e/**", "**/node_modules/**"],
  },
});
