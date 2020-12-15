'use strict';

const path = require('path');

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const BroccoliCleanCss = require('broccoli-clean-css');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const Rollup = require('broccoli-rollup');
const typescript = require('broccoli-typescript-compiler').default;
const glob = require('glob');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const collectPosts = require('./lib/generate-blog/lib/collect-posts');
const _ = require('lodash');

function findAllComponents() {
  let routes = require('./config/routes-map')();
  let routedComponents = Object.keys(routes).reduce(function (acc, key) {
    let component = routes[key].component;
    if (component) {
      acc.push(component);
    }
    return acc;
  }, []);

  let recentContentComponents = _.chain(collectPosts(path.join(__dirname, '_posts')).posts)
    .map('meta.topic')
    .uniq()
    .map((topic) => `RecentPosts${_.capitalize(topic)}`)
    .value();

  let staticComponents = glob
    .sync('*/', {
      cwd: path.join(__dirname, 'src/ui/components'),
    })
    .map((component) => component.replace(/\/$/, ''));

  let allComponents = routedComponents.concat(staticComponents).concat(recentContentComponents);
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
      throwOnError: process.env.NODE_ENV === 'production',
    });
  }

  cssTree() {
    let cssTree = super.cssTree(...arguments);

    if (this.options.minifyCSS.enabled) {
      cssTree = new BroccoliCleanCss(cssTree, { inline: ['all'] });
    }

    return cssTree;
  }

  package(jsTree) {
    let mainSiteTree = this._dropBundle(jsTree, {
      componentPrefix: 'PageBlog',
    });

    let { posts, authors } = collectPosts(path.join(__dirname, '_posts'));
    let blogPostTrees = posts.map((post) => {
      let [blogPostTree] = this._splitBundle(jsTree, {
        componentPrefix: post.componentName,
        file: `blog/${post.queryPath}.js`,
        moduleName: `__blog-${post.queryPath}__`,
      });
      return blogPostTree;
    });

    let blogAuthorTrees = authors.map((author) => {
      let [blogAuthorTree] = this._splitBundle(jsTree, {
        componentPrefix: author.componentName,
        file: `blog/author-${author.twitter}.js`,
        moduleName: `__blog-author-${author.twitter}__`,
      });
      return blogAuthorTree;
    });

    let blogPages = _.chunk(posts, 10);
    let blogPageTrees = blogPages.map((posts, i) => {
      let page = i + 1;
      let postPrefixes = posts.map((post) => post.componentName).join('|');
      let [blogPageTree] = this._splitBundle(jsTree, {
        componentPrefix: `PageBlogPage${page}|${postPrefixes}`,
        file: `blog/page/${page}.js`,
        moduleName: `__blog-page-${page}__`,
      });
      return blogPageTree;
    });

    let [calendarTree, mainSiteNonCalendarTree] = this._splitBundle(mainSiteTree, {
      componentPrefix: 'PageCalendar',
      file: 'calendar.js',
      moduleName: '__calendar__',
    });
    mainSiteTree = mainSiteNonCalendarTree;

    let [legalTree, mainSiteNonLegalTree] = this._splitBundle(mainSiteTree, {
      componentPrefix: 'PageLegal',
      file: 'legal.js',
      moduleName: '__legal__',
    });
    mainSiteTree = mainSiteNonLegalTree;

    let [talksTree, mainSiteNonTalksTree] = this._splitBundle(mainSiteTree, {
      componentPrefix: 'PageTalks',
      file: 'talks.js',
      moduleName: '__talks__',
    });
    mainSiteTree = mainSiteNonTalksTree;

    let [recentContentTree, mainSiteNonRecentTree] = this._splitBundle(mainSiteTree, {
      componentPrefix: 'Recent',
      file: 'recent.js',
      moduleName: '__recent__',
    });
    mainSiteTree = mainSiteNonRecentTree;

    let [builtToLastTree, mainSiteNonBuiltToLastTree] = this._splitBundle(mainSiteTree, {
      componentPrefix: 'PageBuiltToLast',
      file: 'built-to-last.js',
      moduleName: '__builtToLast__',
    });
    mainSiteTree = mainSiteNonTalksTree;

    let appTree = super.package(mainSiteTree);
    let mainTree = new MergeTrees([
      appTree,
      legalTree,
      calendarTree,
      talksTree,
      recentContentTree,
      builtToLastTree,
      ...blogPostTrees,
      ...blogAuthorTrees,
      ...blogPageTrees,
    ]);

    if (process.env.PRERENDER) {
      let ssrTree = this._packageSSR();

      return new MergeTrees([mainTree, ssrTree]);
    } else {
      return mainTree;
    }
  }

  _packageSSR() {
    let jsTree = new Funnel(this.javascriptTree(), {
      exclude: ['src/index.js'],
    });
    let ssrTree = this.ssrTree();

    let appTree = new MergeTrees([jsTree, ssrTree], { overwrite: true });
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

  _splitBundle(appTree, bundle) {
    let mainBundleTree = this._dropBundle(appTree, bundle);

    let bundleTree = new Funnel(appTree, {
      exclude: [`src/ui/components/!(${bundle.componentPrefix})*`],
    });
    let bundleJsTree = new Funnel(bundleTree, {
      include: ['**/*.js'],
    });
    let bundleModuleMap = this.buildResolutionMap(bundleJsTree);
    bundleTree = new MergeTrees([bundleTree, bundleModuleMap], { overwrite: true });
    bundleTree = this._packageSplitBundle(bundleTree, bundle);

    return [bundleTree, mainBundleTree];
  }

  _dropBundle(appTree, bundle) {
    let mainBundleTree = new Funnel(appTree, {
      exclude: [`src/ui/components/+(${bundle.componentPrefix})*`],
    });
    let mainBundleJsTree = new Funnel(mainBundleTree, {
      include: ['**/*.js'],
    });
    let mainBundleModuleMap = this.buildResolutionMap(mainBundleJsTree);
    return new MergeTrees([mainBundleTree, mainBundleModuleMap], { overwrite: true });
  }

  _packageSplitBundle(bundleTree, bundle) {
    return new Rollup(bundleTree, {
      rollup: {
        input: 'config/module-map.js',
        output: {
          file: bundle.file,
          name: bundle.moduleName,
          format: 'umd',
          sourcemap: this.options.sourcemaps.enabled,
        },
        plugins: [resolve({ jsnext: true, module: true, main: true }), commonjs()],
      },
    });
  }
}

module.exports = function (defaults) {
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
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg', 'woff2'],
      replaceExtensions: ['html', 'css', 'js', 'json', 'xml', 'webmanifest'],
    },
    rollup: {
      plugins: [resolve({ jsnext: true, module: true, main: true }), commonjs()],
    },
  });

  return app.toTree();
};
