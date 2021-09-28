const { memoize } = require("../utils/findBySlug");

module.exports = (collection) => {
  return memoize(collection.getAll());
};
