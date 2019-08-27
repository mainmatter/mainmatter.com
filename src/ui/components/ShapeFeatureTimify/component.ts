import Component from '@glimmer/component';

export default class ShapeFeatureTimify extends Component {
  constructor(options) {
    super(options);

    this.key = this.args.key || 'featureTimify';
  }
}
