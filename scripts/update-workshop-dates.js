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
    const { content, data } = matter(raw);
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
      const output = matter.stringify(content, data);
      writeFileSync(workshop, output, "utf8");
    }
  }
})();

async function getUpcomingEventOccurences(eventSeriesId) {
  const url = `https://api.tickettailor.com/v1/event_series/${eventSeriesId}/events`;
  const data = await got(url, {
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
