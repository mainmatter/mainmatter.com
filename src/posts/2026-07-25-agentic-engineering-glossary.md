---
title: "A complete Agentic Engineering glossary"
authorHandle: paoloricciuti
tags: [ai, agentic_engineering]
description: "Agentic Engineering is a new and complex topic. Having a glossary can help you get the most out of it!"
autoOg: true
tagline: <p>Agentic Engineering is a new and complex topic that's constantly changing and evolving. We set down and wrote up a glossary to help you stay up to date with all the new terms!</p>
---

**Neural network:** a combination of a data structure and an algorithm that is meant to mimic the human brain by correlating certain outputs with certain inputs. Its "neurons" (nodes in a graph with an activation function and a weight) are interconnected. A series of inputs starts the process and goes through a series of neurons, where the different weights activate different paths. At the end of the graph, some output nodes "activate" a certain answer.

**LLM:** an acronym for large language model. It's the kind of neural network that is most popular nowadays. As the name suggests, it's a **model** that tries to predict the next token in a sentence by using the fact that, in a **language**, the distribution of words isn't random. These models are **large** because they've been trained on very large quantities of text to make them as accurate as possible.

**Token:** one of the possible "words" in a model's vocabulary, extracted from the entire corpus of text the LLM ingested during its training phase. The word "words" is quoted because the tokenization process splits some words for efficiency (for example, the word `unhappy` can be split into the two tokens `un` and `happy`).

**Retrieval-augmented generation, or RAG:** retrieving relevant external information and inserting it into the model's context before or during generation.

**Tab completion:** the simplest and oldest form of AI coding; your editor sends various levels of context from your codebase to a small and fast model to get back a few tokens' worth of code, then presents them to you in a ghosted state. You can hit Tab and "materialize" that code in your editor.

**Codebase indexing / semantic code search:** preprocessing or embedding repository content so an agent can retrieve relevant symbols and files by meaning rather than relying only on exact text matching. While this practice seems like a no-brainer, research shows that allowing an agent to build the context it needs autonomously is far more effective.

**Agent:** a program that invokes an LLM in a loop and has agency over certain operations (like reading and writing files, searching the web, using Bash, etc.).

**Context:** the maximum number of tokens that a model can manage. Every message (whether from you or the AI), MCP definition, skill, tool call, etc. increases the running count of tokens in the context. It's the most precious resource for an agent: the agent needs context to properly work on what you want, but once the context fills up, the model's intelligence quickly degrades. This is why it's important to add only the things that are necessary for it to work (no unnecessary MCPs, skills, or instructions).

**Context rot:** the decline in agent performance as its context becomes longer, noisier, internally inconsistent, or crowded with obsolete information.

**`AGENTS.md`:** an open convention for placing agent-specific repository guidance in a predictable file. Since this file is included in every thread, it should be used sparingly and include only information that can't be inferred by searching the codebase or statically analyzed by a lint rule.

**Tools:** deterministic functions that the model can invoke by sending a message in a specific format. Generally provided by the harness, they allow the agent to be agentic. The tools that almost every harness has include `read`, `bash`, `update`, and `web_search`, but users can often define their own. They reintroduce a bit of determinism into the stochastic process of LLM generation.

**Subagent:** Context is the most important resource for agents. Subagents aim to solve part of that problem: every atomic operation (like running tests and figuring out why they fail or writing a file) can technically be done without "polluting" the main agent (the one that has the whole context of the task). This is possible by allowing the agent to create a new instance of itself with a new prompt. This means subagents can be spawned in parallel and work on that one task without increasing the token count in the main agent.

**MCP:** stands for Model Context Protocol; as the name suggests, it is a protocol, which means a shared contract between two parties that need to communicate. This allows MCP clients (a role generally fulfilled by the harness) to talk to MCP servers (programs that listen for JSON-RPC payloads and expose tools, resources, prompts, etc.), e.g. to retrieve information or invoke tools. It's an easy way for developers to "package" a series of tools and provide them to the model.

**Skills:** after MCP became popular, a few companies started developing very bloated MCP servers: they had a lot of tools with very lengthy descriptions. Based on how the MCP specification worked, this had the unwanted side effect of unnecessarily polluting the context. The reason is that once an MCP server was added, all the tools and tool definitions ended up in the context: there was no progressive disclosure. Skills were the answer to this problem: they are simple Markdown files that describe a "way of doing something." They have a basic description, which is injected into the context and allows the model to load the full file only when it deems it necessary. They can also have scripts that the agent can run, allowing them to act somewhat like `tools`.

