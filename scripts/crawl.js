const path = require('path');
const express = require('express');
const colors = require('colors');
const HCCrawler = require('headless-chrome-crawler');

const DIST_PATH = path.join(__dirname, '..', 'dist');

let server = express();
server.use(express.static(DIST_PATH));

server.listen(3000, async function() {
  let successes = 0;
  let errors = 0;
  let success = result => {
    successes++;
    console.log(colors.blue(`* ${result.response.url}`));
  };
  let error = url => {
    errors++;
    console.log(colors.red(`* ${url} - failed to follow link`));
  };

  const crawler = await HCCrawler.launch({
    onSuccess: result => {
      if (result.response.ok) {
        success(result);
      } else {
        error(result.response.url);
      }
    },
    onError: error => error(error.previousUrl),
  });

  await crawler.queue({
    url: 'http://localhost:3000/',
    maxDepth: Infinity,
    allowedDomains: ['localhost'],
    skipRequestedRedirect: true,
  });
  await crawler.onIdle();
  await crawler.close();

  if (errors === 0) {
    console.log(colors.green(`\nSuccessfully crawled ${successes} pages.`));
    process.exit(0);
  } else {
    console.log(colors.green(`\nFailed to crwal ${errors} links.`));
    process.exit(1);
  }
});
