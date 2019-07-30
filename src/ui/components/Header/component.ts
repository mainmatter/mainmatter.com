import Component from '@glimmer/component';

export default class Header extends Component {
  constructor(options) {
    super(options);

    let pageTitle = this.args.pageTitle === undefined ? this.args.title : this.args.pageTitle;
    this.pageTitle = formatPageTitle(pageTitle);
  }
}

function formatPageTitle(title) {
  return `${title ? `${title} | ` : ''}simplabs`;
}
