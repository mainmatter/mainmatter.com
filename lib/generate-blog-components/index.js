/* eslint-env node */
'use strict';

const path = require('path');

const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const highlightjs = require('highlight.js');
const dateformat = require('dateformat');
const marked = require('marked');

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
  name: 'generate-blog-components',

  preprocessTree(type, tree) {
    if (type === 'src') {
      let { posts, authors } = collectPosts(path.join(__dirname, '..', '..', '_posts'));
      this._templates = prepareTemplates(path.join(__dirname, 'lib', 'files'));
      let blogPostTrees = posts.map(post => {
        let related = findRelatedPost(post, posts);
        return this._writePostComponentTree(post, related);
      });
      let blogAuthorTrees = authors.map(author => {
        return this._writeAuthorComponentTree(author);
      });
      let blogStartPageTree = this._writeStartPageComponentTree(posts);

      return mergeTrees([tree, blogStartPageTree, ...blogPostTrees, ...blogAuthorTrees]);
    } else {
      return tree;
    }
  },

  isDevelopingAddon() {
    return true;
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
    }
    let componentTemplate = this._templates.post.template(data);
    trees.push(writeFile(`/src/ui/components/${post.componentName}/template.hbs`, componentTemplate));

    data = {
      componentName: post.componentName,
    };
    if (related && related.meta['teaser-background']) {
      data.relatedTeaserBackground = related.meta['teaser-background'];
    }
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

  _writeStartPageComponentTree(posts) {
    let trees = [];

    let [latest, ...rest] = sortNewestFirst(posts);
    let data = {
      latest: {
        title: latest.meta.title,
        excerpt: htmlizeExcerpt(latest.excerpt),
        date: dateformat(latest.meta.date, 'mmmm d, yyyy'),
        path: `/blog/${latest.queryPath}`,
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
  return posts.sort((a, b) => b.meta.date - a.meta.date);
}

function findRelatedPost(post, posts) {
  let sameCategoryPosts = posts.filter(p => p.meta.topic === post.meta.topic && p.queryPath !== post.queryPath);
  return sortNewestFirst(sameCategoryPosts)[0];
}
