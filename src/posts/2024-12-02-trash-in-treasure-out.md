---
title: "Trash in, treasure out"
authorHandle: hdoordt
tags: ["rust"]
bio: "Henk Oordt, Senior Software Engineering Consultant"
description: "Making your API clear and robust with Rust's type system"
og:
  image: "/assets/images/posts/2024-12-02-trash-in-treasure-out/og-image.png"
tagline: |
  <p>
    Using Rust, you can encode a large part of the constraints and semantics of your API using the type system. In this article, we'll discuss how to do it, and how you can use it to your benefit.
  </p>
---

## Intro

By now, you're probably aware that at Mainmatter, we like Rust a lot. If you aren't: [have a look at our Rust page](https://mainmatter.com/rust-consulting/). In this blog post, I'd like to highlight one of my favorite traits of Rust (yes pun intended): its focus on _correctness_. Rust has a very expressive type system that lets you offload many checks to the compiler: it supports generics, data-carrying enums, closures, visibility specifiers, _explicit_ conversions, and much more. These are neat features that make performant, low-level programming feel as ergonomic as high-level languages. Sure, Rust has a learning curve, and that learning curve is a result of Rust's tendency to make complexity really _in your face_.

Make no mistake, every piece of software is complex: it has to run on computers, which, especially nowadays are complex beasts. And writing software with highly optimized languages with manual memory management like C, C++, or Rust requires knowledge of all kinds of subtleties. Rust makes these subtleties _explicit_, forcing you to fix all kinds of things you may never have thought of before even compiling your code.

But that's not all: as projects grow and age and more people work on the same piece of software, communication becomes very important. And by communication I mean ensuring the original writer of some piece of code, the code reviewer, the user of the code's API, the colleague refactoring the codebase, and new developers are on the same page about the _intent_ and _invariants_ of that code. What is this code doing? How am I supposed to use it correctly? What happens if I mess up? How do I protect this API from input it might choke on? Because 'Garbage in, garbage out' is not a great philosophy when setting up critical and robust systems. Traditionally, one would write in documentation and code comments the answers to these and many other questions. Writing documentation is a very valuable job, but sadly, developers are human. And humans make mistakes. And if the humans think they _themselves_ don't make mistakes, they will surely agree that their colleagues _do_.

Documentation written in human language needs to be clear, specific, and up-to- date. And even if it's written well, for it to do its job, documentation needs to be _read_ in the first place. And even if it _is_ read, it needs to be interpreted and acted upon correctly. I don't know about you, but I'm way too pedantic to see that go flawlessly.

Now, this is why I like Rust's expressive type system: it lets me encode a great deal of the semantics I'd otherwise have to describe in the documentation. You can craft your APIs and types such that using your library or module becomes very hard or even impossible. You can encode the _intent_ and _invariants_ regarding your code using the type system. This way you get the Rust compiler on _your_ side. It will be able to pick up subtle errors caused by your API users holding it wrong. And it will do so _at compile time_, greatly shortening the feedback loop. It makes adding features, refactoring, and reviewing much less error-prone. And it's great for security as well. It's where coding meets art, really.

In this article, I'd like to give three main pieces of advice:

1. Encode the semantics/states of your application in the type system and your API.
2. Ensure input gets parsed into rigid structs before acceptance.
3. Ensure output gets encoded in the correct format and doesn’t leak (sensitive) information.

## Ticket to heaven

We'll need a case to show how all this works, and since Mainmatter [loves the travel industry](/travel/), let's write up an API for booking train tickets.

Looking at different train ticket services, in general, the steps towards booking are pretty similar: first, you enter the location you want to depart from and where you want to go, then you enter either your preferred moment of departure or when you want to arrive. Next, you select one of several suggested trips and enter your personal information. With all the information complete, you're all set to book the ticket and pay. Here's what that looks like as a flowchart:

<div style="margin: 2em auto; width: 493px">

![State diagam](/assets/images/posts/2024-12-02-trash-in-treasure-out/state-diagram.svg)

</div>

Pretty straightforward, right? Let's code one up.

## Setting up

Let's set up a simple [`axum`]-based server to implement before flow. I'm only going to post the code relevant to the story here, but if you're interested in the whole shebang: check out the code for [step 0]. Here's what the app setup looks like:

```rust
// src/lib.rs

pub async fn run() -> Result<()> {
    // Setup router
    let router = axum::Router::new()
        .route("/origin", post(set_origin))
        .route("/destination", post(set_destination))
        .route("/departure", post(set_departure))
        .route("/arrival", post(set_arrival))
        .route("/trips", get(list_trips))
        .route("/trip", post(set_trip))
        .route("/class", post(set_class))
        .route("/name", post(set_name))
        .route("/email", post(set_email))
        .route("/phone_number", post(set_phone_number))
        .route("/book_trip", post(book_trip));

    // Create in-memory session store
    let session_store: SessionNullSessionStore = SessionStore::new(None, SessionConfig::default())
        .await
        .unwrap();

    // Stitch them together
    let app = router
        .layer(SessionLayer::new(session_store))
        .into_make_service();

    // Aand serve!
    let listener = TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}
```

As you can see, we've got routes for each step, as well as a basic in-memory session store. For now, the handlers are pretty similar. Here's `set_origin`:

```rust
// src/lib.rs

async fn set_origin(session: Session, origin: String) -> Result<Json<TicketMachine>> {
    Ok(session.get_or_init_state(|s| {
        s.origin = Some(origin);
    }))
    .map(Json)
}
```

If you're not familiar with [`axum`]: this handler extracts the session out of the session layer, and gives us the request body as a `String`. `Session::get_or_init_state` fetches the current state from the session store, and updates it with the closure passed to it. If there's no session yet, it creates a default one, that it passes to the closure.

So what's this `TicketMachine` in the route handler example? Well, it's the representation of the state of the booking flow. Here's the definition:

```rust
// src/ticket_machine.rs

#[derive(Debug, Default, PartialEq, Eq, serde::Deserialize, serde::Serialize)]
pub struct TicketMachine {
    pub origin: Option<String>,
    pub destination: Option<String>,
    pub departure: Option<String>,
    pub arrival: Option<String>,
    pub trip: Option<String>,
    pub class: Option<String>,
    pub name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub payment_info: Option<String>,
}
```

Pretty much a bunch of optional strings. Does it work, though? Well, let's also create a little integration test:

```rust
// tests/main.rs

#[tokio::test]
async fn test_set_origin() {
    let body: TicketMachine = send_post_request(&http_client(), "/origin", "Amsterdam").await;
    assert_eq!(
        body,
        TicketMachine {
            origin: Some("Amsterdam".to_owned()),
            ..Default::default()
        }
    )
}
```

Nothing too surprising. `http_client` sets up a [`reqwest`] HTTP client, and the `send_post_request` helper function sends a POST request to our server, given the path (`"/origin"`) and the body (`"Amsterdam"`). Now, let's give it a spin. In one terminal window, we start the server, and we'll run the tests in a separate terminal window:

```bash
// start server
$ cargo run
[..]
```

I'm using [`cargo-nextest`] because it gives me pretty and concise reports.

```bash
// Run tests
$ cargo nextest run
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
------------
 Nextest run ID 2b617168-9190-4619-ba1d-27a3e6cdc815 with nextest profile: default
    Starting 1 test across 3 binaries
        PASS [   0.016s] takeoff::main test_set_origin
------------
     Summary [   0.017s] 1 test run: 1 passed, 0 skipped
```

> 1 test run: 1 passed

I like that!

## Looking back

Our route handler doesn't do a lot. It will accept any `String` for a body, meaning that as far as our app is concerned `"🚂-🛒-🛒-🛒"` is totally a valid origin. It's nice that given a string [must be valid UTF-8][String], at least our handler won't accept random byte sequences, but we can do better. For the curious among you: the following code is in the [step 1] commit. Let's add some validation:

```rust
// src/lib.rs

pub fn is_valid_location(location: &str) -> bool {
    const VALID_LOCATIONS: &[&str] = &[
        "Amsterdam Centraal",
        "Paris Nord",
        "Berlin Hbf",
        "London Waterloo",
    ];

    VALID_LOCATIONS.contains(&location)
}

// ✂️

async fn set_origin(session: Session, origin: String) -> Result<Json<TicketMachine>> {
    if !is_valid_location(&origin) {
        return Err(Error::BadRequest("Invalid origin!"));
    }

    Ok(session.get_or_init_state(|s| {
        s.origin = Some(origin);
    }))
    .map(Json)
}
```

And test some more:

```bash
$ cargo nextest run
Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
------------
Nextest run ID 3437f17c-6fed-4b9b-8fad-27b324e45602 with nextest profile: default
Starting 1 test across 3 binaries
    FAIL [   0.014s] takeoff::main test_set_origin

--- STDOUT:              takeoff::main test_set_origin ---

<Omitted for your sanity>

--- STDERR:              takeoff::main test_set_origin ---
thread 'test_set_origin' panicked at tests/main.rs:34:9:
Received error response (reqwest::Error { kind: Status(400), url: "http://localhost:3000/origin" }): 'Bad Request: Invalid origin!'
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

Cancelling due to test failure
------------
 Summary [   0.015s] 1 test run: 0 passed, 1 failed, 0 skipped
    FAIL [   0.014s] takeoff::main test_set_origin
error: test run failed
```

Yay! It fails! Surprise: turns out there's no station called "Amsterdam". We should update the test again:

```rust
// tests/main.rs

#[test_case(b"Amsterdam" => panics ""; "Non-existent station")]
#[test_case("🚂-🛒-🛒-🛒".as_bytes() => panics ""; "Emojional roller coaster")]
#[test_case(&[0xE0, 0x80, 0x80] => panics "" ; "Non-UTF-8 sequence")]
#[test_case(b"Amsterdam Centraal"; "Valid station")]
#[tokio::test]
async fn test_set_bad_origin(origin: &'static [u8]) {
    let body: TicketMachine = send_post_request("/origin", origin).await;
    assert_eq!(
        body,
        TicketMachine {
            origin: Some(String::from_utf8(origin.to_vec()).unwrap()),
            ..Default::default()
        }
    )
}
```

And those, believe me, totally pass! Now what?

## Even better validation

We can do better still. Here's the thing: for our server to validate locations _everywhere_, we'd need to add loads of calls to `is_valid_location`. What happens if I forget, though? This is where Rust's expressive type system comes in. With Rust, you can create types that are valid _by construction_. The mere fact that such an instance of such type exists, proves that it is valid. And this is truly an amazing power. How do you do it? Well, by using the [newtype] pattern:

```rust
// src/types/location.rs

pub struct Location(String);
```

The code for this section can be found in the repo state as of the [step 2] commit.

Now, wrapping a struct in and of itself is not too useful. But we already did something very important: give the type a good name, adding semantics! Now, of course, you'd add some doc comments describing the type some more, but already it's clear what this type is meant to represent. There's no way to instantiate it from outside the `types::location` module, though. On the one hand, that's great: right now there's no way to instantiate an invalid `Location`. However, it'd be a huge improvement if we could create _valid_ `Location`s. So let's add some methods and trait implementations:

```rust
// src/types/location.rs

#[derive(Debug, Clone, PartialEq, Eq, serde::Deserialize, serde::Serialize)]
#[serde(try_from = "String")]
pub struct Location(String);

impl Location {
    pub fn is_valid_location(location: &str) -> bool {
        const VALID_LOCATIONS: &[&str] = &[
            "Amsterdam Centraal",
            "Paris Nord",
            "Berlin Hbf",
            "London Waterloo",
        ];

        VALID_LOCATIONS.contains(&location)
    }
}

impl TryFrom<String> for Location {
    type Error = ParseLocationError;

    fn try_from(s: String) -> Result<Self, Self::Error> {
        if !Self::is_valid_location(&s) {
            return Err(ParseLocationError(s));
        }
        Ok(Self(s))
    }
}

#[derive(Debug, thiserror::Error)]
#[error("Error parsing location: {0}")]
pub struct ParseLocationError(String);
```

Much better! Using the `#[serde(try_from = "String")]` attribute, we've instructed `serde` to call the `Location::try_from` implementation upon deserialization. Now, the _only_ way to instantiate a `Location` is through it's `TryFrom<String>` implementation, which does the validation. Barring any unsafe magic tricks, that is. Getting the value _out_ is a matter of adding more functionality, which I won't bore you with right now. But you can imagine adding an implementation for `std::fmt::Display`, or a method `fn as_str(&self) -> &str`. Don't go implement `std::ops::Deref<Target=String>` though, that'd [defeat the purpose][deref_polymorphism].

With that set up, let's update our model, as well as the relevant method handlers. Here's our freshly updated `TicketMachine`, which got moved to the `crate::types::ticket_machine` module:

```rust
// src/types/ticket_machine.rs
use crate::types::location::Location;

#[derive(Debug, Default, PartialEq, Eq, serde::Deserialize, serde::Serialize)]
pub struct TicketMachine {
    pub origin: Option<Location>,
    pub destination: Option<Location>,
    // ✂️ ..other fields
}
```

Here's `set_origin`:

```rust
// src/lib.rs

async fn set_origin(session: Session, Json(origin): Json<Location>) -> Result<Json<TicketMachine>> {
    Ok(session.get_or_init_state(|s| {
        s.origin = Some(origin);
    }))
    .map(Json)
}
```

As you can see, instead of taking a `String` body, this time we're taking a `Json<Location>`. Axum will attempt to deserialize the request body into a `Location`, and the `Json<_>` extractor tells it that it should use `serde_json` to do so. And as `serde_json` is going to use the `serde::Deserialize` implementation we derived on `Location` before, `Location::try_from<String>` gets run even the _before_ code within the route handler is run. So within the route handler, we're _certain_ that the `origin` parameter represents a valid `Location`!

Now, of course, our test is just sending plain, unquoted strings, and unquoted strings are not valid JSON. So let's update our test:

```rust
// tests/main.rs

fn json_string_bytes(s: &str) -> Cow<'static, [u8]> {
    serde_json::to_vec(s).unwrap().into()
}

#[test_case(json_string_bytes("Amsterdam") => panics ""; "Non-existent station")]
#[test_case(json_string_bytes("🚂-🛒-🛒-🛒") => panics ""; "Emojional roller coaster")]
#[test_case([0xE0, 0x80, 0x80].as_slice().into() => panics "" ; "Non-UTF-8 sequence")]
#[test_case(b"Amsterdam Centraal".into() => panics ""; "Invalid JSON")]
#[test_case(json_string_bytes("Amsterdam Centraal"); "Valid station")]
#[tokio::test]
async fn test_set_bad_origin(origin: Cow<'static, [u8]>) {
    let origin = origin.to_vec();
    let body: TicketMachine = send_post_request("/origin", origin.clone()).await;

    let origin: String = serde_json::from_slice(&origin).expect(
        "The request should have failed at this point as `origin` was not valid JSON anyway",
    );
    let origin: Location = origin.try_into().unwrap();

    assert_eq!(
        body,
        TicketMachine {
            origin: Some(origin),
            ..Default::default()
        }
    )
}
```

We're now sending JSON! The signature changed a bit: instead of a `&'static [u8]`, it now takes a `Cow<'static, [u8]>`, which helps with our JSON serialization stuff, but let's not focus on that. Instead, I'm gonna distract you with the test results:

```bash
$ cargo nextest run
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.10s
------------
 Nextest run ID a7be105d-a24b-44e9-baba-c5a560608792 with nextest profile: default
    Starting 5 tests across 3 binaries
        PASS [   0.045s] takeoff::main test_set_bad_origin::valid_station
        PASS [   0.046s] takeoff::main test_set_bad_origin::non_existent_station
        PASS [   0.046s] takeoff::main test_set_bad_origin::non_utf_8_sequence
        PASS [   0.046s] takeoff::main test_set_bad_origin::invalid_json
        PASS [   0.046s] takeoff::main test_set_bad_origin::emojional_roller_coaster
------------
     Summary [   0.047s] 5 tests run: 5 passed, 0 skipped
```

There we go! With that set up, we have the following guarantees within the `set_origin` method handler regarding the request body:

- It's valid UTF-8;
- It's valid JSON;
- It represents a valid `Location`, as defined in its `TryFrom<String>` implementation.

And it's all checked by Rust's type system! We might as well throw out the cases that pass in non-UTF-8 sequences or invalid JSON: the only really sensible part to test is the implementation of `TryFrom<String>`. But let's keep them anyway because tests are great to have when doing big code refactors.

## Output sanitization

So far, Rust's type system has been working for us very well to give us guarantees about input. How about output though? Using the [`newtype`] pattern from the previous section again, we can ensure sensitive data gets hidden in responses and logs. Furthermore, we can make the output encoding format part of our type zoo. Let me remind you what our `TicketOffice` model looks like so far:

```rust
// src/types/ticket_machine.rs

#[derive(Debug, Default, PartialEq, Eq, serde::Deserialize, serde::Serialize)]
pub struct TicketMachine {
    pub origin: Option<Location>,
    pub destination: Option<Location>,
    pub departure: Option<String>,
    pub arrival: Option<String>,
    pub trip: Option<String>,
    pub class: Option<String>,
    pub name: Option<String>,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub payment_info: Option<String>,
}
```

The first thing you'll notice is that we aren't doing any input validation for the fields other than `origin` and `destination`. But other than that, our struct holds some sensitive personal data: `name`, `email`, `phone_number`, and `payment_info`. Let's focus on that last field, `payment_info`, though. We haven't specified yet what `payment_info` _is_, but let's assume for now that it may contain credit card details. Now, credit card details are things you don't want ending up in your logs or API responses. Using the [`newtype`] pattern, we can make it _hard_ to leak such data into the logs. The following examples can be found in the repo state as of the [step 3] commit. Let's conjure up a `PaymentInfo` type:

```rust
// src/types/payment_info.rs

#[derive(Clone, PartialEq, Eq, serde::Deserialize, serde::Serialize)]
#[serde(into = "String")]
pub struct PaymentInfo(String);

impl std::fmt::Display for PaymentInfo {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "<SECRET>")
    }
}

impl std::fmt::Debug for PaymentInfo {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple(stringify!(PaymentInfo))
            .field(&"<SECRET>")
            .finish()
    }
}

impl From<PaymentInfo> for String {
    fn from(p: PaymentInfo) -> Self {
        p.to_string()
    }
}
```

This time, we've ensured the ways to convert `PaymentInfo` to a `String` are watertight. Using the `#[serde(into = "String")]` attribute on the struct definition, we've ensured that Serde uses the `Into<String>` implementation on `PaymentInfo` to serialize the struct, which gets forwarded to its `Display` implementation. And that implementation hides our secrets. Nice! Accidentally logging payment info is covered as well by the custom implementation of `Debug`. Obviously, `PaymentInfo` requires input validation, too, but let's keep focus on the output right now.

Let's update our `TicketMachine` and the `book_trip` route handler:

```rust
// src/types/ticket_machine.rs

#[derive(Debug, Default, PartialEq, Eq, serde::Deserialize, serde::Serialize)]
pub struct TicketMachine {
    // ✂️ ..other fields
    pub payment_info: Option<PaymentInfo>,
}

// src/lib.rs

async fn book_trip(
    session: Session,
    Json(payment_info): Json<PaymentInfo>,
) -> Result<Json<TicketMachine>> {
    session
        .update_state(|s| {
            s.payment_info = Some(payment_info);
            println!("🚂 Trip booked! Choo choo!");
        })
        .ok_or(Error::BadRequest("Set phone_number first"))
        .map(Json)
}
```

Great. We were already wrapping our output in a `Json`, ensuring the data gets encoded in the right format before sending it out. Now we'll add some tests to validate that this works:

```rust
// tests/main.rs

#[tokio::test]
async fn test_hiding_payment_details() {
    let client = http_client();
    let origin = json!("Amsterdam Centraal");
    // Set up the session
    let _: TicketMachine =
        send_post_request(&client, "/origin", serde_json::to_vec(&origin).unwrap()).await;

    // Totally not _my_ credit card
    let payment_info = json!({
        "card_number": "1234 5678 9012 3456",
        "cvc": "123",
        "exp": "12/34",
    })
    .to_string();
    // Deserialize into a Value, so that we can skip any input validation on
    // the test side.
    let state: serde_json::Value = send_post_request(
        &client,
        "/book_trip",
        serde_json::to_vec(dbg!(&payment_info)).unwrap(),
    )
    .await;

    assert_eq!(state["payment_info"], "<SECRET>");
}

// src/types/payment_info.rs

#[tokio::test]
async fn test_payment_details_debug_impl() {
    use crate::types::ticket_machine::TicketMachine;
    use std::fmt::Write;

    let ticket_machine = TicketMachine {
        origin: None,
        destination: None,
        departure: None,
        arrival: None,
        trip: None,
        class: None,
        name: None,
        email: None,
        phone_number: None,
        payment_info: Some("💰💰💰".to_owned().try_into().unwrap()),
    };
    let mut dbg_output = String::new();
    write!(&mut dbg_output, "{ticket_machine:?}").unwrap();

    assert_eq!(
        dbg_output,
        r#"TicketMachine { origin: None, destination: None, departure: None, arrival: None, trip: None, class: None, name: None, email: None, phone_number: None, payment_info: Some(PaymentInfo("<SECRET>")) }"#
    )
}
```

And test:

```bash
$ cargo nextest run
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.38s
------------
 Nextest run ID 1ba4afd2-c85c-4817-8f6d-5d66090fb3a1 with nextest profile: default
    Starting 7 tests across 3 binaries
        PASS [   0.015s] takeoff types::payment_info::test_payment_details_debug_impl
        PASS [   0.051s] takeoff::main test_set_bad_origin::valid_station
        PASS [   0.051s] takeoff::main test_set_bad_origin::invalid_json
        PASS [   0.051s] takeoff::main test_set_bad_origin::non_existent_station
        PASS [   0.051s] takeoff::main test_set_bad_origin::emojional_roller_coaster
        PASS [   0.051s] takeoff::main test_set_bad_origin::non_utf_8_sequence
        PASS [   0.052s] takeoff::main test_hiding_payment_details
------------
     Summary [   0.052s] 7 tests run: 7 passed, 0 skipped
```

There you go! With that, we've ensured that once our `PaymentInfo` is instantiated, it'll be quite hard to accidentally leak its contents. Completely hiding the payment info from everything would make it rather unuseful, but at least we can't accidentally log them or send them in a response, preventing a very likely cause of leaking information.

## Wrapping up

We've reached a lot already! We've created meaningful types for handling the data in our model, ensured they're valid by construction, and that they don't leak sensitive information. With that, our API has become much more robust than the version we started out with. Let's summarize what we've achieved with that.

In the [introduction](#trash-in-treasure-out), I listed three pieces of advice:

> 1. Encode the semantics/states of your application in the type system and your API.
> 2. Ensure input gets parsed into rigid structs before acceptance.
> 3. Ensure output gets encoded in the correct format and doesn’t leak (sensitive) information.

In [step 2](#even-better-validation), we've covered the first two points. We started out creating an explicit `Location` type, with a name that clearly indicates what it conveys. We've skipped adding documentation on that type, but if we hadn't, it could describe the semantics and invariants of `Location` some more. That documentation would be easily findable anywhere `Location` is used.

Furthermore, we ensured `Location`s are valid by construction: by implementing the validation in the `TryFrom<String>` implementation for `Location`, and ensuring the `Location` can only be created and deserialized via that validation, we've ensured that a `Location` _always_ represents a valid location, _as long as our validation logic is correct_. And by accepting `Json<Location>` in our Axum request handlers directly, those handlers don't need to do any further validation.

In [step 3](#output-sanitization), we've ensured the `PaymentDetails` can't leak sensitive information in logs or responses by implementing `Debug` and `Display` such that they don't actually use the wrapped `String`, and ensured the `From<PaymentDetails>` implementation for `String` uses our `Display` implementation. We can add dedicated methods to get the data out in case we need to store the payment details in our database, for instance. With that, _accidentally_ leaking such info has become much harder.

Are there any downsides? As always: yes, this is no silver bullet. One thing you probably have noticed so far is that the patterns described in this post introduce a bunch of boilerplate. There are crates (e.g. [`nutype`]) out there that aim to reduce this, but they come with their own trade-offs. Furthermore, sometimes not all invariants can be expressed in Rust code. In such cases, one still has to rely on documentation to be thorough and correct.

Other than that, rigidity may not always be what you want. Sometimes your invariants and requirements are not all that clear, and are very subject to change. In such cases, it's not great to update loads of boilerplate all the time. This, I think, is a bit of a matter of taste: I myself like to force myself to clarify the requirements and invariants before implementation, and with the validation being implemented in a single place, updating that is not such a big hassle. And what you get back is huge: correct, robust, clear, and maintainable code!

_In [step 4], I've updated the rest of the method handlers, and demonstrate the [`validator`] and [`nutype`] crates briefly. Be sure to have a look!_

[step 0]: https://github.com/mainmatter/trash-in-treasure-out/tree/abaa132a4250c71846ddf9a4540129af9952c9e8
[step 1]: https://github.com/mainmatter/trash-in-treasure-out/tree/5c03b284bc0b1c932ec1c09b6abfef13f5cdfa4e
[step 2]: https://github.com/mainmatter/trash-in-treasure-out/tree/305b8088b5155aeb13a473ca398fd1d522405b7d
[step 3]: https://github.com/mainmatter/trash-in-treasure-out/tree/1dc8400afff4a31bcc1586e577a4af39124b8dfa
[step 4]: https://github.com/mainmatter/trash-in-treasure-out/tree/f194371b6f5fa762002b00e3c4f6d6fcd81dcbc9
[`axum`]: https://crates.io/crates/axum/
[`reqwest`]: https://crates.io/crates/reqwest/
[`cargo-nextest`]: https://nexte.st/
[String]: https://doc.rust-lang.org/stable/std/string/struct.String.html
[newtype]: https://rust-unofficial.github.io/patterns/patterns/behavioural/newtype.html?highlight=newtype#newtype
[deref_polymorphism]: https://rust-unofficial.github.io/patterns/anti_patterns/deref.html
[`nutype`]: https://crates.io/crates/nutype/
[`validator`]: https://crates.io/crates/validator/
