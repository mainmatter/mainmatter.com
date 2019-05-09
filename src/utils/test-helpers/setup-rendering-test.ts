import { classnames } from '@css-blocks/glimmer/dist/cjs/src/helpers/classnames';
import { concat } from '@css-blocks/glimmer/dist/cjs/src/helpers/concat';
import { setupRenderingTest as originalSetupRenderingTest } from '@glimmer/test-helpers';

export const setupRenderingTest = function(hooks) {
  originalSetupRenderingTest(hooks);

  hooks.beforeEach(function beforeEach() {
    let rootName = this.app.rootName;
    this.app.registerInitializer({
      initialize(registry) {
        registry._resolver.registry._entries[
          `helper:/${rootName}/components/-css-blocks-classnames`
        ] = classnames;
        registry._resolver.registry._entries[
          `helper:/${rootName}/components/-css-blocks-concat`
        ] = concat;
      }
    });
  });
};
