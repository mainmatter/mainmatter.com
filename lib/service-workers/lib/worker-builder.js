'use strict';

const path = require('path');
const fs = require('fs-extra');

const BroccoliPlugin = require('broccoli-caching-writer');
const walkSync = require('walk-sync');
const Rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const virtual = require('rollup-plugin-virtual');
const uglify = require('rollup-plugin-uglify').uglify;
const babel = require('rollup-plugin-babel');

module.exports = class WorkerBuilder extends BroccoliPlugin {
  constructor(assetsFolder, workersFolder, options) {
    super([assetsFolder, workersFolder], options);

    this.options = options;
  }

  build() {
    let [assetsFolder, workersFolder] = this.inputPaths;

    let preloadAssetsList = this.findPreloadAssets(assetsFolder);
    let blogContentPreloadAssetsList = this.findBlogContentPreloadAssets(assetsFolder);

    let workers = this.findWorkers(workersFolder);

    let rollupPlugins = this.configureRollupPlugins(preloadAssetsList, blogContentPreloadAssetsList);
    return Promise.all(workers.map((worker) => this.rollupWorker(workersFolder, worker, rollupPlugins)));
  }

  findPreloadAssets(assetsFolder) {
    let files = walkSync(assetsFolder, {
      globs: ['**/*.png', '**/*.jpg', '**/*.gif', '**/*.svg', '**/*.woff2', '**/blog/page/*.js', '**/blog/author-*.js'],
      ignore: ['**/posts/**/*', '**/authors/**/*'],
    });
    return JSON.stringify(files);
  }

  findBlogContentPreloadAssets(assetsFolder) {
    let files = walkSync(assetsFolder, {
      globs: ['**/posts/**/*', '**/authors/**/*'],
      ignore: ['**/{posts,videos,workshops}/**/og-image?(-*).png'],
      directories: false,
    });
    return JSON.stringify(files);
  }

  findWorkers(workersFolder) {
    return walkSync(workersFolder, {
      globs: ['*.js'],
    });
  }

  async rollupWorker(workersFolder, worker, rollupPlugins) {
    let bundle = await Rollup.rollup({
      input: path.join(workersFolder, worker),
      plugins: rollupPlugins,
    });
    let { output } = await bundle.generate({
      file: worker,
      format: 'iife',
      sourcemap: this.options.sourcemap,
    });

    for (let asset of output) {
      fs.writeFileSync(path.join(this.outputPath, asset.fileName), asset.code);
    }
  }

  configureRollupPlugins(preloadAssetsList, blogContentPreloadAssetsList) {
    let rollupPlugins = [
      virtual({
        './assets/general/paths.js': `export default ${preloadAssetsList};`,
        './assets/blog/paths.js': `export default ${blogContentPreloadAssetsList};`,
      }),
      resolve({ jsnext: true, module: true, main: true }),
      commonjs(),
      babel({
        babelrc: false,
        presets: [['@babel/preset-env', { modules: false }]],
      }),
    ];

    if (this.options.minifyJS) {
      rollupPlugins.push(
        uglify({
          sourcemap: this.options.sourcemap,
        }),
      );
    }

    return rollupPlugins;
  }
};
