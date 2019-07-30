import Component from '@glimmer/component';

export default class HeadTag extends Component {
  constructor(options) {
    super(options);

    this.setMetaTags();
  }

  public willDestroy() {
    this.headTags.remove(this.args.name, this.args.keys);
  }

  private setMetaTags() {
    this.headTags.write(this.args.name, this.args.keys, this.args.values, this.args.content);
  }
}
