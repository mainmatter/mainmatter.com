/* eslint-env node */
'use strict';

const path = require('path');
const process = require('process');

const glob = require('glob');

const separateMeta = require('../../markdown-content/separate-meta');

module.exports = function (folder) {
  let channels = glob.sync('*/', {
    cwd: folder,
    absolute: true,
  });

  if (process.env.LIMIT_CONTENT_ARCHIVE) {
    channels = channels.slice(0, 3);
  }

  return channels.map((channelFolder) => {
    let date = new Date(path.basename(channelFolder).substring(0, 10));
    let [meta, description] = separateMeta(path.join(channelFolder, 'channel.md'));

    let appearances = glob
      .sync('**/*.md', {
        cwd: path.join(channelFolder, 'appearances'),
        absolute: true,
      })
      .map((file) => {
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
      appearances,
    };
  });
};
