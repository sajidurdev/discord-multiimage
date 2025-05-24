const { mergeImagesInGrid }   = require('./canvasMode');
const { buildStackedImageData } = require('./embedMode');

/**
 * createMultiImageData
 * --------------------
 * One friendly entry‑point that gives you either:
 *   • Grid mode    → { file, imageUrl }
 *   • Stacked mode → { imageUrls, sharedUrl }
 *
 * @param {object} cfg
 * @param {('grid'|'stacked')} cfg.mode        Which rendering mode to use
 * @param {string[]}           cfg.imageUrls   Array of image URLs
 * @param {object}             [cfg.options]   Passed straight to the chosen helper
 * @returns {Promise<object>}  See examples below
 *
 *
 * // Grid example
 * const { file, imageUrl } = await createMultiImageData({
 *   mode: 'grid',
 *   imageUrls: ['url1', 'url2', 'url3'],
 *   options: { size: 256, spacing: 16 }
 * });
 * const embed = new EmbedBuilder().setImage(imageUrl);
 * await interaction.reply({ embeds: [embed], files: [file] });
 *
 * // Stacked example
 * const { imageUrls } = createMultiImageData({
 *   mode: 'stacked',
 *   imageUrls: ['url1', 'url2'],
 *   options: { sharedUrl: 'https://my-site.com/gallery' }
 * });
 * const embeds = imageUrls.map(u => new EmbedBuilder().setImage(u));
 * await channel.send({ embeds });
 *
 */
async function createMultiImageData({ mode, imageUrls, options = {} } = {}) {
  if (!mode) throw new Error('discord-multiimage › “mode” is required');
  if (!Array.isArray(imageUrls)) throw new Error('discord-multiimage › “imageUrls” must be an array');

  switch (mode) {
    case 'grid':
      return mergeImagesInGrid(imageUrls, options);

    case 'stacked':
      return buildStackedImageData(imageUrls, options);

    default:
      throw new Error(`discord-multiimage › unknown mode: ${mode}`);
  }
}

module.exports = {
  createMultiImageData,
  mergeImagesInGrid,
  buildStackedImageData,
};
