module.exports = {
  layout: "twios-post",
  eleventyComputed: {
    title: function (data) {
      const post = data.collections.twios.find(post => post.fileSlug === data.page.fileSlug);
      const number = post?.data?.number;
      return `This Week in Open Source at Mainmatter${number ? ` – #${number}` : ""}`;
    },
    description: function (data) {
      const date = data.page.inputPath.replace(/(.+\/)(\d+)-(\d+)-(\d+)\..+/, "$4.$3.$2");
      return `Check out the latest open source work by our team until ${date}`;
    },
    permalink: function (data) {
      return (
        "/this-week-in-open-source/" +
        data.page.inputPath.replace(/(.+\/)(\d+)-(\d+)-(\d+)\..+/, "$2/$3/$4/").replace(".md", "/")
      );
    },
  },
};
