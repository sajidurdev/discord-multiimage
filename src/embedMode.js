/**
 * buildStackedImageData
 * --------------------
 * Prepares an array of image URLs for a “stacked‑embed” gallery.
 * Each URL can be dropped into its own EmbedBuilder with an optional
 * shared <embed.setURL()> so Discord groups them visually on desktop.
 *
 * const { imageUrls, sharedUrl } = buildStackedImageData([
 *   'https://img1.jpg',
 *   'https://img2.jpg',
 *   'https://img3.jpg'
 * ], { sharedUrl: 'https://my-site.com/gallery' });
 * 
 * const embeds = imageUrls.map((url, i) =>
 *   new EmbedBuilder()
 *     .setImage(url)
 *     .setURL(sharedUrl)       // makes Discord group them
 *     .setTitle(`Image #${i+1}`)
 * );
 * await channel.send({ embeds });
 *
 *
 * @param {string[]} imageUrls                 Array of image URLs (≥1)
 * @param {object}    [options]
 * @param {string}    [options.sharedUrl]      A URL to assign to *all* embeds
 *                                             so Discord groups them visually.
 * @returns {{ imageUrls: string[], sharedUrl?: string }}
 */
function buildStackedImageData(imageUrls = [], options = {}) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    throw new Error('discord-multiimage › please supply at least one image URL');
  }

  const filtered = imageUrls.filter(u => typeof u === 'string' && /^https?:\/\//i.test(u));
  if (filtered.length === 0) {
    throw new Error('discord-multiimage › none of the provided URLs are valid HTTP/S links');
  }

  return {
    imageUrls: filtered,
    sharedUrl: options.sharedUrl || undefined,
  };
}

module.exports = { buildStackedImageData };
