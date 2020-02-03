import Component, { tracked } from '@glimmer/component';

const photos = {
  "marco": "/assets/images/photos/marco@604.png 604w, /assets/images/photos/marco@1208.png 1208w",
  "chris": "/assets/images/photos/chris@604.png 604w, /assets/images/photos/chris@1208.png 1208w",
  "ghislaine": "/assets/images/photos/ghislaine@604.png 604w, /assets/images/photos/ghislaine@1208.png 1208w",
};

export default class WorkWithUs extends Component {
  @tracked
  get teamMemberName() {
    if (!photos.hasOwnProperty(this.args.teamMember) || !this.args.teamMember) {
      return "marco";
    }

    return this.args.teamMember;
  }

  @tracked
  get teamMemberPhoto() {
    return photos[this.teamMemberName];
  }
}
