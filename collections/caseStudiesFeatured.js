const pathConfig = require("../src/_data/paths.json");

module.exports = (collection) => {
  const allCaseStudies = collection.getFilteredByGlob(
    `./${pathConfig.src}/cases/*.md`
  );

  return [...allCaseStudies.filter((caseStudy) => caseStudy.url)];
};
