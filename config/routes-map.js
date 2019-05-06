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
    acc[`/blog/authors/${author.twitter}`] = {
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
    '/services': { component: 'PageServices', title: 'Services' },
    '/services/full-stack-engineering': { component: 'PageFullStackEngineering', title: 'Full Stack Engineering' },
    '/services/team-augmentation': { component: 'PageTeamAugmentation', title: 'Team Augmentation' },
    '/services/training': { component: 'PageTraining', title: 'Tutoring' },
    '/cases/trainline': { component: 'PageCaseStudyTrainline', title: 'Trainline Case Study' },
    '/cases/expedition': { component: 'PageCaseStudyExpedition', title: 'Expedition Case Study' },
    '/cases/ddwrt': { component: 'PageCaseDdWrt', title: 'DD-WRT NXT Case Study' },
    '/about': { component: 'PageAbout', title: 'About' },
    '/expertise/ember': { component: 'PageEmberExpertise', title: 'Europe’s leading Ember experts' },
    '/work': { component: 'PageWork', title: 'Work' },
    '/talks': { component: 'PageTalks', title: 'Talks' },
    '/calendar': {
      component: 'Calendar',
      title: 'Calendar',
      bundle: { asset: '/calendar.js', module: '__calendar__' },
    },
    '/playbook': { component: 'PagePlaybook', title: 'Playbook' },
    '/contact': { component: 'PageContact', title: 'Contact' },
    '/blog-by-author': { component: 'PageBlogByAuthor', title: 'Blog by author' },
    '/blog': { component: 'Blog', title: 'Blog', bundle: { asset: '/blog.js', module: '__blog__' } },
  };

  return routes;
};
