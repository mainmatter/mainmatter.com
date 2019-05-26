import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: Simplabs', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<Simplabs />`);

    assert.ok(this.containerElement.querySelector('div'));
  });

  test('it does not render the cookie banner initially', async function(assert) {
    await render(hbs`<Simplabs />`);

    assert.notOk(this.containerElement.textContent.includes('This website uses cookies'));
  });
});
