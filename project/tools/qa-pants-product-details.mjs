import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base = path.resolve(process.argv[2] || 'D:/Codex-chat/night-veil-brand/assets/ss27-pants-product-details-pilot');
const data = JSON.parse(await fs.readFile(path.join(base, 'products.json'), 'utf8'));
const branding = JSON.parse(await fs.readFile(path.join(base, 'branding.json'), 'utf8'));
const promptData = JSON.parse(await fs.readFile(path.join(base, 'prompts.json'), 'utf8'));
const records = [];

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const requiredSlices = ['01-hero.png','02-silhouette.png','03-relay-anatomy.png','04-brand-touchpoints.png','05-material-in-motion.png','06-brand-close.png'];
const sliceTops = [0, 1080, 1950, 2760, 3510, 4300];
await fs.mkdir(path.join(base, 'qa-mobile'), {recursive: true});
const contactTiles = [];

for (const product of data.products) {
  const posterBytes = await fs.readFile(product.poster);
  const posterMeta = await sharp(posterBytes).metadata();
  const svgPath = path.join(base, 'editable', `${product.id.toLowerCase()}-${product.slug}-detail.svg`);
  const svg = await fs.readFile(svgPath, 'utf8');
  const sourceBytes = await fs.readFile(product.source);
  const heroBytes = await fs.readFile(product.hero);
  const sourceMeta = await sharp(sourceBytes).metadata();
  const heroMeta = await sharp(heroBytes).metadata();
  const slices = await Promise.all(requiredSlices.map(async name => {
    const file = path.join(base, 'slices', product.id.toLowerCase(), name);
    const bytes = await fs.readFile(file);
    const meta = await sharp(bytes).metadata();
    return {name, width: meta.width, height: meta.height, bytes: bytes.length};
  }));
  const sliceBuffers = await Promise.all(requiredSlices.map(name => fs.readFile(path.join(base, 'slices', product.id.toLowerCase(), name))));
  const reconstructed = await sharp({create:{width:1080,height:5080,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(sliceBuffers.map((input, index) => ({input, left:0, top:sliceTops[index]}))).raw().toBuffer();
  const posterRaw = await sharp(posterBytes).ensureAlpha().raw().toBuffer();
  const roiInsideSource = product.details.every(detail => {
    const [x, y, width, height] = detail.roi;
    return x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= sourceMeta.width && y + height <= sourceMeta.height;
  });
  const mobilePath = path.join(base, 'qa-mobile', `${product.id.toLowerCase()}-375w.png`);
  await sharp(posterBytes).resize({width:375}).png({compressionLevel:8}).toFile(mobilePath);
  const heroTile = await sharp(heroBytes).resize({width:368,height:420,fit:'cover'}).png().toBuffer();
  const brandTile = await sharp(path.join(base, 'slices', product.id.toLowerCase(), '04-brand-touchpoints.png')).resize({width:368}).png().toBuffer();
  const column = records.length;
  contactTiles.push({input:heroTile,left:32+column*424,top:118});
  contactTiles.push({input:brandTile,left:32+column*424,top:554});
  const checks = {
    posterDimensions: posterMeta.width === 1080 && posterMeta.height === 5080,
    sourceEmbeddedVerbatim: svg.includes(sourceBytes.toString('base64')),
    heroEmbeddedVerbatim: svg.includes(heroBytes.toString('base64')),
    missionPresent: svg.includes('让黑夜不必黯然，') && svg.includes('让差异不必喧哗。'),
    beliefPresent: svg.includes('Different But Excellent.'),
    styleCodePresent: svg.includes(product.styleCode),
    headlinePresent: product.headline.every(line => svg.includes(line)),
    exactBrandingEmbedded: false,
    noExternalRasterDependencies: !svg.includes('href="http://') && !svg.includes('href="https://') && !svg.includes('file:///'),
    sixSlices: slices.length === 6 && slices.every(slice => slice.width === 1080),
    sliceRoundTripExact: reconstructed.equals(posterRaw),
    roiInsideSource,
    heroMinimumSize: heroMeta.width >= 1000 && heroMeta.height >= 1000,
    disclaimerPresent: svg.includes('概念渲染，非实物拍摄')
  };
  checks.exactBrandingEmbedded = svg.includes((await fs.readFile(branding.wordmarkPath)).toString('base64')) && svg.includes((await fs.readFile(branding.emblemPath)).toString('base64')) && svg.includes((await fs.readFile(branding.mvRelayPath)).toString('base64'));
  records.push({
    id: product.id,
    styleCode: product.styleCode,
    posterSha256: sha(posterBytes),
    sourceSha256: sha(sourceBytes),
    heroSha256: sha(heroBytes),
    dimensions: [posterMeta.width, posterMeta.height],
    slices,
    checks,
    pass: Object.values(checks).every(Boolean)
  });
}

const contactLabels = data.products.map((product, index) => `<text x="${32+index*424}" y="92" fill="#EEE9DF" font-family="Microsoft YaHei, sans-serif" font-size="19">${product.styleCode} · ${product.englishName}</text>`).join('');
const contactSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="875"><rect width="1320" height="875" fill="#0D0D0F"/><text x="32" y="45" fill="#EEE9DF" font-family="Microsoft YaHei, sans-serif" font-size="28">MOVERNO · 裤装主视觉与品牌触点核对</text>${contactLabels}</svg>`);
await sharp(contactSvg).composite(contactTiles).png().toFile(path.join(base, 'qa-branding-contact.png'));

const motifBytes = await fs.readFile(branding.motifPath);
const report = {
  stage: 'pilot-asset-layout-and-copy-check',
  generatedAt: new Date().toISOString(),
  count: records.length,
  passed: records.every(record => record.pass),
  motifSha256: sha(motifBytes),
  records,
  limits: 'Automated checks validate assets, dimensions and copy. Visual fidelity is reviewed separately; this is not factory approval.'
};
await fs.writeFile(path.join(base, 'qa-report.json'), JSON.stringify(report, null, 2));
const manifest = {
  collection: 'MOVERNO SS27 Pants Product Details Pilot',
  generatedAt: report.generatedAt,
  status: report.passed ? 'pilot_for_user_review' : 'qa_failed',
  generationMode: promptData.mode,
  textAndBranding: 'Deterministic self-contained SVG composition',
  motifMaster: {
    file: branding.motifPath,
    sha256: report.motifSha256
  },
  products: records.map(record => ({
    id: record.id,
    styleCode: record.styleCode,
    sourceSha256: record.sourceSha256,
    heroSha256: record.heroSha256,
    posterSha256: record.posterSha256,
    dimensions: record.dimensions,
    slices: record.slices,
    prompt: promptData.prompts.find(prompt => prompt.id === record.id)?.prompt || null,
    qaPass: record.pass
  }))
};
await fs.writeFile(path.join(base, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({count: report.count, passed: report.passed, sliceCount: records.reduce((sum, record) => sum + record.slices.length, 0), failed: records.filter(record => !record.pass).map(record => record.id), motifSha256: report.motifSha256}, null, 2));
