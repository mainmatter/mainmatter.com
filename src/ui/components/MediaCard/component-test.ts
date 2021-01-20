import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: MediaCard', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<MediaCard @label="Label" @title="Titel" @image="https://domain.com/source.png">Content</MediaCard>`);

    assert.ok(this.containerElement.textContent.includes('Label'));
    assert.ok(this.containerElement.textContent.includes('Titel'));
    assert.ok(this.containerElement.textContent.includes('Content'));
    assert.equal(this.containerElement.querySelector('img').src, 'https://domain.com/source.png');
  });

  test('it renders duration if specified', async function(assert) {
    await render(hbs`<MediaCard @duration="04:54">Content</MediaCard>`);

    assert.ok(this.containerElement.textContent.includes('04:54'));
  });
});
