---
title: 'actix – a basic TCP client'
authorHandle: tobiasbieniek
bio: 'Senior Frontend Engineer, Ember CLI core team member'
description:
  'Tobias Bieniek shows how actix, the actor framework written in Rust, can be
  used to build a basic TCP client.'
tags: rust
og:
  image: /assets/images/posts/2018-06-27-actix-tcp-client/og-image.png
tagline: |
  <p>In our <a href="/blog/2018/06/11/actix/">last post</a> about <a href="https://actix.rs/">actix</a> we introduced you to the <a href="https://rust-lang.org/">Rust</a> programming language and the actix actor framework. This week we will build a basic TCP client with actix.</p>
---

**Since we have written this blog post actix 0.6 was released with several
breaking changes. The content of this blog post is conceptually still relevant
though and the code examples should work fine if you make sure to use the
correct dependency versions.**

## The Goal

Our goal in this blog post is to build an `Actor` that connects to a certain TCP
server, listens for new messages and forwards them to another `recipient` actor.
For simplicity we'll assume that the server is using a line break after each
message.

## Project Setup

In our last post we explained that the easiest solution to install Rust is
currently [rustup.rs](https://rustup.rs/). Once you have followed the
instructions there you should have access to the `cargo` build tool on your
command line.

Creating a new project for Rust is easy with `cargo`:

```bash
cargo new actix-tcp-example
```

This will create a new binary project for you with the basic file structures
already in place. The `cargo new` command also supports a `--lib` option, which
will create a library project instead. The difference between them is that
binary projects have a `main()` function and get compiled to executables, while
library projects are used to share code and functionality at
[crates.io](https://crates.io).

Fun fact: did you know that [crates.io][crates] is an open-source project itself
and built with Rust and [Ember.js][ember]?

[crates]: https://github.com/rust-lang/crates.io
[ember]: https://emberjs.com/

Now that we have created the project let's see if it runs:

```bash
cargo run
```

If everything went well you should see `cargo` compiling the project and
afterwards running it, resulting in "Hello, world!" being printed in your
Terminal.

## The Actor

Before we can start to implement our TCP client actor we need to tell `cargo`
about the `actix` dependency. For that we open the `Cargo.toml` file in the
project and add the following line _after_ the `[dependencies]` declaration:

```toml
actix = "0.5"
```

Now, whenever we build the project again, `cargo` will make sure to download the
necessary dependencies from crates.io and build them before building the actual
project. `cargo` is using a build cache though, so don't worry if it takes a
long time if you first try to build it. The following builds should be much
faster.

It's time to implement a basic `Actor` as the base for our experiment. We don't
want to worry too much about project organization for now, so let's implement it
right in the `src/main.rs` file:

```rust
extern crate actix;

use actix::prelude::*;

struct TcpClientActor;

impl Actor for TcpClientActor {
    type Context = Context<Self>;
}
```

First we tell Rust that the `actix` module is coming from an external crate.
Next we import the most important `actix` traits with the `use` keyword. And
finally we implement the most basic `Actor` possible.

Starting `cargo run` again will show us the following warning though:

```
warning: struct is never used: `TcpClientActor`
 --> src/main.rs:5:1
  |
5 | struct TcpClientActor;
  | ^^^^^^^^^^^^^^^^^^^^^^
  |
  = note: #[warn(dead_code)] on by default
```

... which makes sense since we haven't actually used the actor anywhere yet.
Let's change that! We'll update the `main()` function with a few lines of code
that should start our actor and then wait for it to shutdown at some point:

```rust
fn main() {
    let sys = actix::System::new("tcp-test");

    let _tcp_client: Addr<Syn, _> = Arbiter::start(|_| TcpClientActor);

    sys.run();
}
```

Let's also add a `started` hook to our actor, so that we can see when it starts:

```rust
impl Actor for TcpClientActor {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        println!("TcpClientActor started!");
    }
}
```

If we use `cargo run` again, the "TcpClientActor started!" message should appear
on the screen, and the app should keep running because we have implemented
nothing that would stop the actor.

First milestone achieved! 🎉

## DNS resolution and TCP connection

Now that we have setup the basic scaffolding of our `Actor`, let's try to
connect to a real TCP server. I'll first show you the code and then we'll
discuss what it does step-by-step:

```rust
use actix::actors::{Connect, Connector};

// ...

fn started(&mut self, ctx: &mut Self::Context) {
    println!("TcpClientActor started!");

    Connector::from_registry()
        .send(Connect::host("towel.blinkenlights.nl:23"))
        .into_actor(self)
        .map(|res, _act, ctx| match res {
            Ok(stream) => {
                println!("TcpClientActor connected!");
            }
            Err(err) => {
                println!("TcpClientActor failed to connected: {}", err);
                ctx.stop();
            }
        })
        .map_err(|err, _act, ctx| {
            println!("TcpClientActor failed to connected: {}", err);
            ctx.stop();
        })
        .wait(ctx);
}
```

The first new thing here is `Connector::from_registry()`. `actix` comes with a
small number of built-in actors and one of them is the so-called `Connector`.
The `Connector` actor can be used to perform DNS lookups, or connect to remote
servers via TCP, which is exactly what we want!

The `Connector::from_registry()` function returns an `Addr` instance for the
`Connector` and we can use the `send()` method on it to send a `Connect` message
and wait for the answer (using a `Future`).

Next we use the `into_actor()` modifier to transform the `Future` into another
kind of `Future`, where we get passed not only the result, but also the actor
instance and the context in any callbacks that we implement. This is helpful to
work around the Rust compiler complaining about lifetime issues.

Now we're ready to use the result and we do so by implementing a callback for
the `map()` method. We'll keep it simple for now and just print a message to the
terminal whether the connection was successful or not.

Since we have to handle two different kinds of errors here (`ConnectorError` and
`MailboxError`) we have to implement two different error handlers too. They have
the same code but since the error classes are different, they can't easily share
the same implementation unfortunately.

Finally, we block the current thread using the `wait()` method until the
`Future` is resolved.

As usual, we will `cargo run` again and if everything works properly we should
see "TcpClientActor connected!" being printed to the Terminal.

Great! We have successfully opened up a TCP connection to the
`towel.blinkenlights.nl` server and if you're curious what kind of server that
is: keep reading! 😉

## Reading TCP streams

For the next part we'll need two more dependencies: `tokio-io` and
`tokio-codec`. [tokio][tokio] is the low-level network IO library that `actix`
is using underneath.

[tokio]: https://tokio.rs/

The version of `actix` that we are currently using (v0.5.8) has dependencies on
v0.1 of the `tokio` libraries, so to avoid unnecessary conflicts we will use the
same versions. Let's add the new dependencies to the `Cargo.toml` file:

```toml
tokio-codec = "0.1"
tokio-io = "0.1"
```

and the necessary `extern crate` definitions to the top of the `src/main.rs`
file:

```rust
extern crate tokio_codec;
extern crate tokio_io;
```

We will also add the imports that we'll soon use already:

```rust
use tokio_codec::{FramedRead, LinesCodec};
use tokio_io::AsyncRead;
```

You may have noticed that when we ran `cargo run` earlier the compiler was
complaining about the `stream` variable not being used. Let's fix that by
reading something from the TCP stream.

A `TcpStream` in the context of `tokio` is the wording for the TCP connection
between a client and a server, and includes both the read and write parts of the
connection. Since we only care about the read part for now we should split the
stream into the two parts and focus on the read part for now:

```rust
Ok(stream) => {
    println!("TcpClientActor connected!");

    let (r, w) = stream.split();
}
```

Now we have a read part (`r`) that we can call `read()` on and a write part
(`w`) that we could call `write()` on. Unfortunately the [Read][read] and
[Write][write] traits only operate on `u8` arrays though, so for our purpose of
reading strings separated by line breaks this isn't quite a user friendly as we
would like.

[read]: https://doc.rust-lang.org/std/io/trait.Read.html
[write]: https://doc.rust-lang.org/std/io/trait.Write.html

Fortunately, `tokio` has a solution for that:

```rust
let line_reader = FramedRead::new(r, LinesCodec::new());
```

This combination of `LinesCodec` and `FramedRead` from the `tokio-codecs` crate
can be used to work with the `Read` trait in a more comfortable way. The
`FramedRead` instance acts as an asynchronous stream of values that we could
call `poll()` on, or we'll attach it to the actor in a more convenient way by
implementing the `StreamHandler` trait from `actix`:

```rust
impl StreamHandler<String, std::io::Error> for TcpClientActor {
    fn handle(&mut self, line: String, _ctx: &mut Self::Context) {
        println!("{}", line);
    }
}
```

and then connecting all the pieces together via:

```rust
ctx.add_stream(line_reader);
```

right below the line that constructs the `FramedRead` instance.

I won't spoiler anything, but take a bit of time and see what happens now if you
start `cargo run` again... 🚀

## Forward messages to other actors

In case you're still reading, let's implement the final part of our goal:
forwarding received messages to another actor.

Before we can forward any messages we first need to define how such a message
will look like. As explained in the last blog post about actix we can do so by
implementing the `Message` trait, or deriving it automatically in most cases:

```rust
#[derive(Message)]
pub struct ReceivedLine {
    pub line: String,
}
```

Now that we know how the message looks like we should implement a second actor
that can receive such messages and print them to the terminal:

```rust
pub struct ConsoleLogger;

impl Actor for ConsoleLogger {
    type Context = Context<Self>;
}

impl Handler<ReceivedLine> for ConsoleLogger {
    type Result = ();

    fn handle(&mut self, message: ReceivedLine, _ctx: &mut Context<Self>) {
        println!("{}", message.line);
    }
}
```

At this point the above implementation should contain no surprises anymore. The
`ConsoleLogger` actor implementation looks roughly like the other actors we have
already implemented in this and the previous blog post. All it does is listen
for `ReceivedLine` messages, and print them to the terminal once received.

Next, we will need to adjust our `TcpClientActor` implementation to no longer
print messages by itself, but instead forward them to the second actor. For that
the `TcpClientActor` needs to know where to send them. We could save the
`Addr<_, ConsoleLogger>` instance in the `TcpClientActor` struct, but that would
create a tight coupling between those actors, and we want the `TcpClientActor`
implementation to be as generic as possible.

The more generic solution is to use the `Recipient` struct of `actix`:

```rust
struct TcpClientActor {
    recipient: Recipient<Syn, ReceivedLine>,
}
```

Afterwards we change the `StreamHandler` implementation to this:

```rust
impl StreamHandler<String, io::Error> for TcpClientActor {
    fn handle(&mut self, line: String, _ctx: &mut Self::Context) {
        if let Err(error) = self.recipient.do_send(ReceivedLine { line }) {
            println!("do_send failed: {}", error);
        }
    }
}
```

This implementation will try to send a `ReceivedLine` message to the `recipient`
and print an error to the terminal if it fails.

The final missing piece now is to start the `ConsoleLogger` actor in the
`main()` function and pass its address to the `TcpClientActor`:

```rust
fn main() {
    let sys = actix::System::new("tcp-test");

    let _logger: Addr<Syn, _> = Arbiter::start(|_| ConsoleLogger);

    let _tcp_client: Addr<Syn, _> = Arbiter::start(|_| {
        TcpClientActor { recipient: _logger.recipient() }
    });

    sys.run();
}
```

After everything is assembled back together let's use `cargo run` again and we
will see that everything still works! 🎥

## Summary

We hope that by now you're a little more comfortable around actors and how to
use and implement them in Rust. This blog post has shown how two actors can work
together without any tight coupling other than the messages they exchange. We
have also demonstrated how to use an actor as a TCP client, which can be used as
a gateway for other actors that want to share the same connection to the server.
In the next blog post of this series we will explore how to send messages and
keep connections and actors alive using the `Supervisor`.

👋
