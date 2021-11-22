---
title: Handling Webhooks in Phoenix
authorHandle: niklas_long
bio: 'Backend Engineer, author of Breethe API'
description:
  'Niklas Long introduces an effective and simple approach for handling incoming
  webhook requests in Phoenix applications with advanced routing.'
tags: elixir
tagline: |
  <p>I recently had to implement a controller, which took care of receiving and processing webhooks. The thing is, the application had to handle webhooks which often contained very different information, and they were all going to one route and one controller action. This didn't really seem to fit with my goal of keeping controller actions concise and focused. So I set out to find a better solution.</p>
---

## tl;dr

Use `forward` on `MyApp.Router` to forward the request (`%Conn{}`) to a custom
plug (`MyApp.Plugs.WebhookShunt`) which maps `%Conn{}` to a route (and thus a
controller action) defined on `MyApp.WebhookRouter`, based on the data in the
request body.

I.e.,

`%Conn{}` -> `Router` -> `WebhookShunt` -> `WebhookRouter` ->
`WebhookController`

## lv;e (long version; enjoy!)

Let's restate the problem:

- all requests are being sent to the same webhook callback url
- there are many different possible request payloads
- application requires different computation depending on payload

Let's say we're receiving webhooks which contain an `event` key in the request
body. It describes the event which triggered the webhook and we can use it to
determine what code we are going to run.

Below was my first and somewhat naïve implementation. This is what the router
looked like:

```elixir
scope "/", MyAppWeb do
  post("/webhook", WebhookController, :hook)
end
```

And the `WebhookController`:

```elixir
def hook(conn, params) do
  case params["event"] do
    "addition" -> #handle addition
    "subtraction" -> #handle subtraction
    "multiplication" -> #handle multiplication
    "divison" -> #handle division
  end
end
```

All incoming webhooks go to the same route and therefore, the same controller
action.

It took three refactors to get to a satisfactory solution. I will, however,
explain each one in this post, as they are logical steps in reaching the final
solution and proved interesting learning opportunities:

1. Multiple function clauses for controller action
2. Plug called from endpoint
3. Plug and second router

## Multiple function clauses

Let's start separating the computation into smaller fragments by moving the
pattern matching from the `case` statement to the function's definition. We are
still using only one route and only one controller action, but we write multiple
clauses of that function to match a certain value of the `event` key in the
params.

Here's our controller with the multiple clauses:

```elixir
def hook(conn, %{"event" => "addition"} = params), do: add(params)
def hook(conn, %{"event" => "subtraction"} = params), do: subtract(params)
def hook(conn, %{"event" => "multiplication"} = params), do: multiply(params)
def hook(conn, %{"event" => "division"} = params), do: divide(params)
```

The request payload will match the clauses for the `hook/2` function and execute
different functions depending on what `event` was passed in. This refactor is a
step in the right direction, but it still doesn't fit well with the idea that a
controller action should handle one specific request. The router serves no real
purpose, as there is still only one route, and our code has the potential to get
very messy.

## Shunting incoming connections

What if we could interfere with the incoming webhook before it hits the router?
We could then modify the path of the request depending on the params, match a
route and execute the corresponding controller action.

The router would look something like this:

```elixir
scope "/webhook", MyAppWeb do
  post("/addition", WebhookController, :add)
  post("/subtraction", WebhookController, :subtract)
  post("/multiplication", WebhookController, :multiply)
  post("/division", WebhookController, :divide)
end
```

And the controller:

```elixir
def add(conn, params), do: #handle addition
def subtract(conn, params), do: #handle subtraction
def multiply(conn, params), do: #handle multiplication
def divide(conn, params), do: #handle division
```

In this case, each controller action serves a specific function, the router maps
each incoming request to these actions and the code is easily maintainable,
well-structured and won't become jumbled over time. To achieve this, however, we
need to change a couple of things.

First off, we need to interfere with the incoming request before it hits the
router so it will match our new routes. This is because the webhook callback url
is always the same and doesn't depend on what event triggered it e.g.,
`"my_app_url/webhook"`. You would think we could create a plug for this and
simply add it to a custom pipeline for the routes. The problem with this, is the
router will invoke the pipeline **after** it matches a route. Therefore, we
cannot modify the request's path in this pipeline and expect it to match our
`addition`, `subtraction`, `multiplication` or `division` routes. If we want our
new routes to match, we need to intercept the `%Conn{}` in a plug called in the
endpoint. The endpoint handles starting the web server and transforming requests
through several defined plugs before calling the router.

Let's add a plug called `MyApp.WebhookShunt` to the endpoint, just before the
router.

```elixir
defmodule MyApp.Endpoint do
  # ...
  plug(MyApp.WebhookShunt)
  plug(MyApp.Router)
end
```

And let's create a file called `webhook_shunt.ex` and add it to our `plugs`
folder:

```elixir
defmodule MyAppWeb.Plug.WebhookShunt do
  alias Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts), do: conn
end
```

