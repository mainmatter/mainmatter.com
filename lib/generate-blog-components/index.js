/* eslint-env node */
'use strict';

const path = require('path');

const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const marked = require('marked');
const highlightjs = require('highlight.js');
const dateformat = require('dateformat');
const jsdom = require('jsdom');
const handlebars = require('handlebars');
const fs = require('fs-extra');

const collectPosts = require('./lib/collect-posts');

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
      let posts = collectPosts(path.join(__dirname, '..', '..', '_posts'));
      this._templates = prepareTemplates();
      let blogPostTrees = posts.map(post => {
        let related = findRelatedPost(post, posts);
        return this._writePostComponentTree(post, related);
      });
      let blogStartPageTree = this._writeStartPageComponentTree(posts);

      return mergeTrees([tree, blogStartPageTree, ...blogPostTrees]);
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
    let componentTemplate = this._templates['post-component-template'](data);
    trees.push(writeFile(`/src/ui/components/${post.componentName}/template.hbs`, componentTemplate));

    let componentBackingClass = this._templates['post-component-backing-class']({ componentName: post.componentName });
    trees.push(writeFile(`/src/ui/components/${post.componentName}/component.ts`, componentBackingClass));

    data = {
      componentName: post.componentName,
    };
    if (related && related.meta['teaser-background']) {
      data.relatedTeaserBackground = related.meta['teaser-background'];
    }
    let componentCssBlock = this._templates['post-component-css-block'](data);
    trees.push(writeFile(`/src/ui/components/${post.componentName}/stylesheet.css`, componentCssBlock));

    return mergeTrees(trees);
  },

  _writeStartPageComponentTree(posts) {
    let trees = [];

    let [latest, ...rest] = sortNewestFirst(posts);
    let data = {
      latest: {
        title: latest.meta.title,
        excerpt: htmlizeExcerpt(latest.excerpt),
        path: `/blog/${latest.queryPath}`
      },
      rest: rest.map((post) => {
        return {
          title: post.meta.title,
          excerpt: htmlizeExcerpt(post.excerpt),
          path: `/blog/${post.queryPath}`,
          topic: post.meta.topic,
          date: dateformat(post.meta.date, 'mmmm d, yyyy'),
          author: {
            name: post.meta.author,
          },
        };
      })
    };
    let componentTemplate = this._templates['start-page-component-template'](data);
    trees.push(writeFile(`/src/ui/components/Blog/template.hbs`, componentTemplate));

    let componentBackingClass = this._templates['start-page-component-backing-class']();
    trees.push(writeFile(`/src/ui/components/Blog/component.ts`, componentBackingClass));

    let componentCssBlock = this._templates['start-page-component-css-block']();
    trees.push(writeFile(`/src/ui/components/Blog/stylesheet.css`, componentCssBlock));

    return mergeTrees(trees);
  }
};

function encodeCurlies(content) {
  return content.replace(/\{\{/gm, '&#123;&#123;').replace(/\}\}/gm, '&#125;&#125;');
}

function htmlizeBody(body) {
  let html = marked(body, { renderer: Renderer });
  html = manipulateDom(html, dom => {
    dom.querySelectorAll('h2').forEach(h2 => h2.classList.add('typography.sub-heading'));
    dom.querySelectorAll('p').forEach(p => p.classList.add('typography.body-text'));
    dom.querySelectorAll('p > img').forEach(img => {
      let paragraph = img.parentElement;
      img.classList.add('main-block.image-centered');
      let div = dom.createElement('div');
      div.classList.add('main-block.body-image');
      div.appendChild(img);
      paragraph.parentElement.insertBefore(div, paragraph);
      paragraph.parentElement.removeChild(paragraph);
    });
    dom.querySelectorAll('ul, ol').forEach(list => list.classList.add('list'));
    dom.querySelectorAll('ul > li').forEach(li => li.classList.add('list.item'));
    dom.querySelectorAll('ol > li').forEach(li => li.classList.add('list.item-ordered'));
    dom.querySelectorAll('table').forEach(table => table.classList.add('table'));
    dom.querySelectorAll('th').forEach(th => th.classList.add('table.header'));
    dom.querySelectorAll('td').forEach(td => td.classList.add('table.cell'));
  });
  return encodeCurlies(html);
}

function htmlizeExcerpt(excerpt) {
  let html = marked(excerpt, { renderer: Renderer });
  html = manipulateDom(html, dom => {
    dom.querySelectorAll('p').forEach(p => p.classList.add('typography.lead'));
  });
  return encodeCurlies(html);
}

function manipulateDom(html, callback) {
  let dom = new jsdom.JSDOM(html);
  callback(dom.window.document);
  return dom.window.document.body.innerHTML;
}

function prepareTemplates() {
  let templates = {
    'post-component-template': ['post', 'component-template.hbs'],
    'post-component-backing-class': ['post', 'component-backing-class.hbs'],
    'post-component-css-block':  ['post', 'component-css-block.hbs'],
    'start-page-component-template':  ['start-page', 'component-template.hbs'],
    'start-page-component-backing-class':  ['start-page', 'component-backing-class.hbs'],
    'start-page-component-css-block':  ['start-page', 'component-css-block.hbs']
  };
  return Object.keys(templates).reduce((acc, key) => {
    let templatePath = templates[key];
    let source = fs.readFileSync(path.join(__dirname, 'lib', 'files', ...templatePath)).toString();
    acc[key] = handlebars.compile(source);
    return acc;
  }, {});
}

function sortNewestFirst(posts) {
  return posts.sort((a, b) => b.meta.date - a.meta.date);
}

function findRelatedPost(post, posts) {
  let sameCategoryPosts = posts.filter(p => p.meta.topic === post.meta.topic && p.queryPath !== post.queryPath);
  return sortNewestFirst(sameCategoryPosts)[0];
}
