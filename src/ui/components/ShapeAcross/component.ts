import ShapeBase from '../ShapeBase/component';

let maskId = 0;

export default class ShapeAcross extends ShapeBase {
  public maskId = '';

  constructor(options) {
    super(options);

    this.maskId = `across${++maskId}`;
  }

  get backgroundStyle() {
    if (this.args.background) {
      return `--shape-color: ${this.args.background}`;
    }
  }
}
