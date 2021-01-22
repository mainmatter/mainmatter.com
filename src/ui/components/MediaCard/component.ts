import Component, { tracked } from '@glimmer/component';

export default class MediaCard extends Component {
  private appState: IAppState;

  @tracked
  get firstLinkHrefCharacter() {
    let link = this.args.link || '';
    let [firstChar] = link;

    return firstChar;
  }

  @tracked
  get isInternalLink() {
    return Boolean(this.firstLinkHrefCharacter === '/');
  }

  @tracked
  get isSimplabsLink() {
    let link = this.args.link || '';

    return this.isInternalLink || link.startsWith(this.appState.origin);
  }

  @tracked
  get target() {
    if (!this.isSimplabsLink) {
      return '_blank';
    }
  }

  @tracked
  get rel() {
    if (!this.isSimplabsLink) {
      return 'noopener';
    }
  }
}
