'use strict';

const path = require('path');

const fs = require('fs-extra');
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const handlebars = require('handlebars');
const dateformat = require('dateformat');

const collectEvents = require('./lib/collect-events');
const htmlizeMarkdown = require('../markdown-content/htmlize-markdown');

module.exports = {
  name: require('./package').name,

  preprocessTree(type, tree) {
    if (type === 'src') {
      let events = collectEvents(path.join(__dirname, '..', '..', '_calendar'));
      this._templates = prepareTemplates();
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
    let componentTemplate = this._templates['template'](data);
    trees.push(writeFile('/src/ui/components/PageCalendar/template.hbs', componentTemplate));

    let componentCssBlock = this._templates['css-block']();
    trees.push(writeFile('/src/ui/components/PageCalendar/stylesheet.css', componentCssBlock));

    return mergeTrees(trees);
  },
};

function filterFutureEventsOnly(events) {
  return events.filter(event => event.meta.date > new Date());
}

function sortClosestFirst(events) {
  return events.sort((a, b) => a.meta.date - b.meta.date);
}

function splitConferencesMeetups(futureEvents) {
  let conferences = futureEvents.filter(event => event.meta.kind === 'conference');
  let meetups = futureEvents.filter(event => event.meta.kind === 'meetup');

  return [conferences, meetups];
}

function prepareTemplates() {
  let templates = {
    template: ['component-template.hbs'],
    'css-block': ['component-css-block.hbs'],
  };
  return Object.keys(templates).reduce((acc, key) => {
    let templatePath = templates[key];
    let source = fs.readFileSync(path.join(__dirname, 'lib', 'files', 'page', ...templatePath)).toString();
    acc[key] = handlebars.compile(source);
    return acc;
  }, {});
}
