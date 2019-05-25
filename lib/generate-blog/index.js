/* eslint-env node */
'use strict';

const path = require('path');

const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const highlightjs = require('highlight.js');
const dateformat = require('dateformat');
const marked = require('marked');
const _ = require('lodash');
const Entities = require('html-entities');

const collectPosts = require('./lib/collect-posts');
const htmlizeMarkdown = require('../markdown-content/htmlize-markdown');
const prepareTemplates = require('../component-generation/prepare-templates');

const Renderer = new marked.Renderer();

Renderer.code = function(code, language) {
  let highlighted = code;
  if (language) {
    highlighted = highlightjs.highlight(language, code).value;
  }
  highlighted = encodeCurlies(highlighted);
  return `<pre class="main-block.code"><code>${highlighted}</code></pre>`;
};

module.exports = {
  name: 'generate-blog',

  isDevelopingAddon() {
    return true;
  },

  preprocessTree(type, tree) {
    let { posts, authors } = collectPosts(path.join(__dirname, '..', '..', '_posts'));
    this.posts = sortNewestFirst(posts);
    this.authors = authors;

    if (type === 'src') {
      this._templates = prepareTemplates(path.join(__dirname, 'lib', 'files'));

      let blogStartPageTree = this._writeStartPageComponentTree();

      let blogPostTrees = this.posts.map(post => {
        let related = findRelatedPost(post, this.posts);
        return this._writePostComponentTree(post, related);
      });

      let blogAuthorTrees = this.authors.map(author => {
        return this._writeAuthorComponentTree(author);
      });

      let recentPostsByTopic = collectRecentPosts(this.posts);
      let recentPostsTrees = _.reduce(
        recentPostsByTopic,
        (acc, posts, topic) => {
          acc.push(this._writeRecentPostsComponentTree(topic));
          return acc;
        },
        [],
      );

      return mergeTrees([tree, blogStartPageTree, ...blogPostTrees, ...blogAuthorTrees, ...recentPostsTrees]);
    } else {
      return tree;
    }
  },

  treeFor(type) {
    if (type === 'public') {
      return writeFile('feed.xml', generateFeed(this.posts));
    }
  },

  _writePostComponentTree(post, related) {
    let trees = [];
    let excerpt = htmlizeExcerpt(post.excerpt);
    let body = htmlizeBody(post.content);

    let data = {
      date: dateformat(post.meta.date, 'mmmm d, yyyy'),
      title: post.meta.title,
      excerpt,
      body,
      author: {
        name: post.meta.author,
        bio: post.meta.bio,
        twitter: post.meta.twitter,
      },
    };
    if (related) {
      data.related = {
        title: related.meta.title,
        link: `/blog/${related.queryPath}`,
      };
      if (related.meta['teaser-image']) {
        data.related.teaserImage = related.meta['teaser-image'];
      }
      if (related.meta['teaser-background']) {
        data.related.teaserBackground = related.meta['teaser-background'];
      }
    }
    let componentTemplate = this._templates.post.template(data);
    trees.push(writeFile(`/src/ui/components/${post.componentName}/template.hbs`, componentTemplate));

    data = {
      componentName: post.componentName,
    };
    let componentCssBlock = this._templates.post.stylesheet(data);
    trees.push(writeFile(`/src/ui/components/${post.componentName}/stylesheet.css`, componentCssBlock));

    return mergeTrees(trees);
  },

  _writeAuthorComponentTree(author) {
    let trees = [];

    let data = {
      ...author,
      posts: sortNewestFirst(author.posts).map(post => {
        return {
          title: post.meta.title,
          excerpt: htmlizeExcerpt(post.excerpt),
          path: `/blog/${post.queryPath}`,
          topic: post.meta.topic,
          date: dateformat(post.meta.date, 'mmmm d, yyyy'),
          author: {
            name: post.meta.author,
            twitter: post.meta.twitter,
          },
        };
      }),
    };
    let componentTemplate = this._templates.author.template(data);
    trees.push(writeFile(`/src/ui/components/${author.componentName}/template.hbs`, componentTemplate));

    data = {
      componentName: author.componentName,
    };
    let componentCssBlock = this._templates.author.stylesheet(data);
    trees.push(writeFile(`/src/ui/components/${author.componentName}/stylesheet.css`, componentCssBlock));

    return mergeTrees(trees);
  },

  _writeRecentPostsComponentTree(topic) {
    let trees = [];
    let componentName = `RecentPosts${_.capitalize(topic)}`;
    let data = {
      topic,
      posts: this.posts.map(post => {
        return {
          date: dateformat(post.meta.date, 'mmmm d, yyyy'),
          title: post.meta.title,
          path: `/blog/${post.queryPath}`,
          teaserImage: post.meta['teaser-image'],
          author: {
            name: post.meta.author,
            twitter: post.meta.twitter,
          },
        };
      }),
    };
    let componentTemplate = this._templates['recent-posts'].template(data);
    trees.push(writeFile(`/src/ui/components/${componentName}/template.hbs`, componentTemplate));

    data = {
      componentName,
    };
    let componentCssBlock = this._templates['recent-posts'].stylesheet(data);
    trees.push(writeFile(`/src/ui/components/${componentName}/stylesheet.css`, componentCssBlock));

    return mergeTrees(trees);
  },

  _writeStartPageComponentTree() {
    let trees = [];

    let [latest, ...rest] = this.posts;
    let data = {
      latest: {
        title: latest.meta.title,
        excerpt: htmlizeExcerpt(latest.excerpt),
        date: dateformat(latest.meta.date, 'mmmm d, yyyy'),
        path: `/blog/${latest.queryPath}`,
        topic: latest.meta.topic,
        author: {
          name: latest.meta.author,
          twitter: latest.meta.twitter,
        },
      },
      rest: rest.map(post => {
        return {
          title: post.meta.title,
          excerpt: htmlizeExcerpt(post.excerpt),
          path: `/blog/${post.queryPath}`,
          topic: post.meta.topic,
          date: dateformat(post.meta.date, 'mmmm d, yyyy'),
          author: {
            name: post.meta.author,
            twitter: post.meta.twitter,
          },
        };
      }),
    };
    let componentTemplate = this._templates['start-page'].template(data);
    trees.push(writeFile('/src/ui/components/PageBlog/template.hbs', componentTemplate));

    let componentCssBlock = this._templates['start-page'].stylesheet();
    trees.push(writeFile('/src/ui/components/PageBlog/stylesheet.css', componentCssBlock));

    return mergeTrees(trees);
  },
};

