import eq from './helper';

const { module, test } = QUnit;

module('Helper: eq', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(eq([]), true);
    assert.equal(eq(['foo']), false);
    assert.equal(eq(['foo', 'foo']), true);
    assert.equal(eq(['foo', 'fooz']), false);
    assert.equal(eq(['foo', 'foo', 'bar', 'baz']), 'bar');
    assert.equal(eq(['foo', 'fooz', 'bar', 'baz']), 'baz');
  });
});