**Hooks:** deterministic functions invoked at specific moments during an agent's execution (before sending a message, on a tool call). They allow the developer to _hook_ into the lifecycle of an agentic loop.

**Agent2Agent Protocol, or A2A:** an open protocol for communication and collaboration between independent agents, potentially built by different vendors. It is intended for delegation, coordination, status exchange, and delivery of results while allowing each agent's internal implementation to remain opaque.

**Agent Client Protocol, or ACP:** a protocol for communication between coding agents and editors or IDEs. It standardizes capabilities such as sessions, tool use, file diffs, and status updates using local or remote transports.

**Agent loop:** the main loop in every harness, where the inference API is invoked over and over until a stopping condition is met.

**Stopping condition / termination criterion:** the rule that ends an agent's loop: the goal is satisfied, tests pass, a maximum number of steps is reached, the budget is exhausted, the agent requests help, or a safety rule blocks further action.

**Turn, thread, session:** a **turn** is one interaction or model action; a **thread** is an ordered conversation or run history; a **session** is a continuing interaction that preserves relevant history.

**Prompt engineering:** applying engineering practices to the prompt you are sending to the agent, making incremental changes and measuring the results to slowly build the best possible prompt.

**Context engineering:** applying engineering practices to context management by fine-tuning the amount of context fed to the agent to provide just enough to get the task done, and no more.

**Compaction:** When models reach a certain threshold of used context, their intelligence drops drastically. To solve this, many harnesses trigger a compaction when the context reaches that threshold. A compaction means summarizing the current thread with an AI model to extract only the relevant information, then resetting the context to include only that summary.

**Prompt injection:** instructions designed to manipulate a model into ignoring its intended task or policy. It can be direct (when the instruction is supplied directly by the user) or indirect (when the instructions are included in a file or a website that the agent is reading). It's the biggest security risk with LLMs since **any** text ingested by your agent can hide hidden instructions that steer the agent into subtle ways. An example could be for example a website that looks normal but has white text on white background that tells the agent to send your `ANTHROPIC_API_KEY` to `https://malicious.website` to validate you are allowed to read the website; the model might then read your env and send it to `https://malicious.website` to fulfill your request leaking your secrets (most of the times it will be more nuanced than this since models are actively training against this kind of attack).

**Tool poisoning / MCP tool poisoning:** manipulating a tool definition, tool description, server response, or connected capability to prompt-inject the agent.

