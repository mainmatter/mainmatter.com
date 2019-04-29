import Component from '@glimmer/component';

export default class ArrowLink extends Component {
  get isInternal() {
    const href = this.args.href || '';

    return href.substring(0, 1) === '/' || href.match(/^https?:\/\/simplabs.com/);
  }
}
