import Component from '@glimmer/component';

export default class LazyPreloadTrigger extends Component {
  private appState: IAppState;

  constructor(options) {
    super(options);

    this.preload();
  }

  private async preload() {
    if (!this.appState.isSSR && 'serviceWorker' in navigator) {
      let { controller, ready } = navigator.serviceWorker;

      await ready;

      if (controller) {
        controller.postMessage({ preload: this.args.bundle });
      }
    }
  }
}
