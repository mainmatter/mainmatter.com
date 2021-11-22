---
title: 'Factories best practices'
authorHandle: geekygrappler
tags: testing
bio: 'Senior Frontend Engineer'
description:
  "Andy Brown introduces best practices for using factories in order to make
  your colleagues' and your own future self's lives easier."
tagline: |
  <p>Writing tests is like drinking beer 🍻. When you first try it, the taste is really quite unpalatable, but everyone else around you is doing it and they seem to be enjoying it. You've heard about all the benefits of it, people won't stop telling you how great it is, how it changed their lives for the better. Also there is a lot of peer pressure and judgement involved, don't be that dev... so you conceal your grimace and keep trying it, on a daily basis here at simplabs. And just like beer, in no time at all, on a long hot day, when you feel yourself tiring of writing all those features and tweaking all that CSS, you realise that what you need to relax is to write a good, concise, logical, cool and refreshing test. At least that's been my experience and I want to share a few tips for factories so that your tests are easy for your <s>friends</s>, <s>colleagues</s>, the next developer to read.</p>
---

## AAA

Before I dive into factories, firstly I want to mention AAA: Arrange, Act,
Assert. I covered this paradigm over [here](/blog/2017/09/17/magic-test-data/),
and I still stand by it. It's the most important thing you can do to make your
tests straight forward and understandable for others.

## Factories > Fixtures

Fixtures are hard coded data, a file with data representing a model in it, or
any data that your application needs. Factories generate data dynamically, using
functions, and can be called upon during the test with parameters passed to
manipulate to output data.

I would strongly discourage the use of fixtures. There are many excellent posts
out there comparing factories and fixtures, and, apart from the ones that are
wrong, they all say that factories > fixtures 🎉. I want to focus on one
particular use case I've seen a few times, which often leads to the inclusion of
fixtures in a mostly factory based test suite.

In most applications there is often one gnarly model. In ecommerce applications
it tends to be something like `order`. This will have many `products`, belong to
a `user`, may have some reference to a `payment` and `delivery`, maybe it will
have some kind of self referential relationship, or polymorphic relationship.
You get the picture, it's got a lot of stuff, it's grown over time to become and
all-encompassing monster and it _will_ make your head hurt to think about it.
It's often in these situtaion that we reach for a fixture, sometimes we even
copy and paste a response from our production API 😱.

The full API response fixture is the worst kind of fixture and it is a code
smell. It means that rather than creating a declarative test that will help
future developers (and your future self) understand what parts of this model are
important for a particular test and how the model works, you get a 1,203 line
json file. If I ever see a fixture like this while fixing a broken test, I have
to replace it with a factory. I don't do this because I like creating extra work
for myself, believe me, I don't. I do it because I don't understand what
specific parts of that model were important to the test by looking at the
fixture. In order to fix the test I need to figure out how the model works. I
try to build a mental picture of the model and create the data for the test
using a factory (often many factories pulled together), so it's clear and
concise what parts of the `order` are required for the
`orders with multiple deliveries arriving on the same day, only show 1 estimated delivery date not multiple`
test. In this test (which is fantastically named), I can expect to see an
`order` factory which has a `delivery` factory with more than one delivery, but
all planned for the same day. All the other parts of the `order` model are
likely not relevant to this test, so don't include them, or leave them as the
defaults. Some pseudocode as we're so far into the post without a single line of
it.

```js
{% raw %}
test('orders with deliveries from different carriers arriving on the same day, only show 1 estimated delivery date', function (assert) {
  let tomorrow = Date.tomorrow();
  let dhl = make('delivery', {
    estimatedDeliveryDate: tomorrow,
    carrier: 'dhl',
  });
  let ups = make('delivery', {
    estimatedDeliveryDate: tomorrow,
    carrier: 'ups',
  });
  let order = make('order', { deliveries: [dhl, ups] });

  assert.equal(
    order.estimatedDeliveryDates.length,
    1,
    'We should only show one delivery date',
  );
  assert.equal(
    order.estimatedDeliveryDates[0],
    tomorrow,
    'The delivery date is correct',
  );
});
{% endraw %}
```

## Fun fun factories 🏭

This is the part where young me thinks old me is a boring loser. Don't give your
factories fun names 🙅‍♂️. Often with factory libraries you will be able to have a
default model, e.g. `user` and you'll be able to have named factories e.g.
`specialUser`. What is quite fun is to have themed names for your factories, for
example:

```js
{% raw %}
//factories/user.js
Factory.define({
  default: {
    name: 'Ned Stark',
  },
  rob_stark: {
    name: 'Rob Stark',
    canInherit: true,
    wolf: belongsTo('dire-wolf'),
  },
  jon_snow: {
    name: 'Jon Snow',
    canInherit: false,
    wolf: belongsTo('dire-wolf'),
  },
});
{% endraw %}
```

