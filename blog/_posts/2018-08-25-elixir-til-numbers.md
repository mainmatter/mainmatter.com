---
layout: article
section: Blog
title: Elixir TIL - Numbers
author: "Niklas Long"
github-handle: niklaslong
---

This is a collection of tips and tricks I've come across over the last year of working with Elixir.

<!--break-->

#### Time after time

Sometimes one needs to time things or convert time to other units. Enter Erlang's `timer` module, which defines some wonderfully convenient functions you can call from Elixir:

```elixir
iex(1)> :timer.minutes(10)
600000 # 10 minutes in milliseconds

iex(2)> :timer.hms(1, 3, 34)
3814000 # 1h, 3m, 34s in milliseconds

iex(3)> :timer.sleep(1000)
# 1 second goes by...
:ok
```

You can (and should) check out the rest [here](http://erlang.org/doc/man/timer.html).

#### (S)math it up parts 1 & 2

Elixir has some math functions which are part of the `Kernel` module:

* `+`, `-`, `*` and `/`
* `abs/1`
* `div/2`
* `rem/2`
* `min/2`
* `max/2`
* `round/1`
* `trunc/1`

```elixir
iex(1)> abs(-2)
2

iex(2)> div(10, 2)
5

iex(3)> rem(9, 5)
4

iex(4)> min(1, 2)
1

iex(5)> max("foo", [])
"foo"

iex(6)> round(2.87)
3

iex(7)> trunc(8.3)
8
```

In addition to the above, the `Float` and `Integer` modules also define a few helpful functions for working with numbers, but nothing particularly mathy.

Cue Erlang's `math` module. It defines:

* trigonometry functions
* exponentials
* square-roots
* logarithmic functions
* π

The [docs](http://erlang.org/doc/man/math.html) are not particularly verbose, but the function names and specs are pretty self-explanatory.

As with the `timer` module you can call the `math` module like so:

```elixir
iex(1)> :math.cos(1)
0.5403023058681398

iex(2)> :math.pow(2, 3)
8.0

iex(3)> :math.pi()
3.141592653589793
```

#### To float and back again

If you've carefully read the Elixir docs, you'll have realized by now there's explicit `Integer.to_float` or `Float.to_integer` functions. Well, as always, Elixir has got you covered:

```elixir
iex(1)> 3 / 1
3.0

iex(2)> round(3.0)
3
```
