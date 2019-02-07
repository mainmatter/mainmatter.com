const util = require('util');
const path = require('path');
const fs = require('fs-extra')
const express = require('express');
const puppeteer = require('puppeteer');
const colors = require('colors');
const critical = require('critical');

const ROUTES_MAP = require('../config/routes-map')();
const DIST_PATH = path.join(__dirname, '..', 'dist');

async function snapshot(browser, routePath) {
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.evaluate(path => {
    return window.__router__.navigate(path);
  }, routePath);
  return page.content();
}

async function persist(html, routePath) {
  let fileName = path.join(DIST_PATH, routePath, 'index.html');

  await fs.ensureDir(path.dirname(fileName), { recursive: true });
  let exists = await fs.exists(fileName);
  if (exists) {
    await fs.unlink(fileName);
  }
  await fs.writeFile(fileName, html);

  return fileName;
}

async function inlineCss(fileName) {
  let input = await fs.readFile(fileName, 'utf8');
  let result = await critical.generate({
    inline: true,
    base: DIST_PATH,
    html: input,
    width: 1300,
    height: 900
  });
  await fs.writeFile(fileName, result.toString('utf8'));
}

let server = express();
server.use(express.static(DIST_PATH));

server.listen(3000, async function () {
  let browser = await puppeteer.launch({ headless: true });
  let routes = ROUTES_MAP;
  let paths = Object.keys(routes);

  await Promise.all(paths.map(async (routePath) => {
    let html = await snapshot(browser, routePath);
    let fileName = await persist(html, routePath);
    await inlineCss(fileName);

    console.log(`${routePath} => ${fileName}.`.blue);
  }));
  console.log(`\nRendered ${paths.length} routes.`.green);
  
  await browser.close();
  process.exit(0);
});
