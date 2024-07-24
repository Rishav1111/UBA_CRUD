import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // Ensure globals like 'describe' and 'it' are available
    environment: "node", // Ensure the environment is set to Node.js
    // Remove transform property for Vitest
    // Set the timeout for tests to 10 seconds
  },
});
