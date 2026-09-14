import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.dirname(fileURLToPath(import.meta.url));
const items = JSON.parse(await fs.readFile(path.join(root,'selected-assets.json'),'utf8'));
for (const d of ['boards','editable']) await fs.mkdir(path.join(root,d),{recursive:true});
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const uri = b => 'data:image/png;base64,'+b.toString('base64');
const wordmark = uri(await sharp(path.join(root,'../logo-direction-01/png/moverno-primary-wordmark@4x.png')).trim().png().toBuffer());
const emblem = uri(await sharp(path.join(root,'../logo-direction-01/png/moverno-standalone-emblem@4x.png')).trim().png().toBuffer());
const txt = (s,x,y,size=30,color='#191918',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(s)}</text>`;
function wrap(s,limit) {
  let out=[],line='',width=0;
  for(const ch of s) {
    const w=/[\x00-\x7f]/.test(ch)?0.55:1;
    if(width+w>limit && !/[，。；：、]/.test(ch)){out.push(line);line='';width=0;}
    line+=ch;width+=w;
  }
  if(line)out.push(line);
  return out;
}
const lines = (s,x,y,size,limit,step=size*1.5,color='#191918') => wrap(s,limit).map((line,i)=>txt(line,x,y+i*step,size,color)).join('');
const img = (src,x,y,w,h) => `<image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const rule = (x,y,w) => `<path d="M${x} ${y}h${w}" stroke="#bbb8ae" stroke-width="1.5"/>`;
const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#f3f2ee"/><g font-family="Microsoft YaHei,Arial,sans-serif">${body}</g></svg>`;
async function output(name,markup,dir='') {
  await fs.writeFile(path.join(root,'editable',name+'.svg'),markup);
  await sharp(Buffer.from(markup)).png().toFile(path.join(root,dir,name+'.png'));
}
for (const p of items) {
  p.imageData=uri(await fs.readFile(path.join(root,p.master)));
  let body=img(wordmark,72,60,385,64)+img(emblem,1430,58,42,78);
  body+=txt('REFERENCE-LED FOOTWEAR / 2026.09',73,171,20,'#6b675f','letter-spacing="2"');
  body+=txt(p.id,1350,224,42,'#191918','font-family="Consolas,monospace"');
  body+=txt(p.name,70,268,54)+txt(p.category,72,318,25,'#6b675f');
  body+=rule(72,350,1456)+img(p.imageData,48,378,1504,1003);
  body+=txt(p.materials+' / 材质配色提案',72,1428,24,'#6b675f')+rule(72,1465,1456);
  body+=txt('原参考 / 用户上传，仅用于款式比较',72,1513,23,'#6b675f');
  const n=p.refs.length,thumbW=Math.min(310,(700-(n-1)*16)/n);
  for(const [j,ref] of p.refs.entries()) {
    const x=72+j*(thumbW+16),src=uri(await fs.readFile(path.join(root,'references',`user-${String(ref).padStart(2,'0')}.png`)));
    body+=`<rect x="${x}" y="1536" width="${thumbW}" height="239" fill="#fff"/>`;
    body+=img(src,x+7,1543,thumbW-14,224)+txt('图 '+ref,x,1807,22,'#6b675f');
  }
  body+=txt('MOVERNO / 本轮改动',830,1513,23,'#6b675f');
  body+=lines(p.brand,830,1565,29,23,43);
  body+=lines(p.statement,830,1680,31,21,46);
  body+=rule(72,1850,1456);
  body+=txt('待审核概念 · 鞋上标识为效果模拟；标准矢量、结构和材料待打样校准。',72,1903,22,'#6b675f');
  body+=txt('保留参考鞋型比例 / 不沿用已否决的 N01—N06',72,1949,21,'#6b675f');
  await output(p.id+'-board',svg(1600,2000,body),'boards');
}
let body=img(wordmark,72,62,480,80)+txt('六组参考 / 六款待审概念',2350,120,42);
body+=txt('R01—R06 · 低口绒鞋 / 绒口穆勒 / 极短筒 / 厚底高帮 / 粗绳运动 / 链纹帆布',75,209,31,'#6b675f');
body+=rule(72,256,3156);
for(const [i,p] of items.entries()) {
  const x=72+(i%3)*1080,y=299+Math.floor(i/3)*952;
  body+=img(p.imageData,x,y,996,664);
  body+=txt(p.id,x,y+723,35,'#6b675f','font-family="Consolas,monospace"')+txt(p.name,x+100,y+723,40);
  body+=txt(p.category,x,y+780,28,'#6b675f');
  body+=lines(p.statement,x,y+835,29,33,43);
}
body+=rule(72,2250,3156)+txt('原参考对照见各款审款板。材质配色为提案，标识为效果模拟；不作未经测试的功能承诺。',76,2314,27,'#6b675f');
await output('overview-R01-R06',svg(3300,2400,body));
const cards=items.map(p=>`<article id="${p.id}"><a href="boards/${p.id}-board.png"><img src="boards/${p.id}-board.png" alt="${esc(p.id+' '+p.name+' 原参考对照审款板')}" width="1600" height="2000" loading="lazy"></a><h2>${esc(p.id+' '+p.name)}</h2><p>${esc(p.statement)}</p><a href="${p.master}">独立主图</a> · <a href="editable/${p.id}-board.svg">可编辑排版</a></article>`).join('');
await fs.writeFile(path.join(root,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO · R01—R06 参考对照审款</title><style>body{margin:0;background:#f3f2ee;color:#191918;font:16px/1.75 'Microsoft YaHei',sans-serif}main{max-width:1440px;margin:auto;padding:48px 24px 80px}header{max-width:1100px;margin-bottom:40px}header img{width:300px;max-width:70%;height:auto}h1{font-weight:500;font-size:32px;margin:30px 0 12px}p{color:#625f58}a{color:inherit;text-underline-offset:5px}nav{display:flex;gap:20px;flex-wrap:wrap;margin:24px 0}img{display:block;width:100%;height:auto}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:44px 28px;margin-top:48px}article h2{font-size:20px;font-weight:500}article p{max-width:42em}footer{margin-top:56px;border-top:1px solid #bbb8ae;padding-top:28px}@media(max-width:700px){.grid{grid-template-columns:1fr}h1{font-size:27px}}</style><main><header><img src="${wordmark}" alt="MOVERNO"><h1>依照参考鞋型，重做六款</h1><p>11 张上传图合并为 6 组。保留鞋头体积、开口、筒高和底厚，改动集中于 MOVERNO 品牌表达。N01—N06 已整批否决，不作为本轮设计输入；本轮全部待审核。</p><nav><a href="overview-R01-R06.png">高清总览</a><a href="REFERENCE-MAP.md">逐图映射与联网记录</a><a href="QA.md">复核与待验证项</a><a href="prompts.json">完整生成提示词</a></nav></header><a href="overview-R01-R06.png"><img src="overview-R01-R06.png" width="3300" height="2400" alt="MOVERNO R01至R06六款总览"></a><section class="grid">${cards}</section><footer>内置 ImageGen 制作；StyTrix 仅采用参考拆解与复核流程，没有付费调用。主图是生成概念，不是实拍或生产技术包。<p>标准标识需在量产前回套矢量。结构、连接、材料和性能待打样；原参考中的他牌标识仅用于识别来源，不属于 MOVERNO 新款。</p><a href="verification.json">文件核验</a> · <a href="selected-assets.json">图片溯源</a></footer></main></html>`);
console.log(JSON.stringify({boards:items.length,boardSize:[1600,2000],overviewSize:[3300,2400],referenceCoverage:[...new Set(items.flatMap(p=>p.refs))].sort((a,b)=>a-b),gallery:'index.html'},null,2));
