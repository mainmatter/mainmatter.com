---
layout: article
section: Blog
title: "From SPA to PWA"
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

Progressive Web Apps are the next level of browser based applications. They
offer a rich user experience that parallels what users know and expect from
native apps and combine that with the benefits that browser based applications
provide. In this post, we'll look at how to turn a Single Page App into a
Progressive Web App.

<!--break-->

#### Breethe

Throughout this post, we will use [Breethe](https://breethe.app) as an example.
Breethe is a Progressive Web App that gives users quick and easy access to air
quality data for locations around the world. Pollution and global warming are
getting worse rather than better and having easy access to data that shows how
bad the situation actually is, is the first step for everyone to question their
decisions and maybe change a few things in their daily lives.

![Video of the Breethe PWA](/images/posts/2018-07-24-from-spa-to-pwa/breethe-video.gif)

The application is [open source](https://github.com/simplabs/breethe-client)
and we encourage everyone interested to look through the source for reference.
To learn more about how we built Breethe with Glimmer.js, refer to the previous
post in this series. However, none of the contents in this post are specific to
Glimmer.js in any way but generally applicable to all frontend stacks.

#### Progressive Web Apps

In short, Progressive Web Apps are websites that look and behave like native
apps. While the idea of building apps with web technologies has been around for
a long time, it never really took off until recently. In fact, Steve Jobs
himself introduced the idea at WWDC 2007, just shortly after the unveiling of
the orignal iPhone:

<iframe width="560" height="315" src="https://www.youtube.com/embed/y1B2c3ZD9fk?start=4451" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="video"></iframe>

Unfortunately that idea was one of the few of Jobs' that never really took off.
In fact, Apple released a native SDK for the iPhone in 2008. That change in
strategy lead to a huge market for native mobile apps and played a significant
role in mobile devices becoming ever more ubiquitous over the past decade
([not always to the benefit of everyone](https://en.wikipedia.org/wiki/Mobile_phone_overuse)
as is becoming more and more obvious recently).

While native apps can enable great things and previously unforeseen use cases,
they have some drawbacks. They generally
[show high conversion rates](https://jmango360.com/wiki/mobile-app-vs-mobile-website-statistics/)
which is the main reason why marketing departments keep pushing for them. On
the downside though, they have some significant drawbacks, the main one being
that apps have to be downloaded and installed which can be a significant effort
for users for several reasons (ultimately leading to the question of how many
potential users are lost before they even install the app where they then
**could** have been successfully converted):

* users that are on the mobile website already, when asked to install the app,
  need to leave that website, go to the app store, download the app and
  continue through the installation process
* once the app is installed, all input that was made on the website before is
  lost and needs to be restored besides users potentially needing to login in
  the app again
* native apps are
  [relatively large on average](https://sweetpricing.com/blog/2017/02/average-app-file-size/),
  leading to long download times in particular on often spotty mobile
  connections

In contrast, web apps are easily accessible via the browser without forcing
users to go through an app store and installation process and load almost
instantaneously - if done right, even on spotty mobile connections.

Another advantage of native apps is mostly a historic one now. Historically,
apps were able to offer a better user experience both in terms of the purely
visual experience and also terms of features. With the quickly evolving web
platform and capabilities of modern browsers, this is no longer the case though
and web apps are now capable of offering equal if not better user experiences
than native apps. Combined with almost instantaneous load times and superior
discoverability, Progressive Web Apps are clearly the better choice than native
apps for the vast majority of use cases now.

This has only been the case relatively recently though. While Chrome and
Firefox supported Service Workers (which are the main ingredient for PWAs) for
quite some time, two major browsers were falling behind - namely Safari and
Internet Explorer. These two (actually not Internet Explorer but its successor
Edge) have finally caught up recently and
[Service Workers are now supported by all major browsers](https://caniuse.com/#feat=serviceworkers),
making Progressive Web Apps a viable alternative to native apps for most
businesses with ca. 84% of the global user base on browsers and OSes capable of
running PWAs as of July 2018.

A decade after the introduction of the original iPhone (and a detour via the
[multi-billion native app economy](https://www.appannie.com/en/insights/market-data/predictions-app-economy-2018/)),
Progressive Web Apps are ready to be used and they are here to stay. And we are
only getting started - as Progressive Web Apps have only recently really took
off, it's fair to expect massive improvements in terms of what's possible over
the next years.

#### What are PWAs?

Progressive Web Apps have some distinct characteristics, the main ones being:

* Progressiveness: they work for every user, regardless of their device or
  browser of choice; depending on the capabilities of that environment, they
  will enable more or less of their functionality
* Responsiveness: they fit any form factor and screen sizes
* Connectivity Independence: they work on low quality networks or without any
  network at all (and thus fully offline)
* App-likeliness: they offer the rich user experience that users know and love
  from native apps
* Installability: they can be installed on the user's home screen without
  having to go through an app store

We will be focussing on 2 of these characteristics in this article -
Installability and Connectivity Independence.

##### Installability

Progressive Web apps can be installed on the user's home screen and thus
_"taken out of the browser"_ so that they mingle with the user's native apps
without the user noticing a difference. That characteristic is enabled by the
[_"App Manifest"_](https://developers.google.com/web/fundamentals/web-app-manifest/)
that describes how an app is supposed to behave when run _"outside"_ of the
browser. The App Manifest is a simple JSON file with key/value pairs that
configure the main aspects of the app. The App Manifest for Breethe looks like
this:

```json
{
  "name": "Breethe",
  "short_name": "Breethe",
  "description":"Air Quality Data for Locations around the World",
  "theme_color": "#002eb8",
  "background_color": "#002eb8",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "icons": [
    {
      "src": "images/app-images/192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/app-images/512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "splash_pages": null
}
```

The manifest is presented to the browser via a `meta` tag:

```html
<link rel="manifest" href="/manifest.webmanifest">
```

The main keys in the manifest are `name`, `icons`, `background_color`,
`start_url`, `display` and `orientation`:

* `name`: the name of the app that will be shown on the user's home screen once
  the app is installed
* `icons`: icons in various sizes to use for the app on the home screen, the
  task switcher and elsewhere
* `background_color`: sets the color for the splash screen that is shown when
  the app is started from the home screen
* `start_url`: the URL to load when the app is started from the home screen
* `display`: tells the browser how to display the app when started from the
  home screen; this should usually be `"standalone"`
* `orientation`: the orientation to launch the app with if only one orientation
  is supported or makes sense for the app

Breethe, when installed to the user's home screen on iOS shows up like this:

![The Breethe app icon on the home screen](/images/posts/2018-07-24-from-spa-to-pwa/breethe-app-icon.png)
