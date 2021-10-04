---
title: "Trying your GitHub Actions locally"
authorHandle: sami_dbc
topic: github
bio: "Senior Frontend Engineer"
description: "Samanta de Barros on how to try locally your GitHub Actions"
og:
  image: /assets/images/posts/2021-03-15-trying-github-actions-locally/og-image.png
---

If, like me, configuring [GitHub Actions](https://docs.github.com/en/actions) is
not your thing and you find yourself wanting to try something before actually
pushing it to GitHub (and having to see the effects on real-life), follow this
step by step of how to run your GitHub Actions on your own computer.

<!--break-->

![Trying your GitHub Actions locally illustration](/assets/images/posts/2021-03-15-trying-github-actions-locally/illustration.svg#full)

GitHub Actions is a service from GitHub that allows you to automate certain
tasks of your development cycle, right from your repository. It allows you to
define a series of commands to be run on specified events, and takes care of
executing those commands and providing you feedback. You can for instance, run
tests when code is pushed to a branch, or do a deployment when code is merged to
master.

You may run into the situation where you have to change your action, push it,
and wait for GitHub to run it to see if your changes work as intended. In my
case, I wanted to test an action that is in charge of releasing
[ember-simple-auth](https://github.com/simplabs/ember-simple-auth), to see if
the change I had made worked as I intended. I wanted to avoid having to make a
release for this and see it fail. After some digging, I couldn't find a way to
do a dry run of the action from GitHub, but I found
[act](https://github.com/nektos/act), a library that lets you run your GitHub
Actions locally.

The library requires Docker, where it builds the images defined in your actions
and later runs them. So you'll have to install that first. After Docker and
[act]() are installed, you can start trying out your actions! There are two ways
to achieve that: telling `act` to trigger an event (see
[list of events](https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads))
or to run a job by passing its name.

To trigger an event, from your project folder, you can run `act event_name`. The
default event is `push` (no need to pass it as an argument). To run a specific
job, you can do `act -j job_name`.

You can also list all the available actions in your project folder by running
`act -l`, or run `act event_name -l` to see all the actions run for a specific
event.

As an example, our release workflow looks something like this:

```jsx
on:
  push:
    tags:
      - '*'

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: 12.x
          registry-url: 'https://registry.npmjs.org'

      - name: copy readme to package folder
        run: cp README.md packages/ember-simple-auth
      - name: publish to npm
        run: cd packages/ember-simple-auth && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

On every push of a tag, we release whatever is in that tag to npm.

To try it out, we can run `act -j release` which uses the job name. When doing
so, you will see an output that's roughly like this:

![Example output of running act](/assets/images/posts/2021-03-15-trying-github-actions-locally/act-run.mp4#video)

In my case, I wanted to make sure the `npm` tarball included the `README` file,
which is shown in the publish output here:

![Partial view of npm publish output where README file can be seen](/assets/images/posts/2021-03-15-trying-github-actions-locally/readme-output.png#@800-1600)

After that, I committed my changes with confidence.

P.S.: `act` is still under development, occasionally you may run into errors
like these:
{% raw %}

```
Error: yaml: unmarshal errors:
  line 92: cannot unmarshal !!str `${{ mat...` into bool
```

It could mean a specific syntax is not yet supported, in this case, the use of
`${{...}}` in `continue-on-error`. Since this wasn't part of the
workflow/actions I wanted to try, I just worked around that by commenting that
line so `act` wouldn't fail when parsing my actions.
{% endraw %}
