---
title: 'How to over-engineer a static page'
author: 'Marco Otte-Witte'
github: marcoow
twitter: marcoow
topic: javascript
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description: 'TODO'
og:
  image: /assets/images/posts/2020-01-19-how-to-over-engineer-a-static-page/og-image.png
---

When we set out to rebuild our own website simplabs.com in 2019, we wanted to
leverage all of the latest and greatest the web platform had to offer to build
the most advanced site we could. That ended up in a pretty big project in the
course of which we spent an unreasonable amount of effort on little details only
to get a tiny bit of better performance. While we cannot recommend anyone doing
everything we describe in this post only to build a static page, we learned a
lot on the way and feel that's worth sharing.

<!--break-->

Our goals for the new website were manifold:

- we wanted to update the rather antiquated design and create a modern design
  language that represented our identity well and would be the foundation for a
  design system that we could build on in the future
- we wanted to keep creating and maintaining content for the site as simple as
  it was with the previous site that was built on Jekyll and published via
  GitHub Pages with e.g. blog posts being managed in markdown files etc.
- although we're huge fans of Elixir and Phoenix we did not want to create an
  API server for the site that would serve content etc. as that would have added
  quite some unnecessary complexity and should generally not be necessary for a
  static site
- we wanted to have best in class performance so that the site would load as
  fast as possible even in slow network situations but also work offline and
  even without JavaScript

While we could have used something like Gatsby, Empress or VuePress to get most
of all of these boxes ticked, being a web engineering consultancy, we saw this
project as an opportunity to build something ourselves and making new
experiences along the way.

## Static Prerendering + Rehydration and CSR

We knew pretty soon that the general approach we wanted to take was to use
client side technology to author the page and to get client side rendering (CSR)
and thus full client-side route changes without additional navigation requests
once the app was running in the browser. We also wanted to statically pre-render
all routes to HTML files at build time so that we could publish the HTML for all
routes from a CDN for a super fast TTFB and FCP.

Since the pages are all static, do not load any data from an API or otherwise
depend on client-side JavaScript to be functional, that meant that TTI would be
the same as FCP. As the HTML response for the browser's original navigation
request that loads the page contains everything that there is on the page, that
would be immediately functional in the sense that all links work right away,
regardless of whether the JS has been loaded/parsed/compiled or not. Once the
application has started up and rehydrated and attached to the pre-rendered DOM,
it would take over handling navigation requestss and handle them fully on the
client side. In that sense, the JavaScript is only progressively enhancing the
static page - if it is running, it handles navigation client-side, if it is not
(yet) running, clicking on any link simply results in a regular navigation
request that will be responded to with a complete HTML document (served via a
CDN) for the respective page.

Since we're huge fans of Ember.js and directly involved in its core team and
with its community, we wanted to stay in the ecosystem to build our own site as
well. While Ember.js is a great fit for ambitious apps that need many things to
be handled though, for a static page like ours where all we wanted was
client-side rendering of some static content on route changes, it would have
been massive overkill. However, Ember.js' very lightweight sister project
Glimmer.js was a pretty good fit for our needs actually. All that Glimmer.js is
is a library for defining, rendering and nesting components that would get
re-rendered when some internal state changes. Bundling that up with a client
side routing library like Navigo we were able to get everything we needed in
only around 30KB of JavaScript. Given that we didn't even require the JS to be
loaded in order for the page to be rendered or ready to use at all, that seemed
pretty good.

### Statically Prerendering

Statically pre-rendering a page at build time is relatively straight forward.
What you do is you build the app, run an Express Server, that serves the app,
visit every route with a headless instance of Chrome using Puppeteer, take a
snapshot of the page's DOM and save that to a respectively named file in the
directory you're then uploading to the CDN so that the HTML files will be used
by that to respond to the respective requests.

In our case, it was a tiny bit more complex than that though. First, when
pre-rendering an app, you might want to do things a bit different than when
running the app in the browser. For example we split our JS into independent
bundles that each contain the content for particular parts of the site (see
below). When running the app in the browser and navigating to a route for which
the respective bundle has not yet been loaded, we simply lazy-load the
respective bundle before actually making the transition into the target route.
When generating the HTML file for that route though, we need to make sure that
that file already contains a script tag for the respective bundle so that the
app can successfully rehydrate in the browser. Another thing is we need to
disable the contact form (which is the only actually interactive thing on our
page that requires the app to run in the browser to work) in the SSR response.

