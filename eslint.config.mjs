import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vitest from "eslint-plugin-vitest";
import prettier from "eslint-plugin-prettier";

export default [
  {
    ignores: ["dist/", "node_modules/", "html/assets/", "src/graphql/"],
  },
  {
    files: ["src/**/*.{js,ts,cjs,tsx}", "tests/**/*.{js,ts,cjs,tsx}"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      vitest,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/ban-ts-comment": "warn",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
];
