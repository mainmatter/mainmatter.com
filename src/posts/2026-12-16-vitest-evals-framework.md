---
title: "Sprinkle determinism into your agent setup"
authorHandle: paoloricciuti
tags: [ai]
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "How to make sure your agent can properly work in your codebase."
autoOg: true
tagline: <p>How to make sure your agent can properly work in your codebase.</p>
---

AI has changed the way software engineers work. Agents can help us navigate our codebase, make changes to it much faster than before, and automate simple changes to thin out our backlog with very little engineering effort.

But while most of this could've been solved before by throwing more engineers at the problem, AI also gave us something that we had no way of getting before: transcripts.

It may sound silly, but the fact that an agent produces a transcript while working on our codebase has unexpected positive consequences: we now have a log of all the commands an agent executed and all the reasoning it had to do to solve a problem. This gives us a new kind of power: we can read those transcripts to figure out where the agent got stuck and adapt our agent setup and/or our codebase so that, the next time, it will be easier for it to complete the task. Well, let's be honest: an agent can read the transcripts!

Before going further, let's agree on two terms. By _harness_ I mean the CLI that runs the agent loop (Claude Code, OpenCode, Codex). By _agent setup_ I mean everything we hand to it: `AGENTS.md`, skills, tools, MCP servers, and subagent definitions.

