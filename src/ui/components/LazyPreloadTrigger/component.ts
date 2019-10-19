import Component from '@glimmer/component';

export default class LazyPreloadTrigger extends Component {
  private appState: IAppState;

  constructor(options) {
    super(options);

    this.preload();
  }

  private preload() {
    if (!this.appState.isSSR && 'serviceWorker' in navigator) {
      let { controller: serviceWorkerController } = navigator.serviceWorker;

      if (serviceWorkerController) {
        serviceWorkerController.postMessage({ preload: this.args.bundle });
      }
    }
  }
}
