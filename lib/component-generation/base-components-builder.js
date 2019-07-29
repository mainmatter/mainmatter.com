'use strict';

const path = require('path');

const fs = require('fs-extra');

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

  writeComponent(name, template, stylesheet, implementation = null) {
    let folderName = path.join(this.outputPath, 'src', 'ui', 'components', name);
    fs.ensureDirSync(folderName);

    fs.writeFileSync(path.join(folderName, 'template.hbs'), template);

    fs.writeFileSync(path.join(folderName, 'stylesheet.css'), stylesheet);

    if (implementation) {
      fs.writeFileSync(path.join(folderName, 'component.ts'), implementation);
    }
  }
};
