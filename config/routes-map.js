'use strict';

const path = require('path');
const collectPosts = require('../lib/generate-blog/lib/collect-posts');

module.exports = function() {
  let { posts, authors } = collectPosts(path.join(__dirname, '..', '_posts'));
  let blogPostRoutes = posts.reduce((acc, post) => {
    acc[`/blog/${post.queryPath}`] = {
      component: post.componentName,
      bundle: {
        asset: `/blog/${post.queryPath}.js`,
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
      bundle: {
        asset: `/blog/author-${author.twitter}.js`,
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
    '/404': { component: 'Page404', sitemap: false },
    '/blog': { component: 'PageBlog', bundle: { asset: '/blog.js', module: '__blog__' } },
    '/calendar': {
      component: 'PageCalendar',
      bundle: { asset: '/calendar.js', module: '__calendar__' },
    },
    '/cases/ddwrt': { component: 'PageCaseDdWrt' },
    '/cases/expedition': { component: 'PageCaseStudyExpedition' },
    '/cases/timify': { component: 'PageCaseStudyTimify' },
    '/cases/trainline': { component: 'PageCaseStudyTrainline' },
    '/contact': { component: 'PageContact' },
    '/expertise/ember': { component: 'PageEmberExpertise' },
    '/expertise/elixir-phoenix': { component: 'PageElixirExpertise' },
    '/imprint': {
      component: 'PageLegalImprint',
      bundle: { asset: '/legal.js', module: '__legal__' },
      sitemap: false,
    },
    '/playbook': {
      component: 'PagePlaybook',
      bundle: { asset: '/playbook.js', module: '__playbook__' },
    },
    '/privacy': {
      component: 'PageLegalPrivacy',
      bundle: { asset: '/legal.js', module: '__legal__' },
      sitemap: false,
    },
    '/services': { component: 'PageServices' },
    '/services/full-stack-engineering': {
      component: 'PageFullStackEngineering',
    },
    '/services/team-augmentation': { component: 'PageTeamAugmentation' },
    '/services/tutoring': { component: 'PageTutoring' },
    '/talks': { component: 'PageTalks', bundle: { asset: '/talks.js', module: '__talks__' } },
    '/why-simplabs': { component: 'PageWhySimplabs' },
    '/work': { component: 'PageWork' },
    '/webinars/modern-web': { component: 'PageLandingPwaWebinar' },
  };

  return routes;
};
