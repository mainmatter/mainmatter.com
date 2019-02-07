import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';

interface IRoutesMap {
  [route: string]: {
    component: string;
  };
}

declare const __ROUTES_MAP__: IRoutesMap;

export default class Simplabs extends Component {
  private router: Navigo;

  private routesMap: IRoutesMap = __ROUTES_MAP__;

  @tracked
  private activeComponent: string;

  constructor(options) {
    super(options);

    this._setupRouting();
    this._bindInternalLinks();
  }

  private _setupRouting() {
    this.router = new Navigo(window.location.origin);

    Object.keys(this.routesMap).forEach((path) => {
      let { component } = this.routesMap[path];
      this.router.on(path, () => this.activeComponent = component);
    });
    this.router.resolve(window.location.pathname);

    //expose router globally to allow prerenderer to navigate
    window.__router__ = this.router;
  }

  private _bindInternalLinks() {
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.tagName === 'A' && target.dataset.navigo !== undefined) {
        event.preventDefault();
        this.router.navigate(target.getAttribute('href'));
      }
    });
  }
}
