import Component, { tracked } from '@glimmer/component';

export default class FormContact extends Component {
  @tracked
  private isSubmitting: boolean = false;

  private get formState() {
    if (this.isSubmitting) {
      return 'submitting';
    }
  }

  public async submit(e) {
    e.preventDefault();
    this.isSubmitting = true;

    let form = e.target;
    let name = form.querySelector('#name').value;
    let email = form.querySelector('#email').value;
    let message = form.querySelector('#message').value;

    await this.sendMessage(name, email, message);
    this.isSubmitting = false;
  }

  public async sendMessage(name, email, message) {
    let response = await fetch('https://guqdu9qkgf.execute-api.eu-central-1.amazonaws.com/production', {
      body: JSON.stringify({ name, email, message }),
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
    });
  }
}
