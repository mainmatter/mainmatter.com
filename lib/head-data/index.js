'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  contentFor(type) {
    if (type === 'head') {
      return `
        <meta name="language" content="en" />
        <meta name="content-language" content="en" />
        <meta name="publisher" content="simplabs GmbH" />
        <meta property="fb:admins" content="699569440119973" />
        <meta property="og:site_name" content="simplabs" />
        <meta name="twitter:site" content="@simplabs">
        <link type="application/atom+xml" rel="alternate" href="https://simplabs.com/feed.xml" title="simplabs Blog" />
      `;
    } else {
      return '';
    }
  },
};
