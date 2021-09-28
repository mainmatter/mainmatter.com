const pathConfig = require("../src/_data/paths.json");
const now = new Date();

module.exports = (collection) => {
  return [
    ...collection
      .getFilteredByGlob(`./${pathConfig.src}/calendar/*.md`)
      .filter((event) => event.date >= now),
  ];
};
