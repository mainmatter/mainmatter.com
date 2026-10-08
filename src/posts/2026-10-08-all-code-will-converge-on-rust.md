---
title: "All code will converge on Rust"
authorHandle: marcoow
tags: [ai, rust]
bio: "Marco Otte-Witte"
description: "When producing code costs the same in every language, the one that yields better systems wins. Marco Otte-Witte explains why we believe all code will converge on Rust."
tagline: '<p>When we <a href="/blog/2022/10/12/making-a-strategic-bet-on-rust/">made our strategic bet on Rust back in 2022</a>, we focused on Rust for backends and cloud systems. At the time, that was not an obvious choice. Rust was mostly seen as a systems language only, a safer replacement for C and C++ in operating systems, embedded devices, or browser engines. Suggesting to use it also for the kind of web backends that teams would typically build with Rails, Django, or Node.js required some explaining.</p>'
autoOg: true
---

In conference talks I gave at the time to pitch Rust for these other use cases, I showed the following chart to explain what we considered to be Rust's rather unique advantage:

![Effort for working on codebases with Rust vs. other stacks in 2022](/assets/images/posts/2026-10-08-all-code-will-converge-on-rust/image-1.webp)

The chart shows the effort it takes to build and evolve a system over time. With Rust, the initial effort is (or was, as we’ll see later) much higher than with other languages: teams need to learn concepts like ownership, borrowing, and lifetimes, which are completely unfamiliar to most developers, before they can even get a simple program to compile. Over time, though, the effort goes down, and eventually it drops below what you’d typically see with other languages.

The reason for that is that in other languages, lots of little details and invariants aren’t explicitly encoded in a codebase but are only implicitly inherent to it, so teams have to rely on shared knowledge to work with the codebase. The larger a codebase grows, the harder that gets, and the knowledge fades over time or gets lost entirely when people leave. Developers end up working in a system they don't fully understand and can't be confident in their changes, so every change takes longer to get right, or causes rework later if it turns out to be wrong. Rust encodes much more in the language itself via its unique mechanisms: ownership, lifetimes, enforced error handling, enforced exhaustive matching, and its rich type system. The compiler catches a large class of mistakes before anything runs, so teams can change Rust codebases with confidence years later, long after the people who wrote the original code have moved on.

Based on these considerations, we pitched Rust specifically for use cases where teams were willing to make that additional upfront investment in exchange for superior performance, reliability, and long-term maintainability. Finance applications like core banking systems were the prime example: nobody minds spending more time upfront when the alternative is a bug that moves money to the wrong account.

## The curve has changed

Today, you could argue the curve looks more like this:

![Effort for working on codebases with Rust vs. other stacks today](/assets/images/posts/2026-10-08-all-code-will-converge-on-rust/image-2.webp)

