module.exports = {
  eleventyComputed: {
    permalink: function (data) {
      return (
        "/resources/video/" +
        data.page.inputPath
          .replace(/(.+\/)(\d+)-(\d+)-(\d+)-(.+(?=\.))/, "$2/$3/$4/$5")
          .replace(".md", "/")
      );
    },
  },
};