Now while it's fun to have Game of Thrones characters in your testing code base,
it is a terrible practice. At the moment the difference between Jon and Rob is
quite clear, and if I was writing a test about inheritance of Winterfell, it
would be clear with a quick scan of the factory file, what the difference
between Jon and Rob is, regardless of whether I've watched GoT or not. However,
even though I know nothing about this ficticious GoT app, I can promise you one
thing, the model will grow with time and the list of attrs will start to grow
for both of our heroes. Let me give one scenario for what could happen:

```js
{% raw %}
beforeEach(() => {
  let rob = make('rob_stark');
  let jon = make('jon_snow');
});

// Added by me on day 1
test('bastards cannot inherit', function (assert) {
  assert.ok(
    rob.canInherit,
    'The King in the North, Rob Stark shall inherit Winterfell',
  );
  assert.notOk(
    jon.canInherit,
    'Get ye to The Wall, Winterfell will never belong to Jon Snow.',
  );
});

// Added by you on day 10
test('Leaders can raise armies', function (assert) {
  /* let's introduce someone who can tell us interesting things about Jon and Rob */
  let threeEyedRaven = make('brandon_stark');

  assert.ok(
    threeEyedRaven.canRaiseArmies(rob),
    'Noble of blood, strong of heart, Rob Stark can raise an army.',
  );
  assert.ok(
    threeEyedRaven.canRaiseArmies(jon),
    'Principles command authority, Jon Snow can raise an army.',
  );
});

//Added by me on day 102
test('Jon is better than Rob', function (assert) {
  let threeEyedRaven = make('brandon_stark');

  assert.ok(
    threeEyedRaven.isVitalToDefeatTheWhiteWalkers(jon),
    'We need Jon Snow to defeat the White Walkers (TBC) 😍',
  );

  assert.notOk(
    threeEyedRaven.isVitalToDefeatTheWhiteWalkers(rob),
    'Rob Stark proved his irrelevance to defeating the White Walkers during the Red Wedding 🗡 😭',
  );
});
{% endraw %}
```

And now what our simple factories have morphed into:

```js
{% raw %}
Factory.define({
  default: {
    name: 'Ned Stark',
  },
  rob_stark: {
    name: 'Rob Stark',
    canInherit: true,
    wolf: belongsTo('dire-wolf'),
    isBlessedByRhlor: false,
    charisma: 10,
    fighting_ability: 10,
    alive: false,
  },
  jon_snow: {
    name: 'Jon Snow',
    canInherit: false,
    wolf: belongsTo('dire-wolf'),
    isBlessedByRhlor: true,
    charisma: 9,
    fighting_ability: 10,
    alive: true,
  },
});
{% endraw %}
```

Now my example is a bit of fun, but my point is this: If you create wittily
themed named factories, the attributes they contain will be unclear to everyone
but you (and even to you on day 102). Often you will have a bare minimum number
of attributes required for a certain model, e.g. every user must have a name and
an email or the app will implode, and these things should live in the `default`
factory. If you need to modify the default, and admin users are a good example
of this, then keep the modification simple and make it obvious from the name
what properties are changing.

```js
{% raw %}
//user.js
Factory.define({
  default: {
    name: 'A user',
    email: 'user@example.com',
  },
  admin_user: {
    name: 'An Admin',
    email: 'admin@example.com',
    isAdmin: true,
  },
});
{% endraw %}
```

But of course **you should not do this(!)**, even with sensible naming, because
it will become a dumping ground for each attribute a test requires if it
involves an admin user.

Which leads me onto my final topic.

## Declarative factories

Don't use named factories or traits, they're an antipattern\*. The admin user is
again a good example where you might be tempted to use one of these. If your
model is such that `isAdmin` boolean is all that is needed to make someone an
admin then your test should be.

<small>\* I think, I'm not really sure what an antipattern is, but humour
me.</small>

```js
{% raw %}
test('Admin users are taken to the dashboard on login', async function(assert) {
  let admin = make('user', { isAdmin: true });

  // Mock a request to the api and return our admin.
  this.server.get('user', () => [200, {}, admin]);

  await visit('/');

  assert.equal(window.location, '/admin-dashboard';)
});
{% endraw %}
```

This declarative factory use is slightly longer than `make('admin_user')` (👈
named factory) or `make('user', 'isAdmin')` (👈 trait), but it's far superior,
like the difference between Jon 💘 and Rob 💀. Yes both the named factory and
the trait tell a reader that you're testing an admin (user), but the declarative
factory version used here also tells the reader how a user becomes an admin,
i.e. which properties are specifically important to adminship. Even if you
require a few more attributes to become an admin, I would still recommend
listing those attributes in the test, again informing any reader what attributes
are related to becoming an admin.

