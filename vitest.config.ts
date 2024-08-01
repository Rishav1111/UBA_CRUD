import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      exclude: ["src/db/data_source.ts"],
    },

    globals: true, // Ensure globals like 'describe' and 'it' are available
    environment: "node", // Ensure the environment is set to Node.js
  },
});
