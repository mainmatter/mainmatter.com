---
title:
  "Setting up OAuth with Auth.js in a SvelteKit project for local development"
authorHandle: lolmaus
tags: [svelte, sveltekit, oauth, authjs]
bio: "Andrey Mikhaylov (lolmaus)"
description:
  "Andrey Mikhaylov (lolmaus) provides a step-by-step guide for setting up OAuth
  authentication using the Auth.js libry in a SvelteKit project. He describes a
  number of pifalls that may be a source of frustration even to experienced
  developers, due to error messages being unhelpful — and explains how to get
  around them."
og:
  image: /assets/images/posts/2023-07-03-from-react-to-ember-building-a-blog/og-image.jpg
tagline: |
  <p>OAuth can be notioriously difficult to set up, despite libraries and documentation available. The challenge lies not in code, but in wiring all the bits and pieces together. In the absence of a step-by-step guide, all attempts to set it up may fail to a very obscure error. Now you have such a guide for this particular combination: Auth.js + SvelteKit.</p>

image: "/assets/images/posts/2023-07-03-from-react-to-ember-building-a-blog/header-illustration.jpg"
imageAlt: "The Ember logo on a gray backround picture"
---

## What is OAuth

For the sake of completeness of this article, let’s pretend you don’t already
know. ;)

In simplest words, OAuth is an approach for letting users log into your app
without having to come up with a username and password. Instead, you rely on
them being already authenticated with a popular third party service that offers
OAuth (OAuth provider), such as Google and GitHub.

To do so, your app redirects the user to an OAuth provider. The user approves
authentication there, and the provider redirects back into the app, which ends
up authenticated.

I will not into more details about how OAuth works beyond and absolute minimum.
There are plenty of articles on the internet that let you understand this topic
with a desired level of depth.

## Gotcha 0: authentication vs authorization

There’s a lot of confusion around these terms.

From an academic perspective, “authentication” means verifying who the user is,
and “authorization” is verifying if the identified user is permitted to access
something.

A nice analogy is attending a regulated facility. In order to get in, you first
need to visit a Pass and Registration Office. You show them your id and they
issue a daily pass for you. Now you can enter, and every time you need go
through a security checkpoint, you present your daily pass to a security guard.
The security guard would make sure that the pass is still valid and they might
even call the Registration Office to run your pass through their database.

In this analogy, presenting your id to the Pass and Registration office is
“authentication”. Presenting your daily pass to a security guard is
“authorization”. Offices behind security checkpoints are API endpoints.

The problem is that in practice people don’t really distinguish between
“authentication” and “authorization” that much. You can find these terms used
interchangeably, without a second thought.

People who know there’s a difference between the two terms but aren’t sure which
one is appropriate in which context, have a loophole: simply say “auth”! 😬 The
fact that the word “auth” perfectly fits any article and library documentation,
proves that the two terms are interchangeable _in practice_.

## Gotcha 1: “OAuth” means OAuth 2

There are two versions of the OAuth protocol which are incompatible with each
other. The modern version is OAuth 2, naturally. That’s what everyone uses.

When OAuth is mentioned and the version is not specified, it normally means
OAuth 2. This article does too.

## Gotcha 2: OAuth authentication flow types

The OAuth standard offers a choice of four authentication flows:

- **Client credentials** flow — implies passing a key and a secret, useful for
  server-to-server interactions, such as CI, CLI, etc.
- \***\*Device authorization\*\*** flow — uses a separate device for user
  authorization, such as a mobile phone. Useful for authenticating devices that
  have limited user interface: servers, smart TVs, etc.
- **Implicit** flow — a simple flow, useful for classic frontend-less apps that
  render HTML on the backend. Should not be used with a frontend, as it would
  required storing the app secret code in localStorage, which is unsafe.
  Considered obsolete.
- **Authorization code** flow — a more involved flow, best suited for web apps.
  The app secret code is safely stored on the backend, the access token can be
  stored on the backend too.

