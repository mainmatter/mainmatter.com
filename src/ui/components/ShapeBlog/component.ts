import ShapeBase from '../ShapeBase/component';

export default class ShapeBlog extends ShapeBase {
  public key: string;
  public maskId: string;

  constructor(options) {
    super(options);

    this.key = this.args.key || 'blog';
    this.maskId = `${this.key}-mask`;
  }
}
