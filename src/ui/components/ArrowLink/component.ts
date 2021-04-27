import Component, { tracked } from '@glimmer/component';

export default class ArrowLink extends Component {
  private appState: IAppState;

  @tracked
  get firstHrefCharacter() {
    let href = this.args.href || '';
    let [firstChar] = href

    return firstChar;
  }

  @tracked
  get isLead() {
    return Object.hasOwnProperty.call(this.args, 'lead') ? this.args.lead : true;
  }

  @tracked
  get isInternal() {
    return Boolean(this.firstHrefCharacter === '/');
  }

  @tracked
  get isIntraDocument() {
    return Boolean(this.firstHrefCharacter === '#');
  }

  @tracked
  get isSimplabs() {
    let href = this.args.href || '';

    return this.isInternal || href.startsWith(this.appState.origin);
  }

  @tracked
  get target() {
    if (!this.isSimplabs && !this.isIntraDocument) {
      return '_blank';
    }
  }

  @tracked
  get rel() {
    if (!this.isSimplabs && !this.isIntraDocument) {
      return 'noopener';
    }
  }
}
