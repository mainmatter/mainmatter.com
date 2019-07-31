import ShapeBase from '../ShapeBase/component';

let maskId = 0;

export default class ShapeFeature extends ShapeBase {
  public maskId = '';

  constructor(options) {
    super(options);

    this.maskId = `feature${++maskId}`;
  }

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
    if (this.args.image) {
      return `background-image: url(${this.args.image})`;
    }
  }
}
