import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import Pretender from 'pretender';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: FormContact', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender(function() {
      this.get('https://guqdu9qkgf.execute-api.eu-central-1.amazonaws.com/production', request => {
        return [200, {}, ''];
      });
    });
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it renders', async function(assert) {
    await render(hbs`<FormContact />`);

    assert.ok(this.containerElement.querySelector('form'));
  });

  test('it submits', async function(assert) {
    await render(hbs`<PageContact />`);

    this.server.post('https://simplabs-com-contact-form.herokuapp.com/api/send', request => {
      assert.equal(request.method, 'POST');
      assert.equal(request.requestHeaders['Content-Type'], 'application/json');
      assert.deepEqual(JSON.parse(request.requestBody), {
        email: 'email.address@domain.com',
        message: 'The message!',
        name: 'Name',
      });

      return [200, {}, ''];
    });

    // make sure the form is connected to the document so we can submit
    document.querySelector('#app').appendChild(this.containerElement);

    this.containerElement.querySelector('#name').value = 'Name';
    this.containerElement.querySelector('#email').value = 'email.address@domain.com';
    this.containerElement.querySelector('#message').value = 'The message!';
    this.containerElement.querySelector('button[type="submit"]').click();
  });
});
