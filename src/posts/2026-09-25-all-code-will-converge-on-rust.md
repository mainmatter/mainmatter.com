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

![Effort for working on codebases with Rust vs. other stacks in 2022](/assets/images/posts/2026-09-25-all-code-will-converge-on-rust/image-1.webp)

The chart shows the effort it takes to build and evolve a system over time. With Rust, the initial effort is (or was, as we'll see later) much higher than with other languages. With Rust, teams need to learn entirely new and unfamiliar concepts like ownership, borrowing, and lifetimes to get anything useful to even compile. Over time though, the effort goes down naturally and it goes down below the level that you'd typically see in other languages as codebases grow larger, teams change and knowledge about all of the little details that only implicitly live in a codebase but are not actually encoded anywhere is lost. Rust on the other hand encodes a lot more in the language itself – ownership, lifetimes, error handling, exhaustive matching, and a rich type system – so the compiler catches a large class of mistakes before anything runs. That means Rust codebases can be changed with confidence over time, in particular when teams grow and change, and the people who wrote the original code have long moved on – something that's typically not the case with other stacks.

Based on these considerations, we pitched Rust specifically for use cases where teams were willing to make that additional upfront investment in exchange for superior performance and, reliability, and long-term maintainability. Finance applications like core banking systems were the prime example: nobody minds spending more time upfront when the alternative is a bug that moves money to the wrong account.

## The curve has changed

Today, you could argue the curve looks more like this:

![Effort for working on codebases with Rust vs. other stacks today](/assets/images/posts/2026-09-25-all-code-will-converge-on-rust/image-2.webp)

The initial effort is still slightly higher for Rust than for other technologies but not nearly by the same margin. You still need to understand the core concepts, the ecosystem, the typical development infrastructure, etc. Yet, it's much easier to generate working code, specifically because of LLMs. Getting Rust code to compile is no longer the bottleneck it once was, since coding agents are good at writing Rust code, working through compiler errors along the way. That spares engineers from having to climb over a huge hurdle to even be able to make the first step and get going (building up expertise long-term is still non-negotiable of course – [more on that below](#beware-the-trap)).

On the other hand, what hasn't changed is the quality of the resulting systems. A system built in Rust is still much faster, more reliable, and more resource-efficient than the same system implemented in any other stack.

That completely changes the consideration. The trade-off I used to talk about in 2022 does not exist anymore in the same way – you're now looking at only a slightly higher investment for Rust compared to other stacks but will get a significantly better result. That makes Rust a viable option for a lot of use cases nobody would have considered it for only one year ago.

## It's already happening

We're seeing that shift in the industry already. More and more teams we talk to use Rust for backends they would have built with e.g. Rails or Django before, maybe with a performance-critical core written in Rust underneath, if at all. Now, they build the whole thing in Rust.

Companies like OTTO, one of Germany's largest e-commerce companies and traditionally a Java shop, [are adopting Rust with great success](https://www.otto.de/jobs/en/blogs/techblog/rust-migration-lambdas-microservices/). GitHub moved the Copilot agent runtime [from TypeScript and Node.js to more than 800,000 lines of Rust](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/). OpenAI [rewrote Habitat, the Python-based storage service behind ChatGPT, in Rust](https://openai.com/index/scaling-storage-one-billion-users-part-one/). Even DHH, the creator of Ruby on Rails (and a controversial figure for sure, yet someone who has been hugely influential in the tech world), [writes backends in Rust now](https://youtube.com/watch?v=vDjW_dRyKXY&t=1700).

Migrations of legacy codebases further add to this trend. With LLMs and tooling, projects that would have been completely out of reach only a year ago are now possible: ancient systems that nobody dared to touch because rewriting them would have taken years and cost a fortune can now be replaced in a semi-automated way and at a fraction of the cost (arguably, how exactly to do all this is still a field of active research and experimentation but it's clear substantial efficiency improvements are real). At the same time, the pressure to do so is growing. AI models are getting better at security research, including finding and exploiting vulnerabilities, which makes every memory-unsafe codebase in production a bigger liability than it was before. In almost all of these cases, the language to migrate to will be Rust. It's the only mainstream language that gives you the performance and low-level control of C and C++ together with memory safety, and it can interoperate with existing C code, so a system can be migrated piece by piece instead of in one big rewrite.

## Rust and LLMs are the perfect match

Rust is not only easier to produce with LLMs than before. It's probably also more efficient to produce by LLMs than most other languages. Since more of the constraints are explicitly encoded in Rust code, the compiler gives an LLM fast and precise feedback out-of-the-box before even any additional validation tooling has been set up. An agent writing JavaScript or Ruby can produce code that looks fine and only fails at runtime or in a test (if there is one). An agent writing Rust learns about a whole range of mistakes the moment it runs `cargo build` and can fix them right away.

That also affects how much you can trust the result. I would feel much more confident about Rust code that was generated by an LLM and that I maybe haven't reviewed in complete depth than I would about the same system written in JavaScript. The compiler has already checked types, ownership, error handling, and exhaustiveness in ways no human reviewer can do consistently.

## All code will converge on Rust

**All of that, we believe, leads to all code converging on Rust eventually** – with some exceptions, of course. If you build a web frontend that runs in the browser and needs access to the web platform APIs, that really requires JavaScript (yes, there's WebAssembly, but it’s not really something I’d expect most web apps to eventually be written in). The same is true if you need code that you can change at runtime. For pretty much everything else though, there is little reason to write the code in anything other than Rust.

**The calculation is easy: when the cost of the available alternatives is the same or similar, but one of them leads to much better results, there isn't much left to decide really and the choice is obviusly going to be Rust.**

## Beware the trap

Yet, there's a trap that's just waiting for teams to fall into it. Leaning only on AI without building up the expertise to be able to judge whether the generated results are good is a real risk. You can go faster with AI than ever before, but that's true regardless of direction: you can build great systems faster, and you can build horrific messes faster as well. The Rust compiler catches a lot, but it won't tell you whether your architecture is sound, whether your async code holds up under load, or whether the abstractions an agent came up with will still work for you in two years. Making those calls still requires people who know Rust well.

We've been helping teams adopt Rust since 2022, we run [EuroRust](https://eurorust.eu), and we wrote [100 Exercises to Learn Rust](https://rust-exercises.com) as well as the [C to Rust Migration Book](/c-to-rust-migration-book/). If you're interested in adopting Rust and want guidance along the way, [/contact/](reach out)!
