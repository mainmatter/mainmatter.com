import ShapeBase from '../ShapeBase/component';

export default class ShapeBold extends ShapeBase {
  public maskId = Math.random()
    .toString(36)
    .substr(2);

  get shapeStyle() {
    let style = new Map();

    if (this.args.backgroundA) {
      style.set('--shape-color-a', this.args.backgroundA);
    }

    if (this.args.backgroundB) {
      style.set('--shape-color-b', this.args.backgroundB);
    }

    return [...style.entries()].map(([key, value]) => `${key}:${value}`).join(';');
  }
}
