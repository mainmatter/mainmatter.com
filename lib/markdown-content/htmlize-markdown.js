/* eslint-env node */
'use strict';

const marked = require('marked');
const jsdom = require('jsdom');

module.exports = function htmlizeMarkdown(source, options = {}, callback = null) {
  let html = marked(source, options);
  html = manipulateDom(html, dom => {
    dom.querySelectorAll('h2').forEach(h2 => h2.classList.add('typography.headline-2'));
    dom.querySelectorAll('h3').forEach(h3 => h3.classList.add('typography.headline-3'));
    dom.querySelectorAll('h4').forEach(h4 => h4.classList.add('typography.headline-4'));
    dom.querySelectorAll('p').forEach(p => p.classList.add('typography.body-text'));
    dom.querySelectorAll('ul, ol').forEach(list => list.classList.add('list'));
    dom.querySelectorAll('ul > li').forEach(li => li.classList.add('list.item'));
    dom.querySelectorAll('ol > li').forEach(li => li.classList.add('list.item-ordered'));
    dom.querySelectorAll('table').forEach(table => table.classList.add('table'));
    dom.querySelectorAll('th').forEach(th => th.classList.add('table.header'));
    dom.querySelectorAll('td').forEach(td => td.classList.add('table.cell'));
    dom.querySelectorAll('a').forEach(a => {
      if (a.href.startsWith('/')) {
        a.dataset.internal = true;
      } else if (!a.href.startsWith('https://simplabs.com')) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      a.classList.add('typography.link');
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
