import { classnames } from '@css-blocks/glimmer/dist/cjs/src/helpers/classnames';
import { concat } from '@css-blocks/glimmer/dist/cjs/src/helpers/concat';
import { ComponentManager, setPropertyDidChange } from '@glimmer/component';
import App from './main';

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
    }

    document.querySelectorAll('[data-shoebox]').forEach((shoebox: HTMLElement) => {
      let module = shoebox.dataset.shoeboxBundle;
      registerBundle(module);
    });

    registry.register(
      `utils:/${app.rootName}/lazy-registration/main`,
      LazyRegistration
    );
    registry.registerInjection(
      `component:/${app.rootName}/components/Simplabs`,
      'lazyRegistration',
      `utils:/${app.rootName}/lazy-registration/main`,
    );
  }
});

app.registerInitializer({
  initialize(registry) {
    register(registry, `helper:/${app.rootName}/components/-css-blocks-classnames`, classnames);
    register(registry, `helper:/${app.rootName}/components/-css-blocks-concat`, concat);
  }
});

app.registerInitializer({
  initialize(registry) {
    registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
  }
});

app.renderComponent('Simplabs', containerElement, null);

app.boot();
