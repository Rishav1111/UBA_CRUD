// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Other test configurations can go here
    coverage: {
      provider: "istanbul", // Use istanbul as the coverage provider
      reporter: ["text", "json", "html"], // Coverage reporters you want to use
      reportsDirectory: "./coverage", // Directory where the coverage reports will be saved
      include: ["src/**/*.{js,ts,vue}"], // Include patterns for files to cover
      exclude: ["node_modules", "tests"], // Exclude patterns for files not to cover
    },
  },
});
