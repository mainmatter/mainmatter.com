---
layout: article
section: Blog
title: "Porting a site to Ember using Percy"
author: "Chris Manson"
github-handle: mansona
twitter-handle: real_ate
topic: ember-guides
---

This article will detail a technique where we used the visual testing service
[Percy](https://percy.io/) to port the old [Ember
Guides](https://guides.emberjs.com/release/) to use an entirely different
technology without anybody noticing.

![Screenshot from a talk Tom Dale gave saying "in some sense it's like trying to change an engine on a 747 mid-flight"](/assets/images/posts/2020-03-23-porting-a-site-to-ember-with-percy/changing-the-engine.png)

<!--break-->

This article is part one of the series of posts where we describe how I ported the Ember
Guides from an old (and hard to maintain) ruby middleman app, to a modern Static
Single Page Application that is a dream to contribute to! To see the rest of the
posts and a description of the project you can take a look here (TODO - get a series going on the simplabs blog?).

## Strict Requirements

The point of this project was to change the technology that powered the Ember
Guides without altering the look or feel of the site when people were using it.
There were many factors that we needed to consider, but this post is focusing on
**just** the design, if you would like to see some of the other topics relating
to the guides upgrade you can get out the series (TODO add link to series).

We decided very early on that we would not accept any functionality changes or
small improvements to the design as part of this project, mainly as an effort to
keep the initial project scope as small as possible and to improve the
likelihood that we would ship the end product in a reasonable timeframe.

It's important to note that we weren't opposed to improving the end-user
experience for this application. The whole reason for this project was that we
wanted to make it **easier** to contribute improvements to the Ember Guides
application, but we would release the technology re-write first without changing
a single thing! This allowed us to have a straightforward requirement: **if it
looks the same we can ship it.**

## Enter Percy, stage right

I had heard a lot about Percy over the years being a part of the Ember
community! It's a great product and something that is well aligned
philosophically with Ember. If you have ever had the pleasure to use Percy you
will know that it has had a lot of thought put into it and it Just Works™️ when
you start working with it.

For those of you who don't know what Percy is, on their website they describe
themselves as "Your all-in-one visual review platform". Just like Code Reviews
and Pull requests, Percy allows you to view any **visual changes** as a result
of the work that you are doing on an application. I have also heard it referred
to as a "visual regression test system", but in practice it is much more than
just that. 😂

This got me thinking; if you can use Percy for visual regression tests
then why can't you use it to do an overarching regression test for porting the
technology that was powering your website, sort of like a "migration regression
test". After a bit of experimentation that is what we decided to do.

## Setting up the baseline

The first time that you run Percy it takes a snapshot of your entire site and
uses this as the "baseline" for which any subsequent change needs to be compared
against.

> It's not entirely true that Percy takes a snapshot of your entire site when
you use it, you have complete power to integrate Percy the way that you want if
you are using one of their SDKs. We are using the "static site" command line
interface to upload to Percy in this example so that does upload your entire
site.

Once you have this baseline loaded for your "master" branch, you can setup Percy
in your Continuous Integration (CI) service so that every Pull Request (PR) you
make will be **compared against the baseline** and you will see a visual diff of
what the site used to look like against the current changes.

![An example of the Percy interface](/assets/images/posts/2020-03-23-porting-a-site-to-ember-with-percy/percy-example.png)

Although this article is part of the series to port the Ember Guides, we will
use the project to convert the Ember Website to an Ember app for most of our
examples. This is because, at the time of writing, we are going through much of
the same process for the new Ember Website as we did when we originally
converted the Ember Guides. The last step in the Ember Website conversion is to
make sure it is 100% visually similar to the current website before we launch,
so I'm currently setting up the Percy "migration regression test" while I write
this blog and documenting the process!

### Getting a copy of the existing site

The first thing that we need to do in this process is we need a local copy of
the existing site that we are planning to port. If you look at the
[documentation for using the Percy command line
client](https://docs.percy.io/docs/command-line-client) it tells you that you
should build your static site locally and then point the CLI client to the
output folder.

As I briefly mentioned earlier, part of the issue with the old infrastructure
for the Ember Guides (and similarly for this Ember Website) is that it was
almost impossible to get working locally, and therefore very hard to contribute
to. There was some effort put in to make it work with a Docker environment but
even if that did work locally for us (not a guarantee), it would be slightly
harder to get at the compiled output of the site.

If we can get away without having to get the Ruby middleman setup running
locally that would be a better approach. Another way to get a static copy of
the website would be to pretend that we're Google for a few minutes and just
crawl the site to download it locally, and that is exactly what we're going to
do.

If you are on a Linux machine you probably have `wget` installed, it is a
particularly useful tool to download single files quickly and easily. If you are
on macOS then you will probably need to use [Homebrew](https://brew.sh/) to
install it:

```bash
brew install wget
```

Before I was working on this project I didn't actually realise that, not only
can you use it to download single files but you can also use it to crawl and
download entire websites! Here is the command that I'm using to download the
entire [Ember Website](https://emberjs.com):

```bash
wget --recursive \
     --page-requisites \
     --html-extension \
     --convert-links \
     --domains emberjs.com \
     --reject-regex '/api/*|/deprecations/*|/blog/*' \
              emberjs.com
```

> I'm running these commands on macOS with `wget` version _1.19.5_ so you might need to confirm these arguments for your platform and `wget` version

If you google "crawl website with wget" or "download entire site with wget" you
will undoubtedly get quite a few variations of the above set of arguments to the
`wget` command. Most of these arguments are self-explanatory (and it could be an
exercise for you to check the wget man page to see exactly what they do) but the
most important one here is the `--reject-regex` for our use case. I mentioned
already that the examples I'm giving for this article are for the
"Emberificaion" of the Ember Website project, and currently for the website
there are three sub-directories that are either currently or will soon be
separate applications and are not something we need to concern ourselves within
this project. This `--reject-regex` essentially excludes them from the download
process, which is a good thing because the blog has 220+ pages that would all be
automatically downloaded as part of this crawl without it 😬

### Verifying all the pages are there

After running the above command we now have a folder `emberjs.com` that contains
a static copy of the Ember Website. We now need to list all of the pages and
make sure that we're happy that we've captured all of the pages we needed to.

Thankfully we used `--html-extension` which will make sure that all html files
end with `.html` so we can run a simple find command in that folder to list the
pages:

```bash
find . -iname '*.html'
```

You should now go through and prune any html files that you don't want to use
and make sure that everything you expect to be there is. In our case it was
listing quite a few "query param" pages that we really didn't care about so we
just needed to delete them.

```
./mascots?filter=zoey.html
./mascots?filter=other.html
./mascots?filter=tomster.html
./mascots?filter=corp.html
./mascots?filter=meetup.html
./mascots?filter=conference.html
```

If you have access to the output directory of the application that you're trying
to migrate then you won't need to go through this step of cleaning up so I would
recommend that if you can.

### Uploading to Percy

It is worth referring to the instructions
https://docs.percy.io/docs/command-line-client but for us we are running the
following command:

```bash
PERCY_TOKEN=not_our_real_token PERCY_BRANCH=master percy snapshot emberjs.com
```

In this example emberjs.com is the name of the folder that was created with the
`wget` command. We need to provide the `PERCY_BRANCH` in our case because Percy
is supposed to be run in conjunction with your Version Control System (VCS) and
because we just have a folder instead of a git repository it won't autodetect
our branch. We want it to be our `master` branch because this is going to serve
as our baseline that all of the rest of the application will be built around.

If you would like to see the result of this command you can follow [this link to
the Percy build](https://percy.io/Ember/Ember-Website/builds/1509479). _Note
this build will only be available for 90 days after this article goes live_.

You may notice that there were some visual differences because we had already
setup Percy on the new project that was well under way. We need to accept these
changes so they will form the new baseline

## Setting up visual regression testing for the Ember Application

The [official documentation for the Percy Ember
integration](https://docs.percy.io/docs/ember) is fantastic and I would
**highly** recommend that you check it out. We need to set up a very slightly
custom implementation for our needs because we would like the snapshots that
were generated from the Percy CLI to match the snapshots from the ember
application. The simplest way to do this is for us to define the mapping
manually, here is what that mapping looks like in the ember-website testing
code:

```javascript
    // This is used to map the current **new** routes to what they used to be in the
    // old ruby app. This is to allow us to compare what the new app looks like
    // vs the old app.
    const pages = [
      { title: '/builds/index.html', route: '/releases' },
      { title: '/builds/beta/index.html', route: '/releases/beta' },
      { title: '/builds/canary/index.html', route: '/releases/canary' },
      { title: '/builds/release/index.html', route: '/releases/release' },
      { title: '/community/index.html', route: '/community/' },
      { title: '/community/meetups-getting-started.html', route: '/community/meetups-getting-started/' },
      { title: '/community/meetups.html', route: '/community/meetups/' },
      { title: '/ember-community-survey-2019.html', route: '/ember-community-survey-2019/' },
      { title: '/ember-users.html', route: '/ember-users/' },
      { title: '/guidelines.html', route: '/guidelines/' },
      { title: '/index.html', route: '/' },
      { title: '/learn.html', route: '/learn/' },
      { title: '/legal.html', route: '/about/legal/' },
      { title: '/logos.html', route: '/logos/' },
      { title: '/mascots.html', route: '/mascots/' },
      { title: '/meetup-assets.html', route: '/community/meetups/assets/' },
      { title: '/security.html', route: '/security/' },
      { title: '/sponsors.html', route: '/sponsors/' },
      { title: '/statusboard.html', route: '/statusboard' },
      { title: '/team.html', route: '/team/' },
      { title: '/tomster.html', route: '/mascots/' },
      { title: '/tomster/commission/index.html', route: '/mascots/commission/' },
      { title: '/tomster/faq.html', route: '/mascots/faq/' },
    ];
```

With this defined all we need to do is to loop through this array in an Ember
Acceptance test, use the `visit()` API to navigate to the specified route and
then use the Percy Ember testing API to take a snapshot. It's important to pass
the title into the snapshot so that we can match against the legacy application.

Here is what that code looks like in the ember-website:

```javascript
await pages.reduce(async (prev, config) => {
  await prev;

  await visit(config.route);

  await percySnapshot(config.title);
}, Promise.resolve());
```

This happens to be using a trick to only take one snapshot at a time, but you
could just as easily use `Array.map()` and await on `Promise.all()` of the
responses.

Even though I've copied most of the implementation into this post you can [see
it all in action directly in the source code of the ember-website
project](https://github.com/ember-learn/ember-website/blob/401a638dbb65191d1273de8336525bf9df6b53bc/tests/acceptance/visual-regression-test.js#L1)

## Open a PR,  Iterate on the design, Ship when green

At this point, it's time to open a PR to test your Percy integration. This will
create a Percy build that will be a comparison to the baseline that we set up
previously. **Note:** it's important to do this in a PR and not on your `master`
branch directly because Percy will automatically "approve" changes that are
pushed to your master branch. Once you open the PR, if you have followed the
Percy installation instructions correctly, Percy will start to build your visual
diff.

The examples that I have been showing in this post have been leading up to [an
actual PR on the ember-website
project](https://github.com/ember-learn/ember-website/pull/185) and you will see
in the CI checks for that PR that the [initial Percy build is
failing](https://percy.io/Ember/Ember-Website/builds/1509496). If you look at
the visual diff you will see that there is quite some work that needs to be done
before this is ready to go live, but I never said that this would do all the work for you! 😂

What Percy is really giving you here is the confidence to know when the project
is ready to be shipped. If you can keep the requirements constrained to simply
"make it look like it did before" and you can prevent feature creep for the
project then you will know with confidence that it is ready to deploy when you
have a passing CI and your Percy build shows no changes. If Percy is happy then
you can deploy with confidence.

## Summary

This is a useful technique that we have now used successfully twice to port
large projects from Ruby middleman to Ember in the Ember Learning Team, and
while it is not exactly using Percy like it was designed it is a very useful
technique to have in your tool belt when you need it.

If you have a project that you are thinking of porting to EmberJS and would like
to discuss it with us, or if you have any general questions about this topic we
encourage you to [contact us](https://simplabs.com/contact/)!
