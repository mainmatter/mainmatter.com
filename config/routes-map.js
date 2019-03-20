'use strict';

module.exports = function() {
  let routes = {
    '/': { component: 'Homepage' },
    '/services': { component: 'Services' },
    '/service': { component: 'Service' },
    '/case-study': { component: 'CaseStudy' },
    '/expertise': { component: 'Expertise' },
    '/about': { component: 'About' },
    '/work': { component: 'Work' },
    '/talks': { component: 'Talks' },
    '/calendar': { component: 'Calendar' },
    '/playbook': { component: 'Playbook' },
    '/contact': { component: 'Contact' },
  };

  return routes;
};
