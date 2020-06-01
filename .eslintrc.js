module.exports = {
  globals: {
    server: true,
  },
  root: true,
  plugins: [
    'prettier',
  ],
  extends: [
    'simplabs',
    'prettier',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single'],

    'prettier/prettier': 'error',
  },
  parserOptions: {
    ecmaVersion: '2018'
  },
  overrides: [
    {
      files: [
        '.eslintrc.js',
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'lib/*/index.js',
        'scripts/**/*.js',
        'server/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2018,
      },
      env: {
        browser: false,
        node: true,
      },
    },
    // CLI scripts
    {
      files: ['scripts/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
