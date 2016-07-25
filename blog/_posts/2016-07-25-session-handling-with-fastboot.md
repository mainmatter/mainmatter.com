---
layout: article
section: Blog
title: Session handling with FastBoot
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

FastBoot is nearing its 1.0 release and lots of projects will be adopting it in the near future. This post explains the implications of FastBoot when it comes to handling authentication state and authorization info.

<!--break-->

First, let's take a step back and look at how FastBoot changes the way Ember.js applications are booted.

#### The Status Quo

The Status Quo of how Ember.js applications are booted is pretty simple actually.

When the browser first requests the application e.g. from `http://domain.com` it receives the `index.html` file that is basically empty
except for the `<script>` and `<style>` tags containing the application's code and styles. Thus, when it receives the `index.html` file it will
  send subqsequent requests loading these script and styles. Only once these have been successfully loaded can it start up the application,
  load any data required by the route the application was started on and render that route. Only then will the user see any meaningful output on the page.

![The Status Quo](/images/blog/2016-07-25-session-handling-with-fastboot/status-quo.png)

The idea behind FastBoot now is to already present the user with prerendered content while the browser is still downloading the application's scripts and styles. which dramatically reduces the time the user
needs to wait until the first content is rendered in the browser.

![Application Boot with FastBoot](/images/blog/2016-07-25-session-handling-with-fastboot/fastboot.png)
