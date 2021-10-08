---
title: "The state of PWA support on mobile and desktop in 2020"
authorHandle: arthurpoot
tags: pwas
bio: Digital Marketing Analyst and Business Developer
description:
  "Arthur Poot presents an overview of the possibilities that PWAs offer and the
  level of support different browsers and OSs offer in 2020."
og:
  image: /assets/images/posts/2020-06-10-the-state-of-pwa-support-on-mobile-and-desktop-in-2020/og-image.png
---

Progressive Web Apps have evolved rapidly over the past few years and are now
supported better than ever. In the past 2 years, Microsoft and Samsung have
joined Google in the quest to actively support and promote PWAs. Since early
2020, Apple seems to have realized that not all apps belong in the App Store.
With the release of iOS 13, most basic PWA features are now finally fully
supported on iPads and iPhones.

There are still limitations for some operating systems (OS) and browsers, so
when you are considering building a PWA it is important to take this in mind.
That's why we made this overview.

<!--break-->

## The state of PWAs in 2020 per OS

![PWA support per operating system (iOS vs Android vs macOS vs Windows)](/assets/images/posts/2020-06-10-the-state-of-pwa-support-on-mobile-and-desktop-in-2020/infographic.png#@900-1800)

### Which devices support PWAs?

The answer to that question depends largely on your users' browsers and how you
define what a PWA is. Almost all browsers in use support the basic functionality
of PWAs: offline capability. 94.28% of people worldwide are using a browser
version that supports offline apps through service workers (see
[source](https://caniuse.com/#feat=serviceworkers)).

### Which devices allow the installation of PWAs?

A PWA only blends in with native apps downloaded from an app store if it has an
app icon on the user’s home screen or desktop. Installing a PWA is now possible
on almost any device, except for wearables and TVs.

On mobile devices, the user experience of installing PWAs varies widely. It
ranges from downloading a PWA from Google's Play Store like a native app to
opening the options menu and clicking _"Add to home screen"_ on iOS devices with
a Safari browser.

Installing PWAs on desktop devices is widely supported as well, but not that
common yet. Chrome on Windows and macOS now offers the possibility to install
apps in a seamless way. On Windows and ChromeOS you can even download PWAs
straight from the Microsoft Store and Play Store. Maybe these developments will
increase the adoption of Progressive Web Apps on the desktop.

### What native hardware features are accessible by PWAs?

Mobile devices are packed with sensors. There are accelerometers, gyroscopes to
detect the direction and movement of the device, which could be handy for
certain games or detecting screen rotation. Or GPS to provide more accurate
location data than IP addresses. Android allows access to almost all its
hardware through PWAs, from enabling and disabling bluetooth to GPS. On the
other hand, Apple has been very protective of PWAs accessing hardware or app
context. See the table above for the full list.

On the desktop, native hardware features are mostly limited to the harddrive,
camera, and microphone as well as geolocation. Like any browser or app, it
neatly prompts the user to give or block access to the hardware. There just
aren't that many native sensors in a desktop device, except hardware that plugs
directly into the OS environment (e.g. bluetooth headphones, hard drives, or USB
devices).

### What native software features are accessible by PWAs?

For a PWA to be fully indistinguishable from a native app, it needs to blend in
with the native user interactions offered by the operating software. For
example, native push notifications, keyboard shortcuts, and gestures give that
native feeling.

On mobile devices most basic software features are now supported, such as the
swipe back and switch-app gestures. Both Android and iOS also allow auto-filling
credentials and easy payment options like Apple Pay and Android Pay.

In terms of native software features, desktops are limited to what a browser is
allowed to do. Chrome supports push notifications on macOS, just like most
browsers on Windows PCs.

## Comparing PWA features

The infographic above shows an overview of supported features, but before you
start comparing it is good to answer the following questions:

### Which OS does your target audience use?

Each OS has different users. Designers, developers and the youth use macOS,
while employees of many corporates spend most of their time on Windows PCs. iOS
is not as big as Android. Only in the United States, more than 20% of the online
population is on an iPhone or iPad. So it really depends on what audience you
try to serve. The best way to find out on which device your users are is to look
in Google Analytics under the Audience tab and then click Technology.

### Do I really need this feature? If so, is there a workaround?

The lack of support for push notifications on iOS devices is an often-heard
argument for building native applications over PWAs. Only around 55% of all
users allow push notifications at all though and the opening rate is only ca.
50%. So only if you need instant actions of users with high frequency (like with
messaging apps), you would need push notifications; but for the rest, text
messages, email or in-app notifications are perfectly suitable replacements.

## Conclusion

**PWAs are not the future, they are ready today.**

PWAs can do a lot more than just two years ago and the capabilities are still
improving rapidly. Google, Apple, and Microsoft are prioritising PWA support
more than ever. The basic features of PWAs, such as offline capacity and
install-ability, are supported by almost all mobile and desktop devices in use
today. Only some native features are still not supported, especially on iOS
devices. However, do you really need those native features? If so, is there a
workaround that is as useful or even better to achieve the same goal?
