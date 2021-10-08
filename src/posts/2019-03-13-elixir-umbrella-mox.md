---
title: Elixir Umbrella Applications and Testing with Mox
authorHandle: niklas_long
tags: elixir
bio: "Backend Engineer, author of Breethe API"
description:
  "Niklas Long shows how Elixir Umbrella applications not only improve the
  organization of a code base but also allow for an improved testing setup."
---

What's the big deal with Elixir umbrellas?

An Elixir umbrella is a container for mix apps; a structure useful to separate
the application's concerns as each app is contained within its own mix project.

Why is this cool?

Because it's like Lego and Lego is cool.

Who's Mox you ask?

Mox is cool too... Let's dive in!

<!--break-->

## Breethe

Throughout this post, we will use [Breethe](https://breethe.app) as an example.
Breethe is a Progressive Web App that gives users quick and easy access to air
quality data for locations around the world. Pollution and global warming are
getting worse. The first step to understanding and solving these problems is to
raise awareness by providing everyone with easy access to accurate data.

![Video of the Breethe PWA](/assets/images/posts/2018-07-24-from-spa-to-pwa/breethe-video.gif)

The application is [open source](https://github.com/simplabs/breethe-server) and
we encourage everyone interested to look through the source for reference. The
server for this application was implemented using an
[Elixir](https://elixir-lang.org) umbrella application which will be the focus
of this post. The client for Breethe was built with
[Glimmer.js](http://glimmerjs.com), which we discussed in previous posts:

- [From SPA to PWA](/blog/2018/07/24/from-spa-to-pwa)
- [Building a PWA with Glimmer.js](/blog/2018/07/03/building-a-pwa-with-glimmer-js/)

## Umbrella applications and separating concerns

When we first started building Breethe, we asked ourselves a simple question
which would dictate the structure of the application and our motivation for
using an umbrella app to organise our code. This question was: what if we want
to change our air quality data provider? It turns out this wasn't just
speculation as we are now in the process of doing just that and our decision to
use an umbrella app will make the process tremendously easy.

Using an umbrella allowed us to split our server into two very distinct
applications, communicating together by way of rigorously defined APIs. The
first application functions as the data handling entity of the project - named
_breethe_ (see below). It communicates with the air quality data provider (a
third-party API) to gather the data, then processes and caches it for future
use. The second application in the umbrella is the web interface built with
Phoenix - named _breethe_web_. It requests the data from the first application,
serializes it to JSON and delivers the payload to the client in compliance with
the [JSON:API specification](https://jsonapi.org/).

Here's an overview of the umbrella structure used for Breethe:

```
apps
├── breethe
│   ├── README.md
│   ├── config
│   ├── lib
│   ├── mix.exs
│   ├── priv
│   └── test
└── breethe_web
    ├── README.md
    ├── config
    ├── lib
    ├── mix.exs
    ├── priv
    └── test
```

We have defined a clear boundary between the business logic and the webserver.
This is cool because the umbrella becomes modular like Lego and who doesn't like
Lego? Need to change the air quality data provider? No problem, simply change
the data application, leaving the webserver untouched as long as the data app
continues to implement the same interface. The same would work the other way
round if we wanted to change the webserver.

However, for this approach to work well, the APIs used to communicate between
the different applications in the umbrella need to be carefully defined. We want
to keep the interfaces as little as possible to keep complexity contained. As an
example, here are the publicly available functions on the _breethe_ app in the
umbrella:

```elixir
# apps/breethe/lib/breethe.ex
def get_location(location_id), do: # ...

def search_locations(search_term), do: # ...

def search_locations(lat, lon), do: # ...

def search_measurements(location_id), do: # ...
```

Equally, these are the only functions the Phoenix web app (or any other app in
the umbrella) can call on the _breethe_ app. These principles are of course not
only applicable at the top level of the application but also within its internal
logical contexts. For example, within the _breethe_ app, we have isolated the
functions explicitly making requests to third-party APIs and abstracted them
away behind an interface. This, again, reduces complexity and facilitates
testing as we can isolate the different components of the business logic. This
philosophy lends itself very well to being tested using Mox.

## Testing domains independently using Mox

[Mox](https://github.com/plataformatec/mox), as the name suggests, is a library
that defines mocks bound to specific behaviours. A behaviour is a set of
function signatures that must be implemented by a module. Consequently, Mox
guarantees the mocks for a module be consistent with the original functions they
replace during testing. This rigidity makes the tests more maintainable and
requires that the behaviours for each module be meticulously defined; precisely
the qualities desired when implementing the APIs within our umbrella.

For example, let's consider mocking the public API for the _breethe_ application
when testing _breethe_web_. As the bridge between the two is only composed of
the four functions shown in the previous section, mocking the _breethe_
application's public interface when testing the webserver only requires mocking
those four functions. Naturally, this is only reasonable if we separately test
the _breethe_ application in full, from interface to database. Crucially, it is
the singularity of the interface which allows this degree of separation between
the two applications in the umbrella both in testing and in production.

Let's take a look at the controller action for a location search by id:

```elixir
# apps/breethe_web/lib/breethe_web/controllers/location_controller.ex
@source Application.get_env(:breethe_web, :source)

def show(conn, %{"id" => id}) do
  location =
    id
    |> String.to_integer()
    |> @source.get_location()

  render(conn, "show.json-api", data: location, opts: [])
end
```

The interesting part is in the call to the _breethe_ application:

```elixir
|> @source.get_location()
```

The reason we're using the `@source` module attribute is to be able to switch
between the mock and the real function defined on the _breethe_ application;
this is defined in the config files:

```elixir
# config/config.exs
config :breethe_web, source: Breethe

# config/test.exs
config :breethe_web, source: Breethe.Mock
```

By default `@source` points to the `Breethe` module - the _breethe_
application's public API used in production and development. During testing it
switches to the `Breethe.Mock` module, which defines the mocks.

The test for this controller action is meant to check two things. Firstly, that
the router redirects the connection to the appropriate controller action.
Secondly, that the controller action processes the call and queries the
_breethe_ application correctly using the right function defined on the latter's
API - in this case `get_location(location_id)`.

```elixir
# apps/breethe_web/test/breethe_web/controllers/location_controller_test.exs
describe "show route: returns location" do
  test "by id" do
    location = insert(:location, measurements: [])

    Breethe.Mock
    |> expect(:get_location, fn _location_id -> location end)

    conn = get(build_conn(), "api/locations/#{location.id}", [])

    assert json_response(conn, 200) == %{
             "data" => %{
               ...
             }
           }
  end
end
```

I've broken it down into its four main parts:

1. It sets up the test data with
   [ExMachina](https://github.com/thoughtbot/ex_machina). <br/><br/>

```elixir
location = insert(:location, measurements: [])
```

2. It defines a mock in the `Breethe.Mock` module for the
   `get_location(location_id)` function defined in the _breethe_ application's
   API and sets the return value to the location we created at 1. The mock is
   passed as an argument to the `expect` clause which verifies the mock is
   executed during the test (instead of the real function). <br/><br/>

```elixir
Breethe.Mock
|> expect(:get_location, fn _location_id -> location end)
```

As long as we’ve established the callback in the behaviour implemented by the
Breethe module, we don’t need to explicitly define the Breethe.Mock module (Mox
creates it). Here's the callback for this particular function (for reference, it
isn't coded in the test).

```elixir
# apps/breethe/lib/breethe.ex
defmodule Behaviour do
  @callback get_location(location_id :: integer) :: %Breethe.Data.Location{}
end
```

3. It builds a connection and makes a call to the webserver's route designed to
   handle a location search by id. <br/><br/>

```elixir
conn = get(build_conn(), "api/locations/#{location.id}", [])
```

4. It tests the JSON response (abridged for brevity) is correct by asserting on
   the attributes of the location created in 1. and returned from the mock in 2.
   <br/><br/>

```elixir
assert json_response(conn, 200) == %{
          "data" => %{
            ...
          }
        }
```

Using mocks greatly simplifies the testing process. Each test can be smaller and
more specific. Each test is faster as we are not making calls to the database or
external systems; we are only running the anonymous functions that define the
mocks. For instance, the mock in our example above only executes:

```elixir
fn _location_id -> location end
```

Finally, each mock is self-contained in the test defining it and the callback
insures the mock matches the original function signature. The result is robust,
fast and modularised tests.

## Conclusion

Elixir umbrella apps shine when structuring projects containing clear boundaries
between their constituent parts. The philosophy they implement deeply resembles
that of functional programming (and Lego), where small building blocks combine
into a larger whole. It is however important to be precise when defining the
internal APIs of the application as they act as the glue holding everything
together. Lastly, Mox is a wonderful tool for testing. Not only does it make
mocking APIs very simple and elegant, it also encourages best practices such as
defining behaviours to keep the code consistent and robust.
