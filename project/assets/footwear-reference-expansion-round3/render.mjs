import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.dirname(fileURLToPath(import.meta.url));
const previousRoot = path.resolve(root,'../footwear-reference-reset-round2');
const items = JSON.parse(await fs.readFile(path.join(root,'selected-assets.json'),'utf8'));
const previous = JSON.parse(await fs.readFile(path.join(previousRoot,'selected-assets.json'),'utf8'));
for (const d of ['boards','editable']) await fs.mkdir(path.join(root,d),{recursive:true});
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const uri = b => 'data:image/png;base64,'+b.toString('base64');
const imageUri = async p => uri((await sharp(p).metadata()).format==='png' ? await fs.readFile(p) : await sharp(p).png().toBuffer());
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
  p.imageData=await imageUri(path.join(root,p.master));
  let body=img(wordmark,72,60,385,64)+img(emblem,1430,58,42,78);
  body+=txt('FOOTWEAR EXPANSION / 2026.09',73,171,20,'#6b675f','letter-spacing="2"');
  body+=txt(p.id,1350,224,42,'#191918','font-family="Consolas,monospace"');
  body+=txt(p.name,70,268,54)+txt(p.category,72,318,25,'#6b675f');
  body+=rule(72,350,1456)+img(p.imageData,48,378,1504,1003);
  body+=txt(p.materials+' / 材质配色提案',72,1428,24,'#6b675f')+rule(72,1465,1456);
  body+=txt('官方参考 / 仅用于内部款式比较',72,1513,23,'#6b675f');
  const src=await imageUri(path.join(root,p.refFile));
  body+=`<rect x="72" y="1536" width="390" height="239" fill="#fff"/>`;
  body+=img(src,80,1543,374,225)+lines(p.refLabel,72,1807,21,53,31,'#6b675f');
  body+=txt('MOVERNO / 本轮设计',670,1513,23,'#6b675f');
  body+=lines(p.brand,670,1572,28,29,43);
  body+=lines(p.statement,670,1698,31,27,46);
  body+=rule(72,1850,1456);
  body+=txt('待审核概念 · 鞋上标识为效果模拟；标准矢量、结构和材料待打样校准。',72,1903,22,'#6b675f');
  body+=txt('扩展鞋型 / 前批未自动采纳 / 不沿用已否决的 N01—N06',72,1949,21,'#6b675f');
  await output(p.id+'-board',svg(1600,2000,body),'boards');
}
let body=img(wordmark,72,62,480,80)+txt('新增六款 / 待审概念',2470,120,42);
body+=txt('R07—R12 · 宽扣玛丽珍 / 链纹一脚蹬 / 运动凉鞋 / 切尔西靴 / 宽带运动鞋 / 软筒运动靴',75,209,31,'#6b675f');
body+=rule(72,256,3156);
for(const [i,p] of items.entries()) {
  const x=72+(i%3)*1080,y=299+Math.floor(i/3)*952;
  body+=img(p.imageData,x,y,996,664);
  body+=txt(p.id,x,y+723,35,'#6b675f','font-family="Consolas,monospace"')+txt(p.name,x+100,y+723,40);
  body+=txt(p.category,x,y+780,28,'#6b675f');
  body+=lines(p.statement,x,y+835,29,33,43);
}
body+=rule(72,2250,3156)+txt('官方参考与排重记录见审款板及研究文件。材质为提案；标识为效果模拟，不作未经测试的功能承诺。',76,2314,27,'#6b675f');
await output('overview-R07-R12',svg(3300,2400,body));

