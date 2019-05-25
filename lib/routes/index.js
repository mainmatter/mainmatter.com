/* eslint-env node */
'use strict';

const writeFile = require('broccoli-file-creator');

const routesMap = require('../../config/routes-map.js');

module.exports = {
  name: 'routes',

  included() {
    this.routes = routesMap();
  },

  treeFor(type) {
    if (type === 'public') {
      return writeFile('routes.json', JSON.stringify(this.routes));
    }
  },

  contentFor(type) {
    if (type === 'head-footer') {
      return `
        <script type="application/json" data-test-shoebox data-shoebox-routes>
          ${JSON.stringify(this.routes)}
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
