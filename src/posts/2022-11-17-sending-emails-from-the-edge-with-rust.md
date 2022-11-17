---
title: "Sending Emails from the Edge with Rust"
authorHandle: marcoow
tags: rust
bio: "Marco Otte-Witte"
description: "TODO"
og:
  image: /assets/images/posts/2022-10-12-making-a-strategic-bet-on-rust/og-image.jpg
tagline: |
  <p>Edge functions have seen a big rise over the past few years. They allow running code on servers close to your user's locations which minimizes latency. They typically run on V8 which supports WASM which means it's possible to run code written in Rust (and compiled to WASM) on them. When we were looking to move our old service that handled submissions of our [contact form](/contact/) off of AWS Lambda, writing it in Rust and running it on the edge seemed like an exciting option.</p>

image: "/assets/images/posts/2022-10-12-making-a-strategic-bet-on-rust/mainmatter-loves-rust.png"
imageAlt: "TODO"
---

If you want to send emails, you'll typically use a third party service for that.
There's many options that all have their pros and cons – we chose Sendgrid.
Whatever service you end up choosing, they'll provide some kind of HTTP API for
sending emails. In the case of Sendgrid that looks roughly like this:

```bash
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header 'Authorization: Bearer <<YOUR_API_KEY>>' \
  --header 'Content-Type: application/json' \
  --data '{"personalizations":[{"to":[{"email":"john.doe@example.com"}],"subject":"Hello, World!"}],"content": [{"type": "text/plain", "value": "Heya!"}],"from":{"email":"sam.smith@example.com"}}'
```

You send a `POST` request to `https://api.sendgrid.com/v3/mail/send` with a JSON
body that contains the recipient's and sender's email addresses, the subject and
the actual message. The API key that Sendgrid provides and uses to ensure the
request comes from a subscribed user and which one is sent as a bearer token in
the `Authorization` header. The API key is also the only reason really why we
can't just call the Sendgrid API directly from the browser – if we included the
key in the website's source, we'd be making it publicly available and everyone
could use it to send emails via our Sendgrid account.

The JavaScript code that handles submission of our contact form (the `<form>`'s
`submit` event) in the browser looks roughly like this:

```bash
fetch("https://contact.mainmatter.dev/send", {
  body: JSON.stringify(formData),
  headers: {
    "Content-Type": "application/json; charset=UTF-8'",
  },
  method: "POST",
})
```

We're making a POST request to our edge function with the data the user put in
the contact form's field sent as the request body. So in essence, the edge
function acts as a proxy – it translates requests that users' browsers make to
the edge function into requests from the edge function to Sendgrid.

## Cloudflare Workers

