import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: HeaderContent', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    /*
     * You may pass data into the component through arguments set on the
     * `testContext`
     *
     * For example:
     *
     * ```
     * this.foo = { foo: '123' };
     *
     * await render(hbs`<HeaderContent @foo={{this.foo}} />`)
     *
     * // or
     *
     * this.foo = 'bar';
     * await render(hbs`<p>{{this.foo}}</p>`);
     *
     * assert.dom('p').text('bar');
     * ```
     */
    await render(hbs`<HeaderContent />`);
    assert.ok(this.containerElement.querySelector('div'));
  });
});
