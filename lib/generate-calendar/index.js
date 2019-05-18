'use strict';

const path = require('path');

const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const dateformat = require('dateformat');
const _ = require('lodash');

const collectEvents = require('./lib/collect-events');
const htmlizeMarkdown = require('../markdown-content/htmlize-markdown');
const prepareTemplates = require('../component-generation/prepare-templates');

module.exports = {
  name: require('./package').name,

  preprocessTree(type, tree) {
    if (type === 'src') {
      let events = collectEvents(path.join(__dirname, '..', '..', '_calendar'));
      this._templates = prepareTemplates(path.join(__dirname, 'lib', 'files'));
      let calendarPageTree = this._writePageComponentTree(events);

      return mergeTrees([tree, calendarPageTree]);
    } else {
      return tree;
    }
  },

  isDevelopingAddon() {
    return true;
  },

  _writePageComponentTree(events) {
    let trees = [];

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
    let componentTemplate = this._templates.page.template(data);
    trees.push(writeFile('/src/ui/components/PageCalendar/template.hbs', componentTemplate));

    let componentCssBlock = this._templates.page.stylesheet();
    trees.push(writeFile('/src/ui/components/PageCalendar/stylesheet.css', componentCssBlock));

    return mergeTrees(trees);
  },
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
