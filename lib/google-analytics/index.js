'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  contentFor(type) {
    if (process.env.EMBER_ENV === 'development') {
      return '';
    }

    if (type === 'body-footer') {
      return `
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-53237918-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-53237918-1');
        </script>
      `;
    }

    return '';
  },
};
