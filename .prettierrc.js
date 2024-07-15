"use strict";

module.exports = {
  printWidth: 100,
  semi: true,
  arrowParens: "avoid",
  singleQuote: false,
  trailingComma: "es5",
  overrides: [
    {
      files: "*.md",
      options: {
        proseWrap: "never",
        printWidth: 80,
      },
    },
    {
      files: ["*.njk"],
      options: {
        plugins: ["prettier-plugin-jinja-template"],
        parser: "jinja-template",
      },
    },
  ],
};
