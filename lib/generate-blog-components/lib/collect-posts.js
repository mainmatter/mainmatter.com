/* eslint-env node */
'use strict';

const path = require('path');

const glob = require('glob');

const separateMeta = require('../../markdown-content/separate-meta');

module.exports = function(folder) {
  let posts = glob
    .sync('**/*.md', {
      cwd: folder,
      absolute: true,
    })
    .map(file => {
      let queryPath = buildQueryPath(file);
      let componentName = buildPostComponentName(file);
      let [meta, excerpt, content] = separateMeta(file);

      return {
        queryPath,
        componentName,
        meta,
        excerpt,
        content,
      };
    });

  let authors = posts.map((post) => {
    let componentName = buildAuthorComponentName(post);
    return {
      componentName,
      name: post.meta.author,
      twitter: post.meta.twitter,
      bio: post.meta.bio,
    };
  });
  authors = [...new Set(authors)];

  return { posts, authors };
};

function buildQueryPath(file) {
  return path.basename(file, '.md');
}

function buildPostComponentName(file) {
  let cleanedFileName = path
    .basename(file, '.md')
    .replace(/-[a-zA-Z]/g, match => match.replace('-', '').toUpperCase())
    .replace(/-/g, '')
    .replace(/[^a-zA-Z0-9]/, '_');

  return `BlogPost${cleanedFileName}`;
}

function buildAuthorComponentName(post) {
  let capitalizedAuthorName = post.meta.twitter
    .replace(/[^a-zA-Z0-9]/, '_')
    .replace(/^(.)/, match => match.toUpperCase());

  return `BlogAuthor${capitalizedAuthorName}`;
}
