const pathConfig = require("../src/_data/paths.json");
const sortByDate = require("../utils/sortByDate");
const now = new Date();

module.exports = collection => {
  return [
    ...collection
      .getFilteredByGlob(`./${pathConfig.src}/calendar/*.md`)
      .filter(event => event.date >= now),
  ].sort(sortByDate("asc"));
};
