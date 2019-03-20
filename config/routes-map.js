'use strict';

module.exports = function() {
  let routes = {
    '/': { component: 'Homepage' },
    '/services': { component: 'Services' },
    '/service': { component: 'Service' },
    '/case-study': { component: 'CaseStudy' },
    '/expertise/ember': { component: 'EmberExpertise' },
  };

  return routes;
};
