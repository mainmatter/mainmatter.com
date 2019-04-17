'use strict';

const path = require('path');

const collectPosts = require('../lib/generate-blog-components/lib/collect-posts');

module.exports = function() {
  let blogPosts = collectPosts(path.join(__dirname, '..', '_posts'));
  let blogPostRoutes = blogPosts.reduce((acc, post) => {
    acc[`/blog/${post.queryPath}`] = {
      component: post.componentName,
      bundle: {
        asset: `/blog-${post.queryPath}.js`,
        module: `__blog-${post.queryPath}__`,
      },
      parentBundle: {
        asset: '/blog.js',
      },
    };
    return acc;
  }, {});

  let routes = {
    ...blogPostRoutes,
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
    '/blog': { component: 'Blog', bundle: { asset: '/blog.js', module: '__blog__' } },
  };

  return routes;
};
