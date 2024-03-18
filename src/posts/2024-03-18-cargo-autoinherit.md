---
title: "cargo-autoinherit: DRY up your workspace dependencies"
authorHandle: algo_luca
tags: [rust]
bio: "Luca Palmieri, Principal Engineering Consultant"
description:
  "cargo-autoinherit is a new Cargo subcommand that converts your Cargo
  workspace to use dependency inheritance, wherever possible. It helps you to
  keep your dependencies DRY, reducing the risk of version mismatches and
  unnecessary duplication."
# TODO: Adjust header image
og:
  image: /assets/images/posts/2024-03-18-cargo-autoinherit/og-image.png
image: "/assets/images/posts/2024-03-18-cargo-autoinherit/cargo_rust.png"
imageAlt: "The Rust logo on a background showing cargo containers"
---

[`cargo-autoinherit`] is a new Cargo subcommand that automatically DRYs up your
workspace dependencies using
[dependency inheritance](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#inheriting-a-dependency-from-a-workspace).

You can find prebuilt binaries on
[GitHub's Releases page](https://github.com/mainmatter/cargo-autoinherit/releases).  
Alternatively, you can build from source:

```bash
cargo install --locked cargo-autoinherit
```

### Table of contents

- [The problem](#the-problem-)
- [The solution](#the-solution)
- [The casus belli](#the-casus-belli)
- [`cargo-autoinherit`](#cargo-autoinherit)
  - [Installation](#installation)
  - [Limitations](#limitations)

## The problem

When you have multiple packages in a Cargo workspace, you often end up depending
on the same packages in multiple `Cargo.toml` files.  
This duplication can become an issue:

- When you want to update a dependency, you have to update it in multiple
  places.
- When you need to add a new dependency, you first have to check if it's already
  used in another package of your workspace to keep versions in sync.

This process is error-prone and tedious.  
If you mess it up, you end up with different versions of the same dependency
within your workspace. This can lead to hard-to-debug compilation errors or
bloat your artifacts with unnecessary copies of the same package.

## The solution

The solution to this problem is to use
[dependency inheritance](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#inheriting-a-dependency-from-a-workspace),
a recent Cargo feature: you can specify dependencies once, in the root
`Cargo.toml` of your workspace, and then refer to that centralized list from the
members' `Cargo.toml` files.

In practice, it looks like this:

```toml
# In the root `Cargo.toml`
[workspace.dependencies]
log = "0.4"
```

```toml
# In a member's `Cargo.toml`
[dependencies]
log = { workspace = true }
```

Nice and DRY!

## The casus belli

A couple of weeks ago I had some maintenance work on the agenda: update all
dependencies in
[Mainmatter's Rust telemetry workshop](https://github.com/mainmatter/rust-telemetry-workshop).
Each step of the workshop is a separate Cargo package, for a grand total of 30
`Cargo.toml` files in a single workspace.

When I wrote the workshop, I didn't have the foresight to use dependency
inheritance. I now had to go through each `Cargo.toml` file, centralize the
dependencies in the root `Cargo.toml`, and then update the members' `Cargo.toml`
files to use the new `workspace` syntax.

The work was beyond tedious and I thought: "There must be a tool to automate
this!"  
There wasn't, so I wrote one.

## `cargo-autoinherit`

[`cargo-autoinherit`] is a Cargo subcommand that helps you to keep your
dependencies DRY.

You invoke it from the root of your workspace:

```bash
# From the root of your workspace
cargo autoinherit
```

It collects all the dependencies used by your workspace members, determines
which ones can be DRYed and moves them to the `[workspace.dependencies]` section
of the root `Cargo.toml`. It also takes care of updating the members'
`Cargo.toml` files, setting the correct `features` field for each package.

### Installation

You can find prebuilt binaries on
[GitHub's Releases page](https://github.com/mainmatter/cargo-autoinherit/releases).  
Alternatively, you can build from source:

```bash
cargo install --locked cargo-autoinherit
```

### Limitations

There are a few limitations to be aware of when using `cargo-autoinherit`:

- It won't auto-inherit path dependencies.
- It won't auto-inherit dependencies from private registries.
- It will only merge version requirements that are obviously compatible (e.g.
  `^1.0.0` and `^1.1.5` will be merged to `^1.1.5`, but `^1.0.0` and `>=1,<2`
  won't be merged).

Beyond known limitations, keep in mind that [`cargo-autoinherit`] is a young
project. We tested it on a few workspaces, but there might be edge cases we
haven't encountered yet. If you find a bug, please open an issue on the
[GitHub repository](https://github.com/mainmatter/cargo-autoinherit).

[`cargo-autoinherit`]: https://github.com/mainmatter/cargo-autoinherit
