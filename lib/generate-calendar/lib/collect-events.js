/* eslint-env node */
'use strict';

const path = require('path');

const glob = require('glob');

const separateMeta = require('../../markdown-content/separate-meta');

module.exports = function(folder) {
  return glob
    .sync('**/*.md', {
      cwd: folder,
      absolute: true,
    })
    .map(file => {
      let [meta, content] = separateMeta(file);
      meta.date = new Date(path.basename(file).substring(0, 10));

      return {
        meta,
        content,
      };
    });
};
