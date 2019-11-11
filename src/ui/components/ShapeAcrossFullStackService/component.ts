import Component from '@glimmer/component';

export default class ShapeAcrossFullStackService extends Component {
  public key: string;

  constructor(options) {
    super(options);

    this.key = this.args.key || 'acrossFullStackService';
  }
}
