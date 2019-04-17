import Component, { tracked } from '@glimmer/component';

export default class Loader extends Component {
  @tracked
  get translation() {
    return 100 - this.args.progress;
  }
}
