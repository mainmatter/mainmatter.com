'use strict';

const path = require('path');

const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const _ = require('lodash');

const collectTalks = require('./lib/collect-talks');
const prepareTemplates = require('../component-generation/prepare-templates');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  preprocessTree(type, tree) {
    if (type === 'src') {
      let conferences = collectTalks(path.join(__dirname, '..', '..', '_talks'));
      this._templates = prepareTemplates(path.join(__dirname, 'lib', 'files'));
      let calendarPageTree = this._writePageComponentTree(conferences);

      return mergeTrees([tree, calendarPageTree]);
    } else {
      return tree;
    }
  },

  _writePageComponentTree(conferences) {
    let trees = [];

    let sortedConferences = sortLatestFirst(conferences);
    let data = { conferences: sortedConferences };
    let componentTemplate = this._templates.page.template(data);
    trees.push(writeFile('/src/ui/components/PageTalks/template.hbs', componentTemplate));

    let componentCssBlock = this._templates.page.stylesheet();
    trees.push(writeFile('/src/ui/components/PageTalks/stylesheet.css', componentCssBlock));

    return mergeTrees(trees);
  },
};

function sortLatestFirst(conferences) {
  return _.chain(conferences)
    .sortBy('meta.date')
    .reverse()
    .value();
}
