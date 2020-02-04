import Component, { tracked } from '@glimmer/component';

const photos = {
  'chris': '/assets/images/photos/chris@604.png',
  'ghislaine': '/assets/images/photos/ghislaine@604.png',
  'marco': '/assets/images/photos/marco@604.png',
};

export default class WorkWithUs extends Component {
  @tracked
  get teamMemberName() {
    if (!this.args.teamMember || !photos.hasOwnProperty(this.args.teamMember)) {
      return 'marco';
    }

    return this.args.teamMember;
  }

  @tracked
  get capitalizedTeamMemberName() {
    let [firstLetter, ...rest] = this.teamMemberName;
    return [firstLetter.toUpperCase(), ...rest].join('');
  }

  @tracked
  get teamMemberPhoto() {
    return photos[this.teamMemberName];
  }
}
