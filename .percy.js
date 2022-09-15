module.exports = {
  version: 2,
  static: {
    // don't snapshot all of the blog
    exclude: [
      /blog\/page\/(?!(2|3))\/*/,
      /blog\/author\/(?!marcoow)\/*/,
      /blog\/20(?!22)\/*/,
      /blog\/tag\/(?!ember)\/*/,
      /blog\/tag\/.*\/page\/*/,
      /blog\/author\/.*\/page\/*/
    ]
  }
};