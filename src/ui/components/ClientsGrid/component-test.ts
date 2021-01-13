import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: ClientsGrid', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ClientsGrid />`);

    assert.ok(this.containerElement.querySelector('div'));
  });

  test('it preserves the order of the specified clients', async function(assert) {
    await render(hbs`<ClientsGrid @only="erdil,loconet" />`);

    assert.ok(this.containerElement.querySelectorAll('figcaption')[0].textContent.includes('ERDiL'));
    assert.ok(this.containerElement.querySelectorAll('figcaption')[1].textContent.includes('LoCoNET'));
  });
});
