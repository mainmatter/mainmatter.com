'use strict';

module.exports = function() {
  let routes = {
    '/': { component: 'Homepage' },
    '/services': { component: 'Services' },
    '/services/software-engineering': { component: 'SoftwareEngineering' },
    '/cases/trainline': { component: 'TrainlineCaseStudy' },
    '/cases/expedition': { component: 'ExpeditionCaseStudy' },
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
