/* eslint-env node */
'use strict';

const path = require('path');

const replace = require('broccoli-string-replace');
const routesMap = require('../../config/routes-map.js');
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const marked = require('marked');
const fs = require('fs-extra');
const glob = require('glob');
const highlightjs = require('highlight.js');

var BroccoliDebug = require('broccoli-debug');

var renderer = new marked.Renderer();

renderer.code = function (code, language, escaped) {
  console.log(arguments);
  let highlighted = code;
  if (language) {
    highlighted = highlightjs.highlight(language, code).value;
  }
  highlighted = highlighted.replace(/class="undefined"/, '');
  console.log({ highlighted });
  return `<div class="code"><pre>${highlighted}</pre></div>`
};

module.exports = {
  name: 'inject-routes',

  preprocessTree(type, tree) {
    if (type === 'src') {
    let blogPostTrees = glob
      .sync('**/*.md', {
        cwd: path.join(__dirname, '..', '..', '_posts'),
        absolute: true
      })
      .map(file => {
        console.log(file);
        let urlPath = path.basename(file, '.md');
        let componentName = `BlogPost${urlPath.replace(/-[a-zA-Z]/g, (match) => match.replace('-', '').toUpperCase()).replace(/-/g, '').replace(/[^a-zA-Z0-9]/, '_')}`;
        let content = marked(fs.readFileSync(file).toString(), { renderer }).toString().replace(/\{\{/g, '').replace(/\}\}/g, '');

        return mergeTrees([
          writeFile(`/src/ui/components/${componentName}/template.hbs`, `
            <div>
              <div class="contents">
                <div class="container">
                  <Navigation />
                  <div class="header-block">
                    <p class="typography.body-text">
                      Date
                    </p>
                    <h1 class="typography.display">
                      Title
                    </h1>
                    <p class="typography.lead">
                      First Paragraph
                    </p>
                  </div>
                </div>
            
                <div class="container">
                  <div class="main-block">
                    <div class="main-block.content">
                      <div class="main-block.content-item">
                        <div class="main-block.content-section">
                          <div class="main-block.content-section-item">
                            ${content}
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
                          <img class="fluid-image.image-cover" src="assets/images/nlong.jpg" />
                        </div>
                        <h3 class="card.sub-heading">
                          Niklas Long
                        </h3>
                        <p class="card.text">
                          Working as contributor on multiple Phoenix and Ember web applications.
                        </p>
                        <a class="typography.link" href="https://twitter.com/niklas_long?lang=en">
                          @niklas_long
                        </a>
                      </div>
                      <p class="typography.small-text">
                        About Simplabs
                      </p>
                      <div class="card">
                        <img class="logo" src="assets/images/neu.svg" />
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
          `),
          writeFile(`/src/ui/components/${componentName}/stylesheet.css`, `
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
          `),
          writeFile(`/src/ui/components/${componentName}/component.ts`, `
            import Component from '@glimmer/component';

            export default class ${componentName} extends Component {
            }
          `)
        ]);
      });

      return new BroccoliDebug(mergeTrees([tree, ...blogPostTrees]), 'mystuff');
    } else {
      return tree;
    }
  },

  isDevelopingAddon() {
    return true;
  },
};
