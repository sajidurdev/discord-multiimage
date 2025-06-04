const { Canvas, loadImage } = require('skia-canvas');
const { AttachmentBuilder } = require('discord.js');

/**
 * mergeImagesInGrid
 * Generates optimized image grids for Discord embeds:
 *   • 2 images → side‑by‑side (16:9)
 *   • 3 images → large left + two stacked right (4:3)
 *   • 4 images → 2×2 grid (4:3)
 *
 * @param {string[]} imageUrls
 *   Array of 2–4 image URLs
 * @param {object} [options]
 * @param {number} [options.spacing=2]
 *   Gap between images in pixels (default 2)
 * @param {number} [options.maxWidth=600]
 *   Full width of Discord embed image
 * @param {number} [options.maxHeight=450]
 *   Maximum height for layouts. If the ideal height exceeds this, the
 *   canvas width and height are scaled down proportionally.
 * @param {string} [options.filename='grid.png']
 *   Output filename
 * @param {string} [options.bgColor='#2f3136']
 *   Background color matching Discord dark theme
 * @returns {Promise<{file: AttachmentBuilder, imageUrl: string}>}
 */

async function mergeImagesInGrid(imageUrls = [], options = {}) {
  if (!Array.isArray(imageUrls) || imageUrls.length < 2 || imageUrls.length > 4) {
    throw new Error('discord-multiimage › imageUrls length must be between 2 and 4');
  }

  const {
    spacing = 2,
    maxWidth = 600,
    maxHeight = 450,
    filename = 'grid.png',
    bgColor = '#2f3136'
  } = options;


  const loaded = await Promise.all(
    imageUrls.map(async (src) => {
      try {
        return await loadImage(src, { maxWidth: 1024, maxHeight: 1024 });
      } catch (err) {
        console.warn(`discord-multiimage › Failed to load image: ${src}`, err.message);
        return null;
      }
    })
  );

  const images = loaded.filter(Boolean);
  if (images.length < imageUrls.length) {
    throw new Error('discord-multiimage › one or more images failed to load');
  }

  const count = images.length;
  let canvasWidth = maxWidth;
  let canvasHeight;

  const heightRatio = count === 2 ? 9 / 16 : 3 / 4;
  canvasHeight = Math.floor(canvasWidth * heightRatio);

  if (canvasHeight > maxHeight) {
    canvasHeight = maxHeight;
    canvasWidth = Math.floor(canvasHeight / heightRatio);
  }

  const canvas = new Canvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.patternQuality = 'best';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (count === 2) {
    drawTwo(ctx, images, canvasWidth, canvasHeight, spacing);
  } else if (count === 3) {
    drawThree(ctx, images, canvasWidth, canvasHeight, spacing);
  } else {
    drawFour(ctx, images, canvasWidth, canvasHeight, spacing);
  }

  const buffer = await canvas.toBuffer('png', { compressionLevel: 6, quality: 0.9 });
  const file = new AttachmentBuilder(buffer, { name: filename });
  return { file, imageUrl: `attachment://${filename}` };
}

/**
 * drawTwo
 * Side‑by‑side layout for two images.
 */
function drawTwo(ctx, imgs, w, h, gap) {
  const tileW = Math.floor((w - gap) / 2);
  drawCover(ctx, imgs[0], 0, 0, tileW, h);
  drawCover(ctx, imgs[1], tileW + gap, 0, tileW, h);
}

/**
 * drawThree
 * Large left image + two stacked right.
 */
function drawThree(ctx, imgs, w, h, gap) {
  const leftW = Math.floor(w * 0.6);
  const rightW = w - leftW - gap;
  const halfH = Math.floor((h - gap) / 2);

  drawCover(ctx, imgs[0], 0, 0, leftW, h);
  drawCover(ctx, imgs[1], leftW + gap, 0, rightW, halfH);
  drawCover(ctx, imgs[2], leftW + gap, halfH + gap, rightW, halfH);
}

/**
 * drawFour
 * 2×2 grid layout.
 */
function drawFour(ctx, imgs, w, h, gap) {
  const tileW = Math.floor((w - gap) / 2);
  const tileH = Math.floor((h - gap) / 2);

  const positions = [
    [0, 0],
    [tileW + gap, 0],
    [0, tileH + gap],
    [tileW + gap, tileH + gap]
  ];

  imgs.forEach((img, i) => {
    const [x, y] = positions[i];
    drawCover(ctx, img, x, y, tileW, tileH);
  });
}

/**
 * drawCover
 * Fits an image to fill a region, cropping excess centrally.
 */
function drawCover(ctx, img, x, y, w, h) {
  const imgAR = img.width / img.height;
  const areaAR = w / h;

  let sx, sy, sw, sh;
  if (imgAR > areaAR) {
    sw = img.height * areaAR;
    sh = img.height;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = img.width / areaAR;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

module.exports = { mergeImagesInGrid };
