---
layout: article
section: Blog
title: Handling Webhooks in Phoenix
author: "Niklas Long"
github-handle: niklaslong
twitter-handle: niklas_long
---

I recently had to implement a controller which took care of receiving and processing webhooks. The thing is, the API could send many different payloads to the webhook callback and there was only one tired and bloated controller action responsible for welcoming them. This didn't really seem to fit with the concept of using routes to identify controller actions. So I set out to find a better solution.

<!--break-->

#### tl;dr

Use `forward` on `MyApp.router` to forward `conn` to a custom plug which transforms the `conn`; call `MyApp.WebhookRouter` from the plug. The `WebhookRouter` matches the modified `conn` to the controller actions.

#### lv;e (long version; enjoy!)

Let's restate the problem:
* one controller action
* many different possible webhook payloads
* different computation required depending on payload

I actually came up with three different ways of solving this problem; only the last was to my satsifaction. I will, however, go through all three approaches, as they proved interesting learning opportunities.

1. multiple function clauses for controller action
2. plug called from endpoint
3. plug and second router

#### Multiple function clauses

This is the simplest way to run specific code based on the request payload that I could come up with. It involves pattern matching on the function's arguments, i.e. the request's payload. Only one route is needed and only one controller action is needed, but we write multiple clauses of that function.
Let's say we're receiving webhooks which contain an `event` key. It describes the event which triggered the webhook and we can use it to determine what code we are going to run.

Here's our controller with the multiple clauses:

```ruby
def hook(%{event: "addition"} = params), do: add(params)
def hook(%{event: "subtract"} = params), do: subtract(params)
def hook(%{event: "multiply"} = params), do: multiply(params)
def hook(%{event: "divide"} = params), do: divide(params)
```

The request payload will match the clauses for the `hook/1` function and execute different functions depending on what `event` was passed in. This solution is simple and clean, but it doesn't fit well with the idea that a controller action should handle a specific request. The router serves no real purpose and our code has the potential to get very messy, quickly.

#### Shunting incoming connections

What if we could interfere with the incoming connection before it hits the router? We could then modify the path of the request depending on the params, match a route and execute the corresponding controller action.

The router would look something like this:

```ruby
scope "/webhook", MyAppWeb do
  post("/add", WebhookController, :add)
  post("/subtract", WebhookController, :subtract)
  post("/multiply", WebhookController, :multiply)
  post("/divide", WebhookController, :divide)
end
```

And the controller:

```ruby
def add(params), do: #handle addition event
def subtract(params), do: #handle subtraction event
def multiply(params), do: #handle multiplication event
def divide(params), do: #handle division
```

In this case, each controller action performs a specific function, the router maps each incoming request to these actions and the code is easily maintainable, well-structured and won't become jumbled over time. To achieve this however, we need to change a couple of things.

First off, we need to interfere with the incoming `conn` before it hits the router so it will match our new routes. This is because the webhook callback url is usually always the same and doesn't depend on what event triggered it e.g., `"myapp.com/webhook"`. You would think we could create a plug for this and simply add it to a custom pipeline for the routes. The problem with this, is the router will invoke the pipeline **after** it matches a route. Therefore, we cannot modify the `conn`'s path in this pipeline and expect it to match our `add`, `subtract`, `multiply` or `divide` routes. If we want our new routes to match, we need to intercept the `conn` in a plug called in the endpoint. The endpoint handles starting the web server and transforming requests through several defined plugs before calling the router.

Let's add a plug called `MyApp.WebhookShunt` to the endpoint, just before the router.

```ruby
defmodule MyApp.Endpoint do
  # ...
  plug(MyApp.WebhookShunt)
  plug(MyApp.Router)
end
```

And let's create a file called `webhook_shunt.exs` and add it to our `plugs` folder:

```ruby
defmodule MyAppWeb.Plug.WebhookShunt do
  alias Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts), do: conn
end
```

The core components of a Phoenix appplication are plugs. This includes endpoints, routers and controllers. There are two flavors of `Plug`, function plugs and module plugs. We'll be using the latter in this example, but I highly suggest checking out the [docs](https://hexdocs.pm/plug/readme.html).

