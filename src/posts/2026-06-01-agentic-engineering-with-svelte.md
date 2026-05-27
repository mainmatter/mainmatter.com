---
title: "Agentic Engineering with Svelte"
authorHandle: paoloricciuti
tags: [svelte]
customCta: "global/svelte-cta.njk"
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "Agents can boost your productivity to unprecedented levels... but how do you get the best out of them? And what are the best practices for doing it with Svelte?"
autoOg: true
tagline: <p>Agents can boost your productivity to unprecedented levels... but how do you get the best out of them? And what are the best practices for doing it with Svelte?</p>
---

Unless you've been living under a rock for the past four years, you probably know that something called Large Language Models revolutionized the whole tech industry. It all started with the release of ChatGPT, a chat interface that allowed anyone to access the underlying Large Language Model: GPT 3.0.

People immediately started experimenting with the model's ability to generate code, but most generations were performed by copy-pasting code into the chat interface and asking it to update it in a certain way.

When the model also became available via the API, people started experimenting with a different workflow: programmatically reading a file, sending an API request with a prompt, and running the tests to verify the code worked as intended. Running this in a loop produced, as expected, much better results at the cost of more tokens.

This was the beginning of what would grow to become **Agentic coding**!

One of the first big products that doubled down on this was Claude Code from Anthropic: a CLI that allowed the user to prompt the LLM, but that also exposed certain tools to it, allowing the LLM to invoke them by writing a specific message pattern. This quickly improved the situation even more: the agent could now invoke bash scripts, read multiple files based on what it thought was necessary, search the web, etc.

## Vibe coding

On the 2nd of February 2025, Andrej Karpathy (one of the most influential voices in the AI world, co-founder of OpenAI) sent a tweet that defined a new term: **Vibe Coding**.

![tweet from Andrej Karpathy that first introduced the concept of vibe coding](/assets/images/posts/2026-06-01-agentic-engineering-with-svelte/vibe-coding.png)

The idea of vibe coding is that you let the agent take the wheel: you express what you need in a prompt, the agent produces it, and you accept without looking at the code. If bugs arise, you tell the agent to fix them. Rinse and repeat until you have an app.

This concept exploded in popularity. Countless businesses were built on the concept of allowing you to vibe code your whole application directly in the browser (or even on your phone). Suddenly everybody, even non-technical people, were building apps.

However, as you might imagine, this utopia wasn't there to last. Sure, as long as you build your own hyper-specific app with one user, vibe coding might serve you well enough, but try to scale that to build an actual product and the cracks start to show.

![a Reddit post titled "What's the point of vibe coding if I still have to pay a dev to fix it?"](/assets/images/posts/2026-06-01-agentic-engineering-with-svelte/cracks.png)

The term quickly became synonymous with "bad software" but the fundamental idea was so strong that people with actual engineering experience started to approach it from the other side of the line.

Automated tests, linters, LSP, Git... all these tools allowed people who knew how to build reliable software to approach the same velocity while also keeping the agent in check.

One year goes by (which means at least 100 years in AI years _\*ba-dun-tss\*_) and Karpathy tries to do it again... and somewhat surprisingly he's successful: but now he's talking to the engineers, to the ones who know how to build software and use AI "responsibly"; they not only read but try to understand the code, they steer the agent towards the right solution, not just a solution, they write tests, they think about how to make the code maintainable.

![a tweet from Andrej Karpathy explaining agentic engineering](/assets/images/posts/2026-06-01-agentic-engineering-with-svelte/agentic-engineering.png)

This was the start of **Agentic engineering**.

## Agentic Engineering

So how do the two compare? And how do they differ? They couldn't be more similar and yet more different:

As we explained earlier, Vibe Coding is ALL about embracing the vibes: a true Vibe Coder doesn't even open the editor to code. They just talk to an agent in what could be compared to the narrative technique known as _stream of consciousness_, then look at the end result, check if what they are working on works, and, if not, ask the agent to fix it. There's rarely full coverage of the application's capabilities because a single person can't possibly check every single edge case of every single feature. The agent is the real owner of the code.

That's also true with agentic engineering and that's what makes the two so similar: to really boost your productivity you should let the agent do what it does best... write code at the speed of light. What changes is mostly around the code. In this case you do look at the code, you carefully review it, you put systems in place that can test your whole app for you at every change, and you force the agent to check its work before completing a task.

You are basically graduating your agent from "kid in their room writing their first game" to "serious professional building production-grade applications".

## Where does Svelte fit in this?

I know, a blog post by me that still doesn't mention Svelte. I was surprised too. But here we are, finally I can talk about my favorite topic 😁

Where does Svelte fit in this AI-driven world? The answer, as often happens in the tech industry, is: _it depends_.

