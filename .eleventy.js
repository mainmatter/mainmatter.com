const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlMinTransform = require("./utils/transforms/htmlmin.js");
const markdownIt = require("markdown-it");
const contentParser = require("./utils/transforms/contentParser.js");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const fs = require("fs");
const util = require("util");
const { findBySlug } = require("./utils/findBySlug");

/**
 * Import site configuration
 */
const config = require("./src/_data/config.json");
const pathConfig = require("./src/_data/paths.json");

module.exports = function (eleventyConfig) {
  /**
   * Removed renaming Passthrough file copy due to issues with incremental
   * https://github.com/11ty/eleventy/issues/1299
   */
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ static: "/" });
  eleventyConfig.addPassthroughCopy("src/admin");

  /**
   * Create custom data collections
   */
  eleventyConfig.addCollection(
    "appearances",
    require("./collections/appearances")
  );
  eleventyConfig.addCollection("channels", require("./collections/channels"));
  eleventyConfig.addCollection(
    "channelsAppearances",
    require("./collections/channelsAppearances")
  );
  eleventyConfig.addCollection("calendar", require("./collections/calendar"));
  eleventyConfig.addCollection("videos", require("./collections/videos"));
  eleventyConfig.addCollection("workshops", require("./collections/workshops"));
  eleventyConfig.addCollection("posts", require("./collections/posts"));
  eleventyConfig.addCollection("authors", require("./collections/authors"));
  eleventyConfig.addCollection(
    "authorsPostsPaged",
    require("./collections/authorsPostsPaged")
  );
  eleventyConfig.addCollection("tags", require("./collections/tags"));
  eleventyConfig.addCollection(
    "tagsPostsPaged",
    require("./collections/tagsPostsPaged")
  );
  eleventyConfig.addCollection("memoized", require("./collections/memoized"));

  /**
   * Add filters
   *
   * @link https://www.11ty.io/docs/filters/
   */
  dayjs.extend(customParseFormat);

  eleventyConfig.addFilter("monthDayYear", function (date) {
    return dayjs(date).format("MMM. DD, YYYY");
  });

  eleventyConfig.addFilter("fullMonthDayYear", function (date) {
    return dayjs(date).format("MMMM D, YYYY");
  });
  // robot friendly date format for crawlers
  eleventyConfig.addFilter("htmlDate", function (date) {
    return dayjs(date).format();
  });

  eleventyConfig.addFilter("console", function (value) {
    return util.inspect(value);
  });

  eleventyConfig.addFilter("findBySlug", function (slug) {
    return findBySlug(slug);
  });

  eleventyConfig.addFilter("filename", function (path) {
    return path.split("/").pop();
  });

  const mdRender = new markdownIt({});
  eleventyConfig.addFilter("markdown", function (value) {
    if (value) {
      return mdRender.render(value);
    }
    return "";
  });
  /**
   * Add Transforms
   *
   * @link https://www.11ty.io/docs/config/#transforms
   */
  if (process.env.ELEVENTY_ENV === "production") {
    // Minify HTML when building for production
    eleventyConfig.addTransform("htmlmin", htmlMinTransform);
  }
  // Parse the page HTML content and perform some manipulation
  eleventyConfig.addTransform("contentParser", contentParser);

  /**
   * Add Plugins
   * @link https://github.com/11ty/eleventy-plugin-rss
   * @link https://github.com/11ty/eleventy-plugin-syntaxhighlight
   * @link https://github.com/okitavera/eleventy-plugin-pwa
   */
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlightPlugin);

  /**
   * Override BrowserSync Server options
   *
   * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
   */
  eleventyConfig.setBrowserSyncConfig({
    notify: false,
    open: true,
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match;
        },
      },
    },
    // Set local server 404 fallback
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("dist/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, {
            "Content-Type": "text/html",
          });
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  /*
   * Disable use gitignore for avoiding ignoring of /bundle folder during watch
   * https://www.11ty.dev/docs/ignores/#opt-out-of-using-.gitignore
   */
  eleventyConfig.setUseGitIgnore(false);

  /**
   * Eleventy configuration object
   */
  return {
    dir: {
      input: pathConfig.src,
      includes: pathConfig.includes,
      layouts: `${pathConfig.includes}/layouts`,
      output: pathConfig.output,
    },
    passthroughFileCopy: true,
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
