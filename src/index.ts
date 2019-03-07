import { ComponentManager, setPropertyDidChange } from '@glimmer/component';
import App from './main';

const containerElement = document.getElementById('app');
const hasSSRBody = document.querySelector('[data-has-ssr-response]');
const app = new App({ hasSSRBody });

setPropertyDidChange(() => {
  app.scheduleRerender();
});

app.registerInitializer({
  initialize(registry) {
    registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
  }
});

app.renderComponent('Simplabs', containerElement, null);

app.boot();
