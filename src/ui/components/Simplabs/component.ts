import Component, { tracked } from '@glimmer/component';
import { getOwner } from '@glimmer/di';
import Navigo from 'navigo';

interface IRoutesMap {
  [route: string]: {
    component: string;
    title: string;
    bundle: string;
    parentBundle: string;
  };
}

interface INavigoHooks {
  before?: (done: () => void) => void;
  after?: () => void;
}

declare const __ROUTES_MAP__: IRoutesMap;

export default class Simplabs extends Component {
  private router: Navigo;

  private routesMap: IRoutesMap = __ROUTES_MAP__;

  private appState: IAppState;

  private lazyRegistration: ILazyRegistration;

  private document: HTMLDocument;

  private loadingProgressInterval: number;

  @tracked
  private activeComponent: string = null;

  @tracked
  private isLoading: boolean = false;

  @tracked
  private loadingProgress: number = 0;

  constructor(options) {
    super(options);

    this.appState = this.appState || {
      isSSR: false,
      origin: window.location.origin,
      route: window.location.pathname,
    };

    this._setupRouting();
    this._bindInternalLinks();
    this._restoreActiveComponentState();
  }

  private _setupRouting() {
    this.router = new Navigo(this.appState.origin);

    Object.keys(this.routesMap).forEach(path => {
      let { component, title = '', bundle, parentBundle } = this.routesMap[path];
      let options: INavigoHooks = {
        after: () => this._setPageTitle(title),
      };
      if (bundle && !this.appState.isSSR) {
        options.before = async done => {
          await this._loadBundle(bundle, parentBundle);
          this._registerBundle(bundle);
          done();
        };
      }
      this.router.on(
        path,
        () => {
          this.activeComponent = component;
          if (this.appState.isSSR) {
            if (bundle) {
              this._injectBundle(bundle);
            }
            this._injectActiveComponentState();
          }
        },
        options,
      );
    });
    this.router.resolve(this.appState.route);
  }

  private _bindInternalLinks() {
    if (!this.appState.isSSR) {
      document.addEventListener('click', (event: Event) => {
        let target = event.target as HTMLElement;
        let link = findLinkParent(target);

        if (link && link.dataset.internal !== undefined) {
          event.preventDefault();
          this.router.navigate(target.getAttribute('href'));
          window.scrollTo(0, 0);
        }
      });
    }
  }

  private async _loadBundle(bundle, parentBundle) {
    await new Promise((resolve, reject) => {
      if (
        document.querySelector(`script[src="${bundle.asset}"]`) ||
        (parentBundle && document.querySelector(`script[src="${parentBundle.asset}"]`))
      ) {
        return resolve();
      }

      let script = document.createElement('script');
      script.onload = () => {
        this._stopLoader();
        resolve();
      };
      script.onerror = function(error) {
        if (this.parentNode) {
          this.parentNode.removeChild(this);
        }
        reject(error);
      };
      script.src = bundle.asset;
      script.async = false;
      document.head.appendChild(script);
      this._startLoader();
    });
  }

  private _registerBundle(bundle) {
    this.lazyRegistration.registerBundle(bundle.module);
  }

  private _startLoader() {
    this.isLoading = true;
    this.loadingProgressInterval = window.setInterval(
      () => (this.loadingProgress = Math.min(this.loadingProgress + 10, 100)),
      150,
    );
  }

  private _stopLoader() {
    window.clearInterval(this.loadingProgressInterval);
    this.loadingProgress = 100;
    window.setTimeout(() => (this.isLoading = false), 150);
  }

  private _injectBundle(bundle) {
    let script = this.document.createElement('script');
    script.setAttribute('src', bundle.asset);
    script.setAttribute('data-shoebox', 'true');
    script.setAttribute('data-shoebox-bundle', bundle.module);
    this.document.body.appendChild(script);
  }

  private _setPageTitle(title) {
    if (this.appState.isSSR) {
      this.document.title = formatPageTitle(title);
    } else {
      document.title = formatPageTitle(title);
    }
  }

  private _injectActiveComponentState() {
    let script = this.document.createElement('script');
    script.setAttribute('data-shoebox', 'true');
    script.setAttribute('data-shoebox-active-component', this.activeComponent);
    this.document.body.appendChild(script);
  }

  private _restoreActiveComponentState() {
    if (!this.appState.isSSR) {
      let script = document.querySelector('[data-shoebox-active-component]') as HTMLElement;
      if (script) {
        this.activeComponent = script.dataset.shoeboxActiveComponent;
      }
    }
  }
}

function formatPageTitle(title) {
  return `${title ? `${title} | ` : ''}simplabs`;
}

function findLinkParent(target) {
  let element = target;
  while (element && element !== document) {
    if (element.matches('a')) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}
