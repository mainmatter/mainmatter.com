---
title: "All code will converge on Rust"
authorHandle: marcoow
tags: [ai, rust]
bio: "Marco Otte-Witte"
description: "tbd"
tagline: '<p>When we <a href="/blog/2022/10/12/making-a-strategic-bet-on-rust/">made our strategic bet on Rust back in 2022</a>, we focused on Rust for backends and cloud systems. At the time, that was not an obvious choice. Rust was mostly seen as a systems language, a safer replacement for C and C++ in operating systems, embedded devices, or browser engines. Using it for the kind of web backend that teams would typically build with Rails, Django, or Node.js required some explaining.</p>'
autoOg: true
---

In talks, I used to show this slide to explain where we saw Rust fitting in:

![Effort for working on codebases with Rust vs. other stacks in 2022](/assets/images/posts/2026-09-25-all-code-will-converge-on-rust/image-1.png)

The chart shows the effort it takes to build and evolve a system over time. With Rust, the initial effort is much higher than with other languages. You need to learn entirely new and unfamiliar concepts like ownership, borrowing, and lifetimes to get anything useful to even compile, which is a huge hurdle for many teams. Over time though, the effort goes down. Rust encodes a lot more in the language itself – ownership, lifetimes, error handling, exhaustive matching, and a rich type system – so the compiler catches a large class of mistakes before anything runs. That means Rust codebases can be changed with confidence, in particular when teams grow and change, and the people who wrote the original code have long moved on.

For other languages, the curve looks different. Other stacks make it much easier then Rust to get to something that works fast, but eventually it gets pretty hard to work with these stacks once a codebase grows large – that’s certainly the case for languages like Ruby and JavaScript and to a lesser extent for Java or Go as well. Al of these stacks encode fewer rules, concepts, and checks in the languages themselves, so you end up relying more on tests to know whether a change breaks something, and those tests are very often neither great nor complete.

Based on these considerations, we pitched Rust specifically for use cases where teams were willing to make that additional upfront investment in exchange for superior performance and, in particular, reliability. Finance applications like core banking systems were the prime example: nobody minds spending more time upfront when the alternative is a bug that moves money to the wrong account.

## The curve has changed

Today, you can argue the curve looks more like this:

![Effort for working on codebases with Rust vs. other stacks today](/assets/images/posts/2026-09-25-all-code-will-converge-on-rust/image-2.png)

The initial effort is still higher for Rust than for other technologies but not nearly by the same margin. You still need to understand the core concepts, the ecosystem, the typical development infrastructure, etc. Yet, it's much easier to generate working code, specifically because of LLMs. Getting Rust code to compile is no longer the bottleneck it once was, since coding agents are good at writing Rust code, working through compiler errors along the way. That spares engineers from having to climb over the hurdle of learning loads of new concepts before they can build anything.

On the other hand, what hasn't changed is the quality of the resulting systems. A system built in Rust is still much faster, more reliable, and more resource-efficient than the same system implemented in any other stack.

The consequence is that Rust all of a sudden becomes a viable choice in a lot of places where teams would not have been willing to use it before. The trade-off we used to describe for finance applications applies much more broadly once the upfront cost shrinks.

## It's already happening

We're seeing that shift in the industry already. More and more teams we talk to use Rust for backends they would have built with Rails or Django before, maybe with a performance-critical core written in Rust underneath. Now, they build the whole thing in Rust.

Companies like OTTO, one of Germany's largest e-commerce companies and traditionally a Java shop, are adopting Rust with great success. Even DHH, the creator of Ruby on Rails and arguably the most prominent advocate of the "get something working fast" end of the curve, writes systems in Rust now.

Migrations further add to this trend. With LLMs and tooling, projects that would have been completely out of reach only a year ago are now possible: legacy systems that nobody dared to touch because rewriting them would have taken years and cost a fortune can now be replaced in a semi-automated way and at a fraction of the cost. At the same time, the pressure to do so is growing. AI models are getting better at security research, including finding and exploiting vulnerabilities, which makes every memory-unsafe codebase in production a bigger liability than it was before. In almost all of these cases, the language to migrate to will be Rust. It's the only mainstream language that gives you the performance and low-level control of C and C++ together with memory safety, and it can interoperate with existing C code, so a system can be migrated piece by piece instead of in one big rewrite.

## Rust and LLMs are the perfect match

Rust is not only easier to produce with LLMs than before. It's probably also more efficient to produce with LLMs than most other languages. Since more of the constraints are explicitly encoded in Rust code, the compiler gives an LLM a much faster and more precise feedback loop. An agent writing JavaScript or Ruby can produce code that looks fine and only fails at runtime or in a test (if there is one). An agent writing Rust learns about a whole range of mistakes the moment it runs `cargo build` and can fix them right away.

That also affects how much you can trust the result. I feel much more confident about Rust code that was generated by an LLM and that I maybe haven't reviewed in complete depth than I would about the same system written in JavaScript. The compiler has already checked types, ownership, error handling, and exhaustiveness in ways no human reviewer can do consistently.

## All code will converge on Rust

**All of that, we believe, leads to all code converging on Rust eventually** – with some exceptions, of course. If you build a web frontend that runs in the browser and needs access to the web platform APIs, that really requires JavaScript (yes, there's WebAssembly, but it’s not really something I’d expect most web apps to eventually be written in). The same is true if you need code that you can change at runtime. For pretty much everything else, we now assume that code will converge on Rust.

**The calculation is easy: when the cost of the available alternatives is the same or similar, but one of them leads to much better results, there isn't much left to decide.**

## Beware the trap

Yet, there's a trap that's just waiting for teams to fall into it. Leaning only on AI without building up the expertise to be able to judge whether the generated results are good is a real risk. You can go faster with AI than ever before, but that's true in both directions: you can build great systems faster, and you can build horrific messes faster. The Rust compiler catches a lot, but it won't tell you whether your architecture makes sense, whether your async code holds up under load, or whether the abstractions an agent came up with will still work for you in two years. Making those calls still requires people who know Rust well.

We've been helping teams adopt Rust since 2022, we run [EuroRust](https://eurorust.eu), we wrote [100 Exercises to Learn Rust](https://rust-exercises.com) as well as the [C to Rust Migration Book](/c-to-rust-migration-book/). If you're interested in adopting Rust and want guidance along the way, [/contact/](reach out)!