**Vibe coding:** a term introduced by Andrej Karpathy in a 2025 [tweet](https://x.com/karpathy/status/1886192184808149383). It's the idea of letting your agent generate code and verify its "correctness" without looking at the code, continuously prompting the agent until all visible issues are fixed. It's often conflated with "coding using AI."

**Agentic engineering:** a term introduced (once again) by Andrej Karpathy in a 2026 [tweet](https://x.com/karpathy/status/2019137879310836075), with a refined and more mature view of vibe coding. Agentic Engineering is the natural evolution of Vibe Coding, in which models have become more and more capable and the work you can do with them has moved from simple prototypes and internal apps to actual products. The difference from _vibe coding_ is that you care about code quality and put all sorts of engineering systems in place to prevent the agent from writing bad code or introducing bugs and regressions in your application.

**Spec-driven development:** with spec-driven development, you don't write code; you write a spec for your application (with or without the help of an agent) and then let the agent iterate on the spec. It is basically a super-detailed prompt that explores every branch of your application, carefully detailing how it should work.

**Agent harness:** the software surrounding the model that manages system prompts, context, tool execution, permissions, retries, state, stopping rules, and outputs. While it may seem like just a detail (like the editor you choose when writing your code), the same model can [behave completely differently in different harnesses](https://x.com/edwinarbus/status/2033625866350334333). This is both because the system prompt and tool descriptions can steer the agent toward better or worse results, and because certain models are trained on specific harnesses and will work better when the tools available match their training set.

**Harness engineering:** Harness engineering is the practice of applying engineering principles to the harness to get the best possible result with a given **model+harness** pair. This means introducing the right set of skills, tools, subagents, and instructions, and having the right codebase structure, abstractions, and developer tools to make the job of an agent working in said codebase as smooth as possible.

**Model-native harness:** a harness developed by the same company that also develops the model (e.g., Claude Code for Anthropic, Codex for OpenAI). While some people think these are optimized for the model, research shows that's not the case.

**Workflow:** a predefined sequence or graph of model and tool operations. Workflows can contain branching and parallelism based on the result of a model invocation, but the possible paths are largely designed in advance.

**Agentic workflow:** a repository or business workflow expressed as a goal and a series of verification checks rather than a deterministic script. The coding agent decides how to complete the task and when it is actually done.

**Plan / plan mode:** a specific mode that prevents the agent from making any changes to the code. In this mode, the only things an agent can do are reason about the task, research it, and output an `md` file with the implementation plan. This allows the agent to execute bigger tasks without getting lost in the weeds of the code, focusing on the important aspects of the task. This also allows the developer to review plan (and it SHOULD be reviewed to be effective) before executing on it saving from unnecessary "rabbit holes" in case the model misunderstood the assignment.

**Human in the loop, or HITL:** the practice of making the agent request permission for every action, introducing a human element into the agentic loop.

**Sandbox / execution environment:** an isolated environment in which the agent can execute code with controlled filesystem, network, process, and credential access. A sandbox limits the damage caused by mistakes or malicious instructions.

**Computer use:** a capability that lets a model interact with graphical interfaces through screenshots, mouse actions, and keyboard input rather than only calling APIs or terminal tools.

**Prompt chaining:** breaking a task into a fixed sequence of model calls, where the output of one step becomes the input of the next.

**Routing:** the act of classifying a request and sending it to the most appropriate model, prompt, tool set, workflow, or specialist agent.

**Orchestrator–worker pattern:** a pattern with a main (generally more intelligent) agent that develops the plan and coordinates the work on a task, delegating the manual work to cheaper subagents (workers) and finally reviewing their work when it's finished.

**Planner–generator–evaluator pattern:** a pattern where a planner model determines the best plan for executing the task, a generator implements it, and an evaluator checks the result against the requirements.

**Task decomposition:** dividing a broad goal into smaller units that are easier to understand, execute, verify, and parallelize.

**Handoff:** the transfer of responsibility and knowledge from one agent to another. It can be implemented in different ways, but it generally requires storing the plan or state of the task in an external file that can be referenced later.

**Agent swarm:** a loose label for a larger, distributed group of agents working concurrently. It has no single standardized technical definition and is often used more broadly than "multi-agent system."

**Long-horizon task:** a task that requires many actions, context updates, or sessions rather than one model response. Examples include implementing an application, upgrading a large dependency, or resolving a complex repository issue. This is also used as a measure of a model's quality by measuring the longest-horizon task it can perform.

**Managed agent:** an agent whose runtime, session state, sandbox, tools, and execution infrastructure are provided as a managed service, allowing applications to introduce agentic workflows without the burden of managing retries, sandboxing, etc.

**Continuous AI / agentic CI:** the use of background agents as an analog to continuous integration. Instead of only running deterministic checks, agents continuously perform judgment-heavy work such as documentation maintenance, test improvement, issue triage, or repository hygiene.

**Ralph loop / Ralph Wiggum method:** a pattern that repeatedly invokes an agent against the same prompt with a persistent project state until the completion criteria are met. Variations use scripts or hooks to keep the agent iterating after individual context windows or sessions end. The term is informal, and implementations differ.

**Evals:** a repeatable procedure for measuring how well an agent performs defined tasks. It's like unit testing for the agent's work, and it generally consists of invoking a model and writing expectations for the output. Given the probabilistic nature of agents, it's unreasonable to expect a 100% pass rate for evals, but they can be used to verify how different models and prompts affect the "business logic."

**Worktree:** an isolated working copy associated with a Git branch. Agents use worktrees to work on multiple branches at the same time without stepping on each other's toes.

**SWE-bench Verified:** a curated set of 500 SWE-bench tasks reviewed for solvability. It became a widely cited coding-agent benchmark, but by February 2026, OpenAI argued that contamination and task-quality problems had reduced its usefulness for measuring frontier agents.

**Deep-SWE:** a long-horizon software engineering benchmark that delivers four major advances over today's public benchmarks: no contamination, high diversity, real-world complexity, and reliable verification. It gained popularity for being much closer to what the public perceives as intelligence.

**Terminal-Bench 2.0:** a benchmark of difficult tasks performed in terminal environments, intended to test long-horizon command-line operation, tool use, and environment interaction.

**Benchmark contamination:** exposure of a model or agent to benchmark tasks, solutions, patches, or close duplicates during training or development. Contamination can inflate scores without reflecting general capability.

That is it: a comprehensive glossary of the most usual terms related to AI and agentic engineering. As we said, however, this is a fast moving world: found some term that is not elencated here? [Open an issue](https://github.com/mainmatter/mainmatter.com) on our repo and we'll take care of it.
