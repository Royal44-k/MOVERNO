const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const svgDir = path.join(projectRoot, 'assets', 'motion-contour-v2-vector', 'svg');
const proofDir = path.join(projectRoot, 'assets', 'motion-contour-v2-vector', 'proof');

const targets = [
  ['moverno-motion-contour-v2-master-tile.svg', 1600, 300],
  ['moverno-motion-contour-v2-gilded-preview.svg', 1600, 300],
  ['moverno-motion-contour-v2-tonal-plate.svg', 1200, 300],
  ['moverno-motion-contour-v2-foil-plate.svg', 1200, 300],
  ['moverno-motion-contour-v2-node-plate.svg', 1200, 300],
  ['moverno-motion-contour-v2-seam-proof.svg', 1800, 120],
  ['moverno-motion-contour-v2-line-test.svg', 1800, 300],
];

async function main() {
  fs.mkdirSync(proofDir, { recursive: true });
  for (const [filename, width, density] of targets) {
    const source = path.join(svgDir, filename);
    const destination = path.join(proofDir, filename.replace(/\.svg$/i, '.png'));
    await sharp(source, { density })
      .resize({ width, withoutEnlargement: false })
      .png({ compressionLevel: 9 })
      .toFile(destination);
    process.stdout.write(`${destination}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
