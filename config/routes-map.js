'use strict';

const path = require('path');

const collectPosts = require('../lib/generate-blog-components/lib/collect-posts');

module.exports = function() {
  let blogPosts = collectPosts(path.join(__dirname, '..', '_posts'));
  let blogPostRoutes = blogPosts.reduce((acc, post) => {
    acc[`/blog/${post.queryPath}`] = {
      component: post.componentName,
      title: `${post.meta.title} | Blog`,
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
    '/services': { component: 'Services', title: 'Services' },
    '/services/software-engineering': { component: 'SoftwareEngineering', title: 'Full Stack Engineering' },
    '/services/team-augmentation': { component: 'TeamAugmentation', title: 'Team Augmentation' },
    '/services/training': { component: 'Training', title: 'Tutoring' },
    '/cases/trainline': { component: 'TrainlineCaseStudy', title: 'Trainline Case Study' },
    '/cases/expedition': { component: 'ExpeditionCaseStudy', title: 'Expedition Case Study' },
    '/about': { component: 'About', title: 'About' },
    // eslint-disable-next-line quotes
    '/expertise/ember': { component: 'EmberExpertise', title: "Europe's leading Ember experts" },
    '/work': { component: 'Work', title: 'Work' },
    '/talks': { component: 'Talks', title: 'Talks' },
    '/calendar': { component: 'Calendar', title: 'Calendar' },
    '/playbook': { component: 'Playbook', title: 'Playbook' },
    '/contact': { component: 'Contact', title: 'Contact' },
    '/blog': { component: 'Blog', title: 'Blog', bundle: { asset: '/blog.js', module: '__blog__' } },
  };

  return routes;
};