What does it depend on? Well, as we've seen, things move fast today and the pair Svelte + AI took many shapes over the course of the last year or so. Buckle in, we are going back in time!

### Before the Agents

As we explored already, initially almost nobody was doing agentic coding. Most of the coding LLMs did was simple components copied and pasted into their chat. Those models were also not that great at coding in general. And they had a lot of Svelte 4 in their training set. And we recently released Svelte 5.

I don't think I have to tell you much more: the experience for those who wanted to use Svelte was pretty bad at that time. LLMs were maybe able to write a few good Svelte 4 components but even in that case, inspecting the system prompts of the top labs showed they were directly nudging the LLMs towards the most popular choice: React.

That led most of the generations to look like Frameworkstains with React APIs interleaved with Svelte templates. It was a dark time for the Sveltelowdas (collective noun for Svelte developers), to the point that a lot of people wanted to use it at their job but couldn't recommend it because their colleagues wouldn't have been able to use AI with it.

Luckily, with time, model capabilities grew, the training set started to fill with Svelte 5 examples, and most importantly the way in which we, as maintainers, could influence the output of the generations changed radically.

### `llms.txt`: the first step

The first tool we got in our tool belt was a standard that started to emerge in 2024. A lot of websites started to serve content specifically tailored for an LLM (text-only, markdown, etc.) by appending `/llms.txt` to the current route. The idea was that, if the standard did catch on, LLMs would be trained on this knowledge and could navigate a version of the web that was specifically designed for them.

The Svelte team jumped on this opportunity and, during Advent of Svelte 2024, added `/llms.txt`, which allowed LLMs to access the full Svelte/SvelteKit documentation. Every single documentation page also got the same treatment (in case you wanted less token waste for features you were not using). This did make things a bit better but was still not enough.

If you know the Svelte team, you know that we care about your DX above almost everything... we knew we had to take things up a notch, not because we wanted to please the agents, but because we wanted our users to be able to use Svelte without feeling left behind in this crazy race.

### The task force

We established a task force where a few interested maintainers and ambassadors would brainstorm ways in which we could make the experience better for everyone. As in any good brainstorming session, a lot of ideas were... not so great. But in the meantime the tooling around agents started to become more sophisticated and we quickly realized that a possible solution could've been writing an MCP server!

