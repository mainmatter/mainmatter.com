'use strict';

const _ = require('lodash');

const collectAppearances = require('./collect-appearances');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');

module.exports = class ComponentsBuilder extends BaseComponentsBuilder {
  constructor(contentFolder, templatesFolder, options) {
    super([contentFolder, templatesFolder], options);

    this.options = options;
    this.contentFolder = contentFolder;
    this.templatesFolder = templatesFolder;
  }

  collectContent() {
    let channels = collectAppearances(this.contentFolder);
    this.channels = _.chain(channels).sortBy('meta.date').reverse().value();
  }

  writeComponentFiles() {
    let data = { channels: this.channels.map((channel) => this._preparechannelTemplateData(channel)) };
    let componentTemplate = this.templates.page.template(data);

    let componentCssBlock = this.templates.page.stylesheet();

    this.writeComponent('PageTalks', componentTemplate, componentCssBlock);
  }

  _preparechannelTemplateData(channel) {
    return {
      ...channel,
      appearances: channel.appearances.map((talk) => {
        return {
          ...talk,
          isVideo: talk.meta.media === 'video',
          isPodcast: talk.meta.media === 'podcast',
        };
      }),
    };
  }
};
