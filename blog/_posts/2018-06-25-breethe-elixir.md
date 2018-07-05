---
layout: article
section: Blog
title: "Elixir/Phoenix Breethe.app part 1: Data"
author: "Niklas Long"
github-handle: niklaslong
---

Over the last couple of months, we have been building an Elixir umbrella app to serve as our back end for breethe.app, which provides instant access to up to date air quality data for locations across the world. In the next couple of posts, I will be going through the application's code with the aim of explaining some of the strategies we employed and decisions we made along the way.

<!--break-->

The breethe.app project is intirely open-source. Please take a look at the code for the [client](https://github.com/simplabs/breethe-client) and the [back end](https://github.com/simplabs/breethe-server), the latter being the focus of this series of posts. We've also written and will be writing on our blog about the client and the back end in future, so stay tuned!

Breethe.app is an air quality app. This means our back end interacts with with a number of external APIs to aggregate the data:

* [OpenAQ API](https://openaq.org/) - provides the airquality data
* [Google's geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) - helps us obtain precise and consistent location data

As mentioned in passing above, the Elixir back end is actually an umbrella application. If you don't know what these are, they're basically a container for mix apps. Our umbrella contains:

* a mix application named `breethe` which handles our _data_
* a Phoenix application (named `breethe_web`) which is the _webserver_

Both of these apps live inside the `apps` directory of our project. Below are the trees for each of their `lib` directories - don't worry about the details for now, we'll be taking a pretty close look at both of them.


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

In this first post we'll take a look at the _data_ application, namely the `data` and `sources` directory. Future posts will cover the Phoenix _webserver_ application, testing and other aspects of the umbrella app.

The `data` directory contains our models, which we will take a look at first. The `sources` directory contains code to coordinate the interaction of our application with the external APIs mentioned above.

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

We are using [Ecto](https://github.com/elixir-ecto/ecto) as our DB wrapper. Below are the two schemas. I left out module aliases and module names for brevity but the full code for the models can be found [here](https://github.com/simplabs/breethe-server/tree/master/apps/breethe/lib/breethe/data).

```elixir
# location.ex

schema "locations" do
  has_many(:measurements, Measurement)

  field(:identifier, :string)
  field(:label, :string)
  field(:city, :string)
  field(:country, :string)
  field(:last_updated, :utc_datetime)
  field(:available_parameters, {:array, ParameterEnum})
  field(:coordinates, Geo.Geometry)

  timestamps()
end
```

```elixir
# measurement.ex

schema "measurements" do
  belongs_to(:location, Location)

  field(:parameter, ParameterEnum)
  field(:measured_at, :utc_datetime)
  field(:value, :float)
  field(:unit, UnitEnum)

  timestamps()
end
```

Most of this code is pretty straight-forward. One thing to note, is that we are using the [Geo](https://github.com/bryanjos/geo) library and the [GeoPostgis](https://github.com/bryanjos/geo_postgis) postgrex extension which allows us to store and interact with the geographic data we have for our `locations`. This is used on the `coordinates` field above:

```elixir
field(:coordinates, Geo.Geometry)
```

Our application will interact with a few external APIs and we need to make sure the data that we accept and store remains consistent. One strategy we are using to enforce this is the use of [EctoEnum](https://github.com/gjaldon/ecto_enum). This allows us to define custom Enum types, thus restricting the possible values our data can take on certain fields of our models:

```elixir
# ecto_enums.ex

import EctoEnum

defenum(ParameterEnum, :parameter, [:pm10, :pm25, :so2, :no2, :o3, :co, :bc])
defenum(UnitEnum, :unit, [:micro_grams_m3, :ppm])
```

If we try to pass a value the custom type doesn't define, an error will be raised.

These custom types are used for our `measurements`:

```elixir
field(:parameter, ParameterEnum)
field(:unit, UnitEnum)
```

The `parameter` field will store the pollutant measured. It can be one of 7 types, defined by the `ParameterEnum` above:


- `:pm10` - coarse particles with a diameter between 2.5 and 10 μm (micrometers)
- `:pm25` - fine particles with a diameter of 2.5 μm or less
- `:so2` - _sulfure dioxide_, a major air pollutant that has a significant effect on human health
- `:no2` - _nitrogen dioxide_, gets in the air from burning fuel (car, trucks, power-plants, etc...)
- `:o3` - _ozone_, good in the stratosphere, bad at ground level
- `:co` - _carbon monoxide_, created when burning fossil fuels
- `:bc` - _black carbon_, a component of fine particulate matter - causes human morbidity and premature mortality

The `unit` field will store the unit of the measurement. It is defined by the `UnitEnum` above and can be one of two types:

- `:micro_grams_m3` - micrograms per cubic meter (µg/m³)
- `:ppm` - parts per million (ppm) (needs to be removed as it is unused troughout the app)

All of the data our app will handle will be in µg/m³ as we convert the measurements we _can_ to use µg/m³. We can't do the ppm - µg/m³ conversion for `:pm10`, `:pm25` and `:bc`, but the values should already be in µg/m³.


#### Data sources

Our data sources live and breathe in the aptly named `sources` folder:

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

The `google` directory contains a single file called `geocoding.ex`. In that file we have written code which will request data from [Google's geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) and allows us to convert between coordinates and addresses. This is how we get accurate locations which we then use to query the [OpenAQ API](https://openaq.org/).

The `open_aq` directory contains two files:

- `locations.ex`: contains code to query the [OpenAQ API](https://openaq.org/) for location data
- `measurements.ex`: contains code to query [OpenAQ API](https://openaq.org/) for measurement data based on location

We won't go into the specifics of these files here, but feel free to [peruse the code](https://github.com/simplabs/breethe-server/tree/master/apps/breethe/lib/breethe/sources) at your leisure!

You'll notice there is another file named `open_aq.ex` in the root of our `sources` folder. It contains functions that will orchestrate the querying of the data from the two aforementioned sources based on input. Let's take a look at these in greater detail, starting with the function heads and working our way inwards:

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

Firstly, let me give you a little context concerning the function parameters. We want to be able to search `locations` both by `search_term` (e.g.: `"Münich"`) or `lat, lon` (e.g.: `51.1789,-1.8261`).

Searching by `search_term` will be a manual search by the user by using the search field on the client. Searching by `lat,lon` will be useful when using the user's device location to carry out the search.

Lastly, when searching for a location's `measurements`, the location will already be known and we simply pass in the `location_id` to initiate the search.

So with that in mind, let's flesh these out starting with `get_locations/1`:

``` elixir
# open_aq.ex

def get_locations(search_term) do
    case Google.Geocoding.find_location(search_term) do
      [lat, lon] -> get_locations(lat, lon)
      [] -> []
    end
  end
```

The [OpenAQ API](https://openaq.org/) will always need to be queried using `lat,lon` for `locations`. Therefore, the first step is converting the `search_term` into accurate `lat,lon` data we can use. We'll use the [Google geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) to do this by calling `Google.Geocoding.find_location(search_term)`.

We then call the second clause, `get_locations/2`, passing it the previously returned `lat,lon` as arguments.

```elixir
# open_aq.ex

def get_locations(lat, lon) do
  locations = OpenAQ.Locations.get_locations(lat, lon)

  locations
    |> Enum.reject(fn location -> location.label end)
    |> Enum.map(fn location ->
      {location_lat, location_lon} = location.coordinates.coordinates

      {:ok, _pid} =
        Task.Supervisor.start_child(TaskSupervisor, fn ->
          address = Google.Geocoding.find_location(location_lat, location_lon)

          Data.update_location_label(location, address)
        end)
    end)

    locations
  end
end
```

This function is going to take care of querying the [OpenAQ API](https://openaq.org/) for locations. This is what `OpenAQ.Locations.get_locations(lat, lon)` is doing. The `lat,lon` will be provided either by `get_locations/1` or by the user's device location.

The [OpenAQ API](https://openaq.org/) aggregates location and measurement data from different sources and doesn't always produce a user-friendly identifier (e.g, an address) for locations. This is where the pipe chain comes in. `Enum.reject` returns the locations for which `location.label` evaluates to a _falsy_ value. These are then passed to `Enum.map`, which queries [Google's geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) with each location's coordinates: `Google.Geocoding.find_location(location_lat, location_lon)`. The API then returns a more user-friendly address that we store using `Data.update_location_label(location, address)`.

This is all executed asynchronously in a `Task`, which we will explain in more detail in a future post about the performance optimisations we implemented in the application.

Lastly, as an Elixir function returns the last evaluated expression, we call `locations` at the bottom of the function to return the locations stored in the `locations` variable.

The last function I mentioned above is `get_latest_measurements/1`:

```elixir
# open_aq.ex

def get_latest_measurements(location_id) do
  OpenAQ.Measurements.get_latest(location_id)
end
```

This simply queries the API and returns the measurements for a particular location using the `location_id`.

As mentioned earlier in this section, these three functions in the `OpenAQ` module are very important as they are the functions through which we interact with our APIs. These functions get called at the top level of our data  application (`breethe.ex`) and each call functions defined in the modules contained in the `google` or `open_aq` directories.

#### Data context and composable queries

We've just had a close look at the module orchestrating the calls to the external APIs and responsible for receiving the _external data_. Let's now take a look at the strategies we used to manage, store and retrieve _internal data_.

In the first section of this post, we discussed the data models:

```
data
├── data.ex
├── location.ex
└── measurement.ex
```

We've had a look at `location.ex` and `measurement.ex` but not `data.ex`. The `Data` module is the solution we chose to organise the DB layer code of our app and roughly follows the concept of contexts in Phoenix 1.3.

The question is this: where should we put the code to interface with the DB layer?

Initially we started by having that code spread out in the data application: we wrote private functions directly where we needed them, in the `sources` directory for example (_keeping it simple and stupid_). This quickly became impractical as our application grew. Keeping track of _where_ what code was accessing _what_ was becoming complicated. Grouping all this functionality in a module was our next approach. A context in Phoenix 1.3 is a dedicated module to groupe related functionality together, which seemed perfect to solve this problem.

The `Data` module is our context. It groups all functionality related to interfacing with our DB layer in a single module. We'll take a look at a few examples, but please explore the [full code for this module](https://github.com/simplabs/breethe-server/blob/master/apps/breethe/lib/breethe/data/data.ex) as well.

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

You may have noticed `preload_measurements/1` is defined as a private function, which only makes it available to other functions within the `Data` module. This is to keep the interface to our DB layer as small as possible. In this way, the _preloading_ of the `measurements` is coupled to a function dealing with `locations` directly and is therefore only done when necessary.

Now the next issue is with filtering our returned results from the DB. Being an air quality app, we only want to return up-to-date data. To achieve this in a pretty clean way, we're writting composable queries using [Ecto's Query DSL](https://hexdocs.pm/ecto/Ecto.Query.html).

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

In our `preload_measurements/1` example, `Measurement` will be passed to `last_24/1`. This works because the `Measurement` module implements `Ecto.Queryable` protocol. The query resulting from that first invocation will be passed on as an argument to the next function in the chain, which returns another query, which is passed to the next function and so on...

Using queries has greatly improved our code clarity, composability and maintainability. There is less code duplication throughout our code base and actually makes writing this kind of code much faster. Also, who doesn't like a good-looking pipe chain?

#### closing remarks

I hope this first post has given you a good overview of how the umbrella is structured as well as clarified some finer implementation points for the _data_ application. See you in part 2!
