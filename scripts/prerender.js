const util = require('util');
const path = require('path');
const fs = require('fs-extra')
const express = require('express');
const puppeteer = require('puppeteer');
const colors = require('colors');
const critical = require('critical');

const DIST_PATH = path.join(__dirname, '..', 'dist');
const HTML_PATH = path.join(__dirname, '..', 'dist', 'index.html');
const GlimmerRenderer = require(path.join(DIST_PATH, 'ssr-app.js'));

const ROUTES_MAP = require('../config/routes-map')();
const HTML = fs.readFileSync(HTML_PATH).toString();

async function snapshot(browser, routePath) {
  let page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.goto(`http://localhost:3000${routePath}`, { waitUntil: 'networkidle0' });
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
    folder: './',
    html: input,
    width: 1300,
    height: 900
  });
  await fs.writeFile(fileName, result.toString('utf8'));
}

const renderer = new GlimmerRenderer();
let server = express();
server.get('*', async function(req, res, next) {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    let origin = `${req.protocol}://${req.headers.host}`;
    let app = await renderer.render(origin, req.url);
    let body = `<div id="app">${app}</div>`;
    body = HTML.replace('<div id="app"></div>', body);
    res.send(body);
  } else {
    next();
  }
});
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
