# simplabs.github.io

The source code for [https://simplabs.com](https://simplabs.com).

![simplabs logo](./public/assets/images/logos/simplabs.svg)

We use [Glimmer.js](https://glimmerjs.com) for rendering,
[navigo](https://github.com/krasimir/navigo) for client-side routing and
[CSS Blocks](https://css-blocks.com) for CSS. Pages are statically pre-rendered
using [Puppeteer](https://pptr.dev) and we inject critical CSS with
[critical](https://github.com/addyosmani/critical).

## Installation

* `git clone <repository-url>` this repository
* `cd simplabs`
* `yarn --pure-lockfile`

## Running / Development

* `ember serve`
* open [http://localhost:4200](http://localhost:4200).
* `yarn format` (format source files)

### Testing

* `ember test` (headless)
* `ember test -s` (headful)
* `yarn lint` (check formatting)

### Building

* `ember build` (development)
* `yarn build` (production, with static pre-rendering)

## Further Reading / Useful Links

* [Glimmer.js](https://glimmerjs.com)
* [navigo](https://github.com/krasimir/navigo)
* [CSS Blocks](https://css-blocks.com)
* [Puppeteer](https://pptr.dev)
* [critical](https://github.com/addyosmani/critical)

## Copyright

Copyright &copy; 2019 simplabs GmbH (https://simplabs.com), released under the
[Creative Commons Attribution-NonCommercial 4.0 International license](https://creativecommons.org/licenses/by-nc/4.0/).
