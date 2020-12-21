import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: WorkshopCard', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<WorkshopCard @label="Label" @title="Titel" @description="Description" @authors="author1,author2" />`);

    assert.ok(this.containerElement.textContent.includes('Label'));
    assert.ok(this.containerElement.textContent.includes('Titel'));
    assert.ok(this.containerElement.textContent.includes('Description'));
    assert.ok(this.containerElement.querySelector('img[src="/assets/images/authors/author1.jpg"]'));
    assert.ok(this.containerElement.querySelector('img[src="/assets/images/authors/author2.jpg"]'));
  });
});
