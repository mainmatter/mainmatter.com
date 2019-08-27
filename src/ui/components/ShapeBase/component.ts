import Component from '@glimmer/component';

export default class ShapeBase extends Component {
  get shapeId() {
    return `${this.key}-shape`;
  }

  get shapeStyle() {
    return this.args.color && `--shape-color: ${this.args.color}`;
  }
}
