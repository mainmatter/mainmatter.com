const path = require("node:path");
const matter = require("gray-matter");

const { SITE_URL, absoluteUrl, stripHtml, workshopUrl } = require("../../utils/schema.js");

const authorNames = new Map();

function priceInEuro(price) {
  if (price === undefined || price === null || price === "") {
    return undefined;
  }

  const cents = Number(price);

  if (Number.isNaN(cents)) {
    return undefined;
  }

  return (cents / 100).toFixed(2);
}

function authorName(handle) {
  if (!authorNames.has(handle)) {
    const authorPath = path.join(__dirname, "..", "authors", `${handle}.md`);
    authorNames.set(handle, matter.read(authorPath).data.name);
  }

  return authorNames.get(handle);
}

function instructors(data) {
  return (data.leads || []).map(lead => authorName(lead.handle));
}

function courseInstances(data) {
  if (!Array.isArray(data.upcomingDates) || data.upcomingDates.length === 0) {
    return undefined;
  }

  const workshopInstructors = instructors(data);

  return data.upcomingDates.map(date => {
    const price = priceInEuro(date.price);
    const instance = {
      name: data.title,
      courseWorkload: data.format,
      startDate: date.date || date.startDate || date.start,
      endDate: date.endDate || date.end,
      instructor: workshopInstructors,
      offers: {
        url: absoluteUrl(date.url) || workshopUrl(data),
        availability: "https://schema.org/InStock",
      },
    };

    if (price) {
      instance.offers.price = price;
      instance.offers.priceCurrency = "EUR";
    }

    return instance;
  });
}

module.exports = {
  layout: "workshop",
  type: "course",
  eleventyComputed: {
    permalink: function (data) {
      return `/training/${data.page.fileSlug}/`;
    },
    meta: function (data) {
      const coursePrerequisites = Array.isArray(data.prerequisites)
        ? stripHtml(data.prerequisites.join("; "))
        : stripHtml(data.coursePrerequisites || data.prerequisites);

      return {
        ...(data.meta || {}),
        name: data.title,
        description: stripHtml(data.description || data.introduction || data.tagline),
        url: workshopUrl(data),
        image: {
          src: absoluteUrl(data.og?.image || data.hero?.image),
        },
        provider: {
          name: "Mainmatter",
          url: SITE_URL,
          sameAs: SITE_URL,
        },
        inLanguage: "en-US",
        coursePrerequisites,
        keywords: data.tags,
        hasCourseInstance: courseInstances(data),
      };
    },
  },
};
