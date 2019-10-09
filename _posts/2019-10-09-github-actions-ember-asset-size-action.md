---
title: 'Building My First Github Action and Introducing ember-asset-size-action'
author: 'Chris Manson'
github: mansona
twitter: real_ate
topic: ember
bio: 'Software Developer, Ember CLI core team member'
description: "TBD"
---

Now that GitHub are rolling out GitHub Actions to more people there is a real buzz around them in the community. It's not even out of Beta and people have already built some amazing pipelines that do amazing things and I am feeling pretty inspired to join the party.

As an Ember developer I tend to try out "ambitious" projects so I plan to write an asset tracking action for Ember applications that can comment on PRs with the size diff of assets.

## The inspiration

I'm one of the main maintainers of the ember-website and someone on the Ember Core team noticed that the vendor.js file on the website had grown to nearly 800KB! This is not normal for an Ember app so I decided I would investigate and figure out what was wrong.

The first thing that I did was just verify that the issue was actually true (request map, chrome dev tools).

Next investigate the package with package anlayser (kaliber5)

<sidebar about all ember-apps being similar so we can do this easliy>

## The cause of the issue

As with a lot of issues in development they creep up over time. When we added highcharts that added (X)KB, then when we added leaflet it added (X)KB. And one single PR that added highlight and markdown-it also added (X)KB!!

This is the reason for creating the GitHub action. Had we known that the problem was there at the PR stage we would have fixed it there and then

## Starting the build

first thing that I did was created a new ember app so we could install an Action.

click the action tab and it gives us a nice set of starter actions. I'm going to start with the node one for now because I want to at least build the ember app assets and node is the only prerequesite

It gave me this as a starting config

```yaml
name: Node CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [8.x, 10.x, 12.x]

    steps:
    - uses: actions/checkout@v1
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: npm install, build, and test
      run: |
        npm install
        npm run build --if-present
        npm test
      env:
        CI: true
```

which I simplified down to

```yaml
name: Node CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: actions/setup-node@v1
      with:
        node-version: 12.x
    - name: npm install, build, and test
      run: |
        npm ci
        npx ember build -prod
      env:
        CI: true
```

thankfully the action runs on the first "push" when editing the action file. now when we turn this into a consumable action that any ember app can use it will start the process and build the assets so we can have a baseline on PRs

next challenge we have is we need to figure out how to comment on a PR when it is created. let's go back to the demos again and see if there is anything that we can see there. oh wait... it seems like we only get that nice wizard when defining our first workflow :facepalm: so we will need to delete our current one as we know it already works. ok... it seems like the wizard is different after you already create a workflow :tired: let's see if we can create it on a new repo

ok so we have been able to go throught the better wizzard and the best one to pick I think is the labeler. this means that we will be able to write information back to the PR. Looking at the config we are seeing something interesting:

```yaml
name: Labeler
on: [pull_request]

jobs:
  label:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/labeler@v2
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

firstly it looks like there is no logic in this config like the last one, just a callout to an external workflow `actions/labeler`. I know from previous research that this is just referring to a project github.com/actions/labeler which we can take a look at. Also interestingly it is using secrets so we will have to figure out how this works too!

so we try this out on a different repo and... well it doesn't work! A bunch of technical problems with that particular action but it's not relevant for now. The thing that we learned is that we need to create a JS action in our own repo. In my previous investigations I found https://github.com/actions/toolkit/ which points us to a "Javascript walkthrough" https://github.com/actions/toolkit/blob/master/docs/javascript-action.md that we can follow to figure out what we're doing here. Let's start walking through

## Creating our own JS action

the javascript action walkthrough talks about using a github template, which I didn't even know existed! pretty nifty but it does seem to have a few flaws. I genereated a new template and a few things were still hard coded: the package name, author etc. might want to take a leaf from ember-cli generators book

now looking at the code that was generated I can see that it has a whole load of strange typescript setup going on along with build steps. I have not really been a fan of typescript and for something so simple like this I don't see why we need such overkill.

I guess if you like the `import something from 'something'` syntax of esm then you can install JDD's awesome esm addon.

now that we have undid a lot of the setup on the template let's get started testing the new thing we created.

```yaml
steps:
    uses: simplabs/ember-asset-size-action@master
```

after a first failure it seems like the there is a requirement that your production node modules are committed. I guess this makes sense considering the deployment artifact is a commit and we would not want dependency drift if we were to npm install every time it is run. Also it saves on execution time not having to install every time which since github actions are limited to X minutes for free it benefits everyone.

Ironically the thing that we're building requires the use of npm install at least once (most probably twice) per run. but there is not much that we can do about that!

now that we have the basic action, lets try building our ember app and extracting those asset sizes!

## building the ember app

There seems to be an "official toolkit" for interacting with the command line or with the repo https://github.com/actions/toolkit so we're going to try out using `@actions/exec` to run `npm install` and `npx ember build -prod`

(refer to the code)

when we run this it seems to not work. the thing is that we are dependent on there being a step defined before ours that actually does the checkout of the repo (which might be problematic if we want to be able to checkout the target of the PR to compare but we'll get to that in a minute).

So for now we need to make sure that `uses: actions/checkout@master` is part of the config:

```yaml
name: Node CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@master
    - uses: simplabs/ember-asset-size-action@master
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
```
