import hbs from '@glimmer/inline-precompile';
import { render, setupRenderingTest } from '@glimmer/test-helpers';

const { module, test } = QUnit;

module('Component: PageTraining', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<PageTraining />`);

    assert.ok(this.containerElement.querySelector('div'));
  });
});
