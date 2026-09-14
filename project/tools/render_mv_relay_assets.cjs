const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const assetRoot = path.join(projectRoot, 'assets', 'ss27-pants-mv-relay-selected');
const svgDir = path.join(assetRoot, 'svg');
const pngDir = path.join(assetRoot, 'png');
const proofDir = path.join(assetRoot, 'proof');
const sizeDir = path.join(assetRoot, 'size-tests');

async function renderPngs() {
  fs.mkdirSync(pngDir, { recursive: true });
  fs.mkdirSync(sizeDir, { recursive: true });

  for (const name of ['moverno-mv-relay.svg', 'moverno-mv-relay-reverse.svg']) {
    const source = path.join(svgDir, name);
    const output = path.join(pngDir, name.replace('.svg', '@4x.png'));
    await sharp(source, { density: 600 })
      .resize({ width: 2400, height: 2400, fit: 'contain', withoutEnlargement: false })
      .png({ compressionLevel: 9 })
      .toFile(output);
  }

  const source = path.join(svgDir, 'moverno-mv-relay.svg');
  for (const height of [16, 24, 32, 94]) {
    const exact = path.join(sizeDir, `moverno-mv-relay-h${height}px.png`);
    const zoom = path.join(sizeDir, `moverno-mv-relay-h${height}px-zoom.png`);
    const rendered = await sharp(source, { density: 600 })
      .resize({ height, width: height, fit: 'contain', withoutEnlargement: false })
      .flatten({ background: '#ffffff' })
      .png()
      .toBuffer();
    await sharp(rendered).toFile(exact);
    await sharp(rendered)
      .resize({ width: 480, height: 480, fit: 'contain', kernel: 'nearest' })
      .png({ compressionLevel: 9 })
      .toFile(zoom);
  }

  await sharp(path.join(proofDir, 'moverno-mv-relay-application-proof.svg'), { density: 180 })
    .resize({ width: 1600, height: 1000, fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(proofDir, 'moverno-mv-relay-application-proof.png'));
}

renderPngs().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
