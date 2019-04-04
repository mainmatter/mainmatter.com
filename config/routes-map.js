'use strict';

const path = require('path');
const glob = require('glob');

module.exports = function() {
  let blogPosts = glob
    .sync('**/*.md', {
      cwd: path.join(__dirname, '..', '_posts'),
    })
    .reduce((acc, file) => {
      let urlPath = path.basename(file, '.md');
      let componentName = `BlogPost${urlPath.replace(/-[a-zA-Z]/g, (match) => match.replace('-', '').toUpperCase()).replace(/-/g, '').replace(/[^a-zA-Z0-9]/, '_')}`;
      acc[`/blog/${urlPath}`] = { component: componentName };
      return acc;
    } , {});

  let routes = {
    ...blogPosts,
    '/': { component: 'Homepage' },
    '/services': { component: 'Services' },
    '/services/software-engineering': { component: 'SoftwareEngineering' },
    '/services/team-augmentation': { component: 'TeamAugmentation' },
    '/cases/trainline': { component: 'TrainlineCaseStudy' },
    '/cases/expedition': { component: 'ExpeditionCaseStudy' },
    '/about': { component: 'About' },
    '/expertise/ember': { component: 'EmberExpertise' },
    '/work': { component: 'Work' },
    '/talks': { component: 'Talks' },
    '/calendar': { component: 'Calendar' },
    '/playbook': { component: 'Playbook' },
    '/contact': { component: 'Contact' },
    '/blog': { component: 'Blog' },
    '/article': { component: 'Article' },
  };

  return routes;
};
