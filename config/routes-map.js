'use strict';

module.exports = function() {
  let routes = {
    '/': {},
    '/a': { component: 'homepage' },
    '/b': { component: 'services' },
    '/c': { component: 'service' },
    '/d': { component: 'caseStudy' }
  };

  return routes;
};
