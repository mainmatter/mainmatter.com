const fs = require("fs");
const util = require("util");
const { optimize } = require("svgo");
const path = require("path");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");

const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const contentParser = require("./utils/transforms/contentParser.js");
const htmlMinTransform = require("./utils/transforms/htmlmin.js");
const { findBySlug } = require("./utils/findBySlug");
const { filterByCollectionTag } = require("./utils/filterByCollectionTag.mjs");
const { init } = require("./utils/svelteSyntaxHighlight");

require("dotenv").config();

/**
 * Import site configuration
 */
const pathConfig = require("./src/_data/paths.json");
const { findByCollectionSlug } = require("./utils/findByCollectionSlug.mjs");

module.exports = async function (eleventyConfig) {
  /**
   * Removed renaming Passthrough file copy due to issues with incremental
   * https://github.com/11ty/eleventy/issues/1299
   */
  eleventyConfig.addPassthroughCopy({ static: "/" });

  /**
   * Create custom data collections
   */
  eleventyConfig.addCollection("appearances", require("./collections/appearances"));
  eleventyConfig.addCollection("channels", require("./collections/channels"));
  eleventyConfig.addCollection("channelsAppearances", require("./collections/channelsAppearances"));
  eleventyConfig.addCollection("calendar", require("./collections/calendar"));
  eleventyConfig.addCollection("videos", require("./collections/videos"));
  eleventyConfig.addCollection("workshops", require("./collections/workshops"));
  eleventyConfig.addCollection("posts", require("./collections/posts"));
  eleventyConfig.addCollection("emberPosts", require("./collections/ember-posts"));
  eleventyConfig.addCollection("elixirPosts", require("./collections/elixirPosts"));
  eleventyConfig.addCollection("rustPosts", require("./collections/rustPosts"));
  eleventyConfig.addCollection("sveltePosts", require("./collections/sveltePosts"));
  eleventyConfig.addCollection("travelPosts", require("./collections/travelPosts"));
  eleventyConfig.addCollection("authors", require("./collections/authors"));
  eleventyConfig.addCollection("authorsPostsPaged", require("./collections/authorsPostsPaged"));
  eleventyConfig.addCollection("tags", require("./collections/tags"));
  eleventyConfig.addCollection("tagsPostsPaged", require("./collections/tagsPostsPaged"));
  eleventyConfig.addCollection("caseStudies", require("./collections/caseStudies"));
  eleventyConfig.addCollection("caseStudiesFeatured", require("./collections/caseStudiesFeatured"));
  eleventyConfig.addCollection("twios", require("./collections/twios"));
  eleventyConfig.addCollection("memoized", require("./collections/memoized"));

  /**
   * Add filters
   *
   * @link https://www.11ty.io/docs/filters/
   */
  dayjs.extend(customParseFormat);

  eleventyConfig.addFilter("monthDayYear", function (date) {
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

  eleventyConfig.addFilter("findByCollectionSlug", findByCollectionSlug);

  eleventyConfig.addFilter("filterByCollectionTag", filterByCollectionTag);

  eleventyConfig.addFilter("formatTagline", function (tagline) {
    return tagline.split("</p>")[0].replace(/<\/?[^>]+(>|$)/g, "");
  });

  eleventyConfig.addFilter("stripHTML", value => {
    return value.replace(/(<([^>]+)>)/gi, "");
  });

  const mdRender = new markdownIt({
    html: true,
    breaks: false,
    linkify: true,
  }).use(markdownItFootnote);
  eleventyConfig.addFilter("markdown", function (value) {
    if (value) {
      return mdRender.render(value);
    }
    return "";
  });
  eleventyConfig.setLibrary("md", mdRender);

  eleventyConfig.addFilter("filterByAttribute", (array, attribute, value) => {
    return array.filter(element => element.data[attribute] === value);
  });

  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("getMorePosts", function (array, post) {
    return array
      .filter(element => element.inputPath !== post.inputPath)
      .map(el => {
        return el.fileSlug;
      });
  });

  eleventyConfig.addFilter("getCollectionKeys", function (collection) {
    return Object.keys(collection);
  });

  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  eleventyConfig.addLiquidFilter("dateToRfc822", pluginRss.dateToRfc822);

  eleventyConfig.addFilter("urlExists", (url, collection) => {
    return Boolean(collection?.find(({ page }) => page.url === url));
  });

  eleventyConfig.addFilter("upcoming", collection => {
    return collection
      .filter(item => Date.parse(item.startDate) > new Date())
      .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
  });

  eleventyConfig.addFilter("getAuthor", (authors, handle) => {
    return authors.find(a => a.fileSlug === handle);
  });

  /*
   * Add Transforms
   *
   * @link https://www.11ty.io/docs/config/#transforms
   */
  // Parse the page HTML content and perform some manipulation
  eleventyConfig.addTransform("contentParser", contentParser);

  if (process.env.ELEVENTY_ENV === "production") {
    // Minify HTML when building for production
    eleventyConfig.addTransform("htmlmin", htmlMinTransform);
  }

  /**
   * Add Plugins
   * @link https://github.com/11ty/eleventy-plugin-rss
   * @link https://github.com/11ty/eleventy-plugin-syntaxhighlight
   * @link https://github.com/okitavera/eleventy-plugin-pwa
   */
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlightPlugin, {
    init,
  });
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  const EleventyPluginOgImage = (await import("eleventy-plugin-og-image")).default;
  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    satoriOptions: {
      fonts: [
        {
          name: "CoreSans",
          data: fs.readFileSync("./static/assets/fonts/core-sans/CoreSansA65Bold.woff"),
          weight: 700,
          style: "normal",
        },
        {
          name: "CoreSans",
          data: fs.readFileSync("./static/assets/fonts/core-sans/CoreSansA45Regular.woff"),
          weight: 400,
          style: "normal",
        },
      ],
    },
    async shortcodeOutput(ogImage) {
      return ogImage.outputUrl();
    },
  });
  /**
   * Add Shortcodes
   */

  const now = new Date();
  eleventyConfig.addShortcode("copyrightYear", function () {
    return `${now.getFullYear()}`;
  });

  eleventyConfig.addShortcode("turnstileSiteKey", () => process.env.CF_TURNSTILE_KEY);

  eleventyConfig.addShortcode(
    "image",
    function (imgPath, alt, sizes, loading, className, sizesArray) {
      let url = "./static" + imgPath;
      const fileType = path.extname(imgPath).replace(".", "");
      const directory = path.dirname(imgPath);
      let formats = ["webp", ...(fileType !== "gif" ? [fileType] : [])];

      if (!sizesArray) {
        sizesArray = [720, 1024, 1440];
      }

      const options = {
        svgShortCircuit: true,
        widths: sizesArray,
        formats,
        urlPath: directory,
        outputDir: "./dist/" + directory,
        filenameFormat: function (id, src, width, format) {
          const extension = path.extname(imgPath);
          const name = path.basename(imgPath, extension);
          return `${name}@${width}.${format}`;
        },
      };

      let stats = Image.statsSync(url, options);
      Image(url, options);

      let imageAttributes = {
        class: className,
        alt,
        sizes: sizes ? sizes : "100vw",
        loading: loading,
      };

      return Image.generateHTML(stats, imageAttributes);
    }
  );

  eleventyConfig.addShortcode("svg", svgPath => {
    const svgData = fs.readFileSync("./static/assets/images" + svgPath, "utf8");
    const response = optimize(svgData, {
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ],
    });
    return response.data.replace("<svg", `<svg focusable="false" role="presentation"`);
  });

  eleventyConfig.addShortcode("mastodonHandleUrl", handle => {
    const [user, server] = handle.split("@").filter(Boolean);
    return `https://${server}/@${user}`;
  });

  eleventyConfig.setServerOptions({
    watch: ["./dist/assets/css/*.css", "./dist/assets/js/*.js"],
  });

  eleventyConfig.addShortcode(`inlineImage`, async imagePath => {
    let extension = path.extname(imagePath).slice(1);
    let fullImagePath = path.join("static", imagePath);
    let base64Image = fs.readFileSync(fullImagePath, `base64`);

    if (extension === `svg`) {
      extension = `svg+xml`;
    }

    if (extension === `jpg`) {
      extension = `jpeg`;
    }

    return `data:image/${extension};base64,${base64Image}`;
  });

  eleventyConfig.addPairedNunjucksShortcode(
    "note",
    function (content, type = "note", title = null) {
      const icons = {
        warning: `<svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480H40c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21m0 352a32 32 0 1 0 0 64a32 32 0 1 0 0-64m0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3c12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"/></svg>`,
        tip: `<svg width="20" height="20" viewBox="0 -56 576 576" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1l-73.6 144.2l-159.9 25.4c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5l-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2l144.4-73.4L432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2l-25.3-159.9l114.4-114.5c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3z"/></svg>`,
        info: `<svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M256 512a256 256 0 1 0 0-512a256 256 0 1 0 0 512m-32-352a32 32 0 1 1 64 0a32 32 0 1 1-64 0m-8 64h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-80c-13.3 0-24-10.7-24-24s10.7-24 24-24h24v-64h-24c-13.3 0-24-10.7-24-24s10.7-24 24-24"/></svg>`,
        default: `<svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M256 512a256 256 0 1 0 0-512a256 256 0 1 0 0 512m-32-352a32 32 0 1 1 64 0a32 32 0 1 1-64 0m-8 64h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-80c-13.3 0-24-10.7-24-24s10.7-24 24-24h24v-64h-24c-13.3 0-24-10.7-24-24s10.7-24 24-24"/></svg>`,
      };
      return `<div class="note note--${type}" role="${type === "warning" ? "alert" : "note"}">
        <div class="note__header">
            <div class="note__icon">
                ${icons[type] || icons.default}
            </div>
			${title ? `<h4 class="note__title">${title}</h4>` : ""}
        </div>
        <div class="note__content">
            ${content}
        </div>
    </div>`;
    }
  );

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
