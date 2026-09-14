import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base = path.resolve(process.argv[2] || 'D:/Codex-chat/night-veil-brand/assets/ss27-pants-product-details-pilot');
const data = JSON.parse(await fs.readFile(path.join(base, 'products.json'), 'utf8'));
const branding = JSON.parse(await fs.readFile(path.join(base, 'branding.json'), 'utf8'));

const W = 1080;
const H = 5080;
const ink = '#0D0D0F';
const graphite = '#25262A';
const paper = '#E8E3D9';
const bone = '#D9D4C8';
const muted = '#85827B';
const nickel = '#73777A';
const gold = '#9A845A';
const blood = '#5B1F25';

const themes = {
  '19': {
    value: '柔性防护 / FLEXIBLE PROTECTION',
    accent: '#9A845A',
    frame: 'M0 0H1080V1080H0Z',
    cta: '收藏流幕，让柔软成为你的外层。',
    designNote: '纵向光缝回应流体垂坠，侧链在行走中时隐时现。'
  },
  '25A': {
    value: '耐久不规则 / DURABLE IRREGULARITY',
    accent: '#77716A',
    frame: 'M0 0H1080V1080H0Z',
    cta: '收藏矿迹，把时间穿成自己的轮廓。',
    designNote: '矿物洗色承载使用痕迹，单链从清晰模块自然退入灰阶。'
  },
  '28': {
    value: '安静反叛 / QUIET REBELLION',
    accent: '#68674F',
    frame: 'M0 0H1080V1080H0Z',
    cta: '收藏幕隙，让隐藏结构在移动中出现。',
    designNote: '闭合时保持克制，拉开侧缝后才显露内部轨迹。'
  }
};

const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const text = (value, x, y, size = 24, fill = ink, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;
const rect = (x, y, width, height, fill, extra = '') => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke = '#BDB7AB', width = 1, extra = '') => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const multi = (lines, x, y, size, fill, step, extra = '') => lines.map((value, index) => text(value, x, y + index * step, size, fill, extra)).join('');
const wrap = (value, max = 18) => {
  const chars = Array.from(value);
  const rows = [];
  while (chars.length) rows.push(chars.splice(0, max).join(''));
  return rows;
};

const sizes = {};
async function imageDef(id, file) {
  const bytes = await fs.readFile(file);
  sizes[id] = await sharp(bytes).metadata();
  return `<image id="${id}" width="${sizes[id].width}" height="${sizes[id].height}" href="data:image/png;base64,${bytes.toString('base64')}"/>`;
}
const place = (id, x, y, width, height, mode = 'xMidYMid meet') => `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${sizes[id].width} ${sizes[id].height}" preserveAspectRatio="${mode}"><use href="#${id}"/></svg>`;
const crop = (id, x, y, width, height, roi, mode = 'xMidYMid slice') => `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${roi.join(' ')}" preserveAspectRatio="${mode}" overflow="hidden"><use href="#${id}"/></svg>`;

async function ensureDirs() {
  for (const name of ['editable', 'posters', 'previews']) await fs.mkdir(path.join(base, name), {recursive: true});
}

function featureRow(product) {
  return product.features.map((feature, index) => {
    const x = 64 + index * 330;
    return rect(x, 1837, 5, 27, gold) + text(feature, x + 18, 1861, 25, ink, 'font-weight="600"');
  }).join('');
}

function brandTouchpointVisual(title, x, y) {
  if (title.includes('拉链')) {
    return rect(x + 86, y + 92, 124, 116, 'url(#metal)', 'rx="18" stroke="#25262A" stroke-width="5"') + rect(x + 135, y + 55, 26, 55, 'none', 'rx="13" stroke="#73777A" stroke-width="8"') + place('mvRelay', x + 113, y + 112, 70, 70);
  }
  if (title.includes('MV RELAY') && title.includes('腰扣')) {
    return `<circle cx="${x + 148}" cy="${y + 149}" r="70" fill="url(#metal)" stroke="#25262A" stroke-width="6"/>` + place('mvRelay', x + 113, y + 112, 70, 70);
  }
  if (title.includes('MV RELAY')) {
    return rect(x + 112, y + 65, 72, 174, 'url(#metal)', 'rx="22" stroke="#25262A" stroke-width="5"') + place('mvRelay', x + 124, y + 116, 48, 48);
  }
  if (title.includes('Veil Gate') || title.includes('压印牌')) {
    return rect(x + 48, y + 82, 200, 144, '#18191B', 'rx="5"') + rect(x + 60, y + 94, 176, 120, 'none', 'stroke="#4A4A49" stroke-width="2" stroke-dasharray="7 7"') + place('gate', x + 116, y + 104, 64, 104);
  }
  if (title.includes('暗血红')) {
    return rect(x + 48, y + 82, 200, 144, '#18191B', 'rx="5"') + line(x + 98, y + 102, x + 198, y + 206, blood, 7, 'stroke-linecap="round"') + line(x + 198, y + 102, x + 98, y + 206, blood, 7, 'stroke-linecap="round"') + place('gate', x + 122, y + 118, 52, 82);
  }
  return rect(x + 34, y + 88, 228, 118, graphite, 'rx="12"') + place('wordmark', x + 68, y + 112, 160, 52);
}

