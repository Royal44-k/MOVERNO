import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const base = path.resolve(process.argv[2] || 'D:/Codex-chat/night-veil-brand/assets/ss27-pants-product-details-full-series');
const data = JSON.parse(await fs.readFile(path.join(base, 'products.json'), 'utf8'));

const width = 1800;
const height = 3420;
const header = 210;
const columns = 3;
const rows = 5;
const cellWidth = width / columns;
const cellHeight = (height - header) / rows;
const imageWidth = 270;
const imageHeight = 520;
const composites = [];

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const title = Buffer.from(`<svg width="${width}" height="${header}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${header}" fill="#0D0D0F"/>
  <text x="54" y="76" fill="#F1EDE6" font-family="Bahnschrift, Arial, sans-serif" font-size="40" letter-spacing="3">MOVERNO SS27 · MODEL FIT OVERVIEW</text>
  <text x="54" y="132" fill="#B9B3AA" font-family="Microsoft YaHei, Arial, sans-serif" font-size="24">15 款 / 男女试穿 / 自然动作与多样面孔 / 锁定上衣与高帮鞋</text>
  <text x="54" y="176" fill="#8D7654" font-family="Bahnschrift, Arial, sans-serif" font-size="18" letter-spacing="2">MOVE DARK. STAY SOFT.</text>
</svg>`);
composites.push({ input: title, left: 0, top: 0 });

for (let index = 0; index < data.products.length; index += 1) {
  const product = data.products[index];
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = column * cellWidth;
  const y = header + row * cellHeight;
  const cellBg = index % 2 === 0 ? '#171719' : '#202023';
  const accent = product.chapter === 'COLOR_LAB' ? '#657181' : '#8D7654';
  const label = Buffer.from(`<svg width="${cellWidth}" height="${cellHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${cellWidth}" height="${cellHeight}" fill="${cellBg}"/>
    <rect x="0" y="0" width="${cellWidth}" height="4" fill="${accent}"/>
    <text x="28" y="44" fill="#F1EDE6" font-family="Bahnschrift, Arial, sans-serif" font-size="24" font-weight="700">${esc(product.styleCode)} · ${esc(product.displayNameEn)}</text>
    <text x="28" y="76" fill="#B9B3AA" font-family="Microsoft YaHei, Arial, sans-serif" font-size="20">${esc(product.displayNameZh)} · ${esc(product.colorName)}</text>
    <text x="36" y="620" fill="#8C8882" font-family="Bahnschrift, Arial, sans-serif" font-size="14" letter-spacing="1.8">M / NATURAL ACTION</text>
    <text x="326" y="620" fill="#8C8882" font-family="Bahnschrift, Arial, sans-serif" font-size="14" letter-spacing="1.8">W / NATURAL ACTION</text>
  </svg>`);
  composites.push({ input: label, left: Math.round(x), top: Math.round(y) });

  for (const [kind, offset] of [['male-fit.png', 24], ['female-fit.png', 314]]) {
    const input = path.join(base, 'generated', product.styleCode, kind);
    const image = await sharp(input)
      .resize(imageWidth, imageHeight, { fit: 'contain', background: cellBg })
      .png()
      .toBuffer();
    composites.push({ input: image, left: Math.round(x + offset), top: Math.round(y + 90) });
  }
}

await sharp({ create: { width, height, channels: 3, background: '#0D0D0F' } })
  .composite(composites)
  .png({ compressionLevel: 9 })
  .toFile(path.join(base, 'model-fit-overview.png'));

console.log('model-fit-overview.png -> 1800x3420 / 15 styles / 30 fit images');
