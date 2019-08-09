---
title: 'Design Workflow: Naming things in design files'
description: 'Use predefined prefixes when naming layers to make things easier for you and your colleagues. Samples included.'
author: 'Florian Pichler'
github: pichfl
twitter: pichfl
topic: design
bio: 'Consultant for Technology and Design at simplabs'
---

Naming things is hard, naming visual things even more so. This guide helps you to bring meaning to the layer and symbol names in your Sketch files with little effort.

<!--break-->

Using components or symbols helps you to organize your designs into manageable pieces that are easily updated across your design. Processes like [Atomic Design][atomic-design] help you discern them. But what is a good way for naming and organizing your symbols?

## The problem

Naming things is hard, even more so when describing elements in your designs that may change over time or depending on certain states and other external factors.

Sometimes composition can help. Switching out different backgrounds or text layers depending on the state is supported in most design tools today via overrides, but more often your elements require rearranging to build the states you need. This is especially true when building the molecules and organisms in the Atomic Design hierarchy.

So you create symbols for these variations and now you have shifted your problem: you need a strategy for naming those as well.

### Variations in design and components

While others have identified many more, I tried to narrow it down to three categories: Variants, States, and Screen sizes. You may want to extend on this list if your project needs it.

**Variants** provide a way to formalize special cases so you can reuse them across your project. There is no harm in having a variant that is used for a single thing only.

**States** help you discern how your design elements should behave.

**Screen sizes** describe changes to a component that only apply at a certain dimension. If your design has navigation links in its header that collapse to a menu button on small screens you have an opportunity to use this category.

### Try a button

Let's create a basic button. It's composed of a background layer and a text layer. Both layers should be components on their own, so the button is a composition of two elements.

Our button has a default and pressed state. It also has a more prominent variant for primary actions. I also go a little overboard for this demonstration and adjusted the look for smaller screens.

- Variations: Default, Primary
- States: Default, Active
- Screen sizes: Default, Small

Which gives us 2³ – eight – possible combinations already.

![Illustration of the eight expected states of our button](/assets/images/posts/2019-08-12-design-workflow-naming-in-design-files/figure-1-button.png)

It's most likely, that most of these states can be created just by combining variations of their parts and for a simple component such as a button, you probably will be fine with overriding the background and or text layer.

But let's think of that button as a more complex component that might actually need additional elements depending on its state.

So time to name a symbol that describes the button in its default variation, with a pressed state and targeted at small screens consistently across multiple people and possibly teams.

## Why do I need this?

TODO: Describe why.

## Better names for symbols

I use [Sketch][sketch], but most of the following ideas work for Figma, Adobe XD and other design tools as well.

#### 1. Shallow nesting

Using `/` adds structure to your symbol selection as Sketch converts names like `Foo/Bar/Button` into a nested menu of Foo → Bar → Button. I recommend trying to stay shallow, as nesting too deep becomes tedious as well. I try to use the first segment of the name to group into areas of use. For example, our button might reside in `forms/`. A third level is rarely necessary.

#### 2. camelCase everything

Using Titlecase as in trying to start with a uppercase letter really isn't necessary. Using camelCase to make it easier to read long names comes in handy. Try to stay away from spaces for the names, as they will be used as delimiters between the name and its modifiers.

#### 3. Modifiers

| Prefix |                                    |
| ------ | ---------------------------------- |
| `+`    | Variants like `+primary`, `+large` |
| `#`    | States like `#hover`, `#error`     |
| `@`    | Screen sizes like `@small`,`@wide` |

The idea is of course inspired by hashtags, but adds an extra layer of semantics. By relying on different characters, you can use the built in filter function at the bottom of the layer list in Sketch to quickly gather all symbols of a certain state or variant by typing that single character.

What about defaults? While it is possible to add modifiers like `+default` or `#default`, it's perfectly fine to omit them to reduce noise in the names.

Footnote: The symbols were picked for compatibility. Our original draft had `:` instead of `#` for states which would be close to the CSS pseudo-selectors, but colon is the only forbidden character in filenames in macOS and gets replaced by a forward slash, which in turn is forbidden in Windows.

#### Result

![Screenshots: Side by side compararison of layer names before and after using the naming scheme](/assets/images/posts/2019-08-12-design-workflow-naming-in-design-files/figure-2-names.png)

To complete the naming our button, we now have `forms/button +primary #active @small`. Which makes for a concise name and gives you all necessary information at a single glance.

## Make your workflow better

As with many things, this isn't a silver bullet that solves all naming issues. There will always be things that come down to personal taste or a decision in your team.

Shallow nesting and modifiers are intended to give structure and added visual identification so you have more room to concentrate on your project. It's easy to learn and communicate across a team.

### Make this better

For larger projects, it can be useful to maintain a list of allowed and required states, variants, and screen sizes. It might make sense to create a Sketch add-on for this in the future that lints your document.

## Further reading

Brad Frost recently posted a new entry on his blog titled [Extending atomic design][extending], which goes into the details of why we should expand concepts to our needs. It also mentions [a post by Chris Cid][ions], suggesting ions as a designation for the modifiers used here. It also includes a nice list of states, etc which makes an excellent starting point to find out what your symbols and components may need.

[atomic-design]: http://bradfrost.com/blog/post/atomic-web-design/
[sketch]: https://www.sketch.com
[extending]: http://bradfrost.com/blog/post/extending-atomic-design/
[ions]: https://www.cjcid.com/articles/ions-introduction/
