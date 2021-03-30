import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: WorkshopCard', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<WorkshopCard @label="Label" @title="Titel" @description="Description" @leads="/assets/images/authors/marcoow.jpg,/assets/images/authors/msmarhigh.jpg" />`);

    assert.ok(this.containerElement.textContent.includes('Label'));
    assert.ok(this.containerElement.textContent.includes('Titel'));
    assert.ok(this.containerElement.textContent.includes('Description'));
    assert.ok(this.containerElement.querySelector('img[src="/assets/images/authors/marcoow.jpg"]'));
    assert.ok(this.containerElement.querySelector('img[src="/assets/images/authors/msmarhigh.jpg"]'));
  });
});
