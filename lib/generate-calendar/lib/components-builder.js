'use strict';

const path = require('path');
const fs = require('fs-extra');

const BroccoliPlugin = require('broccoli-plugin');
const dateformat = require('dateformat');
const _ = require('lodash');

const collectEvents = require('./collect-events');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const prepareTemplates = require('../../component-generation/prepare-templates');

module.exports = class ComponentsBuilder extends BroccoliPlugin {
  constructor(contentFolder, templatesFolder, options) {
    super([contentFolder, templatesFolder], options);

    this.options = options;
  }

  build() {
    let [contentFolder, templatesFolder] = this.inputPaths;
    let events = collectEvents(contentFolder);
    let templates = prepareTemplates(templatesFolder);
    this._generatePageComponent(events, templates);
  }

  _generatePageComponent(events, templates) {
    let componentFolder = path.join(this.outputPath, 'src', 'ui', 'components', 'PageCalendar');
    fs.mkdirSync(componentFolder, { recursive: true });

    let futureEvents = sortClosestFirst(filterFutureEventsOnly(events)).map(event => {
      return {
        meta: {
          ...event.meta,
          date: dateformat(event.meta.date, 'mmmm d, yyyy'),
        },
        content: htmlizeMarkdown(event.content),
      };
    });
    let [futureConferences, futureMeetups] = splitConferencesMeetups(futureEvents);
    let data = {
      conferences: futureConferences,
      meetups: futureMeetups,
    };
    let componentTemplate = templates.page.template(data);
    fs.writeFileSync(path.join(componentFolder, 'template.hbs'), componentTemplate);

    let componentCssBlock = templates.page.stylesheet();
    fs.writeFileSync(path.join(componentFolder, 'stylesheet.css'), componentCssBlock);
  }
};

function filterFutureEventsOnly(events) {
  return events.filter(event => event.meta.date > new Date());
}

function sortClosestFirst(events) {
  return _.sortBy(events, 'meta.date');
}

function splitConferencesMeetups(futureEvents) {
  let conferences = _.filter(futureEvents, ['meta.kind', 'conference']);
  let meetups = _.filter(futureEvents, ['meta.kind', 'meetup']);

  return [conferences, meetups];
}
