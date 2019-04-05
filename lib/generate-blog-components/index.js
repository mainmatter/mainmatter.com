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
      let templates = prepareTemplates();
      let blogPostTrees = posts.map(post => writeComponentTree(templates, post));

      return mergeTrees([tree, ...blogPostTrees]);
    } else {
      return tree;
    }
  },

  isDevelopingAddon() {
    return true;
  },
};

function writeComponentTree(templates, post) {
  let trees = [];
  let excerpt = htmlizeExcerpt(post.excerpt);
  let body = htmlizeBody(post.content);

  let componentTemplate = templates['component-template']({
    date: dateformat(post.meta.date, 'mmmm d, yyyy'),
    title: post.meta.title,
    excerpt,
    body,
    author: {
      name: post.meta.author,
      bio: post.meta.bio,
      twitter: post.meta.twitter
    }
  });
  trees.push(writeFile(`/src/ui/components/${post.componentName}/template.hbs`, componentTemplate));

  let componentBackingClass = templates['component-backing-class']({ componentName: post.componentName });
  trees.push(writeFile(`/src/ui/components/${post.componentName}/component.ts`, componentBackingClass));

  let componentCssBlock = templates['component-css-block']({ componentName: post.componentName });
  trees.push(writeFile(`/src/ui/components/${post.componentName}/stylesheet.css`, componentCssBlock));

  return mergeTrees(trees);
}

function encodeCurlies(content) {
  return content.replace(/\{\{/gm, '&#123;&#123;').replace(/\}\}/gm, '&#125;&#125;');
}

function htmlizeBody(body) {
  let html = marked(body, { renderer: Renderer });
  html = manipulateDom(html, (dom) => {
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
  html = manipulateDom(html, (dom) => {
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
  return ['component-template', 'component-backing-class', 'component-css-block'].reduce((acc, template) => {
    let source = fs.readFileSync(path.join(__dirname, 'lib', 'files', `${template}.hbs`)).toString();
    acc[template] = handlebars.compile(source);
    return acc;
  }, {});
}
