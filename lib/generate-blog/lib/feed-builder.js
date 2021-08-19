'use strict';

const path = require('path');

const fs = require('fs-extra');
const dateformat = require('dateformat');
const marked = require('marked');
const Entities = require('html-entities');
const BroccoliPlugin = require('broccoli-caching-writer');

const collectPosts = require('./collect-posts');
const getBuildDomain = require('../../utils/get-build-domain');

const SITE_URL = getBuildDomain();

module.exports = class FeedBuilder extends BroccoliPlugin {
  constructor(contentFolder, options) {
    super([contentFolder], options);

    this.options = options;
    this.contentFolder = contentFolder;
  }

  build() {
    let { posts } = collectPosts(this.contentFolder);
    let feed = generateFeed(posts);

    fs.writeFileSync(path.join(this.outputPath, 'feed.xml'), feed);
  }
};

function generateFeed(posts) {
  let htmlize = (input) => {
    let html = marked(input, { xhtml: true, baseUrl: SITE_URL });
    return Entities.encode(Entities.decode(html), { level: 'xml' });
  };

  let feed = `
    <feed xmlns="http://www.w3.org/2005/Atom">
      <link href="${SITE_URL}/feed.xml" rel="self" type="application/atom+xml"/>
      <link href="${SITE_URL}/" rel="alternate" type="text/html"/>
      <updated>${dateformat(new Date(), 'isoUtcDateTime')}</updated>
      <id>${SITE_URL}/feed.xml</id>
      <title>simplabs</title>
      <subtitle>Solid Solutions for Ambitious Projects</subtitle>
      <author>
        <name>simplabs</name>
      </author>`;

  for (let post of posts) {
    let url = `${SITE_URL}/blog/${post.queryPath}/`;
    let content = htmlize(post.content);
    let [excerpt] = content.split('&lt;!--break--&gt;');
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
