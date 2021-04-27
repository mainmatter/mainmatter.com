'use strict';

const path = require('path');

const MergeTrees = require('broccoli-merge-trees');

const ComponentsBuilder = require('./lib/components-builder');
const BroccoliDebug = require('broccoli-debug');
module.exports = {
  name: require('./package').name,

  preprocessTree(type, tree) {
    if (type === 'src') {
      let videosContentFolder = path.join(__dirname, '..', '..', '_videos');
      let workshopsContentFolder = path.join(__dirname, '..', '..', '_workshops');
      let templatesFolder = path.join(__dirname, 'lib', 'templates');
      let resourcePagesTree = new ComponentsBuilder(videosContentFolder, workshopsContentFolder, templatesFolder);

      return new MergeTrees([tree, new BroccoliDebug(resourcePagesTree, 'resources:all')]);
    } else {
      return tree;
    }
  },

  isDevelopingAddon() {
    return true;
  },
};
