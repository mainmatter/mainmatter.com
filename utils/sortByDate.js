module.exports = function sortByDate(order) {
  return function (a, b) {
    if (order === "desc") {
      return b.date - a.date;
    } else {
      return a.date - b.date;
    }
  };
};
