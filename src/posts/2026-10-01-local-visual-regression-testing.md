---
title: "Local visual regression testing"
authorHandle: paoloricciuti
tags: [mcp, ai]
customCta: "global/svelte-cta.njk"
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "Give your agents a window into your application and yourself peace of mind"
autoOg: true
tagline: <p>Give your agents a window into your application and yourself peace of mind</p>
---

The first time I tried the `frontend-design` skill from Anthropic I was amazed by the designs it could generate. When working on a greenfield personal project I can rarely produce nice designs because, while I can totally reproduce a design when given one, coming up with a design of my own it's not my strongest suit.

Luckily when doing serious work you'll always have a designated designer and there's a reason for that: design consistency it's very important in a product. Having a dashboard or a public facing page constantly changing can make your users experience very jarring.

This is why tools like Percy or Chromatic exists: on every PR they'll diff the updated UI with the last known UI and allow the designer to stamp it's approval for the changes.

In an era where the changes were made by a human that kept a browser page open to check for its changes before opening a PR this was fine (maybe not the best experience but definitely fine). But something changed somewhat recently: we now build with our agents. A few of them have vision capabilities and when properly setup they can also "keep a browser open" but both of these capabilities are very different from a human looking at the page as an ensemble: we need something more, we need to make the loop tighter.

## Visual regression testing

As we said tools like Percy or Chromatic are very good when comes to a human checking off the work after it finished. However there are a few problems with those tool:

- The feedback loop is very slow: you have to finish your work, commit, open a PR, wait for the diff to happen, visit the page (which might not even be optimized for agents) and then finally you can see what changed.
- With the increased productivity agents bring to the table, taking that many screenshots can become costly and you don't want to slow down just because of cost.

Can we do better? Can we make the feedback as tight as a unit test that the agent can run locally while also saving a bit of money?

Yes we can!

## Introducing Playwright

Playwright is an awesome tool developed by Microsoft which has quickly became the industry standard when it comes to end to end tests: it uses Puppeteer under the hood which is a library that allows to spin up a browser instance (headless or not) and control it programmatically.

During your end to end tests you build your application, launch the production build, open the browser, visit the page like a user would and make expectation on top of what should be visible, which network requests are happening etc.

