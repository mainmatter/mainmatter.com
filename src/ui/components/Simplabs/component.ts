import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';
import HeadTags from '../../../utils/head-tags';

interface INavigoHooks {
  before?: (done: () => void) => void;
  after?: () => void;
  already?: () => void;
}

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    Sentry: any;
    ga: any;
  }
}

interface IRoutesMap {
  [route: string]: {
    component: string;
    bundle: any;
    parentBundle: any;
  };
}

export default class Simplabs extends Component {
  private router: Navigo;

  private appState: IAppState;

  private lazyRegistration: ILazyRegistration;

  private document: HTMLDocument;

  private currentLink: HTMLAnchorElement = null;

  private loadingProgressInterval: number;

  @tracked
  private activeComponent: string = null;

  @tracked
  private isLoading: boolean = false;

  @tracked
  private loadingProgress: number = 0;

  private headTags: HeadTags;

  constructor(options) {
    super(options);

    this._setupRouting();
    this._bindInternalLinks();
    this._restoreActiveComponentState();
  }

  private _setupRouting() {
    this.router = new Navigo(this.appState.origin);

    Object.keys(this.appState.routesMap).forEach(path => {
      let { component, bundle, parentBundle } = (this.appState.routesMap as IRoutesMap)[path];
      let options: INavigoHooks = {
        after: () => {
          this._setCanonicalUrl(path);
          this._scrollToSuitableOffset();
          this.currentLink = null;
        },
        already: () => {
          this._scrollToSuitableOffset();
        },
      };
      if (bundle && !this.appState.isSSR) {
        options.before = async done => {
          try {
            await this._loadBundle(bundle, parentBundle);
            this._registerBundle(bundle);
            done();
          } catch (e) {
            if (window.Sentry) {
              window.Sentry.captureException(e);
            }

            window.location.href = path;
          }
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
          } else {
            trackPageView(path);
          }
        },
        options,
      );
    });

    this.router.notFound(() => (this.activeComponent = 'Page404'));

    this.router.resolve(this.appState.route);
  }

  private _bindInternalLinks() {
    if (!this.appState.isSSR) {
      document.addEventListener('click', (event: Event) => {
        if (isSimpleClick(event)) {
          let target = event.target as HTMLElement;
          let link = findLinkParent(target);

          if (link && link.dataset.internal !== undefined) {
            event.preventDefault();
            this.currentLink = link;
            this.router.navigate(link.getAttribute('href'));
          }
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
    this.loadingProgress = 0;
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

  private _setCanonicalUrl(path) {
    // Ensure trailing slash
    if (!path.endsWith('/')) {
      path = `${path}/`;
    }

    path = `${this.appState.origin}${path}`;

    this.headTags.write(
      'meta',
      {
        property: 'og:url',
      },
      {
        content: path,
      },
    );

    // Canonical urls are required by search engines to define what represents
    // the one true URL of a page, which should exclude query params, anchors, …
    this.headTags.write(
      'link',
      {
        rel: 'canonical',
      },
      {
        href: path,
      },
    );
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

  private _scrollToSuitableOffset() {
    if (!this.appState.isSSR && this.currentLink) {
      let { hash } = window.location;
      let element;
      if (hash) {
        element = document.querySelector(hash);
      }
      if (element) {
        element.scrollIntoView();
      } else {
        window.setTimeout(() => window.scrollTo(0, 0));
      }
    }
  }
}

function trackPageView(route) {
  if (window.ga) {
    window.ga('set', 'page', route);
    window.ga('send', 'pageview');
  }
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

// taken from https://github.com/emberjs/ember.js/blob/8b273eb04023a876dbf968a05929d8a21a8fd27b/packages/%40ember/-internals/views/lib/system/utils.js#L9-L14
export function isSimpleClick(event) {
  let modifier = event.shiftKey || event.metaKey || event.altKey || event.ctrlKey;
  let secondaryClick = event.which > 1; // IE9 may return undefined

  return !modifier && !secondaryClick;
}
