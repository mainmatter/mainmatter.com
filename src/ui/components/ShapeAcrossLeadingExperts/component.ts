import Component from '@glimmer/component';

export default class ShapeAcrossLeadingExperts extends Component {
  public key: string;

  constructor(options) {
    super(options);

    this.key = this.args.key || 'acrossLeadingExperts';
  }
}
