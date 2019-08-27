import Component from '@glimmer/component';

export default class ShapeAcrossTeamAugmentationService extends Component {
  constructor(options) {
    super(options);

    this.key = this.args.key || 'acrossTeamAugmentationService';
  }
}
