import ShapeBase from '../ShapeBase/component';

let maskId = 0;

export default class ShapeBold extends ShapeBase {
  public maskId = '';

  constructor(options) {
    super(options);

    this.maskId = `bold${++maskId}`;
  }

  get shapeStyle() {
    let style = '';

    if (this.args.backgroundA) {
      style += `--shape-color-a: ${this.args.backgroundA};`;
    }

    if (this.args.backgroundB) {
      style += `--shape-color-b: ${this.args.backgroundB};`;
    }

    return style;
  }
}
