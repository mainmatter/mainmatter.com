---
title:
  'Simpler and more powerful components in Ember Octane with Glimmer Components'
authorHandle: locks
tags: ember
bio: 'Senior Frontend Engineer, Ember Framework and Learning Core teams member'
description:
  'Ricardo Mendes explains how Glimmer components provide a simpler and clearer,
  yet more powerful, component layer for Ember Octane applications.'
og:
  image: /assets/images/posts/2020-10-05-simpler-and-more-powerful-components-in-ember-octane-with-glimmer-components/og-image.png
tagline: |
  <p>Following up on <a href="/blog/2019/12/20/clarity-in-templates/">Bringing clarity to templates through Ember Octane</a>, we will be discussing how the Glimmer components introduced by the <a href="https://blog.emberjs.com/2019/12/20/octane-is-here.html">Ember Octane edition</a> aim to modernize and simplify Ember applications by using native JavaScript syntax and an HTML-first approach.</p>
---

![Bringing clarity to your Ember templates](/assets/images/posts/2020-10-05-simpler-and-more-powerful-components-in-ember-octane-with-glimmer-components/illustration.svg#full)

## Introducing Glimmer components

The release of the
[Ember Octane edition](https://blog.emberjs.com/2019/12/20/octane-is-here.html)
back in December was one of Ember's biggest releases, bringing with it modern
and streamlined APIs. At the core of the release are
[tracked properties](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)
and Glimmer components. While Octane has been out for quite some time, and
subsequently Glimmer components, you are likely using Ember (or "classic")
components in your application. To give some context as to the impact of Glimmer
components in the Ember mental model, I'll be introducing Glimmer components
from the viewpoint of classic Components.

The key points we will be addressing in this post are:

- Glimmer components use native `class` syntax and do not extend from
  `EmberObject`.
- Separation of internal state (properties) and external state (arguments).
- HTML-first approach makes for a much simpler API surface.

## Native `class`

The first thing that catches the eye is that Glimmer components have a different
base class with a radically different API (see
[Ember Component](https://api.emberjs.com/ember/3.21/classes/Component) vs
[Glimmer component](https://api.emberjs.com/ember/3.21/modules/@glimmer%2Fcomponent)).

With the new Glimmer component implementation you are expected to use the native
`class` syntax, but it also changes something more important: a Glimmer
component no longer inherits from `EmberObject`. Now you should use native
getters and setters, as well as tracked properties.

How you define the component actions also requires an adjustment. First, a bit
of historical context. One of the first proposals for Ember components had
actions defined as a member function of the component, like so:

```javascript
export default Component.extend({
  myActionHandler() {
    console.log('myActionHandler triggered');
  },
});
```

Unfortunately, due to the API surface of components and the fact that one of the
component lifecycle hooks was named `destroy`, that meant that users would
unknowingly override component hooks and introduce strange bugs to their
application. To address this, a system was conceived where you define component
actions in the actions hash:

```javascript
export default Component.extend({
  actions: {
    myActionHandler() {
      console.log('myActionHandler triggered');
    },
  },
});
```

But now that Glimmer components have quite a small API surface (roughly
`willDestroy`, `isDestroying` and `isDestroyed`), we can go back to defining
them as methods in the component, and then refer to them directly in the
template.

So putting these things together, let's look at a component that receives a type
of pasta and a type of sauce and displays it with a button to order. The
component is invoked like so:

```handlebars
{% raw %}
<OrderPasta @pasta='Spaghetti' @sauce='Carbonara' />
{% endraw %}
```

Now let us look at how both implementations differ. First, the Ember component:

```javascript
/// app/components/order-pasta.js
import Component from '@ember/component';

export default Component.extend({
  dishName: computed('pasta', 'sauce', function () {
    return `${this.pasta} ${this.sauce}`;
  }),

  actions: {
    handleReservation() {
      console.log(`Ordered a plate of ${this.dishName}`);
    },
  },
});
```

```handlebars
{% raw %}
<div>{{this.dishName}}
  <button {{action 'handleReservation'}}>Reserve</button></div>
{% endraw %}
```

And now the Glimmer component:

```javascript
// app/components/order-pasta.js
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class OrderPasta extends Component {
  get dishName() {
    return `${this.args.pasta} ${this.args.sauce}`;
  }

  @action
  handleReservation() {
    console.log(`Ordered a plate of ${this.dishName}`);
  }
}
```

```handlebars
{% raw %}
<div>{{this.dishName}}
  <button {{on 'click' this.handleReservation}}>Reserve</button></div>
{% endraw %}
```

I won't go into details on the `action` to `on` modifier changes, but notice how
in the Glimmer component we reference the callback directly, we used a native
getter, and we defined the action handler as a decorated method. You might also
have noticed that in the Glimmer component code I have referred to the passed-in
values as `this.args`, which brings us to our next point.

## Separation of properties and arguments

One behavior of classic components that can sneak up on even more experienced
developers is the fact that classic components reflect passed-in state
(arguments) onto internal state (properties). This has a big implication. Since
properties and arguments are directly linked in classic components, you can
effectively override any property from the outside by calling the component with
an argument with the same name. You cannot refer to the argument's original
value from within the component.

Glimmer components do away with this behavior by separating arguments into the
`args` property of the component, and by making named argument bindings
read-only, which gives developers a better guarantee that the data flow in a
component tree isn't accidentally two-way bound.

Now developers have to be more explicit about certain patterns, for example
default values for component properties.

Let's take the previous `OrderPasta` component and make the pasta type optional.
I will only include the code necessary for this change to keep the code samples
focused.

For the Ember component, we can see that adding a property with the proper name
is enough. If the component is invoked with a different `pasta` argument, this
will be overwritten.

```javascript
/// app/components/order-pasta.js
import Component from '@ember/component';

export default Component.extend({
  pasta: 'Spaghetti',
});
```

For the Glimmer component we have to do a bit more legwork. We'll assume that
`pasta` can change over time, so we will add a native getter so it gets
automatically updated. We will also need to change our `dishName` getter to
refer to the property instead.

```javascript
// app/components/order-pasta.js
export default class OrderPasta extends Component {
  get pasta() {
    return this.args.pasta || 'Spaghetti';
  }

  get dishName() {
    return `${this.pasta} ${this.args.sauce}`;
  }
}
```

As you can see, we can now reason about the code locally instead of having to
rely on the framework knowledge that `pasta` would be overwritten. We can use
the name `pasta` for both the property and the argument because the syntax makes
it clear which is which. If you need access to the argument you use
`this.args.pasta` in the class or `{{@pasta}}` in the template. If you need to
access the property, you use `this.pasta` in the class and `{{this.pasta}}` in
the template.

If you checked the API documentation linked at the beginning of the blog post,
you might still be wondering how Glimmer components managed to reduce the API
surface so much. We will not be covering lifecycle hooks in this post (which
account for the removal of `didInsertElement`, `didReceiveAttrs`, `didRender`,
`didUpdate`, `didUpdateAttrs`, `willRender`, `willUpdate`), instead we will be
focusing on the APIs that allows one to customize the wrapper element of Ember
Components.

## HTML-first APIs

Ember components have been around since before the 1.0 release, where they were
introduced as isolated
[views](https://api.emberjs.com/ember/1.0/classes/Ember.View). Views are long
gone from everyday applications, but their legacy still lives on in Ember
components. Ember components have a very distinct characteristic, the
component's template is wrapped by a hidden element, `<div>` by default. To
customize this element, you have to use certain APIs in the component's class,
like `tagName`, `classNameBindings` and `attributeBindings`.

Let us go with a practical example to make it clearer. We are going to make a
button component that receives a `primary` CSS class and a `disabled` HTML
attribute. The component template itself will be the content for the button.

```javascript
// app/components/my-button.js
import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',

  attributeBindings: ['isDisabled:disabled'],
  isDisabled: false,

  classNameBindings: ['buttonType'],
  buttonType: 'primary',
});
```

```handlebars
{% raw %}
// app/components/my-button.hbs
{{yield}}
{% endraw %}
```

Now you can call `MyButton` and dynamically change the class and the attribute:

```handlebars
{% raw %}
<MyButton>Click me</MyButton>
{{! renders }}
<button class='primary'>Click me</button>

<MyButton @isDisabled={{true}}>Click me</MyButton>
{{! renders }}
<button class='primary' disabled>Click me</button>

<MyButton @buttonType={{'secondary'}}>Click me</MyButton>
{{! renders }}
<button class='secondary'>Click me</button>

<MyButton @isDisabled={{true}} @buttonType={{'secondary'}}>Click me</MyButton>
{{! renders }}
<button class='secondary' disabled>Click me</button>
{% endraw %}
```

You might look at this example and think, why are we using JavaScript to specify
how we want the HTML to look when we have templates and I would agree with you.
More than that, the Ember team agrees with you, that's why Glimmer components no
longer have an implicit wrapper element so now you can configure this in the
component's template itself. This, coupled with being able to specify HTML
attributes and the new `...attributes` make template-only components much more
feasible.

Let's implement `MyButton` in Glimmer. As mentioned, we are moving the code from
the component class to the template, so we don't need the JavaScript file.

```handlebars
{% raw %}
// app/components/my-button.hbs
<button class={{if @buttonType @buttonType 'primary'}} ...attributes>
  {{yield}}
</button>
{% endraw %}
```

{% raw %}
Much more straightforward! In `{{if @buttonType @buttonType 'primary'}}` we are
saying that the value should be `primary` if `@buttonType` is not defined, and
in `...attribute` we are telling Ember where to put any HTML attributes that are
passed in when calling the component.
{% endraw %}

In this case we do not want to pass `class` as an HTML attribute when calling
the component because `class` is special in that it merged together the existing
classes in the component with whatever you pass to the component:

````handlebars
{% raw %}
// app/components/my-button.hbs
<button class='primary' ...attributes>
  {{yield}}
</button>``` ```handlebars
<MyButton class='two'>Multiple classes</MyButton>
{% endraw %}
````

Renders:

```html
<button class="primary two">Multiple classes</button>
```

For the sake of exemplifying `attributeBindings` I glossed over the fact that
Ember will apply any HTML attributes you pass to an Ember component to the
implicit wrapper element. Now that we are explicitly using `...attributes` in
our Glimmer component, we need to update how we're calling the component:

```handlebars
{% raw %}
<MyButton>Click me</MyButton>
{{! renders }}
<button class='primary'>Click me</button>

<MyButton disabled>Click me</MyButton>
{{! renders }}
<button class='primary' disabled>Click me</button>

<MyButton @buttonType={{'secondary'}}>Click me</MyButton>
{{! renders }}
<button class='secondary'>Click me</button>

<MyButton @buttonType={{'secondary'}} disabled={{true}}>Click me</MyButton>
{{! renders }}
<button class='secondary' disabled>Click me</button>
{% endraw %}
```

A common point of dissatisfaction with frameworks, including Ember, is the so
called "magic". This is when the framework does something for you that you have
no insight into, so you may not understand what is happening or why. For
example, Ember components having an implicit wrapper element, and Ember
automatically applying `...attributes` to it.

With the introduction of Glimmer components in the Octane edition plus the
template improvements already mentioned in a previous post, Ember has made it
much easier to reason locally about your component. By keeping layout logic in
the layout, instead of the component class you only have to look in one place to
know what the component will render. By moving towards native JavaScript syntax
and functionality, Ember has diminished the uncertainty of whether a certain
functionality is provided by Ember or by JavaScript.

I hope this exploration of Glimmer components and Ember components was useful
for you and at the very least gave you a renewed appreciation for the Octane
Edition design effort.

If you are looking for help migrating your codebase to these new idioms, or you
want to level up your engineering team, [contact us](/contact/) so we can work
together towards achieving your goals.
