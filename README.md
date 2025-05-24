# 🖼️ discord-multiimage

<div align="center">

**Transform messy Discord image spam into beautiful, unified galleries**

*The zero-friction way to send multiple images in Discord without the clutter*

[![npm version](https://img.shields.io/npm/v/discord-multiimage?style=for-the-badge&color=crimson&logo=npm)](https://www.npmjs.com/package/discord-multiimage)
[![License MIT](https://img.shields.io/github/license/sajidurdev/discord-multiimage?style=for-the-badge&color=blue)](LICENSE)
[![Discord.js v14+](https://img.shields.io/badge/discord.js-v14%2B-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Downloads](https://img.shields.io/npm/dm/discord-multiimage?style=for-the-badge&color=green)](https://npmjs.com/package/discord-multiimage)

</div>

---

## 🎯 The Problem

Discord bots that send multiple images create **visual chaos**:

```
🤖 Bot: Here are your results!
[Embed 1: Single image with title]
[Embed 2: Single image with title] 
[Embed 3: Single image with title]
[Embed 4: Single image with title]
```

**Result**: Cluttered chat, repetitive titles, inconsistent spacing, poor mobile experience.

## ✨ The Solution

`discord-multiimage` creates **native-looking galleries** that feel like Discord designed them:

```
🤖 Bot: Here are your results!
[Single unified embed with 4 images in perfect grid layout]
```

**Result**: Clean, professional, mobile-friendly image presentations.

---


## 🚀 Quick Start

```bash
npm install discord-multiimage
```

---

### 🧱 Grid Mode – Merge into One Embed

Ideal for displaying 2–4 images in a **single unified layout**.

```js
const { mergeImagesInGrid } = require('discord-multiimage');
const { EmbedBuilder } = require('discord.js');

const imageUrls = [
  'https://example.com/screenshot1.png',
  'https://example.com/screenshot2.png',
  'https://example.com/screenshot3.png'
];

const { file, imageUrl } = await mergeImagesInGrid(imageUrls);

const embed = new EmbedBuilder()
  .setTitle('Game Screenshots')
  .setImage(imageUrl)
  .setColor('#5865F2');

await interaction.reply({ embeds: [embed], files: [file] });
```

---

### 🧩 Stacked Mode – Clean Multiple Embeds

Great for **scrollable galleries** like art portfolios or product shots.

```js
const { buildStackedImageData } = require('discord-multiimage');
const { EmbedBuilder } = require('discord.js');

const { imageUrls, invisibleTitle, groupUrl } = buildStackedImageData([
  'https://example.com/art1.jpg',
  'https://example.com/art2.jpg',
  'https://example.com/art3.jpg'
], {
  groupUrl: 'https://portfolio.example.com' // Required for grouping
});

const embeds = imageUrls.map(url =>
  new EmbedBuilder()
    .setTitle(invisibleTitle)  // Invisible but needed for Discord to group (Optional: You can use any title yet it will appear as a link)
    .setURL(groupUrl)
    .setImage(url)
    .setColor('#FF6B6B')
);

await channel.send({ embeds });
```

---

### 🪄 One Unified API – Auto Mode Switch

Use `createMultiImageData()` to let your bot dynamically choose layout style.

```js
const { createMultiImageData } = require('discord-multiimage');
const { EmbedBuilder } = require('discord.js');

const result = await createMultiImageData({
  mode: 'grid', // or 'stacked'
  imageUrls: ['https://example.com/img1.png', 'https://example.com/img2.png'],
  options: {
    spacing: 6,
    backgroundColor: '#2f3136'
  }
});

if (result.file) {
  const embed = new EmbedBuilder().setImage(result.imageUrl);
  await interaction.reply({ embeds: [embed], files: [result.file] });
} else {
  const embeds = result.imageUrls.map(url =>
    new EmbedBuilder().setImage(url).setURL(result.groupUrl).setTitle('\u200B')
  );
  await channel.send({ embeds });
}
```

---

## 🎨 Visual Examples

### Grid Layouts (Auto-Generated)

| **2 Images** | **3 Images** | **4 Images** |
|:---:|:---:|:---:|
| Side-by-side<br/>*(16:9 ratio)* | Large + Stack<br/>*(4:3 ratio)* | Perfect Grid<br/>*(1:1 ratio)* |
| ![IMG1](https://i.imgur.com/8Km9tLL.jpg) ![IMG2](https://i.imgur.com/N5uCbDu.jpg) | ![IMG1](https://i.imgur.com/8Km9tLL.jpg)<br/>![IMG2](https://i.imgur.com/N5uCbDu.jpg) | ![IMG1](https://i.imgur.com/8Km9tLL.jpg) ![IMG2](https://i.imgur.com/N5uCbDu.jpg)<br/>![IMG3](https://i.imgur.com/8Km9tLL.jpg) ![IMG4](https://i.imgur.com/N5uCbDu.jpg) |


### Before vs After Comparison

<table>
<tr>
<th>❌ Without discord-multiimage</th>
<th>✅ With discord-multiimage</th>
</tr>
<tr>
<td>

```
Bot: Here are the match results!

📊 Match Statistics
[Image: Player stats screenshot]

📊 Match Statistics  
[Image: Team composition]

📊 Match Statistics
[Image: Game timeline]

📊 Match Statistics
[Image: Final scoreboard]
```

</td>
<td>

```
Bot: Here are the match results!

📊 Match Statistics
[Beautiful 2x2 grid showing all 4 images
 in one clean, professional embed]
```

</td>
</tr>
</table>

---

## 🛠️ Advanced Configuration

### Grid Mode Options

```js
const { file, imageUrl } = await mergeImagesInGrid(urls, {
  spacing: 4,           // Pixels between images (default: 2)
  maxWidth: 800,        // Maximum canvas width (default: 600)
  backgroundColor: '#36393f', // Canvas background color
  cornerRadius: 8       // Rounded corners for images
});
```

### Stacked Mode Options

```js
const { imageUrls, invisibleTitle, groupUrl } = buildStackedImageData(urls, {
  groupUrl: 'https://your-site.com/gallery', // Required for grouping
  titleText: '\u200B'   // Custom invisible character (default: zero-width space)
});
```

---

## 🎯 Use Cases & Examples

### 🎮 Gaming Bots
```js
// Show match highlights in one clean embed
const highlights = await mergeImagesInGrid([
  killcam1, killcam2, scoreboard, playerStats
]);
```

### 🎨 Art & Portfolio Bots  
```js
// Create scrollable art galleries
const gallery = buildStackedImageData(artworkUrls, {
  groupUrl: 'https://artist.portfolio.com'
});
```

### 📊 Analytics & Monitoring
```js
// Combine multiple chart screenshots
const dashboard = await mergeImagesInGrid([
  salesChart, trafficChart, conversionChart
]);
```

### 🏪 E-commerce & Marketplace
```js
// Product image galleries
const productGallery = buildStackedImageData([
  mainPhoto, sideView, detailShot, packagingPhoto
]);
```

---

## 🤔 Grid vs Stacked - Decision Guide

| **Scenario** | **Recommended Mode** | **Why** |
|--------------|---------------------|---------|
| Screenshots to compare side-by-side | **Grid** | Visual comparison is easier |
| Art portfolio or photo gallery | **Stacked** | Users want to focus on each image |
| Dashboard with multiple charts | **Grid** | Overview of all metrics at once |
| Step-by-step tutorial images | **Stacked** | Sequential viewing preferred |
| Before/after comparisons | **Grid** | Direct visual comparison |
| Large collection (5+ images) | **Stacked** | Grid limited to 4 images max |

---

## 🧩 Compatibility

- ✅ Works with Discord.js v14+
- ⚠️ Requires Node.js ≥ 16.9
- 🖼️ Uses [skia-canvas](https://www.npmjs.com/package/skia-canvas) — make sure your environment supports native modules

## ⚡ Performance & Technical Details

### Dependencies
- **Core**: `discord.js` v14+
- **Image Processing**: `skia-canvas` (faster than node-canvas)
- **Zero bloat**: No unnecessary dependencies

### Image Processing
- **Automatic resizing** to fit Discord's embed limits
- **Smart aspect ratio** preservation
- **WebP optimization** for smaller file sizes
- **Cross-platform** canvas rendering

### Discord Compatibility
- ✅ **Mobile optimized** - perfect scrolling and zoom
- ✅ **Desktop native** - looks like built-in Discord features  
- ✅ **Embed limits** - respects Discord's 25MB file size limits
- ✅ **Rate limiting** - works with standard Discord.js rate limiting

---

## 🚨 Common Pitfalls & Solutions

### ❌ Stacked embeds not grouping?
**Problem**: Embeds appear separately instead of grouped.
```js
// Missing required URL
.setURL(groupUrl) // ← This is required for grouping!
```

### ❌ Images loading slowly?
**Problem**: Large images taking too long to process.
```js
// Optimize with smaller max width
await mergeImagesInGrid(urls, { maxWidth: 400 });
```

### ❌ Grid looking weird on mobile?
**Problem**: Images don't scale properly on small screens.
```js
// Discord handles this automatically with our layouts!
// No additional code needed - it just works ✨
```

---

## 🤝 Contributing

We love contributions! Here's how to get started:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/sajidurdev/discord-multiimage.git`
3. **Install** dependencies: `npm install`
4. **Create** a feature branch: `git checkout -b amazing-feature`
5. **Make** your changes and add tests
6. **Submit** a pull request

### Development Setup
```bash
git clone https://github.com/sajidurdev/discord-multiimage.git
cd discord-multiimage
npm install
npm test
```

---

## 📄 License

MIT © [sajidurdev](https://github.com/sajidurdev)

**Free to use in any project** - commercial or open source. Attribution appreciated but not required.

---

<div align="center">

**Made with ❤️ for the Discord community**

[📚 Usage Guide](#-quick-start) • [🐛 Report Bug](https://github.com/sajidurdev/discord-multiimage/issues) • [💡 Request Feature](https://github.com/sajidurdev/discord-multiimage/issues) • [💬 Discord Server](https://discord.gg/your-server)

⭐ **Star this repo if it helped you build better Discord bots!** ⭐

</div>