Also, when rehydrating the app in the browser on top of an already existing DOM,
you'll want to make sure that the app attaches to that DOM rather than replacing
it. Otherwise users might see a flash of an empty page which obviously is not a
great experience. In order to achieve that with Glimmer.js, you'd be using 2
different DOM builders, specifically the `DOMBuilder` when running the app for
SSR and the `RehydratingBuilder` when running the app in the browser and
attaching to the pre-rendered DOM. The `DOMBuilder` will put marks into the DOM
that it generates that the `RehydratingBuilder` uses to know how and where to
attach its internals to the existing DOM.

In order to get both of these things, we're not only running an Express server
that serves a pre-built version of the app but we run the app in the Express
server (so in Node) and render its outputs to a String that the Node server then
responds with.

Serving these pre-rendered HTML responses from a CDN for the browser's initial
navigation requests, results in the best FCP and TTI we can possibly get. Once
the application rehydrates and takes over handling route changes in the client,
there will be no additional navigation requests. If the JS has not loaded (yet)
and the app is not running in the browser, we simply fall back to making regular
navigation requests that are again served from a CDN when the user clicks any
links. With our main JS bundle that includes all of the main content of the site
only being around 70KB, this approach seems to combine the best of both worlds
and will have at least comparable performance characteristics to using something
like prefetching which also demands a better network connection as every
subsequent page transition requires another network request while one is
sufficient if **all** of the site's content is already included in the initial
bundle and all subsequent page transitions can be handlded purely on the client
side without loading any more data over the network.

## Maintaining content

Although we were switching to a significantly more advanced setup than what we
had with the previous Jekyll based site, we did not want to give up the easy
maintenance of content, specifically for blog posts that we kept in Markdown
files. Writing a new post should remain as easy as adding a new markdown file
with some front matter and Markdown-formatted content. At the same time, we did
not want to rely on an API for loading the content of particular pages
dynamically as that would have added significant additional complexity and none
of our data actually needed to be computed on demand on the server as all of it
is indeed static and known up front. Leveraging Glimmer.js Broccoli based build
pipeline, we set up a process that reads in all files in a directory and
converts the Markdown files in that into Glimmer.js components at build time.

That means we are generating one component for each post but also the components
that render the list pages that list the blog posts and also the pages that list
posts from a particular author or topic or components that list the newest posts
for a particular topic that get embedded into other pages. Of course we could
not add all these components to the main bundle and grow that to a significant
size as more posts were added (and also invalidating our users' caches for that
main bundle with every new post - more on that below). Instead, we split the
posts into separate bundles that only get loaded on demand as the user navigates
to the respective pages. That way, we do not load a bunch of content for all of
our users that only few will ever look at (in particular blog posts from years
ago are unlikely to be accessed by someone who navigates to the home page).

## Bundling and Caching

When all of a site's content is encoded in JS, that means that JS bundle will
significantly grow over time. In order to avoid that **all** of our users had to
load **all** of the site's content on each visit, we split the bundle into
chunks so that only content that is actually relevant for a particular user gets
loaded. One approach for achieving that is to split individual bundles for all
of the pages in a site but that means that any page transitions that happen
after the app has rehydrated from the initial pre-rendered response will result
in additional requests for loading the bundle that encodes the content for the
particular target page. We knew we did not want that but handle as many page
transitions purely on the client side as we could.

The approach that we actually went with was to define bundle boundaries on usage
patterns and split them along these. Our site now has a multitude of bundles:

- the main bundle that contains Glimmer.js itself as well as all of the main
  site's content; that is about 70KB
- the blog bundle or actually individual bundles for all of the blog's pages
  that only get loaded on demand when the user navigates to the respective
  pages; when the user starts the app on a particular blog page, there even is
  an additional bundle for each individual post that only contains that post so
  that we can reduce the amount of code that is needed to load for a post to a
  minimum
- bundles for rarely accessed pages like Imprint and Privacy Policy that have a
  significant size but only contain content that is only rarely accessed
- additional bundles for more frequently changing content like the Calendar or
  Talks pages; the components for those pages are generated on demand from a set
  of Markdown files at build time, similar to the blog
- a bundle that contains only the _"recent posts for this topic"_ component that
  gets displayed on pages for the particular topic

### Bundles and Caching

Another factor to take into account when defining bundle boundaries is the
stability of bundles, basically how often they are going to change over time.
Our main bundle that contains Glimmer.js and the site's main content is
relatively stable and will typically be cacheable for long. If we had included
e.g. all of the blog posts in our main bundle we would not only have
significantly grown the main bundle but also invalidated our users's caches for
that bundle every time we released a new blog post. The same is true for the
mini bundle that contains a component that renders a list of recent posts for a
particualr topic. As that component is always needed along with components that
live in the main bundle as it is rendered on the respective pages, we could have
included it right with the main bundle, but that would likewise have meant
invalidating the main bundle with every blog post which is wasteful.

