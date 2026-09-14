import fs from 'node:fs/promises';
import path from 'node:path';
import {validateContract} from './lib/pants-product-details-contract.mjs';

const baseDir = path.resolve('assets/ss27-pants-product-details-full-series');
const productsData = JSON.parse(await fs.readFile(path.join(baseDir, 'products.json'), 'utf8'));
const branding = JSON.parse(await fs.readFile(path.join(baseDir, 'branding.json'), 'utf8'));
const result = validateContract({productsData, branding, baseDir});
if (result.errors.length) {
  console.error(result.errors.join('\n'));
  process.exit(1);
}
console.log(`PASS ${result.counts.products} products / ${result.counts.chapters} chapters / V2 hash locked`);
