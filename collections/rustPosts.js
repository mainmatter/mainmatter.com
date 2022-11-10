const livePosts = require("./posts");

module.exports = collection => {
  const allPosts = livePosts(collection);
  return allPosts.filter(
    post => Array.isArray(post.data.tags) && post.data.tags.some(t => t.match(/^rust/))
  );
};
