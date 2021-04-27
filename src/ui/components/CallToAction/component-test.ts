import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: CallToAction', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<CallToAction @label="label" @title="title" @text="text" />`);

    assert.ok(this.containerElement.querySelector('div'));
    assert.ok(this.containerElement.textContent.includes('label'));
    assert.ok(this.containerElement.textContent.includes('title'));
    assert.ok(this.containerElement.textContent.includes('text'));
  });
});
