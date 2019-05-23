'use strict';

const path = require('path');
const fs = require('fs-extra');

const BroccoliPlugin = require('broccoli-plugin');
const walkSync = require('walk-sync');
const Replace = require('broccoli-string-replace');

module.exports = class WorkerBuilder extends BroccoliPlugin {
  constructor(assetsFolder, workersFolder, options) {
    super([assetsFolder, workersFolder], options);
  }

  build() {
    let [assetsFolder, workersFolder] = this.inputPaths;
    let assetFiles = walkSync(assetsFolder, {
      globs: ['**/*.png', '**/*.jpg', '**/*.gif', '**/*.svg']
    });
    let assetsArray = JSON.stringify(assetFiles);

    let workers = walkSync(workersFolder, {
      globs: ['**/*.js']
    });
    for (let worker of workers) {
      let workerSource = fs.readFileSync(path.join(workersFolder, worker)).toString();
      workerSource = workerSource.replace(/\/\* __IMAGE_ASSETS__ \*\/[^;]*;/, `${assetsArray};`);

      let workerName = path.basename(worker);
      fs.writeFileSync(path.join(this.outputPath, workerName), workerSource);
    }
  }
}
