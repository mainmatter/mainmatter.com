const pathConfig = require("../src/_data/paths.json");
const sortByDate = require("../utils/sortByDate");
const now = new Date();
// show all the posts that are not drafts and have a date before now unless we are in serve mode
// so it will show a blog post you are working on locally
const livePosts = post =>
  (post.date <= now && !post.data.draft) || process.env.ELEVENTY_RUN_MODE !== "build";

module.exports = collection => {
  return [
    ...collection
      .getFilteredByGlob(`./${pathConfig.src}/${pathConfig.blogdir}/**/*`)
      .filter(livePosts),
  ].sort(sortByDate("desc"));
};
