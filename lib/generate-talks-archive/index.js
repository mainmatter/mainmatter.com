'use strict';

const path = require('path');

const fs = require('fs-extra');
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const handlebars = require('handlebars');

const collectTalks = require('./lib/collect-talks');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  preprocessTree(type, tree) {
    if (type === 'src') {
      let conferences = collectTalks(path.join(__dirname, '..', '..', '_talks'));
      this._templates = prepareTemplates();
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
    let componentTemplate = this._templates['template'](data);
    trees.push(writeFile('/src/ui/components/PageTalks/template.hbs', componentTemplate));

    let componentCssBlock = this._templates['css-block']();
    trees.push(writeFile('/src/ui/components/PageTalks/stylesheet.css', componentCssBlock));

    return mergeTrees(trees);
  },
};

function sortLatestFirst(conferences) {
  return conferences.sort((a, b) => b.meta.date - a.meta.date);
}

function prepareTemplates() {
  let templates = {
    template: ['template.hbs'],
    'css-block': ['stylesheet.hbs'],
  };
  return Object.keys(templates).reduce((acc, key) => {
    let templatePath = templates[key];
    let source = fs.readFileSync(path.join(__dirname, 'lib', 'files', 'page', ...templatePath)).toString();
    acc[key] = handlebars.compile(source);
    return acc;
  }, {});
}
