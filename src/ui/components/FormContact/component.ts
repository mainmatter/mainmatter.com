import Component, { tracked } from '@glimmer/component';

enum FormState {
  Error = 'error',
  Submitting = 'submitting',
  Success = 'success',
  Waiting = '',
}

const minLength = (length, error?) => ({
  error: () => error || `Please enter at least ${length} characters.`,
  fn: str => str.length >= length,
});

const emailIsh = (error?) => ({
  error: () => error || 'Please enter a valid email address.',
  fn: str => str.match(/.*@.*\..*/),
});

const required = (error?) => ({
  error: () => error || 'Please enter a message.',
  fn: str => (str || '').trim() !== '',
});

export default class FormContact extends Component {
  @tracked
  private formState = FormState.Waiting;

  @tracked
  private errors = {};

  private validators = {
    email: [emailIsh()],
    message: [required()],
    name: [minLength(2)],
  };

  @tracked
  private get isSubmitting(): boolean {
    return this.formState === FormState.Submitting;
  }

  @tracked
  private get isErrored(): boolean {
    return this.formState === FormState.Error;
  }

  @tracked
  private get isSuccess(): boolean {
    return this.formState === FormState.Success;
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
      this.errors = {};

      return;
    }

    this.formState = FormState.Submitting;
    this.errors = {};

    this.errors = this.validateFields([name, email, message]);

    // Stop if validation errors exist
    if (Object.keys(this.errors).reduce((acc, key) => acc + this.errors[key].length, 0) > 0) {
      this.formState = FormState.Waiting;

      return;
    }

    try {
      await this.sendMessage(name.value, email.value, message.value);
    } catch (err) {
      this.formState = FormState.Error;
    }

    this.formState = FormState.Success;
  }

  public validate(event) {
    const errors = this.validateField(event.target);

    this.errors = {
      ...this.errors,
      [event.target.id]: errors.length > 0 ? errors : undefined,
    };
  }

  private async sendMessage(name, email, message) {
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

  private validateField(field) {
    return this.validators[field.id].reduce((acc, validator) => {
      const isValid = validator.fn(field.value);

      if (!isValid) {
        acc.push(validator.error());
      }

      return acc;
    }, []);
  }

  private validateFields(fields) {
    return fields.reduce((errors, field) => ({ ...errors, [field.id]: this.validateField(field) }), {});
  }
}
