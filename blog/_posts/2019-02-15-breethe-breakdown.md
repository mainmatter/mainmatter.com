---
layout: article
section: Blog
title: Elixir Umbrella Applications and testing with Mox
author: "Niklas Long"
github-handle: niklaslong
topic: elixir
---

What's the big deal with Elixir umbrellas?

An Elixir umbrella is a container for mix apps; a structure useful to separate the application's concerns as each app is contained within its own mix project. 

Why is this cool? 

Because it's like Lego and Lego is cool.

Who's Mox you ask? 

Mox is cool too... Let's dive in!

<!--break-->

## Breethe

Throughout this post, we will use [Breethe](https://breethe.app) as an example.
Breethe is a Progressive Web App that gives users quick and easy access to air
quality data for locations around the world. Pollution and global warming are getting worse. The first step to understanding and solving these problems is to raise awareness by providing everyone with easy access to accurate data. 

![Video of the Breethe PWA](/images/posts/2018-07-24-from-spa-to-pwa/breethe-video.gif)

The application is [open source](https://github.com/simplabs/breethe-server)
and we encourage everyone interested to look through the source for reference. The server for this application was implemented using an [Elixir](https://elixir-lang.org) umbrella application which will be the focus of this post. The client for Breethe was built with
[Glimmer.js](http://glimmerjs.com), which we discussed in previous posts:
- [From SPA to PWA](/blog/2018/07/24/from-spa-to-pwa.html)
- [Building a PWA with Glimmer.js](/blog/2018/07/03/building-a-pwa-with-glimmer-js.html)

## Umbrella apps and splitting concerns with DDD

When we first started building Breethe, we asked ourselves a simple question which would dictate the structure of the application and our motivation for using an umbrella app to organise our code. This question was: what if we want to change our air quality provider? It turns out this wasn't just speculation as we are now in the process of doing just that and our decision to use an umbrella app will make the process tremendously easy. 

Using an umbrella allowed us to split our server into two very distinct applications, communicating together by way of rigorously defined APIs. The first application functions as the data handling entity of the project. It communicates with the air quality provider (a third-party API) to gather the data, then processes and caches it for future use. The second application in the umbrella is the webserver, built with Phoenix. It requests the data from the first application, parses it to JSON and delivers the payload to the client under the JSON API standard.

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

We have essentially defined a clear boundary between the business logic and the webserver. This is cool because the umbrella becomes modular like Lego and who doesn't like Lego? Need to change air quality provider? No problem, build a new data application and drop it into the umbrella, replacing the old one. The webserver needn't be changed as long as the new data app implements the API the previous one used. The same could be done if we wanted to change the webserver or if we wanted to extend the functionality of the umbrella. 

However, for this approach to work well, the APIs used to communicate between the different applications in the umbrella need to be carefully defined. We want to keep the interfaces as little as possible to keep complexity contained. As an example, here are the publicly available functions on the data app in the Breethe umbrella: 

```elixir

def get_location(location_id), do: # ...

def search_locations(search_term), do: # ...

def search_locations(lat, lon), do: # ...

def search_measurements(location_id), do: # ...
```

Equally, these are the only functions the Phoenix webserver (or any other app in the umbrella) can call on the data app. These principles are of course not only applicable at the top level of the application but also within its internal logical contexts. For example, in Breethe, we have seperated the functions explicitly making requests to third-party APIs and abstracted them away behind an interface. This, again, reduces complexity and facilitates testing as we can isolate the different components of the business logic. This is especially helpful when using Mox.

## Testing domains independently using Mox

Mox, as the name suggests, is a library that defines mocks bound to specific behaviors. Each mocked function needs to implement a callback for the behavior. This rigidity makes the tests more maintainable and guarantees that the behaviors for each module be meticulously defined; precisely the qualities desired when implementing the APIs within our umbrella. 

As an example, let's consider the public API for the data application when testing the webserver. We are testing the webserver and the data application in isolation to each other. As the interface between the two is only composed of the four functions shown in the previous section, mocking the data application's behavior when testing the webserver only requires mocking those four functions. Naturally, this is only reasonable if we also test the data application in full, from interface to database. Crucially, it is the singularity of the interface (four functions) which allows this degree of separation between the two applications in the umbrella.

Let's take a look at a controller test for a location search by name. I've broken it down into its four main parts:

1. It sets up the test data with ExMachina.
```elixir
location = insert(:location, measurements: [])
```
2. It defines a mock in the `Breethe.Mock` module (more on this later) for the `search_locations(search_term)` function defined in the data application's API (it's #2 out of the 4 mentioned above) and sets the return value to the location we created at 1. 
```elixir
Breethe.Mock
|> expect(:search_locations, fn _search_term -> [location] end)
```
3. It builds a connection and makes a call to the webserver's route designed to handle a location search by name.
```elixir
conn = get(build_conn(), "api/locations?filter[name]=London", [])
```
4. It tests the JSON response is correct (deminished for brevity).
```elixir
assert json_response(conn, 200) == %{
              "data" => [
                ...
              ]
  end
```

The test is meant to check two things. Firstly, that the router redirects the connection to the appropriate controller action. Secondly, that the controller action processes the call and queries the data application correctly using the right function defined on the latter's API - in this case `search_locations(search_term)`. The controller action looks like this:

```elixir
def index(conn, %{"filter" => filter}) do
  locations =
    case process_params(filter) do
      [lat, lon] -> @source.search_locations(lat, lon)
      name -> @source.search_locations(name)
    end

  render(conn, "index.json-api", data: locations, opts: [])
end
```

As you can see in the `case` statement, we're handling both a search by latitude/longitude or by location name in the controller action. However, the interesting part is in the call to the data application:

```elixir
@source.search_locations(name)
```

We're actually using the `@source` module attribute to switch between the mocks and the actual function defined on the data application; this is defined in the config files:

```elixir
# config/config.exs
config :breethe_web, source: Breethe

# config/test.exs
config :breethe_web, source: Breethe.Mock
```

The default is the `Breethe` module - the data application's public API used in production and development. During testing it switches to the `Breethe.Mock` module, which holds the mocks. 

As long as we've defined the callbacks for each function we want to mock in the `Breethe` module, we don't need to explicitly define the `Breethe.Mock` module (the name is set when configuring Mox). In step 2 above, we wrote the mock function for the test:

```elixir
Breethe.Mock
|> expect(:search_locations, fn _search_term -> [location] end)
```

Mox then checks the behavior implemented by the mock matches the original using the callback and makes the mock available under the `Breethe.Mock` module:

```elixir
defmodule Behaviour do
  @callback search_locations(search_term :: String.t()) :: [%Breethe.Data.Location{}]
end
```

When the `@source` is switched during testing, the controller calls the mock function as defined in the test rather than the original function. This speeds up the test considerably as the only code run for the mock is the lambda that defines it:

```elixir
fn _search_term -> [location] end
```

In short, each mock is self-contained in the test defining it and the callback insures the mock replicates the original function's behavior. The result is robust, fast and modularised tests.