function encodeCurlies(content) {
  return content.replace(/\{\{/gm, '&#123;&#123;').replace(/\}\}/gm, '&#125;&#125;');
}

function htmlizeBody(body) {
  let html = htmlizeMarkdown(body, { renderer: Renderer }, dom => {
    dom.querySelectorAll('p > img').forEach(img => {
      let paragraph = img.parentElement;
      img.classList.add('main-block.image-centered');
      let div = dom.createElement('div');
      div.classList.add('main-block.body-image');
      div.appendChild(img);
      paragraph.parentElement.insertBefore(div, paragraph);
      paragraph.parentElement.removeChild(paragraph);
    });
  });
  return encodeCurlies(html);
}

function htmlizeExcerpt(excerpt) {
  let html = htmlizeMarkdown(excerpt, { renderer: Renderer }, dom => {
    dom.querySelectorAll('p').forEach(p => {
      p.classList.remove('typography.body-text');
      p.classList.add('typography.lead');
    });
  });
  return encodeCurlies(html);
}

function sortNewestFirst(posts) {
  return _.chain(posts)
    .sortBy('meta.date')
    .reverse()
    .value();
}

function findRelatedPost(post, posts) {
  return _.chain(posts)
    .filter(['meta.topic', post.meta.topic])
    .reject(['queryPath', post.queryPath])
    .sortBy('meta.date')
    .reverse()
    .first()
    .value();
}

function collectRecentPosts(posts) {
  return _.chain(posts)
    .groupBy('meta.topic')
    .mapValues(posts => {
      return _.chain(posts)
        .sortBy('meta.date')
        .reverse()
        .take(3)
        .value();
    })
    .value();
}

function generateFeed(posts) {
  let xmlEntities = new Entities.XmlEntities();
  let htmlEntities = new Entities.AllHtmlEntities();
  let encode = input => xmlEntities.encode(htmlEntities.decode(input));

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
    let url = `https://simplabs.com${post.queryPath}`;
    let excerpt = encode(marked(post.excerpt, { xhtml: true }));
    let content = encode(marked(post.content, { xhtml: true }));
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
