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
const text = (s,x,y,size=30,color='#171717',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(s)}</text>`;
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
const lines = (s,x,y,size,limit,step=size*1.5,color='#171717') => wrap(s,limit).map((line,i)=>text(line,x,y+i*step,size,color)).join('');
const image = (src,x,y,w,h) => `<image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const rule = (x,y,w) => `<path d="M${x} ${y}h${w}" stroke="#b8b6b0" stroke-width="1.5"/>`;
const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#f2f1ed"/><g font-family="Microsoft YaHei,Arial,sans-serif">${body}</g></svg>`;
const exportSvg = async (name,markup) => {
  await fs.writeFile(path.join(root,'editable',name+'.svg'),markup);
  await sharp(Buffer.from(markup)).png().toFile(path.join(root,name.startsWith('N')?'boards':'',name+'.png'));
};
for (const [i,p] of items.entries()) {
  p.imageData=uri(await fs.readFile(path.join(root,p.master)));
  let body=image(wordmark,80,76,430,72)+image(emblem,1385,74,54,96);
  body+=text('FOOTWEAR STUDY / 2026.09',82,195,23,'#64615b','letter-spacing="3"');
  body+=text(p.id+' / 06',1256,233,36,'#171717','font-family="Consolas,monospace"');
  body+=text(p.name,80,299,62)+text(p.category,82,354,27,'#64615b');
  body+=rule(80,390,1440)+image(p.imageData,64,425,1472,981);
  body+=text(p.materials+' / 材质配色提案',82,1457,27,'#64615b')+rule(80,1500,1440);
  body+=text('01 / 造型',80,1560,23,'#64615b')+text('02 / 品牌落位',850,1560,23,'#64615b');
  body+=p.structureLines.map((s,j)=>text(s,80,1610+j*47,29)).join('');
  body+=lines(p.brand,850,1610,29,21,47);
  body+=lines(p.statement,80,1775,39,36,57);
  body+=rule(80,1885,1440)+text('概念待审 · 鞋上标识为效果模拟 · 结构与材料待打样',80,1939,23,'#64615b');
  body+=text(p.id,1430,1940,27,'#64615b','font-family="Consolas,monospace"');
  await exportSvg(p.id+'-board',svg(1600,2000,body));
}
let overview=image(wordmark,72,62,520,86)+text('六款新鞋型 / 待审核',2450,121,45);
overview+=text('N01—N06 · 复古运动 / 滑板量感 / 暗黑中帮 / 流线机能 / 赛车低帮 / 充棉短靴',76,214,32,'#64615b');
overview+=rule(72,260,3156);
for(const [i,p] of items.entries()) {
  const x=72+(i%3)*1080,y=304+Math.floor(i/3)*960;
  overview+=image(p.imageData,x,y,996,664);
  overview+=text(p.id,x,y+726,36,'#64615b','font-family="Consolas,monospace"');
  overview+=text(p.name,x+100,y+726,41);
  overview+=text(p.category,x,y+785,29,'#64615b');
  overview+=lines(p.statement,x,y+839,30,32,44);
}
overview+=rule(72,2256,3156)+text('新设计不代表已采纳。材料、连接结构与标识需继续打样校准；不作舒适、防水或保暖性能承诺。',76,2318,27,'#64615b');
await exportSvg('overview-N01-N06',svg(3300,2400,overview));
const cards=items.map(p=>`<article id="${p.id}"><a href="boards/${p.id}-board.png"><img src="boards/${p.id}-board.png" alt="${esc(p.id+' '+p.name)}" loading="lazy" width="1600" height="2000"></a><h2>${esc(p.id+' '+p.name)}</h2><p>${esc(p.statement)}</p><a href="${p.master}">查看独立主图</a> · <a href="editable/${p.id}-board.svg">可编辑设计板</a></article>`).join('');
await fs.writeFile(path.join(root,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO · N01—N06 新六款审款</title><style>body{margin:0;background:#f2f1ed;color:#171717;font:16px/1.75 'Microsoft YaHei',sans-serif}main{max-width:1440px;margin:auto;padding:48px 24px 80px}header{max-width:1000px;margin-bottom:40px}header img{width:300px;max-width:70%;height:auto}h1{font-weight:500;font-size:32px;margin:30px 0 12px}p{color:#625f58}a{color:inherit;text-underline-offset:5px}nav{display:flex;gap:20px;flex-wrap:wrap;margin:24px 0}img{display:block;width:100%;height:auto}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:44px 28px;margin-top:48px}article h2{font-size:20px;font-weight:500}article p{max-width:42em}footer{margin-top:56px;border-top:1px solid #b8b6b0;padding-top:28px}@media(max-width:700px){.grid{grid-template-columns:1fr}h1{font-size:27px}}</style><main><header><img src="${wordmark}" alt="MOVERNO"><h1>六款新鞋型，重新从鞋身开始</h1><p>放开女性化限制，面向追逐潮流的年轻人。F05—F08不作为本批基础；六款均为待审概念，并未自动采纳。</p><nav><a href="overview-N01-N06.png">六款高清总览</a><a href="DESIGN-RECORD.md">参考与排重记录</a><a href="USER-FEEDBACK.md">本轮筛选标准</a><a href="QA.md">复核与待验证项</a></nav></header><a href="overview-N01-N06.png"><img src="overview-N01-N06.png" width="3300" height="2400" alt="MOVERNO N01至N06六款对比总览"></a><section class="grid">${cards}</section><footer>内置 ImageGen 制作；StyTrix 仅采用拆解与复核流程，无付费调用。每款为完整三分之四主图，不冒充多角度实拍或生产技术包。<p>鞋上标识为效果模拟，标准矢量回套与物理打样待完成；材料配色为设计提案，未测试性能。</p><a href="prompts.json">初始提示词</a> · <a href="revision-prompts.json">两款修订提示词</a> · <a href="verification.json">文件核验</a></footer></main></html>`);
console.log(JSON.stringify({boards:6,overview:'3300×2400',gallery:'index.html',svg:7},null,2));
