/* eslint-env node */
'use strict';

const marked = require('marked');
const jsdom = require('jsdom');
const highlightjs = require('highlight.js');

const renderer = {
  code(code, language) {
    let highlighted = code;
    if (language) {
      highlighted = highlightjs.highlight(language, code).value;
    }

    return `<pre source:scope><code>${highlighted}</code></pre>`;
  }
};
marked.use({ renderer });

module.exports = function htmlizeMarkdown(source, callback = null) {
  source = preventBundleFingerprintReplacement(source);
  let html = marked(source);
  html = manipulateDom(html, (dom) => {
    blockifyClasses(dom);
    dom.querySelectorAll('a').forEach((a) => {
      if (a.href.startsWith('/')) {
        a.dataset.internal = true;
      } else if (!a.href.startsWith('https://simplabs.com')) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
    });
    if (callback) {
      callback(dom);
    }
  });
  return encodeCurlies(html);
};

function manipulateDom(html, callback) {
  let dom = new jsdom.JSDOM(html);
  callback(dom.window.document);
  return dom.window.document.body.innerHTML;
}

function blockifyClasses(dom) {
  let classedElements = dom.querySelectorAll('[class]');
  for (let element of classedElements) {
    let klasses = element.classList.values();
    for (let klass of klasses) {
      element.setAttribute('block:class', klass);
    }
    element.removeAttribute('class');
  }
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
