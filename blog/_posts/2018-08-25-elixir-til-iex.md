---
layout: article
section: Blog
title: Elixir TIL - IEx.
author: "Niklas Long"
github-handle: niklaslong
---

This is a collection of tips and tricks I've come across over the last year of working with Elixir.

<!--break-->

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
You double check your code and sure enough, you've misspelled the `params` variable with `prams`. You promptly fix it, but hate the prospect of starting all over again with the aliasing and the variabling in a fresh IEx shell.
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