We’re gonna be doing the **authorization code** flow.

## Gotcha 3: you need a backend!

OAuth authentication cannot be implemented in a frontend-only app, such as an
SPA deployed to GitHub Pages and not having any backend.

This is because the app needs to pass a secret token (essentially, a password)
to the OAuth provider, so that the provider recognizes the app. If you added
this secret token into the frontend, it would be accessible from the browser to
everyone on the internet. A malefactor would be able to extract it and implement
a fake copy of your app that authenticates users for real, stealing their auth
tokens. As a result, the malefactor would be able to access your app as another
user.

For this reason, your frontend app must delegate the actual authentication to
your backend. It’s your backend that safely stores the secret token and passes
it to the OAuth provider.

Luckily, SvelteKit can work as a full-stack app, with a frontend and a backend!

## Gotcha 4: the authorization code flow can be implemented in different ways

If you search the internet for diagrams explaining the OAuth authorization code
flow, you’ll notice that they all vary in small details.

This is because this flow can be implemented in different ways.

For example, one could enable a frontend-only app to authenticate with OAuth by
setting up a tiny backend microservice such as
[prose/gatekeeper](https://pikabu.ru/story/myerilin_monro_10493776) (that you
can even deploy to Heroku for free!) that will be used for one purpose: storing
your app’s secret and passing it to an OAuth provider when requested. This
approach is not very secure, though, as the access token will have to be stored
in localStorage in the browser, unencrypted and easily accessible to physical
users and scripts on the same domain.

Many apps and libraries employ JWT tokens. They would store the access token
securely on the backend side, but the session token used to authorize requests
from their frontend to their backend is still stored in localStorage. Some
developers and security professionals believe this to be insecure.

Auth.js does not use JWT tokens. It stores the access token (used to authorize
requests to third party APIs such as GitHub or Google) on the backend side and
uses a Secure, HttpOnly cookie to store a session token (used to authorize
requests to your own backend). Such a cookie can only be intercepted at the
moment of issuing. Once set, it cannot be accessed or copied from browser Dev
Tools or JS scripts. This substantially improves security.

## **OAuth Authorization Code Flow with Auth.js**

This diagram is different from any other OAuth flow diagram on the internet. It
precisely reflects the flow that Auth.js specifically is using.

![authorization code flow diagram](/assets/images/posts/2099-01-01-setting-up-oauth-with-auth-js-and-sveltekit/authorization-code-flow-diagram.png)

1. **The user opens your frontend in their browser.**

2. **The user clicks the "Sign in with GitHub" button.**

3. **Your frontend makes a POST request to your backend** to
   `http://my-app.example.com:5173/auth/signin/github`.

4. **Your backend makes a 302 redirect to GitHub** to:
   `https://github.com/login/oauth/authorize`, passing a number of query params,
   including:

   - `scope` of permissions to request;
   - `client_id`: the id of your app at GitHub;
   - `response_type=code` — the type of OAuth flow to use
   - `redirect_uri=http://my-app.example.com:5173/auth/callback/github`: your
     backend endpoint to redirect to.

5. **The user authenticates with GitHub** using email and password, if they
   haven't already.

6. **The user authorizes your app to authenticate with GitHub,** if they haven't
   already.  
   Yeah, it's a bit of a
   [Pimp My Ride](/assets/images/posts/2099-01-01-setting-up-oauth-with-auth-js-and-sveltekit/xzibit.jpg)
   type of situation. 😅

7. **GitHub makes a 302 redirect to your backend** to
   `http://my-app.example.com:5173/auth/callback`, passing a `code` query param
   containing a temporary authorization code.

8. Two things happen in parallel here:

   - The browser waits for your backend to respond.
   - **The backend makes a direct request to GitHub**, passing the temporary
     authorization code along with the app's id and secret codes. The browser is
     not involved with this request.

