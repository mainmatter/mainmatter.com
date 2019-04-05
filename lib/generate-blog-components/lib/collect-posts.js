/* eslint-env node */
'use strict';

const path = require('path');

const glob = require('glob');
const fs = require('fs-extra');
const frontMatter = require('front-matter');

module.exports = function(folder) {
  return glob
    .sync('**/*.md', {
      cwd: folder,
      absolute: true,
    })
    .map(file => {
      let queryPath = buildQueryPath(file);
      let componentName = buildComponentName(file);
      let [meta, content] = extractFrontmatter(file);

      return {
        queryPath,
        componentName,
        meta,
        content,
      };
    });
};

function buildQueryPath(file) {
  return path.basename(file, '.md');
}

function buildComponentName(file) {
  let cleanedFileName = path
    .basename(file, '.md')
    .replace(/-[a-zA-Z]/g, match => match.replace('-', '').toUpperCase())
    .replace(/-/g, '')
    .replace(/[^a-zA-Z0-9]/, '_');

  return `BlogPost${cleanedFileName}`;
}

function extractFrontmatter(file) {
  let content = fs.readFileSync(file).toString();
  let data = frontMatter(content);

  return [data.attributes, data.body];
}
