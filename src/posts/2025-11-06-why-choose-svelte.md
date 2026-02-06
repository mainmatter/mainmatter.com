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

At Mainmatter we are well aware of our choices. We choose Svelte and we advise our clients to do the same.

Our clients, following good engineering practices don't just blindly trust us and ask: Why? Why should I choose Svelte to develop my product?

This blogpost is an attempt to condense why I would go with Svelte most of the times.

{% note "info", "Bias disclaimer" %}

I'm a Svelte maintainer so OBVIOUSLY I might be a little biased towards Svelte and SvelteKit. I'll try to be as objective as possible during the course of this blogpost presenting objective facts rather than opinions, or motivating my opinions so that you can form your own.

{% endnote %}

## Compiler

I still remember the first time I've heard of Svelte: I was in the excruciating line to get my covid vaccine shot and I was entertaining myself with some YouTube video. I stumbled across this now-famous conference talk from Rich Harris: [Rethinking Reactivity](https://youtu.be/AdNJ3fydeao?si=sMn-kLIPESubUD14).

In this talk Rich showcased the idea of moving the reactivity from the runtime into the language itself. A compiler! Just like in the good ol days a C compiler could help you write programs in an easier way by writing the ASSEMBLY code for you, Svelte can help you write websites in an easier way by writing Javascript code for you. Being a compiler is the first reason why I would choose Svelte and this has several implications:

1. **New language constructs**: a compiler gives you a superpower...if you write a JavaScript variable in an HTML file you can't use it in the template below. In Svelte you can! This is powered by the compiler that turns your template into JavaScript expressions that are in the same scope as your variables.
2. **Write efficient code by default**: many C developers could not write ASSEMBLY as efficiently as `gcc` can...the same is true for JavaScript. Sometimes it can be difficult to write efficient code but the Svelte compiler is written by a lot of very smart guys (and me) who know how to write efficient JS for you.
3. **Ability to change the runtime without changing the syntax**: another somewhat hidden feature of a compiler is that you can change the underlying runtime without having to change the syntax. We recently released Svelte 5 which, to be fair, was quite the syntax change... but you can still use your old component in Legacy mode. The same syntax now uses a completely different technology under the hood (compile time reactivity vs signal-based reactivity). If tomorrow a brand new technique much better than signals is discovered, Svelte can pretty much just rewrite the runtime without changing the syntax.

Another very good example of the power a compiler gives you is the brand new experimental `await` API: since the compiler does not abide to the rules of JavaScript you can use `await` in the middle of your script tag or component template and retain the signal based reactivity even after the `await`; or we can `Promise.all` all your `await`'s in the template so that they don't waterfall.

All of this is only possible because Svelte is a compiler, which means it will allow users to write code in the most intuitive and logical way but still apply all the code changes required for it to work.

Now, some people are scared about a compiler touching their code, but here's something that not a lot of people realize: basically every framework is using a compiler of some sort. React is doing a minimal conversion only transpiling JSX to `Rect.createElement`, Solid is doing a slightly heavier transformation that still only concerns the JSX part, Vue an even heavier compilation which still mostly touches the template part.

## Optimize for the vibes

Quoting Rich Harris once again, one of the tenets of Svelte is "[Optimize for the vibes](https://github.com/sveltejs/svelte/discussions/10085)". Nowadays vibes took a bit of a negative turn with "Vibe coding" but the reality is that one of the design goals of Svelte is

> People use Svelte because they like Svelte. They like it because it aligns with their aesthetic sensibilities.
>
> Instead of striving to be the fastest or smallest or whateverest, we explicitly aim to be the framework with the best vibes.

You might argue that vibes are subjective but the fact that the design decisions around the framework strive specifically to make the framework the most intuitive have consequences on the engineering side.

![State of JS survey results showing Svelte consistently on top for interest](/assets/images/posts/2025-11-06-why-choose-svelte/state-of-js.png)

Svelte is constantly the most interesting framework in online surveys like "The State of JS" and "StackOverflow Annual Developer Survey": developers wants to learn Svelte!

This means that:

1. **Your engineers will be happy**: It's no secret that people will work better if they use something that just makes sense to them. Less frustration for a weird API, less switching context to look at the docs, less abstractions to make the code look more readable and maintainable.
2. **Onboarding new hires will be easier**: For the same reason onboarding new hires on a project will take a lot less time...people learn React because they have to, people learn Svelte because they want.
