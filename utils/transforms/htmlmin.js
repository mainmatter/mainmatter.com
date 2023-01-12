const htmlmin = require("html-minifier");

module.exports = function (content, outputPath) {
  if (outputPath && outputPath.endsWith(".html")) {
    const sanitizedContent = content.replaceAll("<<", "&lt;<");

    let minified = htmlmin.minify(sanitizedContent, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,
    });
    return minified;
  }

  return content;
};
