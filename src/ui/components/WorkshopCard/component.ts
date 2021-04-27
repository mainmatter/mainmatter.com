import Component from '@glimmer/component';

const BREAK_MARKER = '<!--break-->';

export default class WorkshopCard extends Component {
  get labelLines() {
    return this.args.label.split(BREAK_MARKER);
  }

  get leads() {
    return this.args.leads ? this.args.leads.toLowerCase().split(/\s*,\s*/) : [];
  }
}