The core components of a Phoenix application are plugs. This includes endpoints,
routers and controllers. There are two flavors of `Plug`, function plugs and
module plugs. We'll be using the latter in this example, but I highly suggest
checking out the [docs](https://hexdocs.pm/plug/readme.html).

Let's examine the code above, you'll notice there are two functions already
defined:

- `init/1` which initializes any arguments or options to be passed to `call/2`
  (executed at compile time)
- `call/2` which transforms the connection (it's actually a simple function plug
  and is executed at run time)

Both of these need to be implemented in a module plug. Let's modify `call/2` to
match the `addition` event in the request payload and change the request path to
the route we defined for addition:

```elixir
defmodule MyAppWeb.Plug.WebhookShunt do
  alias Plug.Conn

  def init(opts), do: opts

  def call(%Conn{params: %{"event" => "addition"}} = conn, opts) do
    conn
    |> change_path_info(["webhook", "addition"])
    |> WebhookRouter.call(opts)
  end

  def call(conn, _opts), do: conn

  def change_path_info(conn, new_path), do: put_in(conn.path_info, new_path)
end
```

`change_path_info/2` changes the `path_info` property on the `%Conn{}`, based on
the request payload matched in `call/2`, in this case to `"webhook/addition"`.
You'll notice I also added a no-op function clause for `call/2`. If other routes
are added and don't need to be manipulated in the same way as the ones above, we
need to make sure the request gets through to the router unmodified.

This strategy isn't great, however. We are placing code in the endpoint, which
will be executed no matter what the request path is. Furthermore, the endpoint
is only supposed to (from the
[docs](https://hexdocs.pm/phoenix/Phoenix.Endpoint.html#content)):

- provide a wrapper for starting and stopping the endpoint as part of a
  supervision tree
- define an initial plug pipeline for requests to pass through
- host web specific configuration for your application

Interfering with the request to map it to a route at this point would be
unidiomatic Phoenix. It would also make the app slower, and harder to maintain
and debug.

## Forwarding conn to the shunt and calling another router

Instead of intercepting the `%Conn{}` in the endpoint, we could forward it from
the application's main router to the `WebhookShunt`, modify it and call a second
router whose sole purpose would be to handle the incoming webhooks.

1. The request hits router which has one path for all webhooks (`"/webhook"`)
2. `%Conn{}` is forwarded to the `WebhookShunt` which modifies the path based on
   the request payload
3. The `WebhookShunt` calls the `WebhookRouter`, passing it the modified
   `%Conn{}`
4. The `WebhookRouter` matches the `%Conn{}` path and calls the appropriate
   action on the `WebhookController`

I.e.,

`%Conn{}` -> `Router` -> `WebhookShunt` -> `WebhookRouter` ->
`WebhookController`

I think this approach is better. We don't need to modify the endpoint, the
router simply forwards anything that matches the webhook path to the shunt and
the app's concerns are clearly separated.

Let's set up our webhook path in `router.ex`:

```elixir
scope "/", MyAppWeb do
  forward("/webhook", Plugs.WebhookShunt)
end
```

As long as your external APIs makes a request to this path when you do the setup
for the webhook callbacks, every incoming request to this path will be forwarded
to the `WebhookShunt`.

Let's refactor `call/2` to handle all events by replacing the hardcoded
`"addition"` event and path with the `event` variable:

```elixir
defmodule MyAppWeb.Plugs.WebhookShunt do
  alias Plug.Conn
  alias MyAppWeb.WebhookRouter

  def init(opts), do: opts

  def call(%Conn{params: %{"event" => event}} = conn, opts) do
    conn
    |> change_path_info(["webhook", event])
    |> WebhookRouter.call(opts)
  end

  def change_path_info(conn, new_path), do: put_in(conn.path_info, new_path)
end
```

With this refactor, all our routes must follow the `"webhook/event"` pattern. In
more complex applications, you might not be able to conveniently use the event
name as a part of the path but the principle remains the same.

You'll notice I've removed the no-op `call/2` function clause. This is because
we no longer have to handle all potential requests like we did in the endpoint;
we can focus entirely on the webhhooks. Now, if we receive a request with an
event which doesn't match a route, Phoenix will raise an error, which is what we
want as we don't know how to handle that request.

Note: if you can't configure your API to send only the webhooks you're
interested in handling, you should write some code to take care of that.

Let's also create `webhook_router.ex` in the `_web` directory:

```elixir
defmodule MyAppWeb.WebhookRouter do
  use MyAppWeb, :router

  scope "/webhook", MyAppWeb do
    post("/addition", WebhookController, :add)
    post("/subtraction", WebhookController, :subtract)
    post("/multiplication", WebhookController, :multiply)
    post("/division", WebhookController, :divide)
  end
end
```

The `WebhookRouter` is called from the `WebhookShunt` with
`WebhookRouter.call(conn, opts)`, and maps the modified `%Conn{}`s to the
appropriate controller action on the `WebhookController`, which looks like this:

```elixir
def add(conn, params), do: #handle addition
def subtract(conn, params), do: #handle subtraction
def multiply(conn, params), do: #handle multiplication
def divide(conn, params), do: #handle division
```

I think this last solution ticks all the boxes. Externally, there is still only
one webhook callback url; internally, we have a route and a controller action
for each event our application needs to handle. Our concerns are therefore
clearly separated, making the application extensible and easy to maintain.

So there you have it, handling webhooks in Phoenix.
