module.exports = {
  layout: "workshop",
  eleventyComputed: {
    permalink: function (data) {
      return `/resources/workshops/${data.page.fileSlug}/`;
    },
  },
};
