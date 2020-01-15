'use strict';

const path = require('path');

const MergeTrees = require('broccoli-merge-trees');

const ComponentsBuilder = require('./lib/components-builder');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  preprocessTree(type, tree) {
    if (type === 'src') {
      let contentFolder = path.join(__dirname, '..', '..', '_appearances');
      let templatesFolder = path.join(__dirname, 'lib', 'templates');
      let talksPageTree = new ComponentsBuilder(contentFolder, templatesFolder);

      return new MergeTrees([tree, talksPageTree]);
    } else {
      return tree;
    }
  },
};
