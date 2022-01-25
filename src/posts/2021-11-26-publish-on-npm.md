---
title: "3 ways you can improve your npm publish"
authorHandle: tobiasbieniek
tags: javascript
bio: "Senior Software Engineer"
description:
  "Tobias Bieniek explains mechanisms for automating npm releases for reduced
  effort and improved reliability with lerna-changelog and release-it."
og:
  image: /assets/images/posts/2021-11-26-publish-on-npm/og-image.png
tagline: |
  <p>Publishing JavaScript projects on <a href="https://www.npmjs.com">npm</a> can become quite an overwhelming task when projects grow to a certain size. At simplabs we're maintaining over a dozen actively used JavaScript projects that we've published on npm. We don't always have plenty of time for that, but we made sure that at least the release process is as automated as possible, so that we can spend our time on the things that really matter.</p> <p>This blog post will show you three of our most important tricks to improve how you publish your packages to npm.</p>
image: "/assets/images/photos/coding.jpg"
imageAlt: "Woman reading code documentation at her laptop"
---

## Let CI do the work

While you can run `npm publish` locally, it can cause issues. I'm personally
using [JetBrains IntelliJ](https://www.jetbrains.com/idea/) to develop software
and it puts an `.idea` folder in each project. I've stopped counting how many
times I've accidentally published this folder to npm in the past…

I've managed to not commit this folder to any of our git repositories because
I've set up a
[global `.gitignore` file](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files#configuring-ignored-files-for-all-repositories-on-your-computer),
but unfortunately no such thing exists for `.npmignore` files. 😢

There are obviously other ways to avoid this issue, but we've found that one of
the easiest ways is to just not publish from your local machine, and instead
have your CI workflow publish the package whenever you push a tag to the
repository. As an added benefit: you'll never forget to push the tag to the
repository because it's now required to actually publish the package! 🥳

How to set this up largely depends on what CI system you are using. For our
open-source projects we use GitHub Actions these days, and a typical `release`
workflow file looks like this:

```yaml
name: Release

on:
  push:
    tags:
      - "*"

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 14.x
          registry-url: "https://registry.npmjs.org"

      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Let's go through this file step by step…

The `name` field describes what this workflow will be called in the GitHub
Actions user interface.

The `on` object specifies when this workflow should run. In this case we are
configuring it to run whenever a tag is pushed to the repository, and the `*`
wildcard means that we don't care about what the exact tag name is.

`jobs` is a bit misleading, because in this workflow we only have a single job:
`release`. In this job we will first copy the code onto the CI machine
(`checkout`), and then setup Node.js. It is important here to explicitly specify
the `registry-url` because otherwise the following `npm publish` command won't
work. Here, we just use the official npm registry, but it is equally possible to
publish packages to a company-internal private registry, if needed.

Lastly, we call `npm publish`. For this to succeed we need to be logged in…
which we are not 🙈

An alternative to using `npm login` on CI is providing an "access token" through
e.g. the `NODE_AUTH_TOKEN` environment variable. But where do you get such a
token? The answer is: on the npm website:

- Go to <https://www.npmjs.com>
- Log in, if you haven't already
- Click your avatar on the top right corner of the page
- Click on "Access Tokens"
- Click the "Generate New Token" button
- Select the "Automation" token type
- Click the "Generate Token" button

Now you can copy the newly generated token and save it as a `NPM_TOKEN` secret
in the settings of your GitHub repository.

While this generally works great for us, there are currently at least two
downsides of this approach that you should be aware of:

- There is no difference anymore between commit/push access and publish access.
  This means that anyone that can push to your repository can now also publish
  new releases on npm. This is usually not a big problem, but you should be
  aware that it removes one of the security layers from the publishing process
  in favor of the CI publishing convenience.

- The generated npm token currently provides publish access to **all** npm
  packages that the account has access to. Fixing this is on the roadmap of the
  npm team, and at some point you will be able to generate tokens that can only
  access a subset of your projects.

For us, the convenience of only having to push a tag currently outweighs the
disadvantages mentioned above, but it is still valuable to know what the
tradeoffs are.

## Keep a change log

When you see that one of your dependencies has an update available, how do you
figure out what changed between your current version and the update?

You can look at the diff of the two versions, but that usually requires somewhat
deep knowledge of how the dependency works internally. In an ideal world every
project would have a `CHANGELOG.md` file, that describes what has changed
between the individual versions. Unfortunately, not all projects keep such a
file because maintaining such a file is often perceived as a significant
workload.

To reduce the work that is needed to maintain a changelog file we can use
changelog generators. These tools usually look at the git commits between the
current version and the last release and output an overview of what the relevant
changes were.

The changelog generator that we like to use at simplabs is: [lerna-changelog].

[lerna-changelog]: https://github.com/lerna/lerna-changelog

We don't want to go into too much detail here, but this is essentially how it
works: lerna-changelog looks at the commits and searches for commit messages
that look like pull-request merge commits. It then requests more information
about the corresponding pull-requests from the GitHub API, including the labels
of that pull-request. Next, it groups the PRs by their labels and outputs them
based on that grouping.

Here is an example of the lerna-changelog changelog itself:

```md
## v2.0.1 (2021-08-07)

#### :bug: Bug Fix

- [#296](https://github.com/lerna/lerna-changelog/pull/296) Omit commiters line
  when all are filtered out ([@petrch87](https://github.com/petrch87))
- [#398](https://github.com/lerna/lerna-changelog/pull/398) Fix handling of
  --next-version-from-metadata option
  ([@contolini](https://github.com/contolini))

#### :house: Internal

- [#494](https://github.com/lerna/lerna-changelog/pull/494) Update yargs to
  v17.x ([@Turbo87](https://github.com/Turbo87))
- [#493](https://github.com/lerna/lerna-changelog/pull/493) CI: Run
  `pnpm install` before `npm publish` ([@Turbo87](https://github.com/Turbo87))

#### Committers: 3

- Chris Contolini ([@contolini](https://github.com/contolini))
- Petr Chňoupek ([@petrch87](https://github.com/petrch87))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
```

One thing to be aware of is that lerna-changelog will only include PRs in the
changelog that have one of these supported labels:

- `breaking` (💥 Breaking Change)
- `enhancement` (🚀 Enhancement)
- `bug` (🐛 Bug Fix)
- `documentation` (📝 Documentation)
- `internal` (🏠 Internal)

These labels are configurable, but using a label that is not configured might
cause the PR to not show up in the listing. This behavior is an ongoing
discussion and might change in the future, but this is currently how it works.

The way to use lerna-changelog is: when you bump the `version` in your
`package.json` file, commit that change, and tag the commit, but you should also
update the `CHANGELOG.md` with the latest changes for that particular version:

```bash
npx lerna-changelog
```

lerna-changelog usually figures out automatically what the last published
version was, but if that does not work you can help by providing the `--from`
CLI option. Similarly, if it can't figure out the GitHub URL of the project, you
can help by setting it manually via `--repo`.

## Automate everything

Now that we've made our publishing process more complicated again by needing to
update the changelog, let's simplify it by automating everything. 🤖

There is a CLI tool on npm called
[`release-it`](https://github.com/release-it/release-it), which describes itself
as:

> Generic CLI tool to automate versioning and package publishing related tasks

That sounds like exactly what we need! 😊

Our configuration file for `release-it` usually looks like this:

```js
{% raw %}
module.exports = {
  plugins: {
    'release-it-lerna-changelog': {
      infile: 'CHANGELOG.md',
    },
  },
  git: {
    commitMessage: 'v${version}',
    tagName: 'v${version}',
  },
  github: {
    release: true,
    releaseName: 'v${version}',
    tokenRef: 'GITHUB_AUTH',
  },
  npm: {
    publish: false,
  },
};
{% endraw %}
```

In the `plugins` section we specify that we want to use the
[`release-it-lerna-changelog`](https://github.com/rwjblue/release-it-lerna-changelog)
plugin to integrate lerna-changelog in our release process.

The `git` section configures what the commit message and tag names are supposed
to look like, and in the `github` section we specify that we would also like to
automatically create a "Release" on GitHub with the corresponding changelog
attached.

Finally, we want to take advantage of our automatic CI publishing process, so we
tell `release-it` to not run `npm publish` for us.

After adding `release-it` and `release-it-lerna-changelog` as dev dependencies,
and putting the configuration above in a `.release-it.js` file we can run the
tool to see how it works:

```bash
npx release-it
```

The first thing that `release-it` does is assembling the changelog, so that you
can better judge whether this should be a major, minor or patch release.
Conveniently, it asks you this exact question right after showing you the
changelog preview.

Once you have chosen the version number, it will update the `version` field in
the `package.json` file and update the `CHANGELOG.md`. Afterwards it will ask
you to confirm that the files should be committed like this, and if you confirm,
it will ask you whether the new commit should now be tagged. The cool part is
that you can abort at any time and `release-it` will automatically clean up and
revert you to the same state as before.

The final two confirmations are for pushing the commit and tag to GitHub and
then creating the Release on GitHub. Once all of this is confirmed you can sit
back and watch the CI machines take over.

To summarize, releasing a new version is now only a matter of running
`release-it`, choosing a version number and then confirming a few actions, which
usually shouldn't take more than a few seconds. As a bonus, this updated release
process will automatically maintain the `CHANGELOG.md` file for you!

The instructions in this blog post were primarily aimed at JavaScript projects
that are hosted on GitHub, but we've also set up similar processes, tools and
automations for projects on private GitLab instances, Rust projects, and also
with different changelog generators. If you need any help setting this up, don't
hesitate to [contact] us.

[contact]: https://simplabs.com/contact/
