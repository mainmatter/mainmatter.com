---
title: "Rustler - Using Rust crates in Elixir"
authorHandle: bobrimperator
tags: [elixir, rust]
bio: "Software Developer"
description: "Bartłomiej Dudzik shows how you can use a Rust crate in Elixir using NIFs with Rustler."
og:
  image: /assets/images/posts/2023-02-01-using-rust-crates-in-elixir/og-image.jpg
tagline: |
  <p>You couldn't find an Elixir package? Let's see if Rust can help with that.</p>

image: "/assets/images/posts/2023-02-01-using-rust-crates-in-elixir/header-illustration.jpg"
imageAlt: "The Rust and Elixir logos on a gray backround picture"
---

Rust and Elixir work great combined! Rust and Elixir can help you increase performance significantly. Discord [shared some details on their blog](https://discord.com/blog/using-rust-to-scale-elixir-for-11-million-concurrent-users) (and also wrote about [why they switched from Go to Rust](https://discord.com/blog/why-discord-is-switching-from-go-to-rust)).

In this blog post, I will show you how easily you can build and use small programs inside Elixir using Rustler.

I recently needed a function to create and edit PDF files with Elixir for a small private project. I searched for some packages and the most notable one for Elixir is [elixir-pdf](https://github.com/andrewtimberlake/elixir-pdf), but it only offers to create PDFs without additional manipulation. That was fine by me since I wanted an excuse to do some more things in Rust anyway, and I found [lopdf](https://github.com/J-F-Liu/lopdf).

In the beginning, I had written my program as a regular project in Rust i.e. `cargo new my_pdf` and then it was happy coding 🙂. I wanted the program to take some configuration and create/edit a PDF file based on it.

After I played around with it, I started wondering “How much work would it be to make it an Elixir NIF?”.

Turns out - there’s not a whole lot of additional stuff we need to do in order to comfortably use crates inside Elixir projects.

[Rustler](https://github.com/rusterlium/rustler) is a library for writing [Erlang NIFs](https://www.erlang.org/doc/tutorial/nif.html) in a very easy and straightforward way.

There are about 2 things we need to keep in mind and take care of:

- Error handling: there needs to be something that maps Rust errors into Elixir atoms so that we could easily handle them.
- Rustler traits: typically your functions and structs will need to derive the implementation from appropriate traits so they can be usable inside Elixir (only the public parts of it of course).

## Setup

Setting up a project with Rustler is fairly easy. You can find a link to instructions here: [https://github.com/rusterlium/rustler#getting-started](https://github.com/rusterlium/rustler#getting-started)

I’ll assume you have both Elixir and Rust installed in your development environment.

1. Create a new Elixir project `mix new rustler_pdf`
2. Add the `:rustler` dependency in `mix.exs`
   ```elixir
    # mix.exs
     defp deps do
       [
         {:rustler, "~> 0.26.0"}
       ]
     end
   ```
3. Download packages: `mix deps.get`
4. Setup Rustler
   1. Run `mix rustler.new`
   2. On “Module name” prompt type in `RustlerPdf` (Name of your Elixir module that Rustler registers NIFs to)
   3. On the “Library name” prompt type in `rustlerpdf` (Name of your cargo crate)
5. Configure Rustler

   1. Add the Rustler behaviour in `rustler_pdf.ex`

   ```elixir
   defmodule RustlerPdf do
     use Rustler,
         otp_app: :rustler_pdf, # must match the name of the project in `mix.exs`
         crate: :rustlerpdf # must match the name of the crate in `native/rustlerpdf/Cargo.toml`

     def add(_arg1, _arg2), do: :erlang.nif_error(:nif_not_loaded)
   end
   ```

   2. Make sure Rust’s boilerplate is this:

   ```rust
   // native/src/lib.rs

   #[rustler::nif]
   fn add(a: i64, b: i64) -> i64 {
       a + b
   }

   rustler::init!("Elixir.RustlerPdf", [add]);
   ```

6. Test that the setup works
   1. Run `iex -S mix`
   2. Execute `RustlerPdf.add(1,2)`
   3. See if it successfully outputs `3`

## Implementing the PDF program

I’ll mostly showcase contracts and interfaces of the Rust part of the program. If you're interested in the full implementation, you can find it [here](https://github.com/BobrImperator/rustler_pdf).

First off let’s take a look at pure Rust structs and functions.

```rust
// Enum that determinates value formatting
pub enum FieldType {
    Money,
    Text,
    Slotted,
}

// Struct describing text
pub struct PdfWriterOperation {
    page_number: i32,
    font: (String, i32),
    dimensions: (f64, f64),
    field_type: FieldType,
    value: Option<String>,
}

// Struct which is the program's input
pub struct PdfWriterConfiguration {
    input_file_path: Option<String>,
    output_file_path: String,
    operations: Vec<PdfWriterOperation>,
}

pub fn read_config() -> PdfWriterConfiguration {
    PdfWriterConfiguration {
        input_file_path: None,
        output_file_path: "PIT-8C-modified.pdf".to_string(),
        operations: vec![
            PdfWriterOperation {
                page_number: 0,
                font: ("F1".to_string(), 10),
                dimensions: (462.82, 55.92),
                value: Some("120.99".to_string()),
                field_type: FieldType::Money,
            },
            PdfWriterOperation {
                page_number: 0,
                font: ("F1".to_string(), 10),
                dimensions: (43.32, 347.81),
                value: Some("41.0".to_string()),
                field_type: FieldType::Money,
            },
        ],
    }
}

pub fn create_pdf(config: PdfWriterConfiguration) -> Result<(), std::io::Error> {}
```

This is the overview of pretty much the entirety of the Rust implementation “minus” the `lopdf` interaction. In general, the idea is that given `PdfWriterConfiguration` a `create_pdf` function will create a PDF file. Then I want to use those methods directly in Elixir.

The only relevant part of the implementation here are the structs themselves, as you can see they have `i32`, `f64`, `string`, `tuple`, `struct` and `enum` Rust types. Later we’ll see how they map to Elixir data structures.

## Rustler-ize-it

Now we need to add traits to our data and functions so Rustler knows how to marshall the data between Rust and Elixir environments.

```rust
// import Rustler traits
use rustler::{NifStruct, NifUnitEnum};

#[derive(NifUnitEnum)]
pub enum FieldType {
    Money,
    Text,
    Slotted,
}

#[derive(NifStruct)]
#[module = "RustlerPdf.PdfWriterOperation"]
pub struct PdfWriterOperation {
    page_number: i32,
    font: (String, i32),
    dimensions: (f64, f64),
    field_type: FieldType,
    value: Option<String>,
}

#[derive(NifStruct)]
#[module = "RustlerPdf.PdfWriterConfiguration"]
pub struct PdfWriterConfiguration {
    input_file_path: Option<String>,
    output_file_path: String,
    operations: Vec<PdfWriterOperation>,
}
```

The `NifStruct` `NifUnitEnum` and `module = "Elixir.ModuleName` attributes provide implementations and metadata for the languages to communicate.

### Enum variant with value - `NifTaggedEnum`

An additional note here: I’m using `NifUnitEnum` which is a simple Enum variant. If you’d like to use a Rust Enum variant that also carries data, you might use `NifTaggedEnum` in order to use such Enums:

```rust
use rustler::NifTaggedEnum;

#[derive(NifTaggedEnum)]
pub enum FieldType {
    Money(String),
    Text(String),
    Slotted(String),
}`
```

Then in Elixir they are represented as a tuple like this:

```elixir
{:slotted, "some value"}
```

### Back to Rustlerizing - Functions

```rust
#[rustler::nif]
pub fn read_config() -> PdfWriterConfiguration {
  priv_read_config()
}

fn priv_read_config() -> PdfWriterConfiguration {
  PdfWriterConfiguration {
        input_file_path: None,
        output_file_path: "PIT-8C-modified.pdf".to_string(),
        operations: vec![
            PdfWriterOperation {
                page_number: 0,
                font: ("F1".to_string(), 10),
                dimensions: (462.82, 55.92),
                value: Some("120.99".to_string()),
                field_type: FieldType::Money,
            },
            PdfWriterOperation {
                page_number: 0,
                font: ("F1".to_string(), 10),
                dimensions: (43.32, 347.81),
                value: Some("41.0".to_string()),
                field_type: FieldType::Money,
            },
        ],
    }
}
```

The `read_config` function is simple enough that it doesn’t require any additional treatment. Since it’s only delivering hardcoded data and is not dealing with any kind of IO, it just needs the `#[rustler::nif]` attribute.

I’m also splitting the functions into the plain Rust functions and the public ones that Rustler exposes to Elixir. This most definitely should be built as a regular Rust crate and another Rustler ‘bridge’ module. I decided to just add prefixes here - for the purpose of this post, I believe this simplifies things a bit.

```rust
use rustler::{Atom, Env, Error as RustlerError, NifStruct, NifUnitEnum, Term};
use std::io::Error as IoError;
use std::io::ErrorKind as IoErrorKind;

// Creates an atoms module using the rustler macro
mod atoms {
    rustler::atoms! {
        ok,
        error,
        eof,

        // Posix
        enoent, // File does not exist
        eacces, // Permission denied
        epipe, // Broken pipe
        eexist, // File exists

        unknown // Other error
    }
}

// Translates std library errors into Rustler atoms
fn io_error_to_term(err: &IoError) -> Atom {
    match err.kind() {
        IoErrorKind::NotFound => atoms::enoent(),
        IoErrorKind::PermissionDenied => atoms::eacces(),
        IoErrorKind::BrokenPipe => atoms::epipe(),
        IoErrorKind::AlreadyExists => atoms::eexist(),
        _ => atoms::unknown(),
    }
}

#[rustler::nif]
pub fn create_pdf(env: Env, config: PdfWriterConfiguration) -> Result<Term, RustlerError> {
    match priv_create_pdf(config) {
        Ok(()) => Ok(atoms::ok().to_term(env)),
        Err(ref error) => return Err(RustlerError::Term(Box::new(io_error_to_term(error)))),
    }
}

fn priv_create_pdf(config: PdfWriterConfiguration) -> Result<(), std::io::Error> {}
```

`create_pdf` is slightly more complicated as it involves some error handling.

`priv_create_pdf` is dealing with creating an actual file on the filesystem so it might result in an error.

In order to handle that situation, we’ve defined a module called `atoms` which uses the `rustler::atoms!` macro to create methods to simplify creating and decoding atoms.

`io_error_to_term` takes an `std::io::error`, matches on the kind of error and translates that into an `Atom`.

As you’ve probably noticed, `create_pdf` expects an `env` argument which is always present with all NIFs. Env is used by Rustler for communication and encoding/decoding data between the BEAM and Rust.

`read_config` and `add` in the previous examples are not using it so it’s possible to omit its declaration.

### Exporting NIFs

```rust
rustler::init!("Elixir.RustlerPdf", [read_config, create_pdf]);
```

At the end of the file, change the `rustler::init!` macro to the above: this lets Rustler know to bind `read_config` function to the `Elixir.RustlerPdf` module.

## The Elixir part

Once the Rust crate exports the functions, we need to let the Elixir side know what functions are expected to be bound to the module. Note that knowing the functions' arities is important here, otherwise you’ll get errors saying that a function couldn’t be loaded.

```elixir
defmodule RustlerPdf do
  use Rustler,
    otp_app: :rustler_pdf,
    crate: :rustlerpdf

  def read_config(), do: :erlang.nif_error(:nif_not_loaded)
  def create_pdf(_pdf_writer_configuration), do: :erlang.nif_error(:nif_not_loaded)
end
```

Now we can use the NIFs like regular Elixir functions. Let’s try it out in the interactive console `iex -S mix`

```elixir
[nix-shell:~/Projects/elixir-pdf-experiment/rustler_pdf]$ iex -S mix

iex(1)> RustlerPdf.read_config()
%{
  __struct__: RustlerPdf.PdfWriterConfiguration,
  input_file_path: nil,
  operations: [
    %{
      __struct__: RustlerPdf.PdfWriterOperation,
      dimensions: {462.82, 55.92},
      field_type: :money,
      font: {"F1", 10},
      page_number: 0,
      value: "120.99"
    },
    %{
      __struct__: RustlerPdf.PdfWriterOperation,
      dimensions: {43.32, 347.81},
      field_type: :money,
      font: {"F1", 10},
      page_number: 0,
      value: "41.0"
    }
  ],
  output_file_path: "PIT-8C-modified.pdf"
}
iex(2)>
```

Notice how the Rust struct now maps to a plain Elixir `map` type with additional `__struct__` metadata: this is how Rustler ensures type safety. If the `__struct__` would be missing, then we’d get an `ArgumentError` exception.

Out of curiosity I was also benchmarking this implementation against an Elixir library called `elixir-pdf`. The Elixir library was roughly 2x slower, but interestingly used 1/3 less memory.

```elixir
def benchmark() do
    Benchee.run(
      %{
        "create_pdf" => fn -> RustlerPdf.create_pdf(RustlerPdf.read_config()) end,
        "e_create_pdf" => fn -> RustlerPdf.e_create_pdf() end
      },
      time: 10,
      memory_time: 1
    )
  end
```

```elixir
Operating System: macOS
CPU Information: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
Number of Available Cores: 12
Available memory: 16 GB
Elixir 1.14.2
Erlang 23.3.4.17

Benchmark suite executing with the following configuration:
warmup: 2 s
time: 10 s
memory time: 1 s
reduction time: 0 ns
parallel: 1
inputs: none specified
Estimated total run time: 26 s

Benchmarking create_pdf ...
Benchmarking e_create_pdf ...

Name                   ips        average  deviation         median         99th %
create_pdf          2.02 K        0.49 ms    ±56.09%        0.48 ms        0.70 ms
e_create_pdf        0.96 K        1.04 ms    ±42.20%        1.03 ms        1.22 ms

Comparison:
create_pdf          2.02 K
e_create_pdf        0.96 K - 2.11x slower +0.55 ms

Memory usage statistics:

Name            Memory usage
create_pdf           1.65 KB
e_create_pdf         1.17 KB - 0.71x memory usage -0.47656 KB
```

### Conclusion

I've shown how you can make use of Rustler in order to add a functionality to your Elixir program which natively might not exist. I hope I also managed to make you consider using Rust for your next high-peformant and type-safe Elixir module.

In my opinion, Rust and Elixir are a great match. Rust offers amazing processing performance while Elixir and the BEAM are excellent at low latency connections and message passing. With Rustler you don't need to choose between one or another, but you could use both instead :) So don't hesitate and experiment, it's both fun and productive for the developers and could be very beneficial for your bussiness.

Consider taking a brief look at the full implementation of the Rust program here: [https://github.com/BobrImperator/rustler_pdf](https://github.com/BobrImperator/rustler_pdf)

Further reading:

- [https://github.com/rusterlium/rustler#getting-started](https://github.com/rusterlium/rustler#getting-started)
- [https://github.com/rusterlium/NifIo](https://github.com/rusterlium/NifIo)
- [https://github.com/discord/sorted_set_nif](https://github.com/discord/sorted_set_nif)
- [https://github.com/J-F-Liu/lopdf](https://github.com/J-F-Liu/lopdf)
- [https://github.com/andrewtimberlake/elixir-pdf](https://github.com/andrewtimberlake/elixir-pdf)
- [https://discord.com/blog/using-rust-to-scale-elixir-for-11-million-concurrent-users](https://discord.com/blog/using-rust-to-scale-elixir-for-11-million-concurrent-users)
- [https://discord.com/blog/why-discord-is-switching-from-go-to-rust](https://discord.com/blog/why-discord-is-switching-from-go-to-rust)
