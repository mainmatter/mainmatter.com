const config = require("../src/_data/config");

module.exports = (collection) => {
  const authorList = require("./authors")(collection);
  const postList = require("./posts")(collection);

  const maxPostsPerPage = config.maxPostsPerPage;
  const pagedPosts = [];

  authorList.forEach((author) => {
    const sortedPosts = postList.filter((post) => {
      return post.data.authorHandle === author.data.page.fileSlug;
    });

    const numberOfPages = Math.ceil(sortedPosts.length / maxPostsPerPage);

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      const sliceFrom = (pageNum - 1) * maxPostsPerPage;
      const sliceTo = sliceFrom + maxPostsPerPage;

      pagedPosts.push({
        author: author,
        number: pageNum,
        posts: sortedPosts.slice(sliceFrom, sliceTo),
        first: pageNum === 1,
        last: pageNum === numberOfPages,
      });
    }
  });

  return pagedPosts;
};
