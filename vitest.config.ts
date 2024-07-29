import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    server: {
      deps: {
        inline: ["D:/Intern/CRUD API - ORM/src/db/migration"],
      },
    },
    globals: true, // Ensure globals like 'describe' and 'it' are available
    environment: "node", // Ensure the environment is set to Node.js
  },
});
