import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    setupFiles: "setup.ts",
    coverage: {
      provider: "istanbul",
      reportsDirectory: "coverage",
      reporter: ["text-summary", "html", "json"],
      exclude: ["src/db/data_source.ts", "src/graphql", "src/Utils"],
    },

    globals: true, // Ensure globals like 'describe' and 'it' are available
    environment: "node", // Ensure the environment is set to Node.js
  },
});
