/* eslint-env node */
'use strict';

const marked = require('marked');
const jsdom = require('jsdom');

module.exports = function htmlizeMarkdown(source, options = {}, callback = null) {
  let html = marked(source, options);
  html = manipulateDom(html, dom => {
    dom.querySelectorAll('a').forEach(a => {
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
  return html;
};

function manipulateDom(html, callback) {
  let dom = new jsdom.JSDOM(html);
  callback(dom.window.document);
  return dom.window.document.body.innerHTML;
}
