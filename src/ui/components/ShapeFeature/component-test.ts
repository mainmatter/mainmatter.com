import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: ShapeFeature', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ShapeFeature />`);

    assert.ok(this.containerElement.querySelector('div'));
  });

  test('it renders with a block', async function(assert) {
    await render(hbs`<ShapeFeature><p>test</p></ShapeFeature>`);

    assert.ok(this.containerElement.querySelector('p'));
  });
});
