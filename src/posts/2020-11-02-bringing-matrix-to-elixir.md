---
title: Bringing the Matrix Protocol to Elixir
authorHandle: niklas_long
tags: elixir
bio: 'Backend Engineer, author of the Matrix Elixir SDK'
description: 'Niklas Long introduces the Matrix Elixir SDK.'
og:
  image: /assets/images/posts/2020-11-02-bringing-matrix-to-elixir/og-image.png
tagline: |
  <p><a href="https://matrix.org">Matrix</a> is an open-source, end-to-end encrypted, real-time, open standard communication protocol designed to protect people's privacy. The technology has applications not only in messaging and Voice over IP (VoIP) but similarly in Internet of Things (IoT), Augmented Reality (AR) and Virtual Reality (VR).</p>
---

![Bringing the Matrix Protocol to Elixir](/assets/images/posts/2020-11-02-bringing-matrix-to-elixir/illustration.svg#full)

Introduced in 2014, Matrix is backed by [Element](https://element.io/about)
(formerly New Vector), the company behind the
[Element Matrix client](https://element.io/) (formerly Riot). Adopters include
the
[French government](https://matrix.org/blog/2018/04/26/matrix-and-riot-confirmed-as-the-basis-for-frances-secure-instant-messenger-app),
the US government, [Mozilla](https://wiki.mozilla.org/Matrix),
[Purism](https://matrix.org/blog/2017/08/24/the-librem-5-from-purism-a-matrix-native-smartphone),
[Germany's Ministry of Defence](https://www.heise.de/newsticker/meldung/Open-Source-Bundeswehr-baut-eigene-verschluesselte-Messenger-App-4623404.html)
and the
[German education system](https://sifted.eu/articles/element-germany-deal/).

In May of this year, I began work on a
[Matrix SDK for Elixir](https://github.com/niklaslong/matrix-elixir-sdk) with
the aim of simplifying the process of Matrix-enabling Elixir applications. It is
early days for the project but if you are interested in contributing (all skill
levels welcome) or using the SDK as a foundation for another project, please let
me know!

## Federation of homeservers

Matrix is structured around the federation of homeservers, that is to say the
continuous synchronisation of event history between homeservers via the
Server-Server API.

![The Matrix Architecture](/assets/images/posts/2020-11-02-bringing-matrix-to-elixir/matrix_architecture.png)

Each user is registered on a single homeserver, ideally hosted by themselves,
and can join rooms to communicate with others. A room is a shared history of
events associated with its members. The history is copied in full on each
member's homeserver and all copies are synchronised in real-time. Fundamentally,
a room is a decentralised data store with no single point of control or failure.

Matrix was designed from the start to exchange data with other platforms such as
WhatsApp, Slack, iMessage, Email, Discord, IRC and many more. This is known as
bridging and makes Matrix an attractive one-stop solution to interface with
these services. As an example, Alice on Matrix, could seamlessly communicate
with Bob on Freenode and Chris on Slack. Crucially, bridges connect separate
communities and as such represent a workable migration path from walled garden
networks.

## Getting started with the SDK

As mentioned above, all changes in a room's state are described by events. They
can represent any data, from users joining a room or sending messages, to image
uploads and VoIP call setup. Let's dip our toes into Matrix by creating a guest
account on `matrix.org` and reading events from the `#elixirsdktest:matrix.org`
room.

I've written
[an example script](https://github.com/niklaslong/matrix-elixir-sdk/blob/master/examples/guest_login.exs)
to do this and will be going through the crucial parts below. If you'd like to
try it out yourself, clone the repo and run (assuming you have Elixir
installed):

```
mix deps.get
mix run examples/guest_login.exs
```

### Creating a guest account

The first step is creating an account on `matrix.org`:

```elixir
# examples/guest_login.exs

alias MatrixSDK.Client
alias MatrixSDK.Client.Request

url = "https://matrix.org"

{:ok, response} =
  url
  |> Request.register_guest()
  |> Client.do_request()
```

The `Request.register_guest/1` call returns a struct:

```elixir
%MatrixSDK.Client.Request{
  base_url: "https://matrix.org",
  body: %{},
  headers: [],
  method: :post,
  path: "/_matrix/client/r0/register?kind=guest",
  query_params: []
}
```

The SDK was designed to be modular and is structured with the `Request` module
at its core. The module does no IO on its own and returns a struct used by the
HTTP client to make the requests. This allows users to leverage only the
functionality they need and are not tied into any unnecessary dependencies. By
default the SDK uses [Tesla](https://github.com/teamon/tesla) configured with
[Mint](https://github.com/elixir-mint/mint) but this approach makes it very easy
to use any other HTTP client with a small amount of glue code.

To execute the request, `Client.do_request/1` is called with the struct and the
response looks something like this:

```elixir
%Tesla.Env{
  body: %{
    "access_token" => "MDAxOGxvY2F0aW9",
    "device_id" => "guest_device",
    "home_server" => "matrix.org",
    "user_id" => "@56440647111:matrix.org"
  },
  method: :post,
  status: 200,
  url: "https://matrix.org/_matrix/client/r0/register?kind=guest"
}
```

It returns an access token (shortened for brevity). This token can be used to
authenticate most Matrix endpoints (some don't require authentication at all).
Likewise, standard user accounts, not covered here, use tokens as authentication
once a login flow has been completed.

Naming for all user accounts follows the convention of `@name:server.url`. For
guest accounts, the name is a number generated by the server, e.g., `user_id`
above.

### Joining a room

Once we have an access token, we can attempt to join a room allowing guest
access, such as `#elixirsdktest:matrix.org`:

```elixir
# examples/guest_login.exs

token = response.body["access_token"]
room = "#elixirsdktest:matrix.org"

{:ok, response} =
  url
  |> Request.join_room(token, room)
  |> Client.do_request()
```

The first request should return a `403` and a link to accept the Matrix terms
and conditions. Let's open the link in a browser, read and accept the terms (if
we agree with them), and give it another go. If you're using the script, it will
prompt you to do exactly this before trying the request again. If all is well,
the response should be similar to this:

```elixir
%Tesla.Env{
  body: %{"room_id" => "!shAQDWZCviggxGBINv:matrix.org"},
  method: :post,
  status: 200,
  url: "https://matrix.org/_matrix/client/r0/join/%23elixirsdktest%3Amatrix.org"
}
```

The call returns a `200` and the `room_id`. You may have noticed this isn't the
same as `#elixirsdktest:matrix.org` used to make the request. The latter is an
alias. They allow users to refer to rooms more conveniently instead of using
long IDs such as `!shAQDWZCviggxGBINv:matrix.org`. Both are valid, however, and
can be used interchangeably with most endpoints.

### Reading events

The next step is to read events from the homeserver. This can be achieved with a
call to `sync/2`.

```elixir
# examples/guest_login.exs

{:ok, response} =
  url
  |> Request.sync(token)
  |> Client.do_request()
```

Syncing is complex and I won't be going into any great detail here. At a high
level, all events from a user's joined rooms will be included in the response.
These are categorised in the payload. For simplicity here is the structure of
the information returned:

```elixir
%{
  "ephemeral" => %{
    "events" => [...] # read-receipts, ...
  },
  "state" => %{
    "events" => [...] # messages, ...
  },
  "timeline" => %{
    "events" => [...], # everything together in a timeline
    "limited" => true,
    "prev_batch" => "t74742-1449340357_757284957"
  }
}
```

In essence, the response is a linear event history for a user and can be used by
a client to reconstruct a room's state. Pagination is handled by way of
pagination tokens like `prev_batch` and can be leveraged in subsequent `sync`
calls.

Events look like this:

```elixir
%{
  "content" => %{
    "displayname" => "56440647111",
    "kind" => "guest",
    "membership" => "join"
  },
  "event_id" => "$4JCQ2rGqzD7uhXzXEN5KVa1Mj_MQOY1g11APLcAtb84",
  "origin_server_ts" => 1603620301736,
  "sender" => "@56440647111:matrix.org",
  "state_key" => "@56440647111:matrix.org",
  "type" => "m.room.member",
  "unsigned" => %{"age" => 5068277}
}
```

This is the `join` event for the account used in this example. It has some
`content`, a `type`, and some other associated meta-data.

This is where I'll end this short introduction, however, please check the
[documentation](https://hexdocs.pm/matrix_sdk/) for more information on the
currently implemented endpoints.

## What's next?

The Elixir SDK currently wraps part of the Client-Server API and v0.1 was
released to allow interested parties to begin experimenting. However, work
continues as there are a number of endpoints waiting to be implemented. There
are discussions underway about introducing a parse response stack and structural
changes to the library. Additionally, Olm will soon be added as a dependency to
the SDK in order to support encryption.

Olm is an implementation of the
[Double Ratchet Algorithm](https://signal.org/docs/specifications/doubleratchet)
written in C/C++ and exposed as a C API. It is used by Matrix to implement
encryption, both for individual and group messaging. The
[Elixir/Erlang bindings](https://github.com/niklaslong/olm-elixir) are a first
step towards implementing end-to-end encryption in the SDK. I started it as a
separate project as it could conceivably be used in non-Matrix based
applications. The library is implemented using C NIFs and currently lacks
support for group sessions (coming soon). The first release candidate has been
published to hex.

The long-term goal is to provide all the tools necessary to build Matrix-enabled
applications in Elixir, from clients to homeservers. Matrix is experimenting
with P2P by bundling clients and homeservers together on the user's device. This
could lead to interesting implementations in Elixir, potentially targeting
WebAssembly thanks to [Lumen](https://github.com/lumen/lumen).

It is my belief that Elixir can be a powerful tool in decentralising the web.
Projects like Matrix are vitally important and I hope the SDK will encourage
creators to start projects in this problem space.
