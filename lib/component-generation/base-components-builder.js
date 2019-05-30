'use strict';

const BroccoliPlugin = require('broccoli-caching-writer');

const prepareTemplates = require('./prepare-templates');

module.exports = class BaseComponentsBuilder extends BroccoliPlugin {
  constructor(contentFolder, templatesFolder, options) {
    super([contentFolder, templatesFolder], options);

    this.options = options;
    this.contentFolder = contentFolder;
    this.templatesFolder = templatesFolder;
  }

  build() {
    this.templates = prepareTemplates(this.templatesFolder);

    this.collectContent();
    this.writeComponentFiles();
  }

  collectContent() {
    throw new Error('collectContent must be implemented in subclasses of BaseComponentsBuilder!');
  }

  writeComponentFiles() {
    throw new Error('writeComponentFiles must be implemented in subclasses of BaseComponentsBuilder!');
  }
};
