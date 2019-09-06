import ShapeBase from '../ShapeBase/component';

export default class ShapeBold extends ShapeBase {
  public maskId: string = '';

  constructor(options) {
    super(options);

    this.key = this.args.key || 'bold';
    this.maskId = `${this.key}-mask`;
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
