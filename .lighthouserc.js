'use strict';

module.exports = {
  ci: {
    collect: {
      settings: {
        skipAudits: ['is-on-https', 'redirects-http', 'uses-http2', 'uses-webp-images'],
      },
    },
    assert: {
      assertions: {
        'is-on-https': 'off',
        'redirects-http': 'off',
        'uses-http2': 'off',
        'uses-webp-images': 'off',
      },
    },
  },
};