import { globSync } from "glob";
import matter from "gray-matter";
import { readFileSync, writeFileSync } from "node:fs";
import got from "got";

const workshops = globSync("src/workshops/**/*.md");

const TICKET_TAILOR_API_KEY = Buffer.from(process.env.TICKET_TAILOR_API_KEY).toString("base64");
const TODAY = new Date();

(async () => {
  for (const workshop of workshops) {
    const raw = readFileSync(workshop, "utf8");
    const { data } = matter(raw);
    const { ticket_tailor_event_series_id: ticketTailorEventSeriesId } = data;
    if (ticketTailorEventSeriesId) {
      const events = await getUpcomingEventOccurences(ticketTailorEventSeriesId);

      data.upcomingDates = events.map(e => {
        return {
          date: formatDateForMetadata(e.start),
          endDate: formatDateForMetadata(e.end),
          url: e.url,
          price: e.price,
        };
      });
      writeFileSync(workshop, replaceUpcomingDates(raw, data.upcomingDates), "utf8");
    }
  }
})();

// Rewrites just the `upcomingDates` block, leaving the rest of the front matter
// byte for byte as it was. Re-serializing the whole thing (as `matter.stringify`
// does) reflows every other key and leaves the file failing `prettier --check`.
function replaceUpcomingDates(raw, dates) {
  const lines = raw.split("\n");
  if (lines[0] !== "---") {
    throw new Error("Expected the file to open with front matter");
  }
  // Only ever touch the front matter, never the body below it.
  const frontMatterEnd = lines.indexOf("---", 1);
  if (frontMatterEnd === -1) {
    throw new Error("Unterminated front matter");
  }

  let start = lines.findIndex((line, i) => i < frontMatterEnd && line.startsWith("upcomingDates:"));
  // A workshop that has never had dates yet gets the key appended.
  let end = start === -1 ? (start = frontMatterEnd) : start + 1;
  // The block runs until the next top-level key or the end of the front matter.
  while (end < frontMatterEnd && /^(\s|$)/.test(lines[end])) {
    end++;
  }

  return [...lines.slice(0, start), ...formatUpcomingDates(dates), ...lines.slice(end)].join("\n");
}

function formatUpcomingDates(dates) {
  if (dates.length === 0) {
    return ["upcomingDates: []"];
  }

  return [
    "upcomingDates:",
    ...dates.flatMap(({ date, endDate, url, price }) => [
      `  - date: "${date}"`,
      `    endDate: "${endDate}"`,
      `    url: "${url}"`,
      `    price: ${price}`,
    ]),
  ];
}

async function getUpcomingEventOccurences(eventSeriesId) {
  let url = `https://api.tickettailor.com/v1/event_series/${eventSeriesId}`;
  let data = await got(url, {
    headers: {
      authorization: `Basic ${TICKET_TAILOR_API_KEY}`,
    },
  }).json();

  const { status } = data;
  if (status !== "published") {
    return [];
  }

  url = `https://api.tickettailor.com/v1/event_series/${eventSeriesId}/events`;
  data = await got(url, {
    headers: {
      authorization: `Basic ${TICKET_TAILOR_API_KEY}`,
    },
  }).json();
  return data.data
    .filter(
      o =>
        o.object === "event" &&
        o.hidden === "false" &&
        o.tickets_available === "true" &&
        o.unavailable === "false"
    )
    .map(e => {
      const price = e.ticket_types.find(t => t.type === "GA" && t.status === "on_sale").price;

      return {
        start: new Date(e.start.iso),
        end: new Date(e.end.iso),
        url: e.url,
        price,
      };
    })
    .filter(e => e.start > TODAY);
}

function formatDateForMetadata(date) {
  return date.toISOString().slice(0, 10);
}
