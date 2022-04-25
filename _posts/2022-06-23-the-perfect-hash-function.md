---
title: 'rust-phf: the perfect hash function'
author: 'Tobias Bieniek'
github: Turbo87
twitter: tobiasbieniek
topic: rust
bio: 'Senior Software Engineer'
description:
  'Tobias Bieniek made MIME type handling in the crates.io server infinitely
  faster by using perfect hash functions with the rust-phf crate and moving work
  from runtime to compile time.'
---

This is the story of how we made the [conduit-mime-types] Rust crate almost
infinitely faster, using perfect hash functions and compile-time code
generation.

[conduit-mime-types]: https://github.com/conduit-rust/conduit-mime-types

<!--break-->

Let's start at the beginning. [crates.io] is the package registry of the [Rust]
programming language, or in simpler terms: the place where you can download all
the dependencies of your apps. The crates.io server itself is also built with
Rust, and specifically with an HTTP framework called `conduit`.

[crates.io]: https://crates.io/
[rust]: https://www.rust-lang.org/

`conduit` has a component called `conduit-static`, which is responsible for
efficiently serving static files to the users. `conduit-static` is itself
relying on a package called `conduit-mime-types`, which is the main focus of
this story. The purpose of this package is to map filename extensions to [MIME
types] and vice-versa.

[mime types]:
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types

In other words: if you call `get_mime_type("xls")` the function should return
`Some("application/vnd.ms-excel")` and if you call
`get_extension("application/vnd.ms-excel")` it should return `Some("xls")`.

The most naive implementation would use a list of filename extension and MIME
type records:

```
...
xls = application/vnd.ms-excel
xlsx = application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
xps = application/vnd.ms-xpsdocument
...
```

and it would then search through the list to find a matching filename extension
or MIME type. While this works fine if you only have few entries in that list,
it slows down significantly the more records you add to that list.

One way of improving the situation is to use hashmaps. These data structures
calculate a hash of the thing you pass in, and then efficiently look-up the
other thing that might be associated with this hash. These hashmaps also become
slower the more records you put into them, but their performance is still much,
much better compared to linear lists.

## How it started

The original implementation of `conduit-mime-types` was already using two
hashmaps, one for extension to MIME type mapping, and a second one for MIME type
to extension mapping. Both of these hashmaps were filled by an `initialize()`
function, which read a JSON file and then transformed the data into these
mappings.

While this initialization step wasn't particularly slow, it still took quite a
few unnecessary milliseconds. In fact, it used to be slow enough that we even
found a benchmark in the project which measured the initialization speed.
Needless to say that we got
[nerd sniped](https://en.wikipedia.org/wiki/Nerd_sniping) by this benchmark to
improve the initialization speed.

## Step 1: Code generation

While JSON can be parsed at
[blazing speed](https://github.com/simdjson/simdjson) these days, it is still
slower than not having to parse it at all. Our first step towards a more
efficient implementation was to get rid of the JSON parsing step.

How did we get rid of the parsing step? Well, we didn't, but we did move it from
run time to development time. We wrote a small script that parsed the JSON file
and generated Rust code based on the content of the JSON file. The only thing
that was left in the initialization code was transforming the statically bundled
MIME type data into the hashmap records. This step resulted in a roughly 80%
performance improvement.

You can find the corresponding pull request
[here](https://github.com/conduit-rust/conduit-mime-types/pull/17)

## Step 2: Automatic code generation

While this approach was working quite well, it resulted is a small maintenance
overhead because the code generation script would have to be run each time the
raw JSON data was edited.

One alternative is to automatically generate the code at compile-time. This can
be achieved by creating a `build.rs` file next to the `Cargo.toml` file of your
library:

```rust
use std::env;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::Path;

fn main() {
  let path = Path::new(&env::var("OUT_DIR").unwrap()).join("data.rs");
  let mut file = BufWriter::new(File::create(&path).unwrap());
  writeln!(&mut file, "static FOO: &'static str = \"bar\";\n").unwrap();
}
```

The `main()` function of this file will be executed automatically before your
library is compiled, and you can use it to generate arbitrary code files that
the rest of your code can then import, or rather `include!(...)`.

While this admittedly decreased our build speed, it also meant that the raw JSON
data and the generated code file could no longer diverge and cause subtle bugs.
In practice the build speed degradation was barely measurable though, since the
compilation of the code itself already took a significant amount of time.

## Step 3: Perfect hash functions

As we mentioned earlier, we still had an initialization step which transformed
that raw data in the generated code file to the hashmap records. This was
necessary because Rust currently does not support `static` hashmaps, which would
be necessary to have them generated at compile time. Luckily, there are
alternatives.

While looking for a solution to the problem we stumbled upon the [rust-phf]
crate, which has the tagline: "Compile time static maps for Rust". Exactly what
we needed!

[rust-phf]: https://github.com/rust-phf/rust-phf

It was relatively straight-forward to modify our `build.rs` file and take
advantage of the `phf_codegen` crate to generate the necessary two maps at
compile time for us. The resulting maps have an API that is roughly similar to
the regular hashmaps in Rust, but all we really needed was the `.get()` method
anyway.

We now had gotten rid of all the content of the initialization step, reducing
the time to run that step to essentially zero. Through some clever math we
determined that by removing the step we had made it infinitely faster, and we
could now get rid of the corresponding benchmark too.

Not only that, we also improved the lookup speed. `rust-phf` is using "perfect
hash functions", as the name suggests. This means that it generates hash maps
that don't have any collisions, which makes the lookup code much more efficient.
The downside of these maps is that they have to recalculate the whole map if you
insert any records, but since we were dealing with read-only data this downside
was irrelevant to us.

You can take a look at the pull request that introduced `rust-phf` in
`conduit-mime-types`
[here](https://github.com/conduit-rust/conduit-mime-types/pull/18).

## Conclusion

If you have read-only mappings that you want to use in your Rust code, then the
`rust-phf` project can give you significant speed improvements by moving some of
the work to compile time.

We hope that this short story about our work on `conduit-mime-types` was helpful
to you. If you have any questions do not hesitate to [contact] us. We're happy
to help!

[contact]: https://simplabs.com/contact/
