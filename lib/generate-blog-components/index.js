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

var BroccoliDebug = require('broccoli-debug');

var renderer = new marked.Renderer();

renderer.code = function (code, infostring, escaped) {
  console.log(arguments);
  return 'CODE!';
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
        let template = marked(fs.readFileSync(file).toString(), { renderer }).toString().replace(/\{\{/g, '').replace(/\}\}/g, '');

        return mergeTrees([
          writeFile(`/src/ui/components/${componentName}/template.hbs`, `<div>${template}</div>`),
          writeFile(`/src/ui/components/${componentName}/stylesheet.css`, `
            :scope {
              block-name: ${componentName};
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
