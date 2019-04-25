import ShapeBase from '../ShapeBase/component';

export default class ShapeFeature extends ShapeBase {
  public maskId = Math.random()
    .toString(36)
    .substr(2);

  get backgroundStyle() {
    return this.args.background && `background-image: url(${this.args.background})`;
  }
}
