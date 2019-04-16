import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';

interface IRoutesMap {
  [route: string]: {
    component: string;
  };
}

declare const __ROUTES_MAP__: IRoutesMap;

const BUNDLES = {
  blog: '/blog.js'
};

export default class Simplabs extends Component {
  private router: Navigo;

  private routesMap: IRoutesMap = __ROUTES_MAP__;

  private appState: IAppState;

  @tracked
  private activeComponent: string;

  constructor(options) {
    super(options);

    this.appState = this.appState || {
      isSSR: false,
      origin: window.location.origin,
      route: window.location.pathname
    };

    this._setupRouting();
    this._bindInternalLinks();
  }

  private _setupRouting() {
    this.router = new Navigo(this.appState.origin);

    Object.keys(this.routesMap).forEach((path) => {
      let { component } = this.routesMap[path];
      this.router.on(path, () => this.activeComponent = component);
    });
    this.router.resolve(this.appState.route);
  }

  private _bindInternalLinks() {
    if (!this.appState.isSSR) {
      document.addEventListener('click', async (event: Event) => {
        let target = event.target as HTMLElement;
      
        if (target.tagName === 'A' && target.dataset.internal !== undefined) {
          event.preventDefault();

          if (target.dataset.bundle !== undefined) {
            await this._loadBundle(target.dataset.bundle);
          }
          this.router.navigate(target.getAttribute('href'));
        }
      });
    }
  }

  private async _loadBundle(bundle) {
    await new Promise((resolve, reject) => {
      let source = BUNDLES[bundle];
      if (document.querySelector(`script[src="${source}"]`)) {
        return resolve();
      }

      let script = document.createElement('script');
      script.onload = resolve;
      script.onerror = function(error) {
        if (this.parentNode) {
          this.parentNode.removeChild(this);
        }
        reject(error);
      };
      script.src = source;
      script.async = false;
      
      document.head.appendChild(script);
    });
  }
}
