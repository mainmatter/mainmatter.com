'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  contentFor(type) {
    if (type === 'head') {
      return `
        <meta name="keywords" content="ember, elixir, consulting, web apps, progressive web apps, software engineering, rest apis, software architecture, software design, training, ui, ux" />
        <meta name="language" content="en" />
        <meta name="content-language" content="en" />
        <meta name="publisher" content="simplabs GmbH" />
        <link type="application/atom+xml" rel="alternate" href="https://simplabs.com/feed.xml" title="simplabs Blog" />
      `;
    } else {
      return '';
    }
  },
};
