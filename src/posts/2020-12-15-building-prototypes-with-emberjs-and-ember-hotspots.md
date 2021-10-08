---
title: "Building prototypes with Ember.js"
authorHandle: pichfl
tags: ember
bio: "Consultant for Design & Technology"
description:
  "Create click dummies and prototypes that can grow over your initial ideas
  with ease and the full force of the Ember.js ecosystem."
og:
  image: /assets/images/posts/2020-12-15-building-prototypes-with-emberjs-and-ember-hotspots/og-image.png
---

Have you ever been in charge of creating click dummies, interactive demos or
that thing that is made from static images and enriched with hotspots, page
transitions and states?

Reaching for Invision or Marvel or the built-in features in Figma, Sketch or
Adobe XD is your obvious choice. About 90% into the project you realize you need
something in the demo which can't be done in the tool you chose. You hit the
same wall I did a while ago.

I was looking for alternative solutions and while Framer does provide many
possibilities, I wished there was a different tool which would sit closer to the
apps we write for our clients. Dummies are a helpful tool to explore new ideas
inside an existing product after all.

Given our client apps are written in Ember.js this was bound to be a new addon
for the Ember community. Allowing you to create prototypes, while using little
code, but with the full power of the Ember.js ecosystem whenever you need it,
thus making it easier to explore new ideas no matter if you start from scratch
or want to improve on an existing prject.

<!--break-->

