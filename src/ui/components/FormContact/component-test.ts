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

  test('it renders', async function(assert) {
    await render(hbs`<FormContact />`);

    assert.ok(this.containerElement.querySelector('div'));
  });

  test('it submits', async function(assert) {
    await render(hbs`<PageContact />`);

    this.server.post('https://guqdu9qkgf.execute-api.eu-central-1.amazonaws.com/production', request => {
      assert.equal(request.method, 'POST');
      assert.equal(request.requestHeaders['content-type'], 'application/json');
      assert.deepEqual(JSON.parse(request.requestBody), {
        name: 'Name',
        email: 'email.address@domain.com',
        message: 'The message!',
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
