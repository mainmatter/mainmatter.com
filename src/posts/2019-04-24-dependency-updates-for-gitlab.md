---
title: 'Automated dependency updates for your internal GitLab server️'
authorHandle: tobiasbieniek
topic: misc
bio: 'Senior Frontend Engineer, Ember CLI core team member'
description:
  'Tobias Bieniek shares how to set up the Renovate bot for automatic dependency
  updates with self-hosted internal GitLab servers.'
og:
  image: /assets/images/posts/2019-04-24-dependency-updates-for-gitlab/og-image.png
---

Are your dependencies hopelessly outdated? Would you need to hire another
developer just to keep up with the maintenance work of keeping them up-to-date?
If those questions match your project then this blog post is for you. Keep
reading and we will show you how to solve a lot of these issues with some easy
to use tools.

<!--break-->

In our previous blog post on [Open Source Maintenance][open-source-maintenance]
we revealed that we are big fans of dependency update services like
[Greenkeeper][greenkeeper] or [dependabot][dependabot].

These services help you reduce the burden of maintaining a project by creating
pull requests for you whenever there is a dependency that can be updated. That
could be because of new features in those dependencies or more importantly
because of bugs or security issues. dependabot will even label the PR with
`security` in those cases!

## Renovate

Another similar service is called [Renovate][renovate]. The main difference:
Renovate is an open source project that you can run yourself, if you want to.
The hosted service works fine if your project is on [GitHub][gh] or
[GitLab][gl], but if you're using a self-hosted internal GitLab server you will
have to run the service yourself. Fear not, this sounds a lot more complicated
than it actually is, and the rest of this blog post will show you how to do it.

Before we start, let's make sure we are all in the same boat. The most common
setup we have found when working with our clients is running GitLab on a
self-hosted server within the corporate firewall and VPN. Most of the time that
includes using [GitLab CI][gl-ci] to run the test suite for new commits or merge
requests. This blog post is assuming the above setup and having GitLab CI set up
to use the "[Docker executor][docker-executor]".

To give you a rough idea of how we will set this up: Renovate will use a
dedicated user account on your GitLab instance to open merge requests. It will
also have a dedicated repository for the main configuration and GitLab CI on
that repository will take care of regularly running the Renovate bot.

Now, let's get started setting this up!

## GitLab User Account

Depending on how your GitLab instance is set up you can either sign up a new
account for our renovate bot yourself, or you may have to ask your admins to
create a new account for you.

Once that account exists, we will have to create a "Personal Access Token" for
the account, so that our Renovate bot can use it without us having to give it
the password directly. This is important, because when you give away the
password the account can be hijacked, but when you only give away a token you
have control over the actions that can be performed with that token.

To create such a token, follow the instructions in the
[GitLab docs](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html).
In short:

- Go to the "Settings > Access Tokens" page
- Enter "Renovate" as the "Name"
- Choose the `api` scope
- Click the "Create personal access token" button
- Save the generated token somewhere until we need it later

Finally, make sure that our new GitLab account has access to the projects that
you want it to run on. It will need to have at least "Developer" permissions so
that the bot is able to create branches and push updates to those branches.

## Renovate Repository

As mentioned before, we will put the main configuration file into a dedicated
repository. You can create the repository either under your personal account,
the new Renovate account or, ideally, in the same GitLab group where you keep
all your other projects.

Let's start off with a blank repository and then we will add the necessary files
as we go. Once the repository is created, `git clone` it to your local machine
so that we can create some content.

Renovate is a JavaScript-based project, but it supports updating dependencies of
a lot of other languages too. Because it is based on JavaScript we will use
`npm` (or `yarn` if you prefer) to install it and for that the first file we
will create is the `package.json` file:

<!-- prettier-ignore -->
```json
{
  "name": "renovate-bot",
  "version": "0.0.0",
  "private": true,
  "description": "Configuration for the Renovate bot at ACME Corp.",
  "repository": "git@gitlab.acme.com:acme/renovate-bot.git",
  "author": "Tobias Bieniek <tobias.bieniek@simplabs.com>",
  "scripts": {
    "renovate": "renovate"
  },
  "dependencies": {
    "renovate": "^15.0.0"
  }
}
```

Afterwards, run `npm install` in the repository to install the `renovate`
package into the `node_modules` folder. This step should also create a
`package-lock.json` file which we will commit to the repository together with
the new `package.json` file.

