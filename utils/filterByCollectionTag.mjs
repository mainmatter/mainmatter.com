/**
 * Look up a post in a collection by its slug.
 * @param {collection} collection The collection to look in
 * @param {string} tag The post tag to look up.
 * @return {Object} An eleventy collection item.
 */
export function filterByCollectionTag(collection, tag) {
  if (!collection) {
    throw new Error("collection is not defined");
  }
  if (!tag) {
    throw new Error(`tag is either null or undefined`);
  }

  return collection.filter(item => {
    if (item.data.tags?.includes(tag)) {
      return true;
    }
  });
}
