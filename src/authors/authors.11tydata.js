module.exports = {
  /*
  Slightly hacky. As 11ty does not support double layer pagination out of the box,
  we are repressing permalinks here and using pagination to generate author pages with multiple post pages under it.
  This does mean we need to be manually buld up the link to the author pages in our template language.
  eg. /blog/author/{{ author.data.page.fileSlug }}
  */
  permalink: false,
};
