/* eslint-env node */
'use strict';

const fs = require('fs-extra');
const frontMatter = require('front-matter');

module.exports = function separateMeta(file) {
  let content = fs.readFileSync(file).toString();
  let data = frontMatter(content);
  let [excerpt, body] = data.body.split('<!--break-->');

  let meta = data.attributes;

  return [meta, excerpt, body];
};
