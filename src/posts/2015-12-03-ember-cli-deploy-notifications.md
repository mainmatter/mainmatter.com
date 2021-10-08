---
title: "ember-cli-deploy-notifications"
authorHandle: LevelbossMike
bio: "Full-Stack Engineer, Ember CLI Deploy core team member"
description:
  "Michael Klein introduces ember-cli-deploy-notifications, an ember-cli-deploy
  plugin for invoking arbitrary webhooks during the deployment process."
tags: ember
---

A few weeks ago a new version of the _"official"_ ember deployment solution
[ember-cli-deploy](http://ember-cli-deploy.com/) was released:

> ember-cli-deploy 0.5 is now released and ready for use with a great docs site
> and already-rich plugin ecosystem:
> <a href="https://t.co/6yhjmjQrYD">https://t.co/6yhjmjQrYD</a> <author>Luke
> Melia (@lukemelia)
> <a href="https://twitter.com/lukemelia/status/659787938625134592">29. Oktober
> 2015</a></author>

<!--break-->

Aaron Chambers and me gave detailed walkthroughs of the basic ideas behind the
pipeline at the [Ember-London](https://vimeo.com/139125310) and
[Ember.js-Munich](https://www.youtube.com/watch?v=d4xwIv_9Cg0) meetups
respectively.

The new release **encourages heavy use of
[deploy plugins](http://emberobserver.com/categories/ember-cli-deploy-plugins)
that all implement different parts of a deployment via
[hooks](http://ember-cli-deploy.com/docs/v0.5.x/pipeline-hooks/)** and are
themselves Ember CLI addons. What wasn’t available though was a plugin for
notifying external webservices (e.g. an error-tracking service) during or after
deployments so we decided to write one.

## Introducing ember-cli-deploy-notifications

[ember-cli-deploy-notifications](https://github.com/simplabs/ember-cli-deploy-notifications)
**makes it easy to notify external services** by adding them to a
`notifications.services.<service>` property in `config/deploy.js`. First you
have to install the addon:

```bash
ember install ember-cli-deploy-notifications
```

The second step is to configure the services that you want to notify while
executing the deployment pipeline.

```js
// config/deploy.js
module.exports = function (deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        bugsnag: {
          didActivate: {
            apiKey: "",
          },
        },
      },
    },
  };

  return ENV;
};
```

Every time a new revision gets activated now by `ember-cli-deploy`,
`ember-cli-deploy-notifications` will sent a `POST` request to the bugsnag
service to notify it of the newly activated deployment revision.

## Customization

We figured out that there are a lot of different internal and external services
that users of ember-cli-deploy wanted to notify when executing the deploy
pipeline. Thus **we wanted to make `ember-cli-deploy-notifications` as flexible
as possible but still keep things easy and simple** for the most basic use
cases.

Based on that assumption we came up with the idea of _"preconfigured"_ and
_"custom"_ services.

### Custom services

**Services need to be configured with values for `url`, `headers`, `method` and
`body`**. We figured out that these are all the necessary parts of a webservice
request that you need to be able to customize.

**Additionally you need to provide a property named the same as the hook that
you want the service to be notified on** when running through the deploy
pipeline (as we wouldn’t know when to notify a service otherwise):

```js
// config/deploy.js
module.exports = function (deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        simplabs: {
          url: "https://notify.simplabs.com/deploy",
          headers: {},
          method: "POST",
          body: function (context) {
            var deployer = context.deployer;

            return {
              secret: "supersecret",
              deployer: deployer,
            };
          },
          didActivate: true,
        },
      },
    },
  };

  return ENV;
};
```

`url`, `headers`, `method` and `body` are the basic ideas behind the service
abstraction in ember-cli-deploy-notifications but to keep things simple you
don’t have to provide `headers` and `method` for every custom service as these
properties will default to `{}` and `'POST'` respectively.

As you can see service configuration properties can either be defined directly
or generated dynamically based on the
[deployment context](http://ember-cli-deploy.com/docs/v0.5.x/deployment-context/).
`this` will always point to the service’s configuration itself in all of these
functions which enables you to do things like this:

```js
// config/deploy.js
module.exports = function(deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        slack: {
          webhookURL: ''
          url: function() {
            return this.webhookURL;
          },
          body: {
            text: 'A new revision was deployed!'
          },
          didActivate: true
        }
      }
    }
  };

  return ENV;
};
```

The configuration properties named the same as ember-cli-deploy’s pipeline-hooks
can also be used to override configuration defaults on a per hook basis:

```js
// config/deploy.js
module.exports = function (deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        slack: {
          url: "",
          body: {
            text: "A new revision was deployed!",
          },
          didActivate: true,
          didFail: {
            body: {
              text: "Deployment failed!",
            },
          },
        },
      },
    },
  };

  return ENV;
};
```

### Preconfigured services

As we wanted to make it as easy as possible to get started with
ember-cli-deploy-notifications **there are already some preconfigured
services**.

Preconfigured services differ from custom services in the fact that the
community has already provided a default configuration for these services. **For
example the popular error tracking service [bugsnag](http://bugsnag.com) is
already preconfigured which makes it easy to use out of the box** with
ember-cli-deploy-notifications:

```js
// config/deploy.js
module.exports = function (deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        bugsnag: {
          apiKey: "",
          didActivate: true,
        },
      },
    },
  };

  return ENV;
};
```

There is also a preconfigured service for slack.

## Next Steps

**We are excited to share this small ember-cli-deploy plugin with the ember
community and would like to hear your feedback!** We are already using it in
client projects and, though pretty small, found it to be a very useful addition
to our deployment workflow.

Please refer to the project’s
[README](https://github.com/simplabs/ember-cli-deploy-notifications#readme) for
more detailed information about the plugin and don’t hesitate to open issues or
ask questions, we’re happy to support you in setting up a great deployment
workflow for your Ember applications.
