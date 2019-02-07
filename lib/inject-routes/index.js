/* eslint-env node */
'use strict';

const replace = require('broccoli-string-replace');
const routesMap = require('../../config/routes-map.js');

module.exports = {
  name: 'inject-routes',

  postprocessTree(type, tree) {
    if (type === 'all') {
      let routes = routesMap();
      return replace(tree, {
        files: ['*.{ts,js}'],
        pattern: {
          match: /__ROUTES_MAP__/g,
          replacement: JSON.stringify(routes)
        }
      });
    } else {
      return tree;
    }
  },

  isDevelopingAddon() {
    return true;
  }
};
