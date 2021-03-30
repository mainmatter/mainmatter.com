import Component from '@glimmer/component';

export default class WorkshopCard extends Component {
  get leads() {
    return this.args.leads ? this.args.leads.toLowerCase().split(/\s*,\s*/) : [];
  }
}
