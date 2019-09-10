import Component from '@glimmer/component';

export default class LazyPreloadTrigger extends Component {
  constructor(options) {
    super(options);

    this.preload();
  }

  private preload() {
    let { controller: serviceWorkerController } = navigator.serviceWorker;
    if (serviceWorkerController) {
      serviceWorkerController.postMessage({ preload: this.args.bundle });
    }
  }
}
