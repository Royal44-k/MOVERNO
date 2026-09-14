import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const projectRoot = process.cwd();
const base = path.join(projectRoot, 'assets', 'ss27-pants-product-details-full-series');
const generatedRoot = path.join(base, 'generated');
const productsDoc = JSON.parse(await fs.readFile(path.join(base, 'products.json'), 'utf8'));
const branding = JSON.parse(await fs.readFile(path.join(base, 'branding.json'), 'utf8'));
const manifest = JSON.parse(await fs.readFile(path.join(base, 'manifest.json'), 'utf8'));

const requiredAssets = [
  'hero.png',
  'silhouette-study.png',
  'innovation-atlas.png',
  'material-brand-atlas.png',
  'male-fit.png',
  'female-fit.png',
];
const requiredSections = [
  'opening',
  'silhouette',
  'innovation',
  'maleFit',
  'femaleFit',
  'identityInTouchpoint',
  'materialAndCTA',
];

const failures = [];
const warnings = [];
const checks = [];

function pass(name, detail) {
  checks.push({ name, status: 'PASS', detail });
}

function fail(name, detail) {
  checks.push({ name, status: 'FAIL', detail });
  failures.push(`${name}: ${detail}`);
}

function warn(name, detail) {
  checks.push({ name, status: 'WARN', detail });
  warnings.push(`${name}: ${detail}`);
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function sha256(file) {
  const data = await fs.readFile(file);
  return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
}

async function countFiles(dir, extension, recursive = false) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && recursive) count += await countFiles(full, extension, true);
    if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) count += 1;
  }
  return count;
}

const products = productsDoc.products;
const styleCodes = products.map((product) => product.styleCode);
const chapterNames = [...new Set(products.map((product) => product.chapter))];
const blueVariants = products.filter((product) => product.variant === 'B_BLUE_COMPARISON');
const mainVariants = products.filter((product) => product.variant !== 'B_BLUE_COMPARISON');

products.length === 15
  ? pass('product-count', '15 styles')
  : fail('product-count', `${products.length} styles, expected 15`);

chapterNames.length === 5
  ? pass('chapter-count', chapterNames.join(', '))
  : fail('chapter-count', `${chapterNames.length} chapters, expected 5`);

new Set(styleCodes).size === products.length
  ? pass('unique-style-codes', 'all style codes are unique')
  : fail('unique-style-codes', 'duplicate style code detected');

const expectedCounts = {
  posters: 15,
  editable: 15,
  previews: 15,
  mobile: 15,
  slices: 105,
};
for (const [folder, expected] of Object.entries(expectedCounts)) {
  const actual = await countFiles(path.join(base, folder), folder === 'editable' ? '.svg' : '.png', folder === 'slices');
  actual === expected
    ? pass(`output-count-${folder}`, `${actual}`)
    : fail(`output-count-${folder}`, `${actual}, expected ${expected}`);
}

const v2Path = path.resolve(base, branding.v2Path);
const actualV2Hash = await sha256(v2Path);
actualV2Hash === branding.v2Sha256
  ? pass('v2-master-hash', actualV2Hash)
  : fail('v2-master-hash', `${actualV2Hash}, expected ${branding.v2Sha256}`);

blueVariants.length === 3 && blueVariants.every((product) => product.chapter === 'COLOR_LAB')
  ? pass('blue-variants-isolated', blueVariants.map((product) => product.styleCode).join(', '))
  : fail('blue-variants-isolated', 'blue comparison styles must be exactly three and live only in COLOR_LAB');

mainVariants.every((product) => product.chapter !== 'COLOR_LAB')
  ? pass('main-line-excludes-color-lab', `${mainVariants.length} main-line styles`) 
  : fail('main-line-excludes-color-lab', 'main-line style found in COLOR_LAB');