By defining bundle boundaries along usage patterns and keeping each bundle's
conttent's stability in mind, we are able to significantly improve the
likelihood for someone that has been cached in our user's browsers (or
elsewhere) to be reusable the next time they need it.

### Caching Strategies

As described in the previous paragraph, we optimized our bundles for
cachability. Since we also use fingerprinted asset names (or acutally get these
for free out of the box since Glimmer.js uses Ember CLI), we can let our user's
browsers every resource they ever load indefinitely using immutable caching:

```
cache-control: public,max-age=31536000,immutable
```

The `immutable` caching directive tells the browser that the respective resource
can never change and may be cached indefinitely. The `max-age` directive is only
necessary as a fallback for browsers that
[do not support immutable caching](https://caniuse.com/#feat=mdn-http_headers_cache-control_immutable).
An immutable resource that the browser has cached will be available instantly on
the next visit to the respective page and should generally have the same
performance characteristics as a resource cached in the service worker's cache.

### Service Worker

Of course we also have a service worker that caches all of the page's resources
to further improve the caching and make the full page available even when the
user is offline. When the application starts up in our user's browsers and the
service worker is not yet active, we load and cache all of the page's resources
in the service worker cache. That means that even some of the pages' content is
split into separate bundles, when the user navigates to such a page, the
respective bundle is likely to have been loaded by the service worker already
and will be served from its cache, avoiding an actual network request and making
the respective page transition instant.

If we actually loaded **all** of the page's content on startup though that would
mean we'd be loading **a lot** of content including quite a bit of content that
none or only very few of our users would ever need, for example blog posts from
a few years ago. In order to avoid that, we only load the blog bundles when a
user navigates to the respective page of the blog. Any blog pages the user has
not yet navigated to will not be loaded and thus not mess with the user's hard
disk space (and making it more likely our entire service worker cache would get
pruned actually).

When using service workers on a site with statically pre-rendered HTML, there is
a caveat when it comes to handling the HTML request for a particular path in the
servie worker when the user's device is offline. Since every route on the page
has its own HTML page that contains precisely the content for that page, not all
HTML requests can be served with the same response from the service worker.
Since the JS bundle will be served from the service worker as well when the page
starts offline, serving a pre-rendered HTML document is not necessary though.
Instead, we can simply serve an empty HTML document (like in the classic way of
serving SPAs where all you send to the browser is an empty HTML page with some
script tags) which we keep separately from the pre-rendered documents. That page
only has a

```html
<div id="app"></div>
```

that the application will render into. Since we're using Glimmer.js'
`RehydratingBuilder` when rehydrating the application from a pre-rendered
response which we cannot use in this case, we add a `data-has-ssr-response`
attribute when pre-rendering so that we can know whether we are rehydrating or
rendering fresh in the client.

## More

All of the above has lead to a result we are pretty happy with. While the design
of our new page is for everyone to judge based on their own taste maybe, the
performance numbers speak a clear language.

TODO: numbers, lighthouse, webpagetest.org

We were able to get there without giving up on the ease of maintenance of the
content where writing a blog post simply means adding a Markdown files and
opening a pull request on github (TODO: link to the PR for this).

Of course we spent an unreasonable amount of time during the course of the
project which we cannot recommend anyone does but since we're a web consultancy,
what could be a better opportunity to do that than our own website? There are
many more things that we did (and some of them we didn't even do yet) and that
are key for building a cutting-edge website:

- CSS: CSS can grow to a significant size easily and it is render blocking which
  is a good reason to pay attention to it and make sure it is as optimized as
  possible; we used css-blocks which is great but worth a blog post of its own
- images and their formats are a huge topic as well and there are many low
  hanging fruits where simple changes can have a significant positive impact on
  your site's performance; things like inlining SVGs, using progressive JPGs or
  base64-encoded background images that get swapped out with the real image
  after page load area as relevant as using progressive images to avoid huge
  payloads on small viewports
- third-parties can have a significant negative impact on a site's performance
  and should generally be avoided
- having the right tooling in place is key to keep track of where you are, what
  impacts your changes have and things you might be doing wrong; you could have
  Lighthouse integrated into your Github Pipeline (ideally for every route of
  the app), jobs that tell you how much weight a change adds to which bundles
  and which bundles it invalidates etc.
- knowing is better than not knowing and if you really care about your site's
  performance you need to measure using RUM methods

TODO: last words
