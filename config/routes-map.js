'use strict';

const path = require('path');

const _ = require('lodash');

const collectPosts = require('../lib/generate-blog/lib/collect-posts');
const collectVideos = require('../lib/generate-resources/lib/collect-videos');

module.exports = function () {
  let { posts, authors } = collectPosts(path.join(__dirname, '..', '_posts'));
  let blogAuthorsRoutes = authors.reduce((acc, author) => {
    acc[`/blog/author/${author.twitter}`] = {
      component: author.componentName,
      bundle: {
        asset: `/blog/author-${author.twitter}.js`,
        module: `__blog-author-${author.twitter}__`,
      },
    };
    return acc;
  }, {});

  let blogPages = _.chunk(posts, 10);
  let blogPostRoutes = {};
  let blogPagesRoutes = {};
  blogPages.forEach((pagePosts, i) => {
    let page = i + 1;
    let route;
    if (page === 1) {
      route = '/blog';
    } else {
      route = `/blog/page/${page}`;
    }
    blogPagesRoutes[route] = {
      component: `PageBlogPage${page}`,
      bundle: {
        asset: `/blog/page/${page}.js`,
        module: `__blog-page-${page}__`,
      },
    };

    for (let post of pagePosts) {
      blogPostRoutes[`/blog/${post.queryPath}`] = {
        component: post.componentName,
        bundle: {
          asset: `/blog/${post.queryPath}.js`,
          module: `__blog-${post.queryPath}__`,
        },
        parentBundle: {
          asset: `/blog/page/${page}.js`,
        },
      };
    }
  });

  let videos = collectVideos(path.join(__dirname, '..', '_videos'));
  let videoRoutes = videos.reduce((acc, video) => {
    acc[`/resources/video/${video.queryPath}`] = {
      component: video.componentName,
      bundle: { asset: '/resources.js', module: '__resources__' },
    };
    return acc;
  }, {});

  let routes = {
    ...blogPagesRoutes,
    ...blogPostRoutes,
    ...blogAuthorsRoutes,
    ...videoRoutes,
    '/': { component: 'PageHomepage' },
    '/404': { component: 'Page404' },
    '/calendar': {
      component: 'PageCalendar',
      bundle: { asset: '/calendar.js', module: '__calendar__' },
    },
    '/cases/ddwrt': { component: 'PageCaseDdWrt' },
    '/cases/expedition': { component: 'PageCaseStudyExpedition' },
    '/cases/timify': { component: 'PageCaseStudyTimify' },
    '/cases/trainline': { component: 'PageCaseStudyTrainline' },
    '/cases/qonto': { component: 'PageCaseStudyQonto' },
    '/contact': { component: 'PageContact' },
    '/ember-consulting': { component: 'PageEmberExpertise' },
    '/expertise/elixir-phoenix': { component: 'PageElixirExpertise' },
    '/imprint': {
      component: 'PageLegalImprint',
      bundle: { asset: '/legal.js', module: '__legal__' },
    },
    '/playbook': {
      component: 'PagePlaybook',
    },
    '/privacy': {
      component: 'PageLegalPrivacy',
      bundle: { asset: '/legal.js', module: '__legal__' },
    },
    '/services': { component: 'PageServices' },
    '/services/digital-products': {
      component: 'PageDigitalProducts',
    },
    '/services/team-augmentation': { component: 'PageTeamAugmentation' },
    '/services/product-development': { component: 'PageProductDevelopment' },
    '/services/product-design': { component: 'PageProductDesign' },
    '/services/training': { component: 'PageTrainingAndSupport' },
    '/talks': { component: 'PageTalks', bundle: { asset: '/talks.js', module: '__talks__' } },
    '/why-simplabs': { component: 'PageWhySimplabs' },
    '/work': { component: 'PageWork' },
    '/resources': {
      component: 'PageResources',
      bundle: { asset: '/resources.js', module: '__resources__' },
    },
    '/resources/video': {
      component: 'PageResourcesVideo',
      bundle: { asset: '/resources.js', module: '__resources__' },
    },
    // TODO: these will be generate automatically eventually – replace later!
    '/workshop': {
      component: 'PageWorkshop',
      bundle: { asset: '/resources.js', module: '__resources__' },
    },
  };

  return routes;
};
