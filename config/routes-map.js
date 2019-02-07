'use strict';

module.exports = function() {
  let routes = {
    '/': {},
    '/a': { component: 'ComponentA' },
    '/b': { component: 'ComponentB' },
    '/c': { component: 'ComponentC' }
  };

  return routes;
};
