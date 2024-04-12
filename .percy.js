module.exports = {
  version: 2,
  static: {
    // don't snapshot neither all of the blog nor all of this-week-in-open-source
    exclude: [
      /blog\/page\/(?!(2|3))\/*/,
      /blog\/author\/(?!marcoow)\/*/,
      /blog\/20(?!22)\/*/,
      /blog\/tag\/(?!ember)\/*/,
      /blog\/tag\/.*\/page\/*/,
      /blog\/author\/.*\/page\/*/,
      /this-week-in-open-source\/20(?!21)\/*/,
    ],
  },
  snapshot: {
    percyCSS: `*, :before, :after {
       /*CSS transitions*/
       transition-property: none !important;
       /*CSS transforms*/
       transform: none !important;
       /*CSS animations*/
       animation: none !important;
    }`,
  },
};
