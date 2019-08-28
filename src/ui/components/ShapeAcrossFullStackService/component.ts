import Component from '@glimmer/component';

export default class ShapeAcrossFullStackService extends Component {
  constructor(options) {
    super(options);

    this.key = this.args.key || 'acrossFullStackService';
  }
}
