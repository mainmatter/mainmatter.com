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
    '/': { component: 'PageHomepage' },
    '/services': { component: 'PageServices', title: 'Services' },
    '/services/software-engineering': { component: 'PageSoftwareEngineering', title: 'Full Stack Engineering' },
    '/services/team-augmentation': { component: 'PageTeamAugmentation', title: 'Team Augmentation' },
    '/services/training': { component: 'PageTraining', title: 'Tutoring' },
    '/cases/trainline': { component: 'PageCaseStudyTrainline', title: 'Trainline Case Study' },
    '/cases/expedition': { component: 'PageCaseStudyExpedition', title: 'Expedition Case Study' },
    '/about': { component: 'PageAbout', title: 'About' },
    '/expertise/ember': { component: 'PageEmberExpertise', title: 'Europe’s leading Ember experts' },
    '/work': { component: 'PageWork', title: 'Work' },
    '/talks': { component: 'PageTalks', title: 'Talks' },
    '/calendar': { component: 'PageCalendar', title: 'Calendar' },
    '/playbook': { component: 'PagePlaybook', title: 'Playbook' },
    '/contact': { component: 'PageContact', title: 'Contact' },
    '/blog': { component: 'Blog', title: 'Blog', bundle: { asset: '/blog.js', module: '__blog__' } },
  };

  return routes;
};
