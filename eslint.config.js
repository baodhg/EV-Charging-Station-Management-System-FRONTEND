// eslint.config.js  (ESLint v9 - flat config)
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  // Bỏ qua output/build
  { ignores: ["dist/**", "coverage/**", "node_modules/**"] },

  // Base khuyến nghị
  js.configs.recommended,

  // FRONTEND (browser) - áp cho src/**
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: { ...globals.browser, ...globals.es2021 }, // document, window, localStorage, fetch, console, setTimeout...
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      "no-undef": "off", // tránh false-positive trong TS với DOM types (RequestInit/Response)
      "react/react-in-jsx-scope": "off", // React 17+ không cần import React
      "react/jsx-uses-react": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // NODE (config & scripts) - áp cho file node-side
  {
    files: [
      "vite.config.*",
      "playwright.config.*",
      "scripts/**/*.{js,cjs,mjs,ts}",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: { ...globals.node, ...globals.es2021 }, // process, __dirname, console...
    },
    rules: {
      "no-undef": "off", // để chắc ăn, tránh phạt process/console nếu rule gốc set quá chặt
    },
  },
];
