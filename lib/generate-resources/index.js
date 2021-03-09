'use strict';

const path = require('path');

const MergeTrees = require('broccoli-merge-trees');

const ComponentsBuilder = require('./lib/components-builder');

module.exports = {
  name: require('./package').name,

  preprocessTree(type, tree) {
    if (type === 'src') {
      let contentFolder = path.join(__dirname, '..', '..', '_videos');
      let templatesFolder = path.join(__dirname, 'lib', 'templates');
      let videoPagesTree = new ComponentsBuilder(contentFolder, templatesFolder);

      return new MergeTrees([tree, videoPagesTree]);
    } else {
      return tree;
    }
  },

  isDevelopingAddon() {
    return true;
  },
};
