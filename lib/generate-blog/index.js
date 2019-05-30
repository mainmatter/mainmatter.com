/* eslint-env node */
'use strict';

const path = require('path');

const writeFile = require('broccoli-file-creator');
const MergeTrees = require('broccoli-merge-trees');
const dateformat = require('dateformat');
const marked = require('marked');
const Entities = require('html-entities');

const collectPosts = require('./lib/collect-posts');
const ComponentsBuilder = require('./lib/components-builder');

module.exports = {
  name: 'generate-blog',

  isDevelopingAddon() {
    return true;
  },

  preprocessTree(type, tree) {
    if (type === 'src') {
      let contentFolder = path.join(__dirname, '..', '..', '_posts');
      let templatesFolder = path.join(__dirname, 'lib', 'templates');
      let blogPagesTree = new ComponentsBuilder(contentFolder, templatesFolder);

      return new MergeTrees([tree, blogPagesTree]);
    } else {
      return tree;
    }
  },

  treeFor(type) {
    if (type === 'public') {
      let { posts } = collectPosts(path.join(__dirname, '..', '..', '_posts'));
      return writeFile('feed.xml', generateFeed(posts));
    }
  },
};

function generateFeed(posts) {
  let xmlEntities = new Entities.XmlEntities();
  let htmlEntities = new Entities.AllHtmlEntities();
  let htmlize = input => {
    let html = marked(input, { xhtml: true, baseUrl: 'https://simplabs.com' });
    return xmlEntities.encode(htmlEntities.decode(html));
  };

  let input = '& &amp; &mdash;';
  xmlEntities.encode(htmlEntities.decode(input));

  let feed = `
    <feed xmlns="http://www.w3.org/2005/Atom">
      <link href="https://simplabs.com/feed.xml" rel="self" type="application/atom+xml"/>
      <link href="https://simplabs.com/" rel="alternate" type="text/html"/>
      <updated>${dateformat(new Date(), 'isoUtcDateTime')}</updated>
      <id>https://simplabs.com/feed.xml</id>
      <title>simplabs</title>
      <subtitle>Solid Solutions for Ambitious Projects</subtitle>
      <author>
        <name>simplabs</name>
      </author>`;

  for (let post of posts) {
    let url = `https://simplabs.com/blog/${post.queryPath}`;
    let excerpt = htmlize(post.excerpt);
    let content = htmlize(post.content);
    feed += `
      <entry>
        <title>${post.meta.title}</title>
        <link href="${url}" rel="alternate" type="text/html" title="${post.meta.title}"/>
        <published>${dateformat(post.meta.date, 'isoUtcDateTime')}</published>
        <id>${url}</id>
        <content type="html" xml:base="${url}">
          ${content}
        </content>
        <author>
          <name>${post.meta.author}</name>
        </author>
        <summary type="html">
          ${excerpt}
        </summary>
      </entry>
    `;
  }

  feed += '</feed>';

  return feed;
}
