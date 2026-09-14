import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.dirname(fileURLToPath(import.meta.url));
const items=JSON.parse(await fs.readFile(path.join(root,'selected-assets.json'),'utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const uri=b=>'data:image/png;base64,'+b.toString('base64');
const imageUri=async p=>uri(await fs.readFile(p));
const wordmark=uri(await sharp(path.join(root,'../logo-direction-01/png/moverno-primary-wordmark@4x.png')).trim().png().toBuffer());
const emblem=uri(await sharp(path.join(root,'../logo-direction-01/png/moverno-standalone-emblem@4x.png')).trim().png().toBuffer());
const txt=(s,x,y,z=28,color='#191918',extra='')=>`<text x="${x}" y="${y}" font-size="${z}" fill="${color}" ${extra}>${esc(s)}</text>`;
function wrap(s,n){let out=[],line='',size=0;for(const c of s){const w=/[\x00-\x7f]/.test(c)?.55:1;if(size+w>n&&!/[，。；：、]/.test(c)){out.push(line);line='';size=0;}line+=c;size+=w;}if(line)out.push(line);return out;}
const lines=(s,x,y,z,n,step=z*1.5,color='#191918')=>wrap(s,n).map((l,i)=>txt(l,x,y+i*step,z,color)).join('');
const img=(src,x,y,w,h)=>`<image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const line=(x,y,w)=>`<path d="M${x} ${y}h${w}" stroke="#bfbbae" stroke-width="1.5"/>`;
const svg=(w,h,b)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#f3f2ee"/><g font-family="Microsoft YaHei,Arial,sans-serif">${b}</g></svg>`;
async function output(name,markup,dir=''){await fs.writeFile(path.join(root,'editable',name+'.svg'),markup);await sharp(Buffer.from(markup)).png().toFile(path.join(root,dir,name+'.png'));}
for(const p of items){
  p.imageData=await imageUri(path.join(root,p.master));
  let b=img(wordmark,72,60,385,64)+img(emblem,1430,58,42,78);
  b+=txt('DIRECT REFERENCE SERIES / 2026.09',73,171,20,'#716b60','letter-spacing="1.6"');
  b+=txt(p.id,1350,224,42,'#191918','font-family="Consolas,monospace"')+txt(p.name,70,268,54);
  b+=txt(p.category+'  ·  直接依据：'+p.refs.map(n=>'图 '+n).join(' / '),72,318,25,'#716b60');
  b+=line(72,350,1456)+img(p.imageData,48,378,1504,1003);
  b+=txt(p.materials+' / 材质配色提案',72,1428,24,'#716b60')+line(72,1465,1456);
  b+=txt('你的原参考 / 鞋型直接依据',72,1513,23,'#716b60');
  const tw=Math.min(318,(700-(p.refs.length-1)*16)/p.refs.length);
  for(const [i,n] of p.refs.entries()){
    const x=72+i*(tw+16),source=await imageUri(path.join(root,'references',`user-${String(n).padStart(2,'0')}.png`));
    b+=`<rect x="${x}" y="1536" width="${tw}" height="239" fill="#fff"/>`+img(source,x+6,1542,tw-12,227)+txt('图 '+n,x,1806,22,'#716b60');
  }
  b+=txt('MOVERNO / 局部转化',830,1513,23,'#716b60');
  b+=lines(p.brand,830,1568,28,23,42)+lines(p.statement,830,1693,30,22,45);
  b+=line(72,1850,1456)+txt('待审概念 · 非实拍；鞋上标识需回套标准矢量，结构与材料留待打样。',72,1903,22,'#716b60');
  b+=txt('保留所给鞋型比例 / 不使用上一轮生成鞋款作为输入',72,1949,21,'#716b60');
  await output(p.id+'-board',svg(1600,2000,b),'boards');
}
let b=img(wordmark,72,62,480,80)+txt('11 张原图 / 8 款直参制作',3100,120,42);
b+=txt('D01—D08 · 低口绒鞋 / 绒口穆勒 / 极短筒 / 拉链高帮 / 巨厚底高帮 / 粗绳运动 / 银色跑鞋 / 链纹帆布',75,209,32,'#716b60')+line(72,256,4256);
for(const [i,p] of items.entries()){
  const x=72+(i%4)*1080,y=299+Math.floor(i/4)*952;
  b+=img(p.imageData,x,y,996,664)+txt(p.id,x,y+723,34,'#716b60','font-family="Consolas,monospace"')+txt(p.name,x+100,y+723,38);
  b+=txt('依据 '+p.refs.map(n=>'图 '+n).join(' / ')+' · '+p.category,x,y+780,27,'#716b60');
  b+=lines(p.statement,x,y+835,28,34,41);
}
b+=line(72,2250,4256)+txt('全部为本轮重新生成的待审概念。官方补充核验见研究记录；旧款文件保留，不把换色计作新款。',76,2314,28,'#716b60');
await output('overview-D01-D08',svg(4400,2400,b));
await sharp(path.join(root,'overview-D01-D08.png')).resize({width:2200}).flatten({background:'#f3f2ee'}).jpeg({quality:93,mozjpeg:true}).toFile(path.join(root,'overview-D01-D08-preview.jpg'));
const cards=items.map(p=>`<article id="${p.id}"><a href="boards/${p.id}-board.png"><img src="boards/${p.id}-board.png" width="1600" height="2000" loading="lazy" alt="${esc(p.id+' '+p.name+' 与用户原图对照')}"></a><h2>${esc(p.id+' '+p.name)}</h2><p>${esc(p.statement)}</p><p class="small">必须保留：${esc(p.keep.join(' '))}</p><a href="${p.master}">独立原尺寸主图</a> · <a href="editable/${p.id}-board.svg">可编辑排版</a></article>`).join('');
await fs.writeFile(path.join(root,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOVERNO · 11 张原图，8 款直参制作</title><style>body{margin:0;background:#f3f2ee;color:#191918;font:16px/1.75 'Microsoft YaHei',sans-serif}main{max-width:1440px;margin:auto;padding:48px 24px 80px}header{max-width:1150px;margin-bottom:40px}header img{width:300px;max-width:70%;height:auto}h1{font-weight:500;font-size:32px;margin:30px 0 12px}p{color:#625d53}a{color:inherit;text-underline-offset:5px}nav{display:flex;gap:20px;flex-wrap:wrap;margin:24px 0}img{display:block;width:100%;height:auto}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:44px 28px;margin-top:48px}article h2{font-size:20px;font-weight:500}.small{font-size:14px}footer{margin-top:56px;border-top:1px solid #bfbbae;padding-top:28px}@media(max-width:700px){.grid{grid-template-columns:1fr}h1{font-size:27px}}</style><main><header><img src="${wordmark}" alt="MOVERNO"><h1>11 张原图，8 款直接鞋型制作</h1><p>严格沿用你提供的低口绒鞋、绒口穆勒、极短筒、两类高帮、两类运动鞋和低帮帆布比例。图 6／7 与图 8／9 分开制作；图 2／4／5 合并为一个绒口穆勒方向，图 10／11 合并为一个纹样帆布方向。</p><p>本轮没有再加入玛丽珍、露趾凉鞋或切尔西；没有把前轮六款换色算作八款。每款下方保留你的原图作直接对照。所有 D 款为新生成、待审核概念，旧文件未覆盖。</p><nav><a href="overview-D01-D08.png">8 款高清总览</a><a href="REFERENCE-MAP.md">逐图映射与联网记录</a><a href="research/SUPPLEMENT.md">OCAI／Rick Owens 核验</a><a href="QA.md">视觉复核</a><a href="prompts.json">完整生成提示词</a></nav></header><a href="overview-D01-D08.png"><img src="overview-D01-D08-preview.jpg" width="2200" height="1200" alt="8款直接参考总览"></a><section class="grid">${cards}</section><footer>内置 ImageGen 制作。StyTrix 仅采用拆解、分项设计与复核流程，不调用付费生成、不使用 sketch。<p>本批是主图及原参考对照审款板，不是多视图详情、实拍或生产技术包。品牌标识需回套标准矢量；结构、材料及性能待打样。含他牌原参考的审款板用于内部研究，不作 MOVERNO 对外商品广告。</p><a href="selected-assets.json">图片溯源</a> · <a href="revision-prompts.json">局部修正记录</a> · <a href="verification.json">文件验证</a></footer></main></html>`);
console.log(JSON.stringify({boards:items.length,boardSize:[1600,2000],overview:[4400,2400],preview:[2200,1200],gallery:'index.html'}));
