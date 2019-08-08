/* eslint-env node */
'use strict';

const writeFile = require('broccoli-file-creator');
const MergeTrees = require('broccoli-merge-trees');

const routesMap = require('../../config/routes-map.js');

module.exports = {
  name: 'routes',

  included() {
    this.routes = routesMap();
  },

  treeFor(type) {
    if (type === 'public') {
      return new MergeTrees([
        writeFile('routes.json', JSON.stringify(this.routes)),
        writeFile('sitemap.xml', generateSitemap(this.routes)),
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

function generateSitemap(routes) {
  let sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  `;

  let paths = Object.keys(routes).filter(path => path !== '/404');
  for (let path of paths) {
    if (!path.endsWith('/')) {
      path = `${path}/`;
    }

    sitemap += `
      <url>
        <loc>https://simplabs.com${path}</loc>
      </url>
    `;
  }

  sitemap += '</urlset>';

  return sitemap.replace(/^\s+|\s+$/g, '');
}
