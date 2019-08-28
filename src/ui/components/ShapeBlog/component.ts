import ShapeBase from '../ShapeBase/component';

export default class ShapeBlog extends ShapeBase {
  constructor(options) {
    super(options);

    this.key = this.args.key || 'blog';
    this.maskId = `${this.key}-mask`;
  }
}