```js
{% raw %}
test('Admin users are taken to the dashboard on login', async function(assert) {
  let admin = make('user', {
    isAdmin: true,
    permissions: ['view', 'edit', 'delete'],
    sudo: true
  });

  this.server.get('user', () => [200, {}, admin]);

  await visit('/');

  assert.equal(window.location, '/admin-dashboard';)
});
{% endraw %}
```

If this list becomes quite long and it is used in a lot of places, and I mean
very long and _a lot_ of places, then maybe you could switch to a named factory
or trait, but you would need to police it quite strictly and ensure that nothing
else is added to that definition. What will happen is that developers add the
attribute they need for their specific test to the definition, rather than
writing it in the test, not realising that this attribute will now be created
unneccessarily in all tests using this named factory or trait. This won't break
those tests (usually), they'll be fine, but it leads to bloated factories and
developers unaware of which attributes are strictly relevant to the test they're
trying to fix.

## Don't use Mirage for tests - Ember bonus topic 🐹

Let me premise this section by saying I have always been a Mirage fanboy. I have
used it in a great number of my own personal projects for prototyping. I am not
throwing shade at the project or any of it's creators/contributors. I simply
have developed a strong opinion on where use of Mirage is appropriate. I prefer
using
[ember-data-factory-guy](https://github.com/danielspaniel/ember-data-factory-guy)
(Factory Guy) in tests.

My arguments for not using Mirage:

#### 1. Running a server for unit/integration tests

In my opinion the main use for Mirage is as a rapid prototyping tool. It can
also be used for testing, but by default, only testing in acceptance tests.
Mirage provides you with a Javascript server that runs in the browser and
intercepts API requests, responding to them before a network request is even
made, either those requests made by your application in `dev` or those made
during acceptance tests.

If you want to use Mirage in testing, and you write more than acceptance tests
then you will need to use a
['hack' or 'workaround'](http://www.ember-cli-mirage.com/versions/v0.4.x/manually-starting-mirage/)
to manually start and stop the mirage server during integration and unit tests.
And you definitely should be writing integration and unit tests.

#### 2. Test Clarity

Using Mirage in an acceptance test look like this.

```js
{% raw %}
//acceptance/foo-index-test.js

test('The page shows me all the foos', async function (assert) {
  server.createList('foo', 5);

  await visit('/foos');

  assert.equal(
    find('[data-test-foo]').length,
    5,
    'Five foos are shown on the page',
  );
});
{% endraw %}
```

It's not bad, we are at least following AAA, but there is a step that is
unclear, between adding foos to the server and them appearing on the page. The
details of that are contained in Mirage's config file. Take a look at the
equivalent test with Factory Guy for the data and
[Pretender](https://github.com/pretenderjs/pretender) for mocking API calls
(Mirage uses this under the hood\*).

<small>\*Factory Guy also uses pretender under the hood to mock API calls for
certain helper functions that you can use with Factory Guy if you want.</small>

```js
{% raw %}
//acceptance/foo-index-test.js

test('The page shows me all the foos', async function (assert) {
  // This is pretender
  server.get('/api/foos', function () {
    // buildList is ember-data-factory-guy
    return [200, {}, buildList('foo', 5)];
  });

  await visit('/foos');

  assert.equal(
    find('[data-test-foo]').length,
    5,
    'Five foos are shown on the page',
  );
});
{% endraw %}
```

Here we're being a little more explicit in the test. Put yourself in the shoes
of a junior developer. The Mirage test shows me _more_ Ember magic, even though
they promised me there is a lot less magic now than there used to be in 2012.
The factory test is more explicit, it tells us that visiting `/foos` url will
trigger a `GET` request to `/api/foos` and we return a list of foos. It's a
small difference but will help a junior to realise what

```js
{% raw %}
model() {
  return this.get('store').findAll('foo');
}
{% endraw %}
```

is actually doing.

#### 3. Duplication & Complexity

Mirage builds a server, with a database and its own ORM (Object-Relational
Mapping). This is quite a complex and interesting set up. Mirage attempts to
extract away this complexity and provide you with a simple API in order to
prototype and test, which it does quite well. Unfortunately one of the drawbacks
of this complexity is that Mirage uses a system of factory and model files to
generate your data for the server. The model files are used to declare
relationships and the factory files used to create default values or fake data.

Factory Guy doesn't need to have a model file because it is much simpler. It
creates ember data models or JSON objects and returns them directly in tests
without creating a server. Factory Guy therefore uses your app's model files
along with its factory files and doesn't require any extra model files. Mirage
creates its own set of models on the 'server' to return in API calls and be
turned into ember data models by your app. The duplication and extra complexity
may appear minor, but I have often spent serious time debugging Mirage when its
ORM has not produced the data exactly how I expected.

## Conclusion

I've been told it is always good to finish with a strong conclusion.

![Strong gif](/assets/images/posts/2018-12-20-factories-best-practices/strong.gif)

I hope you enjoyed this post and will start using factories over fixtures and
using named factories / traits more sparingly.
