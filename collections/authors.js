const pathConfig = require("../src/_data/paths.json");

module.exports = (collection) => {
  return [...collection.getFilteredByGlob(`./${pathConfig.src}/authors/*.md`)];
};
