---
title: "A practical first look at the Svelte framework"
authorHandle: beerinho
tags: [svelte]
bio: "Daniel Beer"
description:
  "Taking a practical look at the Svelte framework by rebuilding the Ember super
  rentals app in SvelteKit."
og:
  image: /assets/images/posts/2022-11-18-sveltekit-super-rentals/og-image.jpg
tagline: |
  <p>As SvelteKit edges ever closer to its 1.0 release, let's take a look at what makes it unique and how it compares to EmberJS by recreating the Ember Super Rentals with SvelteKit.</p>

image: ""
imageAlt: ""
---

{% raw %} As with all new JS frameworks, there is a big buzz surrounding
SvelteKit, and for good reason, it’s still pre-1.0 but the underlying library -
SvelteJS - has been consistently popular since it emerged in 2019 (according to
the
[stateofjs polls](https://2021.stateofjs.com/en-US/libraries/front-end-frameworks))
and it looks like that popularity is only increasing.

And like all new JS frameworks, it’s also difficult to understand the benefits
and drawbacks of a new technology without getting hands-on with it, so that’s
exactly what this post intends to do.

The Svelte site has a nice
[Tutorial playground area](https://svelte.dev/tutorial/basics) that is useful to
understand the concepts behind the library. However, because it is focused on
the component side of Svelte (as opposed to the framework, SvelteKit), there
isn’t any formal guide to help you get up and running with a real world
application using SvelteKit. Thankfully, EmberJS has a fairly thorough
[Tutorial](https://guides.emberjs.com/release/tutorial/part-1/) that is great
for introducing the principles of the framework; so we will be cross-pollinating
and using SvelteKit to build the Ember-Super-Rentals demo app. And while we’re
at it, we can also draw some comparisons between the frameworks.

This is what we will have by the end of this tutorial:
![Screenshot of finished super-rentals app](/assets/images/posts/2022-11-18-sveltekit-super-rentals/finished-app.png)

I have broken this demo app down into the same chunks as is done in the Ember
Super Rentals tutorial, so feel free to follow along with both tutorials at the
same time.

You can also find snapshots of this tutorial as separate tags in the
[github repo](https://github.com/mainmatter/sveltekit-super-rentals/tags).

To see the final app on Netlify, click
[here](https://sveltekit-super-rentals.netlify.app/).

## Let’s get started

---

_Before we get started, I just want to reiterate the notices on the SvelteKit
documentation site. **This technology is not yet suggested for use in production
applications.** SvelteKit is still pre version 1.0 and therefore constantly
changing large parts of the framework; you can see the progress and upcoming
changes on the
[GitHub Discussions tab](https://github.com/sveltejs/kit/discussions?discussions_q=sort%3Atop)._

---

With that warning out of the way, let’s create a new blank SvelteKit project.

We’re going to skip TypeScript because, to quote Sweet Brown, “Ain’t nobody got
time for that”. The rest of it is fairly straightforward, we will create a new
project with the command:

```
npm create svelte@latest svelte-super-rentals
```

And when prompted, we will opt in for ESLint and Prettier to keep our code
looking nice and uniform.

We will also opt in for Playwright browser testing, unfortunately, we will be
skipping unit testing as there isn’t a cooked in way of doing that just yet -
there is some ongoing discussion on
[the topic](https://github.com/sveltejs/kit/discussions/5285) and hopefully a
decision will be made by the time SvelteKit hits 1.0.

```bash
Repos % npm create svelte@latest svelte-super-rentals

create-svelte version 2.0.0-next.158

Welcome to SvelteKit!

This is beta software; expect bugs and missing features.

Problems? Open an issue on https://github.com/sveltejs/kit/issues if none exists already.

✔ Which Svelte app template? › Skeleton project
✔ Add type checking with TypeScript? › No
✔ Add ESLint for code linting? … Yes
✔ Add Prettier for code formatting? … Yes
✔ Add Playwright for browser testing? … Yes

Your project is ready!
✔ ESLint
  https://github.com/sveltejs/eslint-plugin-svelte3
✔ Prettier
  https://prettier.io/docs/en/options.html
  https://github.com/sveltejs/prettier-plugin-svelte#options
✔ Playwright
  https://playwright.dev

Install community-maintained integrations:
  https://github.com/svelte-add/svelte-adders

Next steps:
  1: cd svelte-super-rentals
  2: npm install (or pnpm install, etc)
  3: git init && git add -A && git commit -m "Initial commit" (optional)
  4: npm run dev -- --open

To close the dev server, hit Ctrl-C

Stuck? Visit us at https://svelte.dev/chat

Repos % cd svelte-super-rentals

svelte-super-rentals % npm install

added 220 packages, and audited 221 packages in 13s

34 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

svelte-super-rentals % git init && git add -A && git commit -m "Initial commit"
Initialized empty Git repository in /Users/dan/Documents/Repos/svelte-super-rentals/.git/
[master (root-commit) 29ed85a] Initial commit
 16 files changed, 5003 insertions(+)
 create mode 100644 .eslintignore
 create mode 100644 .eslintrc.cjs
 create mode 100644 .gitignore
 create mode 100644 .npmrc
 create mode 100644 .prettierignore
 create mode 100644 .prettierrc
 create mode 100644 README.md
 create mode 100644 package-lock.json
 create mode 100644 package.json
 create mode 100644 playwright.config.js
 create mode 100644 src/app.html
 create mode 100644 src/routes/+page.svelte
 create mode 100644 static/favicon.png
 create mode 100644 svelte.config.js
 create mode 100644 tests/test.js
 create mode 100644 vite.config.js
svelte-super-rentals % npm run dev -- --open

> svelte-super-rentals@0.0.1 dev
> vite dev "--open"

  VITE v3.0.9  ready in 2475 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## PART 1

### Orientation:

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/1.1-orientation)

To keep this simple, we’re going to use the styles and assets from the
Ember-Super-Rentals app and just copy them over into our project. I won’t paste
them in here as the style sheet is pretty big and not worth the page space. If
you want to see it, feel free to check out the repo on GitHub.

The [Tomster image](https://guides.emberjs.com/downloads/teaching-tomster.png)
will go into a newly created `images` folder inside the `static` folder that was
created by SvelteKit.

The
[Styles](https://github.com/ember-learn/super-rentals/blob/super-rentals-tutorial-output/app/styles/app.css)
will also go in the `static` folder, but just in a file we will name `app.css`.

We will then update the `routes/+page.svelte` component so that we can see the
basic shape of the site as well as the image of the Tomster.

```html
// routes/+page.svelte

<div class="jumbo">
  <div class="right tomster" />
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <a href="/about" class="button"> About Us </a>
</div>
```

And when we serve the app we are greeted by the friendly face of Tomster but it
doesn’t do much yet.

![Screenshot of the state of the app after "orientation"](/assets/images/posts/2022-11-18-sveltekit-super-rentals/end-of-orientation.png)

Before we get into adding pages and components, I wanted a point out a couple of
small “quality of life” adaptations to make the workflow easier going forward.

I updated the playwright config to use a fixed port so that if we are running
the app (either through `npm run dev` or `npm run test`) we know which port we
will be on; I then updated the vite config to reflect that same port.

```js
// playwright.config.js

const config = {
  webServer: {
    command: "npm run build && npm run preview",
    // make sure to use the same port as the `preview` command
    port: 3000,
    // this is useful to allow the default port to be reused even if the port was accidentally left open when closing another terminal window
    reuseExistingServer: true,
  },
};
```

```js
// vite.config.js

import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  // make sure the `preview` command always uses port 3000 as it is used for the tests
  preview: {
    port: 3000,
    strictPort: true,
  },
  // I like to have both the preview and dev server on the same port so that I can run the tests within my IDE while in the dev environment
  server: {
    port: 3000,
    strictPort: true,
  },
};

export default config;
```

I also added the global styles sheet to the `app.html` so that the styles are
automatically applied to all pages and components, and I can use the global
classes from wherever needed.

```html
<!-- app.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <link rel="stylesheet" href="%sveltekit.assets%/app.css" />
    <meta name="viewport" content="width=device-width" />
    %sveltekit.head%
  </head>
  <body>
    <div>%sveltekit.body%</div>
  </body>
</html>
```

### Building pages:

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/1.2-building-pages)

---

Please do not try to send messages to the email on the contact page, I randomly
assigned the email address so your email won’t be seen by anyone and will most
likely just bounce back to you.

---

When it comes to creating routes, there isn’t the same extensive CLI that Ember
has, so instead we need to manually add the routes that we want in a folder
structure. So for this example we will be creating `+page.svelte`,
`about/+page.svelte` & `getting-in-touch/+page.svelte` inside the `routes`
folder. Although this isn’t a big pain, it would be nice to have something
similar to the `ember generate route` command that comes with Ember-CLI. I did
notice the
[VS Code plugin](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
offers a way to generate SvelteKit files, though I didn’t find this all that
useful.

![Screenshot of the sveltekit plugin for VS Code](/assets/images/posts/2022-11-18-sveltekit-super-rentals/sveltekit-plugin-vs-code.png)

In SvelteKit we are missing the ability to create a route and give it a
different name, so we need to be thoughtful about what we want the name of the
route to be when creating it, as it is a very manual process to adapt a route
name after it’s created.

```html
<!-- routes/about/+page.svelte -->

<div class="jumbo">
  <div class="right tomster" />
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <a href="/getting-in-touch" class="button"> Contact Us </a>
</div>
```

```html
<!-- routes/getting-in-touch/+page.svelte -->

<div class="jumbo">
  <div class="right tomster" />
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you
    <br />
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue
      <br />
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a>
    <br />
    <a href="mailto:superrentalsrep@sveltedemo.com">
      superrentalsrep@sveltedemo.com
    </a>
  </address>
  <a href="/about" class="button"> About </a>
</div>
```

SvelteKit has an interesting naming convention for routes; we can still have
nested routes and dynamic routes, but now that they have embraced the folder
based routing system, it means that each route has its own `+page.svelte` file;
so instead of having `index` and `about` route files, we have folders -
`+page.svelte` and `about/+page.svelte`. This has been discussed quite
thoroughly [here](https://github.com/sveltejs/kit/discussions/5748) and while
some people weren’t too happy with the decision to move so far from a standard
web routing structure, it does allow us to store server-side logic in the
conveniently named `+page.server.js` file (note: this is only run on the
server), as well as the `+page.js` file which is run both on the client during
browser navigation, and on the server during SSR. So you end up with a file
structure like this:

```bash
routes/
|- about-us/
  |- +page.svelte
  |- +page.server.js
  |- +page.js
```

Which can get a little annoying when you end up with tabs like this in your IDE:

![screenshot of pages in vs-code](/assets/images/posts/2022-11-18-sveltekit-super-rentals/pages-in-vs-code.png)

But hopefully the trade-off is worth it in exchange for the more concise file
structure

### Automated testing:

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/1.3-automated-testing)

[Playwright](https://playwright.dev/docs/intro) was added automatically when we
created our SvelteKit app and they seem to work great together.

There is already a single test that was created when we set up the app called
`tests/test.js`, we will replace the content of this soon, but for now let’s see
what happens when we run this test:

```bash
svelte-super-rentals % npm run test

> svelte-super-rentals@0.0.1 test
> playwright test

(node:38305) ExperimentalWarning: --experimental-loader is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

Running 1 test using 1 worker

  ✘  tests/test.ts:2:1 › about page has expected h1 (30s)

  1) tests/test.ts:2:1 › about page has expected h1 ================================================

    Timeout of 30000ms exceeded.

    page.textContent: Target closed
    =========================== logs ===========================
    waiting for selector "h1"
    ============================================================

        at file:///Users/dan/Documents/Repos/svelte-super-rentals/tests/test.ts:6:21
        at /Users/dan/Documents/Repos/svelte-super-rentals/node_modules/.pnpm/@playwright+test@1.21.1/node_modules/@playwright/test/lib/workerRunner.js:385:9
        at TestInfoImpl._runFn (/Users/dan/Documents/Repos/svelte-super-rentals/node_modules/.pnpm/@playwright+test@1.21.1/node_modules/@playwright/test/lib/testInfo.js:176:7)
        at /Users/dan/Documents/Repos/svelte-super-rentals/node_modules/.pnpm/@playwright+test@1.21.1/node_modules/@playwright/test/lib/workerRunner.js:341:26
        at TimeoutManager.runWithTimeout (/Users/dan/Documents/Repos/svelte-super-rentals/node_modules/.pnpm/@playwright+test@1.21.1/node_modules/@playwright/test/lib/timeoutManager.js:72:7)
        at TestInfoImpl._runWithTimeout (/Users/dan/Documents/Repos/svelte-super-rentals/node_modules/.pnpm/@playwright+test@1.21.1/node_modules/@playwright/test/lib/testInfo.js:164:26)
        at WorkerRunner._runTest (/Users/dan/Documents/Repos/svelte-super-rentals/node_modules/.pnpm/@playwright+test@1.21.1/node_modules/@playwright/test/lib/workerRunner.js:323:5)
        at WorkerRunner.runTestGroup (/Users/dan/Documents/Repos/svelte-super-rentals/node_modules/.pnpm/@playwright+test@1.21.1/node_modules/@playwright/test/lib/workerRunner.js:196:11)
        at process.<anonymous> (/Users/dan/Documents/Repos/svelte-super-rentals/node_modules/.pnpm/@playwright+test@1.21.1/node_modules/@playwright/test/lib/worker.js:94:5)

    Pending operations:
      - page.textContent at tests/test.ts:6:21

  Slow test file: tests/test.ts (30s)
  Consider splitting slow test files to speed up parallel execution

  1 failed
    tests/test.ts:2:1 › about page has expected h1 =================================================
```

As we would expect, this test is failing (after a while) because we are
expecting to find an `h1` on the page with the text “About this app”, which we
no longer have since we replaced the default content of the file with the HTML
for the Super Rentals app.

Now let’s update the test so that is passes.

```js
// tests/test.js

import { expect, test } from "@playwright/test";

test("about page has expected h2", async ({ page }) => {
  await page.goto("/about");
  expect(await page.textContent("h2")).toBe("About Super Rentals");
});
```

And as expected, the test will now pass.

```bash
svelte-super-rentals % npm run test

> svelte-super-rentals@0.0.1 test
> playwright test

(node:38567) ExperimentalWarning: --experimental-loader is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

Running 1 test using 1 worker

  ✓  tests/test.ts:2:1 › about page has expected h2 (878ms)

  1 passed (1s)
```

Now we can update the tests to check what we expect to see on the pages

```js
// tests/test.js

import { expect, test } from "@playwright/test";

test("visiting /", async ({ page }) => {
  // go to the index route
  await page.goto("/");
  // assert we are on the correct page
  expect(page).toHaveURL("/");
  // assert the title of the page is correct
  expect(await page.textContent("h2")).toBe("Welcome to Super Rentals!");
  // assert the text on the link is correct
  expect(await page.textContent(".jumbo a.button")).toBe("About Us");
  // click on the link to take us to the `about` page
  await page.locator(".jumbo a.button").click();
  // assert that we are on the correct page
  await expect(page).toHaveURL("/about");
});

test("visiting /about", async ({ page }) => {
  // go to the about route
  await page.goto("/about");
  // assert we are on the correct page
  expect(page).toHaveURL("/about");
  // assert the title of the page is correct
  expect(await page.textContent("h2")).toBe("About Super Rentals");
  // assert the text on the link is correct
  expect(await page.textContent(".jumbo a.button")).toBe("Contact Us");
  // click on the link to take us to the `getting-in-touch` page
  await page.locator(".jumbo a.button").click();
  // assert that we are on the correct page
  await expect(page).toHaveURL("/getting-in-touch");
});

test("visiting /getting-in-touch", async ({ page }) => {
  // go to the getting-in-touch route
  await page.goto("/getting-in-touch");
  // assert we are on the correct page
  expect(page).toHaveURL("/getting-in-touch");
  // assert the title of the page is correct
  expect(await page.textContent("h2")).toBe("Contact Us");
  // assert the text on the link is correct
  expect(await page.textContent(".jumbo a.button")).toBe("About");
  // click on the link to take us to the `about` page
  await page.locator(".jumbo a.button").click();
  // assert that we are on the correct page
  await expect(page).toHaveURL("/about");
});
```

Now we can rerun our tests and see that they have been updated and are passing

```bash
svelte-super-rentals % npm run test

> svelte-super-rentals@0.0.1 test
> playwright test

Running 3 tests using 1 worker

[WebServer] Generated an empty chunk: "hooks"
  ✓  1 tests/test.js:3:1 › visiting / (553ms)
  ✓  2 tests/test.js:18:1 › visiting /about (380ms)
  ✓  3 tests/test.js:33:1 › visiting /getting-in-touch (378ms)

  3 passed (4s)
```

Playwright also gives us the ability to pause our tests by adding this line into
our tests when we want to pause.

```js
await page.pause();
```

To resume the tests, open up the devTools console in the browser and run this
command:

```js
playwright.resume();
```

Otherwise you can use the
[Playwright inspector](https://playwright.dev/docs/inspector) to open a browser
along with a more in-depth console that will give you the ability to step
through your tests and see more detail about the current state of the DOM and
test.

---

This confused me at first as Playwright will stop at each `await` so you will
need to manually step through the test until you find the part that you want to
stop it. It is quite intuitive once you realise it might not have paused where
you expected to begin with.

---

To open the inspector when running the tests, be sure to specify the `PWDEBUG=1`
flag when running the tests:

```bash
PWDEBUG=1 npm run test
```

### Component basics:

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/1.4-component-basics)

Similar to the routes, there is no command to generate components for us, so we
will create the `src/components` folder along with the
`src/components/jumbo.svelte` and `src/components/nav-bar.svelte` component
files

```html
<!-- components/jumbo.svelte -->

<div class="jumbo">
  <div class="right tomster" />
  <slot />
</div>
```

The `<slot/>` here is similar to the `{{yield}}` in Ember, it allows us to use
this component as a wrapper for more HTML to be passed in from the parent.

```html
<!-- components/nav-bar.svelte -->

<nav class="menu">
  <a href="/" class="menu-index">
    <h1>SuperRentals</h1>
  </a>
  <div class="links">
    <a href="/about" class="menu-about"> About </a>
    <a href="/getting-in-touch" class="menu-contact"> Contact </a>
  </div>
</nav>
```

I then added the alias to the svelte config to make importing files easier -
this means instead of having a mess of `../../../..` in the module imports, we
can use `@components` when importing a component into another file

```js
// svelte.config.js

import adapter from "@sveltejs/adapter-auto";
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // to make it easier to handle module imports, we alias them here
    alias: {
      "@components": path.resolve("./src/components"),
    },
  },
};

export default config;
```

Then we will update our usage of these components in our routes

```html
<!-- routes/+page.svelte -->

<script>
  import Jumbo from "@components/jumbo.svelte";
</script>

<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <a href="/about" class="button">About Us</a>
</Jumbo>
```

```html
<!-- routes/about/+page.svelte -->

<script>
  import Jumbo from "@components/jumbo.svelte";
</script>

<Jumbo>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <a href="/getting-in-touch" class="button">Contact Us</a>
</Jumbo>
```

```html
<!-- routes/getting-in-touch/+page.svelte -->

<script>
  import Jumbo from '@components/jumbo.svelte'
</script>

<Jumbo>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br />
    <a href="mailto:superrentalsrep@sveltedemo.com">superrentalsrep@sveltedemo.com</a>
  </address>
  <a href="/about" class="button">About</a>
</Jumbo>
```

As you can see, another difference between SvelteKit and Ember is that Ember has
chosen to separate the template from the component logic, whereas Svelte has
opted for the single file approach (although this will be added to Ember soon:
the
[RFC](https://github.com/emberjs/rfcs/blob/master/text/0779-first-class-component-templates.md#sfcs)
has already been approved and merged and we are just waiting for it to be
released now).

In terms of component usage, both Ember and Svelte have a similar approach but
slightly differing syntax. Both have opted for more native-looking HTML - Ember
using HBS, while Svelte has opted to extend native HTML and allow us to write
pure JavaScript in the template. Coming from Ember I found this aspect of Svelte
to be quite easy to get to grips with, though the naming of component attributes
can get a little confusing as there is no `@` syntax that Ember uses, so instead
of `@image` you would have `image`. I’ll discuss this more in the next section
“More about components”.

Another big difference between the two is that components are always available
in Ember and you can simply invoke them in the template, whereas in SvelteKit
you need to import the component in the script tag before you can use it in the
template. I like the simplicity of Ember’s approach, but it does mean you can
end up with quite long component names if your app has a lot of component
nesting - i.e. `<Ui::Layout::Foo::Bar::TwoColumn::AwesomeComponent/>` - whereas
you likely don’t have this problem in Svelte because you can simply change the
name of the component when you import it - i.e.

```html
<script>
  import AwesomeComponent from "@components/ui/layout/foo/bar/two-column/awesome-component.svelte";
</script>

<AwesomeComponent />
```

---

_Note: The
[RFC](https://github.com/emberjs/rfcs/blob/master/text/0779-first-class-component-templates.md)
which proposes to add this to Ember has been approved and merged and we are now
just awaiting the release._

---

It can be argued that Svelte’s approach could lead to more confusion as the
names can change depending on how they are imported, meaning it’s not
immediately obvious which component is which; although this isn't the strongest
argument as this issue could easily be mitigated by using good naming
conventions or implementing a lint rule for this.

We also created the `<NavBar>`, which we want to be visible on all pages,
instead of adding it individually to each page component, we will create a
`+layout.svelte` component instead. The layout component sits in the nesting
structure just like the `pages` and will apply a layout to all children routes
unless otherwise specified.

```html
<!-- routes/+layout.svelte -->

<script>
  import NavBar from "@components/nav-bar.svelte";
</script>

<NavBar />
<slot />
```

As mentioned, this will apply the `<NavBar/>` to all pages. The `<slot/>` is
required and is similar to the `{{outlet}}` in Ember, which allows child routes
to render content into a specific area of the parent route.

If we wanted a different layout for just the `about` page, we could create
another layout in `routes/about/+layout.svelte` and that would not impact the
other routes, but would apply a separate layout to all routes nested with
`/about`.

SvelteKit doesn’t come with a library for testing standalone components but we
did opt to include Playwright when setting up the project. I initially wanted to
implement Playwright’s experimental Component Testing library, but as of the
time of writing this, there are issues with the library that mean I wasn’t able
to use it in this project (there are other options for unit testing including
[Vitest](https://vitest.dev/guide/) but for the sake of brevity I’ll just stick
to e2e testing using Playwright for this example).

Instead of writing out the code, let’s try and use
[Playwright’s test generator](https://playwright.dev/docs/codegen) with the
command:

_Note: make sure your app is already running on the port specified_

```bash
npx playwright codegen localhost:3000
```

or by using the “Testing” tab in VS Code to “Record new test…” with the
[Playwright add-on](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
installed. You can then click around your app and you will notice that all of
your mouse and keyboard actions are captured and you will end up with an output
in the Playwright inspector that looks something like this

```js
// Go to http://localhost:3000/
await page.goto("http://localhost:3000/");
// Click nav >> text=About
await page.locator("nav >> text=About").click();
await expect(page).toHaveURL("http://localhost:3000/about");
// Click nav >> text=Contact
await page.locator("nav >> text=Contact").click();
await expect(page).toHaveURL("http://localhost:3000/getting-in-touch");
// Click h1:has-text("SuperRentals")
await page.locator('h1:has-text("SuperRentals")').click();
await expect(page).toHaveURL("http://localhost:3000/");
```

Let’s just clean it up a little so we aren’t referencing http://localhost:3000
directly (referencing localhost:3000 will still work but it just means we will
always have to use port 3000 for our tests which could cause issues)

```js
// Go to the index route
await page.goto("/");
// Click nav >> text=About
await page.locator("nav >> text=About").click();
await expect(page).toHaveURL("/about");
// Click nav >> text=Contact
await page.locator("nav >> text=Contact").click();
await expect(page).toHaveURL("/getting-in-touch");
// Click h1:has-text("SuperRentals")
await page.locator('h1:has-text("SuperRentals")').click();
await expect(page).toHaveURL("/");
```

While using the Playwright test generator, I loved the simplicity of being able
to use the UI to test the things that I wanted to assure were actually working
in the UI, so from this aspect I found it really useful. The main downside I
found to using the test generator was that it wasn’t so simple to test that
something was visible. To get around this it required clicking on a
non-interactive element and then adjusting the test to test the content rather
than just clicking on the element.

### More about components

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/1.5-more-about-components)

Now let’s create some components that will receive parameters to be handled by
the component.

```html
<!-- components/rental/image.svelte -->

<script>
  export let src;
  export let alt;
</script>

<div class="image">
  <img {src} {alt} />
</div>
```

A big difference between Ember and SvelteKit here is that Svelte requires you to
express which parameters are expected by the component using the `export let`
syntax. Coming from a JS background, it’s a little confusing to use `export` in
this way, but in general I prefer having to define the parameters over Glimmers'
way of have the `this.args` object that can be of any shape. Though this can get
confusing in Svelte when you have bigger components with more internal as well
as external attributes, with Svelte it isn’t always clear if the attribute is
external or internal, whereas the `@`/`this` syntax used in Ember gives a
clearer distinction here.

`<img {src} {alt} />` is making use of Svelte’s shorthand mechanism: if the
attribute you are setting has the same name as the variable, you can omit the
element attribute and Svelte will figure it out for you. This could also be
expressed as `<img src={src} alt={alt} />`.

Using the new `<RentalImage>` component, let’s create the `<Rental>` component,
which will just be hardcoded for now to give is some information to see on
screen.

```html
<!-- components/rental/index.svelte -->

<script>
  import RentalImage from "./image.svelte";
</script>

<article class="rental">
  <RentalImage
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Grand Old Mansion"
  />
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <div class="detail owner"><span>Owner:</span> Veruca Salt</div>
    <div class="detail type"><span>Type:</span> Standalone</div>
    <div class="detail location"><span>Location:</span> San Francisco</div>
    <div class="detail bedrooms"><span>Number of bedrooms:</span> 15</div>
  </div>
</article>
```

And then add a few of these to the `index` page of our app.

```diff-js diff-highlight
// routes/+page.svelte

<script>
  import Jumbo from '@components/jumbo.svelte';
+ import Rental from '@components/rental/index.svelte';
</script>

<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <a href="/about" class="button">About Us</a>
</Jumbo>

+<div class="rentals">
+  <ul class="results">
+    <li><Rental /></li>
+    <li><Rental /></li>
+    <li><Rental /></li>
+  </ul>
+</div>
```

### Interactive components

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/1.6-interactive-components)

Now let’s add the ability to toggle the size of the image on click.

```html
<!-- components/rental/image.svelte -->

<script>
  export let src;
  export let alt;

  let isLarge = false;

  function onToggleSize() {
    isLarge = !isLarge;
  }
</script>

{#if isLarge}
<button on:click="{onToggleSize}" class="image large">
  <img {src} {alt} />
  <small>View Smaller</small>
</button>
{:else}
<button on:click="{onToggleSize}" class="image">
  <img {src} {alt} />
  <small>View Larger</small>
</button>
{/if}
```

This syntax will look very similar to that of Ember, with a few minor changes:
instead of relying on Glimmer’s `{{on}}` modifier, we user Svelte’s `on:`
modifier. Then instead of using an `@action` to link the template to the JS as
we would in Ember, we simply call a regular JS function.

But as you can see, the conditional syntax is very similar, where Ember has

```js
{{#if this.thing}}
  show thing
{{else}}
  show other thing
{{/if}}
```

Svelte has

```js
{#if thing}
  show thing
{:else}
  show other thing
{/if}
```

### Reusable components

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/1.7-reusable-components)

Now, let’s add an external API. For this we will need a Mapbox account and to
create an access token. You can do so [here](https://www.mapbox.com/signup/).

Because we don’t have the full `environment` config that is present in Ember
applications, we will need to store our Mapbox access token elsewhere. We could
do this in a number of places (e.g. in a store, or in the component) but for
this example, we will use the suggested route. We will create a `.env` file in
the root of our project and add `PUBLIC_MAPBOX_TOKEN = 'your_access_token’`. It
is also important to start the key with `PUBLIC_` so that SvelteKit is aware
that this token is public and will bundle it with all other static public keys
that can be accessed through `'$env/static/public'`(for more information, read
[here](https://kit.svelte.dev/docs/modules#$env-static-public)).

Now that we have the access token stored in our app, we can use it in our new
`<Map>` component

```html
<!-- components/map.svelte -->

<script context="module">
  import { PUBLIC_MAPBOX_TOKEN } from "$env/static/public";
  const MAPBOX_API =
    "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static";
</script>

<script>
  export let lat;
  export let lng;
  export let height;
  export let width;
  export let zoom;
  export let alt = `Map image at coordinates ${lat},${lng}`;

  $: src = `${MAPBOX_API}/${lng},${lat},${zoom}/${width}x${height}@2x?access_token=${PUBLIC_MAPBOX_TOKEN}`;
</script>

<div class="map">
  <img {alt} {src} {width} {height} />
</div>
```

---

As you can see, the `img` tag uses the shorthand that was explained earlier in
the “More about components” section.

---

There are a couple of things to unwrap in this component. The first is that we
have two `script` tags: the first has `context="module"`, which means it is only
instantiated once in the application and the variables will not change. This is
useful because the `token` and `MAPBOX_API` attributes will be the same for
every instantiation of the component within our app.

The second `script` is not a module, which means the properties within it can
change between instances. This is important as we will be using this component
in multiple places to show the different locations of our rentals.

The next big difference is the `$` - this defines a computed property which will
be updated and cause a re-render in the component when it changes. This is very
similar to a `get` in Ember or a `@tracked` property in Glimmer.

So in Ember this line would look like:

```js
get src(){
  return `${MAPBOX_API}/${this.args.lng},${this.args.lat},${this.args.zoom}/${this.args.width}x${this.args.height}@2x?access_token=${PUBLIC_MAPBOX_TOKEN}`
}
```

or

```js
@tracked
  src = `${MAPBOX_API}/${this.args.lng},${this.args.lat},${this.args.zoom}/${this.args.width}x${this.args.height}@2x?access_token=${PUBLIC_MAPBOX_TOKEN}`
```

_(I noticed that none of this was actually required as the attributes don’t ever
change after the component is rendered, so this could be a variable on the
component, but to keep this tutorial in line with the Ember Super Rentals
tutorial, we’ll keep it this way.)_

We can then add this new Map component to the bottom of the `article` on our
`<Rental>` component:

```html
<!-- components/rental/index.svelte -->

<script>
  import RentalImage from './image.svelte';
  import Map from '@components/map.svelte';
</script>

<article class="rental">
  ...
  </div>
  <Map
    lat="37.7749"
    lng="-122.4194"
    zoom="9"
    width="150"
    height="150"
    alt="A map of Grand Old Mansion"
  />
</article>
```

(For now we will just hardcode the details of the map component.)

Finally, let’s update our index page test to expect to see three of these
components

```js
// tests/test.js

...
test('visiting /', async ({ page }) => {
  ...
  // assert the title of the page is correct
  expect(await page.textContent('h2')).toBe('Welcome to Super Rentals!');
  // assert the map images are visible
  await expect(page.locator('.map img')).toHaveCount(3);
  ...
});
```

### Working with Data

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/1.8-working-with-data)

Now we have some nice-looking components but they’re not very interesting yet.
The component is hardcoded with the rental information which means we just have
three of the same thing visible. So lets start populating our app with some
dynamic data - usually this would be populated from a server, but we will be
sticking with the Ember-super-rentals tutorial and store it inside our app as
JSON files, you can download the required files
[here](https://guides.emberjs.com/downloads/data.zip).

As this data isn’t going to change, and we want it to be available in our app
build, I’m going to store it inside the `static` directory in a new folder
called `api` alongside our `images` folder. (You can call this folder whatever
you like, “api” isn’t a special name here), then inside the folder we will have
our rentals data:

```
static/
  api/
    rentals.json
    rentals/
      downtown-charm.json
      grand-old-mansion.json
      urban-living.json
```

I’ve used the slugs of each rental as the name to make it easier to reference
and retrieve the file when we “load” the data.

As with the `@components` alias, I’ll add the same for the api files to make
them easier to reference.

```js
// svelte.config.js

  ...
  alias: {
    '@api': path.resolve('./static/api'),
    '@components': path.resolve('./src/components')
  }
  ...
```

Now we can introduce one of the strengths of SvelteKit, the `+page.server.js`
file. This can be added to any page in your application that needs to trigger
something on the server - usually loading/saving data. And this is only run on
the server, which means you can expose sensitive credentials here without the
client ever knowing about them. We don’t have any sensitive information in our
app but it also gives us the benefit of having all of the data loaded and in the
page source which means that search engine bots are able to crawl it easier,
increasing its SEO score.

```js
// routes/+page.server.js

import * as rentalsJson from "@api/rentals.json";

const COMMUNITY_CATEGORIES = ["Condo", "Townhouse", "Apartment"];

export const load = () => {
  const rentals = rentalsJson.data.map(value => {
    const { id, attributes } = value;
    let type = "Community";

    if (!COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = "Standalone";
    }

    return { id, type, ...attributes };
  });

  if (rentals) {
    return { rentals };
  }
};
```

---

The `load` function is used to load the relevant data for the page and should
return an object of the data but can also return a redirect or an error. In this
scenario, we are mapping the rentals from the `static/api/rentals.json` and
adding the `type` attribute.

---

Then to make it available in the page template, we can add it as an expected
import in the `+page.svelte` file and then replace the hardcoded rentals in the
template.

```diff-js
// routes/+page.svelte

<script>
  ...
  export let data;
</script>

...
  <ul class="results">
-    <li><Rental /></li>
-    <li><Rental /></li>
-    <li><Rental /></li>
+    {#each data.rentals as rental}
+      <li><Rental {rental} /></li>
+    {/each}
  </ul>
...
```

Coming from an Ember background, the `each` block in the template looks very
familiar and achieves the same goal, looping through the array of rentals and
passing each rental into the Rental component.

We can then update the `<Rental>` component to receive the rental and use its
attributes to display the details of the rental instead of the hardcoded data we
had before

```diff-js
// components/rental/index.svelte

<script>
  import RentalImage from './image.svelte';
  import Map from '@components/map.svelte';

+  export let rental
</script>

<article class="rental">
-  <RentalImage
-    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
-    alt="A picture of Grand Old Mansion"
-  />
+  <RentalImage src={rental.image} alt={rental.description} />
    <div class="details">
-    <h3>Grand Old Mansion</h3>
+    <h3>{rental.title}</h3>
    </div>
    <div class="detail owner">
-      <span>Owner:</span> Veruca Salt
+      <span>Owner:</span> {rental.owner}
    </div>
    <div class="detail type">
-      <span>Type:</span> Standalone
+      <span>Type:</span> {rental.type}
    </div>
    <div class="detail location">
-      <span>Location:</span> San Francisco
+      <span>Location:</span> {rental.city}
    </div>
    <div class="detail bedrooms">
-      <span>Number of bedrooms:</span> 15
+      <span>Number of bedrooms:</span> {rental.bedrooms}
    </div>
  </div>
  <Map
-    lat="37.7749"
-    lng="-122.4194"
+    lat={rental.location.lat}
+    lng={rental.location.lng}
    zoom="9"
    width="150"
    height="150"
-    alt="A map of Grand Old Mansion"
+    alt="A map of {rental.title}"
  />
</article>
```

![Screenshot of the current state of the app](/assets/images/posts/2022-11-18-sveltekit-super-rentals/end-of-part-1.png)

And now we have a lovely looking index page that shows us the data for each of
our rentals.

Next stop: individual rental pages.

## PART 2

### Route params

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/2.1-route-params)

To be able to show details of an individual rental, we will be using route
params to decide which rental we need to load the data for; for this we will
need to create a new route - `rentals/[slug]/+page.svelte` - the square brackets
here mean that this section of the url is dynamic, it can be named anything we
want, but I think “slug” makes the most sense here. And because we need to load
the data for the rental, we will also be creating a
`rentals/[slug]/+page.server.js` file.

```js
// rentals/[slug]/+page.server.js

const COMMUNITY_CATEGORIES = ["Condo", "Townhouse", "Apartment"];

export async function load({ params }) {
  const rentals = import.meta.glob("@api/rentals/*.json");
  let rental = null;
  for (const key of Object.keys(rentals)) {
    if (key.includes(params.slug)) {
      rental = rentals[key];
    }
  }
  if (rental) {
    const { data } = await rental();
    const { attributes } = data;
    let type;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = "Community";
    } else {
      type = "Standalone";
    }

    return { rental: { ...attributes, type } };
  }
}
```

We are using the `load` function just as we did in the last section, but this
time `load` receives an object with the attribute `{ params }` and inside that
object we can find all of the parameters from the route, in this case we are
just interested in the `slug` as this is what we will use to find the current
rental.

Because of the way that the imports are handled on the server, we aren’t able to
access a file using a dynamic name directly, so what we do here instead is get
all of the files from `@api/rentals/*.json` and then go through that array to
find the rental of the route we are currently on.

---

This isn’t ideal, and the loading would normally be done by our back-end, but
for the limited number of rentals we have, this works nicely.

---

We can then create a page to display this data

```html
<!-- routes/rentals/[slug]/+page.svelte -->

<script context="module">
  import Jumbo from "@components/jumbo.svelte";
  import Map from "@components/map.svelte";
  import RentalImage from "@components/rental/image.svelte";
</script>

<script>
  export let data;
  let rental = data.rental;
</script>

<Jumbo>
  <h2>{rental.title}</h2>
  <p>Nice find! This looks like a nice place to stay near {rental.city}.</p>
  <a
    href="#"
    target="_blank"
    rel="external nofollow noopener noreferrer"
    class="share button"
  >
    Share on Twitter
  </a>
</Jumbo>

<article class="rental detailed">
  <RentalImage src="{rental.image}" alt="A picture of {rental.title}" />

  <div class="details">
    <h3>About {rental.title}</h3>

    <div class="detail owner">
      <span>Owner:</span>
      {rental.owner}
    </div>
    <div class="detail type">
      <span>Type:</span>
      {rental.type} – {rental.category}
    </div>
    <div class="detail location">
      <span>Location:</span>
      {rental.city}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span>
      {rental.bedrooms}
    </div>
    <div class="detail description">
      <p>{rental.description}</p>
    </div>
  </div>

  <map
    lat="{rental.location.lat}"
    lng="{rental.location.lng}"
    zoom="12"
    width="894"
    height="600"
    alt="A map of {rental.title}"
    styleClass="large"
  />
</article>
```

As before, we’ll use a `script` tag with `context=”module”` to import things
that won’t change between instances of the page, and a `script` without the
context for the attributes that can change. You’ll notice here that we are
expanding the `data` object and assigning `data.rental` to its own property to
make it easier to reference in the template. We will implement the “Share on
Twitter” button later so this is just a placeholder for now.

We also need to be able to add a class to the `<Map>` component so that it can
be styled from the parent, so to do this we will add a new attribute to the
component.

```diff-js
// components/map.svelte

  ...
  export let alt = `Map image at coordinates ${lat},${lng}`;
+ export let styleClass = '';

  $: src = `${MAPBOX_API}/${lng},${lat},${zoom}/${width}x${height}@2x?access_token=${token}`;
</script>

- <div class="map">
+ <div class="map {styleClass}">
    <img {alt} {src} {width} {height} />
  </div>
...
```

This allows us to add a class to the component from the parent, but because the
class encapsulation doesn’t work here, we still need to use a global class (like
the ones we defined in the `global.css`) or use the `:global()` css selector
which means we need to be careful to make this selector specific so it doesn’t
leak into other styles. This emphasised how useful Glimmer’s `...attributes`
syntax is, where you can simply pass any attributes you want from parent to
child component.

To give users access to the individual rental detail page, we will update the
`<Rental>` component to contain a link to the rental detail page

```diff-js
// components/rental/index.svelte

  ...
  <div class="details">
-    <h3>{rental.title}</h3>
+    <h3>
+      <a href="rentals/{rental.id}">
+        {rental.title}
+      </a>
+    </h3>
  </div>
  <div class="detail owner">
  ...
```

I personally prefer to use `slug` for a human-readable identifier, whereas the
Ember-super-rentals tutorial references this as the `id`, so here we are linking
to the `rentals/{rental.id}` which equates to `rentals/grand-old-mansion` as an
example.

Finally, we will add a couple of new tests to test this new functionality

```js
// tests/test.js

...
test('viewing the details of a rental property', async ({ page }) => {
  // Go to the index route
  await page.goto('/');
  // Assert there there 3 properties displayed
  await expect(page.locator('.rental')).toHaveCount(3);

  // Click on a rental
  await page.locator('text=Grand Old Mansion').click();
  // Assert it has taken you to the rental page
  await expect(page).toHaveURL('/rentals/grand-old-mansion');
});

test('visiting /rentals/grand-old-mansion', async ({ page }) => {
  // Go to the rental page
  await page.goto('/rentals/grand-old-mansion');
  // Assert we are on the current URL
  await expect(page).toHaveURL('/rentals/grand-old-mansion');

  // Assert the nav exists
  await expect(page.locator('nav')).toBeVisible();
  // Assert the main title is still correct
  expect(await page.textContent('h1')).toBe('SuperRentals');
  // Assert the page title has the correct text
  expect(await page.textContent('h2')).toBe('Grand Old Mansion');
  // Assert the rental detail area is visible
  await expect(page.locator('.rental.detailed')).toBeVisible();
});
```

### Service injection

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/2.2-service-injection)

Let’s continue by replacing that placeholder “Share to Twitter” button we
created in the last section with a real, working button that can share a tweet
to Twitter. First, we’ll create a new component to house all of this Twitter
logic

```js
// components/share-button.svelte

<script>
  import { onMount } from 'svelte';

  const TWEET_INTENT = 'https://twitter.com/intent/tweet';

  export let text
  export let hashtags
  export let via

  let shareURL;

  onMount(() => {
    let url = new URL(TWEET_INTENT);

    url.searchParams.set('url', window.location.href);

    if (text) {
      url.searchParams.set('text', text);
    }

    if (hashtags) {
      url.searchParams.set('hashtags', hashtags);
    }

    if (via) {
      url.searchParams.set('via', via);
    }

    shareURL = url.href;
  });
</script>

<a href={shareURL} target="_blank" rel="external nofollow noopener noreferrer" class="share button">
  <slot />
</a>
```

---

The `onMount` function here is very similar to Glimmer components' constructors,
this is where you store the logic that needs to run before the component is
rendered, in this scenario we will be populating the URL that we will need to
create a tweet to share the rental we are looking at.

---

We will replace the placeholder with this new component on the `rentals/[slug]`
page

```diff-js
// routes/rentals/[slug]/+page.svelte

...
  import RentalImage from '@components/rental/image.svelte';
+ import ShareButton from '@components/share-button.svelte'
...

...
-  <a href="#" target="_blank" rel="external nofollow noopener noreferrer" class="share button">
-    Share on Twitter
-  </a>
+  <ShareButton
+    text="Check out {rental.title} on Super Rentals!"
+    hashtags="vacation,travel,authentic,blessed,superrentals"
+    via="sveltejs"
+  >
+    Share on Twitter
+  </ShareButton>
...
```

And finally we will extend the ‘viewing the details of a rental property’ test
to check for this button

```diff-js
// tests/test.js

...
test('viewing the details of a rental property', async ({ page }) => {
  ...
  // Click on a rental
  await page.locator('text=Grand Old Mansion').click();

+  // Assert that the share button is visible and has the correct attributes
+  expect(await page.textContent('.share.button')).toBe('Share on Twitter');
+  const href = await page.getAttribute('.share.button', 'href');
+  const tweetURL = new URL(href);
+  expect(tweetURL.host).toBe('twitter.com');
+  expect(tweetURL.searchParams.get('url')).toBe(`${[page.url()]}`);

  // Assert it has taken you to the rental page
  await expect(page).toHaveURL('/rentals/grand-old-mansion');
  ...
```

In the Ember-super-rentals tutorial, there are steps about how to get the Router
service to allow these tests to pass, but the Router service doesn’t exist in
SvelteKit in the same way it does in Ember, so we don’t require anything special
for the tests; Playwright does give us access to the `page` attribute in the
tests, so it’s nice and simple to grab the current URL from there to compare
instead of needing to go through the router.

### Ember Data

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/2.3-ember-data)

Because we are not using Ember Data, this part of the tutorial can be skipped

### Provider components

[Repo](https://github.com/mainmatter/sveltekit-super-rentals/tree/2.4-provider-components)

And to round things off, we will be adding the ability to filter our rentals
based on a text search.

Because we essentially already have the index route as a component, we won’t
need to separate out the rentals into their own component as we can easily keep
track of the searchQuery directly in the index route.

```html
<!-- components/rentals-filter.svelte -->

<script>
  export let rentals;
  export let query;

  // we want to make the query lowercase and remove trailing/leading spaces
  $: sanitisedQuery = query.toLowerCase().trim();

  $: results = query
    ? rentals.filter(rental => {
        return rental.title.toLowerCase().includes(sanitisedQuery);
      })
    : rentals;
</script>

<slot {results} />
```

So here we are expecting an array of rentals and a query, then doing some very
basic sanitisation on the query, then if there is a query (it’s not blank or
undefined) we will filter the rentals based on the sanitisedQuery and then pass
back the results. This is very similar to Ember in the way we can pass a
property back to the parent component by setting `{{yield results}}`.

We can then update the index page to keep track of the query and utilise the new
`<RentalsFilter>` component to display only the filtered rentals

```diff-js
// routes/+page.svelte

<script>
  import Jumbo from '@components/jumbo.svelte';
  import Rental from '@components/rental/index.svelte';
+  import RentalsFilter from '@components/rentals-filter.svelte';

  export let data;

+  let query = '';
</script>

...
<div class="rentals">
-  <ul class="results">
-    {#each data.rentals as rental}
-      <li><Rental {rental} /></li>
-    {/each}
-  </ul>
+  <label>
+    <span>Where would you like to stay?</span>
+    <input class="light" bind:value={query} />
+  </label>
+
+  <RentalsFilter {query} rentals={data.rentals} let:results>
+    <ul class="results">
+      {#each results as rental}
+        <li><Rental {rental} /></li>
+      {/each}
+    </ul>
+  </RentalsFilter>
</div>
...
```

Svelte doesn’t have anything like an `<Input>` component, so we will be using
the standard HTML element and use Svelte’s `bind` property to bind our `query`
property to the `value` of the input. We then receive the `results` from the
`<RentalsFilter>` component using `let:results` and using it in a similar way to
Ember’s `<RentalFilters as |results|>` , you can learn more about slot props
[here](https://svelte.dev/tutorial/slot-props).

Finally, we will add a couple more tests to cover the new functionality and then
we are finished!

```js
// tests/test.js

...
test('the index page renders all given rental properties by default', async ({ page }) => {
  // Go to the index page
  await page.goto('/');
  // Assert we are on the current URL
  await expect(page).toHaveURL('/');

  // assert all rentals are loaded correctly
  expect(page.locator('.rentals')).toBeVisible();
  expect(page.locator('.rentals input')).toBeVisible();
  expect(page.locator('.rentals .results')).toBeVisible();
  expect(page.locator('.rentals .results li')).toHaveCount(3);

  expect(await page.textContent('.rentals .results li:nth-of-type(1) h3')).toBe(
    'Grand Old Mansion'
  );
  expect(await page.textContent('.rentals .results li:nth-of-type(2) h3')).toBe('Urban Living');
  expect(await page.textContent('.rentals .results li:nth-of-type(3) h3')).toBe('Downtown Charm');
});

test('the index page updates the results according to the search query', async ({ page }) => {
  // Go to the index page
  await page.goto('/');
  // Assert we are on the current URL
  await expect(page).toHaveURL('/');

  // assert all rentals are loaded correctly
  expect(page.locator('.rentals')).toBeVisible();
  expect(page.locator('.rentals input')).toBeVisible();
  expect(page.locator('.rentals .results')).toBeVisible();
  expect(page.locator('.rentals .results li')).toHaveCount(3);

  // Fill input
  await page.locator('input').fill('Mansion');

  // assert that there is only one result and that its title includes the word "mansion"
  expect(page.locator('.rentals .results li')).toHaveCount(1);
  expect(await page.textContent('.rentals .results li h3')).toBe('Grand Old Mansion');

  // Fill input with new search term
  await page.locator('input').fill('DownTown');

  // assert that there is only one result and that its title includes the word "downtown"
  expect(page.locator('.rentals .results li')).toHaveCount(1);
  expect(await page.textContent('.rentals .results li h3')).toBe('Downtown Charm');
});
```

And there we have it, SvelteKit Super Rentals! (It's not covered as part of this
tutorial, but you can see the final version deployed to Netlify
[here](https://sveltekit-super-rentals.netlify.app/))

### Final Thoughts

I really enjoyed getting stuck in with SvelteKit and I can certainly see the
appeal of it. It’s a very lightweight framework and in a lot of ways it stays
very close to native JavaScript, which makes me think it would be a really great
first framework for people that are new to front-end development, because it
gives you a great understanding of how JavaScript works in a lot of scenarios,
which will only help when trying out other frameworks in the future. I feel this
is almost the opposite of Ember: there are a lot of areas of the framework where
Ember does the heavy lifting for you, which is great for large applications, but
possibly not the best place to start if you want to build a base knowledge of
the underlying technologies.

There were a few areas I did think SvelteKit could learn from Ember though. I
find writing tests is much more enjoyable in Ember, and I think that shines a
light on SvelteKit’s test suite as a whole. Ember’s qunit integration allows for
a very simple way to cover your app with unit, integration and acceptance tests,
whereas SvelteKit only has a cooked-in integration with Playwright, which
currently doesn’t offer a simple way to run unit tests. Although I have to
admit, the Playwright test generator is very cool and certainly streamlines the
test process.

Ember Data is a very useful way of knowing the structure of the data coming from
your BE without needing to use TypeScript - TypeScript can be used natively with
SvelteKit but does come with the standard overhead that TypeScript brings (e.g.
native web properties that aren’t correctly typed/typed at all).

Thank you very much for reading, I hope you enjoyed this dive into SvelteKit.

You can see the full repo here:
[https://github.com/mainmatter/sveltekit-super-rentals/](https://github.com/mainmatter/sveltekit-super-rentals/tags)

And the breakdown of the individual parts here:
[https://github.com/mainmatter/sveltekit-super-rentals/tags](https://github.com/mainmatter/sveltekit-super-rentals/tags)
{% endraw %}