function brandTouchpointCard(product, index, title, x) {
  const y = 2970;
  const card = rect(x, y, 296, 380, '#F0ECE4', 'rx="3"') + text(`0${index + 1}`, x + 22, y + 38, 15, muted, 'font-family="Bahnschrift, sans-serif" letter-spacing="2"') + text(title, x + 22, y + 332, 20, ink, 'font-weight="600"');
  return card + brandTouchpointVisual(title, x, y);
}

function productHeader(product, theme) {
  let s = rect(0, 0, W, 1080, ink);
  s += place('hero', 394, 0, 686, 1080, 'xMidYMid slice');
  s += `<defs><linearGradient id="heroFade" x1="0" x2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.46" stop-color="${ink}" stop-opacity="0.92"/><stop offset="0.76" stop-color="${ink}" stop-opacity="0.08"/><stop offset="1" stop-color="${ink}" stop-opacity="0"/></linearGradient></defs>`;
  s += rect(0, 0, 750, 1080, 'url(#heroFade)');
  s += place('wordmark', 62, 44, 260, 60);
  s += text(product.styleCode, 62, 145, 16, bone, 'font-family="Bahnschrift, sans-serif" letter-spacing="2.4"');
  s += text(product.englishName, 62, 184, 16, gold, 'font-family="Bahnschrift, sans-serif" letter-spacing="2.2"');
  s += multi(product.headline, 60, 332, 58, '#F3EFE7', 75, 'font-weight="700"');
  s += text(product.kicker, 62, 505, 17, gold, 'font-family="Bahnschrift, sans-serif" letter-spacing="1.8"');
  s += multi(product.intro, 62, 585, 26, '#BBB6AD', 43);
  s += line(62, 718, 332, 718, theme.accent, 2);
  s += text(theme.value, 62, 760, 17, '#D4CEC3', 'font-family="Bahnschrift, sans-serif" letter-spacing="1.3"');
  s += rect(62, 864, 244, 55, 'none', `stroke="${gold}" stroke-width="1"`);
  s += text('VIEW THE DETAILS', 184, 899, 15, '#EFEAE0', 'font-family="Bahnschrift, sans-serif" letter-spacing="1.8" text-anchor="middle"');
  s += text('概念视觉 / 非实物摄影', 62, 1018, 17, '#86817A');
  return s;
}

function silhouetteSection(product) {
  let s = rect(0, 1080, W, 870, paper);
  s += text('轮廓先行', 64, 1154, 37, ink, 'font-weight="700"');
  s += text('SILHOUETTE BEFORE NOISE', 1016, 1150, 15, muted, 'font-family="Bahnschrift, sans-serif" letter-spacing="1.8" text-anchor="end"');
  s += line(64, 1192, 1016, 1192, '#C8C1B5');
  s += rect(64, 1230, 952, 560, '#D2CDC4');
  const sw = sizes.source.width;
  const sh = sizes.source.height;
  s += crop('source', 78, 1244, 924, 532, [0, 0, sw * 0.78, sh], 'xMidYMid meet');
  s += rect(78, 1720, 924, 56, paper, 'opacity="0.86"');
  s += text('原概念板的正・侧・背结构作为产品视觉真值', 96, 1757, 17, ink);
  s += featureRow(product);
  s += text(product.colorway.replaceAll('_', ' '), 1016, 1920, 16, muted, 'font-family="Bahnschrift, sans-serif" letter-spacing="1.6" text-anchor="end"');
  return s;
}

