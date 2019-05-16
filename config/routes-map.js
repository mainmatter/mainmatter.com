'use strict';

const path = require('path');

const collectPosts = require('../lib/generate-blog-components/lib/collect-posts');

module.exports = function() {
  let { posts, authors } = collectPosts(path.join(__dirname, '..', '_posts'));
  let blogPostRoutes = posts.reduce((acc, post) => {
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

  let blogAuthorsRoutes = authors.reduce((acc, author) => {
    acc[`/blog/author/${author.twitter}`] = {
      component: author.componentName,
      title: `Posts by ${author.name} | Blog`,
      bundle: {
        asset: `/blog-author-${author.twitter}.js`,
        module: `__blog-author-${author.twitter}__`,
      },
      parentBundle: {
        asset: '/blog.js',
      },
    };
    return acc;
  }, {});

  let routes = {
    ...blogPostRoutes,
    ...blogAuthorsRoutes,
    '/': { component: 'PageHomepage' },
    '/404': { component: 'Page404', title: 'Not found' },
    '/about': { component: 'PageAbout', title: 'About' },
    '/blog': { component: 'Blog', title: 'Blog', bundle: { asset: '/blog.js', module: '__blog__' } },
    '/calendar': {
      component: 'Calendar',
      title: 'Calendar',
      bundle: { asset: '/calendar.js', module: '__calendar__' },
    },
    '/cases/ddwrt': { component: 'PageCaseDdWrt', title: 'DD-WRT NXT Case Study' },
    '/cases/expedition': { component: 'PageCaseStudyExpedition', title: 'Expedition Case Study' },
    '/cases/trainline': { component: 'PageCaseStudyTrainline', title: 'Trainline Case Study' },
    '/contact': { component: 'PageContact', title: 'Contact' },
    '/expertise/ember': { component: 'PageEmberExpertise', title: 'Europe’s leading Ember experts' },
    '/imprint': {
      component: 'PageLegalImprint',
      title: 'Imprint',
      bundle: { asset: '/legal.js', module: '__legal__' },
    },
    '/playbook': {
      component: 'PagePlaybook',
      title: 'Playbook',
      bundle: { asset: '/playbook.js', module: '__playbook__' },
    },
    '/privacy': {
      component: 'PageLegalPrivacy',
      title: 'Privacy Policy',
      bundle: { asset: '/legal.js', module: '__legal__' },
    },
    '/services': { component: 'PageServices', title: 'Services' },
    '/services/full-stack-engineering': { component: 'PageFullStackEngineering', title: 'Full Stack Engineering' },
    '/services/team-augmentation': { component: 'PageTeamAugmentation', title: 'Team Augmentation' },
    '/services/training': { component: 'PageTraining', title: 'Tutoring' },
    '/talks': { component: 'PageTalks', title: 'Talks' },
    '/work': { component: 'PageWork', title: 'Work' },
  };

  return routes;
};
