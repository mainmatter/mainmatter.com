---
title: 'Building a NIF-Powered HTTP Server With Rust and Elixir'
author: 'Niklas Long'
github: niklaslong
twitter: niklas_long
topic: elixir
bio: 'Backend Engineer, author of Breethe API'
description:
  'Niklas Long explores calling Elixir (& Erlang) functions from Rust with
the help of a GenServer and leveraging structs to encapsulate data shared by Elixir
and the NIFs'
---

In late 2019, the folk behind [Rustler](https://github.com/rusterlium/rustler)
built a small [proof of concept](https://github.com/rusterlium/hyperbeam) which
inspired a project of my own:
[Tinybeam](https://github.com/niklaslong/tinybeam), an experimental Elixir &
Rust HTTP server written with
[tiny-http](https://github.com/tiny-http/tiny-http), NIFs and GenServer. It
isn't fully-featured yet but it does implement routing and can currently handle
`GET` and `POST` requests.

<!--break-->

In this post, I will explore calling Elixir (& Erlang) functions from Rust with
the help of a GenServer; leveraging structs to encapsulate data shared by Elixir
and the NIFs; and routing with Elixir macros. If you're new to Elixir-Rust
interoperability, consider perusing my
[last post](https://simplabs.com/blog/2020/06/25/writing-rust-nifs-for-elixir-with-rustler)
about writing NIFs with Rustler before reading on.

## Architecture

Tinybeam is, at its core, a GenServer calling Rust NIFs.

```elixir
# lib/tinybeam/server.ex

def init(%Config{} = config) do
  :ok = Native.start(config)
  {:ok, "started"}
end
```

The `init/1` callback, invoked when the server is started, delegates to the
aptly named and NIF-implemented `Native.start/1`. The latter starts the HTTP
server and creates a thread pool to handle incoming requests.

![Tinybeam Request Cycle](/assets/images/posts/2020-09-18-building-a-nif-powered-http-server-with-rust-and-elixir/tinybeam_request.png)

The request flow is a touch more complex. When a request is received by the
server, `handle_info/2` is called from a Rust thread, passing in the method,
path, headers and body of the request. Additionally, a reference to the
request's location in memory is included; this will be used at a later stage to
send the response. Routing is handled in Elixir and sending the response is,
once again, implemented as a NIF: `Native.handle_request/1`.

DISCLAIMER: Tinybeam is meant to be a naïve implementation of a multi-threaded
HTTP server, built for learning purposes. The architecture is likely flawed in
ways that would emerge under load/stress testing.

## Encapsulating data using resources

One of the first hurdles in building an Elixir & Rust application is the
translation of data. Thankfully, Rustler provides powerful conveniences for
encoding and decoding structured data, in the form of macros; e.g.
([amongst others](https://docs.rs/rustler/0.22.0-rc.0/rustler/#derives)):

- `NifTuple` allows the annotation of Rust structs to be translated directly
  into Elixir tuples.
- `NifMap`: idem into Elixir maps.
- `NifStruct`: idem into Elixir structs.

I'll be using `NifStruct` in this case:

```rust
// native/tinybeam/src/server.rs

#[derive(NifStruct)]
// #[module = "Tinybeam.Server.Request"]
pub struct Req {
    req_ref: ResourceArc<ReqRef>,
    method: Atom,
    path: String,
    headers: Vec<Head>,
    content: String,
}
```

With regard to naming, I'm not using `Request` on the Rust side as tiny-http has
laid claim to that name; `Req` will have to suffice. However,
`#[module = "Tinybeam.Server.Request"]` conveniently sets the name of the
corresponding Elixir module to `Req`:

```elixir
# lib/tinybeam/server/request.ex

defmodule Tinybeam.Server.Request do
  @enforce_keys [:req_ref, :method, :headers, :content]
  defstruct [:req_ref, :method, :headers, :content]
end
```

Although not strictly necessary for the translation to be successful, making
this module definition explicit allows for the added specificity of
`@enforce_keys`.

You may have noticed the peculiar type associated with the `req_ref` field in
the `Req` struct definition: `ResourceArc<ReqRef>`, with `ReqRef` defined as:

```rust
// native/tinybeam/src/server.rs

struct ReqRef(Mutex<Option<Request>>);
```

The `rustler::resource::ResourceArc` type and is a thread-safe,
reference-counted storage for Rust data. It is analogous to `ErlNifResourceType`
in Erlang's `erl_nif` C library and allows Rust structs to be persisted across
NIF calls as Erlang terms.

In practice, this amounts to passing references in and out of the NIFs; and in
this case, the in-memory location of the `tiny_http::Request` struct used to
make the request, so that it can be responded to it in a subsequent NIF call.

Erlang's Garbage Collection mechanism will automatically drop the struct when
there are no more references to the resource. This, once again, is akin to the
behaviour of `enif_release_resource` in C.

Data stored in a `ResourceArc` is immutable by default. However, responding to
the request requires the `Request` struct to be mutable. The solution, is to
introduce a `std::sync::Mutex` (`RwLock` is equally an option) to wrap the
struct.

Finally, here's an example for creating a `Req` struct with a `req_ref`:

```rust
// native/tinybeam/src/server.rs

let req = Req {
    req_ref: ResourceArc::new(ReqRef(Mutex::new(Some(request)))),
    // ...
};
```

In a subsequent NIF call the request reference can be read from the arguments
like so:

```rust
// native/tinybeam/src/server.rs

let mut request_ref = resp.req_ref.0.lock().unwrap();
```

Easy(ish)! Next we'll look at the request flow in more detail.

## Calling Erlang functions from Rust

Calling Rust NIFs from Elixir is simple. Going in the opposite direction is
tricker. As mentioned earlier in the post, the idea is to trigger
`handle_info/2` by sending a message from a Rust thread to the Erlang process
encapsulating the Genserver. This can be achieved with the `send_and_clear`
method on the `rustler::env::OwnedEnv` module. Here are the essential pieces:

```rust
// native/tinybeam/src/server.rs

let pid = Arc::clone(&pid);
let mut msg_env = OwnedEnv::new();

msg_env.send_and_clear(&pid, |env| (atoms::request(), req).encode(env));
```

The `pid` needs to be an `Arc` instance as the `send_and_clear` call is from
inside the thread pool. Note, the caller `pid` of any NIF can be retrieved with
`env.pid()`. Next, the message is constructed in an `OwnedEnv`: a
process-independent environment used for creating Erlang terms outside the NIF.
Once the message is sent, the method frees all the terms in the environment.

The message is sent with the `(atoms::request(), req).encode(env)` tuple and
pattern matched in `handle_info/2`:

```elixir
# lib/tinybeam/server.ex

def handle_info({:request, %Request{} = request}, state) do
  Task.Supervisor.start_child(TaskSupervisor, fn ->
    __MODULE__.handle_request(request)
  end)

  {:noreply, state}
end
```

As far as I am aware, directly calling Erlang functions from NIFs, be they
written in C or Rust, isn't possible other than indirectly through message
passing.

## Postlude

I have covered the main material intended for this post. However, I wanted to
provide hints on how to implement routing and a small tip for formatting
Elixir-Rust and Elixir-C projects.

### Routing with macros

Once the request has been passed to `handle_info/2`, a process is started with a
call to `handle_request/1`. This function's purpose is to pass it along to a
router before sending the response by way of another NIF call:

```elixir
# lib/tinybeam/server.ex

  def handle_request(%Request{} = request) do
    response = %Response{} = router().match(request.method, request.path, request)
    :ok = Native.handle_request(response)
  end
```

Note, `router()` points to the router module provided by the application using
Tinybeam as a dependency. The `method` and `path` are explicitly extracted from
the `Request` struct to allow writing this in the router:

```elixir
# lib/your_app/router.ex

use Tinybeam.Router

get "/", do: "yay"
```

In addition, the full request is passed in for convenience. This expressiveness
is attained thanks to macros. I recommend reading Saša Jurić's
[Understanding Elixir Macros](https://www.theerlangelist.com/article/macros_1)
series, which explains this in great detail (part 2 covers this exact use-case).

### Formatting tip

Formatting Elixir-Rust projects can be done by creating an alias to run both
formatters:

```elixir
# mix.exs

def project do
  [
    # ...
    aliases: aliases()
  ]
end

defp aliases do
  [
    fmt: ["format", "cmd cargo fmt --manifest-path native/tinybeam/Cargo.toml"]
  ]
end
```

Formatting Elixir-C projects is done similarly (assuming you have a ClangFormat
set up):

```elixir
# mix.exs

defp aliases do
  [
    fmt: ["format", "cmd clang-format -i c_src/*.[ch]"]
  ]
end
```

In both cases, running `mix fmt` will leave the codebase nicely formatted.

## In summary

1. Persist data over NIF calls with `rustler::resource::ResourceArc`. This
   amounts to passing references to the memory locations of the data in and out
   of the NIFs.
2. Data encapsulated with `ResourceArc` is immutable by default. Leverage
   `std::sync::Mutex` or `RwLock` if the data needs to be mutated.
3. When encoding a Rust struct, explicitly define its Elixir counterpart. This
   allows the use of `@enforce_keys`.
4. Elixir functions can only be called from Rust through message passing. Use
   `send_and_clear` with the target `pid` to do so.
5. Macros are cool but I'm still scared of them.

6. Elixir and Rust interoperability is powerful and crucially, it is getting
   simpler thanks to the continuous improvements to Rustler.

7. Rust and Elixir on! 🤘
