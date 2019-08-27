import ShapeBase from '../ShapeBase/component';

export default class ShapeWork extends ShapeBase {
  public maskId = '';

  constructor(options) {
    super(options);

    this.key = this.args.key || 'work';
    this.maskId = `${this.key}-mask`;
  }

  get backgroundStyle() {
    return this.args.background && `--shape-color: ${this.args.background}`;
  }
}