function relaySection(product, theme) {
  let s = rect(0, 1950, W, 810, graphite);
  s += crop('motif', 0, 1950, 1080, 810, [205, 0, 615, 1024]);
  s += rect(0, 1950, W, 810, graphite, 'opacity="0.82"');
  s += text('单链，不是边框', 64, 2030, 38, '#F0ECE4', 'font-weight="700"');
  s += text('RELAY ANATOMY', 1016, 2026, 15, bone, 'font-family="Bahnschrift, sans-serif" letter-spacing="1.8" text-anchor="end"');
  product.details.forEach((detail, index) => {
    const x = 64 + index * 496;
    s += rect(x, 2080, 456, 392, ink, 'rx="3"');
    s += crop('source', x + 8, 2088, 440, 376, detail.roi);
    s += text(detail.title, x, 2530, 28, '#F0ECE4', 'font-weight="700"');
    s += multi(wrap(detail.body, 17), x, 2580, 24, '#BDB7AD', 37);
  });
  s += line(64, 2718, 1016, 2718, theme.accent, 2);
  s += text(theme.designNote, 64, 2745, 20, '#D8D2C8');
  return s;
}

function brandSection(product) {
  let s = rect(0, 2760, W, 750, paper);
  s += text('身份藏在触点里', 64, 2838, 37, ink, 'font-weight="700"');
  s += text('BRAND TOUCHPOINTS', 1016, 2834, 15, muted, 'font-family="Bahnschrift, sans-serif" letter-spacing="1.8" text-anchor="end"');
  s += text('Veil Gate 负责品牌第一识别；MV RELAY 只在裤装五金与小标中出现。', 64, 2890, 21, muted);
  product.brandTouchpoints.forEach((title, index) => { s += brandTouchpointCard(product, index, title, 64 + index * 330); });
  s += text('正式标识采用项目矢量资产重建，概念图中的生成符号不进入成品。', 64, 3480, 18, muted);
  return s;
}

function materialSection(product) {
  let s = rect(0, 3510, W, 790, '#F1EEE7');
  s += text('让材质替颜色说话', 64, 3590, 37, ink, 'font-weight="700"');
  s += text('MATERIAL IN MOTION', 1016, 3586, 15, muted, 'font-family="Bahnschrift, sans-serif" letter-spacing="1.8" text-anchor="end"');
  s += crop('hero', 64, 3640, 594, 474, [0, sizes.hero.height * 0.23, sizes.hero.width, sizes.hero.height * 0.58]);
  s += crop('source', 684, 3640, 332, 226, product.details[1].roi);
  s += crop('source', 684, 3888, 332, 226, product.details[0].roi);
  product.colors.forEach((color, index) => {
    const x = 64 + index * 330;
    s += rect(x, 4164, 296, 38, color);
    s += text(product.colorNames[index], x, 4242, 23, ink, 'font-weight="600"');
  });
  s += text('颜色、质感与结构为设计方向，最终以封样和材料文件为准。', 64, 4280, 18, muted);
  return s;
}

function brandClose(product, theme) {
  let s = rect(0, 4300, W, 780, ink);
  s += crop('motif', 630, 4300, 450, 780, [300, 70, 550, 900]);
  s += rect(520, 4300, 560, 780, ink, 'opacity="0.56"');
  s += place('gate', 64, 4376, 88, 144);
  s += text('让黑夜不必黯然，', 190, 4418, 34, '#F1EDE5', 'font-weight="600"');
  s += text('让差异不必喧哗。', 190, 4472, 34, '#F1EDE5', 'font-weight="600"');
  s += text('Different But Excellent.', 190, 4528, 22, gold, 'font-family="Bahnschrift, sans-serif" letter-spacing="1.1"');
  s += line(64, 4590, 540, 4590, gold, 2);
  s += text(theme.cta, 64, 4660, 34, '#F1EDE5', 'font-weight="700"');
  s += text('暗中移动，保持柔软。', 64, 4722, 23, '#B8B2A8');
  s += text('MOVE DARK. STAY SOFT.', 64, 4763, 16, '#B8B2A8', 'font-family="Bahnschrift, sans-serif" letter-spacing="1.6"');
  s += place('wordmark', 64, 4840, 250, 60);
  s += text(product.styleCode, 1016, 4882, 16, bone, 'font-family="Bahnschrift, sans-serif" letter-spacing="2" text-anchor="end"');
  s += text(product.englishName, 1016, 4918, 15, gold, 'font-family="Bahnschrift, sans-serif" letter-spacing="1.8" text-anchor="end"');
  s += text('概念渲染，非实物拍摄；版型、纹样、颜色与五金以最终封样为准。', 64, 5020, 18, '#8E8981');
  return s;
}

