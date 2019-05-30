/* eslint-env node */
'use strict';

const path = require('path');

const MergeTrees = require('broccoli-merge-trees');

const ComponentsBuilder = require('./lib/components-builder');
const FeedBuilder = require('./lib/feed-builder');

module.exports = {
  name: 'generate-blog',

  isDevelopingAddon() {
    return true;
  },

  preprocessTree(type, tree) {
    if (type === 'src') {
      let contentFolder = path.join(__dirname, '..', '..', '_posts');
      let templatesFolder = path.join(__dirname, 'lib', 'templates');
      let blogPagesTree = new ComponentsBuilder(contentFolder, templatesFolder);

      return new MergeTrees([tree, blogPagesTree]);
    } else {
      return tree;
    }
  },

  treeFor(type) {
    if (type === 'public') {
      let contentFolder = path.join(__dirname, '..', '..', '_posts');
      let feedTree = new FeedBuilder(contentFolder);

      return feedTree;
    }
  },
};


