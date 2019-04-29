/* eslint-env node */
'use strict';

const path = require('path');

const fs = require('fs-extra');
const frontMatter = require('front-matter');

module.exports = function separateMeta(file) {
  let content = fs.readFileSync(file).toString();
  let data = frontMatter(content);
  let date = new Date(path.basename(file).substring(0, 10));
  let [excerpt, body] = data.body.split('<!--break-->');

  let meta = {
    ...data.attributes,
    date,
  };

  return [meta, excerpt, body];
};
