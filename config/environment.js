'use strict';

const moduleConfiguration = {
  types: {
    application: { definitiveCollection: 'main' },
    component: { definitiveCollection: 'components' },
    'component-test': { unresolvable: true },
    helper: { definitiveCollection: 'components' },
    'helper-test': { unresolvable: true },
    renderer: { definitiveCollection: 'main' },
    template: { definitiveCollection: 'components' },
    service: { definitiveCollection: 'services' }
  },
  collections: {
    main: {
      types: ['application', 'renderer']
    },
    components: {
      group: 'ui',
      types: ['component', 'component-test', 'template', 'helper', 'helper-test'],
      defaultType: 'component',
      privateCollections: ['utils']
    },
    styles: {
      group: 'ui',
      unresolvable: true
    },
    utils: {
      unresolvable: true
    },
    services: {
      types: ['service'],
      defaultType: 'service',
      privateCollections: ['utils']
    }
  }
};

module.exports = function(environment) {
  let ENV = {
    environment,
    modulePrefix: 'simplabs',
    moduleConfiguration
  };

  return ENV;
};