![Better click dummies and prototypes with Ember.js](/assets/images/posts/2020-12-15-building-prototypes-with-emberjs-and-ember-hotspots/illustration.svg#full)

### What makes a click dummy

In short, we are talking about adding interaction to static images.

You lay out a background layer image which provides the overall look for the
idea you want to present and add as many interactive elements on top of that. As
most designs are centered in the browser, it would be nice to start out with a
centered background. It would also be great to be able to show and hide elements
on the fly. Also it is important that all images are loaded before you start
navigating the demo so it doesn't look broken.

Thankfully, all of the above should be and in fact is achievable in a new
Ember.js addon.

### Steps involved

1. Creating a new ember-cli addon
2. Finding and preloading all images necessary for your prototype
3. Creating a component for backgrounds providing a canvas for your prototype
4. Creating a component for hotspots which can be used to trigger actions or
   navigate to other pages
5. Combining everything into a demo application

### Creating a new ember-cli addon

The [ember-cli](https://github.com/ember-cli/ember-cli) makes
[creating a new addon](https://cli.emberjs.com/release/writing-addons/intro-tutorial/)
straight forward.

I prefer using yarn for package management, I'll add the `--yarn` flag when
running the ember-cli command.

```shell
ember addon ember-hotspots --yarn
```

Details of this process can be read up in the tutorial, we'll use the included
`dummy` application to play with the things we build and start generating our
first component straight away.

### Finding and preloading images

To ensure that a demo runs successfully and a potential user doesn't end up with
blank spaces or slow loading or missing images, it is necessary to preload all
necessary images. It also helps to know the image dimensions beforehand so the
browser can reserve screen space for them. The latter also allows creating
hotspots or overlays that are sized by their image content.

My initial approach to this is creating a JSON file at build time which contains
paths and sizes of all images relevant to the hotspots. This allows me to load
the images as needed, gives me metadata ahead of their load and allows me to
verify that the image files referenced in the hotspots do exist in case I need
to detect spelling errors or wrongly named files.

Even though using Ember.js on a daily basis, I rarely dig into the deeper
plumbing behind the scenes of ember-cli and it's Broccoli build pipeline. This
project allowed me to get a first introduction into the finer details.

While it did look complex at first, Broccoli turned out to be approachable, as
long as you can navigate the code and work by looking at other plugins and
addons. The docs are there, even for
[creating plugins yourself](https://broccoli.build/plugins.html#example-plugin),
but it's always hard
[to draw the rest of the owl](https://knowyourmeme.com/memes/how-to-draw-an-owl).

Broccoli works by creating file trees and filtering them through funnels. It
relies on the actual file system. Generating new files into your app comes down
to using the default Node.js APIs. Ha! I know these! Off to a good start.

I ended up building a small Broccoli plugin that uses
[walk-sync](https://www.npmjs.com/package/walk-sync) to find images in the
public folder and applies [image-size](https://www.npmjs.com/package/image-size)
to retrieve the actual file dimensions which is then written into a mapping
file. Much like with iOS development I detect if the filename ends in `@2x` and
return only half the actual width and height of those images for a crisper
experience on high resolution screens like most mobile displays.

The resulting JSON is passed into the public folder of the consuming application
and can be fetched by a service that manages global state for the individual
hotspots and backgrounds.

```js
// https://github.com/simplabs/ember-hotspots/blob/main/lib/SizeUpImages.js#L9-L41

module.exports = class SizeUpImages extends Plugin {
  build() {
    const content = this.inputPaths.reduce((acc, inputPath) => {
      // Iterate over all input paths, find and measure all images
      // ...
      paths.forEach((file) => {
        acc[file] = imageStats(path.join(inputPath, file));
      });
      // ...
    }, {});

    fs.writeFileSync(
      path.join(output, this.options.outputFile),
      JSON.stringify(content)
    );
  }
};
```

#### Notes on the process

Going down this path made me realize that the addons `index.js` is just a small
module that is executed by Node.js, meaning you can reach for anything that
works in other node modules as well.

The `contentFor()` hook inside an Ember addon runs on initial startup only, the
experience is about the same as with ember-cli-build.js changes that require a
restart. This hook is helpful if you want to push things to your index.html.

```js
// https://github.com/simplabs/ember-hotspots/blob/main/index.js

module.exports = {
  name: require('./package').name,

  //...

  contentFor(type, app) {
    // Append <link rel="preload"> tags to the end of <head>
    if (type === 'head-footer') {
      const cwd = path.join(
        process.cwd(),
        this.app.trees.public,
        this._options.cwd
      );
      const files = glob
        .sync(this._options.glob, {
          cwd,
        })
        .reduce(
          (acc, file) => ({
            ...acc,
            [file]: imageStats(path.join(cwd, file)),
          }),
          {}
        );

      return `${Object.keys(files).reduce(
        (acc, filename) =>
          `${acc}\n<link rel="preload" href="/${filename}" as="image">`,
        ''
      )}\n`;
    }

    return '';
  },
```

### Building the components

The addon will provide two main building blocks which can be used to diplay an
image and add interactive areas to it.

One for inert backgrounds which can act as a container and show a large image
that is commonly horizontally centered, allowing designers to provide mockups
with extended background design on each side so the mockup doesn't look cut off
when resizing the browser.

Another for interactive hotspots that can be layed out and moved about relative
to a background.

`<EhBackground />` provides the background images. Reading from the image map we
generated above it also checks if you are referencing an existing image and
warns if no match was found. The component is otherwise quite simple. It
generates a wrapping `<div>` with a custom `style` attribute which contains the
`background-image` url as well as two CSS custom properties for `width` and
`height` of the container. Using CSS custom properties allows easy access to the
width when styling child elements of this component.

```hbs
{% raw %}
<div ...attributes class="eh-background" style={{this.style}}>
  {{yield}}
</div>
{% endraw %}
```

```js
export default class EHBackgroundComponent extends Component {
  // ...

  get style() {
    const { width, height } = this.backgroundImageInfo;
    const styles = [
      `background-image:url(${this.args.src})`,
      `--eh-background-width:${width}px`,
      `--eh-background-height:${height}px`,
    ];

    return htmlSafe(styles.join(";"));
  }
}
```

```css
.eh-background {
  position: relative;
  background-position: 50% 0;
  background-repeat: no-repeat;
  background-size: auto 100%;
  overflow-x: hidden;
  height: var(--eh-background-height, 100%);
}
```

`<EhHotspot />` is a little more complex, mostly because I wanted to cover some
common use cases out of the box. One neat aspect is the positioning, which is
done relative to the centered background image and relies on the inherited CSS
custom properties and `calc()` instead of manually setting values with
JavaScript.

Hotspots accept multiple arguments. You can pass a route name (as a string) to
make them transition to a new route. You can pass an `@action` to make them
trigger that action. You can also adjust the trigger event (which defaults to
`click`) and even use a custom `hover` trigger to create hover effects in your
mockup.

Using a global service, all hotspots also get a special CSS class name in case
you click and hold anywhere on the page. This is used with a CSS animation to
visualize all hotspots on a page by highlighting them blue after a short
interval.

You can use the `(array)` helper to pass in coordinates to a hotspot like so:
`@rect=(array 0 0)`. Just like the background, the component will also validate
passed in image `@src` against the generated asset list. While hotspots do not
necessarily require an image to work, adding an image makes them more versatile.

All that's necessary to implement such an effect is a `@tracked` property that
is read by all hotspots and is set to `true` when a global `mousedown` event is
detected and `false` on the corresponding `mouseup`.

```hbs
{% raw %}
<div
  ...attributes
  class="eh-hotspot {{if this.ehHotspots.showHotspots "eh-hotspot--highlight"}}"
  style={{this.style}}
  role={{if this.isInteractive (if @route "link" "button")}}
  {{on this.triggerEvent this.onTrigger}}
>
  {{yield}}
</div>
{% endraw %}
```

```js
export default class EHHotspotComponent extends Component {
  @service ehHotspots;

  get rect() {
    let [x, y, width, height] = this.args.rect;

    if (this.args.src) {
      width = this.backgroundImageInfo.width;
      height = this.backgroundImageInfo.height;
    }

    return { x, y, width, height };
  }

  get style() {
    const { x, y, width, height } = this.rect;
    const styles = [`top:${y}px`, `left:${x}px`];

    if (this.args.src) {
      const {
        width: imageWidth,
        height: imageHeight,
      } = this.backgroundImageInfo;

      styles.push(
        `width:${imageWidth}px`,
        `height:${imageHeight}px`,
        `background-image:url(${this.args.src})`
      );
    } else {
      styles.push(`width:${width}px`, `height:${height}px`);
    }

    return htmlSafe(styles.join(";"));
  }
}
```

```css
.eh-hotspot {
  position: absolute;
  background-size: auto 100%;
  margin-left: calc(50% - 0.5 * var(--eh-background-width));
}
```

### Combining everything

![Better click dummies and prototypes with Ember.js](/assets/images/posts/2020-12-15-building-prototypes-with-emberjs-and-ember-hotspots/ember-hotspots-animation.gif)

```hbs
{% raw %}
<EhBackground @src="Home@2x.png">
  {{#if this.showMenu}}
    <EhHotspot @rect={{array 40 40}} @src="Menu@2x.png" />
  {{/if}}

  <EhHotspot
    @rect={{array 1135 15 100 50}}
    @action={{fn (mut this.showMenu) (not this.showMenu)}}
  />

  <EhHotspot
    @rect={{array 341 671 304 90}}
    @src={{if this.btnCargoHover "button-install-cargo@2x.png"}}
    @action={{fn (mut this.btnCargoHover) (not this.btnCargoHover)}}
    @trigger="hover"
  />

  <EhHotspot
    @rect={{array 655 671 290 90}}
    @src={{if this.btnGetStartedHover "button-get-started@2x.png"}}
    @action={{fn (mut this.btnGetStartedHover) (not this.btnGetStartedHover)}}
    @trigger="hover"
  />
</EhBackground>
{% endraw %}
```

This is the resulting code for a small and simple click dummy. It uses
[ember-truth-helpers](https://github.com/jmurphyau/ember-truth-helpers), which
allows us to apply some logic directly in the templates.

It opens a menu that only appears when clicking on the menu button (which is
part of the background image). It also has two hotspots that show an image when
hovering over them.

Next step for this mockup would be to add `@route` arguments to the buttons so
they not only have a hover effect, but also navigate to a new page with a
different `<EhBackground />` and more functionality.

For further inspiration look at
[the dummy application](https://simplabs.github.io/ember-hotspots/) that is part
of the [ember-hotspots](https://github.com/simplabs/ember-hotspots).

The resulting Ember.js addon shows how little code is necessary to bring ideas
to live thanks to the tools that make up the Ember.js ecosystem. There is a lot
of potential in this concept beyond just small small click dummies. I want to
explore the options of including this into existing applications and maybe even
add support for animations in the future.

### To be continued…

Is a custom Broccoli plugin the right way to build this tool? Maybe. There are
multiple existing and battle tested addons which provide building blocks for all
steps necessary. There is
[ember-cli-ifa](https://github.com/adopted-ember-addons/ember-cli-ifa) which
gives your app a fingerprinted list of all your assets, including any images.
[ember-cli-workbox](https://github.com/BBVAEngineering/ember-cli-workbox) allows
preloading assets via service workers. The options for improvements without
requiring any user of this addon to change their workflow or even adjust their
own code is one of the more powerful aspects of the Ember.js ecosystem.
