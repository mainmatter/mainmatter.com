import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: ShapeFeature', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<ShapePlaybook />`);

    assert.ok(this.containerElement.querySelector('div'));
  });

  module('when invoked with a @srcset', function() {
    test('it renders figure and figcaption elements', async function(assert) {
      await render(hbs`<ShapeFeature @srcset="./some/image/source.png" />`);

      assert.ok(this.containerElement.querySelector('figure'));
      assert.ok(this.containerElement.querySelector('figcaption'));
    });
  });

  module('when invoked without a @srcset', function() {
    test('it does not render figure and figcaption elements', async function(assert) {
      await render(hbs`<ShapeFeature />`);

      assert.notOk(this.containerElement.querySelector('figure'));
      assert.notOk(this.containerElement.querySelector('figcaption'));
    });
  });
});
