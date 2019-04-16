'use strict';

const fs = require('fs');
const path = require('path');

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const BroccoliCleanCss = require('broccoli-clean-css');
const Funnel = require('broccoli-funnel');
const Map = require('broccoli-stew').map;
const MergeTrees = require('broccoli-merge-trees');
const Rollup = require('broccoli-rollup');
const typescript = require('broccoli-typescript-compiler').default;
const glob = require('glob');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const BroccoliDebug = require('broccoli-debug');
const replace = require('broccoli-string-replace');

function findAllComponents() {
  let routes = require('./config/routes-map')();
  let routedComponents = Object.keys(routes).reduce(function(acc, key) {
    let component = routes[key].component;
    if (component) {
      acc.push(component);
    }
    return acc;
  }, []);

  let staticComponents = glob
    .sync('*/', {
      cwd: path.join(__dirname, 'src/ui/components'),
    })
    .map(component => component.replace(/\/$/, ''));

  let allComponents = routedComponents.concat(staticComponents);
  return [...new Set(allComponents)];
}

class SimplabsApp extends GlimmerApp {
  ssrTree() {
    let tsTree = new Funnel('.', {
      include: ['ssr/**/*', 'config/**/*'],
    });

    return typescript(tsTree, {
      workingPath: this.project.root,
      tsconfig: {
        compilerOptions: {
          target: 'es6',
          moduleResolution: 'node',
        },
      },
      throwOnError: false,
    });
  }

  cssTree() {
    let resetCss = fs.readFileSync(path.join(this.project.root, 'vendor', 'css', 'reset.css'));
    let baselineCss = fs.readFileSync(path.join(this.project.root, 'src', 'ui', 'styles', 'baseline.css'));

    let cssTree = Funnel(super.cssTree(...arguments), {
      include: ['app.css'],
    });

    cssTree = Map(cssTree, content => [resetCss, baselineCss, content].join(''));

    if (this.options.minifyCSS.enabled) {
      cssTree = new BroccoliCleanCss(cssTree);
    }

    return cssTree;
  }

  package(jsTree) {
    let [mainSiteTree, blogTree] = this._splitBlogTree(jsTree);
    let appTree = super.package(mainSiteTree);
    let blogContentTree = this._packageBlog(blogTree);
    let mainTree = new MergeTrees([appTree, blogContentTree]);

    if (process.env.PRERENDER) {
      let ssrTree = this._packageSSR();

      return new MergeTrees([mainTree, ssrTree]);
    } else {
      return mainTree;
    }
  }

  _splitBlogTree(tree) {
    let mainSiteTree = new Funnel(tree, {
      exclude: ['src/ui/components/Blog*'],
    });
    let mainSiteJsTree = new Funnel(mainSiteTree, {
      exclude: ['src/ui/components/**/*.hbs'],
    });
    let mainSiteModuleMap = this.buildResolutionMap(mainSiteJsTree);
    mainSiteTree = new MergeTrees([mainSiteTree, mainSiteModuleMap], { overwrite: true });

    let blogTree = new Funnel(tree, {
      exclude: ['src/ui/components/!(Blog)*']
    });
    let blogJsTree = new Funnel(blogTree, {
      exclude: ['src/ui/components/**/*.hbs'],
    });
    let blogModuleMap = this.buildResolutionMap(blogJsTree);
    blogTree = new MergeTrees([blogTree, blogModuleMap], { overwrite: true });

    return [mainSiteTree, blogTree];
  }

  _packageSSR() {
    let jsTree = new Funnel(this.javascriptTree(), {
      exclude: ['src/index.js'],
    });
    let ssrTree = this.ssrTree();

    let appTree = new MergeTrees([jsTree, ssrTree]);
    return new Rollup(appTree, {
      rollup: {
        input: 'ssr/index.js',
        output: {
          file: 'ssr-app.js',
          format: 'cjs',
        },
        onwarn(warning) {
          if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
          }
          // eslint-disable-next-line no-console
          console.log('Rollup warning: ', warning.message);
        },
        plugins: [resolve({ jsnext: true, module: true, main: true }), commonjs()],
      },
    });
  }

  _packageBlog(blogTree) {
    return new Rollup(blogTree, {
      rollup: {
        input: 'config/module-map.js',
        output: {
          file: 'blog.js',
          name: '__blog__',
          format: 'umd',
          sourcemap: this.options.sourcemaps.enabled,
        },
        plugins: [resolve({ jsnext: true, module: true, main: true }), commonjs()],
      },
    });
  }
}

module.exports = function(defaults) {
  let allComponents = findAllComponents();

  let app = new SimplabsApp(defaults, {
    'css-blocks': {
      entry: allComponents,
      output: 'src/ui/styles/app.css',
    },
    minifyCSS: {
      enabled: process.env.EMBER_ENV === 'production',
    },
    fingerprint: {
      exclude: ['ssr-app.js'],
    },
    rollup: {
      plugins: [resolve({ jsnext: true, module: true, main: true }), commonjs()],
    },
  });

  return app.toTree();
};
