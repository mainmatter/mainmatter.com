import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: ArrowLink', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ArrowLink />`);

    assert.ok(this.containerElement.querySelector('a'));
  });

  test('it adds a "data-internal" attribute for relative internal links', async function(assert) {
    await render(hbs`<ArrowLink @href="/link" />`);

    assert.ok(this.containerElement.querySelector('a').dataset.internal !== undefined);
  });

  test('it adds a "data-internal" attribute for absolute internal links', async function(assert) {
    await render(hbs`<ArrowLink @href="https://simplabs.com/link" />`);

    assert.ok(this.containerElement.querySelector('a').dataset.internal !== undefined);
  });

  test('it does not add a "data-internal" attribute for internal links', async function(assert) {
    await render(hbs`<ArrowLink @href="https://github.com" />`);

    assert.ok(this.containerElement.querySelector('a').dataset.internal === undefined);
  });
});
