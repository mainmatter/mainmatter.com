import ShapeBase from '../ShapeBase/component';

export default class ShapeAcross extends ShapeBase {
  get backgroundStyle() {
    return this.args.background && `--shape-color: ${this.args.background}`;
  }
}
