import Component, { tracked } from '@glimmer/component';

export default class ArrowLink extends Component {
  @tracked
  get isInternal() {
    const href = this.args.href || '';

    return Boolean(href.substring(0, 1) === '/' || href.match(/^https?:\/\/simplabs.com/));
  }

  @tracked
  get target() {
    if (!this.isInternal) {
      return '_blank';
    }
  }

  @tracked
  get rel() {
    if (!this.isInternal) {
      return 'noopener';
    }
  }
}
