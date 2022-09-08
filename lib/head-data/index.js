'use strict';

const getBuildDomain = require('../utils/get-build-domain');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  contentFor(type) {
    if (type === 'head') {
      const domain = getBuildDomain();
      return `
        <meta name="language" content="en" />
        <meta name="content-language" content="en" />
        <meta name="publisher" content="Mainmatter GmbH" />
        <meta property="fb:admins" content="699569440119973" />
        <meta property="og:site_name" content="simplabs" />
        <meta name="twitter:site" content="@simplabs">
        <meta name="twitter:card" content="summary">
        <link type="application/atom+xml" rel="alternate" href="${domain}/feed.xml" title="simplabs Blog" />
      `;
    } else {
      return '';
    }
  },
};
