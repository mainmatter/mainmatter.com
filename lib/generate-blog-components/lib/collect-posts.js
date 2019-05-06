/* eslint-env node */
'use strict';

const path = require('path');

const glob = require('glob');

const separateMeta = require('../../markdown-content/separate-meta');

module.exports = function(folder) {
  let posts = glob
    .sync('**/*.md', {
      cwd: folder,
      absolute: true,
    })
    .map(file => {
      let queryPath = buildQueryPath(file);
      let componentName = buildComponentName(file);
      let [meta, excerpt, content] = separateMeta(file);

      return {
        queryPath,
        componentName,
        meta,
        excerpt,
        content,
      };
    });

  return { posts };
};

function buildQueryPath(file) {
  return path.basename(file, '.md');
}

function buildComponentName(file) {
  let cleanedFileName = path
    .basename(file, '.md')
    .replace(/-[a-zA-Z]/g, match => match.replace('-', '').toUpperCase())
    .replace(/-/g, '')
    .replace(/[^a-zA-Z0-9]/, '_');

  return `BlogPost${cleanedFileName}`;
}
