"use strict";

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "2020",
    sourceType: "module",
  },
  plugins: ["prettier", "node"],
  extends: ["eslint:recommended", "prettier"],
  env: {
    node: true,
    browser: false,
    es6: true,
  },
  rules: {
    "prettier/prettier": "error",
  },
  overrides: [
    {
      // Test files:
      files: ["src/assets/**/*.js"],
      env: {
        node: false,
        browser: true,
      },
    },
  ],
};
