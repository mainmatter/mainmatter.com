---
title: "Introducing Svelte Promise Modals"
authorHandle: zeppelin
tags: [svelte]
bio: "Gabor Babicz, Senior Software Engineer"
description: "TODO: fill this"
og:
  image: https://placehold.co/2750x1445

image: "/assets/images/posts/2023-11-28-sveltekit-storybook/header.jpg"
imageAlt: "2750x1445"
---

# Introducing Svelte Promise Modals

> TL;DR: Mainmatter released a library to implement modals in a few lines of
> code, following the async patterns that are already in your Svelte app. It's
> called Svelte Promise Modals and you can find it here:
> [svelte-promise-modals.com](https://svelte-promise-modals.com)

What's your favorite async pattern? I bet it's promises! They're so easy to use,
we tend to forget sometimes how hard life were when all we had were callbacks.

Let's unwrap async a bit. It's not the first thing that comes to our mind when
thinking about modal dialogs, right? But if we think about it, they are
obtaining user input, be it complex data or simple acknowledgment, which is
inherently async - similarly to fetching data from a server, but instead of API
calls, we get data back through a user interface.

I mean look at the similarities:

![Comparison of asyncness of sending a request and opening a modal dialog](/assets/images/posts/2024-03-22-introducing-svelte-promise-modals/async-comparison.png)

Now let's look at the common implementations for the above two, pretty similar
tasks:

Network request:

```js
<script>
async function clearShoppingList(id) {
	let result = await fetch('/api/lists/${id}/clear', {
		method: 'POST'
	});

	// ✂️...
}
</script>

<button on:click={clearShoppingList}>
	Clear Shopping List
</button>
```

Confirmation modal:

```html
{% raw %}
<script>
let isModalOpened = false;

function openConfirmationModal() {
	isModalOpened = true;
}

function handleConfirmModal() {
	isModalOpened = false;
	// ✂️...
}
</script>

<button on:click={openConfirmationModal}>
	Clear Shopping List
</button>

{#if isModalOpened}
	<Modal
		onConfirm={handleConfirmModal}
		onReject={() => isModalOpened = false}
	/>
{/if}
{% endraw %}
```

Despite all similarities in async-ness, their implementation differ greatly. Why
are we using ancient async patterns for modals such as callbacks and deal with
visibility state management ourselves? Wouldn't it be easier to just write
`let result = await openModal()` and get back the result of the user
interaction?

Sure it is, and now we can! Enter **Svelte Promise Modals**, that brings the
battle-tested _Ember Promise Modals_ to Svelte.

Let's write the above two async operations _together_ as we normally would, with
the ideal API in mind:

```js
async function clearShoppingList(id) {
  let confirmation = await openModal(ConfirmationModal, {
    text: "Are you sure you want to clear the shopping list?",
  });

  if (!confirmation) return;

  let result = await fetch("/api/lists/${id}/clear", {
    method: "POST",
  });
  // ✂️...
}
```

Much cleaner, huh? _Hint: this is exactly the API Svelte Promise Modal
provides._ No callbacks, no `isModalOpened` - everything is neatly organized.

Now that _our_ developer experience is fixed, we may want to think about our
users: what is one of the most common usability or accessibility issue with
modal dialogs? I think the answer is without doubt the lack of well-constrained
keyboard navigation. Imagine pressing the TAB key multiple times to jump between
inputs and buttons. What happens is when we reach the end of the modal dialog,
the next focusable element is likely will be in the document, _underneath the
modal_. Pressing TAB one too many time, and we're out of our modal, where we
really shouldn't be in that moment. Luckily, this fundamental use-case is
covered out of the box! With Svelte Promise Modals, every modal dialog's user
input is, well, _trapped_ by using the excellent library called `focus-trap`, to
ensure navigation between form elements won't accidentally leave our users
baffled. Pressing the TAB key only means that after the last input, the focus is
again on the first element _inside the modal_.

![Animated GIF showing tab cycle of focusable elements inside a modal dialog](/assets/images/posts/2024-03-22-introducing-svelte-promise-modals/focus-cycle.gif)

With both the developer and the user end of dealing with modal dialogs are
modern, usable and accessible, we think you'll love Svelte Promise Modals. There
are tons of stuff that's not covered in this blog post, so be sure to check out
the [website](https://svelte-promise-modals.com) and the
[README](https://github.com/mainmatter/svelte-promise-modals?tab=readme-ov-file)
to learn about passing and receiving data to and from the modal, animations,
type safety, and more!