In case you are unaware of what an MCP server is, I invite you to open this [other blog post of mine](https://mainmatter.com/blog/2025/09/15/mcp-the-start-of-something-new/) on the topic.

The tl;dr is that it's a way to expose tools/resources/prompts so that the LLM or the user can enrich the context with new information. The base version of the MCP exposed every documentation page as a resource and as a tool. This means that the agent can invoke the documentation tool autonomously to learn about Svelte before writing the code.

But while brainstorming we also had another idea...

### The `svelte-autofixer` tool

_"What if we run the deterministic migration script on the generated code?"_ or _"What if we run the linter on the generated code?"_ were a couple of ideas that were thrown around during the various brainstorming sessions.

And that's what we did... well, not exactly.

Despite what some people might think LLMs are not even close to us humans. They make silly mistakes, sometimes they write syntactically correct Svelte code that doesn't make sense semantically. But they have an advantage: they don't get offended if you point out one of their mistakes.

So yes, we can run the compiler and get the compile errors/warnings, we can run ESLint and get the same warnings that you would get in your editor... but we can do more: we can specifically tailor our static analysis to the mistakes that we see the LLMs make more often.

One example... I've seen LLMs generate code like this

```svelte
<script>
	import { count } from "./my-counter.svelte.js";
</script>

<button onclick={()=>count.value++}>
	{count.$}
</button>
```

You would never point out to a human that accessing `.$` on a variable to read its value is a mistake because, in this case, it might not even be a mistake. We can't know if it is.

But we know LLMs tend to do this because their knowledge is poisoned by the store reactivity of Svelte 4. And so we warn on code like this.

_"But what if it's not a mistake and that's actually the shape of the object?"_

That's the best part: we don't have to do crazy static analysis to determine this: we can just **"talk"** to the agent and say "To access a stateful variable you don't need to use `.$`. Please verify that the shape of the object includes a property named `$` or update the code to use `count.value`". They'll do the rest!

Furthermore if we see code like this

```svelte
<script>
	let count = $state(0);
	let double = $state(0);

	$effect(()=>{
		double = count * 2;
	});
</script>

{count} * 2 = {double}
```

we can warn the agent to use a `$derived` if possible. We can steer the agent to write GOOD Svelte code, not just correct Svelte code.

The reception for the MCP server was fantastic: people were finally able to write good Svelte code with their agents... but (as we've seen before) the AI race doesn't stop. New tools get created, new strategies and necessities emerge, and we don't plan to stop either.

### Skills

After revolutionizing the agentic world with MCP, Anthropic did it again: on the 16th of October 2025 it released skills! What are they? **MARKDOWN FILES**!

Joking aside, while a skill is indeed a markdown file, the concept behind it is that an agent is specifically instructed to read it based on the description specified in its frontmatter when it thinks it can help fulfill the task assigned by the user. It's a sort of dynamic `AGENTS.md`.

A lot of people saw the potential of this new tool: you can tell the agent how to run scripts, you can use the tool in your shell to act on the real world, etc. A lot of people declared MCP dead (even though it is [far from it](https://ricciuti.me/blog/mcp-is-not-dead)) and, rightfully, asked for a solution from the Svelte team.

We started with a simple 1:1 replacement: the STDIO Svelte MCP is a package on npm and can now also [act as a CLI](https://svelte.dev/docs/ai/cli)... This allowed us to also write a skill that instructs the LLM on how to use it and voilà: if you want, you can save the MCP description tokens while still accessing the docs and the autofixer from the CLI.

But we didn't stop there: a skill can help the agent use a CLI but can also directly instruct the LLM about what to do and what not to do. We started writing a skill that could encompass all the best practices for writing very good Svelte. But then we realized that this content is actually something that could help a developer starting to learn Svelte; so, as usual, we prioritized our human users. The skill is now a [documentation page](https://svelte.dev/docs/svelte/best-practices) that then gets synced to also become an installable skill in the `@sveltejs/ai-tools` repo (btw we've seen astonishing results with this skill and I highly suggest you use it together with the MCP).

### Context Management & Subagents

The more people started using these tools, the more everyone realized the main resource in an agentic session is context. Most models limit the amount of context you have available (as in the amount of tokens the model can have in memory before auto-compaction summarizes the whole conversation) to something like 200k tokens. Some models have much larger context windows (for example GPT-5.5 has a 1 million token context window).

However, even if your model had an infinite token window, the quality of the model rapidly degrades after the 100k mark.

![a graph showing how performance degrades when the context length increases](/assets/images/posts/2026-06-01-agentic-engineering-with-svelte/context-rot.png)

This also led to a series of tools and techniques to reduce the amount of tokens the agent produces.

This seems to somewhat counter the benefit of the Svelte MCP/CLI: reading the docs and getting suggestions from the autofixer both consume tokens. However, we have a secret weapon in our quiver: since updating a Svelte component is generally a very atomic operation, we can use another tool that agent harnesses generally provide: **SUBAGENTS**!

The idea is that your agent can simply spawn another version of itself with a custom, laser-focused prompt for a single task (like for example "update this Svelte component"). And so we did: we created the [`svelte-file-editor`](https://svelte.dev/docs/ai/subagent) subagent (which also has extra instructions on how to best use the MCP/CLI).

### Configuration

All of this must be very annoying to configure every time you start a project... we know. And that's why the repo itself is a Claude Code/Cursor marketplace that allows you to install every tool with a simple click AND we also have an opencode plugin that you can install with `opencode plugin add @sveltejs/opencode`.

## What about the rest?

The previous chapter was all about Svelte but what about the rest? The rest is very important too: if you think of an agent like a mid-level engineer you realize that we already have a lot of systems in place to keep our colleagues in check.

### Git

Git was already pretty fundamental in the development world, but with the advent of agents that can write a lot more code in the same amount of time, and that sometimes do so in a pretty destructive way, it has become a tool you absolutely need to use.

Personally I use it to help me with the review process: before sending a prompt to an agent I will commit the previous work (if it's ready) or at least stage it. This means that when I'm back at my editor after the victory bell of the agent I can quickly glance at the git panel and see which files it changed. I can then open them one by one and carefully review which part of the file changed in a nice diff view. Honestly I don't think I would be able to run an agent on a codebase without git.

Git also allows you to quickly revert a change in case it is wrong (which, let's be honest, happens more than we care to admit).

### Tests

Another blast from the past: automated testing was always very important and we, at Mainmatter, know this very well. We helped a lot of clients modernize or even build their test suite from the ground up because we know that to ship fast you have to have some assurance that the PR you are merging doesn't break your main flow in subtle ways.

Safe to say this is even more important when the entity that writes that PR cannot really think and is just pattern matching.

Funnily enough, what was considered almost a bad practice at some point has now become the recognized way of writing tests with AI: TDD.

TDD stands for Test-Driven Development and the idea is to write the test even before writing the implementation. You assume the API exists and works how you want it to work, write the test, see the test fail, then write the minimal amount of code to make it work. Rinse and repeat, adding a refactor in the middle to make the code more robust. Admittedly the practice with AI is a bit different and relies mostly on the red-green pattern.

You ask the agent to write a test, verify that it fails, and then write the code to make it work. The "minimal amount of code" and "refactor" parts are generally omitted to not confuse the agent but the important bit is that when you let AI write your tests you absolutely want to see the test fail first.

Why?

Because LLMs for some reason love writing useless tests. I've seen agents write 300+ lines of tests that all looked like this

```ts
import { it, expect } from "vitest";
import { writeFileSync, readFileSync } from "node:fs";

function write_to_file(obj) {
  writeFileSync("./file.json", JSON.stringify(obj));
}

it("...", () => {
  const obj = {
    property: "value",
  };

  write_to_file(obj);

  const file = JSON.parse(readFileSync("./file.json", "utf8"));
  expect(obj.property).toBe(file.property);
});

// other 30 tests that all created an object, wrote it to a file and
// asserted that the file was written
```

which is basically testing the JS runtime (it's not even importing something from another module).

However if you let your agent write a test that fails it has to at least find a way to make it fail and then pass without touching it.

Regardless of whether you let your agents write your tests or not, having a solid test suite is absolutely crucial for another reason: it allows the agent to verify its work. It's much easier to express intent in a formal programming language and something that might be difficult to express in a prompt can be asserted with clarity in `vitest`. The agent can then run until the test is green (hopefully with a fix that doesn't break the rest of the test suite).

### Code Reviews

As we repeatedly said during this article, nowadays code is produced at unprecedented rates. And as we said already, if you are doing agentic engineering you do care deeply about the quality of the code. This means that most of your time you'll actually be reviewing code.

Now, someone might prefer reviewing to writing, but judging from the number of conflicting PRs left in the average project we can assume developers tend to like coding more than reviewing. It is a bit of a shame that AI is stealing the fun part from us and not helping us with the boring part.

_Or is it?_

That's right, AI can also help us review the code!

I can see your skeptical face from here (which also means I can see in the future, that's impressive): if the AI is able to figure out that something is a bug why not prevent it from writing the bug in the first place?

Well, first, this happens to the best of us too: did you ever write a PR, come back to it the day after and notice a blatant bug? Secondly, since every time you restart the chat the AI has its memory wiped, it's just like having another person look at the code and, when instructed to look for bugs, they generally do an even better job at it. Thirdly, we can use a different model, with a different system prompt, optimized for reviews, which will give us an even better result.

Once we know this, it is just a matter of creating a GitHub workflow that runs on every PR and reports the findings in a comment. And if this feels like a business opportunity, you are right: there are dozens of tools that offer this functionality.

Personally I really like [Greptile](https://www.greptile.com), it's free for open source, it has a lot of nice features and customizations, and also gives you analytics on your reviews.

### The world after Production

During development it's all fun and games. But how can AI help you in Production? That's where another important tool comes into place: observability (have you realized how everything that helps big teams of engineers is also table stakes to work with agents... how curious).

Setting up a good observability platform is key to allow AI to help you in production. Regardless of whether you review your code or run tests on CI, bugs will inevitably ship to Production. The goal is to be able to detect them, know precisely where they are and fix them as quickly as possible.

SvelteKit makes this super easy with the [experimental tracing/instrumentation option](https://svelte.dev/docs/kit/observability): you can just enable it in your config, create a `src/instrumentation.server.ts` and you will be able to collect information about every request as granularly as a single load/remote function.

When it comes to the choice of your observability platform anything will do but, obviously, the more the platform allows you to integrate with AI the better. That's why personally I really like [Sentry](https://sentry.io/welcome/):

- They have a very good integration with SvelteKit (in fact they actually contributed on the PR that allowed tracing/instrumentation)
- They are very on the bleeding edge of AI: they have an MCP server and a Skill+CLI that allows you to bring all the tracing information to your agent in no time
- They even wrote their own [cloud agent](https://docs.sentry.io/integrations/integration-platform/webhooks/seer/) that allows you to fix the issues in production from everywhere by clicking on a button and writing a quick prompt.

## How all of this applies in the real world?

Words are easy to write...but when it comes to real software is this actually feasible? Could you actually build a good application solely using agents?

Good news, we put that to the test!

We are releasing a mini-series (9 episodes) where I will be setting up the environment and building an application using the principles of agentic engineering (if you are reading this in the future the series might be already fully out...isn't that nice?).

You can watch it [here](https://youtube.com), during the series we are gonna build [DayRelay](https://dayrelay.ai): a news aggregator where you can pick the sources of your news and every day let AI visit them and find the best news for you so you can have your personalized newsletter!

The project is Open Source and you can find the code on [our GitHub](https://github.com/mainmatter/news-aggregator) and you can follow along with the series to see how we kept our agent in check so that it could write code we are not scared to look at!

## Conclusions

There's no doubt that LLMs changed the name of the game for software development...and yet as we've seen the same techniques that we've used to help our clients ship faster without compromising on code quality can, today, help an agent roam free in our codebases without risking a catastrophic spaghetti-code mess.
