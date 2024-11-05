module.exports = {
  facebook: "",
  name: "Mainmatter",
  lang: "en",
  url:
    (process.env.CONTEXT === "production" ? process.env.URL : process.env.DEPLOY_PRIME_URL) ||
    "https://mainmatter.com",
  twitter: "",
  authorHandle: "",
  authorName: "",
  description:
    "We know the code, tools, and practices that go into successful development. We partner with our clients to solve their toughest tech challenges by sharing our skills and expertise as teammates.",
  maxPostsPerPage: 6,
};
