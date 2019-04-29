/* eslint-env node */
'use strict';

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

      return {
        meta,
        content,
      };
    });
};
