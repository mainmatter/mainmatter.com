'use strict';

const path = require('path');

const MergeTrees = require('broccoli-merge-trees');

const GlobalCssPrepender = require('./lib/global-css-prepender');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  included(app) {
    this._super(...arguments);

    this.options = {
      inline: app.options.minifyCSS.enabled,
    };
  },

  postprocessTree(type, appTree) {
    if (type !== 'all') {
      return appTree;
    } else {
      let prependedCssTree = new GlobalCssPrepender(appTree, path.join(this.root, 'css'), {
        inline: this.options.inline,
      });
      return new MergeTrees([appTree, prependedCssTree], { overwrite: true });
    }
  },
};
