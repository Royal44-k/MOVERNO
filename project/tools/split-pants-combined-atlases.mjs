import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const root = 'D:/Codex-chat/night-veil-brand/assets/ss27-pants-product-details-full-series/generated';

const jobs = [
  { style: 'PT28', axis: 'y', ratio: 0.63 },
  { style: 'PT29', axis: 'y', ratio: 0.55 },
  { style: 'PT30-A', axis: 'y', ratio: 0.61 },
  { style: 'PT22-B', axis: 'y', ratio: 0.58 },
  { style: 'PT25-B', axis: 'x', ratio: 0.68 },
  { style: 'PT27-B', axis: 'y', ratio: 0.55 },
];

for (const job of jobs) {
  const source = path.join(root, job.style, 'combined-detail-atlas.png');
  const meta = await sharp(source).metadata();
  const width = meta.width;
  const height = meta.height;

  if (!width || !height) throw new Error(`Missing dimensions: ${source}`);

  if (job.axis === 'y') {
    const cut = Math.floor(height * job.ratio);
    await sharp(source)
      .extract({ left: 0, top: 0, width, height: cut })
      .toFile(path.join(root, job.style, 'innovation-atlas.png'));
    await sharp(source)
      .extract({ left: 0, top: cut, width, height: height - cut })
      .toFile(path.join(root, job.style, 'material-brand-atlas.png'));
  } else {
    const cut = Math.floor(width * job.ratio);
    await sharp(source)
      .extract({ left: 0, top: 0, width: cut, height })
      .toFile(path.join(root, job.style, 'innovation-atlas.png'));
    await sharp(source)
      .extract({ left: cut, top: 0, width: width - cut, height })
      .toFile(path.join(root, job.style, 'material-brand-atlas.png'));
  }

  console.log(`split ${job.style}`);
}
