const jsdom = require("@tbranyen/jsdom");
const { JSDOM } = jsdom;
const slugify = require("slugify");

function setClass(element, list) {
  if (list) {
    list.map((item) => element.classList.add(item));
  }
}

module.exports = function (value, outputPath) {
  if (outputPath && outputPath.endsWith(".html")) {
    /**
     * Create the document model
     */
    const DOM = new JSDOM(value);
    const document = DOM.window.document;

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
        const wrapper = document.createElement("div");
        embed.setAttribute("loading", "lazy");
        wrapper.appendChild(embed.cloneNode(true));
        embed.replaceWith(wrapper);
      });
    }

    return "<!DOCTYPE html>\r\n" + document.documentElement.outerHTML;
  }
  return value;
};
