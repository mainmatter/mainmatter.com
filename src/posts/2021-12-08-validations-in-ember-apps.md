---
title: "Data validation in Ember with Yup"
authorHandle: BobrImperator
tags: ember
bio: "Software Developer"
description:
  "Bartlomiej Dudzik shows how you can easily create validations wrapper based
  on a library of your liking."
og:
  image: /assets/images/posts/2021-12-08-validations-in-ember-apps/og-image.png
tagline: |
  <p>Since Ember's Octane edition it's much easier to integrate with third-party libraries. Because of that I've been searching for alternatives to <code>ember-changeset</code> and <code>ember-cp-validations</code>. I will show you how to create your own validations around the Yup validations library.</p>
image: /assets/images/posts/2021-12-08-validations-in-ember-apps/illustration.svg
imageAlt: Data validation in Ember with Yup illustration
---

![Data validation in Ember with Yup illustration](/assets/images/posts/2021-12-08-validations-in-ember-apps/illustration.svg#full)

### Quick look at Yup

Yup provides factory methods for different data types that you can use to
construct schemas and their constraints for your data. The following code
imports the `string` schema, and calls the `required` and `email` methods to
describe what type of data is allowed. The returned schema `emailRequired`
validates values to be "a valid non-empty string that matches an email pattern".

```javascript
import { string } from "yup";

const emailRequired = string().required().email();

emailRequired.isValid("wrong.email.com").then(function (valid) {
  valid; // => false
});
```

#### Describing objects with Yup

Let's see how we can create a schema that describes some complex data. Here's
some example found in the Yup docs:

```javascript
import { object, string, number, date } from "yup";

const schema = object().shape({
  name: string().required(),
  age: number().required().positive().integer(),
  email: string().email(),
  website: string().url(),
  createdOn: date().default(function () {
    return new Date();
  }),
});
```

`object().shape()` takes an object as an argument whose key values are other Yup
schemas, then it returns a schema that we can cast or validate against i.e

```javascript
schema
  .isValid({
    name: "jimmy",
    age: 24,
  })
  .then(function (valid) {
    valid; // => true
  });
```

#### Putting it together

```javascript
import { tracked } from "@glimmer/tracking";
import { getProperties } from "@ember/object";
import { object } from "yup";

export default class YupValidations {
  context;
  schema;
  shape;

  @tracked error;

  constructor(context, shape) {
    this.context = context;
    this.shape = shape;
    this.schema = object().shape(shape);
  }

  get fieldErrors() {
    return this.error?.errors.reduce((acc, validationError) => {
      const key = validationError.path;

      if (!acc[key]) {
        acc[key] = [validationError];
      } else {
        acc[key].push(validationError);
      }

      return acc;
    }, {});
  }

  async validate() {
    try {
      await this.schema.validate(this.#validationProperties(), {
        abortEarly: false,
      });

      this.error = null;
      return true;
    } catch (error) {
      this.error = error;

      return false;
    }
  }

  #validationProperties() {
    return getProperties(this.context, ...Object.keys(this.shape));
  }
}
```

That's it :) Let's go through it real quick.

There are 4 properties defined `context`, `schema`, `shape` and `error` which is
`@tracked`.

- `context` is either the data or the whole instance of the object we're
  validating.
- `shape` the expected shape of the data; this is used to create `schema`
- `schema` is a Yup schema created from `shape`
- `error` is a `ValidationError` thrown by `schema.validate()` when the data
  doesn't match the `schema`.

The constructor takes 2 arguments `context` and `shape`, we set those on the
instance as well as create `schema` off of `shape`.

- `fieldErrors` is a computed property that returns an object which keys are
  paths to the schemas that failed validations. The object is created by
  reducing a list of errors read from `ValidationError`.

- `validate` is an asynchronous method that calls `validate` on our `schema`,
  awaits the result, resets errors if validations pass, otherwise catches an
  error and sets it on the class instance. It's important that the
  `abortEarly: false` option is passed to `schema.validate()` as otherwise if
  any field would throw an error, it would stop validating the rest of the data,
  which is not desired. Furthermore `validate` receives data returned from
  `#validationProperties`, the reason for that being Ember Proxies. In order to
  correctly support proxies, e.g Ember-Data models, we need to grab data from
  `context` with the help of `getProperties`.

#### Usage

```javascript
import Model, { attr, hasMany } from "@ember-data/model";
import YupValidations from "emberfest-validations/validations/yup";
import { number, string } from "yup";

export default class UserModel extends Model {
  validations = new YupValidations(this, {
    name: string().required(),
    age: number().required(),
  });

  @attr("string") name;
  @attr("number") age;
  @hasMany("pet") pets;
}
```

We instantiate YupValidations and pass it some arguments, a User model instance,
and Yup **shape**.

Later, inside a form component I'd like to be able to just call
`YupValidations#validate` method which returns a Promise that resolves to a
Boolean.

```javascript
import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class UserFormComponent extends Component {
  @service store;

  user = this.store.createRecord("user");

  @action
  async onSubmit(event) {
    event.preventDefault();

    if (await this.user.validations.validate()) {
      this.user.save();
    }
  }
}
```

Further on, there's an `ErrorMessage` component that receives a **list** of
error messages and handles them in some way. Normally we'd show
internationalized messages with the help of `ember-intl`, but in our case we'll
just show their keys directly like so:

```hbs
{% raw %}
{{! error-message.hbs }}

{{#each @messages as |message|}}
  <div>
    {{message.key}}
  </div>
{{/each}}
{% endraw %}
```

Finally the component invocation:

```hbs
{% raw %}
<ErrorMessage @messages={{this.user.validations.fieldErrors.age}} />
{% endraw %}
```

#### Internationalization

Yup by default returns messages in plain text based on some built-in templates
and some way of concatenation. That's not an option for us though because in
Ember apps we normally use `ember-intl` for translating text. Luckily Yup allows
to use functions that will produce messages.

The full list of messages can be found in
[Yup's source code](https://github.com/jquense/yup/blob/master/src/locale.ts)

```javascript
import { setLocale } from ‘yup’;
import { getProperties } from ‘@ember/object’;

const locale =
  (key, localeValues = []) =>
  (validationParams) => ({
    key,
    path: validationParams.path,
    values: getProperties(validationParams, ...localeValues),
  });

setLocale({
  mixed: {
    default: locale('field.invalid'),
    required: locale('field.required'),
    oneOf: locale('field.oneOf', ['values']),
    notOneOf: locale('field.notOneOf', ['values']),
    defined: locale('field.defined'),
  },
  string: {
    min: locale('string.min', ['min'])
  },
})
```

`locale` is a higher order function that returns a function that is later used
by Yup to produce our messages. The first argument it takes is a translation key
of our liking that would then be consumed by `ember-intl` e.g `field.invalid`.
The second argument is a list of fields it should get from `validationParams`
that we receive from Yup, the parameters could have values like `min` and `max`
that would be passed to `ember-intl` `t` helper.

At the end of the day the produced messages will look like this:

```javascript
{
  key: "string.min",
  path: "name",
  values: { min: 8 }
}
```

```javascript
{
  key: "field.required",
  path: "age",
  values: {}
}
```

Let's see what messages are returned after the `User` model is validated when
the form is submitted:

![Internationalized user fields demo](/assets/images/posts/2021-12-08-validations-in-ember-apps/form-user-1.gif)

### Validating related schemas

As you could see before, pets aren't being validated yet. There are 2 things
that need to be done first:

- Create validations for the `Pet` model.
- Validate pets when the user is validated.

Here's the `Pet` model with validations.

```javascript
import Model, { attr, belongsTo } from "@ember-data/model";
import { string } from "yup";
import YupValidations from "emberfest-validations/validations/yup";

export default class PetModel extends Model {
  validations = new YupValidations(this, {
    name: string().required(),
  });

  @attr("string") name;

  @belongsTo("user") owner;
}
```

Now let's take a look at the code for connecting the validations for `User` and
`Pet`. This will validate pets when a `User` is validated.

Yup has a public API for extending schemas as well as creating custom tests,
both can be used to create the connection we want.

- `addMethod` accepts a schema, a name of a method that is to be added on the
  target schema, as well as a function.
- `mixed#test` is a method that exists on all schemas, it can be used in
  multiple ways, but in this case the only thing we need to know is that it's a
  method that receives a function as an argument, and the function it receives
  has to return a promise that returns `true` or `false`.

#### belongsTo

```javascript
import { addMethod, object } from "yup";

addMethod(object, "relationship", function () {
  return this.test(function (value) {
    return value.validations.validate();
  });
});
```

This bit is fairly straightforward, we add a `relationship` method to the
`object` schema. When `relationship` is called, it adds a custom test that
receives `value` which is an instance of a model. After that it's just a matter
of accessing the validaitons wrapper and running it's `validate` method.

#### hasMany

```javascript
import { addMethod, array } from "yup";

addMethod(array, "relationship", function () {
  return this.transform(
    (_value, originalValue) => originalValue?.toArray() || []
  ).test(async function (value) {
    const validations = await Promise.allSettled(
      value.map(({ validations }) => {
        return validations.validate();
      })
    );

    return validations.every((validation) => validation);
  });
});
```

`hasMany` relationships are pretty much the same as `belongsTo`. The only
difference is that the `hasMany` promise-proxy needs to be transformed into an
array that Yup will be able to handle which is done by calling `toArray`. Then
the test validates all object in the array and check whether all validations
return `true`.

That's it – now we need to modify the `User` model by adding `pets` to its
validations.

```javascript
import Model, { attr, hasMany } from "@ember-data/model";
import YupValidations from "emberfest-validations/validations/yup";
import { number, array, string } from "yup";

export default class UserModel extends Model {
  validations = new YupValidations(this, {
    name: string().required(),
    age: number().required(),
    pets: array().relationship(),
  });

  @attr("string") name;
  @attr("number") age;

  @hasMany("pet") pets;
}
```

![Internationalized user and pet fields demo](/assets/images/posts/2021-12-08-validations-in-ember-apps/form-user-with-pets-2.gif)

### Conditional validations

There are times when you need to do some conditional validations based on some
different state. Here we'll have a really weird requirement where `pet.name` is
only required when the user is not allergic.

```javascript
import Model, { attr, hasMany } from "@ember-data/model";
import YupValidations from "emberfest-validations/validations/yup";
import { number, array, string } from "yup";

export default class UserModel extends Model {
  validations = new YupValidations(this, {
    name: string().required(),
    age: number().required(),
    pets: array().relationship(),
  });

  @attr("string") name;
  @attr("number") age;
  @attr("boolean") isAllergic;

  @hasMany("pet") pets;
}
```

The only thing added here is a new `isAllergic` attribute.

Here's the modified `Pet` model:

```javascript
import Model, { attr, belongsTo } from "@ember-data/model";
import { boolean, string } from "yup";
import YupValidations from "emberfest-validations/validations/yup";

export default class PetModel extends Model {
  validations = new YupValidations(this, {
    name: string().when(["isUserAllergic"], {
      is: true,
      then: string().notRequired(),
      otherwise: string().required(),
    }),
    isUserAllergic: boolean(),
  });

  @attr("string") name;
  @belongsTo("user") user;

  get isUserAllergic() {
    return this.user.get("isAllergic");
  }
}
```

`Pet` now implements the conditional `name` validation by calling the `when`
method of the `string` schema. The `when` method accepts a list of names of
dependent properties, then we pass an object which specifies that the `name`
attribute is not required when `isUserAllergic` is `true`.

![Internationalized user and pet fields demo](/assets/images/posts/2021-12-08-validations-in-ember-apps/conditional-form-user-3.gif)

### Summary

We've taken a look at an alternative approach to validating data in our apps.
Now it's easier than ever to integrate with 3rd party libraries with mostly just
Ember proxies standing on our way. I also find it beneficial to be able to use
something like Yup for teams that work in many environments.

The complete source code used in this blog post can be found here:
https://github.com/BobrImperator/emberfest-validations
