import Component from '@glimmer/component';

export default class WorkshopCard extends Component {
  get authors() {
    let authors = this.args.authors ? this.args.authors.toLowerCase().split(/\W/) : [];
    return authors.map(a => {
      return {
        name: a
      };
    });
  }
}
