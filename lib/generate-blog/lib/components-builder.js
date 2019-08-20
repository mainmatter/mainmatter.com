'use strict';

const assert = require('assert');

const dateformat = require('dateformat');
const marked = require('marked');
const _ = require('lodash');
const highlightjs = require('highlight.js');

const collectPosts = require('./collect-posts');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');

const Renderer = new marked.Renderer();

const BREAK_MARKER = '<!--break-->';

Renderer.code = function(code, language) {
  let highlighted = code;
  if (language) {
    highlighted = highlightjs.highlight(language, code).value;
  }
  highlighted = encodeCurlies(highlighted);
  return `<pre class="source"><code>${highlighted}</code></pre>`;
};

module.exports = class ComponentsBuilder extends BaseComponentsBuilder {
  collectContent() {
    let { posts, authors } = collectPosts(this.contentFolder);
    this.posts = sortNewestFirst(posts);

    this.authors = authors;
    this.authors.forEach(() => (authors.posts = sortNewestFirst(posts)));

    this.recentPosts = _.chain(posts)
      .groupBy('meta.topic')
      .mapValues(posts => {
        return _.take(sortNewestFirst(posts), 3);
      })
      .value();
  }

  writeComponentFiles() {
    let chunks = _.chunk(this.posts, 10);
    chunks.forEach((chunk, i) => this._writeListPageComponent(chunk, i + 1, chunks.length));

    for (let post of this.posts) {
      let related = this._findRelatedPost(post);
      this._writePostComponent(post, related);
    }

    for (let author of this.authors) {
      this._writeAuthorComponent(author);
    }

    for (let topic of Object.keys(this.recentPosts)) {
      let posts = this.recentPosts[topic];
      this._writeRecentPostsComponent(topic, posts);
    }
  }

  _writeListPageComponent(chunk, page, totalPages) {
    let componentName = `PageBlogPage${page}`;

    let data = {};
    let posts = chunk;
    if (page === 1) {
      let [latest, ...rest] = chunk;
      posts = rest;
      data.latest = this._preparePostTemplateData(latest);
    }
    posts = posts.map(post => this._preparePostTemplateData(post));

    let previousPage = page > 1 ? (page > 2 ? `/blog/page/${page - 1}` : '/blog') : null;
    let nextPage = page < totalPages ? `/blog/page/${page + 1}` : null;

    data = {
      ...data,
      posts,
      previousPage,
      nextPage,
    };
    let componentTemplate = this.templates['list-page'].template(data);

    data = {
      componentName,
    };
    let componentCssBlock = this.templates['list-page'].stylesheet(data);

    this.writeComponent(componentName, componentTemplate, componentCssBlock);
  }

  _writePostComponent(post, related) {
    let data = this._preparePostTemplateData(post);
    data.componentName = post.componentName;
    if (related) {
      data.related = this._preparePostTemplateData(related);
    }
    let componentTemplate = this.templates.post.template(data);

    let componentCssBlock = this.templates.post.stylesheet(data);

    this.writeComponent(post.componentName, componentTemplate, componentCssBlock);
  }

  _writeAuthorComponent(author) {
    let data = {
      ...author,
      posts: sortNewestFirst(author.posts).map(post => this._preparePostTemplateData(post)),
    };
    let componentTemplate = this.templates.author.template(data);

    data = {
      componentName: author.componentName,
    };
    let componentCssBlock = this.templates.author.stylesheet(data);

    this.writeComponent(author.componentName, componentTemplate, componentCssBlock);
  }

  _writeRecentPostsComponent(topic, posts) {
    let componentName = `RecentPosts${_.capitalize(topic)}`;

    let data = {
      topic,
      posts: posts.map(post => this._preparePostTemplateData(post)),
    };
    let componentTemplate = this.templates['recent-posts'].template(data);

    data = {
      componentName,
    };
    let componentCssBlock = this.templates['recent-posts'].stylesheet(data);

    this.writeComponent(componentName, componentTemplate, componentCssBlock);
  }

  _preparePostTemplateData(post) {
    assert(
      post.content.includes(BREAK_MARKER),
      `Post "${post.meta.title}" does not contain break marker! Add "${BREAK_MARKER}" after the teaser.`,
    );

    return {
      title: post.meta.title,
      description: post.meta.description,
      excerpt: htmlizeExcerpt(post.content),
      body: htmlizeBody(post.content),
      date: dateformat(post.meta.date, 'mmmm d, yyyy'),
      year: dateformat(post.meta.date, 'yyyy'),
      isoDate: dateformat(post.meta.date, 'isoUtcDateTime'),
      path: `/blog/${post.queryPath}`,
      topic: post.meta.topic,
      teaserImage: post.meta['teaser-image'],
      teaserBackground: post.meta['teaser-background'],
      author: {
        name: post.meta.author,
        twitter: post.meta.twitter,
        bio: post.meta.bio,
      },
    };
  }

  _findRelatedPost(post) {
    return _.chain(this.posts)
      .filter(['meta.topic', post.meta.topic])
      .reject(['queryPath', post.queryPath])
      .sortBy('meta.date')
      .reverse()
      .first()
      .value();
  }
};

function sortNewestFirst(posts) {
  return _.chain(posts)
    .sortBy('meta.date')
    .reverse()
    .value();
}

function encodeCurlies(content) {
  return content.replace(/\{\{/gm, '&#123;&#123;').replace(/\}\}/gm, '&#125;&#125;');
}

function wrapNode(dom, node, className, element = 'div') {
  let wrapper = dom.createElement(element);
  let parent = node.parentElement;

  wrapper.classList.add(className);

  parent.insertBefore(wrapper, node);
  parent.removeChild(node);

  wrapper.appendChild(node);
}

function replaceWithFigure(dom, element, content) {
  let figure = dom.createElement('figure');

  figure.classList.add('blog-post.figure');
  figure.appendChild(content);

  element.parentElement.insertBefore(figure, element);
  element.parentElement.removeChild(element);
}

function htmlizeBody(content) {
  let html = htmlizeMarkdown(content, { renderer: Renderer }, dom => {
    dom.querySelectorAll('p > img').forEach(img => {
      let paragraph = img.parentElement;

      if (paragraph.children.length === 1) {
        img.classList.add('figure.content-centered');

        replaceWithFigure(dom, paragraph, img);
      } else {
        img.classList.add('blog-post.image');
      }
    });

    dom.querySelectorAll('p > a > img').forEach(img => {
      let paragraph = img.parentElement.parentElement;

      img.classList.add('figure.content-centered');

      replaceWithFigure(dom, paragraph, img.parentElement);
    });

    dom.querySelectorAll('table').forEach(table => {
      wrapNode(dom, table, 'typography.table');
    });

    dom.querySelectorAll('iframe').forEach(iframe => {
      iframe.classList.add('blog-post.embedd-iframe');
      wrapNode(dom, iframe, 'blog-post.embedd');
    });
  });

  let [, body] = splitPostContent(html);

  return encodeCurlies(body);
}

function htmlizeExcerpt(content) {
  let html = htmlizeMarkdown(content, { renderer: Renderer });
  let [excerpt] = splitPostContent(html);
  return encodeCurlies(excerpt);
}

function splitPostContent(content) {
  return content.split(BREAK_MARKER);
}
