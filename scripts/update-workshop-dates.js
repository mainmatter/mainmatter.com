import { globSync } from "glob";
import matter from "gray-matter";
import { readFileSync, writeFileSync } from "node:fs";
import got from "got";

const workshops = globSync("src/workshops/**/*.md");

const TICKET_TAILOR_API_KEY = Buffer.from(process.env.TICKET_TAILOR_API_KEY).toString("base64");

(async () => {
  for (const workshop of workshops) {
    const raw = readFileSync(workshop, "utf8");
    const { content, data } = matter(raw);
    const { ticket_tailor_event_series_id: ticketTailorEventSeriesId } = data;
    if (ticketTailorEventSeriesId) {
      const events = await getEventOccurences(ticketTailorEventSeriesId);

      data.upcomingDates = events.map(e => {
        return {
          date: formatDateForMetadata(e.start),
          endDate: formatDateForMetadata(e.end),
          url: e.url,
        };
      });
      const output = matter.stringify(content, data);
      writeFileSync(workshop, output, "utf8");
    }
  }
})();

async function getEventOccurences(eventSeriesId) {
  const url = `https://api.tickettailor.com/v1/event_series/${eventSeriesId}/events`;
  const data = await got(url, {
    headers: {
      authorization: `Basic ${TICKET_TAILOR_API_KEY}`,
    },
  }).json();
  return data.data
    .filter(o => o.object === "event")
    .map(e => {
      return {
        start: new Date(e.start.iso),
        end: new Date(e.end.iso),
        url: e.url,
      };
    });
}

function formatDateForMetadata(date) {
  return date.toISOString().slice(0, 10);
}