// Combined overview embeds earlier selected image bytes; does not modify earlier assets or approval state.
for (const p of previous) p.imageData=await imageUri(path.join(previousRoot,p.master));
let all=img(wordmark,72,62,480,80)+txt('参考系列 / 12 款待审概念',2740,120,42);
all+=txt('上排与中排左侧 R01—R06 为前批；R07—R12 为本轮扩展。排列不代表采纳或优先级。',75,209,31,'#6b675f');
all+=rule(72,256,4256);
for(const [i,p] of [...previous,...items].entries()) {
  const x=72+(i%4)*1080,y=299+Math.floor(i/4)*874;
  all+=img(p.imageData,x,y,996,664);
  all+=txt(p.id,x,y+724,34,'#6b675f','font-family="Consolas,monospace"')+txt(p.name,x+100,y+724,37);
  all+=txt(i<6?'前批 · 待审核':'本轮新增 · 待审核',x,y+779,27,'#6b675f');
}
all+=rule(72,2930,4256)+txt('旧文件完整保留。所有图像为设计概念，非实拍或技术包；标准品牌资产与量产结构需进一步校准。',76,2995,28,'#6b675f');
await output('overview-R01-R12',svg(4400,3070,all));
const cards=items.map(p=>`<article id="${p.id}"><a href="boards/${p.id}-board.png"><img src="boards/${p.id}-board.png" alt="${esc(p.id+' '+p.name+' 参考对照审款板')}" width="1600" height="2000" loading="lazy"></a><h2>${esc(p.id+' '+p.name)}</h2><p>${esc(p.statement)}</p><p class="compare">${esc(p.difference)}</p><a href="${p.master}">独立主图</a> · <a href="editable/${p.id}-board.svg">可编辑排版</a> · <a href="${esc(p.refUrl)}" target="_blank" rel="noopener noreferrer">官方参考来源</a></article>`).join('');
await fs.writeFile(path.join(root,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO · R07—R12 扩展审款</title><style>body{margin:0;background:#f3f2ee;color:#191918;font:16px/1.75 'Microsoft YaHei',sans-serif}main{max-width:1440px;margin:auto;padding:48px 24px 80px}header{max-width:1100px;margin-bottom:40px}header img{width:300px;max-width:70%;height:auto}h1{font-weight:500;font-size:32px;margin:30px 0 12px}p{color:#625f58}a{color:inherit;text-underline-offset:5px}nav{display:flex;gap:20px;flex-wrap:wrap;margin:24px 0}img{display:block;width:100%;height:auto}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:44px 28px;margin-top:48px}article h2{font-size:20px;font-weight:500}article p{max-width:42em}.compare{font-size:14px}details{margin-top:48px;border:1px solid #bbb8ae;padding:20px}summary{cursor:pointer}details img{margin-top:24px}footer{margin-top:56px;border-top:1px solid #bbb8ae;padding-top:28px}@media(max-width:700px){.grid{grid-template-columns:1fr}h1{font-size:27px}}</style><main><header><img src="${wordmark}" alt="MOVERNO"><h1>继续扩充，新增 R07—R12 六款</h1><p>本轮拉开开口、系合方式和筒高，覆盖玛丽珍、一脚蹬、露趾凉鞋、切尔西靴、宽带运动鞋和软筒运动靴。六张官方参考图已经实际查看；相关品牌只提供款式研究，不是 MOVERNO 合作或背书。</p><p>“继续”不等于自动采纳前批。R01—R12 均保留待审状态，N01—N06 不作为设计输入。这批是主图与参考对照审款板，不是多视角产品详情页。</p><nav><a href="overview-R07-R12.png">本轮高清总览</a><a href="overview-R01-R12.png">12 款合并总览</a><a href="REFERENCE-MAP.md">参考映射与排重</a><a href="QA.md">复核与待验证项</a><a href="prompts.json">生成提示词</a></nav></header><a href="overview-R07-R12.png"><img src="overview-R07-R12.png" width="3300" height="2400" alt="MOVERNO R07至R12六款总览"></a><section class="grid">${cards}</section><details><summary>展开 R01—R12 合并总览（前六款仍待审）</summary><a href="overview-R01-R12.png"><img src="overview-R01-R12.png" width="4400" height="3070" loading="lazy" alt="12款参考系列合并总览"></a></details><footer>ImageGen 制作；StyTrix 仅采用参考拆解与复核流程，没有付费调用。主图是生成概念，不是实拍、功能测试或生产技术包。<p>标准标识需在量产前回套矢量。结构、连接、材料和性能待打样；官图仅用于内部评审，公开宣传请使用自有产品资产。</p><a href="verification.json">文件核验</a> · <a href="selected-assets.json">图片溯源</a> · <a href="research/JAPAN-KOREA.md">日、韩来源核验记录</a></footer></main></html>`);
console.log(JSON.stringify({boards:items.length,boardSize:[1600,2000],overviewSize:[3300,2400],combinedSize:[4400,3070],gallery:'index.html'},null,2));