for (const product of products) {
  const code = product.styleCode;
  const sourceDir = path.join(generatedRoot, code);
  const productManifest = manifest.products.find((item) => item.styleCode === code);
  if (!productManifest) {
    fail(`${code}-manifest`, 'missing product manifest entry');
    continue;
  }

  const assetHashes = [];
  for (const asset of requiredAssets) {
    const file = path.join(sourceDir, asset);
    if (!(await exists(file))) {
      fail(`${code}-asset-${asset}`, 'missing');
      continue;
    }
    const stat = await fs.stat(file);
    if (stat.size === 0) fail(`${code}-asset-${asset}`, 'empty file');
    assetHashes.push(await sha256(file));
  }
  if (assetHashes.length === requiredAssets.length && new Set(assetHashes).size === requiredAssets.length) {
    pass(`${code}-unique-page-assets`, '6/6 unique source images');
  } else {
    fail(`${code}-unique-page-assets`, `${new Set(assetHashes).size}/${requiredAssets.length} unique source images`);
  }

  const posterPath = path.join(base, productManifest.poster);
  const posterMeta = await sharp(posterPath).metadata();
  posterMeta.width === 1080 && posterMeta.height === 6500
    ? pass(`${code}-poster-dimensions`, '1080x6500')
    : fail(`${code}-poster-dimensions`, `${posterMeta.width}x${posterMeta.height}`);

  const posterStat = await fs.stat(posterPath);
  posterStat.size > 100_000
    ? pass(`${code}-poster-nonempty`, `${posterStat.size} bytes`)
    : fail(`${code}-poster-nonempty`, `${posterStat.size} bytes`);

  const svgPath = path.join(base, productManifest.svg);
  const svg = await fs.readFile(svgPath, 'utf8');
  const requiredText = [
    'MOVERNO',
    code,
    product.displayNameZh,
    product.displayNameEn,
    branding.mission,
    branding.belief,
    'MOVE DARK. STAY SOFT.',
    `¥${product.targetPrice}`,
    '身份藏在触点里',
    '概念渲染，非实物拍摄',
  ];
  const missingText = requiredText.filter((text) => !svg.includes(text));
  missingText.length === 0
    ? pass(`${code}-required-copy`, `${requiredText.length}/${requiredText.length}`)
    : fail(`${code}-required-copy`, `missing: ${missingText.join(' | ')}`);

  const imageCount = (svg.match(/<image\b/g) ?? []).length;
  imageCount === 6
    ? pass(`${code}-image-count`, '6 embedded images, one per visual section')
    : fail(`${code}-image-count`, `${imageCount}, expected 6`);

  const sectionNames = productManifest.sectionMap.map((section) => section.name);
  const sectionSetOk = requiredSections.every((section) => sectionNames.includes(section)) && sectionNames.length === 7;
  sectionSetOk
    ? pass(`${code}-section-set`, sectionNames.join(' > '))
    : fail(`${code}-section-set`, sectionNames.join(' > '));

  let cursor = 0;
  let contiguous = true;
  for (const section of productManifest.sectionMap) {
    if (section.top !== cursor || section.height <= 0) contiguous = false;
    cursor += section.height;
  }
  contiguous && cursor === 6500
    ? pass(`${code}-section-coverage`, '0..6500 contiguous')
    : fail(`${code}-section-coverage`, `contiguous=${contiguous}, end=${cursor}`);

  for (const kind of ['male-fit.png', 'female-fit.png']) {
    const meta = await sharp(path.join(sourceDir, kind)).metadata();
    const fullBodyResolution = (meta.width ?? 0) >= 1000 && (meta.height ?? 0) >= 1400;
    fullBodyResolution
      ? pass(`${code}-${kind}-resolution`, `${meta.width}x${meta.height}`)
      : warn(`${code}-${kind}-resolution`, `${meta.width}x${meta.height}; review crop clarity manually`);
  }
}

manifest.products.length === 15
  ? pass('manifest-product-count', '15 entries')
  : fail('manifest-product-count', `${manifest.products.length}, expected 15`);

const report = {
  collection: productsDoc.collection,
  verifiedAt: new Date().toISOString(),
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  summary: {
    checks: checks.length,
    passed: checks.filter((check) => check.status === 'PASS').length,
    warnings: warnings.length,
    failures: failures.length,
    products: products.length,
    chapters: chapterNames.length,
    posters: expectedCounts.posters,
    slices: expectedCounts.slices,
  },
  failures,
  warnings,
  checks,
};

await fs.writeFile(path.join(base, 'qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`VERIFY ${report.result}`);
console.log(`checks=${report.summary.checks} pass=${report.summary.passed} warn=${report.summary.warnings} fail=${report.summary.failures}`);
console.log(`products=${report.summary.products} chapters=${report.summary.chapters} posters=${report.summary.posters} slices=${report.summary.slices}`);
if (warnings.length) console.log(`WARNINGS\n${warnings.join('\n')}`);
if (failures.length) {
  console.error(`FAILURES\n${failures.join('\n')}`);
  process.exitCode = 1;
}
