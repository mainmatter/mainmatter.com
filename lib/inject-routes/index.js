/* eslint-env node */
'use strict';

const routesMap = require('../../config/routes-map.js');

module.exports = {
  name: 'inject-routes',

  contentFor(type) {
    if (type === 'head-footer') {
      let routes = routesMap();
      return `
        <script type="application/json" data-test-shoebox data-shoebox-routes>
          ${JSON.stringify(routes)}
        </script>
      `;
    } else {
      return '';
    }
  },

  isDevelopingAddon() {
    return true;
  },
};
