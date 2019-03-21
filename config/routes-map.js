'use strict';

module.exports = function() {
  let routes = {
    '/': { component: 'Homepage' },
    '/services': { component: 'Services' },
    '/service': { component: 'Service' },
    '/cases/trainline': { component: 'TrainlineCaseStudy' },
    '/expertise/ember': { component: 'EmberExpertise' },
  };

  return routes;
};