They recently introduced a [visual comparisons](https://playwright.dev/docs/test-snapshots) API that allows you to have visual regression testing directly in your local pipeline.

The easiest and simplest way to get started looks like this:

```ts
import { test, expect } from "@playwright/test";

test("home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot();
});
```

the first time you run your end to end tests they will fail because page has yet to have a screenshot.

However the first run will also screenshot the page and store the screenshot in a folder right next to your test. It's a png file you should commit with your codebase.

Just for good measure I asked claude to generate a good looking page to show you and here's the actual screenshot that the first run took.

![a screenshot of the page took by playwright tests](/assets/images/posts/2026-10-01-local-visual-regression-testing/screenshot.png)

Now if we re-run the tests immediately we are going to see a good a satisfying green...because we didn't touch the page at all.

But let's now ask claude to make some changes to the page by changing the accent color to Svelte #ff3e00

Rerunning the tests after it finished now fails with the following message:

```
> pnpm test:e2e
$ playwright install && playwright test

Running 1 test using 1 worker

  ✘  1 src/routes/page.svelte.e2e.ts:3:1 › homepage (625ms)


  1) src/routes/page.svelte.e2e.ts:3:1 › homepage ──────────────────────────────────────────────────

    Error: expect(page).toHaveScreenshot(expected) failed

      6216 pixels (ratio 0.01 of all image pixels) are different.

    Call log:
      - Expect "toHaveScreenshot" with timeout 5000ms
        - verifying given screenshot expectation
      - taking page screenshot
        - disabled all CSS animations
      - waiting for fonts to load...
      - fonts loaded
      - 6216 pixels (ratio 0.01 of all image pixels) are different.
      - waiting 100ms before taking screenshot
      - taking page screenshot
        - disabled all CSS animations
      - waiting for fonts to load...
      - fonts loaded
      - captured a stable screenshot
      - 6216 pixels (ratio 0.01 of all image pixels) are different.


      3 | test('homepage', async ({ page }) => {
      4 |       await page.goto('/');
    > 5 |       await expect(page).toHaveScreenshot();
        |                          ^
      6 | });
      7 |
        at /Users/paoloricciuti/Desktop/code/stuff/visual-regression-testing/src/routes/page.svelte.e2e.ts:5:21

    attachment #1: homepage-1 (image/png) ──────────────────────────────────────────────────────────
    Expected: src/routes/page.svelte.e2e.ts-snapshots/homepage-1-darwin.png
    Received: test-results/src-routes-page.svelte.e2e.ts-homepage/homepage-1-actual.png
    Diff:     test-results/src-routes-page.svelte.e2e.ts-homepage/homepage-1-diff.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/src-routes-page.svelte.e2e.ts-homepage/error-context.md

  1 failed
    src/routes/page.svelte.e2e.ts:3:1 › homepage ───────────────────────────────────────────────────
[ELIFECYCLE] Command failed with exit code 1.
```

we can see specifically which test failed, and we can see the steps that the testing framework did to ensure the correct rendering. But all of this feels a bit chaotic: are we expected to figure out what the problem was solely by looking at this?

Of course no: notice the last bit of the error message:

```
attachment #1: homepage-1 (image/png) ──────────────────────────────────────────────────────────
Expected: src/routes/page.svelte.e2e.ts-snapshots/homepage-1-darwin.png
Received: test-results/src-routes-page.svelte.e2e.ts-homepage/homepage-1-actual.png
Diff:     test-results/src-routes-page.svelte.e2e.ts-homepage/homepage-1-diff.png
```

we (and our agent) actually have all the files saved as `png` in the `test-results` folders. The most useful to debug what's going on is the diff view

![a diff of the expected page vs the current took by playwright tests](/assets/images/posts/2026-10-01-local-visual-regression-testing/diff.png)

As you can see it's mostly a white photo but there are a few red pixels. They perfectly and visually highlight the changes that claude made to the page and we can verify that by also opening the actual `homepage-1-actual.png` file

![a diff of the the actual page took by playwright tests](/assets/images/posts/2026-10-01-local-visual-regression-testing/actual.png)

But wait...do you notice something? There's some change that we didn't ask for! Claude inadvertently removed the glitch effect around the "Pixel Perfect" header while we were only asking for a change in the accent color.

That's the power of visual regression testing.

We can now ask claude to revert that change and run the tests again.

As expected the tests fails again (since the accent color did change) but if we take a look at the diff is now a much reasonable one

![a diff of the expected page vs the current took by playwright tests](/assets/images/posts/2026-10-01-local-visual-regression-testing/diff-after.png)

Now that we've verified that the changes are the expected one we can run `npx playwright test --update-snapshots` to update the old snapshots and have a new ground truth for our homepage.

The best part of all of this is these are just files on disk which means that the agent can already autonomously read them to figure out what the problem is!

So that's it right? We did it? Not so fast...

## Consistency

If you open a headless chrome browser on your computer and take a screenshot of the page it can, very consistently, get a pixel perfect screenshot compared to the last run. But we run these checks in all sort of environments: we run them on the Linux machines that powers GitHub actions, some developers run them on their MacBooks, others might have a Windows machine.

And unfortunately it's much more difficult to have all of those platforms behave consistently when taking snapshots. This could lead to a lot of false negatives and flakiness and make the whole experience even more frustrating than having no visual regression tests in the first place.

Luckily we also have a solution (although a bit more involved than just using PlayWright): Docker.

### Docker containers

Docker containers were basically invented for similar reasons: developers needed a way to consistently reproduce an environment, with the right dependencies and the right system. They works almost like a Virtual Machine with the main difference being that they share the kernel with the host machine.

The important bit for us, however, is that you can run a Linux container everywhere allowing us to standardize the runner for our playwright tests.

The [official Playwright Docker image](https://playwright.dev/docs/docker) already contains the browsers and system dependencies we need. We do not need to containerize the entire application: a small `Dockerfile.visual-tests` is enough.

```dockerfile
ARG PLAYWRIGHT_VERSION
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

ARG PLAYWRIGHT_VERSION
ENV CI=true
# We disable corepack and manually install it later because the official image comes
# with an old version of node and can't unpack newer pnpm binaries
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app

RUN npm install --global corepack@latest && corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Check that the two versions of playwright (the one installed in the app and the one in the image)
# match to ensure we don't unnecessarily reinstall the browsers
RUN installed="$(pnpm exec playwright --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')"; \
	if [ "$installed" != "$PLAYWRIGHT_VERSION" ]; then \
		echo "Playwright version mismatch:"; \
		echo "  docker image  v$PLAYWRIGHT_VERSION  (ships the browsers this version pins)"; \
		echo "  pnpm-lock     v$installed  (@playwright/test)"; \
		echo ""; \
		echo "These must be identical, otherwise Playwright considers the browsers"; \
		echo "baked into the image missing and re-downloads them on every single run."; \
		echo "Fix: set PLAYWRIGHT_VERSION to $installed in docker-compose.yml."; \
		exit 1; \
	fi

CMD ["pnpm", "test:e2e"]
```

Let's explore the few interesting parts of this Dockerfile:

- We have to disable automatic corepack download and then we install it manually: this is because the official image includes an old version of node and we need the latest corepack to be able to unpack pnpm.
- We added a bash script to check that the version passed in as argument and the version we have installed in our project match. This prevents playwright from unnecessarily re-download the browsers on each run. This will error out preemptively and constructively so that we don't waste our precious CI time.

Note that `PLAYWRIGHT_VERSION` has to be declared twice: the first `ARG` sits before the `FROM` so that it can be interpolated into the image tag, but arguments declared up there are not visible inside the build stage itself, so we declare it a second time right after.

Once we have our Dockerfile we could run it with the docker cli...but that get's long and imperscriptible pretty fast so the more maintainable solution is to write a `docker-compose.yml` file that we can then quickly run with `docker compose run`

```yaml
services:
  visual-tests:
    build:
      context: .
      dockerfile: Dockerfile.visual-tests
      args:
        PLAYWRIGHT_VERSION: 1.62.0
    platform: linux/amd64
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
```

This `docker-compose.yml` does the following things:

- It pins the platform to linux/amd64
- It pins the playwright version (we would need to manually keep this in sync once we update our dependencies)
- Mounts two volumes: one that keeps our project in sync with `/app` so that we can make changes to the project without having to rebuild the image, one that keeps the `node_modules` of our container around after the container has been shut down. This prevents the `node_modules` from our machine to "leak" into the container.

With this in place running the visual tests is a single command:

```sh
docker compose run --rm --build visual-tests
```

`--build` rebuilds the image when the `Dockerfile` or the lockfile changed, and `--rm` removes the container once the run is over. And once we have verified that a change is intentional, we can update the snapshots in that very same environment:

```sh
docker compose run --rm --build visual-tests pnpm test:e2e --update-snapshots
```

Obviously we can add these commands as scripts so that both us and our agents have a single, obvious entry point:

```diff
 {
   "scripts": {
     "dev": "vite dev",
     "build": "vite build",
-    "test:e2e": "playwright install && playwright test"
+    "test:e2e": "playwright install && playwright test",
+    "test:visual": "docker compose run --rm --build visual-tests",
+    "test:visual:update": "docker compose run --rm --build visual-tests pnpm test:e2e --update-snapshots"
   }
 }
```

Funnily while I was writing this blogpost I was testing the code on the side...after running the script I took a look at my `homepage-1-linux.png` file that was created within the container and to my surprise it completely proved my point about consistency:

![the screenshot took by playwright within the linux container showing the same page but a different font](/assets/images/posts/2026-10-01-local-visual-regression-testing/screenshot-linux.png)

Why is this? Because when claude generated the page used the following CSS

```css
:root {
  /** other styles */
  --font-display: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono",
    Consolas, monospace;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue",
    Arial, sans-serif;
}
```

Do you notice something? Yup, a lot of those are system fonts on MacOS which are obviously missing on Linux...this is why you need consistency!

## That's it...or is it?

Sounds like we solved every problem we had so this must be it right? Well here's where I have to give you a little warning:

This is **a** solution but it might not necessarily be **your** solution.

Visual Regression testing is very difficult to get right and that's the reason there are entire companies with full teams of engineers dedicated to solving this problem. In our case the feedback look is tighter, the cost is lower but if the quality of the visual regression is also lower you might end up spending a bunch of time maintaining the solution that was meant to speed you up in the first place.

Unfortunately I cannot tell you if this is the right solution for you: you would have to test it yourself, maybe in tandem with Chromatic/Percy, and figure out what actually speed your work the most, factoring in how much it would cost you.

And if all of this sounds complicated to you is because, well, it is: but if you need we are always here to help you _:wink:_ _:wink:_

## Conclusions

So, I hope that after this article you have some new tools into your toolset: we've seen how to use the visual regression tool from Playwright, how to interpret the results and most importantly how to make it consistent with a bit of Docker magic.

Now it's up to you to answer the question I posed in the last paragraph: is this the right strategy for you?

I hope you found out and if you do, please let us know!
