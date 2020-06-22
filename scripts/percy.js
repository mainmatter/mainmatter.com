const path = require('path');

const PercyScript = require('@percy/script');
const express = require('express');

process.setMaxListeners(Infinity);

const DIST_PATH = path.join(__dirname, '..', 'dist');
const ROUTES_MAP = require('../config/routes-map')();

let routes = ROUTES_MAP;
let paths = Object.keys(routes);

let nonBlogPaths = paths.filter((path) => !path.startsWith('/blog'));
let latestBlogPostsPaths = paths
  .filter((path) => path.startsWith('/blog/20'))
  .sort()
  .slice(-5);
let sampleBlogAuthorsPaths = paths.filter((path) => path.startsWith('/blog/author')).slice(-2);

let snapshotPaths = [...nonBlogPaths, ...latestBlogPostsPaths, ...sampleBlogAuthorsPaths, '/blog'];

let server = express();
server.use(express.static(DIST_PATH));

server.listen(3000, async function () {
  await PercyScript.run(async (page, percySnapshot) => {
    for (let path of snapshotPaths) {
      await page.goto(`http://localhost:3000${path}`);
      await percySnapshot(path);
    }
  });

  process.exit(0);
});
