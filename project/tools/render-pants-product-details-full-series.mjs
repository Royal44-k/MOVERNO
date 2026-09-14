import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const base = path.resolve(process.argv[2] || 'D:/Codex-chat/night-veil-brand/assets/ss27-pants-product-details-full-series');
const generatedRoot = path.join(base, 'generated');
const data = JSON.parse(await fs.readFile(path.join(base, 'products.json'), 'utf8'));
const branding = JSON.parse(await fs.readFile(path.join(base, 'branding.json'), 'utf8'));

const W = 1080;
const HEIGHTS = {
  opening: 1050,
  silhouette: 850,
  innovation: 850,
  maleFit: 950,
  femaleFit: 950,
  identityInTouchpoint: 750,
  materialAndCTA: 1100,
};
const H = Object.values(HEIGHTS).reduce((a, b) => a + b, 0);
const REQUIRED = ['hero.png', 'silhouette-study.png', 'innovation-atlas.png', 'material-brand-atlas.png', 'male-fit.png', 'female-fit.png'];

const THEMES = {
  FLUID_EDITORIAL: { paper: '#E8E3D9', dark: '#0D0D0F', mid: '#25262A', accent: '#9A845A', mood: '柔性防护' },
  TOWER_TECH: { paper: '#E5E2DB', dark: '#111113', mid: '#292A2D', accent: '#73777A', mood: '真实身体' },
  MINERAL_ATELIER: { paper: '#E2DDD3', dark: '#121113', mid: '#302D2C', accent: '#8A7765', mood: '耐久不规则' },
  APERTURE_UTILITY: { paper: '#E4E0D7', dark: '#0E0F10', mid: '#2B2D2B', accent: '#777865', mood: '安静反叛' },
  COLOR_LAB_COMPARE: { paper: '#E7E8E8', dark: '#0C1016', mid: '#202833', accent: '#778EA6', mood: '暗色实验' },
};

const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const text = (value, x, y, size = 24, fill = '#0D0D0F', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;
const rect = (x, y, width, height, fill, extra = '') => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke = '#9A845A', width = 1, extra = '') => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const wrap = (value, max = 18) => {
  const chars = Array.from(String(value));
  const rows = [];
  while (chars.length) rows.push(chars.splice(0, max).join(''));
  return rows;
};
const multi = (lines, x, y, size, fill, step, extra = '') => lines.map((v, i) => text(v, x, y + i * step, size, fill, extra)).join('');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();

function imageHref(bytes) {
  return `data:image/png;base64,${bytes.toString('base64')}`;
}

function useImage(id, meta, href, x, y, width, height, fit = 'xMidYMid slice') {
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${meta.width} ${meta.height}" preserveAspectRatio="${fit}" overflow="hidden"><image width="${meta.width}" height="${meta.height}" href="${href}"/></svg>`;
}

