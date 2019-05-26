import ShapeBase from '../ShapeBase/component';

export default class ShapeFeature extends ShapeBase {
  public maskId = Math.random()
    .toString(36)
    .substr(2);

  get backgroundStyle() {
    let style = '';

    if (this.args.backgroundImage) {
      style += `background-image: url(${this.args.backgroundImage})`;
    }

    if (this.args.background) {
      style += `;background-color: ${this.args.background}`;
    }

    return style;
  }
}
