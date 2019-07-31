import Component from '@glimmer/component';

export default class Header extends Component {
  constructor(options) {
    super(options);

    let documentTitle = this.args.documentTitle === undefined ? this.args.title : this.args.documentTitle;
    this.documentTitle = formatformatDocumentTitle(documentTitle);
  }
}

function formatformatDocumentTitle(title) {
  return `${title ? `${title} | ` : ''}simplabs`;
}
