const config = require("../src/_data/config");

module.exports = (collection) => {
  const tagList = require("./tags")(collection);

  const maxPostsPerPage = config.maxPostsPerPage;
  const pagedPosts = [];

  Object.keys(tagList).forEach((tagName) => {
    const sortedPosts = [...collection.getFilteredByTag(tagName)].reverse();
    const numberOfPages = Math.ceil(sortedPosts.length / maxPostsPerPage);

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      const sliceFrom = (pageNum - 1) * maxPostsPerPage;
      const sliceTo = sliceFrom + maxPostsPerPage;

      pagedPosts.push({
        tag: tagName,
        number: pageNum,
        posts: sortedPosts.slice(sliceFrom, sliceTo),
        first: pageNum === 1,
        last: pageNum === numberOfPages,
      });
    }
  });

  return pagedPosts;
};
