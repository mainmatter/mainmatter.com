const path = require('path');
const express = require('express');
const colors = require('colors');
const { SiteChecker } = require('broken-link-checker');

const DIST_PATH = path.join(__dirname, '..', 'dist');
const SERVER_URL = 'http://localhost:3000';

let server = express();
server.use(express.static(DIST_PATH));

server.listen(3000, function () {
  let successes = 0;
  let errors = 0;

  const siteChecker = new SiteChecker(
    {
      excludeExternalLinks: true,
    },
    {
      link(result) {
        if (result.broken) {
          errors++;
          console.log(formatBrokenLink(result));
        } else {
          successes++;
        }
      },
      end() {
        if (errors === 0) {
          console.log(colors.green(`\n✅ Successfully followed ${successes} links.`));
          process.exit(0);
        } else {
          console.log(colors.red(`\n❌ Failed to follow ${errors} links.`));
          process.exit(1);
        }
      },
    },
  );

  siteChecker.enqueue(SERVER_URL);
});

function formatBrokenLink(link) {
  let relativeBase = link.base.original.replace(SERVER_URL, '');
  return `❌ ${relativeBase} -> ${link.url.original}`;
}
