import Component, { tracked } from '@glimmer/component';

enum FormState {
  Error = 'error',
  Submitting = 'submitting',
  Success = 'success',
  Waiting = '',
}

export default class FormContact extends Component {
  @tracked
  private formState = FormState.Waiting;

  @tracked
  private get isSubmitting(): boolean {
    return this.formState === FormState.Submitting;
  }

  @tracked
  private get isSuccess(): boolean {
    return this.formState === FormState.Success;
  }

  @tracked
  private get isErrored(): boolean {
    return this.formState === FormState.Error;
  }

  public async submit(e) {
    e.preventDefault();

    let form = e.target;
    let name = form.querySelector('#name');
    let email = form.querySelector('#email');
    let message = form.querySelector('#message');

    if (this.formState === FormState.Success) {
      form.reset();

      this.formState = FormState.Waiting;

      return;
    }

    this.formState = FormState.Submitting;

    try {
      let response = await this.sendMessage(name.value, email.value, message.value);
      if (response.ok) {
        this.formState = FormState.Success;
      } else {
        this.formState = FormState.Error;
      }
      const { plausible } = window as any;
      if (plausible) {
        plausible('Contact');
      }
    } catch (err) {
      this.formState = FormState.Error;
    }
  }

  private async sendMessage(name, email, message) {
    return fetch('https://simplabs-com-contact-form.herokuapp.com/api/send', {
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
