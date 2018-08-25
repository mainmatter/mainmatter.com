---
layout: article
section: Blog
title: Elixir TIL - Pipes
author: "Niklas Long"
github-handle: niklaslong
---

This is a collection of tips and tricks I've come across over the last year of working with Elixir.

<!--break-->

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

  And finally, let's replace the reference to our lambda with the actual lambda:

  ```elixir
  iex(6)> 2 |> (fn x -> x + 2 end).()
  4
  ```

#### Pry me a river
Sometimes you need to quickly inspect the data being passed through a pipe-chain. Often `IO.inspect` will do the trick:

```elixir
|> ...
|> IO.inspect()
|> ...
```

However, if you want to interact with the data you could write a one-arity lambda and chuck it into your pipe when needed:

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

The capture `&` operator can be used to create a lambda definition without explicitly naming the function arguments. In this case, `&1` serves as a placeholder for the first argument (`x` in the _classic_ lambda definition).
The example above creates a one-arity lambda, but we could also create a two arity lambda:

```elixir
&(&1 + &2)
```

Which would be equivalent to:

```elixir
fn x, y -> x + y end
```

The lambda's arguments are defined by `&n` with `n` being the _nth_ argument of the function (you can therefore create lambdas with _n_-arity).
