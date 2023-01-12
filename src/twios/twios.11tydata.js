module.exports = {
  layout: "twios-post",
  eleventyComputed: {
    permalink: function (data) {
      return (
        "/this-week-in-open-source/" +
        data.page.inputPath.replace(/(.+\/)(\d+)-(\d+)-(\d+)\..+/, "$2/$3/$4/").replace(".md", "/")
      );
    },
  },
};