9. GitHub verifies the id and secret of your app, as well as the temporary
   authorization code.  
   **GitHub responds to your backend with an access token.**
10. **Your backend responds to the broswer with a 302 redirect** to a page where
    the user is supposed to land, e. g. `http://my-app.example.com:5173`.  
    Here the backend sets a secure HttpOnly cookie containing a session token
    that your frontend will use to authorize requests to your backend.
11. **Your frontend takes over** as the browser loads the page.  
    It can now use the cookie to authorize requests to your backend.  
    Requests to GitHub APIs are performed through your backend.

The curious thing to note here is that the authorization code seems redundant.

Normally, the authorization code is used as a measure to prevent the frontend
from knowing the app secret and the access token.

But the way Auth.js implements the flow, the OAuth provider never responds to
the fronted, only to the backend. This means that steps 7 and 8 could
hypothetically be skipped.

Why has OAuth implmented the flow with the authorization code? Many OAuth
providers do not support the Implicit flow for web apps because it’s potentially
insecure and only offer the Authorization code flow, so that’s what Auth.js is
doing.

## Gotcha 5: you should “create” a separate “app” with each OAuth provider for every deployment environment

In order to let your app authenticate with an OAuth provider, you must access
the provider’s admin panel and “create an app” in it. This will provide you with
an ID and secret token for your app to use.

Keep in mind that you need to “create” a separate “app” with the provider for
each deployment environment, e. g. local development, staging and production.
You will end up with three or more sets of app ids and secret tokens.

## Gotcha 6: you need a domain for local development

When you run the SvelteKit server for local development, it offers you this url:
`http://localhost:5173``.

The problem with it is the `localhost` domain is not unique and some OAuth
providers would refuse to work with it.

On top of that, building more than one app on `http://localhost:5173` is an
inconvenience, since cookies and localStorage entries mix up, forcing logouts
and invalid state.

For these two reasons, you should use a unique domain that points at `127.0.0.1`
or `::1` (note that multiple domains can do so).

You could use a subdomain of your business domain, such as `local.my-app.dev`,
but there’s another problem with it.

## Gotcha 7: some OAuth providers refuse to work with unencrypted http

The `http` protocol is inherently insecure and some OAuth providers would refuse
to work with it.

That’s a problem because setting up `https` encryption certificates for _local
development_ is a tedious hassle, as it requires either paying for certs, or
using short-lived free ones.

There’s a loophole, though! Use a subdomain on the `example.com` domain, e. g.
`my-app.example.com`.

Google, for example, refuses to work with `http://local.my-app.dev` because of
insecure protocol, but makes an exception for
`http://my-app.[example.com](http://example.com)`, as the `example.com` domain
is dedicated for testing and development purposes and can’t harm any users.

Google would also reject URLs on made-up top-level domains.

## How to create a subdomain on example.com

Of course, you can’t register a custom subdomain on the public `example.com`
domain for everyone to resolve. But you can fake it for local development.

To do so, locate the system-wide `hosts` file in your operating system, open it
for editing with superuser rights and append like this:

```julia
{% raw %}127.0.0.1 my-app.example.com
127.0.0.1 my-other-app.example.com    # you can do more than one if needed
{% endraw %}
```

Changes should become effective immediately on save — on your machine only.

## What’s Auth.js

