---
layout: article
section: Blog
title: Elixir TIL - Numbers, iex and pipes
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

If you've carefully read the Elixir docs, you'll have realized by now there's explicite `Integer.to_float` or `Float.to_integer` functions. Well, as always, Elixir has got you covered:

```elixir
iex(1)> 3 / 1
3.0

iex(2)> round(3.0)
3
```

#### Oops!... I did it again

Ever forget to assign a variable in IEx? Well `v/1` has your back:

```elixir
iex(1)> "Don't you dare mention BS in the same sentence as RATM!"
"Don't you dare mention BS in the same sentence as RATM!"

iex(2)> 52 + 52
104

iex(3)> v(-2)
"Don't you dare mention BS in the same sentence as RATM!"

iex(4)> v(2)
104

iex(5)> v(2) + 10
114
```

You can find the documentation for `v/1` and many other useful functions in the IEx.Helper module [here](https://hexdocs.pm/iex/IEx.Helpers.html).

#### r/1 with the rythm

Let's say you've started IEx with a Mix project using `iex -S mix` and you've just aliased loads of module names, set loads of variables but something isn't quite working.
You double check your code and sure enough, you've mispelled the `params` variable with `prams`. You promptly fix it, but hate the prospect of starting all over again with the aliasing and the variabling in a fresh IEx shell.
`r/1` to the rescue! `r(module)` recompiles and reloads the given `module`, so you can resume your debugging activities forthwith.

```
iex(1)> alias MyApp.Etite
MyApp.Etite

# make some changes to MyApp.Etite module and save.

iex(2)> r Etite
warning: redefining module MyApp.Etite (current version loaded from _build/dev/lib/my_app/ebin/Elixir.MyApp.Etite.beam)
  lib/my_app/etite.ex:1

{:reloaded, MyApp.Etite, [MyApp.Etite]}
```

If you need to recompile your whole project, `recompile/0` will do this for you.

Like `v/1`, `r/1` and `recompile/0` are also part of the [IEx.Helper module](https://hexdocs.pm/iex/IEx.Helpers.html).

#### Give me a break!

```elixir
iex(1)> String.reverse("2 B or not 2B)
...(1)>
```

Me: _Fudge, I forgot the closing double quote._

```elixir
iex(1)> String.reverse("2 B or not 2B)
...(1)> String.reverse("2 B or not 2B")
...(1)>
```

Me: _Aaaaaaand DUH that doesn't work. Ok, how do I get out of this mess? Please IEx, just give me a clean slate! All I ask for is one more chance?_


```elixir
iex(1)> String.reverse("2 B or not 2B)
...(1)> String.reverse("2 B or not 2B")
...(1)> "
...(1)>
```

Me: _I thought so._

Hollywood voiceover guy: _Throughout history, mankind has struggled to coexist with IEx. What if things could be different?_

Well they can:

```elixir
iex(1)> String.reverse("2 B or not 2B)
...(1)> String.reverse("2 B or not 2B")
...(1)>
...(1)> #iex:break
** (TokenMissingError) iex:1: incomplete expression

iex(1)>
```

Badum tssssss - thanks to `#iex:break` the world is a better place.

#### Operator is in da pipe!

Elixir has a number of operators:

* `<>`
* `+, -, *, /`
* `||` and `&&`
* ... and the list goes on.

This is all well and good, but what if you want to concat a string in a pipe-chain. Well `<>` like all the other operators above are part of the `Kernel` module. Therefore `<>` is actually `Kernel.<>()` and you could do this:

```elixir
iex(1)> "olleh" |> String.reverse() |> Kernel.<>(" world")
"hello world"
```

In fact you can do this with all the functions stated above:

```elixir
iex(2)> false |> Kernel.||(true)
true

iex(3)> false |> Kernel.&&(true)
false

iex(4)> 23 |> Kernel.+(2)
25
```

#### Piping to an anonymous function
  Piping to an anonymous function is quite useful if you don't want to interrupt your pipe-chain for small bits of computation you don't want in a named function:

  ```elixir
  iex(1)> 2 |> (&(&1 + 2)).()
  4
  ```

  Or the more verbose version:

  ```
  iex(2)> 2 |> (fn x -> x + 2 end).()
  4
  ```

  This syntax can be confusing at first, but it's quite simple really. Let's start by taking a look at a normal lambda and let's store it's reference in a variable:

  ```elixir
  iex(3)> my_lambda = fn x -> x + 2 end
  #Function<6.99386804/1 in :erl_eval.expr/5>
  ```

  And now let's call our function:

  ```elixir
  iex(4)> my_lambda.(2)
  4
  ```

  Perfect, so far so good. Let's call our function using a pipe operator:

  ```elixir
  iex(5)> 2 |> my_lambda.()
  4
  ```

  And finally, let's replace the reference to our lambda with the actual lamdba:

  ```elixir
  iex(6)> 2 |> (fn x -> x + 2 end).()
  4
  ```

#### Pry me a river
Sometimes you need to quickly inspect the data being passed through a pipechain. Often `IO.inspect` will do the trick:

```elixir
|> ...
|> IO.inspect()
|> ...
```

However, if you want to interact with the data you could write a one-arity lamdba and chuck it into your pipe when needed:

```elixir
|> ...
|> (fn response -> IEx.pry end).()
```

#### Sugar
In the _piping to an anonymous function_ example, I mentioned in passing that the lambda definitions below were equivalent:

```elixir
  fn x -> x + 2 end

  &(&1 + 2)
```

The capture `&` operator can be used to create a lambda definition without explicitely naming the function arguments. In this case, `&1` serves as a placeholder for the first argument (`x` in the _classic_ lambda definition).
The example above creates a one-arity lambda, but we could also create a two arity lambda:

```elixir
&(&1 + &2)
```

Which would be equivalent to:

```elixir
fn x, y -> x + y end
```

The lambda's arguments are defined by `&n` with `n` being the _nth_ argument of the function (you can therefore create lamdas with _n_-arity).
