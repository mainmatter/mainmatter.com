---
title: 'Building prototypes with Ember.js'
author: 'Florian Pichler'
github: pichfl
twitter: pichfl
topic: emberjs
bio: 'Consultant for Design & Technology'
description:
  'Create click dummies and prototypes that can grow over your initial ideas
  with ease and the full force of the Ember.js ecosystem.'
#og:
#  image: /assets/images/posts/.../og-image.png
---

You are in charge of creating click dummies, interactive demos or that thing
that is made from static images and enriched with hotspots, page transitions and
states.

You reach for Invision or Marvel or the built-in features in Figma, Sketch or
Adobe XD. About 90% into the project you realize that your project owner needs
something in this demo, which can't be done in the tool you chose.

In this post I explain how I created
[ember-hotspots](https://github.com/simplabs/ember-hotspots), an addon for
Ember.js which allows you to create prototypes from scratch while using little
code, but with the full power of the Ember.js ecosystem whenever you need it.
The addon can be used in existing Ember.js projects, making it easy to explore
new ideas.

<!--break-->

### Steps involved

1. Creating a new ember-cli addon
2. Find a way to inform the app about images sizes before they are loaded. This
   way hotspots and backgrounds can be sized with less manual work and we get
   real-time feedback if something is wrong with file names or paths
3. Create a component for backgrounds to built up the overall page
4. Create a component for hotspots which can be used to trigger actions or
   navigate to other pages
5. Combine everything into a demo application

### Creating a new ember-cli addon

The [ember-cli](https://github.com/ember-cli/ember-cli) makes
[creating a new addon](https://cli.emberjs.com/release/writing-addons/intro-tutorial/)
straight forward.

I prefer using yarn for package management, I'll add the `--yarn` flag when
running the ember-cli command.

```sh
ember addon ember-hotspots --yarn
```

Details of this process can be read up in the tutorial, we'll use the included
`dummy` application to play with the things we build and start generating our
first component straight away.

### Automatically finding images sizes

Even though I'm using Ember.js on a daily basis, I rarely dig into the deeper
plumbing behind the scenes of ember-cli and it's Broccoli asset pipeline. This
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
      JSON.stringify(content),
    );
  }
};
```

#### Notes on the process

Going down this path made me realize that the addons `index.js` is just a small
module that is executed by Node.js, meaning you can reach for anything that
works other node modules as well.

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

I wanted two main components: One for inert backgrounds which can act as a
container and show a large image horizontally centered. Another for interactive
hotspots that can be layout out and moved about relative to a background.

`<EhBackground />` provides the background images. Reading from the image map we
generated above it also checks if you are referencing an existing image and
warns if no match was found. The component is otherwise quite simple. It
generates a wrapping `<div>` with a custom `style` attribute which contains the
`background-image` url as well as two CSS custom properties for `width` and
`height` of the container. Using CSS custom properties allows easy access to the
width when styling child elements of this component.

TODO: Add Gist

`<EhHotspot />` is a little more complex, mostly because I wanted to cover some
common use cases out of the box. One neat aspect is the positioning, which is
done relative to the centered background image and relies on the inherited CSS
custom properties and `calc()` instead of manually setting values with
JavaScript.

Hotspots accept multiple arguments. You can pass a route name (as a string) to
make them transition to a new route. You can pass an `@action` to make them
trigger that function. You can also adjust the trigger event (which defaults to
`click`) and even use a custom `hover` trigger to create hover effects in your
mockup.

Using a global service, all hotspots also get a special CSS class name in case
you click and hold anywhere on the page. This is used with a CSS animation to
visualize all hotspots on a page by highlighting them blue after a short
interval.

You can use the `(array)` helper to pass in coordinates to an hotspot like so:
`@rect=(array 0 0)`. Just like the background, the component will also validate
passed in image `@src` against the generated asset list. While hotspots do not
necessarily require an image to work, adding an image makes them more versatile.

All that's necessary to implement such an effect is a `@tracked` property that
is read by all hotspots and is set to `true` when a global `mousedown` event is
detected and `false` on the corresponding `mouseup`.

```hbs
<div
  ...attributes
  class="eh-hotspot {{if this.ehHotspots.showHotspots "eh-hotspot--highlight"}}"
  style={{this.style}}
  role={{if this.isInteractive (if @route "link" "button")}}
  {{on this.triggerEvent this.onTrigger}}
>
  {{yield}}
</div>
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
        `background-image:url(${this.args.src})`,
      );
    } else {
      styles.push(`width:${width}px`, `height:${height}px`);
    }

    return htmlSafe(styles.join(';'));
  }
}
```

### Combining everything

```hbs
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
```

This is the resulting code for small simple click dummy. It uses
[ember-truth-helpers](), which allows us to apply some logic directly in the
templates.

It opens a menu that only appears when clicking on the menu button (which is
part of the background image). It also has two hotspots that show an image when
hovering over them.

Next step for this mockup would be to add `@route` arguments to the buttons so
they not only have an hover effect, but also navigate to a new page with a
different `<EhBackground />` and more functionality.

For further inspiration look at [the dummy application]() that is part of the
[ember-hotspots](https://github.com/simplabs/ember-hotspots) addon, which is
available now.