This can already be used effectively, and there are skills out there (like [retro](https://www.skills.sh/mattpocock/skills/retro) from Matt Pocock) that make use of this newfound power to find opportunities to improve your codebase.

That said, all of this is missing that sweet determinism that we love to love.

## The idea

While we were talking with one of our clients, they lamented the fact that, since they have a very big monorepo, they couldn't use skills effectively because the model often read a skill that was specific to a project different from the one they were working on. Obviously we could tell an agent "this skill should be invoked only in this project, make changes to the description so that it's only invoked when working in that project", and with a certain degree of confidence the agent would probably succeed at this task.

But both the skills and the codebase might change shape over time. A new model might interpret things differently, or a new rule in `AGENTS.md` might steer the agent in the wrong direction.

All of this sounded very similar to another common problem we constantly run into while building software: a function might change and break the application, our backend could introduce a new set of possible inputs for a function that breaks it, or maybe we invoke that function in a different component where the global state is different. All of these situations could "break" a function that worked perfectly fine before.

How did we solve this problem? Easy, with testing.

But how does this relate to our problem with our agent? Well, since we now have the transcripts of how an agent navigates our codebase, which tools it invokes, and which files it touches, we can write some "tests" for it!

## Evals

The "tests" for agents are generally called evals: they are usually used when your product is "serving" some inference, to evaluate (hence the name) whether your prompts and tools do the right job.

For example, if your service is using AI to give descriptions of all the cats in an image, you can write a few evals that pass a known image to an LLM (you should use the same model you are using in your product). Then you can either use another LLM to judge the result or search for specific keywords you would expect to find in the description (for this reason, the pass rate of evals is rarely "all green or nothing").

Let's see the easiest example of this (I'm going to use `vitest-evals` in all the examples):

```ts
import { aiSdkHarness } from "@vitest-evals/harness-ai-sdk";
import { openai } from "@ai-sdk/openai";
import { describeEval } from "vitest-evals";
import { expect } from "vitest";

export const simple = aiSdkHarness({
  agent: () => ({
    model: openai("gpt-4o-mini"),
    system: "Answer geography questions directly. Keep answers short.",
  }),
  output: ({ result }) => result.text.trim(),
});

describeEval("capital questions", { harness: simple }, it => {
  it("knows the capital of France", async ({ run }) => {
    const result = await run("What is the capital of France?");

    expect(result.output).toContain("Paris");
  });
});
```

In this case, we are using a simple `toContain` assertion to check whether `gpt-4o-mini` answered the question correctly but, depending on the complexity of the task, we could create a judge that also uses an LLM to verify the answer:

```ts
import { openai } from "@ai-sdk/openai";
import { aiSdkJudgeHarness } from "@vitest-evals/harness-ai-sdk";
import { describeEval, FactualityJudge } from "vitest-evals";
import { simple } from "./simple-harness";

const judgeHarness = aiSdkJudgeHarness({
  model: openai("gpt-4.1-mini"),
  temperature: 0,
});

const factualityJudge = FactualityJudge({
  expected: "Paris is the capital of France.",
  judgeHarness,
});

describeEval(
  "capital questions",
  {
    harness: simple,
    judges: [factualityJudge],
    judgeThreshold: 0.6,
  },
  it => {
    it("knows the capital of France", async ({ run }) => {
      const result = await run("What is the capital of France?");

      expect(result.output).toContain("Paris");
    });
  }
);
```

This will use both the `toContain` assertion and the `FactualityJudge`.

So far so good, but this is, once again, to test how a specific model would respond given a specific prompt. How does this apply to our idea of optimizing our agent setup?

Well, while `vitest-evals` has a few built-in harnesses that use the `ai` SDK or the OpenAI SDK, it also exposes a method to create a custom harness:

```ts
import { createHarness } from "vitest-evals";

export const memory = createHarness<string, string>({
  name: "memory",
  run: async ({ input }) => {
    const output = "The capital of France is Paris";

    return {
      output,
      events: [
        { type: "message", role: "user", content: input },
        { type: "message", role: "assistant", content: output },
      ],
      usage: {
        provider: "openai",
        model: "gpt-4o-mini",
      },
    };
  },
});
```

This "harness" is not using any LLM at all: it always returns the same message, "The capital of France is Paris".

But here's the fun part: the run function can do virtually anything as long as it returns an object with this shape, so we can create a few custom harnesses that suit our needs.

## A few design decisions

Before jumping into the implementation, let's talk about a couple of design decisions.

### Running through our CLIs

We want each individual contributor to be able to optimize the agent setup for their own harness. Unless we mandate a single harness, people will likely have their own preferred way of working on a codebase. Since this is not just about the model, we can't just run everything on a cloud agent: many studies and benchmarks found that the harness is a huge factor in how a model behaves. To be as close as possible to the actual experience of working on the repo, we want individual contributors to run these evals locally with their own CLIs.

Luckily this is not a problem, as most of the harnesses either have an SDK or the ability to execute a prompt via the CLI (`claude -p` or `opencode run`), and we can access the transcripts of the whole run in specific folders.

### Easy to run multiple harnesses

Once again, every individual contributor might use a different harness: someone might not even have OpenCode installed. What should we do in that case? My personal idea? We should have two different modes: `all`, in case we want to run this optimization in CI, and `current` (specified with the name of the harness). In this second mode, every failure in the other harnesses will warn instead of failing. This means that with a simple environment variable we can make sure our agent setup stays optimized for every harness in CI, while every individual contributor can specify their own preferred harness locally and optimize for that (while also optionally optimizing for the other harnesses if they install their CLIs).

### Easy matchers for the important metrics

Since we know that we want to use these evals specifically to optimize our agent setup, we can keep track of some useful metrics in our `run` function and expose some Vitest matchers specifically for them (so that developers can use its familiar API). What kind of metrics are we talking about?

- Tokens: while it's not always possible to optimize for tokens (you can't just ask for a task to take fewer than 100 tokens and expect it to finish), having the right number could make sure that our agent setup steers the agent toward methods that save tokens (if that's one of your goals).
- Skills: having a way to assert that a certain skill has or has not been used was what inspired all this, so we definitely want it in.
- Tool calls: this is somewhat similar to skills in that it's something that the user can customize in almost every harness. Since tool calls are also how models navigate your codebase, being able to assert that a tool call has or has not been made is also essential.
- Subagents: that's another easy-to-modify part of your agent setup. Spawning a subagent can also greatly influence how the agent navigates your codebase, so you should be able to assert that too. As a side note, the token count should also be split between total and main-agent-only (in case you are more concerned about context rot than spend).

### Artifacts

`vitest-evals` also includes a nice interface to see the transcripts without having to read through a lot of JSONL files. We want to piggyback on this feature, so we should also store the artifacts accordingly.

### Isolation

Having an agent actively modifying the repo while running the evals is obviously a no-go, so we need some form of isolation. The simplest way is to create a worktree, but we also want a stricter form of isolation: luckily there are a lot of solutions out there that provide the ability to programmatically create sandboxes (like Vercel Sandbox, Daytona, Boat.dev etc).

### Provide unification

One of the goals should be to run the same eval with every possible harness. However, harnesses have their differences: Codex will execute a bash command with the `command_execution` tool, OpenCode will use the `bash` or `shell` tool, and Claude Code the `Bash` tool. Being able to assert that your agent executed a script shouldn't require you to learn all of this. So our library should provide an easy way to convert between commands and to check which harness is currently running within our eval.

### Composability and extensibility

The final, and very important, design decision is that we want all of this to be extensible and composable: users should be able to create a configuration for a new harness/isolation method without having to wait on us to implement it. This means we should take inspiration from Vite and Vitest and create some sort of plugin system.

## So what does it look like?

Now that we have our basic design principles, we can start writing some code to create a working POC (and by "we" I obviously mean Claude and me). For this article, however, I don't want to focus on the internals (that'll be the job for a follow-up) but mostly to show you what writing some evals looks like and, most importantly, test if it actually works.

