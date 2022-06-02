'use strict';
const _ = require('lodash');

const collectEvents = require('./collect-events');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');

module.exports = class ComponentsBuilder extends BaseComponentsBuilder {
  constructor(contentFolder, templatesFolder, options) {
    super([contentFolder, templatesFolder], options);

    this.options = options;
    this.contentFolder = contentFolder;
    this.templatesFolder = templatesFolder;
  }

  collectContent() {
    let events = collectEvents(this.contentFolder);
    this.events = _.chain(events)
      .filter((event) => event.meta.date > new Date())
      .sortBy('meta.date')
      .value();
  }

  writeComponentFiles() {
    let data = this.prepareTemplateData();
    let componentTemplate = this.templates.page.template(data);

    let componentCssBlock = this.templates.page.stylesheet();

    this.writeComponent('PageCalendar', componentTemplate, componentCssBlock);
  }

  prepareTemplateData() {
    let futureEvents = this.events.map((event) => {
      return {
        meta: {
          ...event.meta,
          date: new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(event.meta.date),
        },
        content: htmlizeMarkdown(event.content),
      };
    });
    let [futureConferences, futureMeetups, futureWorkshops] = splitConferencesMeetups(futureEvents);

    return {
      conferences: futureConferences,
      meetups: futureMeetups,
      workshops: futureWorkshops,
    };
  }
};

function splitConferencesMeetups(futureEvents) {
  let conferences = _.filter(futureEvents, ['meta.kind', 'conference']);
  let meetups = _.filter(futureEvents, ['meta.kind', 'meetup']);
  let workshops = _.filter(futureEvents, ['meta.kind', 'workshop']);

  return [conferences, meetups, workshops];
}
