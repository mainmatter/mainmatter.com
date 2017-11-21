---
layout: article
section: Blog
title: SSR for SPAs and PWAs
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

TODO: intro

#### The Status Quo of serving SPAs

While Single Page Apps (SPAs) enabled a new category of applications and user
experiences in the browser some years ago, in the majority of cases, loading an SPA
in the browser is still a suboptimal experience. As
the application completely runs in the user's browser, the HTML file that the user loads when accessing
the application for the first time (and usually on repeat visits as well) is mostly empty and only
contains a few `script` and `link` tags which means that while these assets load, get parsed and compiled,
the user sees this:

(empty browser window)

Although the app shell model and Progressive Web Apps (PWAs) will take user's experiences
interacting with client side web applications to the next level, they only offer rather small improvements to
this exact problem - more on that later though.

Serving an empty response for the initial request is not ideal for several reasons:

* perceived load times: while users are waiting for the app's assets to download which might take a long time depending on the size of the app, the way it is served and also on the quality of the user's network connection, they don't have any indication of whether anything is happening at all and might even think the app could be broken. Even if you serve an HTML with a loading indicator the experience is somewhat lame.
* no useable response for any client that can not or will not process JavaScript: I'm not referring to your weird friend who compiles their own Gentoo, uses Mutt as their email client and browses the web with JS turned off but to clients like the FaceBook website snapshot tool that will take a snapshot of your site when someone posts a link to it to their timeline
* SEO: while Google's bot has been executing JavaScript for a few years now and is well able to index SPAs, there is still a penalty you're paying if the HTML your server responds with is empty except for a few tags that load external resources which then boot up the application on the client side. This is mostly due to the fact that this process takes some time and your site's content is simply available later than if it had been in the HTML your server responded with to the initial request and lower speed is still ranked lower by google.

If instead of serving an empty HTML file or one that only contains a loading indicator to give the user an indication something is happening, we could run the otherwise client side application on the server side, render the same UI that the browser would render and respond with the HTML of that, we could improve the user's experience dramatically and also enable clients that can or will not execute JavaScript to have full access to our sites' content. This is exactly what we all had been doing until a few years ago - Server Side Rendering (SSR). The only difference to the way we were doing it back then is that instead of building all of the client side code on the server side we are taking our client-side application and move it back to the server side so that we can run it there **as well as** in the client.

#### Sample App

As we will discuss aspects of SSR throughout this article (and follow-up ones) we will be looking at an example app to better illustrates problems and concepts for solving them. The example app is going to be a hypothetical one that implements a mobile ticket counter for bus tickets. Users will typically reach the app on the search form where they specify origin, destination and travel date (ignoring return tickets etc. for the sake of simplicity):

(search form)

After submitting their search will get to a results routes that shows all the different connections:

(results list)

Once they picked a particular connection on the results route, they go through a payment process (which we ignore as well for the sake of simplicity) until they get to the route that shows their ticket and some additional information.

#### SSR Benefits

Using the above example app we'll look at a few different ways, adopting SSR can help dramatically improve the user's experience.

##### Improving perceived load times

Load times of (especially mobile) SPAs can sometimes be slow and improving them is hard work. There is also such a thing as a perceived load time though which refers to the fact that the same actual load time but feel shorter or longer depending on the kind of feedback users receive while waiting.

As shown above, the typical feedback users receive while waiting for a SPA to load is this:

(empty screen)

If you go one step further, you might add a simple loading indicator to that to at least give some feedback that the application is loading and not actually broken. So you might end up with something like this:

(screen with loading indicator)

OR you might adopt the app shell model and respond with an HTML document that renders a very raw version of the app's UI to give the user an idea of what the loaded and booted app will look like:

(screen with app shell)

Or you might have an SSR solution running that executes the app on the server side and renders the exact same document that the user will see once the application has loaded and started up in the browser:

(search form)

As you see, this is the exact same UI as the final search form so that users get to see the full UI of the application right away while their waiting for the app to start. As the UI is not actually functional at this point though as the JavaScript that backs its functionality in the browsers is not yet available, you'd typically indicate that in the UI somehow:

(search form with loading state)

So while users are not able to use the UI just yet, they can already see what the functionality is, read instructions, think about what to enter once everything is ready etc. All of the visible UI will distract the user from the fact that actually they are still waiting for the app to be ready.

##### Giving access to content early

While in the case of the search form, the pre-rendered repsonse mostly improves the perceived load time and makes the app feel quicker, there are a lot of cases where the pre-rendered response can already be valuable to users although it is not yet functional. Assume you're sent a link pointing to the result list for a particular search, e.g. https://… there is a big difference whether this is the initial response to that link

(loading state)

or this:

(result list in loading state)

The former does not provide any useful information while the latter shows everything that's important on the page immediately so you can compare available connections and once you're ready to pick one the app is likely to have loaded and booted so that picking a connection will actually work by then.

Immediate access to content is typically one of the benefits of SSR that's mentioned when talking about content sites like bustle.com (who were one of the earliest adopters of the concept) but there are plenty of other scenarios in which it can provide a major benefit like this example shows.

Immediate access to your site's content is also what solves all SEO worries of course. Instead of the Google Bot having to wait until the JS app has started and built the document until it can index your content it can index the document it receives from the server for the initial request just like for normal, server rendered sites.

##### Meaningful responses for non-JS speaking clients

As discussed above, SSR also allows serving meaningful content to clients that can not or will not execute JavaScript, like FaceBook's or Twitter's snapshot tools. Instead of posts with links to your site on FaceBook looking like this

(bad example)

users will see meaningful previews of your site:

(good example)

In fact you can even `curl` your site now:

(example)

#### SSR vs. Pre-generating static files

SSR is sometimes hard to set up, getting to work reliably and maintain. An alternative solution that some prefer is generating static HTML files at build time. While this works for some cases and can be simpler than running the full client side app in Node, it has an important differences to SSR that is important to understand:

As pre-generation of static files runs once at build time or deploy time, the generated pages cannot in any way be tied to a particular user context, may it be an authenticated user, a language based on the `Accept-Language` header or a preferred currency that is read from a cookie.

While that works in some cases, it does not work in others. Trying to somehow pre-generate pages for a number of different scenarios (e.g. pre-generating the same page for a number of languages etc.) might be possible but can easily result in a maintainability nightmare in the long term. For many cases it is just not possible as rendering the page depends on data returned by an API or there is a virtually infinite number of pages that is just not possible to pre-generate (e.g. as would be the case for the result list of the example app).

#### SSR and PWAs

As stated above, PWAs try to solve one problem that SSR solves as well and that's improving perceived load times. As PWAs leverage service workers they are able to (at least for repeat visits when the service worker has been installed) intercept requests for the app's document and return something else instead.

Typically this mechanism would be used to either respond with a cached version which has implications like potentially showing an outdated response and is typically only used when the application is offline.

An alternative to that is adopting the app shell model as shown above and serving the app shell from the service worker so that it is immediately available while the application loads and boots up. This does not necessarily result in great user experience though as seen above. It is possible to combine the app shell model with SSR though so that the app shell is served from the service worker so it is displayed immediately while making a request for the pre-rendered document at the same time and fill the response for the into the app shell once it is ready. That way the best of both worlds is combined. We'll look at an example for how this can be done in a later post in this series.

#### FastBoot

This is only the first post in a series of posts. The next ones will introduce FastBoot which is Ember's SSR solution and go in depth into some advanced patterns that it (and SSR in general enables). Stay tuned for the next posts.
