Let's start from the beginning: after installing our library `vitest-evals-harnesses` (temporary name), we can set up a new Vitest project in our Vite config:

```diff
export default defineConfig({
	test: {
		projects: [
+			{
+				extends: './vite.config.ts',
+				test: {
+					name: 'evals',
+					include: ['evals/**/*.eval.ts'],
+					globalSetup: ['vitest-evals-harnesses/global-setup']
+				}
+			}
		]
	}
});
```

This will make sure that every `.eval.ts` file in our `evals` folder will run under this project. We also set `vitest-evals-harnesses/global-setup` as our `globalSetup`. This will take care of initializing the current run so that all the artifacts for the current run end up in the same folder (plus a snapshot and a summary for the whole run).

Once you've done this, you can create your config in `/evals/setup.ts` (the location is not a hard requirement, as you will see):

```ts
import {
  claudeCode,
  codex,
  createHarnessEvals,
  opencode,
  worktree,
} from "vitest-evals-harnesses";

export const { describeEval } = createHarnessEvals({
  harnesses: [claudeCode(), opencode(), codex()],
  execution: worktree(),
  mode: "current",
  current: "opencode",
  setup: {
    installDependencies: true, // from the lockfile; `false`, or a custom command
    commands: ["pnpm build"],
    env: {
      DEV: false,
    },
  },
  timeouts: {
    preparation: 10 * 60_000,
    execution: 15 * 60_000,
    cleanup: 2 * 60_000,
  },
  artifacts: { dir: "eval-results", retainWorkspace: "on-failure" },
  trials: 3,
});
```

Let's explore this small config and go over the various options:

- We first import and add the plugins for all the harnesses: Claude Code, OpenCode, and Codex. Implementing a new harness is not trivial, but it's completely doable, and an agent would likely take good care of it in case you need it.
- We also specify the execution/isolation mode: this is a required field and there's no default. Since it's very important to understand where your evals run, we want you to declare it explicitly.
- `mode` and `current` are what allow local/CI optimization checks: in this case, we are explicitly setting `mode` to `current` and `current` to `opencode`, which means that if the Claude Code or Codex CLI is unavailable, or they fail for some reason, the whole run would still "pass" and "warn" about the other harnesses. Once again, the goal is for each individual contributor to be able to run this without being forced to install a CLI, and then have a CI run that verifies that the new changes didn't break the agent setup for the other harnesses.
- `setup` is purposefully left vague: in a JS-only project we could simply run `npm i`, but you might have a mixed project with a Rust backend and a JS frontend, and we want to give you the ability to run whatever setup script is required.
- Running the evals for too long is never recommended, so with `timeouts` you can limit how long the run can execute.
- `artifacts` is a simple way to customize where your artifacts are stored.
- Finally, `trials` allows you to run the evals multiple times: asserting that a skill is invoked consistently might require you to run the same task multiple times, given the non-deterministic nature of LLMs.

This configuration allows us to export our `describeEval` function. Let's take a look at a simple eval that checks that this simple (and rather weak) skill

```md
---
name: house-style
description: Team notes on how we like to do things around here.
---

# House style

These are the rules for changing the `Welcome.svelte` component in `src/lib/vitest-examples/`.

1. Read `src/lib/vitest-examples/Welcome.svelte` and `Welcome.svelte.spec.ts` before you edit.
2. Declare every prop in the single `$props()` destructuring and keep its inline type annotation up to date. Any prop that has a default must be optional in the type (`host?: string`).
3. Build all visible text with `greet()` from `./greet`. Never concatenate greeting strings inside the component.
4. Keep the markup to one `<h1>` for the host, followed by one `<p>` for each additional person. Don't add wrapper elements or classes.
5. For each new prop, add a test case to `Welcome.svelte.spec.ts` that uses `page.getByText(...)`. Don't run the browser test suite. Say in your summary that it still needs to be run.
```

loads properly:

