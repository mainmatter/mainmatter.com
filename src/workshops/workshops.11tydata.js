module.exports = {
  layout: "workshop",
  eleventyComputed: {
    permalink: function (data) {
      return `/services/workshops/${data.page.fileSlug}/`;
    },
  },
};
