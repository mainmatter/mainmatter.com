'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');

const dateformat = require('dateformat');
const _ = require('lodash');

const collectPosts = require('./collect-posts');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');
const getBuildDomain = require('../../utils/get-build-domain');

const BREAK_MARKER = '<!--break-->';

const SITE_URL = getBuildDomain();

module.exports = class ComponentsBuilder extends BaseComponentsBuilder {
  collectContent() {
    let { posts, authors } = collectPosts(this.contentFolder);
    this.posts = sortNewestFirst(posts);

    this.authors = authors;
    this.authors.forEach(() => (authors.posts = sortNewestFirst(posts)));

    this.recentPosts = _.chain(posts)
      .groupBy('meta.topic')
      .mapValues((posts) => {
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
    posts = posts.map((post) => this._preparePostTemplateData(post));

    let previousPage = page > 1 ? (page > 2 ? `/blog/page/${page - 1}` : '/blog') : null;
    let nextPage = page < totalPages ? `/blog/page/${page + 1}` : null;

    data = {
      ...data,
      posts,
      previousPage,
      nextPage,
      siteUrl: SITE_URL,
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
    data.siteUrl = SITE_URL;
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
      posts: sortNewestFirst(author.posts).map((post) => this._preparePostTemplateData(post)),
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
      posts: posts.map((post) => this._preparePostTemplateData(post)),
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
    let ogImage = post.meta.og ? post.meta.og.image : null;
    assert(
      !ogImage || ogImage.endsWith('/og-image.png'),
      `Post "${post.meta.title}" does has an og:image named "${ogImage}"; the og:image must be named "og-image.png".`,
    );
    assert(
      !ogImage || fs.existsSync(path.join(__dirname, '../../../public', ogImage)),
      `Post "${post.meta.title}" uses an og:image that does not exist: "${ogImage}".`,
    );

    return {
      title: post.meta.title,
      description: post.meta.description,
      excerpt: htmlizeExcerpt(post.content),
      body: htmlizeBody(post.content),
      date: dateformat(post.meta.date, 'mmmm d, yyyy'),
      year: dateformat(post.meta.date, 'yyyy'),
      isoDate: dateformat(post.meta.date, 'isoUtcDateTime'),
      path: `/blog/${post.queryPath}/`,
      topic: post.meta.topic,
      teaserImage: post.meta['teaser-image'],
      teaserBackground: post.meta['teaser-background'],
      author: {
        name: post.meta.author,
        twitter: post.meta.twitter,
        bio: post.meta.bio,
      },
      og: post.meta.og || {},
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
  return _.chain(posts).sortBy('meta.date').reverse().value();
}

function wrapNode(dom, node, blockName, className, element = 'div') {
  let wrapper = dom.createElement(element);
  let parent = node.parentElement;

  wrapper.setAttribute(`${blockName}:class`, className);

  parent.insertBefore(wrapper, node);
  parent.removeChild(node);

  wrapper.appendChild(node);
}

function replaceWithFigure(dom, element, content) {
  let figure = dom.createElement('figure');
  let img = content;
  let figureClass = 'figure';

  if (img.tagName !== 'IMG') {
    img = content.querySelector('img');
  }

  let imageData = parseImageDirectives(img.src);
  if (imageData.sizes) {
    img.removeAttribute('src');
    img.srcset = `${imageData.sizes.small.src} ${imageData.sizes.small.size}w, ${imageData.sizes.large.src} ${imageData.sizes.large.size}w`;
    img.sizes = `(max-width: 887px) ${imageData.sizes.small.size}px, ${imageData.sizes.large.size}px`;
  } else {
    img.src = imageData.src;
  }

  if (imageData.kind === 'full') {
    img.setAttribute('figure:class', 'content-full');

    figureClass = 'figure-plain';
  } else if (imageData.kind === 'plain') {
    img.setAttribute('figure:class', 'content-centered');

    figureClass = 'figure-plain';
  } else {
    img.setAttribute('figure:class', 'content-centered');
  }

  figure.setAttribute('blog-post:class', figureClass);
  figure.appendChild(content);

  element.parentElement.insertBefore(figure, element);
  element.parentElement.removeChild(element);
}

function htmlizeBody(content) {
  let html = htmlizeMarkdown(content, (dom) => {
    dom.querySelectorAll('p > img').forEach((img) => {
      let paragraph = img.parentElement;

      if (paragraph.children.length === 1) {
        replaceWithFigure(dom, paragraph, img);
      } else {
        img.setAttribute('blog-post:class', 'image');
      }
    });

    dom.querySelectorAll('p > a > img:only-child').forEach((img) => {
      replaceWithFigure(dom, img.parentElement.parentElement, img.parentElement);
    });

    dom.querySelectorAll('iframe').forEach((iframe) => {
      iframe.setAttribute('blog-post:class', 'embedd-iframe');
      wrapNode(dom, iframe, 'blog-post', 'embedd');
    });
  });

  let [, body] = splitPostContent(html);

  return body;
}

function htmlizeExcerpt(content) {
  let html = htmlizeMarkdown(content);
  let [excerpt] = splitPostContent(html);
  return excerpt;
}

function splitPostContent(content) {
  return content.split(BREAK_MARKER);
}

function parseImageDirectives(src) {
  let match = src.match(/#(full|plain)?(@(\d+)-(\d+))?$/);
  let bareSrc = src.replace(/#[^#]*$/, '');
  let directives = {
    src: bareSrc,
  };

  if (!match) {
    return directives;
  }

  let [, kind, , smallSize, largeSize] = match;

  if (kind) {
    directives.kind = kind;
  }

  if (smallSize && largeSize) {
    let buildSrcForSize = (size) => bareSrc.replace(/(\.(\w){3,4})/, `@${size}$1`);
    let smallImage = buildSrcForSize(smallSize);
    let largeImage = buildSrcForSize(largeSize);
    directives.sizes = {
      small: {
        size: smallSize,
        src: smallImage,
      },
      large: {
        size: largeSize,
        src: largeImage,
      },
    };
  }

  return directives;
}
