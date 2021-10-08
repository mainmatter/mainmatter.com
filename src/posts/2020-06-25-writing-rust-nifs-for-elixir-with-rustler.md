---
title: Writing Rust NIFs for Elixir With Rustler
authorHandle: niklas_long
tags: elixir
bio: "Backend Engineer, author of Breethe API"
description:
  "Niklas Long describes the upcoming changes to Rustler and how it simplifies
  implementing NIFs."
og:
  image: /assets/images/posts/2020-06-25-writing-rust-nifs-for-elixir-with-rustler/og-image.png
---

A Native Implemented Function is implemented in C (or Rust when using
[Rustler](https://github.com/rusterlium/rustler)) and can be called from Elixir
or Erlang just like any other function. It's the simplest and fastest way to run
native code from Erlang but it does come with a caveat: a crash in a NIF can
bring down the whole BEAM. This makes Rust a safer option than C for
implementing NIFs as its type system and ownership model guarantee memory and
thread-safety.

<!--break-->

Rustler is a fantastic project built to make writing Rust NIFs a simple process;
and the upcoming v0.22 release will provide a much cleaner syntax to do so. The
library handles encoding and decoding Rust values into Erlang terms, catches
Rust panics before they unwind to C and _should_ make it impossible to crash the
BEAM from a Rust NIF.

## Getting started with Rustler

One of my first forays into Rust-implemented NIFs was while building a
micro-library providing Base64 encoding and decoding, creatively named
[base64](https://github.com/niklaslong/base64). It's utterly pointless as that
functionality comes built-in to Elixir but I wanted to start with something
simple. On the plus side, this meant I could easily compare the performance of
the NIF version to the Elixir implementation which can be found in the
[`Base` module](https://hexdocs.pm/elixir/Base.html).

The library consists of two functions: `encode/2` and `decode/2` and it's using
[rust-base64](https://github.com/marshallpierce/rust-base64) to do the heavy
lifting in the NIFs. Let's walk through how this all works.

To get started, we need a new mix project with rustler installed as a
dependency.

```bash
mix new base64
# add {:rustler, "~> 0.22-rc"} to mix.exs deps
mix deps.get
mix rustler.new
# follow rustler instructions
```

Let's explore the project's resulting structure (I've left out the usual Elixir
files and directories and focused on `lib` and `native`):

```
.
├── lib
│   └── base64.ex
└── native
    └── base64_nif
        ├── Cargo.lock
        ├── Cargo.toml
        ├── README.md
        └── src
            └── lib.rs
```

- `lib` will contain Elixir code (like any standard mix project).
- `base64.ex` will contain the stubs to our NIFs. This is the Elixir module the
  NIF module will be registered to.
- `native` will be home to the Rust code. In fact, a cargo package has been
  created within this directory (in this case named `base64_nif`).
- `lib.rs` will contain the NIFs.

The Rust NIFs are compiled and linked into a shared library loaded by Erlang
code at runtime. Elixir (or Erlang) implementations of the functions are also
necessary. These are usually minimal stubs defining the name and arity of the
NIFs and serve as fallback implementations if the NIFs aren't loaded. Let's
start with the Elixir stubs.

```elixir
# lib/base64.ex

defmodule Base64 do
  use Rustler, otp_app: :base64, crate: "base64_nif"

  @spec decode(binary, atom) :: binary
  def decode(_b64, _opt \\ :standard), do: error()

  @spec encode(binary, atom) :: binary
  def encode(_s, _opt \\ :standard), do: error()

  defp error(), do: :erlang.nif_error(:nif_not_loaded)
end
```

The first line is configuration and lets Rustler know what Rust crate to compile
for the Elixir module.

As mentioned above, `decode/2` and `encode/2` don't actually implement any
decoding or encoding; they simply call `error/0` if the NIFs can't be found.
However, the names and the arguments must match in both the Rust and Elixir
implementations. Both functions take in a `binary` to be encoded or decoded and
an `atom` for configuration as different character sets that can be used
(url-safe, without padding, etc...). The default is fittingly set to
`:standard`. The Rust NIFs are implemented as follows.

```rust
// native/base64_nif/src/lib.rs

use base64;
use rustler::Atom;

mod atoms {
    rustler::atoms! {
      crypt,
      imap_map7,
      standard,
      standard_no_pad,
      url_safe,
      url_safe_no_pad,
    }
}

#[rustler::nif]
pub fn decode(b64: String, opt: Atom) -> String {
    let config: base64::Config = match_config(opt);
    let bytes = base64::decode_config(b64, config).expect("decode failed: invalid b64");

    String::from_utf8(bytes).unwrap()
}

#[rustler::nif]
pub fn encode(s: String, opt: Atom) -> String {
    let config: base64::Config = match_config(opt);
    base64::encode_config(s.as_bytes(), config)
}

fn match_config(option: Atom) -> base64::Config {
    // omitted for brevity
}

rustler::init!("Elixir.Base64", [decode, encode]);
```

The last line is interesting: `rustler::init` is a procedural macro that allows
the use of `#[rustler::nif]` to annotate functions to be wrapped as NIFs. It
takes in the name of the Elixir module in which the stubs are defined (in this
case `"Elixir.Base64"`) and an array containing the names of the functions
annotated as NIFs (in this case `[decode, encode]`). In short, this links
everything together.

The use statements at the top of the file are importing the
[rust-base64 crate](https://github.com/marshallpierce/rust-base64) (`base64`)
mentioned earlier, which we'll use for encoding and decoding, and the
`rustler::Atom` type which allows us to represent an Elixir/Erlang `atom` in
Rust. Both the `rustler` and `base64` crates have been added to the `Cargo.toml`
dependencies.

The `rustler::atoms` macro defines Rust functions that return Erlang atoms; in
this case, the possible options for the `encode/2` and `decode/2` functions.

Finally, we come to the NIF definitions. The functions take in a `String` and a
`rustler::Atom`, and return a `String`. This is consistent with the Elixir
stubs, as are the names. In this case, the conversions between Rust values and
Elixir terms are conveniently handled by Rustler. However, for more complex
types, this may need to be implemented manually.

## How does it compare to the Elixir implementation?

Rust is fast. Really fast. This was my set-up (using
[benchee](https://github.com/bencheeorg/benchee)):

```
Operating System: macOS
CPU Information: Intel(R) Core(TM) i5-4258U CPU @ 2.40GHz
Number of Available Cores: 4
Available memory: 16 GB
Elixir 1.10.2
Erlang 22.3.2
```

I used _hello world_ as the short string and Sarah Kay’s poem
_[B (If I Should Have a Daughter)](https://www.youtube.com/watch?v=0snNB1yS3IE)_
as the longer string.

Decoding:

```
##### With input Bigger #####
Comparison:                    ips
Rust Nif decode           175.74 K
Elixir/Erlang decode        4.35 K - 40.37x slower +224.03 μs

##### With input Small #####
Comparison:                    ips
Rust Nif decode           953.17 K
Elixir/Erlang decode      555.63 K - 1.72x slower +0.75 μs
```

Encoding:

```
##### With input Bigger #####
Comparison:                    ips
Rust Nif encode           203.14 K
Elixir/Erlang encode        6.95 K - 29.23x slower +138.98 μs

##### With input Small #####
Comparison:                    ips
Rust Nif encode           941.14 K
Elixir/Erlang encode      615.62 K - 1.53x slower +0.56 μs
```

As the data to encode or decode becomes larger, the overhead of creating the
NIFs becomes smaller and the gains in speed are impressive. These results were
obtained with fairly small data and so the potential performance gains possible
by leveraging Rust NIFs when dealing with CPU-intensive tasks are exciting.

I left out the memory usage comparisons but the Elixir/Erlang implementations
used 3-5x more memory than the NIFs.

## TL;DR: Rustler makes it easy to implement NIFs

Other than the `#[rustler::nif]` function annotations and the `rustler::init`
call, nothing more is required to implement Rust NIFs with Rustler. The
boilerplate and the complexities of translating Rust values to Erlang terms
being handled by the library, there's little resistance to leveraging the power
of Rust in Elixir/Erlang.