As mentioned above, there's quite a few providers to pick from when you want to
run WASM on the edge these days – among others,
[Vercel](https://vercel.com/docs/concepts/functions/edge-functions/wasm),
[Netlify](https://docs.netlify.com/edge-functions/overview/),
[Fastly](https://developer.fastly.com/learning/compute/), and
[Cloudflare](https://developers.cloudflare.com/workers/tutorials/hello-world-rust/)
all have offerings. For our mailer, we chose Cloudflare – their CLI tool
[Wrangler](https://github.com/cloudflare/wrangler2) makes it easy to develop and
deploy your code and hides all of the JavaScript wrapper code that's necessary
to run WASM in V8.

Wrangler can be used to create a new project and will set up the necessary
structure and build configuration. Cloudflare also has the
[`worker` crate](https://crates.io/crates/worker) which provides some handy
concepts that make writing your Rust code easier.

## Implementing the Mailer

_The complete code of our website mailer is
[available on GitHub](https://github.com/mainmatter/mainmatter-website-mailer)._

The basic structure for a mailer service will look something like this:

```rs
use worker::{
    event, Env, Request, Response, Result as WorkerResult, Router,
};

#[event(fetch, respond_with_errors)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> WorkerResult<Response> {
    let response = Router::new()
        .post_async("/send", |mut req, ctx| async move {
            // send email
        })
        .run(req, env)
        .await?;

    response
}
```

We're importing the structs and attributes we need from the `worker` package and
define a main function that responds to `fetch` events (i.e. incoming requests).
Inside of that function, we use the `Router` provided by the `worker` package to
handle requests based on the path and method – in this case we're only
interested in `POST` requests to `/send`.

Since we'll get the message details like the sender's name, email address and
the message text in the request body in JSON, we need to parse that into a
struct. We can use the [`serde` crate](https://crates.io/crates/serde) for that:

```rs
use serde::Deserialize;
use worker::{
    event, Env, Request, Response, Result as WorkerResult, Router,
};

#[derive(Deserialize)]
pub struct Payload {
    pub name: String,
    pub email: String,
    pub message: String,
}

#[event(fetch, respond_with_errors)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> WorkerResult<Response> {
    let response = Router::new()
        .post_async("/send", |mut req, ctx| async move {
            match req.json::<Payload>().await {
                Ok(payload) => // send email,
                Err(_) => Response::error("Unprocessable Entity", 422),
            }
        })
        .run(req, env)
        .await?;

    response
}
```

If deserializing the request body into a `Payload` fails, we simply respond with
status 422. Otherwise we can go on to send the message. Let's look at how that
works:

```rs
use reqwest::Client;
use serde::Deserialize;
use serde_json::json;
use worker::{
    event, Env, Request, Response, Result as WorkerResult, Router,
};

#[derive(Deserialize)]
pub struct Payload {
    pub name: String,
    pub email: String,
    pub message: String,
}

#[event(fetch, respond_with_errors)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> WorkerResult<Response> {
    let response = Router::new()
        .post_async("/send", |mut req, ctx| async move {
            let api_key = ctx.secret("SENDGRID_API_KEY")?.to_string();

            match req.json::<Payload>().await {
                Ok(payload) => send_message(payload, &api_key),
                Err(_) => Response::error("Unprocessable Entity", 422),
            }
        })
        .run(req, env)
        .await?;

    response
}

pub async fn send_message(payload: Payload, api_key: &str) -> WorkerResult<Response> {
    let message = payload.message.trim();
    let message = if !message.is_empty() { message } else { "–" };

    let data = json!({
        "personalizations": [{
            "to": [
                { "email": "contact@domain.tld", "name": "Sender" }
            ]}
        ],
        "from": { "email": "no-reply@domain.tld", "name": format!("{} via domain.tld", payload.name) },
        "reply_to": { "email": payload.email, "name": payload.name },
        "subject": "Message from domain.tld",
        "content": [{
            "type": "text/plain",
            "value": message
        }]
    });

    let client = Client::new();
    let result = client
        .post("https://api.sendgrid.com/v3/mail/send")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .body(data)
        .send()
        .await;

    match result {
        Ok(response) => match response.status() {
            202 => Response::ok(""),
            _ => Response::error("Bad Gateway", 502),
        },
        Err(_) => Response::error("Internal Server Error", 500),
    }
}
```

We extracted the actual logic to send the message into its own function
`send_message`. That function receives the `Payload` as well as the Sendgrid API
key that we get from the worker context (see the
[Cloudflare docs](https://developers.cloudflare.com/workers/platform/environment-variables/)
for information on how to define secrets for workers).

The function constructs the request body to send to Sendgrid (setting a default
message body if it's empty as Sendgrid doesn't allow empty messages) as a JSON
string using the [`serde_json` crate's](https://crates.io/crates/serde_json)
`json!` macro. It then sends the request to the Sendgrid API (we use the
[`reqwest` crate](https://crates.io/crates/reqwest) here but there are other
options as well) and if that's successful with status code 202 (indicating the
message was sent), returns an `ok` response.

**And that's already all there is to it!** Of course, there are some details
left out in this example like
[CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) and logging.
Refer to the
[GitHub repository](https://github.com/mainmatter/mainmatter-website-mailer) for
the complete code but it's not really much more than the above.

## Testing

Having written the above code, of course we'd like to test it as well to ensure
it indeed works correctly and avoid future regressions. Since we're compiling
this to WASM, we cannot simply use Rust's standard `[test]` attribute though but
need to use the [`wasm-bindgen` crate](https://crates.io/crates/wasm-bindgen):

```rs
use wasm_bindgen_test::*;

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser); // run this in an actual browser

#[wasm_bindgen_test]
async fn it_works() {
    // TODO
}
```

To run the tests in a headless Chrome instance, use the
[`wasm-pack` crate](https://crates.io/crates/wasm-pack):

```bash
wasm-pack test --headless --chrome
```

The next challenge is that we don't want the code to actually request the
Sendgrid API and send out real emails. Thus, we need to mock those API calls –
however, the problem there is that the available crates for mocking HTTP
requests do not work in WASM. So we need to find another approach for mocking
out Sendgrid. We can just do that by moving the code we want to mock into its
own function and passing that in to the `send_message` function so we can pass
in a different function in the tests:

```rs
#[event(fetch, respond_with_errors)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> WorkerResult<Response> {
    let response = Router::new()
        .post_async("/send", |mut req, ctx| async move {
            let api_key = ctx.secret("SENDGRID_API_KEY")?.to_string();

            match req.json::<Payload>().await {
                Ok(payload) => send_message(payload, &api_key, &request_sendgrid),
                Err(_) => Response::error("Unprocessable Entity", 422),
            }
        })
        .run(req, env)
        .await?;

    response
}

pub async fn send_message<'a, Fut>(
    payload: Payload,
    api_key: &'a str,
    sendgrid: impl FnOnce(&'a str, String) -> Fut + 'a,
) -> WorkerResult<Response>
where
    Fut: Future<Output = Result<u16, NetworkError>>,
{
    let message = payload.message.trim();
    let message = if !message.is_empty() { message } else { "–" };

    let data = json!({
        "personalizations": [{
            "to": [
                { "email": "contact@domain.tld", "name": "Sender" }
            ]}
        ],
        "from": { "email": "no-reply@domain.tld", "name": format!("{} via domain.tld", payload.name) },
        "reply_to": { "email": payload.email, "name": payload.name },
        "subject": "Message from domain.tld",
        "content": [{
            "type": "text/plain",
            "value": message
        }]
    });

    let result = sendgrid(api_key, data.to_string()).await;

    match result {
        Ok(status) => match status {
            202 => Response::ok(""),
            _ => Response::error("Bad Gateway", 502),
        },
        Err(_) => Response::error("Internal Server Error", 500),
    }
}

pub struct NetworkError;

async fn request_sendgrid(api_key: &str, data: String) -> Result<u16, NetworkError> {
    let client = Client::new();
    let result = client
        .post("https://api.sendgrid.com/v3/mail/send")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .body(data)
        .send()
        .await;

    match result {
        Ok(response) => Ok(response.status().as_u16()),
        Err(_) => Err(NetworkError),
    }
}
```

Here we extracted a function `request_sendgrid` that encapsulates the code that
calls the Sendgrid API and that we don't want to run during tests. The
`send_message` function's signature has been changed so that it accepts a
function argument it will call to make the request. The worker's request handler
in the router simply passes in the `request_sendgrid` function to
`send_message`. So overall, nothing has changed really and everything works
exactly as it did before but in the tests, we can now pass in our own function
that will not actually request the Sendgrid API and return a response right
away:

```rs
use mainmatter_website_mailer::{send_message, NetworkError, Payload};
use serde_json::json;
use wasm_bindgen_test::*;

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
async fn it_works_for_the_happy_path() {
    async fn request_sendgrid(_api_key: &str, _data: String) -> Result<u16, NetworkError> {
        Ok(202)
    }

    let payload = Payload {
        name: String::from("name"),
        email: String::from("email@domain.tld"),
        message: String::from("Hi!"),
    };
    let result = send_message(payload, "api_key", &request_sendgrid).await;

    assert_eq!(result.unwrap().status_code(), 200);
}
```

Using this approach, we can of course also assert that the correct request body
is sent to the Sendgrid API, errors are handled correctly, etc. Refer to the
[GitHub repository](https://github.com/mainmatter/mainmatter-website-mailer/blob/main/tests/send_message.rs)
for the complete test suite.

## Should you do this?

One question that remains is whether Rust/WASM is really needed here. You could
argue this isn't a reasonable use case for Rust/WASM and you'd probably be
right. We wrote a simply proxy service (for which we also don't expect a lot of
traffic) where performance is almost entirely bound by network IO – there's no
computationally expensive processing going on, or your could argue almost no
processing at all – which would typically be the main reason why you'd choose
Rust/WASM. However, [we love Rust](/rust-consulting/) and wouldn't have wanted
to let an opportunity to use it pass unused. So in short, would we recommend
people to implement their mailers in Rust? – maybe not, just using JavaScript
might be simpler. Was it fun writing this – yes, definitely 😍
