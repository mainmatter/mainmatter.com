import hbs from '@glimmer/inline-precompile';
import { render } from '@glimmer/test-helpers';
import { setupRenderingTest } from '../../../utils/test-helpers/setup-rendering-test';

const { module, test } = QUnit;

module('Component: WorkWithUs', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders Marco by default', async function(assert) {
    await render(hbs`<WorkWithUs />`);

    assert.ok(this.containerElement.querySelector('[data-test-team-member=marco]'));
  });

  test('it falls back to Marco if team member is unknown', async function(assert) {
    await render(hbs`<WorkWithUs @teamMember="example" />`);

    assert.ok(this.containerElement.querySelector('[data-test-team-member=marco]'));
  });

  test('it renders appropriate team member', async function(assert) {
    await render(hbs`<WorkWithUs @teamMember="chris" />`);

    assert.ok(this.containerElement.querySelector('[data-test-team-member=chris]'));
  });
});
