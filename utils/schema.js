const SITE_URL = "https://mainmatter.com";

function absoluteUrl(value) {
  if (!value) {
    return undefined;
  }

  return new URL(value, SITE_URL).href;
}

function stripHtml(value) {
  if (!value) {
    return undefined;
  }

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function workshopUrl(data) {
  return absoluteUrl(`/training/${data.page.fileSlug}/`);
}

function courseListSchema(workshops, name) {
  const items = (workshops || [])
    .filter(Boolean)
    .map(workshop => absoluteUrl(workshop.url))
    .filter(Boolean);

  if (items.length < 3) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((url, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url,
    })),
  };
}

function serializeJsonLd(value) {
  return JSON.stringify(value, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

module.exports = {
  SITE_URL,
  absoluteUrl,
  courseListSchema,
  serializeJsonLd,
  stripHtml,
  workshopUrl,
};
