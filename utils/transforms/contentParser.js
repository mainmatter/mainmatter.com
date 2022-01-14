const jsdom = require("@tbranyen/jsdom");
const { JSDOM } = jsdom;
const slugify = require("slugify");
const path = require("path");
const config = require("../../src/_data/config.json");
const Image = require("@11ty/eleventy-img");

module.exports = function (value, outputPath) {
  if (outputPath) {
    /**
     * Create the document model
     */
    const DOM = new JSDOM(value);
    const document = DOM.window.document;

    /**
     * Add a span for text-animation
     */
    const textAnimations = [...document.querySelectorAll(".text-animation em")];
    if (textAnimations.length) {
      textAnimations.forEach((textAnimation) => {
        const span = document.createElement("span");
        span.classList.add("text-animation__cover");
        return textAnimation.appendChild(span);
      });
    }
    /**
     * Get all the headings inside the post
     */
    const articleHeadings = [...document.querySelectorAll("article h2")];
    if (articleHeadings.length) {
      /**
       * Create an anchor element inside each post heading
       * to link to the section
       */
      articleHeadings.forEach((heading) => {
        // Create the anchor element
        const anchor = document.createElement("a");
        // Create the anchor slug
        const headingSlug = slugify(heading.textContent.toLowerCase());
        // Set the anchor href based on the generated slug
        anchor.setAttribute("href", `#${headingSlug}`);
        anchor.setAttribute("aria-describedby", `${headingSlug}`);
        // Add class and content to the anchor
        setClass(anchor, ["post__heading-anchor"]);
        anchor.innerHTML =
          "<span aria-hidden='true'>#</span><span class='screenreader'>anchor</span>";
        // Set the ID attribute with the slug
        heading.setAttribute("id", `${headingSlug}`);
        setClass(heading, ["post__heading--anchor"]);
        heading.prepend(anchor);
      });
    }

    /**
     * Get all the iframes inside the article
     * and wrap them inside a class
     */
    const articleEmbeds = [...document.querySelectorAll("main article iframe")];
    if (articleEmbeds.length) {
      articleEmbeds.forEach((embed) => {
        const container = document.createElement("div");
        const wrapper = document.createElement("div");
        container.classList.add("iframe-container");
        wrapper.classList.add("iframe-wrapper");
        embed.setAttribute("loading", "lazy");
        container.appendChild(wrapper).appendChild(embed.cloneNode(true));
        embed.replaceWith(container);
      });
    }

    /**
     * Wrap all external links with
     * noopener and nofollow
     */
    const links = [...document.querySelectorAll("a")];
    if (links.length) {
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href.charAt(0) !== "/" && href.indexOf(config.url) < 0) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "nofollow noopener");
          link.setAttribute("aria-describedby", "external-new-window-message");
        }
      });
    }

    /**
     * Process our images
     */
    const images = [...document.querySelectorAll("article img")];
    if (images.length) {
      images.forEach((image) => {
        if (image.classList.length > 0) {
          return;
        }
        const rawSrc = image.getAttribute("src");
        const alt = image.getAttribute("alt");
        const imageData = parseImageDirectives(rawSrc);
        let sizes = imageData.sizes;
        let img,
          imgClass = "";

        if (!sizes) {
          sizes = [775, 1200, 1600];
        }

        if (imageData.kind === "full") {
          imgClass = "image--full";
        } else if (imageData.kind === "small") {
          imgClass = "image--small";
        } else if (imageData.kind === "video") {
          img = JSDOM.fragment(
            `<video src="${imageData.src}" playsinline autoplay muted loop role="presentation">${alt}</video>`
          );
          return image.replaceWith(img);
        }

        let formats = ["webp", imageData.fileType];
        if (imageData.fileType === "gif") {
          formats = ["webp"];
        }

        let url = "./static" + imageData.src;
        const options = {
          svgShortCircuit: true,
          widths: sizes,
          formats,
          urlPath: imageData.directory,
          outputDir: "./dist/" + imageData.directory,
          filenameFormat: function (id, src, width, format, options) {
            const extension = path.extname(imageData.src);
            const name = path.basename(imageData.src, extension);
            return `${name}@${width}.${format}`;
          },
        };
        let stats = Image.statsSync(url, options);
        Image(url, options);

        let imageAttributes = {
          alt,
          sizes: "@media (min-width: 62em) 48.438rem, 90vw",
          loading: "lazy",
          decoding: "async",
        };

        let newImage = JSDOM.fragment(
          Image.generateHTML(stats, imageAttributes)
        );

        if (imgClass) {
          newImage.firstElementChild.classList.add(imgClass);
        }

        return image.replaceWith(newImage);
      });
    }

    // Unwrap our images
    const allPTags = [...document.querySelectorAll(".rte p")];
    const elementList = ["IMG", "PICTURE", "VIDEO"];
    allPTags.forEach((element) => {
      if (
        element.childNodes.length === 1 &&
        elementList.indexOf(element.childNodes[0].tagName) > -1
      ) {
        return element.replaceWith(element.childNodes[0]);
      }
    });

    return "<!DOCTYPE html>\r\n" + document.documentElement.outerHTML;
  }
  return value;
};

function setClass(element, list) {
  if (list) {
    list.map((item) => element.classList.add(item));
  }
}

function parseImageDirectives(src) {
  let match = src.match(/#(full|plain|video|small)?(@(\d+)-(\d+))?$/);
  let bareSrc = src.replace(/#[^#]*$/, "");
  let directives = {
    src: bareSrc,
    fileType: path.extname(bareSrc).replace(".", ""),
  };

  directives.directory = path.dirname(directives.src);

  if (!match) {
    return directives;
  }

  let [, kind, , smallSize, largeSize] = match;

  if (kind) {
    directives.kind = kind;
  }

  if (smallSize && largeSize) {
    directives.sizes = [smallSize, largeSize];
  }

  return directives;
}
