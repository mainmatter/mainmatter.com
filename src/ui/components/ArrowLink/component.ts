import Component, { tracked } from '@glimmer/component';

export default class ArrowLink extends Component {
  @tracked
  get isInternal() {
    let href = this.args.href || '';

    return Boolean(href.substring(0, 1) === '/');
  }

  @tracked
  get isSimplabs() {
    let href = this.args.href || '';

    return this.isInternal || href.match(/^https?:\/\/simplabs.com/));
  }

  @tracked
  get target() {
    if (!this.isSimplabs) {
      return '_blank';
    }
  }

  @tracked
  get rel() {
    if (!this.isSimplabs) {
      return 'noopener';
    }
  }
}
