/* eslint-env node */
'use strict';

const writeFile = require('broccoli-file-creator');
const MergeTrees = require('broccoli-merge-trees');

const routesMap = require('../../config/routes-map.js');
const getBuildDomain = require('../utils/get-build-domain');

module.exports = {
  name: 'routes',

  included() {
    this.routes = routesMap();
  },

  excludedRoutes: ['/404', '/imprint', '/privacy'],

  treeFor(type) {
    if (type === 'public') {
      return new MergeTrees([
        writeFile('routes.json', JSON.stringify(this.routes)),
        writeFile('sitemap.xml', generateSitemap(this.routes, this.excludedRoutes)),
      ]);
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

function generateSitemap(routes, excluded) {
  let domain = getBuildDomain();
  let sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  `;

  let paths = Object.keys(routes);

  for (let path of paths) {
    if (excluded.includes(path)) {
      continue;
    }

    if (!path.endsWith('/')) {
      path = `${path}/`;
    }

    sitemap += `
      <url>
        <loc>${domain}${path}</loc>
      </url>
    `;
  }

  sitemap += '</urlset>';

  return sitemap.replace(/^\s+|\s+$/g, '');
}
