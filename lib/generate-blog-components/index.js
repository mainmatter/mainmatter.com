/* eslint-env node */
'use strict';

const path = require('path');

const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const marked = require('marked');
const highlightjs = require('highlight.js');
const dateformat = require('dateformat');

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
      let blogPostTrees = posts.map(post => {
        let excerpt = htmlizeExcerpt(post.excerpt);
        let body = htmlizeBody(post.content);
        return mergeTrees([
          writeTemplate(post.componentName, excerpt, body, post.meta),
          writeBackingClass(post.componentName),
          writeCssBlock(post.componentName),
        ]);
      });

      return mergeTrees([tree, ...blogPostTrees]);
    } else {
      return tree;
    }
  },

  isDevelopingAddon() {
    return true;
  },
};

function writeTemplate(componentName, excerpt, body, meta) {
  return writeFile(
    `/src/ui/components/${componentName}/template.hbs`,
    `
    <div>
      <div class="contents">
        <div class="container">
          <Navigation />
          <div class="header-block">
            <p class="typography.body-text">
              ${dateformat(meta.date, 'mmmm d, yyyy')}
            </p>
            <h1 class="typography.display">
              ${meta.title}
            </h1>
            ${excerpt}
          </div>
        </div>
    
        <div class="container">
          <div class="main-block">
            <div class="main-block.content">
              <div class="main-block.content-item">
                <div class="main-block.content-section">
                  <div class="main-block.content-section-item">
                    ${body}
                  </div>
                </div>
                <!--section-->
              </div>
            </div>
            <div class="main-block.sidebar">
              <p class="typography.small-text">
                About the Author
              </p>
              <div class="card">
                <div class="card.image">
                  <img class="fluid-image.image-cover" src="/assets/images/authors/${meta['twitter-handle']}.jpg" />
                </div>
                <h3 class="card.sub-heading">
                  ${meta.author}
                </h3>
                <p class="card.text">
                  ${meta.bio}
                </p>
                <a class="typography.link" href="https://twitter.com/${meta['twitter-handle']}">
                  ${meta['twitter-handle']}
                </a>
              </div>
              <p class="typography.small-text">
                About Simplabs
              </p>
              <div class="card">
                <img class="logo" src="/assets/images/neu.svg" />
                <p class="card.text">
                  simplabs is a Web Engineering Consultancy based in Munich, Germany. We work for clients all over the world, offering Software Engineering, Technology Consulting as well as Individual and Group Training with modern Web Technologies. We specialize in a set of conventions-based tools like Ember.js, Elixir and, Phoenix as well as Ruby on Rails and like to move fast without breaking things.
                </p>
                <a class="typography.arrow-link" href="/about">
                  Learn more about Simplabs
                </a>
              </div>
            </div>
            <!--sidebar-->
          </div>
        </div>
        <div class="container">
          <BlogRelatedArticle />
        </div>
        <!--container-->
        <div class="container">
          <WorkWithUs />
        </div>
        <div class="container">
          <Footer />
        </div>
      </div>
    </div>
  `,
  );
}

function writeBackingClass(componentName) {
  return writeFile(
    `/src/ui/components/${componentName}/component.ts`,
    `
    import Component from '@glimmer/component';

    export default class ${componentName} extends Component {
    }
  `,
  );
}

function writeCssBlock(componentName) {
  return writeFile(
    `/src/ui/components/${componentName}/stylesheet.css`,
    `
    @block blog-post from "../../styles/blocks/blog-post.block.css";
    @block typography from "../../styles/blocks/typography.block.css";
    @block main-block from "../../styles/blocks/main-block.block.css";
    @block header-block from "../../styles/blocks/header-block.block.css";
    @block fluid-image from "../../styles/blocks/fluid-image.block.css";
    @block card from "../../styles/blocks/card.block.css";
    @block table from "../../styles/blocks/table.block.css";
    @block list from "../../styles/blocks/list.block.css";

    :scope {
      block-name: ${componentName};
      extends: blog-post;
    }
  `,
  );
}

function encodeCurlies(content) {
  return content.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;');
}

function htmlizeBody(body) {
  let html = encodeCurlies(marked(body, { renderer: Renderer }));
  return addClasses(html);
}

function htmlizeExcerpt(excerpt) {
  let html = encodeCurlies(marked(excerpt, { renderer: Renderer }));
  return html.trim().replace(/<p>/g, '<p class="typography.lead">');
}

function addClasses(html) {
  return html
    .replace(/<h2([^>]*)>/g, '<h2$1 class="typography.sub-heading">')
    .replace(/<p([^>]*)>/g, '<p$1 class="typography.body-text">');
}
