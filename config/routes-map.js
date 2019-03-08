'use strict';

module.exports = function() {
  let routes = {
    '/': {},
    '/a': { component: 'Homepage' },
    '/b': { component: 'Services' },
    '/c': { component: 'Service' },
    '/d': { component: 'CaseStudy' },
    '/e': { component: 'Expertise' },
  };

  return routes;
};
