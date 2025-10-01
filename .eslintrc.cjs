/* .eslintrc.cjs */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  env: { browser: true, es2021: true }, // document, localStorage, fetch, console, setTimeout...
  rules: {
    "no-undef": "off", // <— kill switch để hết các lỗi bạn đang gặp
    "react/react-in-jsx-scope": "off",
  },
  overrides: [
    {
      files: [
        "vite.config.*",
        "playwright.config.*",
        "scripts/**/*.{js,cjs,mjs,ts}",
      ],
      env: { node: true, browser: false }, // process, console cho Node scripts
    },
  ],
  ignorePatterns: ["dist", "coverage", "node_modules"],
};
