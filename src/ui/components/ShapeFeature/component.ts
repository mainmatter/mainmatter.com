import ShapeBase from '../ShapeBase/component';

export default class ShapeFeature extends ShapeBase {
  public maskId = '';

  constructor(options) {
    super(options);

    this.key = this.args.key || 'feature';
    this.maskId = `${this.key}-mask`;
  }

  get backgroundStyle() {
    if (this.args.background) {
      return `;fill: ${this.args.background}`;
    }

    return '';
  }
}