The effort for writing code has obviously gone down across the board, because LLMs write decent code in any language. The initial effort for writing (or generating) Rust code is probably still slightly higher than for other technologies, but not by nearly the same margin. You still need to understand Rust's core concepts, the ecosystem, the typical development infrastructure, etc. Yet, it's much easier to generate working code. Fighting your way through super-long generic declarations or borrow checker complaints to get Rust code to compile is no longer the bottleneck it once was, since coding agents will do most of the work just fine. That spares engineers from having to climb over what was a huge initial hurdle just to get started (building up expertise long-term is still non-negotiable of course – [more on that below](#beware-the-trap)).

At the same time, what hasn't changed is the quality of the resulting systems. A system built in Rust is still going to be much faster, more reliable, and more resource-efficient than the same system implemented in almost any other stack.

That completely changes the assessment of whether to build on Rust. The trade-off I used to talk about in 2022 does not exist anymore in the same way. You're now looking at only a slightly higher investment for Rust compared to other stacks, but you get a significantly better result. That makes Rust a viable option for a lot of use cases nobody would have considered it for only one year ago.

## It's already happening

We're seeing that shift in the industry already. More and more teams we talk to use Rust for backends they would previously have built with Rails, Django, Node.js, or Java, maybe with a performance-critical core written in Rust underneath, if at all. Now, they build the whole system in Rust.

Companies like OTTO, one of Germany's largest e-commerce companies and traditionally a Java shop, [are adopting Rust with great success](https://www.otto.de/jobs/en/blogs/techblog/rust-migration-lambdas-microservices/). GitHub moved the Copilot agent runtime [from TypeScript and Node.js to more than 800,000 lines of Rust](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/). OpenAI [rewrote Habitat, the Python-based storage service behind ChatGPT, in Rust](https://openai.com/index/scaling-storage-one-billion-users-part-one/). Even DHH, the creator of Ruby on Rails (and a controversial figure for sure, yet someone who has been hugely influential in the tech world and is hard to ignore), [writes backends in Rust now](https://youtube.com/watch?v=vDjW_dRyKXY&t=1700).

Migrations of legacy codebases further add to this trend. With LLMs and tooling, legacy system migration projects that would have been completely out of reach until recently are now possible: ancient systems that nobody dared to touch because rewriting them would have taken years and cost a fortune can now be replaced in a semi-automated way and at a fraction of the cost (how exactly to do this is still a field of active research and experimentation, but the speedups are clearly real). At the same time, the pressure to do so is growing. AI models are getting better at security research, including finding and exploiting vulnerabilities, which makes every memory-unsafe codebase in production, in particular if exposed to the internet, a bigger liability than it was before. In almost all of these cases, the language to migrate to will be Rust. It's the only mainstream language that gives you the performance and low-level control of C and C++ together with memory safety, and it can interoperate with existing C code, so a system can be migrated piece by piece instead of in one big rewrite (check out our [C to Rust Migration Book](/c-to-rust-migration-book/) for guidance on migrating C codebases to Rust incrementally).

## Rust and LLMs are the perfect match

Rust is not only easier to produce with LLMs than before. It's probably also more efficient for LLMs to produce than most other languages. Since more of the constraints are explicitly encoded in Rust code, the compiler gives an LLM fast and precise feedback out of the box, even before any additional validation tooling has been set up. An agent writing JavaScript or Ruby can produce code that looks fine and only fails at runtime or in a test (if there is one). An agent writing Rust learns about a whole range of mistakes the moment it runs `cargo build` and can fix them right away.

That also affects how much you can trust the result. I would feel much more confident about Rust code that was generated by an LLM and that I maybe haven't reviewed in full depth than I would about the same system written in JavaScript. The compiler has already run checks and prevented issues that no human reviewer would be able to identify consistently.

## All code will converge on Rust

**All of that, we believe, leads to all code converging on Rust eventually** – no longer just highly critical code but any code really. There are exceptions, like web frontends that run in the browser and need access to the web platform APIs, which still require JavaScript. For pretty much everything else, there is little reason to write code in anything other than Rust, because any other language will give you a worse result.

**The calculation is easy: when the alternatives cost about the same, but one of them leads to much better results, there isn't much left to decide at all.**

## Beware the trap

Yet, there's a trap just waiting for teams to fall into. Generating an application from scratch in Rust relying only on AI is one thing. Building a complex system with real users and in particular maintaining and evolving that system over time with a (changing) team is a very different undertaking. The latter requires engineering infrastructure and, in particular, organizational expertise in the technology you are building on to allow teams to work on systems efficiently for the long term. Leaning only on AI without building up these structures is a real risk. AI allows teams to move faster than ever before, but that's true regardless of direction: they can build great systems faster, and they can end up with horrific messes much faster as well, eventually hitting a wall at full speed.

We've been helping teams adopt Rust since 2022, we run [EuroRust](https://eurorust.eu), and we wrote [100 Exercises to Learn Rust](https://rust-exercises.com) as well as the [C to Rust Migration Book](/c-to-rust-migration-book/). If you're interested in adopting Rust and want guidance along the way, [reach out](/contact/)!
