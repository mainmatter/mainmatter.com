import ShapeBase from '../ShapeBase/component';

export default class ShapeAcross extends ShapeBase {
  maskId = null;
  flatShapeId = null;

  constructor(options) {
    super(options);

    this.maskId = Math.random()
      .toString(36)
      .substr(2);

    this.flatShapeId = Math.random()
      .toString(36)
      .substr(2);
  }

  get backgroundStyle() {
    let style = '';

    if (this.args.background) {
      style += `--shape-color: ${this.args.background}`;
    }

    return style;
  }
}