[Auth.js](https://authjs.dev) is a library that aims to be a universal
authentication layer for JS frontend and full-stack apps.

It started as NextAuth, built specifically for the Next.js framework
(full-stack, React-based), but later was converted into a universal library.

## Gotcha 8: Auth.js is evolving

As of 2023, the library is relatively new. It’s core is more or less stable, but
its SvelteKit integration claims to be under active development.

The implication is that it may receive breaking changes. In order to upgrade to
future versions you will need to follow the upgrade guide or release notes to
rewrite some of your code accordingly.

Keep that in mind.

## Configuring GitHub

1. Visit https://github.com/settings/developers and click `New OAuth app`.
2. Fill in the form, using the following URLs:
   - Application name: `My App (dev)`
   - Homepage URL:
     [http://my-app.example.com:5173](http://fox-and-hound-dev.local:5173/)
   - Authorization callback URL:
     [http://my-app.example.com:5173/auth/callback/github](http://fox-and-hound-dev.local:5173/auth/callback/github)
3. On the next screen, copy the `Client ID` to your password manager.
4. Click `Generate a new client secret`. Copy the resulting secret token to your
   password manager. GitHub will not let you see it again!

Reference documentation for Auth.js GitHub Provider:
https://authjs.dev/reference/core/providers_github

## Configuring Google

1. Visit https://console.cloud.google.com/ .
2. In the top-left corner of the pae, expand the list of projects and click
   `New project`. Type `My App (dev)` and click `Create`.
3. On the `Credentials` tab, click `Create credentials` → `OAuth Client ID`.
   Then Select `Web application`.
4. Visit `APIs and Services` → `OAuth Consent Screen`
   https://console.cloud.google.com/apis/credentials/consent and change the
   `Publishing status` of your app to `Testing`.
5. Visit `APIs and Services` → `Credentials`
   https://console.cloud.google.com/apis/credentials
6. Click `Add URI` for `Authorized Javascript Origins`, use this value:
   [http://my-app.example.com:5173](http://fox-and-hound.example.com:5173/)
7. Click `Add URI` for `Authorized redirect URIs`, use this value:
   http://my-app.example.com:5173/auth/callback/google
8. Copy `Client ID` and `Client Secret` from the right sidebar to your password
   manager. If no `Client Secret` exists, create one.
9. Save.

Reference documentation for Auth.js Google Provider:
https://authjs.dev/reference/core/providers_github

## Gotcha 9: automatically generated routes

Note that routes under `/auth` such as:

- `/auth/callback/[provider]`
- `/auth/signin`

…are routes automatically generated by `@auth/sveltekit`. You don’t need to
define them.

The former is a backend route where OAuth providers should redirect the user to.

The latter is a frontend route containing sign-in buttons for OAuth providers of
your choice. The HTML/CSS of buttons will be generated for you by the package.

## Configuring SvelteKit

Now we know all we need to set up OAuth in SvelteKit. Let’s proceed.

### 0. Set up a SvelteKit codebase

…if you haven’t already.

```sh
{% raw %}npm create svelte@latest my-app
cd my-app/
npm i
{% endraw %}
```

I’ll be using `my-app` as the name of the project and the subdomain. Substitute
it for your app’s name.

### 1. Install Auth.js

```sh
{% raw %}npm i -D @auth/core @auth/sveltekit
{% endraw %}
```

### 2. Set up environment variables

Edit the `.env` file in the root of your project, it should look like this:

```bash
{% raw %}AUTH_SECRET=77d597e9f8df83cfd5d8faef39f85e64213315ec2b38ef867a1b76f7585f5dda
AUTH_TRUST_HOST=true
GITHUB_ID=686fcbc5d5f00215ad9d
GITHUB_SECRET=1aafbc3a1f485cfaf5927753aaf54f58962b984d
GOOGLE_ID="5af337fd1334-139f9327d891dc5e9686a0d75b5f5662.apps.googleusercontent.com"
GOOGLE_SECRET="5E17CA-3250e5657D80d848eAa65954822C"
{% endraw %}
```

- `AUTH_SECRET` should be a random string. It’s used to encrypt tokens exchanged
  between your frontend and your backend. Sadly, it’s not used to encrypt the
  OAuth access token, since an OAuth provider should be able to read its
  unencrypted value. It should be at least 32 alphanumeric characters long, the
  longer the better. You can generate a random string with this console command:
  ```bash
  openssl rand -base64 32
  ```
  If you don’t have `openssl`, you can generate a random string online
  [here](https://generate-secret.vercel.app/32). That’s theoretically insecure,
  but should be fine for pet projects.
- `AUTH_TRUST_HOST` must be `true` for all enviromnents except Vercel
  deployments.
- `GITHUB_ID` — the id of your “app” on GitHub.
- `GITHUB_SECRET` — the secret token of your app on GitHub. Note that GitHub
  will only show it once! Don’t lose it or you’ll have to rejenerate it.
- `GOOGLE_ID` — the id of your “app” on Google.
- `GOOGLE_SECRET` — the secret token of your app on Google.

### 3. Create a server hook to initialize AuthJS

Create `src/hooks.server.ts`:

```jsx
{% raw %}import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import GoogleProvider from '@auth/core/providers/google';
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private';

export const handle = SvelteKitAuth({
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		GoogleProvider({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
	],
});
{% endraw %}
```

VS Code with the official Svelte
[extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
installed will automatically recognize the existence of `$env` imports when you
start the SvelteKit dev server with `npm run dev`.

If you already have a `handle` hook, you should use the
[sequence](https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks-sequence)
function to combine two hooks into one.

### 4. Load the session from your backend

In `src/routes/+layout.server.ts`:

```jsx
{% raw %}export const load = async (event) => {
	return {
		session: await event.locals.getSession()
	};
};
{% endraw %}
```

### 5. Use the session in your frontend

In `src/routes/+layout.svelte` or whateve layout or page you need it in:

```html
{% raw %}
<script>
  import { page } from "$app/stores";
</script>

{#if $page.data.session} {#if $page.data.session.user?.image}
<span
  style="background-image: url('{$page.data.session.user.image}')"
  class="avatar"
/>
{/if}

<span>
  <small>Signed in as</small>
  <br />
  <strong>
    {$page.data.session.user?.email ?? $page.data.session.user?.name}
  </strong>
</span>

<a href="/auth/signout" class="button" data-sveltekit-preload-data="off">
  Sign out
</a>
{/if} {% endraw %}
```

### 6. Add a sign-in button

Add the `{:else}` clause to `{% raw %}{#if $page.data.session}{% endraw %}`:

```html
{% raw %}{:else}
<span class="notSignedInText"> You are not signed in </span>

<a href="/auth/signin" class="buttonPrimary" data-sveltekit-preload-data="off">
  Sign in
</a>
{/if} {% endraw %}
```

Note that `/auth/signin` is a route automatically generated by
`@auth/sveltekit`. You don’t need to define it.

### 7. Protect a route from anonymous access

Any page such as `src/routes/protected/+page.svelte`:

```html
{% raw %}
<script>
  import { page } from "$app/stores";
</script>

{#if $page.data.session}
<h1>Protected page</h1>
<p>
  This is a protected content. You can access this content because you are
  signed in.
</p>
<p>Session expiry: {$page.data.session?.expires}</p>
{:else}
<h1>Access Denied</h1>
<p>
  <a href="/auth/signin" data-sveltekit-preload-data="off">
    You must be signed in to view this page
  </a>
</p>
{/if} {% endraw %}
```

Alternatively, you can redirect from a `+layout.server.js`, which arguably
provides better access management. See
[this StackOverflow question](https://stackoverflow.com/q/74017730/901944) for
possible ways to do it.

### 8. ???

### 9. You’re breathtaking!

Run your dev server with `npm run dev` and try it out.

If you have wired everything correctly, it should work!

## Demo app

`@auth/sveltekit` has an official demo app:

- Live:
  [https://sveltekit-auth-example.vercel.app](https://sveltekit-auth-example.vercel.app/)
- Source: https://github.com/nextauthjs/sveltekit-auth-example

## Next steps

The goal of this article is to help you connect all the parts together to
bootstrap your OAuth adventure.

Some of aspects not covered are:

- refresh tokens;
- deployment to production;
- customizing the looks of sign-in buttons, overriding Auth.js routes.