function sectionKicker(label, y, theme, dark = false) {
  const color = dark ? '#C6C1B8' : '#67645F';
  return text(label, 64, y + 66, 15, color, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="2.2"') + line(64, y + 88, 1016, y + 88, theme.accent, 1);
}

function opening(product, theme, image, index) {
  const reverse = index % 2 === 1;
  const imageX = reverse ? 0 : 380;
  const textX = reverse ? 620 : 64;
  let s = rect(0, 0, W, HEIGHTS.opening, theme.dark);
  s += useImage('hero', image.meta, image.href, imageX, 0, 700, HEIGHTS.opening);
  const gx1 = reverse ? 550 : 0;
  const gx2 = reverse ? 1080 : 650;
  s += `<defs><linearGradient id="fade-${product.styleCode}" x1="${reverse ? 1 : 0}" x2="${reverse ? 0 : 1}"><stop offset="0" stop-color="${theme.dark}"/><stop offset="0.7" stop-color="${theme.dark}" stop-opacity="0.96"/><stop offset="1" stop-color="${theme.dark}" stop-opacity="0"/></linearGradient></defs>`;
  s += rect(gx1, 0, gx2 - gx1, HEIGHTS.opening, `url(#fade-${product.styleCode})`);
  s += text('MOVERNO', textX, 72, 38, '#F1EEE8', 'font-family="Times New Roman, serif" letter-spacing="5"');
  s += text(`${product.styleCode} / SS27 PANTS`, textX, 120, 15, theme.accent, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="2"');
  s += text(product.displayNameZh, textX, 255, 54, '#F5F1EA', 'font-weight="700"');
  s += text(product.displayNameEn, textX, 306, 18, '#C5C0B7', 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="2.2"');
  s += multi(wrap(product.salesProof, 15), textX, 402, 27, '#E3DED5', 43, 'font-weight="600"');
  s += line(textX, 540, textX + 250, 540, theme.accent, 2);
  s += text(`${theme.mood} / ${product.chapter.replaceAll('_', ' ')}`, textX, 580, 15, '#AAA59D', 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1.4"');
  s += text(`¥${product.targetPrice}`, textX, 700, 40, '#F4F0E7', 'font-family="Bahnschrift, Arial, sans-serif" font-weight="600"');
  s += text(product.colorName, textX, 744, 18, '#B6B0A6');
  s += text('概念视觉 / 非实物摄影', textX, 984, 16, '#85817A');
  return s;
}

function silhouette(product, theme, image, y, index) {
  let s = rect(0, y, W, HEIGHTS.silhouette, theme.paper);
  s += sectionKicker('01 / SILHOUETTE SYSTEM', y, theme);
  const left = index % 2 === 0;
  const ix = left ? 64 : 456;
  s += useImage('silhouette', image.meta, image.href, ix, y + 125, 560, 610, 'xMidYMid contain');
  const tx = left ? 664 : 64;
  s += text('轮廓不是放大，', tx, y + 175, 34, theme.dark, 'font-weight="700"');
  s += text('是重新分配身体空间。', tx, y + 222, 34, theme.dark, 'font-weight="700"');
  s += multi(wrap(product.silhouette, 14), tx, y + 310, 24, '#4D4A46', 38);
  s += text('FABRIC', tx, y + 480, 14, theme.accent, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="2"');
  s += multi(wrap(product.fabric, 15), tx, y + 525, 22, theme.dark, 34);
  s += text(`COLOR  ${product.colorName}`, tx, y + 676, 16, '#77726A', 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1.2"');
  return s;
}

function innovation(product, theme, image, y) {
  let s = rect(0, y, W, HEIGHTS.innovation, theme.mid);
  s += useImage('innovation', image.meta, image.href, 0, y + 105, W, 610, 'xMidYMid slice');
  s += rect(0, y + 105, W, 610, theme.dark, 'opacity="0.12"');
  s += sectionKicker('02 / CONSTRUCTION IN MOTION', y, theme, true);
  s += rect(54, y + 620, 972, 170, theme.dark, 'opacity="0.9" rx="3"');
  s += text('创新不是堆叠，', 84, y + 672, 28, '#F2EEE7', 'font-weight="700"');
  s += text(product.innovationFocus, 84, y + 716, 21, '#C9C3B9');
  s += text(product.motifRule.replaceAll('_', ' ').toUpperCase(), 84, y + 760, 13, theme.accent, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1.5"');
  return s;
}

function modelSection(product, theme, image, y, gender, index) {
  const isMale = gender === 'MALE';
  const placeLeft = (index + (isMale ? 0 : 1)) % 2 === 0;
  const bg = isMale ? theme.dark : theme.paper;
  const fg = isMale ? '#F2EEE7' : theme.dark;
  const muted = isMale ? '#AAA59D' : '#69655F';
  const ix = placeLeft ? 0 : 430;
  const tx = placeLeft ? 700 : 64;
  let s = rect(0, y, W, HEIGHTS[isMale ? 'maleFit' : 'femaleFit'], bg);
  s += useImage(gender.toLowerCase(), image.meta, image.href, ix, y, 650, 950, 'xMidYMid slice');
  if (placeLeft) s += `<defs><linearGradient id="modelFade-${product.styleCode}-${gender}" x1="0" x2="1"><stop offset="0.55" stop-color="${bg}" stop-opacity="0"/><stop offset="1" stop-color="${bg}"/></linearGradient></defs>` + rect(420, y, 260, 950, `url(#modelFade-${product.styleCode}-${gender})`);
  else s += `<defs><linearGradient id="modelFade-${product.styleCode}-${gender}" x1="1" x2="0"><stop offset="0.55" stop-color="${bg}" stop-opacity="0"/><stop offset="1" stop-color="${bg}"/></linearGradient></defs>` + rect(400, y, 260, 950, `url(#modelFade-${product.styleCode}-${gender})`);
  s += text(isMale ? '03 / BODY IN MOTION — M' : '04 / BODY IN MOTION — W', tx, y + 82, 14, theme.accent, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1.8"');
  s += text(isMale ? '同一造型基准，' : '不同身体，', tx, y + 190, 35, fg, 'font-weight="700"');
  s += text(isMale ? '看见裤型差异。' : '同一设计语言。', tx, y + 238, 35, fg, 'font-weight="700"');
  s += multi(wrap(isMale ? product.maleFitDirection : product.femaleFitDirection, 13), tx, y + 330, 22, muted, 36);
  s += line(tx, y + 500, tx + 250, y + 500, theme.accent, 2);
  s += multi(wrap(product.salesProof, 13), tx, y + 552, 24, fg, 39, 'font-weight="600"');
  s += text('TOP / LOCKED MOVERNO OVERSIZE TEE', tx, y + 790, 13, muted, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1"');
  s += text('SHOES / LOCKED MOVERNO HIGH-TOP', tx, y + 824, 13, muted, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1"');
  return s;
}

function identity(product, theme, image, y) {
  let s = rect(0, y, W, HEIGHTS.identityInTouchpoint, '#F1EEE7');
  s += sectionKicker('05 / IDENTITY IN TOUCHPOINTS', y, theme);
  s += useImage('identity', image.meta, image.href, 460, y + 120, 556, 540, 'xMidYMid slice');
  s += text('身份藏在触点里', 64, y + 180, 36, theme.dark, 'font-weight="700"');
  s += multi(wrap(product.brandPlacement, 13), 64, y + 250, 24, '#4B4844', 38);
  s += line(64, y + 385, 360, y + 385, theme.accent, 2);
  s += text('MV RELAY', 64, y + 430, 15, theme.dark, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="2"');
  s += text('只进入纽扣、拉链与小牌。', 64, y + 472, 20, '#68645E');
  s += text('VEIL GATE', 64, y + 535, 15, theme.dark, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="2"');
  s += text('远看克制，近看才被发现。', 64, y + 577, 20, '#68645E');
  s += text(product.brandTechnique.replaceAll('_', ' ').toUpperCase(), 64, y + 655, 13, theme.accent, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1.5"');
  return s;
}

function materialAndCTA(product, theme, y, index) {
  let s = rect(0, y, W, HEIGHTS.materialAndCTA, theme.dark);
  s += sectionKicker('06 / MATERIAL, COLOR & RELEASE', y, theme, true);
  s += text(product.fabric, 64, y + 175, 33, '#F2EEE7', 'font-weight="700"');
  s += text(product.colorName, 64, y + 230, 21, '#B8B2AA');
  s += rect(64, y + 285, 420, 72, product.colorHex, `stroke="${theme.accent}" stroke-width="1"`);
  s += text(product.colorHex, 510, y + 330, 17, '#AAA49B', 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1.5"');
  s += text('WHY IT EARNS ITS PLACE', 64, y + 450, 15, theme.accent, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="2"');
  s += multi(wrap(product.salesProof, 21), 64, y + 515, 27, '#EAE5DC', 43, 'font-weight="600"');
  s += rect(64, y + 660, 952, 1, theme.accent);
  s += text(branding.mission, 64, y + 750, 36, '#F1EDE6', 'font-weight="700"');
  s += text(branding.belief, 64, y + 806, 20, theme.accent, 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1.1"');
  s += text(branding.productSlogan, 64, y + 858, 19, '#A9A39A');
  s += text(`¥${product.targetPrice}`, 1016, y + 758, 42, '#F2EEE7', 'font-family="Bahnschrift, Arial, sans-serif" font-weight="700" text-anchor="end"');
  s += text('加入 SS27 候补 / JOIN THE WAITLIST', 1016, y + 820, 15, '#C4BEB4', 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="1.4" text-anchor="end"');
  s += rect(64, y + 930, 952, 76, index % 2 ? theme.accent : 'none', `stroke="${theme.accent}" stroke-width="1"`);
  s += text('MOVE DARK. STAY SOFT.', 540, y + 978, 18, index % 2 ? theme.dark : '#F1EDE6', 'font-family="Bahnschrift, Arial, sans-serif" letter-spacing="2.4" text-anchor="middle"');
  s += text('概念渲染，非实物拍摄；版型、颜色、纹样、面料与五金以最终封样为准。', 64, y + 1060, 16, '#77736D');
  return s;
}

async function readAsset(styleCode, name) {
  const file = path.join(generatedRoot, styleCode, name);
  const bytes = await fs.readFile(file);
  const meta = await sharp(bytes).metadata();
  return { file, bytes, meta, href: imageHref(bytes), sha256: sha(bytes) };
}

async function renderProduct(product, index) {
  const theme = THEMES[product.layoutFamily];
  if (!theme) throw new Error(`Missing theme: ${product.layoutFamily}`);
  const assets = {};
  for (const name of REQUIRED) assets[name] = await readAsset(product.styleCode, name);

  const imageFor = {
    opening: assets['hero.png'],
    silhouette: assets['silhouette-study.png'],
    innovation: assets['innovation-atlas.png'],
    maleFit: assets['male-fit.png'],
    femaleFit: assets['female-fit.png'],
    identityInTouchpoint: assets['material-brand-atlas.png'],
  };

  let y = 0;
  let body = '';
  const sectionMap = [];
  for (const section of product.sectionOrder) {
    const top = y;
    if (section === 'opening') body += opening(product, theme, imageFor.opening, index);
    if (section === 'silhouette') body += silhouette(product, theme, imageFor.silhouette, y, index);
    if (section === 'innovation') body += innovation(product, theme, imageFor.innovation, y);
    if (section === 'maleFit') body += modelSection(product, theme, imageFor.maleFit, y, 'MALE', index);
    if (section === 'femaleFit') body += modelSection(product, theme, imageFor.femaleFit, y, 'FEMALE', index);
    if (section === 'identityInTouchpoint') body += identity(product, theme, imageFor.identityInTouchpoint, y);
    if (section === 'materialAndCTA') body += materialAndCTA(product, theme, y, index);
    y += HEIGHTS[section];
    sectionMap.push({ name: section, top, height: HEIGHTS[section] });
  }
  if (y !== H) throw new Error(`${product.styleCode}: height mismatch ${y}`);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><g font-family="Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif">${body}</g></svg>`;
  const slug = product.slug;
  const svgPath = path.join(base, 'editable', `${slug}-details.svg`);
  const posterPath = path.join(base, 'posters', `${slug}-details.png`);
  const previewPath = path.join(base, 'previews', `${product.styleCode.toLowerCase()}-preview.png`);
  const mobilePath = path.join(base, 'mobile', `${product.styleCode.toLowerCase()}-375w.png`);
  await fs.writeFile(svgPath, svg);
  await sharp(Buffer.from(svg), { limitInputPixels: false }).png({ compressionLevel: 8 }).toFile(posterPath);
  await sharp(posterPath).resize({ width: 360 }).png({ compressionLevel: 8 }).toFile(previewPath);
  await sharp(posterPath).resize({ width: 375 }).png({ compressionLevel: 8 }).toFile(mobilePath);

  const sliceDir = path.join(base, 'slices', product.styleCode);
  await fs.mkdir(sliceDir, { recursive: true });
  for (const [sliceIndex, section] of sectionMap.entries()) {
    const file = path.join(sliceDir, `${String(sliceIndex + 1).padStart(2, '0')}-${section.name}.png`);
    await sharp(posterPath).extract({ left: 0, top: section.top, width: W, height: section.height }).png({ compressionLevel: 8 }).toFile(file);
  }

  const posterBytes = await fs.readFile(posterPath);
  return {
    styleCode: product.styleCode,
    slug,
    poster: path.relative(base, posterPath).replaceAll('\\', '/'),
    svg: path.relative(base, svgPath).replaceAll('\\', '/'),
    preview: path.relative(base, previewPath).replaceAll('\\', '/'),
    mobile: path.relative(base, mobilePath).replaceAll('\\', '/'),
    dimensions: [W, H],
    posterSha256: sha(posterBytes),
    sectionMap,
    assetSha256: Object.fromEntries(Object.entries(assets).map(([name, asset]) => [name, asset.sha256])),
  };
}

async function renderOverview(records) {
  const columns = 5;
  const tileW = 240;
  const gap = 20;
  const x0 = 30;
  const y0 = 110;
  const thumbW = 220;
  const thumbH = 320;
  const rows = Math.ceil(records.length / columns);
  const canvasW = x0 * 2 + columns * tileW + (columns - 1) * gap;
  const canvasH = y0 + rows * 390 + 40;
  const composites = [];
  let labels = text('MOVERNO SS27 · PANTS PRODUCT DETAIL SERIES', 30, 48, 28, '#EEE9DF', 'font-family="Bahnschrift, Arial" letter-spacing="1.2"');
  labels += text('15 款 / 男女试穿 / 每页六张图零重复', 30, 78, 17, '#9A845A');
  for (const [i, record] of records.entries()) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = x0 + col * (tileW + gap);
    const y = y0 + row * 390;
    const thumb = await sharp(path.join(base, record.poster)).extract({ left: 0, top: 0, width: W, height: 1800 }).resize({ width: thumbW, height: thumbH, fit: 'cover' }).png().toBuffer();
    composites.push({ input: thumb, left: x, top: y });
    labels += text(record.styleCode, x, y + 350, 19, '#EEE9DF', 'font-family="Bahnschrift, Arial" letter-spacing="1.2"');
  }
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}"><rect width="100%" height="100%" fill="#0D0D0F"/><g font-family="Microsoft YaHei, Arial">${labels}</g></svg>`);
  await sharp(bg).composite(composites).png().toFile(path.join(base, 'overview.png'));
}

async function renderIndex(records) {
  const cards = records.map(record => {
    const p = data.products.find(x => x.styleCode === record.styleCode);
    return `<article data-chapter="${esc(p.chapter)}"><a href="${esc(record.poster)}"><img src="${esc(record.preview)}" alt="${esc(p.displayNameZh)}"></a><div><small>${esc(p.styleCode)} · ${esc(p.chapter)}</small><h2>${esc(p.displayNameZh)}</h2><p>${esc(p.displayNameEn)} · ${esc(p.colorName)} · ¥${p.targetPrice}</p><nav><a href="${esc(record.poster)}">长图 PNG</a><a href="${esc(record.svg)}">可编辑 SVG</a><a href="${esc(record.mobile)}">375px 预览</a></nav></div></article>`;
  }).join('');
  const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO SS27 裤装详情全系列</title><style>*{box-sizing:border-box}body{margin:0;background:#0d0d0f;color:#eee9df;font-family:"Microsoft YaHei",sans-serif}header,main,footer{max-width:1480px;margin:auto}header{padding:64px 30px 42px;border-bottom:1px solid #50493c}small,p{color:#aaa49a}h1{font-size:46px;line-height:1.25;margin:.35em 0}main{padding:44px 30px 80px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:42px 28px}article{border-top:2px solid #9a845a;padding-top:16px}article img{width:100%;display:block;background:#24262a}article h2{margin:.45em 0 .2em}article>div{padding:14px 2px}nav{display:flex;gap:16px;flex-wrap:wrap}a{color:inherit;text-underline-offset:5px}footer{padding:0 30px 60px}@media(max-width:900px){main{grid-template-columns:1fr}h1{font-size:36px}}</style><header><small>MOVERNO / SS27 / PANTS</small><h1>让黑夜不必黯然，<br>让差异不必喧哗。</h1><p>15 款裤装详情长图，含无蓝主线与 3 款蓝色实验对照；上衣与鞋款固定，模特按章节轮换。</p></header><main>${cards}</main><footer><p>概念渲染，非实物拍摄。最终版型、颜色、纹样、面料与五金以封样为准。</p></footer></html>`;
  await fs.writeFile(path.join(base, 'index.html'), html);
}

for (const dir of ['editable', 'posters', 'previews', 'mobile', 'slices']) await fs.mkdir(path.join(base, dir), { recursive: true });

const records = [];
for (const [index, product] of data.products.entries()) {
  const record = await renderProduct(product, index);
  records.push(record);
  console.log(`${product.styleCode} -> ${record.poster}`);
}

await renderOverview(records);
await renderIndex(records);

const manifest = {
  collection: data.collection,
  generatedAt: new Date().toISOString(),
  status: 'concept_details_for_user_review',
  disclaimer: 'Concept renders only; final product follows approved physical samples and production files.',
  motifMaster: { path: branding.v2Path, sha256: branding.v2Sha256 },
  products: records,
};
await fs.writeFile(path.join(base, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ count: records.length, posters: records.length, slices: records.length * 7, dimensions: [W, H] }));
