import Component from '@glimmer/component';

export default class HeadTag extends Component {
  private appState: IAppState;

  constructor(options) {
    super(options);

    if (this.appState.isSSR) {
      this.setMetaTags();
    } else {
      // when changing routes, the willDestroy of a component previously in the DOM
      // will be called *after* the constructor of one rendered *after* the route
      // change, so we have to delay writing the tag…
      window.setTimeout(() => this.setMetaTags());
    }
  }

  public willDestroy() {
    this.headTags.remove(this.args.name, this.args.keys);
  }

  private setMetaTags() {
    this.headTags.write(this.args.name, this.args.keys, this.args.values, this.args.content);
  }
}
