const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const source = path.join(projectRoot, 'assets', 'logo-concepts', '01-incised-monolith.png');
const workDir = path.join(projectRoot, 'assets', 'logo-direction-01', 'work');

const crops = {
  primary_wordmark: { left: 78, top: 165, width: 590, height: 125 },
  bilingual_wordmark: { left: 770, top: 165, width: 610, height: 205 },
  stacked_lockup: { left: 170, top: 390, width: 410, height: 420 },
  standalone_emblem: { left: 940, top: 430, width: 260, height: 380 },
};

async function main() {
  fs.mkdirSync(workDir, { recursive: true });

  for (const [name, crop] of Object.entries(crops)) {
    process.stdout.write(`processing ${name}: ${JSON.stringify(crop)}\n`);
    const cropped = await sharp(source)
      .extract(crop)
      .flatten({ background: '#ffffff' })
      .grayscale()
      .threshold(205)
      .png()
      .toBuffer();

    await sharp(cropped)
      .trim({ background: '#ffffff', threshold: 10 })
      .extend({ top: 32, bottom: 32, left: 32, right: 32, background: '#ffffff' })
      .png({ compressionLevel: 9 })
      .toFile(path.join(workDir, `${name}.png`));
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
