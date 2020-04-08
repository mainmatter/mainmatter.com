'use strict';

const dateformat = require('dateformat');
const _ = require('lodash');

const collectEvents = require('./collect-events');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');

module.exports = class ComponentsBuilder extends BaseComponentsBuilder {
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
          date: dateformat(event.meta.date, 'mmmm d, yyyy'),
        },
        content: htmlizeMarkdown(event.content),
      };
    });
    let [futureConferences, futureMeetups] = splitConferencesMeetups(futureEvents);

    return {
      conferences: futureConferences,
      meetups: futureMeetups,
    };
  }
};

function splitConferencesMeetups(futureEvents) {
  let conferences = _.filter(futureEvents, ['meta.kind', 'conference']);
  let meetups = _.filter(futureEvents, ['meta.kind', 'meetup']);

  return [conferences, meetups];
}
