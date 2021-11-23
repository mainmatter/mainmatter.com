---
title: "Automating Ember releases with Rust"
authorHandle: locks
tags: "ember"
bio: "Senior Frontend Engineer, Ember Framework and Learning Core teams member"
description:
  "Ricardo Mendes discusses a command-line tool built in Rust that automates the
  releases process for the Ember Core Learning Team"
og:
  image: /assets/images/posts/2021-11-09-automating-ember-learning-releases-with-rust/og-image.png
tagline: |
  <p>Releasing a new version of Ember is no uncomplicated task. This process involves several different core teams, who are responsible for several packages and resources between them. In this post, I will explain how I used Rust to build a tool that automates part of the Ember release process.</p>
---

![Effective infrastructure for efficient development workflows illustration](/assets/images/posts/2021-11-09-automating-ember-learning-releases-with-rust/illustration.svg#full)

## Release process for the Ember project

An Ember project release involves 4 different Core teams: Framework, Data, CLI
and Learning. The release is usually done over the period of a week, because
some steps of the release depend on previous steps being completed. The steps
are as follows:

- The Framework team releases the new version of the Ember npm package,
  [ember-source](https://www.npmjs.com/package/ember-source). This package
  contains the Ember framework code that is bundled with the app, and provides
  the `@ember` module imports that developers use when developing.
- The Data team updates their dependency on `ember-source`, tests that
  everything is working as expected and releases a new version of
  [ember-data](https://www.npmjs.com/package/ember-data). This package contains
  the code for the Ember Data library, which is Ember's default data management
  solution. You can read more in the
  [Ember Data guides](https://guides.emberjs.com/release/models/).
- The CLI team updates the `ember-source` and `ember-data` dependencies in the
  [application](https://github.com/ember-cli/ember-cli/tree/master/blueprints/app)
  and
  [addon](https://github.com/ember-cli/ember-cli/tree/master/blueprints/addon)
  blueprints, tests that everything works as expected and releases a new version
  of [ember-cli](https://www.npmjs.com/package/ember-cli). `ember-cli` is a
  command-line application that makes it easy to create, build, test and serve
  applications locally, as well as generating code such as components, routes
  and controllers. You can read more in the
  [Ember CLI guides](https://cli.emberjs.com/release/).
- The Learning team releases the relevant versions of the
  [Guides](https://guides.emberjs.com/) and the
  [API documentation](https://api.emberjs.com/ember/release), updates the
  [Releases page](https://emberjs.com/releases/), releases any relevant
  [Deprecations](https://deprecations.emberjs.com/), and finally coordinates and
  releases the [release blog post](https://blog.emberjs.com/tag/releases).

The [release blog post](https://blog.emberjs.com/tag/releases) marks the
official release of a new project version, since it means that all of the
sub-projects and relevant documentation is ready and tested for developers to
use and consult.

### The Learning team process

As you might have noticed in the list above, the Learning team touches on
several projects during the course of the release process. The team maintains a
handbook with all the steps of the
[Ember release process](https://github.com/ember-learn/handbook/blob/main/ember-releases.md).
At the time of writing, they are:

1. Guides
2. API documentation
3. Release blog post
4. Release pages
5. Deprecations
6. Upgrade Guide
7. Glitch Ember starter
8. Ember Wikipedia
9. Release bot

The steps are a mix of easily automated tasks and tasks that necessitate manual
intervention.

I started automating this process by creating bash scripts for the Guides
project. The bash scripts turn the manual steps into a guided process with
minimal interface and error handling around them. The scripts assume that you
have the project cloned and does some housekeeping to make sure you don't
accidentally lose any work you were doing when you trigger the release script.
This will be relevant later on.

Codifying the steps in bash was a big improvement, but we ran into some minor
issues. The first of which is that bash is not a language the developer in the
team are deeply familiar with. This is fine for small scripts, but as soon as
you try to introduce error handling and better ergonomics for the caller of the
script, it becomes considerably harder to write the necessary bash code.

The other reason is that bash is not natively supported on Windows. There are
ways to run bash on Windows systems, but we wanted to reduce incidental
dependencies in order to make releases portable and easier for the user.

So to run all of the steps you would need to clone the relevant repositories and
follow the release handbook line by line to make sure you get the order correct.

## Creating tool-new-release

There was still a lot of automation left on the table, so I got to work figuring
out how to improve the situation. When picking what technology I would use for
the tool I had two main concerns: portability, and ease of packaging as a
binary.

At the time I was dabbling in Rust and had already made a couple of tools for
myself using that language, so I decided to give Rust a go. Picking Rust also
had the benefit of giving me a single binary that a maintainer can download and
run, not having to deal with runtime and dependencies versions. And so, work
started on [tool-new-release](https://github.com/ember-learn/tool-new-release/).

### First steps

#### Handling Git

The first things I needed were a library to handle `git` operations, and a
library to generate temporary folders that I could clone the repositories into.
The decision to clone the relevant repositories into temporary folders was
twofold: ensure the tool is working with the most recent commits of the
repository, and clean up the repositories after the tool was done running. I
decided to go with [`git2-rs`](https://docs.rs/git2/0.13.22/git2/) and
[`tempfile`](https://docs.rs/tempfile/3.2.0/tempfile/), which looks something
like this:

```rust
use tempfile::tempdir;
use git2::Repository;

let folder = tempdir().unwrap().into_path();
folder.push("guides-source");
let repo = Repository::clone("https://github.com/ember-learn/guides-source.git", &folder)?;
```

In the actual tool a temporary folder is created at the top that is then fed to
the different steps so they can manage the cloning they need to do.

#### Shelling out

Determined to have a viable release tool as quickly as possible and afterwards
iterate for improvements, I decided to call the `Bash` scripts already present
in the
[`guides-source` repository](https://github.com/ember-learn/guides-source/tree/5ec89c42179aa41cbb00a25ef9244e14977a0e72/scripts)
using
[`std::process::Command`](https://doc.rust-lang.org/std/process/struct.Command.html)
from Rust's standard library:

```rust
use std::process::Command;

Command::new("npm")
    .current_dir(&guides_source_dir)
    .arg("run")
    .arg("release:guides:minor")
    .spawn()
    .expect("Could not start process")
    .wait()
    .expect("Failed to release guides.");
```

While shelling out did not improve on the portability problem, making the tool
do something useful was a motivator to keep developing it.

#### Providing command-line arguments

Next I added [`structopt`](https://docs.rs/structopt/0.3.23/structopt/) to
provide command-line argument parsing. This would be useful to allow the user to
select which project they want to run the release steps for, to provide the
target version, and more. `structopt` makes it really straightforward to
implement interfaces using native Rust structures. Here's an example of a
`--project` flag that accepts either `Guides` or `Api` as values:

```rust
#[derive(Debug, StructOpt)]
enum Project {
    Guides,
    Api,
}

/// Ember Learning team release helper.
#[derive(Debug, StructOpt)]
struct Opts {
    /// Pick which step to run the deploy pipeline for.
    #[structopt(short, long)]
    project: Option<Project>,
}
```

I want to note that this also gives us documentation via the `--help` flag out
of the box:

```bash
$ tool-new-release --help
Ember Learning team release helper

USAGE:
    tool-new-release [FLAGS] [OPTIONS]

FLAGS:
    -h, --help             Prints help information
    -V, --version          Prints version information

OPTIONS:
    -p, --project <project>    Pick which project to run the deploy pipeline for [possible values: Guides, Api]
```

Now that I had the basics of the tool working for Guides and API documentation,
it was time to make it available for other people.

### Releasing the tool

I wanted the tool to be useable from Linux, Windows and macOS so I had to figure
out a way to build the Rust project to those targets. Since the project is
hosted on GitHub, I could use GitHub Actions to build the project for me, and
then make a release.

After some research I was able to put together a GitHub Action workflow. You can
see it currently look like in the repository's
[`workflows` directory](https://github.com/ember-learn/tool-new-release/tree/main/.github/workflows)
and if you have any suggestions, please
[let me know](https://twitter.com/locks)! The project is still a work in
progress so you might find things that are not done optimally.

There's two things I'd like to point out in the workflow. One is that I ended up
using [`musl`](https://musl.libc.org/) through `rustup` in order to build the
Linux binary. The other is that I'm currently publishing the binary as a
_draft_, so it will not show up on the homepage of the repository.

## Next steps

Now that the Core Learning team had a working tool, it was time to codify the
rest of the steps and apply some improvements to make the tool easier to use and
to maintain. I will cover that and more in future posts, so keep an eye out!
