---
layout: article
section: Blog
title: "ember-cli-deploy-notifications"
author: "Michael Klein"
twitter-handle: LevelbossMike
github-handle: LevelbossMike
---

**A few weeks ago a new version of the _“official”_ ember deployment solution [ember-cli-deploy](http://t.umblr.com/redirect?z=http%3A%2F%2Fember-cli.github.io%2Fember-cli-deploy%2F&t=ZjdiOTNiMzU2MjQ5ZWJmMzJiNTA5YjM1OTZiMTI1M2JkMjM0ZDg1MyxrVEZrWEV4YQ%3D%3D) was released:**

<blockquote class="twitter-tweet" lang="de"><p lang="en" dir="ltr">ember-cli-deploy 0.5 is now released and ready for use with a great docs site and already-rich plugin ecosystem: <a href="https://t.co/6yhjmjQrYD">https://t.co/6yhjmjQrYD</a></p>&mdash; Luke Melia (@lukemelia) <a href="https://twitter.com/lukemelia/status/659787938625134592">29. Oktober 2015</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
<!--break-->

Aaron Chambers and me gave detailed walkthroughs of the basic ideas behind the pipeline at the [Ember-London](http://t.umblr.com/redirect?z=https%3A%2F%2Fvimeo.com%2F139125310&t=YTU1NDVlM2JmMzQzODFhZTYyZmNkZWI0MGRiNzg4YTU0ZWUyNGE5NyxrVEZrWEV4YQ%3D%3D) and [Ember.js-Munich](http://t.umblr.com/redirect?z=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dd4xwIv_9Cg0&t=OWRjODhkZmEwODlhOWQ5ODI0MGU4OTMwZDA4OGEwYmQyZWFmNWQ1NSxrVEZrWEV4YQ%3D%3D) meetups respectively.

The new release **encourages heavy use of [deploy plugins](http://t.umblr.com/redirect?z=http%3A%2F%2Femberobserver.com%2Fcategories%2Fember-cli-deploy-plugins&t=OGFhZmM5YzQ0ZWViM2Y3OWIxM2I0OTcyZjVjMzViMDc2NjcxMDViNixrVEZrWEV4YQ%3D%3D) that all implement different parts of a deployment via [hooks](http://t.umblr.com/redirect?z=http%3A%2F%2Fember-cli.com%2Fember-cli-deploy%2Fdocs%2Fv0.5.x%2Fpipeline-hooks%2F&t=OGU2Y2FhYzdlNDQ3ZjBiNTYxYTZmMzE0ZWM2NTg4MmUyZGZmN2YzNSxrVEZrWEV4YQ%3D%3D)** and are themselves Ember CLI addons. What wasn’t available though was a plugin for notifying external webservices (e.g. an error-tracking service) during or after deployments so we decided to write one.

#### Introducing ember-cli-deploy-notifications

[ember-cli-deploy-notifications](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-cli-deploy-notifications&t=NGU3YTMzNDdjYmZlODk2YWNjOWVmMWIxMWE1ZGQ3ZTdkMzE0ZjFiOCxrVEZrWEV4YQ%3D%3D) **makes it easy to notify external services** by adding them to a `notifications.services.<service>` property in `config/deploy.js`. First you have to install the addon:



```
ember install ember-cli-deploy-notifications
```



The second step is to configure the services that you want to notify while executing the deployment pipeline.



```
// config/deploy.js
module.exports = function(deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        bugsnag: {
          didActivate: {
            apiKey: ''
          }
        }
      }
    }
  };

  return ENV;
}
```



Every time a new revision gets activated now by `ember-cli-deploy`, `ember-cli-deploy-notifications` will sent a `POST` request to the bugsnag service to notify it of the newly activated deployment revision.

#### Customization

We figured out that there are a lot of different internal and external services that users of ember-cli-deploy wanted to notify when executing the deploy pipeline. Thus **we wanted to make `ember-cli-deploy-notifications` as flexible as possible but still keep things easy and simple** for the most basic use cases.

Based on that assumption we came up with the idea of _“preconfigured”_ and _“custom”_ services.

**Custom services**

**Services need to be configured with values for `url`, `headers`, `method` and `body`**. We figured out that these are all the necessary parts of a webservice request that you need to be able to customize.

**Additionally you need to provide a property named the same as the hook that you want the service to be notified on** when running through the deploy pipeline (as we wouldn’t know when to notify a service otherwise):



```js
// config/deploy.js
module.exports = function(deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        simplabs: {
          url: 'https://notify.simplabs.com/deploy',
          headers: {},
          method: 'POST',
          body: function(context) {
            var deployer = context.deployer;

            return {
              secret: 'supersecret',
              deployer: deployer
            }
          },
          didActivate: true
        }
      }
    }
  };

  return ENV;
};
```



`url`, `headers`, `method` and `body` are the basic ideas behind the service abstraction in ember-cli-deploy-notifications but to keep things simple you don’t have to provide `headers` and `method` for every custom service as these properties will default to `{}` and `'POST'` respectively.

As you can see service configuration properties can either be defined directly or generated dynamically based on the [deployment context](http://t.umblr.com/redirect?z=http%3A%2F%2Fember-cli.com%2Fember-cli-deploy%2Fdocs%2Fv0.5.x%2Fdeployment-context%2F&t=NmUzYWVmMjM2ZDY4M2FmM2NkOWEyY2MwMjkwZjU0Yjk2ZmNhNmI1MCxrVEZrWEV4YQ%3D%3D). `this` will always point to the service’s configuration itself in all of these functions which enables you to do things like this:



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



The configuration properties named the same as ember-cli-deploy’s pipeline-hooks can also be used to override configuration defaults on a per hook basis:



```js
// config/deploy.js
module.exports = function(deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        slack: {
          url: '',
          body: {
            text: 'A new revision was deployed!'
          },
          didActivate: true,
          didFail: {
            body: {
              text: 'Deployment failed!'
            }
          }
        }
      }
    }
  };

  return ENV;
};
```



**Preconfigured services**

As we wanted to make it as easy as possible to get started with ember-cli-deploy-notifications **there are already some preconfigured services**.

Preconfigured services differ from custom services in the fact that the community has already provided a default configuration for these services. **For example the popular error tracking service [bugsnag](http://t.umblr.com/redirect?z=https%3A%2F%2Fbugsnag.com&t=N2RlYTkzZGViNzEzNTY5YTQ5ZjljOGM2ZTJhNzMzZTQ0ZTI3NjIwMSxrVEZrWEV4YQ%3D%3D) is already preconfigured which makes it easy to use out of the box** with ember-cli-deploy-notifications:



```js
// config/deploy.js
module.exports = function(deployTarget) {
  var ENV = {
    // ...

    notifications: {
      services: {
        bugsnag: {
          apiKey: '',
          didActivate: true,
        }
      }
    }
  };

  return ENV;
};
```



There is also a preconfigured service for slack.

#### Next Steps

**We are excited to share this small ember-cli-deploy plugin with the ember community and would like to hear your feedback!** We are already using it in client projects and, though pretty small, found it to be a very useful addition to our deployment workflow.

Please refer to the project’s [README](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-cli-deploy-notifications&t=NGU3YTMzNDdjYmZlODk2YWNjOWVmMWIxMWE1ZGQ3ZTdkMzE0ZjFiOCxrVEZrWEV4YQ%3D%3D) for more detailed information about the plugin and don’t hesitate to open issues or ask questions, we’re happy to support you in setting up a great deployment workflow for your Ember applications.