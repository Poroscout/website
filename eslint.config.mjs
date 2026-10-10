import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const unusedVariables = {
  argsIgnorePattern: "^_",
  varsIgnorePattern: "^_",
  caughtErrors: "none",
  ignoreRestSiblings: true,
};

export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "dist/**",
      ".astro/**",
      ".wrangler/**",
      ".direnv/**",
      "coverage/**",
      "src/data/lqip.json",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,astro}"],
    extends: [js.configs.recommended],
    rules: {
      "no-unused-vars": ["error", unusedVariables],
    },
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: [
      "*.{js,mjs,cjs}",
      "scripts/**/*.{js,mjs,cjs}",
      "tests/**/*.{js,ts}",
    ],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,tsx,astro}"],
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", unusedVariables],
    },
  },
  {
    files: ["**/*.d.ts"],
    // Ambient declarations describe externally consumed names and namespaces.
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-namespace": "off",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      jsxA11y.flatConfigs.recommended,
    ],
    settings: { react: { version: "detect" } },
    rules: {
      // TypeScript supplies prop validation; prose does not need JSX escaping.
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      // Deliberately exclude the React Compiler-specific recommended rules.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
  ...astro.configs["flat/recommended"],
  ...astro.configs["flat/jsx-a11y-recommended"].map((config) =>
    config.plugins?.["jsx-a11y"]
      ? { ...config, files: ["**/*.astro"] }
      : config,
  ),
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    // Parse extracted client scripts as TS without depending on pnpm hoisting.
    processor: "astro/client-side-ts",
  },
  {
    files: ["**/*.astro"],
    // Surface legacy template accessibility issues without blocking adoption.
    rules: Object.fromEntries(
      Object.entries(jsxA11y.configs.recommended.rules)
        .filter(([name]) => name in astro.rules)
        .map(([name, rule]) => [
          `astro/${name}`,
          Array.isArray(rule) ? ["warn", ...rule.slice(1)] : "warn",
        ]),
    ),
  },
]);
