import ShapeBase from '../ShapeBase/component';

export default class ShapeAcross extends ShapeBase {
  public maskId = null;

  constructor(options) {
    super(options);

    this.maskId = Math.random()
      .toString(36)
      .substr(2);
  }

  get backgroundStyle() {
    if (this.args.background) {
      return `--shape-color: ${this.args.background}`;
    }
  }
}
