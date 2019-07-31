import Component from '@glimmer/component';

let shapeId = 0;

export default class ShapeBase extends Component {
  public shapeId = '';

  constructor(options) {
    super(options);

    this.shapeId = `base${++shapeId}`;
  }

  get shapeStyle() {
    return this.args.color && `--shape-color: ${this.args.color}`;
  }
}
