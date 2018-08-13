---
layout: article
section: Blog
title: "Elixir/Phoenix Breethe part 1: Data"
author: "Niklas Long"
github-handle: niklaslong
---

Over the last couple of months, we have been building an Elixir umbrella app to serve as the server for [Breethe](https://breethe.app), which provides instant access to up to date air quality data for locations across the world. In the next couple of posts, I will be going through the application's code with the aim of explaining some of the strategies we employed and decisions we made along the way.

<!--break-->

The Breethe project is intirely open-source. Please take a look at the code for the [client](https://github.com/simplabs/breethe-client) and the [server](https://github.com/simplabs/breethe-server), the latter being the focus of this series of posts. We've also written and will be writing on our blog about the client and the server in future, so stay tuned!

Breethe is an air quality app. This means the server interacts with with a number of external APIs to aggregate the data:

* [OpenAQ API](https://openaq.org/) - provides the airquality data
* [Google's geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) - helps us obtain precise and consistent location data

As mentioned in passing above, the Elixir server is actually an umbrella application. If you don't know what these are, they're basically a container for mix apps. The umbrella contains:

* a mix application, named `breethe`, which handles the _data_
* a Phoenix application, named `breethe_web`, which is the _webserver_

Both of these apps live inside the `apps` directory of the project. Below are the trees for each of their `lib` directories - don't worry about the details for now, we'll be taking a pretty close look at both of them.


_Data_ application:
```
/apps/breethe/

lib
├── breethe
│   ├── application.ex
│   ├── data
│   │   ├── data.ex
│   │   ├── location.ex
│   │   └── measurement.ex
│   ├── ecto_enums.ex
│   ├── ecto_types.ex
│   ├── repo.ex
│   └── sources
│       ├── google
│       │   └── geocoding.ex
│       ├── open_aq
│       │   ├── locations.ex
│       │   └── measurements.ex
│       └── open_aq.ex
├── breethe.ex
└── mix
    └── tasks
        └── sync_measurements.ex
```

_Webserver_ application:
```
/apps/breethe_web/

lib
├── breethe_web
│   ├── application.ex
│   ├── controllers
│   │   ├── location_controller.ex
│   │   └── measurement_controller.ex
│   ├── endpoint.ex
│   ├── gettext.ex
│   ├── json_api_keys.ex
│   ├── router.ex
│   └── views
│       ├── error_helpers.ex
│       ├── error_view.ex
│       ├── location_view.ex
│       └── measurement_view.ex
└── breethe_web.ex
```

This umbrella structure is useful to seperate the application's concerns. Each application is contained within it's own mix project, meaning the _data_ is mostly decoupled from the _webserver_. As well as providing structure, this decoupling makes it easy to change the _data_ application without affecting the _webserver_ if, for example, we decide to use another external API for the airquality data instead of [OpenAQ](https://openaq.org/). This is because the _webserver_ interfaces with the _data_ app through it's `Breethe` module **only**. Conversely, we could also change the _webserver_ without affecting the _data_ app if need be.


The `Breethe` module as well as the optimisations we implemented for the _data_ app using `Task` will be the subject of a later post. We will also cover the Phoenix webserver application, testing and other aspects of the umbrella app in future.

In this first post we'll take a look at the _data_ application, namely the `data` and `sources` directory. The `data` directory contains the models, which we will take a look at first. The `sources` directory contains code to coordinate the interaction of the application with the external APIs mentioned above.

Let's dive in!

#### Data models

```
data
├── data.ex
├── location.ex
└── measurement.ex
```

Our app has two data models:

- Locations
- Measurements

and Locations _has many_ Measurements.

[Ecto](https://github.com/elixir-ecto/ecto) is our DB wrapper of choice and the full code for the models can be found [here](https://github.com/simplabs/breethe-server/tree/master/apps/breethe/lib/breethe/data).

One thing to note, is that we are using the [Geo](https://github.com/bryanjos/geo) library and the [GeoPostgis](https://github.com/bryanjos/geo_postgis) postgrex extension which allows us to store and interact with the geographic data we have for the `locations`. This is used on the `coordinates` field:

```elixir
# location.ex

field(:coordinates, Geo.Geometry)
```

The application will interact with a few external APIs and we need to make sure the data we accept and store remains consistent. One tool we are using to enforce this is [EctoEnum](https://github.com/gjaldon/ecto_enum). This allows us to define custom Enum types, thus restricting the possible values the data can take on certain fields of the models:

```elixir
# ecto_enums.ex

import EctoEnum

defenum(ParameterEnum, :parameter, [:pm10, :pm25, :so2, :no2, :o3, :co, :bc])
defenum(UnitEnum, :unit, [:micro_grams_m3, :ppm])
```

If we try to pass a value the custom type doesn't define, an error will be raised.

These custom types are used for the `measurements`:

```elixir
# measurement.ex

field(:parameter, ParameterEnum)
field(:unit, UnitEnum)
```

The `parameter` field will store the pollutant measured. It can be one of 7 types, defined by the `ParameterEnum` above:

- `:pm10` - coarse particles with a diameter between 2.5 and 10 μm (micrometers)
- `:pm25` - fine particles with a diameter of 2.5 μm or less
- `:so2` - sulfure dioxide
- `:no2` - nitrogen dioxide
- `:o3` - ozone
- `:co` - carbon monoxide
- `:bc` - black carbon

The `unit` field will store the unit of the measurement. It is defined by the `UnitEnum` above and can be one of two types:

- `:micro_grams_m3` - micrograms per cubic meter (µg/m³)
- `:ppm` - parts per million (ppm)

#### Data sources

The data sources live and breathe in the aptly named `sources` folder:

```
sources
├── google
│   └── geocoding.ex
├── open_aq
│   ├── locations.ex
│   └── measurements.ex
└── open_aq.ex
```

Let's clarify this tree a little:

The `google` directory contains a single file called `geocoding.ex`. That module uses [Google's geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) to translate location adresses inputed by the user into precise coordinates. These coordinates can then be used to query [OpenAQ](https://openaq.org/) for the airquality data.

The `open_aq` directory contains two files:

- `locations.ex`: contains code to query [OpenAQ](https://openaq.org/) for location data
- `measurements.ex`: contains code to query [OpenAQ](https://openaq.org/) for measurement data based on location

We won't go into their specifics here, but feel free to [peruse the code](https://github.com/simplabs/breethe-server/tree/master/apps/breethe/lib/breethe/sources) at your leisure!

You'll notice there is another file named `open_aq.ex` in the root of the `sources` folder. It contains functions that will orchestrate the querying of the data from [OpenAQ](https://openaq.org/) and [Google's geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) based on input:

```elixir
# open_aq.ex

def get_locations(search_term) do
  # ...
end

def get_locations(lat, lon) do
  # ...
end

def get_latest_measurements(location_id) do
  # ...
end
```

There are two clauses of the `get_locations` function; the first accepts a `search_term` (e.g.: `"München"`) and the second, geographical coordinates, `lat, lon` (e.g.: `51.1789,-1.8261`). Searching by `search_term` will be a manual search by the user by using the search field on the client. Searching by `lat,lon` will be useful when using the user's device location to carry out the search.

Lastly, when searching for a location's `measurements`, the location is already known and we simply pass in the `location_id` to initiate the search.

These three functions in the `OpenAQ` module get called at the top level of the _data_ application (`breethe.ex`). They are the interface through which the rest of the _data_ application interacts with the external APIs.

#### Data context and composable queries

We've just had a close look at the module orchestrating the calls to the external APIs and responsible for receiving the _external data_. Let's now take a look at the strategies we used to manage, store and retrieve _internal data_.

In the first section of this post, we discussed the data models:

```
data
├── data.ex
├── location.ex
└── measurement.ex
```

We've had a look at `location.ex` and `measurement.ex` but not `data.ex`. The `Data` module is the solution we chose to organise the DB layer code of the app and roughly follows the concept of contexts in Phoenix 1.3.

The question is this: where should we put the code to interface with the DB layer?

Initially we started by having that code spread out in the data application: we wrote private functions directly where we needed them, in the `sources` directory for example (_keeping it simple and stupid_). This quickly became impractical as the application grew. Keeping track of _where_ the code was accessing _what_ was becoming complicated. Grouping all this functionality in a module was our next approach. A context in Phoenix 1.3 is a dedicated module to groupe related functionality together, which seemed perfect to solve this problem.

The `Data` module is the context. It groups all functionality related to interfacing with the DB layer in a single module. We'll take a look at a few examples, but please explore the [full code for this module](https://github.com/simplabs/breethe-server/blob/master/apps/breethe/lib/breethe/data/data.ex) as well.

```elixir
# data.ex

defmodule Breethe.Data do
  alias __MODULE__.{Location, Measurement}
  alias Breethe.Repo

  def get_location(id) do
    Location
    |> Repo.get(id)
    |> preload_measurements()
  end

  defp preload_measurements(location) do
    location
    |> Repo.preload(
      measurements:
        Measurement
        |> Measurement.last_24h()
        |> Measurement.one_per_parameter()
        |> Measurement.most_recent_first()
    )
  end
end
```

Let's start with `get_location/1`. This function is used throughout the app to retrieve a location based on `id`. We start by calling `Repo.get/2`, passing it `Location` and the `id`. Things get interesting when we pipe the returned location to `preload_measurements/1`.

You may have noticed `preload_measurements/1` is defined as a private function, which only makes it available to other functions within the `Data` module. This is to keep the interface to the DB layer as small as possible. In this way, the _preloading_ of the `measurements` is coupled to a function dealing with `locations` directly and is therefore only done when necessary.

Now the next issue is with filtering the returned results from the DB. Being an air quality app, we only want to return up-to-date data. To achieve this in a pretty clean way, we wrote composable queries using [Ecto's Query DSL](https://hexdocs.pm/ecto/Ecto.Query.html).

The idea is to encapsulate a query expression in a function defined on the schema's module and then compose them using a pipe chain. For example, `preload_measurements/1` uses one such pipe chain:

```elixir
Measurement
  |> Measurement.last_24h()
  |> Measurement.one_per_parameter()
  |> Measurement.most_recent_first()
```

Let's take a look at these queries defined on the `Measurement` module:

```elixir
# measurement.ex

def last_24h(query) do
  from(m in query, where: m.measured_at > ago(24, "hour"))
end

def most_recent_first(query) do
  from(m in query, order_by: [desc: m.measured_at])
end

def one_per_parameter(query) do
  from(m in query, distinct: m.parameter)
end
```

You'll notice the functions take in `query` as a parameter. As stated in the [docs](https://hexdocs.pm/ecto/Ecto.Query.html), anything can be passed to the right side of `in`, as long as it implements the [Ecto.Queryable](https://hexdocs.pm/ecto/Ecto.Queryable.html) protocol.

In our `preload_measurements/1` example, `Measurement` will be passed to `last_24/1`. This works because the `Measurement` module implements the [Ecto.Queryable](https://hexdocs.pm/ecto/Ecto.Queryable.html) protocol. The query resulting from that first invocation will be passed on as an argument to the next function in the chain, which returns another query, which is passed to the next function and so on...

Using queries has greatly improved our code clarity, composability and maintainability. There is less code duplication throughout our code base and reusing the queries actually makes writing this kind of code much faster. Also, who doesn't like a good-looking pipe chain?

#### closing remarks

I hope this first post has given you a good overview of how the umbrella is structured as well as clarified some finer implementation points for the _data_ application. See you in part 2!
