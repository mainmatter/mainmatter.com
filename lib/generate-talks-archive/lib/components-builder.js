'use strict';

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
    let data = { conferences: this.conferences };
    let componentTemplate = this.templates.page.template(data);

    let componentCssBlock = this.templates.page.stylesheet();

    this.writeComponent('PageTalks', componentTemplate, componentCssBlock);
  }
};
