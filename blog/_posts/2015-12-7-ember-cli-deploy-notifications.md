---
layout: article
section: Blog
title: "ember-cli-deploy-notifications"
author: "Ganesh Balasubramanian"
---

A few weeks ago a new version of the “official” ember deployment solution ember-cli-deploy was released:

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">ember-cli-deploy 0.5 is now released and ready for use with a great docs site and already-rich plugin ecosystem: <a href="https://t.co/6yhjmjQrYD">https://t.co/6yhjmjQrYD</a></p>&mdash; Luke Melia (@lukemelia) <a href="https://twitter.com/lukemelia/status/659787938625134592">October 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Aaron Chambers and me gave detailed walkthroughs of the basic ideas behind the pipeline at the [Ember-London](https://vimeo.com/139125310) and [Ember.js-Munich](https://www.youtube.com/watch?v=d4xwIv_9Cg0) meetups respectively.
<!--break-->

The new release encourages heavy use of [deploy plugins](http://emberobserver.com/categories/ember-cli-deploy-plugins) that all implement different parts of a deployment via [hooks](http://ember-cli.com/ember-cli-deploy/docs/v0.5.x/pipeline-hooks/) and are themselves Ember CLI addons. What wasn’t available though was a plugin for notifying external webservices (e.g. an error-tracking service) during or after deployments so we decided to write one.

## Introducing ember-cli-deploy-notifications

[ember-cli-deploy-notifications](https://github.com/simplabs/ember-cli-deploy-notifications) makes it easy to notify external services by adding them to a notifications.services.<service> property in config/deploy.js. First you have to install the addon:

> ember install ember-cli-deploy-notifications

The second step is to configure the services that you want to notify while executing the deployment pipeline.

{% highlight js lineos %}
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
{% endhighlight %}

Every time a new revision gets activated now by ember-cli-deploy, **ember-cli-deploy-notifications** will sent a **POST** request to the bugsnag service to notify it of the newly activated deployment revision.

Based on that assumption we came up with the idea of _“preconfigured”_ and _“custom”_ services.

## Custom services

Services need to be configured with values for **url**, **headers**, **method** and **body**. We figured out that these are all the necessary parts of a webservice request that you need to be able to customize.

Additionally you need to provide a property named the same as the hook that you want the service to be notified on when running through the deploy pipeline (as we wouldn’t know when to notify a service otherwise):

{% highlight js lineos %}
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
{% endhighlight %}

The configuration properties named the same as ember-cli-deploy’s pipeline-hooks can also be used to override configuration defaults on a per hook basis:

{% highlight js lineos %}
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
{% endhighlight %}

## Preconfigured services

As we wanted to make it as easy as possible to get started with ember-cli-deploy-notifications there are already some preconfigured services.

Preconfigured services differ from custom services in the fact that the community has already provided a default configuration for these services. For example the popular error tracking service [bugsnag](https://bugsnag.com/) is already preconfigured which makes it easy to use out of the box with ember-cli-deploy-notifications:

{% highlight js lineos %}
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
{% endhighlight %}

There is also a preconfigured service for slack.

## Next Steps

We are excited to share this small ember-cli-deploy plugin with the ember community and would like to hear your feedback! We are already using it in client projects and, though pretty small, found it to be a very useful addition to our deployment workflow.

Please refer to the project’s [README](https://github.com/simplabs/ember-cli-deploy-notifications) for more detailed information about the plugin and don’t hesitate to open issues or ask questions, we’re happy to support you in setting up a great deployment workflow for your Ember applications.
