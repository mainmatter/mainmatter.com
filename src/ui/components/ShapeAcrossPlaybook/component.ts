import Component from '@glimmer/component';

export default class ShapeAcrossPlaybook extends Component {
  constructor(options) {
    super(options);

    this.key = this.args.key || 'acrossPlaybook';
  }
}
