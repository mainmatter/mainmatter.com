import ShapeBase from '../ShapeBase/component';

export default class ShapeAcross extends ShapeBase {
  public maskId = '';

  constructor(options) {
    super(options);

    this.key = this.args.key || 'across';
    this.maskId = `${this.key}-mask`;
  }

  get backgroundStyle() {
    if (this.args.background) {
      return `--shape-color: ${this.args.background}`;
    }
  }
}