```ts
import { describeEval } from "./setup";

describeEval("Skill activation", it => {
  it("activates the house-style skill when editing Welcome.svelte", async ({
    run,
    harness,
    skip,
    expect,
  }) => {
    skip(
      !harness.supports("skillRequest") || !harness.supports("skillLoad"),
      `${harness.runtime} has no observable skill requests or loads`
    );

    // The prompt describes the task only. It never names the skill, so the agent has to pick
    // it from its description.
    const result = await run(
      "Add an optional `cohost` prop to src/lib/vitest-examples/Welcome.svelte " +
        "so the component also greets a co-host. Do not delegate to subagents."
    );

    // Fail on crashes and timeouts so they can't pass as "the skill wasn't picked".
    expect(result).toHaveEndedWith("completed");

    // A request means the agent chose the skill; a load means the skill body reached it.
    expect(result).toHaveRequestedSkill("house-style");
    expect(result).toHaveLoadedSkill("house-style");

    // The skill should load in the main agent, not in a subagent the prompt told it not to use.
    if (harness.supports("subagents")) {
      expect(result).not.toHaveSpawnedSubagent();
    }
  });
});
```

In this example, we can see how our library can help write evals that generally work:

1. we `skip` in case our harness doesn't support skill loading
2. we make sure the turn actually completed
3. we make sure that `house-style` is both requested and loaded
4. we make sure the agent didn't spawn any subagent

Let's put this to the test:

```
 ×  evals  evals/skill_activation.eval.ts > Skill activation > claude-code (optional) > activates the house-style skill when editing Welcome.svelte [trial 1/3] [app 179869 tok / $0.24 | 7 tools] 33683ms
   reason  expected [] to include 'house-style'
 ×  evals  evals/skill_activation.eval.ts > Skill activation > claude-code (optional) > activates the house-style skill when editing Welcome.svelte [trial 2/3] [app 208056 tok / $0.23 | 7 tools] 34527ms
   reason  expected [] to include 'house-style'
 ✓  evals  evals/skill_activation.eval.ts > Skill activation > claude-code (optional) > activates the house-style skill when editing Welcome.svelte [trial 3/3] [app 184645 tok / $0.24 | 10 tools] 34102ms
 ×  evals  evals/skill_activation.eval.ts > Skill activation > opencode > activates the house-style skill when editing Welcome.svelte [trial 1/3] [app 113916 tok / $0.0049 | 11 tools] 56782ms
   reason  expected [ 'greeting-policy' ] to include 'house-style'
 ×  evals  evals/skill_activation.eval.ts > Skill activation > opencode > activates the house-style skill when editing Welcome.svelte [trial 2/3] [app 61579 tok / $0.0025 | 8 tools] 36784ms
   reason  expected [ 'greeting-policy' ] to include 'house-style'
 ×  evals  evals/skill_activation.eval.ts > Skill activation > opencode > activates the house-style skill when editing Welcome.svelte [trial 3/3] [app 104215 tok / $0.0040 | 10 tools] 53903ms
   reason  expected [] to include 'house-style'
 ↓  evals  evals/skill_activation.eval.ts > Skill activation > codex (optional) > activates the house-style skill when editing Welcome.svelte [trial 1/3] 0ms [codex has no observable skill requests or loads]
 ↓  evals  evals/skill_activation.eval.ts > Skill activation > codex (optional) > activates the house-style skill when editing Welcome.svelte [trial 2/3] 0ms [codex has no observable skill requests or loads]
 ↓  evals  evals/skill_activation.eval.ts > Skill activation > codex (optional) > activates the house-style skill when editing Welcome.svelte [trial 3/3] 0ms [codex has no observable skill requests or loads]

 Test Files  1 failed (1)
      Tests  5 failed | 1 passed | 3 skipped (9)
   Start at  12:36:33
   Duration  250.00s (transform 18ms, setup 0ms, import 95ms, tests 249.78s, environment 0ms)
```

As expected for such a weak skill, we don't get many invocations. We can also see that Codex, which doesn't have a specific tool to load skills, is automatically skipped.

Let's now ask our agent to loop this and fix the skill for us. After a few iterations, here's the updated skill:

