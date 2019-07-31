import ShapeBase from '../ShapeBase/component';

let maskId = 0;

export default class ShapeWork extends ShapeBase {
  public maskId = '';

  constructor(options) {
    super(options);

    this.maskId = `work${++maskId}`;
  }

  get backgroundStyle() {
    return this.args.background && `--shape-color: ${this.args.background}`;
  }
}
