'use strict';

const fs = require('fs');
const path = require('path');

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const BroccoliCleanCss = require('broccoli-clean-css');
const Funnel = require('broccoli-funnel');
const Map = require('broccoli-stew').map;
const glob = require('glob');

function findAllComponents() {
  let routes = require('./config/routes-map')();
  let routedComponents = Object.keys(routes).reduce(function(acc, key) {
    let component = routes[key].component;
    if (component) {
      acc.push(component);
    }
    return acc;
  }, []);

  let staticComponents = glob.sync('*/', {
    cwd: path.join(__dirname, 'src/ui/components')
  }).map((component) => component.replace(/\/$/, ''));

  let allComponents = routedComponents.concat(staticComponents);
  return [...new Set(allComponents)]; 
}

class SimplabsApp extends GlimmerApp {
  cssTree() {
    let resetCss = fs.readFileSync(path.join(this.project.root, 'vendor', 'css', 'reset.css'));
    let cssTree = Funnel(super.cssTree(...arguments), {
      include: ['app.css']
    });
	
    cssTree = Map(cssTree, (content) => `${resetCss}${content}`);
	
    if (this.options.minifyCSS.enabled) {
      cssTree = new BroccoliCleanCss(cssTree);
    }
	
    return cssTree;
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
      enabled: process.env.EMBER_ENV === 'production'
    },
  });

  return app.toTree();
};
