import Component from '@glimmer/component';

const IMAGES = {
  marcoow: '/assets/images/authors/marcoow.jpg',
  msmarhigh: '/assets/images/authors/msmarhigh.jpg',
}

export default class WorkshopCard extends Component {
  get authors() {
    let authors = this.args.authors ? this.args.authors.toLowerCase().split(/\W/) : [];
    return authors.map(a => {
      return {
        image: IMAGES[a]
      };
    });
  }
}
