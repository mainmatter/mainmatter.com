import ShapeBase from '../ShapeBase/component';

export default class ShapeWork extends ShapeBase {
  public maskId = Math.random()
    .toString(36)
    .substr(2);

  get backgroundStyle() {
    return this.args.background && `--shape-color: ${this.args.background}`;
  }
}
