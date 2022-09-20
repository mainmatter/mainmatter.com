const pathConfig = require("../src/_data/paths.json");
const sortByDate = require("../utils/sortByDate");

module.exports = collection => {
  return [...collection.getFilteredByGlob(`./${pathConfig.src}/appearances/*.md`)].sort(
    sortByDate("desc")
  );
};
