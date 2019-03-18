---
layout: article
section: Blog
title: "SPAs, PWAs and SSR"
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
topic: javascript
---

Single Page Apps, Progressive Web Apps and classic Server side rendered websites are often seen as orthogonal approaches to building web apps where only one is best suited for a particular project and a decision has to be made which approach to leverage early on in a project. In this post we'll explore why that doesn't have to be the case but all 3 approaches can actually be combined in order to achieve the best result.

<!--break-->

## Desktop-grade apps

Modern websites are in many cases not really websites anymore but in fact full blown apps with desktop-grade feature sets and user experiences. While the much-loved [Spacejam Website](https://www.spacejam.com/archive/spacejam/movie/jam.htm) with its little blinking satellites for menu items was a pretty standard website only about 2 decades ago

![Video of the spacejam.com menu](/images/posts/2019-03-16-spas-pwas-and-ssr/spacejam.gif)

we can now go to [Google Maps](https://www.google.com/maps), zoom and rotate the earth in 3D space, measure distances between arbitrary points and have a look at our neighbor's backyard:

![Video of Google Maps](/images/posts/2019-03-16-spas-pwas-and-ssr/maps.gif)

All of this functionality, interactivity and visual appeal comes at a cost though, mainly in the the form of JavaScript code. The median size of JavaScript used on pages across the Internet is now [ca. 400KB on the desktop and ca. 360KB on mobile devices](https://httparchive.org/reports/state-of-javascript), an increase of ca. 36% and ca. 50% over the course of the past 3 years. All of this JavaScript not only has to be loaded via often spotty connections but also parsed, compiled and executed - often on devices that are less powerful than one might expect (have a look at [Addy Osmani's in-depth post on the matter](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4)).

What all this leads to is that for many of these highly-interactive, feature-rich and shiny apps that are being built today, the first impression that the user gets will often be this:

![Video of a loading JS app](/images/posts/2019-03-16-spas-pwas-and-ssr/loading.gif)

## SPAs

While JavaScript-heavy apps can be slow to start initially though, the benefit of the Single Page App approach that is most often followed to build them is that once the the app has started up in the browser, it is running continuously and handles route changes in the browser so that no subsequent page loads are necessary. In that sense the SPA approach trades a slow initial load for fast or often immediated subsequent loads.

The initial response though that the server sends will often be either empty or just a basic loading state as shown above. Only after the application's JavaScript has been loaded, parsed, compiled and executed, can the application start up. This results in relatively slow time to first meaningful paint and time to interactive metrics.

### Time to first meaningful paint

This is the time when the browser can first paint any **meaningful** content on the screen. While the time to first paint metric would just measure the first time **anything** is painted (which would be when the loading spinner is painted in the above example), for an SPA time to first meaningful paint would only occur once the app has started and the actual UI is painted on the screen.

### Time to interactive

This is the time when the app is first usable and able to react to user inputs. In the above example of the SPA, time to interactive and time to first meaningful paint happen at the same time which is when the app has fully started up, has painted the UI on screen and is waiting for user input.

## The App Shell Model

One popular approach for improving the startup experience of JavaScript-heavy applications, is called the [App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell). The idea behind this concept is that instead of responding to the user's first request with an empty HTML document with maybe only a loading spinner and a number of script tags, the server would respond with the minimal set of code that is necessary for rendering and making interactive the app's minimal UI. In most cases, that would be a visual framework for the app's main blocks and some barebones functionality associated to that (e.g. a working slideout menu without the individual items actually being functional).

Although this does not improve the app's time to first meaningful paint, at least it gives the user a first visual impression of what the app will look like (and users might even be able to develop an idea for what it will work like) once it has started up. Of course the app shall can be cached in the browser using a service worker so that for subsequent visits it can be served from that instantly.

## Back to SSR

The only effective solution for solving the problem of the meaningless initial response - be it an empty HTML document with script tags only, a loading indicator or an app shell - is to leverage server-side rendering and respond with the full UI or something that's close to it.

Of course it wouldn't be advisable to go back to classic server-side rendered websites completely, dropping all of the benefits that single page apps come with (instance page transitions once the app has started, rich user interfaces that would be almost impossible to build with server side rendering, etc.) A better approach is to run the same single page app that is shipped to the browser on the server side as well as follows:

* the server responds to `GET` requests to all of the routes the single page app defines and that would be transitioned to instantly once the app has started up in the browser
* once a request comes in, the server constructs an application state from the request path and potentially additional data like a session cookie and injects that into the SPA
* it then executes the SPA, including data loading and performs an initial render of the app's UI into a string, leveraging a library like SimpleDOM
* that string is then served as the response to the browser's request as opposed to an empty document with script tags only or an app shell
* the pre-rendered response of course still contains all `<script>` tags as usual so that the browser would load and execute these scripts and start up the app in the browser as usual

With the previously described solution, the time to first meaningful paint metric is dramatically improved. Although users still have to wait for the app's JavaScript to load and the app to start before they are able to use it, instead of only being shown a loading spinner or an app shell, they see all of the app's UI immediately, including of course all data that the application shows. The initial UI can even be partly interactive - elements like links or even functional elements like hover menus that can be implemented in CSS only will already be usable before the app has started up.

## SPA + SSR + PWA

Combining SPAs with classic SSR, we can combine the best of both worlds - a fast time to first meaningful paint plus the benefits of an SPA that runs in the browser like immediate page transitions, vivid UX etc. On top of that, patterns of PWAs can be added, for example caching the initial pre-rendered response in a service worker so that it can be shown immediately on subsequent visits or showing the app shell from the service worker cache and then injecting the SSR response into that which is likely available before the app has started up.

This shows that SSR, SPAs and PWAs are not orthogonal concepts that are exclusive of each other but are actually complementary. SSR can be leverage for a fast time to first meaningful paint and some very basic functionality like links etc. Once the JavaScript referenced in the SSR response has been loaded, we can start up an SPA in the browser that takes over the DOM and intercepts all subsequent page loads and handles them immediately in the browser. And finally concepts of PWAs like effective client-side caching and offline functionality via service workers can be added on top for maximal performance.

## Deployment

When leveraging SSR for single page apps, it is important to get some requirement around the deployment right. Pre-rendering the application for the first request is only an improvement over the classic way of serving an SPA and should not be a requirement to use the app at all. Neither should it slow down delivery of the app. To make sure these requirements are met, it is important to make sure of two things:

* The pre-rendering must run within a timeout so that if for some reason it takes longer than x ms or whatever a reasonable threshold for a particular app might be, the server cancels the pre-renderer and instead serve the SPA the classic way which is just responding with a static file.
* Likewise should errors in the pre-renderer not be forwarded to the users and thus block them from booting the app in the browser. Whenever the pre-renderer encounters an error, it should fall back to serving the app the classic SPA way just like it does if it runs into the timeout.

## Breethe

We implemented the above described patterns in Breethe, a Progressive Web App for accessing air quality data for locations around the world that we built in 2018 and release as open source. Breethe is completely open source and [available on github](https://github.com/simplabs/breethe-client) and we encourage everyone interested in the topic to check it out for reference.

![Video of Breethe](/images/posts/2019-03-16-spas-pwas-and-ssr/breethe.gif)

Breethe does not stop at the above described patterns though but goes a step further. As it turns out, leveraging SSR enables to also leverage Progressive Enhancement so that the initial response can be functional beyond just links and interactive elements built in CSS. Many things we're all doing in JavaScript in SPAs these days have equivalents in HTML like classic forms. These might not be as powerful and elaborate as what can be done with modern JavaScript but they can serve as a fallback for when the app's JavaScript is slow to load or fails to load completely. That way we're coming back full circle to a concept from 1 or 2 decades ago where JavaScript enhances the HTML document rather than generating it - and all that while we're using a SPA that is completely written in JavaScript but that we're also running in the server side so that users don't necessarily have to wait until the app runs in their browsers.

I will elaborate on how exactly the approach works in the next post of this series so stay tuned!