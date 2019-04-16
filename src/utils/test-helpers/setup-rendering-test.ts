import { classnames } from '@css-blocks/glimmer/dist/cjs/src/helpers/classnames';
import { setupRenderingTest as originalSetupRenderingTest } from '@glimmer/test-helpers';

export const setupRenderingTest = function(hooks) {
  originalSetupRenderingTest(hooks);

  hooks.beforeEach(function beforeEach() {
    this.app.registerInitializer({
      initialize(registry) {
        registry._resolver.registry._entries[
          `helper:/glimmer-pdp-viewer/components/-css-blocks-classnames`
        ] = classnames;
      }
    });
  });
};
