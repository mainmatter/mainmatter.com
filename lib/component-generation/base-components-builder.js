'use strict';

const path = require('path');

const fs = require('fs-extra');

const BroccoliPlugin = require('broccoli-caching-writer');

const prepareTemplates = require('./prepare-templates');

module.exports = class BaseComponentsBuilder extends BroccoliPlugin {
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

  writeComponent(name, template, stylesheet) {
    let folderName = path.join(this.outputPath, 'src', 'ui', 'components', name);
    fs.ensureDirSync(folderName);

    fs.writeFileSync(path.join(folderName, 'template.hbs'), template);

    fs.writeFileSync(path.join(folderName, 'stylesheet.css'), stylesheet);
  }
};