async function renderProduct(product) {
  if (!themes[product.id]) throw new Error(`Missing theme for ${product.id}`);
  const defs = [
    await imageDef('hero', product.hero),
    await imageDef('source', product.source),
    await imageDef('wordmark', branding.wordmarkPath),
    await imageDef('gate', branding.emblemPath),
    await imageDef('mvRelay', branding.mvRelayPath),
    await imageDef('motif', branding.motifPath)
  ].join('');
  const theme = themes[product.id];
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#242629"/><stop offset="0.48" stop-color="#8B8F91"/><stop offset="1" stop-color="#343639"/></linearGradient></defs><g font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif">`;
  svg += productHeader(product, theme);
  svg += silhouetteSection(product);
  svg += relaySection(product, theme);
  svg += brandSection(product);
  svg += materialSection(product);
  svg += brandClose(product, theme);
  svg += '</g></svg>';

  const svgPath = path.join(base, 'editable', `${product.id.toLowerCase()}-${product.slug}-detail.svg`);
  const posterPath = product.poster;
  const previewPath = path.join(base, 'previews', `${product.id.toLowerCase()}-detail-preview.png`);
  await fs.writeFile(svgPath, svg);
  await sharp(Buffer.from(svg), {limitInputPixels: false}).png({compressionLevel: 8}).toFile(posterPath);
  await sharp(posterPath).resize({width: 360}).png({compressionLevel: 8}).toFile(previewPath);
  const meta = await sharp(posterPath).metadata();
  return {id: product.id, width: meta.width, height: meta.height, poster: posterPath, svg: svgPath, preview: previewPath};
}

async function renderIndex(rendered) {
  const cards = data.products.map(product => `<article><p>${esc(product.styleCode)} · ${esc(product.colorway)}</p><h2>${esc(product.name)}</h2><a href="posters/${path.basename(product.poster)}"><img src="previews/${product.id.toLowerCase()}-detail-preview.png" alt="${esc(product.name)}产品详情预览"></a><nav><a href="posters/${path.basename(product.poster)}">原尺寸 PNG</a><a href="editable/${product.id.toLowerCase()}-${product.slug}-detail.svg">可编辑 SVG</a><a href="../ss27-pants-single-relay-round3/${path.basename(product.source)}">源概念板</a></nav></article>`).join('');
  const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO SS27 裤装产品详情试制</title><style>*{box-sizing:border-box}body{margin:0;background:#0d0d0f;color:#ece8df;font-family:"Microsoft YaHei",sans-serif}header,main,footer{max-width:1320px;margin:auto}header{padding:64px 28px 38px;border-bottom:1px solid #4b463b}small,p{color:#aaa59b}h1{font-size:42px;line-height:1.35}main{padding:42px 28px 72px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:30px}article{border-top:2px solid #9a845a;padding-top:18px}article h2{min-height:58px}img{width:100%;display:block;background:#24262a}a{color:inherit;text-underline-offset:5px}nav{display:flex;gap:16px;flex-wrap:wrap;padding-top:16px;font-size:14px}footer{padding:0 28px 60px}@media(max-width:850px){main{grid-template-columns:1fr}article h2{min-height:0}}</style><header><small>MOVERNO / SS27 / PANTS PILOT</small><h1>让黑夜不必黯然，<br>让差异不必喧哗。</h1><p>三款产品详情长图试制：主视觉、廓形、单链解剖、品牌触点、材质动态与品牌收束。文字和正式标识均采用确定性排版。</p></header><main>${cards}</main><footer><p>概念视觉，非实物摄影。最终版型、面料、颜色、纹样与五金以封样为准。</p></footer></html>`;
  await fs.writeFile(path.join(base, 'index.html'), html);

  const thumbInputs = [];
  for (const [index, product] of data.products.entries()) {
    const buffer = await sharp(product.poster).extract({left: 0, top: 0, width: W, height: 1450}).resize({width: 392, height: 526, fit: 'cover'}).png().toBuffer();
    thumbInputs.push({input: buffer, left: 32 + index * 410, top: 142});
  }
  const labels = data.products.map((product, index) => text(`${product.styleCode}  ${product.englishName}`, 32 + index * 410, 704, 18, '#ECE8DF')).join('');
  const overviewSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="760"><rect width="1320" height="760" fill="#0D0D0F"/><g font-family="Microsoft YaHei, sans-serif">${text('MOVERNO SS27 · 裤装产品详情试制', 32, 56, 34, '#ECE8DF')}${text('三款长图 / 六模块切片 / 正式品牌触点', 32, 94, 19, gold)}${labels}</g></svg>`);
  await sharp(overviewSvg).composite(thumbInputs).png().toFile(path.join(base, 'overview.png'));
  await fs.writeFile(path.join(base, 'render-report.json'), JSON.stringify(rendered, null, 2));
}

await ensureDirs();
const rendered = [];
for (const product of data.products) {
  const result = await renderProduct(product);
  rendered.push(result);
  console.log(JSON.stringify(result));
}
await renderIndex(rendered);
