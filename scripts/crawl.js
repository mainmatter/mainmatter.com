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
  const crawler = await HCCrawler.launch({
    onSuccess: result => {
      successes++;
      console.log(colors.blue(`* ${result.response.url}`));
    },
    onError: error => {
      errors++;
      console.log(colors.red(`* failed to follow 1 link from ${error.previousUrl}`));
    },
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
