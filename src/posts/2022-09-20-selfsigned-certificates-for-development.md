---
title: "Self-signed certificates for local HTTPS made easy"
authorHandle: pichfl
twitter: pichfl
tags: misc
bio: "Florian Pichler"
description: |
  Retrieving certifcates to serve your local development on HTTPS can be cumbersome. Use mkcert to automate the process, here is how.
og:
  image: /assets/images/posts/2022-09-20-selfsigned-certificates-for-development/og-image.png
tagline: |
  <p>Serving HTTPS locally for development is annoying. Use mkcert and get started in minutes.</p>
image: "/assets/images/posts/2022-09-20-selfsigned-certificates-for-development/signed.jpg"
imageAlt: "A grid of lockets representing a safe connection in your browser"
---

While working on a recent client project I had to test for secure cookies and to
do so needed to test on an HTTPS connection.

Serving HTTPS locally is a function built into most web servers and frameworks,
but the tricky part is to get the necessary certificates. You can generate these
by hand, but there is a better way.

Instead of getting your hands dirty with `openssl` and such, meet a little
helper called [mkcert][mkcert].

[mkcert]: https://github.com/FiloSottile/mkcert/

Not only does it streamline the process of creating self-signed certificates
that are great for development, but it also does away with the warning about
said certificates by automatically installing a locally-trusted root certificate
to your machine and integrating it with your browsers, giving you that nice
little green lock for confident client presentations.

It's nice because it just works and even more so, it works on macOS, Linux, and
even Windows. Follow the instructions in the projects [README.md][readme] and
you're ready.

## Use `mkcert` with [ember-cli][ember-cli]

Since the project I was working on happens to be built with Ember.js, here is
how you use it together with its CLI.

### Step 1: Enable SSL in ember-cli

`ember serve` supports `--ssl`, `--ssl-key` and `--ssl-cert` to set all
necessary input through the command line, but I would recommend generating the
keys in the place it expects them to reduce clutter.

If you generate the necessary files in `./ssl` where ember-cli expects them by
default, you only need to add the `--ssl` flag.

If you want to serve your project with SSL all the time, you can even put
`"ssl": true` inside your `.ember-cli` configuration file, removing the need for
the flag.

Adding the `ssl-key` and `ssl-cert` paths there would work as well, but I think
the default location is fine, so we will continue with that.

### Step 2: Generate all necessary files

We need to generate the `.crt` and `.key` files, as well as make sure that their
location will be created when cloning the repository whilst ensuring that the
actual files are never committed.

```bash
# ember-cli looks for key files in ./ssl relative to the project root
mkdir ./ssl
# Make sure this folder shows up in git
touch ./ssl/.gitkeep

# Add the certificates to your .gitignore file
# Do not commit them to your repository
echo -en '# Ignore self-signed certificates created by mkcert\n /ssl/server.crt\n/ssl/server.key\n' >> .gitignore
```

Now you can run `mkcert` to create your certificate. Consider making this
command a run script by adding it to the `scripts` section in your
`package.json`, or creating a shell script file from it that can be added to
your repository. If you don't want to do either, you should consider documenting
it in your `README.md` at least.

```bash
# Add additional hosts separated by spaces after localhost if necessary
mkcert -install -cert-file ./ssl/server.crt -key-file ./ssl/server.key localhost
```

### Step 3: Profit

Your frontend application is served on `https://localhost:4200` now, allowing
all the things you would expect from a properly SSL encrypted server connection
and in turn, allowing you to replicate and debug real-world situations with
ease.

## Use `mkcert` with [fastify][fastify]

When I need to create a quick API and don’t want to use [Rust with
Actix][actix], I often find myself reaching for fastify. It's a lot like the
Express.js used by ember-cli internally, but has a few nice extras and I
happened to have used it recently.

If you want to serve HTTP/2 over HTTPS for your fastify API, you will also need
the certificates.

[The documentation for this][fastify-https] is quite straightforward. The
example there expects `fastify.key` and `fastify.cert` in a `https` folder.

Consider the following structure in your project:

```
|- src
   |- main.js
|- https
   | .gitkeep
```

```js
// src/main.js
const fs = require("fs");
const path = require("path");
const fastify = require("fastify")({
  http2: true,
  https: {
    allowHTTP1: true, // fallback support for HTTP1
    key: fs.readFileSync(path.join(__dirname, "..", "https", "fastify.key")),
    cert: fs.readFileSync(path.join(__dirname, "..", "https", "fastify.cert")),
  },
});

// this route can be accessed through both protocols
fastify.get("/", function (request, reply) {
  reply.code(200).send({ hello: "world" });
});

fastify.listen({ port: 3000 });
```

Generate the mentioned files like this:

```bash
mkcert -install -cert-file ./https/fastify.cert -key-file ./https/fastify.key localhost
```

You can now run `node ./src/main.js` and visit `https://localhost:3000` with SSL
encryption and your local browser will show a green checkmark as well!

## Caveats

First, you must never share the `rootCA-key.pem` file created by `mkcert` with
anyone. It must not leave your computer as it would give an attacker power to
intercept any secure request to your machine. Handle with care.

Second, the root certificate is what makes your browsers accept the self-signed
certificates created by `mkcert` as valid. That means, only _you_ alone get the
benefit of the green lock in _your_ browser. Sharing your development server
with someone else on your network or even trying to use them in a public
scenario would lead to browsers warning visitors about invalid certificates.

Do not use this in production. It's a neat thing that helps you get your job as
a developer done, but once you move to production, you should look for other
options.

One of those options would of course be [Let's Encrypt][letsencrypt].

Yes, you could also use that locally, but from my experience, if you are looking
for a quick way to run a local development server with SSL, [mkcert][mkcert]
really works like a charm.

[actix]: https://actix.rs/docs/http2/
[ember-cli]: https://cli.emberjs.com/
[fastify-https]:
  https://www.fastify.io/docs/latest/Reference/HTTP2/#secure-https
[fastify]: https://www.fastify.io
[letsencrypt]: https://letsencrypt.org
[readme]:
  https://github.com/FiloSottile/mkcert/blob/master/README.md#installation
