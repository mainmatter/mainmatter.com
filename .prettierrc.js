'use strict';

module.exports = {
  printWidth: 100,
  semi: true,
  arrowParens: 'avoid',
  singleQuote: false,
  trailingComma: 'es5',
  overrides: [
    {
      files: "*.md",
      options: {
        printWidth: 80,
        proseWrap: "always"
      },
    },
  ]
};
