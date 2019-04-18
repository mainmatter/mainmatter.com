import Component from '@glimmer/component';

export default class ShapeBase extends Component {
  public shapeId = null;

  constructor(options) {
    super(options);

    this.shapeId = Math.random()
      .toString(36)
      .substr(2, 5);
  }

  get shapeStyle() {
    return this.args.color && `--shape-color: ${this.args.color}`;
  }
}
