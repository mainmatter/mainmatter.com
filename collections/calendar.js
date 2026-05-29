const pathConfig = require("../src/_data/paths.json");
const sortByDate = require("../utils/sortByDate");

module.exports = collection => {
  const now = new Date();
  return [
    ...collection
      .getFilteredByGlob(`./${pathConfig.src}/calendar/*.md`)
      .filter(event => event.date >= now),
  ].sort(sortByDate("asc"));
};
