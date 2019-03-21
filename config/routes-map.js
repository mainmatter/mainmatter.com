'use strict';

module.exports = function() {
  let routes = {
    '/': { component: 'Homepage' },
    '/services': { component: 'Services' },
    '/service': { component: 'Service' },
    '/cases/trainline': { component: 'TrainlineCaseStudy' },
    '/about': { component: 'About' },
    '/expertise/ember': { component: 'EmberExpertise' },
    '/work': { component: 'Work' },
    '/talks': { component: 'Talks' },
    '/calendar': { component: 'Calendar' },
    '/playbook': { component: 'Playbook' },
    '/contact': { component: 'Contact' },
  };

  return routes;
};
