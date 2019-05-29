'use strict';

const path = require('path');
const fs = require('fs-extra');

const BroccoliPlugin = require('broccoli-plugin');
const walkSync = require('walk-sync');
const CleanCSS = require('clean-css');

module.exports = class GlobalCssPrepender extends BroccoliPlugin {
  constructor(appCssFolder, globalCssFolder, options) {
    super([appCssFolder, globalCssFolder], options);

    this.options = options;
  }

  build() {
    if (this.options.inline) {
      this.prependGlobalCss();
    } else {
      this.copyGlobalCssFiles();
      this.importGlobalCss();
    }
  }

  buildGlobalCss() {
    let [, globalCssFolder] = this.inputPaths;

    let globalCssEntryFile = path.join(globalCssFolder, 'global.css');
    let globalCssStyles = fs.readFileSync(globalCssEntryFile, 'utf8');
    let input = {
      [globalCssEntryFile]: { styles: globalCssStyles },
    };
    let inlined = new CleanCSS({ level: 0, inline: ['local'], rebaseTo: globalCssFolder }).minify(input);
    return inlined.styles;
  }

  copyGlobalCssFiles() {
    let [, globalCssFolder] = this.inputPaths;
    let globalCssFiles = this.findGlobalCssFiles();
    for (let file of globalCssFiles) {
      fs.copyFileSync(path.join(globalCssFolder, file), path.join(this.outputPath, path.basename(file)));
    }
  }

  prependGlobalCss() {
    let globalCss = this.buildGlobalCss();
    this.prependAppCss(globalCss);
  }

  importGlobalCss() {
    this.prependAppCss('@import "global.css";');
  }

  readAppCss() {
    let [appCssFolder] = this.inputPaths;

    return fs.readFileSync(path.join(appCssFolder, 'app.css'), 'utf8');
  }

  findGlobalCssFiles() {
    let [, globalCssFolder] = this.inputPaths;
    return walkSync(globalCssFolder, {
      globs: ['**/*.css'],
    });
  }

  prependAppCss(prepend) {
    let appCss = this.readAppCss();
    fs.writeFileSync(path.join(this.outputPath, 'app.css'), `${prepend}\n${appCss}`);
  }
};
