'use strict';

const dateformat = require('dateformat');
const marked = require('marked');
const _ = require('lodash');
const highlightjs = require('highlight.js');

const collectPosts = require('./collect-posts');
const htmlizeMarkdown = require('../../markdown-content/htmlize-markdown');
const BaseComponentsBuilder = require('../../component-generation/base-components-builder');

const Renderer = new marked.Renderer();

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
    this._writeStartPageComponent();

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

  _writeStartPageComponent() {
    let [latest, ...rest] = this.posts;
    let data = {
      latest: this._preparePostTemplateData(latest),
      rest: rest.map(post => this._preparePostTemplateData(post)),
    };
    let componentTemplate = this.templates['start-page'].template(data);

    let componentCssBlock = this.templates['start-page'].stylesheet();

    this.writeComponent('PageBlog', componentTemplate, componentCssBlock);
  }

  _writePostComponent(post, related) {
    let data = this._preparePostTemplateData(post);
    if (related) {
      data.related = this._preparePostTemplateData(related);
    }
    let componentTemplate = this.templates.post.template(data);

    data = {
      componentName: post.componentName,
    };
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
    return {
      title: post.meta.title,
      excerpt: htmlizeExcerpt(post.content),
      body: htmlizeBody(post.content),
      date: dateformat(post.meta.date, 'mmmm d, yyyy'),
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

function htmlizeBody(content) {
  let html = htmlizeMarkdown(content, { renderer: Renderer }, dom => {
    dom.querySelectorAll('p > img').forEach(img => {
      let paragraph = img.parentElement;
      img.classList.add('figure.content-centered');
      let div = dom.createElement('figure');
      div.classList.add('figure');
      div.appendChild(img);
      paragraph.parentElement.insertBefore(div, paragraph);
      paragraph.parentElement.removeChild(paragraph);
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
  return content.split('<!--break-->');
}
