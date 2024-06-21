const config = require("../src/_data/config");
const sortByDate = require("../utils/sortByDate");
const livePosts = require("./posts");

module.exports = collection => {
  const tagList = require("./tags")(collection);

  const maxPostsPerPage = config.maxPostsPerPage;
  const pagedPosts = [];

  const allPosts = livePosts(collection);

  Object.keys(tagList).forEach(tagName => {
    const filtered = allPosts.filter(post => {
      if (post.data.tags.length > 0) {
        return post?.data?.tags?.includes(tagName);
      }
    });
    const sortedPosts = filtered.sort(sortByDate("desc"));
    const numberOfPages = Math.ceil(sortedPosts.length / maxPostsPerPage);

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      const sliceFrom = (pageNum - 1) * maxPostsPerPage;
      const sliceTo = sliceFrom + maxPostsPerPage;

      pagedPosts.push({
        tag: tagName,
        total: numberOfPages,
        postTotal: sortedPosts.length,
        number: pageNum,
        posts: sortedPosts.slice(sliceFrom, sliceTo),
        first: pageNum === 1,
        last: pageNum === numberOfPages,
      });
    }
  });

  return pagedPosts;
};
