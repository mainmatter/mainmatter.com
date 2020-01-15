'use strict';

const path = require('path');

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  contentFor(type) {
    if (type === 'head-footer') {
      return `
        <link rel="manifest" href="/manifest.webmanifest">
        <meta name="theme-color" content="#007df6"/>
        <link rel="apple-touch-icon" href="/assets/images/app-images/512x512.png">
      `;
    }

    return '';
  },

  treeForPublic() {
    let filesDir = path.join(__dirname, 'files');
    let manifestTree = Funnel(filesDir, {
      files: ['manifest.webmanifest'],
    });
    let imagesTree = Funnel(filesDir, {
      srcDir: 'app-images',
      destDir: 'assets/images/app-images',
    });

    return MergeTrees([manifestTree, imagesTree]);
  },
};
