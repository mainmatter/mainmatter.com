import ShapeBase from '../ShapeBase/component';

export default class ShapeDecorative extends ShapeBase {
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

  get bottomImageStyle() {
    let style = '';

    if (this.args.bottomImage) {
      style += `background-image: url(${this.args.bottomImage})`;
    }

    return style;
  }

  get topImageStyle() {
    let style = '';

    if (this.args.topImage) {
      style += `background-image: url(${this.args.topImage})`;
    }

    return style;
  }
}
