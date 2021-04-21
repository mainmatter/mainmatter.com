import Component from '@glimmer/component';

const BREAK_MARKER = '<!--break-->';

export default class CallToAction extends Component {
  get textLines() {
    return this.args.text.split(BREAK_MARKER);
  }
}
