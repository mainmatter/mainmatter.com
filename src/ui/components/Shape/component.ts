import Component from '@glimmer/component';

export default class Shape extends Component {
  public shapeId = Math.random()
    .toString(36)
    .substr(2, 5);

  public maskId = Math.random()
    .toString(36)
    .substr(2, 5);

  get shapeStyle() {
    return this.args.color && `--shape-color: ${this.args.color}`;
  }

  get backgroundStyle() {
    return this.args.background && `--shape-color: ${this.args.background}`;
  }

  get imageClipStyle() {
    const shouldClip = this.args.clipImage || true;

    if (!shouldClip) {
      return '';
    }

    return `clip-path: url(#${this.maskId});`;
  }

  // I'd prefer to have a (eq ...) template helper for these
  get isBlog() {
    return this.args.type === 'blog';
  }

  get isFeature() {
    return this.args.type === 'feature';
  }

  get isAcross() {
    return this.args.type === 'across';
  }

  get isCenter() {
    return this.args.type === 'center';
  }
}
