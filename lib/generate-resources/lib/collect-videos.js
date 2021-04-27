/* eslint-env node */
'use strict';

const path = require('path');

const glob = require('glob');

const separateMeta = require('../../markdown-content/separate-meta');

module.exports = function (folder) {
  return glob
    .sync('**/*.md', {
      cwd: folder,
      absolute: true,
    })
    .map((file) => {
      let [meta, content] = separateMeta(file);
      meta.date = new Date(path.basename(file).substring(0, 10));
      let componentName = buildVideoComponentName(file);
      let queryPath = buildQueryPath(file);

      return {
        componentName,
        queryPath,
        meta,
        content,
      };
    });
};

function buildVideoComponentName(file) {
  let cleanedFileName = path
    .basename(file, '.md')
    .replace(/-[a-zA-Z]/g, (match) => match.replace('-', '').toUpperCase())
    .replace(/-/g, '')
    .replace(/[^a-zA-Z0-9]/, '_');

  return `PageResourcesBuiltToLastVideo${cleanedFileName}`;
}

function buildQueryPath(file) {
  return path.basename(file, '.md').replace(/(\d+)-(\d+)-(\d+)-(.+)/, '$1/$2/$3/$4');
}