Let's examine the code above, you'll notice there are two functions already defined:
* `init/1` which initializes any arguments or options to be passed to `call/2` (executed at compile time)
* `call/2` which transforms the connection (it's actually a simple function plug and is executed at run time)

Both of these need to be implemented in a module plug. Let's modify `call/2` to match the `addition` event in the request payload and change the request path to the route we defined for addition:

```ruby
defmodule MyAppWeb.Plug.WebhookShunt do
  alias Plug.Conn

  def init(opts), do: opts

  def call(%Conn{params: %{"event" => "addition"}} = conn, _opts) do
    conn
    |> change_path_info(["webhook", "add"])
  end

  def call(conn, _opts), do: conn

  def change_path_info(conn, new_path), do: put_in(conn.path_info, new_path)
end
```

`change_path_info/2` changes the `path_info` property on the `conn`, in this case to `"webhook/add"`. You'll notice I also added a no-op function clause for `call/2`. If other routes are added and don't need to be manipulated in the same way as the ones above, we need to make sure the request gets through to the router unmodified.

This solution isn't great however. We are placing code in the endpoint, which will be executed no matter what the request path is. This isn't ideal, and may cause issues down the line.

#### Forwarding conn to the shunt and calling another router

Instead of intercepting the `conn` in the endpoint, we could forward it from the application's main router to the `WebhookShunt`, modify it and call a second router who's sole purpose would be to handle the hooks.

1. The request hits router which has one path for all webhooks (`"/webhook"`)
2. `conn` is forwarded to the WebhookShunt which modifies the path based on the request payload
3. The WebhookShunt calls the WebhookRouter, passing it the modified `conn`
4. The WebhookRouter matches the `conn` path and calls the appropriate action on the WebhookController

I.e.,

`conn` -> `Router` -> `WebhookShunt` -> `WebhookRouter` -> `WebhookController`

I think this approach is better; we don't need to modify the endpoint, the router simply forwards anything that matches the webhook path to the shunt and the app's concerns are clearly separated.

Let's setup our webhook path in `router.ex`:

```ruby
scope "/", MyAppWeb do
  forward("/webhook", Plugs.WebhookShunt)
end
```

As long as your external APIs makes a request to this path when you do the setup for the webhook callbacks, every incoming request to this path will be forwarded to the WebhookShunt.

Let's also add a second `call/2` clauses to handle the `subtraction` event in the WebhookShunt:

```ruby
defmodule MyAppWeb.Plugs.WebhookShunt do
  alias Plug.Conn
  alias MyAppWeb.WebhookRouter

  def init(opts), do: opts

  def call(%Conn{params: %{"event" => "addition"}} = conn, _opts) do
    conn
    |> change_path_info(["webhook", "add"])
    |> WebhookRouter.call(opts)
  end

  def call(%Conn{params: %{"event" => "subtraction"}} = conn, _opts) do
    conn
    |> change_path_info(["webhook", "subtract"])
    |> WebhookRouter.call(opts)
  end

  def change_path_info(conn, new_path), do: put_in(conn.path_info, new_path)
end
```

You'll notice I've removed the no-op `call/2` function clause. This is because we no longer have to handle all potential requests like we did in the endpoint; we can focuse entirely on the hooks. Now, if we receive a webhook which doesn't match a clause of `call/2`, Phoenix will raise an error.

Note: if you can't configure your API to send only the webhooks you're interested in handling, you should implement some code to handle that.

Let's also create `webhook_router.ex` in the `_web` directory:

```ruby
defmodule MyAppWeb.WebhookRouter do
  use MyAppWeb, :router

  scope "/webhook", MyAppWeb do
    post("/add", WebhookController, :add)
    post("/subtract", WebhookController, :subtract)
  end
end
```

The router is called from the WebhookShunt with `WebhookRouter.call(opts)`, and maps the modified `conn`s to the appropriate controller action on the controller, which looks like this:

```ruby
def add(params), do: #handle addition event
def subtract(params), do: #handle subtraction event
```

I left out `multiply` and `divide` for brevity, as the the code is identical other than naming.

So there you have it, handling webhooks in Phoenix.
