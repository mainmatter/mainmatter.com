/* eslint-env node */
'use strict';

const path = require('path');

const glob = require('glob');

const separateMeta = require('../../markdown-content/separate-meta');

module.exports = function(folder) {
  return glob
    .sync('*/', {
      cwd: folder,
      absolute: true,
    })
    .map(conferenceFolder => {
      let date = new Date(path.basename(conferenceFolder).substring(0, 10));
      let [meta, description] = separateMeta(path.join(conferenceFolder, 'conference.md'));

      let talks = glob
        .sync('**/*.md', {
          cwd: path.join(conferenceFolder, 'talks'),
          absolute: true,
        })
        .map(file => {
          let [meta, description] = separateMeta(file);

          return {
            meta,
            description,
          };
        });

      return {
        meta: {
          ...meta,
          date,
        },
        description,
        talks,
      };
    });
};
