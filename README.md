# simplabs.github.io

The source code for [https://simplabs.com](https://simplabs.com).

![simplabs logo](./public/assets/images/logos/simplabs.svg)

We use [Glimmer.js](https://glimmerjs.com) for rendering,
[navigo](https://github.com/krasimir/navigo) for client-side routing and
[CSS Blocks](https://css-blocks.com) for CSS. Pages are statically pre-rendered
using [Puppeteer](https://pptr.dev).

## Installation

- `git clone <repository-url>` this repository
- `cd simplabs`
- `yarn --pure-lockfile`

## Running / Development

- `yarn start-dev`
- open [http://localhost:4200](http://localhost:4200).
- `yarn format` (format source files)

**This project registers a service worker which you'll likely want to disable
for development. Check _"Bypass for network"_ in the _"Application"_ tab in the
Chrome Inspector to do so.**

### Testing

- `ember test` (headless)
- `ember test -s` (headful)
- `yarn lint` (check formatting)

### Building

- `ember build` (development)
- `yarn build` (production, with static pre-rendering)

## Further Reading / Useful Links

- [Glimmer.js](https://glimmerjs.com)
- [navigo](https://github.com/krasimir/navigo)
- [CSS Blocks](https://css-blocks.com)
- [Puppeteer](https://pptr.dev)

## Troubleshooting

 <details>
  <summary><code>yarn start-dev</code> fails in my local machine due to too many open files to watch</summary>
  
  You need to increase the max open files limit in your Operating System.
  
  The easiest way is by installing `watchman` in your system
  
  > brew install watchman
  
  <a href="https://wilsonmar.github.io/maximum-limits/">Alternatively, you can modify the limit of files to be watched in your Operating System.</a>
</details>

## Copyright

Copyright &copy; 2019 Mainmatter GmbH (https://mainmatter.com), released under the
[Creative Commons Attribution-NonCommercial 4.0 International license](https://creativecommons.org/licenses/by-nc/4.0/).
