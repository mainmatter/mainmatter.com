---
layout: article
section: Blog
title: Breethe breakdown
author: "Niklas Long"
github-handle: niklaslong
topic: elixir
---

## Intro

## Breethe

Throughout this post, we will use [Breethe](https://breethe.app) as an example.
Breethe is a Progressive Web App that gives users quick and easy access to air
quality data for locations around the world. Pollution and global warming are getting worse. The first step to understanding and solving these problems is to raise awareness by providing everyone with easy access to accurate data. 

![Video of the Breethe PWA](/images/posts/2018-07-24-from-spa-to-pwa/breethe-video.gif)

The application is [open source](https://github.com/simplabs/breethe-server)
and we encourage everyone interested to look through the source for reference. The server for this application was implemented using an [Elixir (add link)] umbrella application which will be the focus of this post. The client for Breethe was built with
[Glimmer.js](http://glimmerjs.com), which we discussed in previous posts:
- [From SPA to PWA](/blog/2018/07/24/from-spa-to-pwa.html)
- [Building a PWA with Glimmer.js](/blog/2018/07/03/building-a-pwa-with-glimmer-js.html)

## Elixir umbrella apps and splitting concerns with DDD

When we first started building Breethe, we asked ourselves a simple question which would dictate the structure of the application and our motivation for using an umbrella app to organise our code. This question was: what if we want to change our air quality provider? It turns out this wasn't just speculation as we are now in the process of doing just that and our decision to use an umbrella app will make the process tremendously easy. 

Using an umbrella allowed us to split our server into two very distinct applications, communicating together by way of rigorously defined APIs. The first application functions as the data handling entity of the project. It communicates with the air quality provider (a third-party API) to gather the data, then processes and caches it for future use. The second application in the umbrella is the webserver, built with Phoenix. It requests the data from the first application, parses it to JSON and delivers the payload to the client under the JSON API standard.

(Picture of umbrella structure)

We have essentially defined a clear boundary between the business logic and the webserver. This is cool because the umbrella becomes modular like LEGO and who doesn't like LEGO? Need to change air quality provider? No problem, build a new data application and drop it into the umbrella, replacing the old one. The webserver needn't be changed as long as the new data app implements the API the previous one used. The same could be done if we wanted to change the webserver or if we wanted to extend the functionality of the umbrella. 

#### Internal domains within date sources (carefully defined APIs)

## Using tasks to asynchronously load data in background

## Testing domains independently using Mox (mocking db)

