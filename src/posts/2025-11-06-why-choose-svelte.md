---
title: "Why I choose Svelte"
authorHandle: paoloricciuti
tags: [svelte]
customCta: "global/svelte-cta.njk"
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "We know Svelte is THE best framework (😎)...but why? Let's explore why (and when) I think Svelte is the right choice for you"
autoOg: true
tagline: <p>We know Svelte is THE best framework (😎)...but why? Let's explore why (and when) I think Svelte is the right choice for you</p>
---

At Mainmatter we are well aware of our choices. As Marco wrote in his blog post ["Ember.js in 2021 - a beacon of productivity"](https://mainmatter.com/blog/2021/03/12/ember.js-in-2021---a-beacon-of-productivity/) we firmly believe in picking the right tool for the job. Frontend exists on a spectrum (from a static document to a fully dynamic dashboard). Svelte covers a wide range of use cases and that why, when we think our clients project fall below this umbrella, we suggests to them to pick Svelte for their job.

Our clients, following good engineering practices, don't just blindly trust us and ask: Why? Why should I choose Svelte to develop my product?

This blogpost is an attempt to condense why I would go with Svelte most of the times.

{% note "info", "Bias disclaimer" %}

I'm a Svelte maintainer so OBVIOUSLY I might be a little biased towards Svelte and SvelteKit. I'll try to be as objective as possible during the course of this blogpost, presenting objective facts rather than opinions, or motivating my opinions so that you can form your own.

{% endnote %}

## The power of a compiler at your disposal

I still remember the first time I heard of Svelte: I was in the excruciating line to get my COVID vaccine shot and I was entertaining myself with some YouTube videos. I stumbled across this now-famous conference talk from Rich Harris: [Rethinking Reactivity](https://youtu.be/AdNJ3fydeao?si=sMn-kLIPESubUD14).

In this talk Rich showcased the idea of moving reactivity from the runtime into the language itself. A compiler! Just like in the good ol' days a C compiler could help you write programs more easily by writing the ASSEMBLY code for you, Svelte can help you write websites more easily by writing JavaScript code for you. Being a compiler is the first reason why I would choose Svelte, and this has several implications:

1. **New language constructs**: A compiler gives you a superpower—if you write a JavaScript variable in an HTML file, you can't use it in the template below. In Svelte you can! This is powered by the compiler that turns your template into JavaScript expressions that are in the same scope as your variables.
2. **Write efficient code by default**: Many C developers could not write ASSEMBLY as efficiently as `gcc` can—the same is true for JavaScript. Sometimes it can be difficult to write efficient code, but the Svelte compiler is written by a lot of very smart people (and me) who know how to write efficient JS for you.
3. **Ability to change the runtime without changing the syntax**: Another somewhat hidden feature of a compiler is that you can change the underlying runtime without having to change the syntax. We recently released Svelte 5, which, to be fair, was quite the syntax change—but you can still use your old components in Legacy mode. The same syntax now uses completely different technology under the hood (compile-time reactivity vs. signal-based reactivity). If tomorrow a brand new technique much better than signals is discovered, Svelte can pretty much just rewrite the runtime without changing the syntax.

Another very good example of the power a compiler gives you is the brand new experimental `await` API: since the compiler does not abide by the rules of JavaScript, you can use `await` in the middle of your script tag or component template and retain the signal-based reactivity even after the `await`; or we can `Promise.all` all your `await`s in the template so that they don't waterfall.

All of this is only possible because Svelte is a compiler, which means it will allow users to write code in the most intuitive and logical way but still apply all the code changes required for it to work.

Now, some people are scared about a compiler touching their code, but here's something that not a lot of people realize: basically every framework is using a compiler of some sort. React is doing a minimal conversion, only transpiling JSX to `React.createElement`. Solid is doing a slightly heavier transformation that still only concerns the JSX part. Vue does an even heavier compilation, which still mostly touches the template part.

## Optimize for the vibes

Quoting Rich Harris once again, one of the tenets of Svelte is "[Optimize for the vibes](https://github.com/sveltejs/svelte/discussions/10085)". Nowadays "vibes" took a bit of a negative turn with "vibe coding," but the reality is that one of the design goals of Svelte is

> People use Svelte because they like Svelte. They like it because it aligns with their aesthetic sensibilities.
>
> Instead of striving to be the fastest or smallest or whateverest, we explicitly aim to be the framework with the best vibes.

You might argue that vibes are subjective but the fact that the design decisions around the framework strive specifically to make the framework the most intuitive have consequences on the engineering side.

![State of JS survey results showing Svelte consistently on top for interest](/assets/images/posts/2025-11-06-why-choose-svelte/state-of-js.png)

Svelte is consistently framework most people are interested in in online surveys like "The State of JS" and "Stack Overflow Annual Developer Survey": developers want to learn Svelte!

This means that:

1. **Your engineers will be happy**: It's no secret that people work better when they use something that just makes sense to them. Less frustration with weird APIs, less context switching to look at the docs, fewer abstractions needed to make the code readable and maintainable.
2. **Onboarding new hires will be easier**: For the same reason, onboarding new hires on a project will take a lot less time—people learn React because they have to; people learn Svelte because they want to.

## SvelteKit: the meta-framework for Svelte

I'm very often regarded as "The Svelte Guy" but a small confession I have to make is that I would consider myself "The SvelteKit Guy". I love Svelte but what really hooked me into it is SvelteKit.

SvelteKit is the meta-framework for Svelte, basically what Next.js is to React or Nuxt is to Vue. It uses Svelte as the templating language and builds an opinionated layer on top to develop actual applications. It provides ways to load data, handle routing, observability, and much more. As I've said, almost every framework has its own meta-framework that allows for all of this—so what's the deal with SvelteKit specifically?

### The absolute care for DX

There are a lot of very good UX/DX decisions baked into SvelteKit: pre-1.0, a route in SvelteKit could be created by creating a `.svelte` file (or a folder with an `index.svelte` file in it) inside the `routes` folder. Then the team realized that this could lead to a lot of confusion in your codebase: you couldn't differentiate between a "normal component" and a "route", and you had multiple ways to declare the same route (`/about.svelte` and `/about/index.svelte` both resolved to the same `/about` route). And so they changed it: now, in SvelteKit, if you want to create a route, you have to create a folder and name your component `+page.svelte`.

A lot of people in the community were flabbergasted by this change: it felt weird, and a lot of people still think this is the worst part of SvelteKit. But when you stop to think about it, the reasons why they made this change make total sense, and they are all small details to make your experience the best possible:

- Now there's only one way to declare your routes: if you are looking for the file responsible for the `/about` route, you can rest assured it will be in `/about/+page.svelte`.
- If you have some component or module that is only used within a specific component, you can put this right next to your `+page.svelte` file without inadvertently creating a new route.
- It opened the door to other SvelteKit-specific files (namely `+page.server.ts` and `+page.ts`) to load data into your component
- In your editor you can just search for `+page.svelte` to get a quick view of all your routes.

"What about calling this `page.svelte` instead, like Next.js?"...the answer to this question is what really sold me on SvelteKit: naming your component `+page.svelte` makes sure that the SvelteKit-specific files are always recognizable and, most importantly, **always on top**!

Is this the killer feature that sold me? No, this is a nicety—but this told me that the SvelteKit team is obsessed with DX. They think about every single detail to make your life as a developer easier.

### In house meta-framework

There's another reason why SvelteKit can have a small but important advantage over the other meta-frameworks: for the first time, the same team that builds the UI framework is also the one responsible for the meta-framework (and even the templating language itself). Obviously the Vue team has a direct line of communication with the Nuxt team, and a lot of the engineers who work at Vercel also work on React directly—but having literally the same team work on both sides of the deal can really change the game.

The moment SvelteKit needs a new Svelte API, there's no need to communicate: the team already knows if it's feasible, if it makes sense to put that in Svelte, and how hard it would be. Inversely, a new API in Svelte is developed keeping in mind the opportunities that it opens for SvelteKit. The synergy is unrivaled.

## Deployment freedom

Every product has its own set of constraints, and one of these can be where to deploy it. Maybe you need a specific Azure/AWS product, or you appreciate the velocity and scalability of serverless environments like Netlify, Vercel, or Cloudflare. With SvelteKit, that's likely not a constraint: whenever you create a new Svelte project with the `sv` CLI, you are already presented with the choice of an adapter.

![output of the sv cli asking the question of what to add](/assets/images/posts/2025-11-06-why-choose-svelte/sv-create.png)

There are a lot of adapters that are officially maintained by the Svelte team and even more that are community maintained...and creating a new one is also very easy in case your specific use case is not covered.

## The power of Vite at your disposal

Before [`@sveltejs/kit@v1.8.0`](https://github.com/sveltejs/kit/releases/tag/%40sveltejs%2Fkit%401.8.0), all the data returned from the load function needed to be awaited. If you tried to return a `Promise`, SvelteKit would just throw an error. On June 13, Astro released a new update that allowed Astro developers to use [Server Islands](https://astro.build/blog/future-of-astro-server-islands/).

What do those two facts have in common? That I've built support for both of them in SvelteKit before they were available (here's the repo for [`sveltekit-defer`](https://github.com/paoloricciuti/sveltekit-defer) and here's the one for [`sveltekit-server-islands`](https://github.com/paoloricciuti/sveltekit-server-islands))...how? Because SvelteKit is just a [Vite plugin](https://vite.dev/guide/api-plugin)! With that and the [handle hook](https://svelte.dev/docs/kit/hooks), you can craft very complex scenarios as if they were baked into the framework.

## Ecosystem

In some other articles, you might have seen this point in the list of "cons" for Svelte. Let's be honest: React definitely has a much bigger ecosystem than Svelte. That said, I wouldn't necessarily consider this a downside:

1. Svelte still has a [very decent](https://svelte.dev/packages) ecosystem.
2. You don't really need a lot of custom-made packages for Svelte: working directly with the DOM is very simple (we even have a [primitive specifically for it](https://svelte.dev/docs/svelte/@attach)), so your ecosystem is really the **whole JavaScript ecosystem**.

## Use the Platform™

Do you know what Svelte animations and transitions are using under the hood? The [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API). And what is SvelteKit using to handle the Request/Response cycle? `Request` and `Response` from [the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Those are just two examples, but Svelte and SvelteKit are very keen on using APIs and standards provided by the Platform.

Why does this matter?

Because the Platform is here to stay: building commodities on top of solid foundations will guarantee stability for the future.

## Good Practices, not just Best Practices

Another point I absolutely love about Svelte is how it encourages you to go the extra mile to make the web more accessible. In Svelte, we have a whole set of compiler warnings that are specifically guiding you to write good and accessible code.

Adding an `onclick` listener to a div? That's fine, but you should also add an `onkeypress` to handle the expected "click with space" you usually get for free with buttons!

Adding an image? Well then, you should also add an alt text so that visually impaired visitors of your website can get an accurate description of it.

Using the built-in `form` action? By default, it will make sure your `form` works even before JS loads, because maybe your users are in a bad network area.

It takes courage for a framework to make the developer's life a bit harder (nobody likes a warning) in the name of teaching how to build sustainable and accessible websites. But that's actually part of the mission of Svelte, or as Rich said, our [North Star](https://youtube.com/clip/UgkxO9yS7kW9hHU1MnZpsK7NwSKg9UNFO2i_) is to "make **better** software".

## Technically impressive

I've avoided talking about the performance of Svelte because that's something that will likely change over time (and because, except for certain kinds of applications, most modern frameworks are good enough). But if you are interested in it, it is worth looking into:

![output of the krausest js framework benchmark](/assets/images/posts/2025-11-06-why-choose-svelte/benchmark.png)

Svelte is one of the fastest frameworks out there, right next to SolidJS in the [krausest benchmark for JS frameworks](https://krausest.github.io/js-framework-benchmark/current.html), and the simple SSR logic (basically just string concatenation) makes SvelteKit consistently top [benchmarks](https://bsky.app/profile/alexanderkaran.bsky.social/post/3meg2c3v7ek26) for the server side too.

## What about AI?

AI is changing the world of development, so it's only fair to dedicate a paragraph to this aspect. Hearing about a company migrating away from their existing stack to something that AI understands better is not unheard of (React being the usual choice). However (and, spoiler, this is an opinion, not a fact), I would argue that being more present in the training set of a Large Language Model doesn't automatically make it better.

Something is definitely true: React is kind of the default for LLMs because a big portion of the Web is built on top of it. Be it code snippets on GitHub, blog posts, tutorials, or actual open source products—the training set is just enormous. However, a lot of code also means a lot of **BAD** code. React being the first choice for junior devs who want to break into the tech scene makes LLMs very good at simple components and very bad at complex ones.

How does Svelte fare in this? Well, people who pick Svelte tend to be more senior engineers who evaluate their tech stack and spend time figuring out what's best. This also generally relates to better code. There's still a small issue, though: Svelte 5 was released a few months after the first big models started to become popular, which means that a lot of the training data is now outdated—but fear not: as I've said before, we truly want to make the DX of Svelte the best possible, and that, nowadays, includes being able to write good Svelte code with the help of your agent. That's why Svelte has an [official MCP server](svelte.dev/docs/mcp) that helps your agent get the documentation AND uses static analysis to correct it when it falls back to the old syntax. The best part? The MCP server can also steer the LLM to write **good** Svelte code, not just syntactically correct code.

## When NOT to use Svelte?

If I told you that Svelte was the best at everything, I would:

1. Be a very bad engineer
2. Be hypocritical
3. Lose your trust completely (and you would be right)

Almost no tool is the perfect tool for every job, and Svelte is no different. That's why in this section I want to go over the situations where I would not choose Svelte:

- **You need a big migration**: If you already have a big codebase that's written in React/Vue/Solid/Angular, migrating to Svelte would, most likely, be a bad choice. Especially if you come from React, the mental model is very different, and migrating the whole codebase while also re-adjusting the mental model of your team could prove challenging and might not be worth the time and energy spent on it.
- **All your team already knows something else**: Even if you are not migrating but starting a greenfield project, it's important to coordinate with your team—if all your engineers are already versed in a different framework, starting your project while learning a new framework (and its relative quirks) could slow your project down too much.
- **Content-heavy websites**: If your website mostly consists of relatively static content (a blog, a documentation website), you could consider Astro as an alternative. Astro focuses on static websites and has tools built in for content management, documentation, etc. As a bonus: you can also add the Svelte plugin for Astro to sprinkle reactivity into your static website with Svelte.
- **You need specific libraries that are not supported**: Some libraries (like [tldraw](https://tldraw.dev)) are built around the React mental model and thus do not offer an agnostic version that you can safely use in Svelte.

## Conclusion

I hope this small tour inside my head helped you make your own informed choice about Svelte (and I secretly hope I've convinced you about how good it is). Luckily, the framework in our tech stack is becoming less and less relevant, and in terms of raw capabilities, every framework will do: we are getting closer to a future where the framework you pick will really be a choice driven by passion.
