import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const REQUIRED_PRODUCT_FIELDS = [
  'styleCode', 'slug', 'chapter', 'variant', 'sourceConcept', 'displayNameZh',
  'displayNameEn', 'silhouette', 'fabric', 'colorName', 'colorHex', 'targetPrice',
  'heroDirection', 'maleFitDirection', 'femaleFitDirection', 'innovationFocus',
  'salesProof', 'brandPlacement', 'brandAsset', 'brandTechnique', 'motifRule',
  'layoutFamily', 'sectionOrder'
];

export const CHAPTERS = [
  'FLUID_SHADOW', 'TOWER_CURRENT', 'MINERAL_TAILOR', 'APERTURE_SYSTEM', 'COLOR_LAB'
];

export const LAYOUTS = [
  'FLUID_EDITORIAL', 'TOWER_TECH', 'MINERAL_ATELIER', 'APERTURE_UTILITY', 'COLOR_LAB_COMPARE'
];

export const SECTIONS = [
  'opening', 'silhouette', 'innovation', 'maleFit', 'femaleFit',
  'identityInTouchpoint', 'materialAndCTA'
];

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();

export function validateContract({productsData, branding, baseDir}) {
  const errors = [];
  const products = productsData.products || [];
  if (products.length !== 15) errors.push(`expected 15 products, got ${products.length}`);
  const seenCodes = new Set();
  const seenSlugs = new Set();
  const chapterCounts = Object.fromEntries(CHAPTERS.map(chapter => [chapter, 0]));
  const forbidden = /\b(Louis Vuitton|Chanel|Chrome Hearts|Thug Club|adidas|AMIRI|Rick Owens|Balenciaga|LV|Double C|三叶草|三条纹)\b/i;
  for (const product of products) {
    for (const field of REQUIRED_PRODUCT_FIELDS) {
      if (product[field] === undefined || product[field] === null || product[field] === '') errors.push(`${product.styleCode || 'unknown'} missing ${field}`);
    }
    if (seenCodes.has(product.styleCode)) errors.push(`duplicate styleCode ${product.styleCode}`);
    if (seenSlugs.has(product.slug)) errors.push(`duplicate slug ${product.slug}`);
    seenCodes.add(product.styleCode);
    seenSlugs.add(product.slug);
    if (!CHAPTERS.includes(product.chapter)) errors.push(`${product.styleCode} unknown chapter ${product.chapter}`);
    else chapterCounts[product.chapter] += 1;
    if (!LAYOUTS.includes(product.layoutFamily)) errors.push(`${product.styleCode} unknown layout ${product.layoutFamily}`);
    if (!Array.isArray(product.sectionOrder) || product.sectionOrder.length !== 7 || new Set(product.sectionOrder).size !== 7 || SECTIONS.some(section => !product.sectionOrder.includes(section))) {
      errors.push(`${product.styleCode} invalid sectionOrder`);
    }
    const publicCopy = [product.displayNameZh, product.displayNameEn, product.innovationFocus, product.salesProof].join(' ');
    if (forbidden.test(publicCopy)) errors.push(`${product.styleCode} contains forbidden third-party term`);
    const source = path.resolve(baseDir, product.sourceConcept);
    if (!fs.existsSync(source)) errors.push(`${product.styleCode} missing source ${source}`);
  }
  for (const [chapter, count] of Object.entries(chapterCounts)) if (count !== 3) errors.push(`${chapter} expected 3 products, got ${count}`);
  for (const field of ['wordmarkPath', 'emblemPath', 'mvRelayPath', 'v2Path']) {
    const asset = path.resolve(baseDir, branding[field]);
    if (!fs.existsSync(asset)) errors.push(`missing branding asset ${field}: ${asset}`);
  }
  const v2 = path.resolve(baseDir, branding.v2Path);
  if (fs.existsSync(v2)) {
    const actual = sha256(fs.readFileSync(v2));
    if (actual !== branding.v2Sha256.toUpperCase()) errors.push(`V2 hash mismatch ${actual}`);
  }
  return {errors, counts: {products: products.length, chapters: Object.keys(chapterCounts).length}};
}
