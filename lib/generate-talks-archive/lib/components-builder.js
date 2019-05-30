'use strict';

const path = require('path');
const fs = require('fs-extra');

const _ = require('lodash');

const collectTalks = require('./collect-talks');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');

module.exports = class ComponentsBuilder extends BaseComponentsBuilder {
  collectContent() {
    let conferences = collectTalks(this.contentFolder);
    this.conferences = _.chain(conferences)
      .sortBy('meta.date')
      .reverse()
      .value();
  }

  writeComponentFiles() {
    let componentFolder = path.join(this.outputPath, 'src', 'ui', 'components', 'PageTalks');
    fs.ensureDirSync(componentFolder);

    let data = { conferences: this.conferences };
    let componentTemplate = this.templates.page.template(data);
    fs.writeFileSync(path.join(componentFolder, 'template.hbs'), componentTemplate);

    let componentCssBlock = this.templates.page.stylesheet();
    fs.writeFileSync(path.join(componentFolder, 'stylesheet.css'), componentCssBlock);
  }
};