```md
---
name: house-style
description: Use before adding, changing, reviewing, or testing the Welcome.svelte component in src/lib/vitest-examples/, including new or changed props (host, guest, co-hosts or other people to greet), its markup, and its Welcome.svelte.spec.ts browser tests. Covers prop declarations and types, building text with greet(), allowed markup, and required test cases. For changes to the greet() formatter itself in greet.ts, use greeting-policy instead.
---

# House style

These are the rules for changing the `Welcome.svelte` component in `src/lib/vitest-examples/`.

1. Read `src/lib/vitest-examples/Welcome.svelte` and `Welcome.svelte.spec.ts` before you edit.
2. Declare every prop in the single `$props()` destructuring and keep its inline type annotation up to date. Any prop that has a default must be optional in the type (`host?: string`). This includes the existing `host` and `guest` props: the file currently types them as required, so make them optional whenever you touch the type.
3. Build all visible text with `greet()` from `./greet`. Never concatenate greeting strings inside the component.
4. Keep the markup to one `<h1>` for the host, followed by one `<p>` for each additional person. Don't add wrapper elements or classes.
5. For each new prop, add a test case to `Welcome.svelte.spec.ts` that uses `page.getByText(...)`. Don't run the browser test suite. Say in your summary that it still needs to be run.
```

And this is the eval result after the touch-up:

```
 ✓  evals  evals/skill_activation.eval.ts > Skill activation > claude-code (optional) > activates the house-style skill when editing Welcome.svelte [trial 1/3] [app 215235 tok / $0.24 | 8 tools] 43436ms
 ✓  evals  evals/skill_activation.eval.ts > Skill activation > claude-code (optional) > activates the house-style skill when editing Welcome.svelte [trial 2/3] [app 182372 tok / $0.23 | 8 tools] 41426ms
 ✓  evals  evals/skill_activation.eval.ts > Skill activation > claude-code (optional) > activates the house-style skill when editing Welcome.svelte [trial 3/3] [app 221728 tok / $0.25 | 8 tools] 40985ms
 ✓  evals  evals/skill_activation.eval.ts > Skill activation > opencode > activates the house-style skill when editing Welcome.svelte [trial 1/3] [app 108119 tok / $0.0042 | 11 tools] 58842ms
 ✓  evals  evals/skill_activation.eval.ts > Skill activation > opencode > activates the house-style skill when editing Welcome.svelte [trial 2/3] [app 75406 tok / $0.0029 | 9 tools] 40894ms
 ✓  evals  evals/skill_activation.eval.ts > Skill activation > opencode > activates the house-style skill when editing Welcome.svelte [trial 3/3] [app 153064 tok / $0.0063 | 14 tools] 85143ms
 ↓  evals  evals/skill_activation.eval.ts > Skill activation > codex (optional) > activates the house-style skill when editing Welcome.svelte [trial 1/3] 1ms [codex has no observable skill requests or loads]
 ↓  evals  evals/skill_activation.eval.ts > Skill activation > codex (optional) > activates the house-style skill when editing Welcome.svelte [trial 2/3] 0ms [codex has no observable skill requests or loads]
 ↓  evals  evals/skill_activation.eval.ts > Skill activation > codex (optional) > activates the house-style skill when editing Welcome.svelte [trial 3/3] 0ms [codex has no observable skill requests or loads]

 Test Files  1 passed (1)
      Tests  6 passed | 3 skipped (9)
   Start at  14:33:38
   Duration  310.92s (transform 17ms, setup 0ms, import 85ms, tests 310.73s, environment 0ms)
```

All six Claude Code and OpenCode trials now pass, up from one out of six before the change.

### Difficulties and next steps

While this seems to work fine, we have admittedly tested it mostly in toy repos: the concept should be portable to bigger repos, but we absolutely need to test it before releasing something that might not work.

There's also another hard challenge hidden in plain sight: you may have noticed that the Codex tests were skipped in our example. Why? Because Codex can't load skills. You might look at this sentence and say "Wait a second, I use Codex and skills all the time", and you would be right: Codex doesn't have a specific skill tool, it's just instructed to read the skill file with the read command or (as it often does) with Python. We still need to figure out a way to reliably detect this so that you don't have to do it inside the evals.

Each harness plugin also needs a parser, and the underlying transcript format can change between versions, so if we end up publishing this library, we should set up some automation where agents can help us maintain the parsers.

## Conclusions

So how can you use this library today? You can't! This kind of idea is pretty new, and we want to test it properly and get the library right before publishing anything (it also desperately needs a better name). We will take our time to figure out which metrics are necessary, test how it works in bigger repos, and see how easy we can make it to write good evals. We're going to be posting about this on this blog, so stay tuned for what comes next!
