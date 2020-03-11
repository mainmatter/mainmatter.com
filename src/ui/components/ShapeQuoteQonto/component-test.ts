import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: ShapeQuoteQonto', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ShapeQuoteQonto />`);

    assert.ok(this.containerElement.querySelector('q'));
  });
});
