const js = require("@eslint/js");
const globals = require("globals");
const prettier = require("eslint-plugin-prettier");
const eslintConfigPrettier = require("eslint-config-prettier");
const node = require("eslint-plugin-node");

module.exports = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ["dist/", "assets/"],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: { prettier, node },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    // Test files:
    files: ["src/assets/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
];
