/**
 * Look up a post in a collection by its slug.
 * @param {collection} collection The collection to look in
 * @param {string} slug The post slug to look up.
 * @return {Object} An eleventy collection item.
 */
export function findByCollectionSlug(collection, slug) {
  if (!collection) {
    throw new Error("collection is not defined");
  }
  if (!slug) {
    throw new Error(`slug is either null or undefined`);
  }

  const found = collection.find(item => {
    if (item.fileSlug === slug) {
      return true;
    }
  });

  if (!found) {
    return null;
  }

  return found;
}