You may have noticed that `git status` shows you a lot of new files in the
`node_modules` folder, so the next quick step we will do is create a
`.gitignore` file, with just `node_modules` in it, to ignore that folder from
now on.

Great, we're almost there!

## Renovate Configuration

The last step before we can try things out is adding that main configuration
file, that we've been talking about before. Renovate expects this to be called
`config.js`, so let's create a file with that name. Inside of it we will
configure how Renovate will behave by default. Note that most of this can be
overridden on a per-repository basis.

<!-- prettier-ignore -->
```js
module.exports = {
  platform: 'gitlab',
  endpoint: 'https://gitlab.acme.com/api/v4/',
  token: process.env.RENOVATE_TOKEN,

  repositories: [
    'acme/amber-js',
  ],

  logLevel: 'info',

  requireConfig: true,
  onboarding: true,
  onboardingConfig: {
    extends: ['config:base'],
    prConcurrentLimit: 5,
  },

  enabledManagers: [
    'npm',
  ],
};
```

The first section of the file above tells our Renovate bot how to talk to our
self-hosted GitLab instance. Afterwards we tell it on which repositories it
should run, we configure how much log output we want to see and what the
`renovate.json` config file should look like that it will add to each repository
in the first merge request.

You may have noticed that we did not put the `token` in the config file
directly, instead we use an environment variable so that someone with read
access to the repository can't easily steal it.

Now let's run it! Open up a terminal, navigate to the repository and run:

```
npm run renovate -- --dry-run
```

Don't worry, the `--dry-run` means it won't actually do anything yet but it will
show you what it would do. Most likely you will be greeted by an error like
this:

> Fatal error: No authentication found

Which makes sense, because we haven't set up the `RENOVATE_TOKEN` environment
variable yet. Instead of doing that, let's quickly paste our generated token
into the `config.js` file: e.g. `token: 'WCufshK3rDP1yemwkWQc'`, save and try
again.

You should now see our little bot do its work, analyze the current state of your
projects and figure out what it needs to do next.

Before we commit this configuration file to the project make sure to change the
`token` line back to use the `RENOVATE_TOKEN` and then commit the file and push
it to the repository.

## Using GitLab CI

We now have a way to run our Renovate bot manually, but that is not what we
want. We want to automate all the things! ... and GitLab CI is a great way to do
just that.

The first thing we need to do is teach GitLab CI about our `RENOVATE_TOKEN`
environment variable. We can do so on the "Settings > CI / CD" page of our
project in GitLab. In the "Variables" section enter `RENOVATE_TOKEN` as the
"variable key" and your generated token (e.g. `WCufshK3rDP1yemwkWQc`) as the
"variable value". Finally, make sure that the "Protected" switch is turned on
and then press the "Save variables" button.

Now we will set up the GitLab CI job that will run our bot. For that we need to
create another file in the repository called `.gitlab-ci.yml`:

```yaml
image: node:10

stages:
  - run

run:
  only:
    - schedules
  stage: run
  before_script:
    - npm install
  script:
    - npm run renovate
```

Commit that file to the repository, push the changes and ... nothing happens.
Why? Because our new `run` job will only run when triggered by something called
"schedules". Let's configure a schedule then!

In the "CI / CD" menu of the project on GitLab you should find a menu entry
called "Schedules". Clicking on that will take you to a page with a "New
schedule" button, which we will immediately click too. The "Schedule a new
pipeline" form should now show up in your browser and we will fill it like this:

- Description: "Hourly run"
- Interval Pattern: Custom (`0 * * * *`)
- Target Branch: `master`
- Active: Yes, please!

Now, click the "Save pipeline schedule" button and GitLab will take you back to
the "Schedules" page showing our newly created schedule.

Aaaand that's it! Some time in the next hour GitLab CI should trigger the `run`
job, that will run our Renovate bot, and that will create merge requests on your
configured repositories.

If you need more help getting this set up or if you want to talk about any of
the topics here in more detail please do [contact us](/contact/)! If you enjoyed
this blog post you can also let us know via [Twitter].

[open-source-maintenance]: /blog/2018/11/27/open-source-maintenance/
[greenkeeper]: https://greenkeeper.io/
[dependabot]: https://dependabot.com/
[renovate]: https://github.com/renovatebot/renovate/
[gh]: https://github.com/
[gl]: https://about.gitlab.com/
[gl-ci]: https://about.gitlab.com/product/continuous-integration/
[docker-executor]: https://docs.gitlab.com/runner/executors/docker.html
[twitter]: http://twitter.com/simplabs/
