const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const svgDir = path.join(projectRoot, 'assets', 'logo-direction-01', 'svg');
const pngDir = path.join(projectRoot, 'assets', 'logo-direction-01', 'png');
const proofDir = path.join(projectRoot, 'assets', 'logo-direction-01', 'proof');

async function main() {
  fs.mkdirSync(pngDir, { recursive: true });
  fs.mkdirSync(proofDir, { recursive: true });
  const files = fs.readdirSync(svgDir).filter((name) => name.endsWith('.svg')).sort();

  for (const file of files) {
    const source = path.join(svgDir, file);
    const isReverse = /-reverse\.svg$/i.test(file);
    const target = path.join(pngDir, file.replace(/\.svg$/i, '@4x.png'));
    await sharp(source, { density: 600 })
      .resize({ width: 2400, withoutEnlargement: false })
      .png({ compressionLevel: 9 })
      .toFile(target);

    await sharp(source, { density: 300 })
      .resize({ width: 1600, withoutEnlargement: false })
      .flatten({ background: isReverse ? '#000000' : '#ffffff' })
      .png({ compressionLevel: 9 })
      .toFile(path.join(proofDir, file.replace(/\.svg$/i, '-proof.png')));
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
