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

  test('it does not add a "data-internal" attribute for absolute internal links', async function(assert) {
    await render(hbs`<ArrowLink @href="https://simplabs.com/link" />`);

    assert.ok(this.containerElement.querySelector('a').dataset.internal === undefined);
  });

  test('it does not add a "data-internal" attribute for external links', async function(assert) {
    await render(hbs`<ArrowLink @href="https://github.com" />`);

    assert.ok(this.containerElement.querySelector('a').dataset.internal === undefined);
  });

  test('it does not add a "target" attribute for relative internal links', async function(assert) {
    await render(hbs`<ArrowLink @href="/link" />`);

    assert.notOk(this.containerElement.querySelector('a').target);
  });

  test('it does not add a "target" attribute for absolute internal links', async function(assert) {
    await render(hbs`<ArrowLink @href="https://simplabs.com/link" />`);

    assert.notOk(this.containerElement.querySelector('a').target);
  });

  test('it adds a "target" attribute with value "_blank" for external links', async function(assert) {
    await render(hbs`<ArrowLink @href="https://github.com" />`);

    assert.equal(this.containerElement.querySelector('a').target, '_blank');
  });

  test('it does not add a "rel=noopener" attribute for relative internal links', async function(assert) {
    await render(hbs`<ArrowLink @href="/link" />`);

    assert.notOk(this.containerElement.querySelector('a').rel);
  });

  test('it does not add a "rel=noopener" attribute for absolute internal links', async function(assert) {
    await render(hbs`<ArrowLink @href="https://simplabs.com/link" />`);

    assert.notOk(this.containerElement.querySelector('a').rel);
  });

  test('it adda a "rel=noopener" attribute for external links', async function(assert) {
    await render(hbs`<ArrowLink @href="https://github.com" />`);

    assert.equal(this.containerElement.querySelector('a').rel, 'noopener');
  });
});
