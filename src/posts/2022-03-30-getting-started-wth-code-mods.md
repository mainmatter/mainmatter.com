---
title: "Code mods in JavaScript and how to get started creating your own"
authorHandle: Mikek2252
tags: javascript
bio: "Senior Software Engineer"
description:
  "Michael Kerr gives a quick introduction into code mods in JavaScript and how
  to create your own."
og:
  image: /assets/images/posts/2022-03-30-getting-started-with-code-mods/og-image.jpg
tagline: |
  <p>With the ever-changing landscape in web development, code is forever needing to
  be updated, whether that be due to updates in frameworks and libraries or new
  features supported in browsers. Manually dealing with all these updates can
  often be very error prone and time consuming and that is where code
  mods/refactoring tools come in. Code mods are scripts that can be run on
  existing code, templates, styles (pretty much anything with the correct parser
  and compiler) in order to identify a pattern and then update the code to a new
  one.</p>
---

For example updating the following code sample from concatenating with the `+`
operator to using a template literal.

```javascript
// Before
let message = "Hello, " + name;
// After
let message = `Hello, ${name}`;
```

In the Ember community we love code mods: when deprecations in the framework are
added, there is a good chance that a code mod is created in order to help
everyone migrate their code. The Ember community even has an entire github
organization dedicated to code mods which you can check out here:
[https://github.com/ember-codemods](https://github.com/ember-codemods).

Despite the already great array of code mods available, there may not be one
that covers your needs or fixes your problem. Fear not: making your own isn’t as
complicated as it may seem.

## Setting up your code mod project

Creating the initial project for a JavaScript or Handlebars code mod could not
be simpler thanks to [Robert Jackson's](https://github.com/rwjblue)
[codemod-cli tool](https://github.com/rwjblue/codemod-cli). What is left for you
to do is run the following command and you will have all your prerequisites.

```
npx codemod-cli new &lt;project-name&gt;

// TIP: Make sure to give the project a broad name as
// you can have multiple code mods in this project!.
```

Once your project has been created, make sure to `cd <project-name>` and install
your dependencies via your chosen package manager.

## Creating your code mod

Now that the project has been setup and our dependences have been installed it's
time to create our code mod. For the purpose of this post, we will create a rule
for the string concatenation with the plus operator to a template literal.

To create the rule boiler plate, all we need to do is run the following command:

```
npx codemod-cli generate codemod &lt;name of codemod&gt;
```

Once the command has finished, you should see a new folder with the name of your
code mod. Inside of it, you should find a folder for your test fixtures along
with an `index.js` and `test.js` file.

## Setting up your test fixtures

Before I start writing the code mod itself, I like to set up the test fixtures.
Inside your `__testfixtures__`, you should already have an `*.input.js` file and
an `*.output,js`. The `input.js` file should contain the 'input' code, or in
other words the code to be changed and the `*.output.js` should contain what you
expect the code to be after the code mod has ran. This is what it would look
like for my example:

`basic.input.js`

```javascript
let message = ‘Hello, ‘ + name;
```

`basic.output.js`

```javascript
let message = ‘Hello, ${name}”;
```

If you need to add any more text fixtures you can run the following command:

```
npx codemod-cli generate fixture &lt;name of codemod&gt; &lt;name of fixture&gt;
```

Or simply just create your own `fixture-name.input.js` and
`fixture-name.output.js` in the same folder.

## Creating the code mod

Once everything has been set up and you have your test fixtures, it is time to
start writing.

If you open up your `index.js` file you should find an example code mod:

```javascript
const { getParser } = require("codemod-cli").jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api); // this line fetches the parse which in this case is jscodeshift's default parser

  return j(file.source) // this line parses the file to an AST (abstract syntax tree)
    .find(j.Identifier) // this line finds all nodes on the tree that match the parameter
    .forEach(path => {
      path.node.name = path.node.name.split("").reverse().join("");
    })
    .toSource();
};

module.exports.type = "js";
```

This example finds all `identifiers`(the name for a variable) and reverses the
name.

Our first step is to add the correct identifier parameter for the find function.
The easiest way to do this is to use [astexplorer.net](https://astexplorer.net/)
which can show you code broken down into an abstract syntax tree or AST.

![AST Explorer](/assets/images/posts/2022-03-30-getting-started-with-code-mods/astExplorer.png)

With the autofocus check box enabled, it will highlight the tree and the code to
help show you what node is what. Using this we can see that `'Hello, ' + name;`
is a `BinaryExpression`. So let's update our code with the correct Identifier
and instead of using the `.forEach` we will add `.replaceWith`.

```javascript
const { getParser } = require("codemod-cli").jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);

  return j(file.source)
    .find(j.BinaryExpression)
    .replaceWith(path => {
      /* we'll figure out what to put here next */
    })
    .toSource();
};

module.exports.type = "js";
```

To convert from a `BinaryExpression` to a `TemplateLiteral` we will need to
return a `TemplateLiteral` node from the `replaceWith` function. As we are using
the babel parser, we can use https://babeljs.io/docs/en/babel-types to help us
work out what we need to create a `TemplateLiteral`.

![TemplateLiteral Documentation](/assets/images/posts/2022-03-30-getting-started-with-code-mods/templateLiteral.png)

`TemplateLiteral`s require an array of `TemplateElement`s, which will be the
strings and an array of expressions being the variables. So for now we can
update our code to look like this:

```javascript
module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  return j(file.source)
    .find(j.BinaryExpression)
    .replaceWith(path => {
      let quasis = [];
      let expressions = [];

      return j.templateLiteral(quasis, expressions);
    })
    .toSource();
};

module.exports.type = "js";
```

If we were to run the tests now with this transformation you will see that it
now replaces all `BinaryExpression`s with an empty `TemplateLiteral`;

```javascript
let message = "hello " + name;
// becomes
let message = ``;
```

Now we have a `TemplateLiteral` we need to extract the information from our
`BinaryExpression` to add to our `TemplateLiteral`. A `BinaryExpression` has
three attributes: `operator`, `left` and `right`. We need to check both `left`
and `right` nodes to see if either is a `StringLiteral` or whether it is an
`Identifier`/variable. If the node is a `StringLiteral`, it needs to be
converted to a `TemplateElement`. If the node is an `Identifier`, we need to add
it to the expressions array.

That leaves us with this code:

```javascript
const { getParser } = require("codemod-cli").jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);

  return j(file.source)
    .find(j.BinaryExpression)
    .replaceWith(path => {
      let quasis = [];
      let expressions = [];
      [path.value.left, path.value.right].forEach(node => {
        if (node.type === "StringLiteral") {
          quasis.push(
            j.templateElement(
              { raw: node.extra.rawValue, cooked: node.value },
              false
            )
          );
        } else if (node.type === "Identifier") {
          expressions.push(node);
        }
      });
      return j.templateLiteral(quasis, expressions);
    })
    .toSource();
};

module.exports.type = "js";
```

Now let's run our test case to see if it passes.

![Test success screenshot](/assets/images/posts/2022-03-30-getting-started-with-code-mods/test-success-screenshot.png)

_Note: `is idempotent` is a test added by codemod-cli to check that rerunning
the code mod will always give the same result_

That test case has passed, but as you may have noticed by now, this
implementation has many limitations: what happens if we use a number instead of
a string or have multiple `BinaryExpression`s, or a minus is used instead of a
plus? Well that is where I will leave you to try and add some of your own test
cases and see if you can tackle some of the limitations within this code mod.

If you would like to learn more about code mods and AST's check out
[our AST workshop](https://github.com/mainmatter/ast-workshop).
