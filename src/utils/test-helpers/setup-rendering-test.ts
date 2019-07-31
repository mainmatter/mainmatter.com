import { classnames } from '@css-blocks/glimmer/dist/cjs/src/helpers/classnames';
import { concat } from '@css-blocks/glimmer/dist/cjs/src/helpers/concat';
import { setupRenderingTest as originalSetupRenderingTest } from '@glimmer/test-helpers';
import hash from '../helpers/hash';
import HeadTags from '../head-tags';

class TestAppState {

  public static create() {
    return new TestAppState();
  }

  public isSSR: boolean;
  public route: string;
  public origin: string;
  public routesMap: IRoutesMap;

  constructor() {
    this.isSSR = false;
    this.route = window.location.pathname;
    this.origin = window.location.origin;
    this.routesMap = {};
  }
}

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

        registry._resolver.registry._entries[
          `helper:/${rootName}/components/hash`
        ] = hash;

        registry.register(
          `app-state:/${rootName}/main/main`,
          TestAppState
        );
        registry.registerInjection(
          `component`,
          'appState',
          `app-state:/${rootName}/main/main`
        );

        registry.register(
          `utils:/${rootName}/head-tags/main`,
          HeadTags
        );
        registry.registerInjection(
          `component`,
          'headTags',
          `utils:/${rootName}/head-tags/main`,
        );
      }
    });
  });
};
