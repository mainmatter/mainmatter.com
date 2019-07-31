import { classnames } from '@css-blocks/glimmer/dist/cjs/src/helpers/classnames';
import { concat } from '@css-blocks/glimmer/dist/cjs/src/helpers/concat';
import { ComponentManager, setPropertyDidChange } from '@glimmer/component';
import App from './main';
import HeadTags from './utils/head-tags';
import hash from './utils/helpers/hash';

const containerElement = document.getElementById('app');
const hasSSRBody = !!document.querySelector('[data-has-ssr-response]');
const app = new App({ hasSSRBody: !!hasSSRBody, element: containerElement });

setPropertyDidChange(() => {
  app.scheduleRerender();
});

function register(registry, key: string, object: any) {
  let registryEntries = ((registry as any)._resolver as any).registry._entries;
  if (!registryEntries[key]) {
    registryEntries[key] = object;
  }
}

function readRoutesMap() {
  let script: HTMLElement | null = document.querySelector('[data-shoebox-routes]');
  if (script) {
    return JSON.parse(script.innerText);
  } else {
    return {};
  }
}

app.registerInitializer({
  initialize(registry) {
    function registerBundle(module) {
      let content = window[module] || {};
      Object.keys(content).forEach((key) => {
        register(registry, key, content[key]);
      });
    }

    class LazyRegistration {
      public static create() {
        return new LazyRegistration();
      }

      public registerBundle(module) {
        registerBundle(module);
      }

    // tslint:disable-next-line:max-classes-per-file
    class AppState {

      public static create() {
        return new AppState();
      }

      public isSSR: boolean;
      public route: string;
      public origin: string;
      public routesMap: IRoutesMap;

      constructor() {
        this.isSSR = false;
        this.route = window.location.pathname;
        this.origin = window.location.origin;
        this.routesMap = readRoutesMap();
      }
    }

    document.querySelectorAll('[data-shoebox]').forEach((shoebox: HTMLElement) => {
      let module = shoebox.dataset.shoeboxBundle;
      registerBundle(module);
    });

    registerBundle('__recent__');

    registry.register(
      `utils:/${app.rootName}/lazy-registration/main`,
      LazyRegistration
    );
    registry.registerInjection(
      `component:/${app.rootName}/components/Simplabs`,
      'lazyRegistration',
      `utils:/${app.rootName}/lazy-registration/main`,
    );

    registry.register(
      `utils:/${app.appName}/head-tags/main`,
      HeadTags
    );
    registry.registerInjection(
      `component`,
      'headTags',
      `utils:/${app.appName}/head-tags/main`,
    );

    registry.register(
      `app-state:/${app.appName}/main/main`,
      AppState
    );
    registry.registerInjection(
      `component`,
      'appState',
      `app-state:/${app.appName}/main/main`
    );
  }
});

app.registerInitializer({
  initialize(registry) {
    register(registry, `helper:/${app.rootName}/components/-css-blocks-classnames`, classnames);
    register(registry, `helper:/${app.rootName}/components/-css-blocks-concat`, concat);
    register(registry, `helper:/${app.rootName}/components/hash`, hash);
  }
});

app.registerInitializer({
  initialize(registry) {
    registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
  }
});

app.renderComponent('Simplabs', containerElement, null);

app.boot();
