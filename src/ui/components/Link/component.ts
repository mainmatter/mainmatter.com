import Component, { tracked } from '@glimmer/component';

export default class Link extends Component {
  get hasArrow() {
    return !!this.args.arrow;
  }

  get isInternal() {
    const href = this.args.href || '';

    return (href.substring(0, 1) === '/' || href.match(/^https?:\/\/simplabs.com/))
  }
}
