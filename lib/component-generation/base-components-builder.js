'use strict';

const path = require('path');

const fs = require('fs-extra');
const glob = require('glob');
const handlebars = require('handlebars');
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
    this._prepareTemplates();

    this.collectContent();
    this.writeComponentFiles();
  }

  collectContent() {
    throw new Error('collectContent must be implemented in subclasses of BaseComponentsBuilder!')
  }

  writeComponentFiles() {
    throw new Error('writeComponentFiles must be implemented in subclasses of BaseComponentsBuilder!')
  }

  _prepareTemplates() {
    this.templates = glob
      .sync('*/', {
        cwd: this.templatesFolder,
        absolute: true,
      })
      .reduce((acc, folder) => {
        let component = path.basename(folder);
        acc[component] = ['template', 'stylesheet'].reduce((acc, template) => {
          let source = fs.readFileSync(path.join(folder, `${template}.hbs`)).toString();
          acc[template] = handlebars.compile(source);
          return acc;
        }, {});
        return acc;
      }, {});
  }

};
