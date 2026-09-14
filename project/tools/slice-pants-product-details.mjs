import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base = path.resolve(process.argv[2] || 'D:/Codex-chat/night-veil-brand/assets/ss27-pants-product-details-pilot');
const data = JSON.parse(await fs.readFile(path.join(base, 'products.json'), 'utf8'));
const regions = [
  {name: '01-hero.png', top: 0, height: 1080},
  {name: '02-silhouette.png', top: 1080, height: 870},
  {name: '03-relay-anatomy.png', top: 1950, height: 810},
  {name: '04-brand-touchpoints.png', top: 2760, height: 750},
  {name: '05-material-in-motion.png', top: 3510, height: 790},
  {name: '06-brand-close.png', top: 4300, height: 780}
];

if (regions.reduce((sum, region) => sum + region.height, 0) !== 5080) throw new Error('Slice heights must total 5080');
if (regions.some((region, index) => index && region.top !== regions[index - 1].top + regions[index - 1].height)) throw new Error('Slice regions must be contiguous');

let count = 0;
for (const product of data.products) {
  const out = path.join(base, 'slices', product.id.toLowerCase());
  await fs.mkdir(out, {recursive: true});
  for (const region of regions) {
    await sharp(product.poster).extract({left: 0, top: region.top, width: 1080, height: region.height}).png({compressionLevel: 8}).toFile(path.join(out, region.name));
    count += 1;
  }
}
console.log(`${data.products.length} products, ${count} slices`);

