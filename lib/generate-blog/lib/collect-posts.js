/* eslint-env node */
'use strict';

const path = require('path');

const glob = require('glob');
const _ = require('lodash');

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
      let [meta, content] = separateMeta(file);
      meta.date = new Date(path.basename(file).substring(0, 10));

      return {
        queryPath,
        componentName,
        meta,
        content,
      };
    });
  posts = _.chain(posts)
    .sortBy('meta.date')
    .reverse()
    .value();

  let authors = _.chain(posts)
    .uniqBy('meta.twitter')
    .map(post => {
      let componentName = buildAuthorComponentName(post);
      return {
        componentName,
        name: post.meta.author,
        twitter: post.meta.twitter,
        bio: post.meta.bio,
        posts: findPostsByAuthor(posts, post.meta.twitter),
      };
    })
    .value();

  return { posts, authors };
};

function buildQueryPath(file) {
  return path.basename(file, '.md').replace(/(\d+)-(\d+)-(\d+)-(.+)/, '$1/$2/$3/$4');
}

function buildPostComponentName(file) {
  let cleanedFileName = path
    .basename(file, '.md')
    .replace(/-[a-zA-Z]/g, match => match.replace('-', '').toUpperCase())
    .replace(/-/g, '')
    .replace(/[^a-zA-Z0-9]/, '_');

  return `PageBlogPost${cleanedFileName}`;
}

function buildAuthorComponentName(post) {
  let capitalizedAuthorName = post.meta.twitter
    .replace(/[^a-zA-Z0-9]/, '_')
    .replace(/^(.)/, match => match.toUpperCase());

  return `PageBlogAuthor${capitalizedAuthorName}`;
}

function findPostsByAuthor(posts, authorTwitter) {
  return posts.filter(post => post.meta.twitter === authorTwitter);
}
