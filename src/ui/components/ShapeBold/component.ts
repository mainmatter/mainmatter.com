import ShapeBase from '../ShapeBase/component';

export default class ShapeBold extends ShapeBase {
  public maskId = Math.random()
    .toString(36)
    .substr(2);

  get shapeStyle() {
    let style = '';

    if (this.args.backgroundA) {
      style += `--shape-color-a: ${this.args.backgroundA};`
    }

    if (this.args.backgroundB) {
      style += `--shape-color-b: ${this.args.backgroundB};`
    }

    return style;
  }
}
