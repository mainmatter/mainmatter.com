module.exports = {
  layout: "post",
  eleventyComputed: {
    permalink: function (data) {
      return (
        "/blog/" +
        data.page.inputPath
          .replace(/(.+\/)(\d+)-(\d+)-(\d+)-(.+(?=\.))/, "$2/$3/$4/$5")
          .replace(".md", "/")
      );
    },
  },
};

