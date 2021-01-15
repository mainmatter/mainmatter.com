/* eslint-env node */
'use strict';

const marked = require('marked');
const highlightjs = require('highlight.js');

const renderer = {
  code(code, language) {
    let highlighted = code;
    if (language) {
      highlighted = highlightjs.highlight(language, code).value;
    }
    highlighted = blockifyClasses(highlighted);

    return `<pre source:scope><code>${highlighted}</code></pre>`;
  },

  html(html) {
    html = html.replace(/<iframe(.*)iframe>/gm, '<div class="embedd"><iframe class="embedd-iframe"$1iframe></div>');
    html = html.replace(
      /<author(.*)author>/gm,
      '<author blog-post:class="quote-author" typography:class="small"$1author>',
    );
    return blockifyClasses(html);
  },

  blockquote(quote) {
    return `<blockquote blog-post:class="quote">${this.html(quote)}</blockquote>`;
  },

  link(href, title, text) {
    let a = `<a href="${href}"`;

    if (href.startsWith('/')) {
      a = `${a} data-internal`;
    } else if (!href.startsWith('https://simplabs.com')) {
      a = `${a} target="_blank" rel="noopener"`;
    }

    if (title) {
      a = `${a} tite="${title}"`;
    }

    return `${a}>${text}</a>`;
  },

  table(header, body) {
    if (body) {
      body = `<tbody>${body}</tbody>`;
    }
    return `<table typography:class="table"><thead>${header}</thead>${body}</table>`;
  },

  image(href, title, text) {
    if (title) {
      title = ` title="${title}"`;
    }
    return `<img src="${href}" alt="${text}"${title} blog-post:class="image">`;
  },
};
marked.use({ renderer });

const walkTokens = (token) => {
  if (token.type === 'paragraph') {
    let paragraph = token;
    if (paragraph.tokens.length === 1 && paragraph.tokens[0].type === 'image') {
      let image = paragraph.tokens[0];
      wrapInFigure(paragraph, image);
    } else if (paragraph.tokens.length === 1 && paragraph.tokens[0].type === 'link') {
      let link = paragraph.tokens[0];
      if (link.tokens.length === 1 && link.tokens[0].type === 'image') {
        let image = link.tokens[0];
        wrapInFigure(paragraph, image, link);
      }
    }
  }
};
marked.use({ walkTokens });

module.exports = function htmlizeMarkdown(source) {
  source = preventBundleFingerprintReplacement(source);
  let html = marked(source);
  return encodeCurlies(html);
};

function blockifyClasses(html) {
  return html.replace(/(\s)class="/gm, '$1block:class="');
}

function encodeCurlies(content) {
  return content.replace(/\{\{/gm, '&#123;&#123;').replace(/\}\}/gm, '&#125;&#125;');
}

// During a production build, references to app.js and app.css will be replaced
// with their fingerprinted versions in the entire website. Of course we do not
// actually want mentions of these filenames in blog posts to be replaced so
// we're replacing any mentions of these files with a version that includes a
// non-visible whitespace so they won't match the regex that
// broccoli-asset-rewrite uses but will still look correct to the reader. See
// https://github.com/simplabs/simplabs.github.io/issues/630 for reference.
function preventBundleFingerprintReplacement(source) {
  return source.replace(/app\.js/g, 'app\u200b.js').replace(/app\.css/g, 'app\u200b.css');
}

function parseImageDirectives(src) {
  let match = src.match(/#(full|plain)?(@(\d+)-(\d+))?$/);
  let bareSrc = src.replace(/#[^#]*$/, '');
  let directives = {
    src: bareSrc,
  };

  if (!match) {
    return directives;
  }

  let [, kind, , smallSize, largeSize] = match;

  if (kind) {
    directives.kind = kind;
  }

  if (smallSize && largeSize) {
    let buildSrcForSize = (size) => bareSrc.replace(/(\.(\w){3,4})/, `@${size}$1`);
    let smallImage = buildSrcForSize(smallSize);
    let largeImage = buildSrcForSize(largeSize);
    directives.sizes = {
      small: {
        size: smallSize,
        src: smallImage,
      },
      large: {
        size: largeSize,
        src: largeImage,
      },
    };
  }

  return directives;
}

function wrapInFigure(paragraphToken, imageToken, linkToken = null) {
  let src = imageToken.href;
  let imageData = parseImageDirectives(src);
  let img, imgClass, figureClass;

  if (imageData.kind === 'full') {
    imgClass = 'content-full';
    figureClass = 'figure-plain';
  } else if (imageData.kind === 'plain') {
    imgClass = 'content-centered';
    figureClass = 'figure-plain';
  } else {
    imgClass = 'content-centered';
    figureClass = 'figure';
  }

  if (imageData.sizes) {
    let srcset = `${imageData.sizes.small.src} ${imageData.sizes.small.size}w, ${imageData.sizes.large.src} ${imageData.sizes.large.size}w`;
    let sizes = `(max-width: 887px) ${imageData.sizes.small.size}px, ${imageData.sizes.large.size}px`;
    img = `<img srcset="${srcset}" sizes="${sizes}" figure:class="${imgClass}">`;
  } else {
    img = `<img src="${src}" figure:class="${imgClass}">`;
  }

  for (let key of Object.keys(paragraphToken)) {
    delete paragraphToken[key];
  }
  paragraphToken.type = 'html';
  paragraphToken.inLink = false;
  paragraphToken.inRawBlock = false;

  let figureContent = linkToken ? renderer.link(linkToken.href, linkToken.title, img) : img;
  paragraphToken.text = `<figure blog-post:class="${figureClass}">${figureContent}</figure>`;
}
