'use strict';

const path = require('path');
const fs = require('fs-extra');

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
  return `<pre class="main-block.code"><code>${highlighted}</code></pre>`;
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
    let componentFolder = path.join(this.outputPath, 'src', 'ui', 'components', 'PageBlog');
    fs.ensureDirSync(componentFolder);

    let [latest, ...rest] = this.posts;
    let data = {
      latest: this._preparePostTemplateData(latest),
      rest: rest.map(post => this._preparePostTemplateData(post)),
    };
    let componentTemplate = this.templates['start-page'].template(data);
    fs.writeFileSync(path.join(componentFolder, 'template.hbs'), componentTemplate);

    let componentCssBlock = this.templates['start-page'].stylesheet();
    fs.writeFileSync(path.join(componentFolder, 'stylesheet.css'), componentCssBlock);
  }

  _writePostComponent(post, related) {
    let componentFolder = path.join(this.outputPath, 'src', 'ui', 'components', post.componentName);
    fs.ensureDirSync(componentFolder);

    let data = this._preparePostTemplateData(post);
    if (related) {
      data.related = this._preparePostTemplateData(related);
    }
    let componentTemplate = this.templates.post.template(data);
    fs.writeFileSync(path.join(componentFolder, 'template.hbs'), componentTemplate);

    data = {
      componentName: post.componentName,
    };
    let componentCssBlock = this.templates.post.stylesheet(data);
    fs.writeFileSync(path.join(componentFolder, 'stylesheet.css'), componentCssBlock);
  }

  _writeAuthorComponent(author) {
    let componentFolder = path.join(this.outputPath, 'src', 'ui', 'components', author.componentName);
    fs.ensureDirSync(componentFolder);

    let data = {
      ...author,
      posts: sortNewestFirst(author.posts).map(post => this._preparePostTemplateData(post)),
    };
    let componentTemplate = this.templates.author.template(data);
    fs.writeFileSync(path.join(componentFolder, 'template.hbs'), componentTemplate);

    data = {
      componentName: author.componentName,
    };
    let componentCssBlock = this.templates.author.stylesheet(data);
    fs.writeFileSync(path.join(componentFolder, 'stylesheet.css'), componentCssBlock);
  }

  _writeRecentPostsComponent(topic, posts) {
    let componentName = `RecentPosts${_.capitalize(topic)}`;
    let componentFolder = path.join(this.outputPath, 'src', 'ui', 'components', componentName);
    fs.ensureDirSync(componentFolder);

    let data = {
      topic,
      posts: posts.map(post => this._preparePostTemplateData(post)),
    };
    let componentTemplate = this.templates['recent-posts'].template(data);
    fs.writeFileSync(path.join(componentFolder, 'template.hbs'), componentTemplate);

    data = {
      componentName,
    };
    let componentCssBlock = this.templates['recent-posts'].stylesheet(data);
    fs.writeFileSync(path.join(componentFolder, 'stylesheet.css'), componentCssBlock);
  }

  _preparePostTemplateData(post) {
    return {
      title: post.meta.title,
      excerpt: htmlizeExcerpt(post.excerpt),
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
