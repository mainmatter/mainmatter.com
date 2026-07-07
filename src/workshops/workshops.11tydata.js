module.exports = {
  layout: "workshop",
  eleventyComputed: {
    permalink: function (data) {
      return `/training/${data.page.fileSlug}/`;
    },
  },
};
