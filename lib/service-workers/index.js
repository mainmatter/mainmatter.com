'use strict';

const path = require('path');

const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

const WorkerBuilder = require('./lib/worker-builder');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  included(app) {
    this._super(...arguments);

    this.options = {
      sourcemaps: app.options.sourcemaps.enabled,
      minifyJS: app.options.minifyJS.enabled,
    };

    app.options = app.options || {};
    app.options.fingerprint = app.options.fingerprint || {};
    app.options.fingerprint.exclude = app.options.fingerprint.exclude || [];
    app.options.fingerprint.exclude.push('service-worker.js');
  },

  contentFor(/* type */) {
    if (process.env.EMBER_ENV === 'development') {
      return '';
    }

    // if (type === 'body-footer') {
    //   return `
    //     <script>
    //       if ('serviceWorker' in navigator) {
    //         navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).catch(function() {
    //           // ignore errors
    //         });
    //       }
    //     </script>
    //   `;
    // }

    return '';
  },

  postprocessTree(type, appTree) {
    if (type !== 'all') {
      return appTree;
    } else {
      let bareIndexHtmlTree = copyBareIndexHtml(appTree);
      let workerTree = new WorkerBuilder(appTree, path.join(this.root, 'workers'), this.options);
      return new MergeTrees([appTree, bareIndexHtmlTree, workerTree]);
    }
  },
};

function copyBareIndexHtml(appTree) {
  return new Funnel(appTree, {
    include: ['index.html'],
    getDestinationPath(relativePath) {
      if (relativePath === 'index.html') {
        return 'bare-index.html';
      }

      return relativePath;
    },
  });
}
