const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const svgDir = path.join(projectRoot, 'assets', 'logo-direction-01', 'svg');
const outDir = path.join(projectRoot, 'assets', 'logo-direction-01', 'size-tests');

const tests = [
  { asset: 'moverno-standalone-emblem.svg', heights: [16, 24, 32, 94] },
  { asset: 'moverno-primary-wordmark.svg', heights: [16, 24, 32, 94] },
  { asset: 'moverno-bilingual-wordmark.svg', heights: [32, 64, 94, 140] },
];

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const test of tests) {
    const source = path.join(svgDir, test.asset);
    const base = test.asset.replace(/\.svg$/i, '');
    for (const height of test.heights) {
      const exact = path.join(outDir, `${base}-h${height}px.png`);
      const zoom = path.join(outDir, `${base}-h${height}px-zoom.png`);
      const rendered = await sharp(source, { density: 600 })
        .resize({ height, withoutEnlargement: false })
        .flatten({ background: '#ffffff' })
        .png()
        .toBuffer();

      await sharp(rendered).toFile(exact);
      await sharp(rendered)
        .resize({ height: Math.max(320, height * 8), kernel: 'nearest' })
        .png({ compressionLevel: 9 })
        .toFile(zoom);
    }
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
