/* eslint-env node */
'use strict';

const path = require('path');

const fs = require('fs-extra');
const glob = require('glob');
const handlebars = require('handlebars');

module.exports = function prepareTemplates(folder) {
  return glob
    .sync('*/', {
      cwd: path.join(folder),
      absolute: true,
    })
    .reduce((acc, folder) => {
      let component = path.basename(folder);
      acc[component] = ['template', 'stylesheet'].reduce((acc, template) => {
        let source = fs.readFileSync(path.join(folder, `${template}.hbs`)).toString();
        acc[template] = handlebars.compile(source);
        return acc;
      }, {});
      return acc;
    }, {});
};
