import Component, { tracked } from '@glimmer/component';
import { getOwner } from '@glimmer/di';
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
      let { component, bundle } = this.routesMap[path];
      let options = {};
      if (bundle) {
        options.before = async (done) => {
          await this._loadBundle(bundle);
          this._registerContent(bundle);
          done();
        };
      }
      this.router.on(path, () => this.activeComponent = component, options);
    });
    this.router.resolve(this.appState.route);
  }

  private _bindInternalLinks() {
    if (!this.appState.isSSR) {
      document.addEventListener('click', async (event: Event) => {
        let target = event.target as HTMLElement;
      
        if (target.tagName === 'A' && target.dataset.internal !== undefined) {
          event.preventDefault();
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

  private _registerContent(bundle) {
    let content = window[`__${bundle}__`] || {};
    Object.keys(content).forEach((key) => {
      window.__lazyRegister__(key, content[key])
    });
  }
}
